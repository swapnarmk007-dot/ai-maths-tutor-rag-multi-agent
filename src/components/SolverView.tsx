import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  Code,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { MathSolution, MathTopic } from '../types';
import { MathRenderer } from './MathRenderer';

export const SolverView: React.FC = () => {
  const [category, setCategory] = useState<MathTopic>('Calculus');
  const [problemInput, setProblemInput] = useState(
    'Find the indefinite integral of f(x) = x^2 * e^(3x) using integration by parts, and evaluate at limits [0, 1].'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<MathSolution | null>({
    problemStatement: 'Evaluate \\int x^2 e^{3x} dx and calculate definite integral from 0 to 1.',
    category: 'Calculus',
    difficulty: 'Intermediate',
    steps: [
      {
        stepNumber: 1,
        title: 'Apply Integration by Parts (LIATE Rule)',
        explanation: 'We choose $u = x^2$ (algebraic) and $dv = e^{3x} dx$ (exponential). Differentiating and integrating yields:',
        formula: '$$du = 2x \\, dx, \\quad v = \\int e^{3x}dx = \\frac{1}{3}e^{3x}$$',
      },
      {
        stepNumber: 2,
        title: 'First Integration by Parts Formula Application',
        explanation: 'Using the standard formula $\\int u \\, dv = uv - \\int v \\, du$:',
        formula: '$$\\int x^2 e^{3x} dx = \\frac{1}{3}x^2 e^{3x} - \\int \\frac{1}{3}e^{3x}(2x) dx = \\frac{1}{3}x^2 e^{3x} - \\frac{2}{3}\\int x e^{3x} dx$$',
      },
      {
        stepNumber: 3,
        title: 'Second Integration by Parts',
        explanation: 'For $\\int x e^{3x} dx$, set $u_2 = x \\implies du_2 = dx$ and $dv_2 = e^{3x}dx \\implies v_2 = \\frac{1}{3}e^{3x}$:',
        formula: '$$\\int x e^{3x} dx = \\frac{1}{3}x e^{3x} - \\frac{1}{3}\\int e^{3x}dx = \\frac{1}{3}x e^{3x} - \\frac{1}{9}e^{3x}$$',
      },
      {
        stepNumber: 4,
        title: 'Combine and Add Constant of Integration',
        explanation: 'Substitute back into the main expression:',
        formula: '$$\\int x^2 e^{3x} dx = e^{3x} \\left( \\frac{x^2}{3} - \\frac{2x}{9} + \\frac{2}{27} \\right) + C$$',
      },
      {
        stepNumber: 5,
        title: 'Definite Integral Evaluation [0, 1]',
        explanation: 'Evaluate between $x = 0$ and $x = 1$:',
        formula: '$$\\left[ e^{3x} \\left( \\frac{x^2}{3} - \\frac{2x}{9} + \\frac{2}{27} \\right) \\right]_0^1 = e^3 \\left( \\frac{1}{3} - \\frac{2}{9} + \\frac{2}{27} \\right) - \\frac{2}{27} = \\frac{5e^3 - 2}{27} \\approx 3.6455$$',
      },
    ],
    finalAnswer: '$$\\int_0^1 x^2 e^{3x} dx = \\frac{5e^3 - 2}{27} \\approx 3.6455$$',
    sympyCode: `import sympy as sp

x = sp.Symbol('x')
f = x**2 * sp.exp(3*x)

# Indefinite Integral
indefinite = sp.integrate(f, x)
print(f"Indefinite: {indefinite}")

# Definite Integral from 0 to 1
definite = sp.integrate(f, (x, 0, 1))
print(f"Definite: {definite}")
print(f"Numerical: {definite.evalf()}")`,
    verifiedResult: 'Indefinite: (9*x**2 - 6*x + 2)*exp(3*x)/27 | Definite: 5*exp(3)/27 - 2/27 (~3.6455)',
    verificationStatus: 'VERIFIED_EXACT',
    alternativeMethods: 'Tabular Integration (D-I Method) is faster for polynomial times exponential.',
    commonMistakes: [
      'Forgetting the negative sign when distributing across the second integration by parts.',
      'Omitting the lower limit evaluation at x = 0 (since e^0 = 1, it contributes -2/27).',
    ],
    localSymPyExecution: 'SymPy Symbolic Check: Exact Match (Zero Error)',
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  const sampleProblems: Array<{ topic: MathTopic; title: string; prompt: string }> = [
    {
      topic: 'Linear Algebra',
      title: 'Eigenvalues & Diagonalization',
      prompt: 'Find all eigenvalues and corresponding eigenvectors of the matrix A = [[4, 1], [2, 3]], and state if A is diagonalizable.',
    },
    {
      topic: 'Calculus',
      title: 'Multivariable Extreme Values',
      prompt: 'Find and classify the critical points of f(x, y) = x^3 + y^3 - 3xy using the Second Partial Derivatives Test (Hessian determinant).',
    },
    {
      topic: 'Probability & Statistics',
      title: 'Continuous Distribution & Variance',
      prompt: 'Let X be a continuous random variable with PDF f(x) = 3x^2 for 0 <= x <= 1, and 0 elsewhere. Calculate E[X], Var(X), and P(X > 0.5).',
    },
    {
      topic: 'Differential Equations',
      title: 'Second-Order Non-Homogeneous ODE',
      prompt: 'Solve the initial value problem: y\'\' - 4y\' + 4y = 0 with y(0) = 3 and y\'(0) = 1 using the characteristic equation method.',
    },
  ];

  const handleSolve = async () => {
    if (!problemInput.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problemInput,
          topic: category,
        }),
      });

      if (!res.ok) throw new Error(`Solver API error: ${res.status}`);
      const data = await res.json();
      if (data.solution) {
        setSolution(data.solution);
      }
    } catch (err: any) {
      alert(`Problem solving failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Problem Input Card */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Step-by-Step Problem Solver</h2>
              <p className="text-xs text-slate-500">Dual-engine solving with Generative AI + SymPy Symbolic Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Domain:</span>
            <select
              id="select-solver-domain"
              value={category}
              onChange={(e) => setCategory(e.target.value as MathTopic)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Calculus">Calculus</option>
              <option value="Algebra">Algebra</option>
              <option value="Linear Algebra">Linear Algebra</option>
              <option value="Trigonometry">Trigonometry</option>
              <option value="Probability & Statistics">Probability & Statistics</option>
              <option value="Differential Equations">Differential Equations</option>
              <option value="Real Analysis">Real Analysis</option>
              <option value="Complex Analysis">Complex Analysis</option>
            </select>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
            Enter Equation or Word Problem:
          </label>
          <textarea
            id="textarea-problem-input"
            rows={3}
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
            placeholder="Type equations (e.g. solve 3x^2 - 12x + 9 = 0 or calculate derivative / integral)..."
            className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-sans"
          />
        </div>

        {/* Preset problem buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 shrink-0 font-medium">Presets:</span>
          {sampleProblems.map((sp, i) => (
            <button
              key={i}
              onClick={() => {
                setCategory(sp.topic);
                setProblemInput(sp.prompt);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
            >
              {sp.title}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-1">
          <button
            id="btn-solve-now"
            onClick={handleSolve}
            disabled={isLoading || !problemInput.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-xs"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing CAS Solution...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Solve & Verify Step-by-Step</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Solution Section */}
      {solution && (
        <div className="space-y-5 animate-fadeIn">
          {/* Final Answer Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Final Answer
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                    {solution.category} • {solution.difficulty}
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-2">
                  <MathRenderer content={solution.finalAnswer} />
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(solution.finalAnswer);
                  setCopiedAnswer(true);
                  setTimeout(() => setCopiedAnswer(false), 2000);
                }}
                className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-emerald-200 shadow-2xs transition-colors"
                title="Copy Final Answer"
              >
                {copiedAnswer ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step-by-Step Derivation */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Detailed Calculation Steps</span>
                <span className="text-xs font-normal text-slate-400">({solution.steps.length} Steps)</span>
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                Math Solver Agent
              </span>
            </div>

            <div className="space-y-4">
              {solution.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  </div>
                  <div className="pl-8 text-sm text-slate-700">
                    <MathRenderer content={step.explanation} />
                    {step.formula && (
                      <div className="my-2 p-3 bg-white rounded-lg border border-slate-200 text-center shadow-2xs">
                        <MathRenderer content={step.formula} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SymPy Symbolic Verification Box */}
          <div className="bg-slate-900 text-slate-100 p-5 md:p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Python SymPy Symbolic Verification
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {solution.verificationStatus}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(solution.sympyCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-emerald-300 bg-slate-950 p-3.5 rounded-xl overflow-x-auto border border-slate-800/80 leading-relaxed">
              <code>{solution.sympyCode}</code>
            </pre>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Exact Result: <strong className="text-slate-200">{solution.verifiedResult}</strong></span>
              </span>
              {solution.localSymPyExecution && (
                <span className="text-slate-400 hidden sm:inline">{solution.localSymPyExecution}</span>
              )}
            </div>
          </div>

          {/* Common Pitfalls & Alternative Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solution.commonMistakes && solution.commonMistakes.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Common Student Pitfalls</span>
                </div>
                <ul className="space-y-1.5 text-xs text-amber-900 list-disc pl-4">
                  {solution.commonMistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {solution.alternativeMethods && (
              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Alternative Solving Techniques</span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed">{solution.alternativeMethods}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
