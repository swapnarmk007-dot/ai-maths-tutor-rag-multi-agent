import React, { useState } from 'react';
import { Send, Sparkles, RotateCcw, Copy, Check, MessageSquare, BookOpen, Lightbulb, GraduationCap } from 'lucide-react';
import { ChatMessage, ExplanationLevel, MathTopic } from '../types';
import { MathRenderer } from './MathRenderer';

interface ChatTutorViewProps {
  level: ExplanationLevel;
  onSendToSolver?: (problem: string) => void;
}

export const ChatTutorView: React.FC<ChatTutorViewProps> = ({ level, onSendToSolver }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am your **AI Mathematics Tutor**, powered by Google Gemini 3.7 Flash and a Multi-Agent architecture.

I can explain any mathematical theorem, derive equations step-by-step, or break down difficult proofs.

Current explanation depth: **${level.toUpperCase()}**

Try asking:
- *"Explain the geometric intuition and formula for Lagrange Multipliers"*
- *"Derive the Euler-Lagrange equation for calculus of variations"*
- *"What is the Cauchy-Schwarz inequality and how is it proven in inner product spaces?"*
- *"Explain Bayes' Theorem with a concrete medical testing example"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level,
      topic: 'General Mathematics',
      agent: 'Explanation Agent',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<MathTopic>('Calculus');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    {
      label: 'Lagrange Multipliers',
      query: 'Explain the geometric intuition of Lagrange Multipliers and derive the condition $\\nabla f = \\lambda \\nabla g$.',
      topic: 'Calculus' as MathTopic,
    },
    {
      label: 'Eigenvalues & Vectors',
      query: 'What is an eigenvalue geometrically? Derive $\\det(A - \\lambda I) = 0$ with an example matrix.',
      topic: 'Linear Algebra' as MathTopic,
    },
    {
      label: 'Bayes Theorem & Prior',
      query: 'Explain Bayes Theorem $P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$ with prior, likelihood, and posterior probability.',
      topic: 'Probability & Statistics' as MathTopic,
    },
    {
      label: 'Fourier Series',
      query: 'What is the intuition behind Fourier series representing arbitrary periodic functions with sines and cosines?',
      topic: 'Calculus' as MathTopic,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level,
      topic: selectedTopic,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          level,
          topic: selectedTopic,
          history: messages.slice(-5).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: data.level || level,
        topic: data.topic || selectedTopic,
        agent: data.agent || 'Explanation Agent',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error generating explanation**: ${err.message || 'Please check connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level,
        topic: selectedTopic,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-cleared',
        role: 'assistant',
        content: `Chat reset. Ask any question in **${selectedTopic}** at **${level.toUpperCase()}** level.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level,
        topic: selectedTopic,
        agent: 'Explanation Agent',
      },
    ]);
  };

  const topics: MathTopic[] = [
    'Calculus',
    'Linear Algebra',
    'Algebra',
    'Trigonometry',
    'Probability & Statistics',
    'Differential Equations',
    'Real Analysis',
    'Complex Analysis',
  ];

  return (
    <div className="flex flex-col h-full space-y-4 max-w-5xl mx-auto">
      {/* Top Topic Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1 shrink-0">Topic:</span>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedTopic === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedTopic(p.topic);
              handleSendMessage(p.query);
            }}
            className="p-2.5 text-left bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-all group shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-indigo-600 mb-1">
              <span>{p.label}</span>
              <span className="text-[10px] text-slate-400 font-normal">{p.topic}</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">{p.query}</p>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 md:p-6 overflow-y-auto space-y-6 min-h-[420px] max-h-[600px]">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl p-4 md:p-5 transition-all ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-xs rounded-tr-xs'
                    : 'bg-slate-50/90 text-slate-900 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 mb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isUser ? 'text-indigo-100' : 'text-slate-800'}`}>
                      {isUser ? 'You (Student)' : 'AI Maths Tutor'}
                    </span>
                    {m.agent && !isUser && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100/70 text-indigo-800 border border-indigo-200/50">
                        {m.agent}
                      </span>
                    )}
                    {m.level && !isUser && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200/70 text-slate-700 uppercase">
                        {m.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(m.content, m.id)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                        title="Copy solution"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Rendered with KaTeX */}
                {isUser ? (
                  <div className="text-white text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.content}</div>
                ) : (
                  <MathRenderer content={m.content} />
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 animate-pulse text-indigo-800 text-sm">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
            <span>AI Maths Tutor is formulating step-by-step derivation and LaTeX formulas...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-chat-query"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask a question about ${selectedTopic} (e.g. "Derive the quadratic formula by completing square")...`}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
          <button
            id="btn-chat-send"
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <span>Ask Tutor</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
