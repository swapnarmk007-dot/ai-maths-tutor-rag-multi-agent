import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, Calculator, Sparkles, Filter } from 'lucide-react';
import { FormulaItem, MathTopic } from '../types';
import { MathRenderer } from './MathRenderer';

interface FormulaLibraryViewProps {
  onSelectFormula?: (formula: string, topic: string) => void;
}

export const FormulaLibraryView: React.FC<FormulaLibraryViewProps> = ({ onSelectFormula }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formulas: FormulaItem[] = [
    // Algebra
    {
      name: 'Quadratic Formula',
      category: 'Algebra',
      formula: '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$',
      desc: 'Analytical solution for the roots of any quadratic equation ax^2 + bx + c = 0.',
    },
    {
      name: 'Binomial Theorem',
      category: 'Algebra',
      formula: '$$(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k$$',
      desc: 'Algebraic expansion of powers of a binomial expression.',
    },
    {
      name: 'Logarithm Change of Base',
      category: 'Algebra',
      formula: '$$\\log_b(a) = \\frac{\\ln(a)}{\\ln(b)} = \\frac{\\log_c(a)}{\\log_c(b)}$$',
      desc: 'Base conversion identity for evaluating arbitrary base logarithms.',
    },
    {
      name: 'Arithmetic Series Sum',
      category: 'Algebra',
      formula: '$$S_n = \\frac{n}{2}\\left(2a_1 + (n-1)d\\right) = \\frac{n}{2}(a_1 + a_n)$$',
      desc: 'Sum of the first n terms of an arithmetic progression.',
    },

    // Calculus
    {
      name: 'Fundamental Theorem of Calculus (FTC)',
      category: 'Calculus',
      formula: '$$\\int_{a}^{b} f(x)dx = F(b) - F(a) \\quad \\text{where } F\'(x) = f(x)$$',
      desc: 'Core bridge connecting differential calculus and integral calculus.',
    },
    {
      name: 'Integration by Parts',
      category: 'Calculus',
      formula: '$$\\int u \\, dv = uv - \\int v \\, du$$',
      desc: 'Integration technique derived from the product rule of differentiation.',
    },
    {
      name: 'Taylor Series Expansion',
      category: 'Calculus',
      formula: '$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n$$',
      desc: 'Infinite polynomial series representation of infinitely differentiable function.',
    },
    {
      name: 'Chain Rule for Differentiation',
      category: 'Calculus',
      formula: '$$\\frac{d}{dx}\\left[f(g(x))\\right] = f\'(g(x)) \\cdot g\'(x)$$',
      desc: 'Formula for computing the derivative of composite functions.',
    },

    // Trigonometry
    {
      name: 'Euler\'s Formula',
      category: 'Trigonometry',
      formula: '$$e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)$$',
      desc: 'Profound identity establishing deep relationship between complex analysis and trigonometry.',
    },
    {
      name: 'Pythagorean Trigonometric Identity',
      category: 'Trigonometry',
      formula: '$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1, \\quad 1 + \\tan^2(\\theta) = \\sec^2(\\theta)$$',
      desc: 'Fundamental circular identity derived from the Pythagorean theorem on unit circle.',
    },
    {
      name: 'Double Angle Formulas',
      category: 'Trigonometry',
      formula: '$$\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta), \\quad \\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)$$',
      desc: 'Angle duplication identities frequently used in integration simplification.',
    },

    // Linear Algebra
    {
      name: 'Eigenvalue Characteristic Equation',
      category: 'Linear Algebra',
      formula: '$$\\det(A - \\lambda I) = 0$$',
      desc: 'Condition for obtaining eigenvalues $\\lambda$ corresponding to non-trivial eigenvectors $v$.',
    },
    {
      name: 'Spectral Decomposition & Diagonalization',
      category: 'Linear Algebra',
      formula: '$$A = P D P^{-1} \\quad \\text{where } D = \\text{diag}(\\lambda_1, \\dots, \\lambda_n)$$',
      desc: 'Matrix factorization into its eigenvector basis and diagonal eigenvalue matrix.',
    },
    {
      name: 'Singular Value Decomposition (SVD)',
      category: 'Linear Algebra',
      formula: '$$A = U \\Sigma V^T$$',
      desc: 'General matrix factorization into orthogonal singular vectors and singular values.',
    },

    // Probability & Statistics
    {
      name: 'Bayes\' Theorem',
      category: 'Probability & Statistics',
      formula: '$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)} = \\frac{P(B|A)P(A)}{\\sum_i P(B|A_i)P(A_i)}$$',
      desc: 'Calculates posterior probability based on prior knowledge and likelihood.',
    },
    {
      name: 'Normal (Gaussian) Distribution PDF',
      category: 'Probability & Statistics',
      formula: '$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$',
      desc: 'Probability density function of standard bell curve with mean $\\mu$ and variance $\\sigma^2$.',
    },
    {
      name: 'Central Limit Theorem (CLT)',
      category: 'Probability & Statistics',
      formula: '$$\\bar{X}_n \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right) \\quad \\text{as } n \\to \\infty$$',
      desc: 'Sample mean distribution converges to Gaussian regardless of underlying population distribution.',
    },

    // Differential Equations
    {
      name: '1st Order Linear ODE (Integrating Factor)',
      category: 'Differential Equations',
      formula: '$$I(x) = e^{\\int P(x)dx}, \\quad y(x) = \\frac{1}{I(x)}\\left(\\int I(x)Q(x)dx + C\\right)$$',
      desc: 'Standard closed-form solution for linear first-order ODEs: y\' + P(x)y = Q(x).',
    },
    {
      name: '2nd Order Linear Homogeneous Characteristic Equation',
      category: 'Differential Equations',
      formula: '$$ar^2 + br + c = 0 \\implies y(x) = c_1 e^{r_1 x} + c_2 e^{r_2 x}$$',
      desc: 'General solution based on characteristic roots of constant-coefficient ODEs: ay\'\' + by\' + cy = 0.',
    },
  ];

  const categories = [
    'All',
    'Calculus',
    'Algebra',
    'Trigonometry',
    'Linear Algebra',
    'Probability & Statistics',
    'Differential Equations',
  ];

  const filtered = formulas.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (latex: string, index: number) => {
    navigator.clipboard.writeText(latex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Mathematical Formula Library</h2>
              <p className="text-xs text-slate-500">Comprehensive reference across 7 core mathematical disciplines.</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium self-start sm:self-auto">
            {filtered.length} Formulas Available
          </span>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas by name, concept, or notation (e.g. Taylor, Bayes, Eigenvalue)..."
              className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                  {item.category}
                </span>
                <button
                  onClick={() => handleCopy(item.formula, idx)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Copy LaTeX formula"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
            </div>

            {/* LaTeX Display */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center my-1 overflow-x-auto">
              <MathRenderer content={item.formula} />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-mono">LaTeX Supported</span>
              {onSelectFormula && (
                <button
                  onClick={() => onSelectFormula(item.name, item.category)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Solve with this</span>
                  <Calculator className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
