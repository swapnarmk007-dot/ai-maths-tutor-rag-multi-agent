import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split text by code blocks first
  const renderFormattedText = (text: string) => {
    // Regex for $$...$$ (display math) and $...$ (inline math)
    // Avoid double matching $$ as two single $
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Pattern to capture $$...$$ or $...$
    const mathRegex = /(\$\$[\s\S]*?\$\$)|(\$[^\$\n]+?\$)/g;
    let match: RegExpExecArray | null;

    while ((match = mathRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const matchText = match[0];

      // Push preceding plain text / markdown
      if (matchIndex > currentIndex) {
        const plainSegment = text.slice(currentIndex, matchIndex);
        parts.push(renderMarkdownSubsegments(plainSegment, `plain-${currentIndex}`));
      }

      // Render math
      const isDisplay = matchText.startsWith('$$') && matchText.endsWith('$$');
      const formula = isDisplay
        ? matchText.slice(2, -2).trim()
        : matchText.slice(1, -1).trim();

      try {
        const html = katex.renderToString(formula, {
          displayMode: isDisplay,
          throwOnError: false,
          output: 'htmlAndMathml',
        });

        parts.push(
          <span
            key={`math-${matchIndex}`}
            className={isDisplay ? 'block my-3 overflow-x-auto text-center' : 'inline-block px-1 align-baseline'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        parts.push(
          <code key={`math-err-${matchIndex}`} className="text-amber-700 bg-amber-50 px-1 rounded text-sm">
            {matchText}
          </code>
        );
      }

      currentIndex = matchIndex + matchText.length;
    }

    // Remaining text after last math block
    if (currentIndex < text.length) {
      parts.push(renderMarkdownSubsegments(text.slice(currentIndex), `plain-${currentIndex}`));
    }

    return parts;
  };

  // Basic markdown renderer for bold, italics, bullet points, headers, and code
  const renderMarkdownSubsegments = (text: string, keyPrefix: string): React.ReactNode => {
    const lines = text.split('\n');
    return (
      <span key={keyPrefix}>
        {lines.map((line, lineIdx) => {
          // Headers
          if (line.startsWith('### ')) {
            return (
              <span key={`h3-${lineIdx}`} className="block text-base font-bold text-slate-800 mt-3 mb-1">
                {renderInlineMarkdown(line.slice(4))}
              </span>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <span key={`h2-${lineIdx}`} className="block text-lg font-bold text-slate-900 mt-4 mb-1.5 border-b border-slate-200 pb-1">
                {renderInlineMarkdown(line.slice(3))}
              </span>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <span key={`h1-${lineIdx}`} className="block text-xl font-extrabold text-slate-900 mt-4 mb-2">
                {renderInlineMarkdown(line.slice(2))}
              </span>
            );
          }

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <span key={`li-${lineIdx}`} className="flex items-start gap-2 my-1 pl-2">
                <span className="text-indigo-500 font-bold text-sm leading-6">•</span>
                <span className="flex-1 leading-relaxed text-slate-700">{renderInlineMarkdown(line.slice(2))}</span>
              </span>
            );
          }

          // Numbered list
          const numMatch = line.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <span key={`num-${lineIdx}`} className="flex items-start gap-2 my-1 pl-2">
                <span className="text-indigo-600 font-semibold text-xs leading-6 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {numMatch[1]}
                </span>
                <span className="flex-1 leading-relaxed text-slate-700">{renderInlineMarkdown(numMatch[2])}</span>
              </span>
            );
          }

          // Empty line
          if (!line.trim()) {
            return <span key={`br-${lineIdx}`} className="block h-2" />;
          }

          // Normal paragraph line
          return (
            <span key={`p-${lineIdx}`} className="inline leading-relaxed text-slate-700">
              {renderInlineMarkdown(line)}
              {lineIdx < lines.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    );
  };

  // Helper for inline markdown bold (**bold**) and inline code (`code`)
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // Split by **...** or `...`
    const regex = /(\*\*.*?\*\*)|(`.*?`)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      const matchStr = match[0];
      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        elements.push(
          <strong key={`b-${match.index}`} className="font-semibold text-slate-900">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
        elements.push(
          <code
            key={`c-${match.index}`}
            className="px-1.5 py-0.5 bg-slate-100 text-indigo-700 font-mono text-xs rounded border border-slate-200"
          >
            {matchStr.slice(1, -1)}
          </code>
        );
      }
      lastIndex = match.index + matchStr.length;
    }

    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  };

  return <div className={`math-content text-slate-800 text-sm md:text-base leading-relaxed ${className}`}>{renderFormattedText(content)}</div>;
};
