import React, { useState } from 'react';
import {
  Network,
  Calculator,
  MessageSquare,
  FileText,
  HelpCircle,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { ExplanationLevel, SupervisorResult } from '../types';
import { MathRenderer } from './MathRenderer';

interface MultiAgentVisualizerViewProps {
  level: ExplanationLevel;
}

export const MultiAgentVisualizerView: React.FC<MultiAgentVisualizerViewProps> = ({ level }) => {
  const [query, setQuery] = useState(
    'Calculate the gradient vector and Hessian matrix of f(x, y) = x^2 * y + 3*y^2 and explain the saddle point test.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SupervisorResult | null>({
    selectedAgent: 'Math Solver Agent',
    confidence: 0.96,
    supervisorReasoning:
      'The query demands explicit multivariable differential calculus calculations (Gradient and Hessian matrix) combined with critical point classification. Routed primarily to the Math Solver Agent with SymPy symbolic validation.',
    routingTrace: [
      { stage: '1. Intent Classification', detail: 'Parsed keywords "gradient", "Hessian matrix", "calculate". Classified as Multivariable Calculus Computation.' },
      { stage: '2. Tooling Pre-check', detail: 'Verified CAS SymPy support for 2-variable Hessian determinant calculation.' },
      { stage: '3. Agent Delegation', detail: 'Delegated execution to Math Solver Agent (Level: Intermediate).' },
      { stage: '4. Synthesis & Verification', detail: 'Cross-verified determinant det(H) = f_xx * f_yy - (f_xy)^2 and formatted with LaTeX KaTeX.' },
    ],
    agentResponse: `### Multivariable Calculus Derivation

Given function:
$$f(x, y) = x^2 y + 3y^2$$

#### 1. Gradient Vector $\\nabla f(x, y)$
Computing first-order partial derivatives:
$$f_x = \\frac{\\partial}{\\partial x}(x^2 y + 3y^2) = 2xy$$
$$f_y = \\frac{\\partial}{\\partial y}(x^2 y + 3y^2) = x^2 + 6y$$

Thus, the gradient is:
$$\\nabla f(x, y) = \\begin{pmatrix} 2xy \\\\ x^2 + 6y \\end{pmatrix}$$

#### 2. Hessian Matrix $H(x, y)$
Computing second-order partial derivatives:
- $f_{xx} = \\frac{\\partial}{\\partial x}(2xy) = 2y$
- $f_{yy} = \\frac{\\partial}{\\partial y}(x^2 + 6y) = 6$
- $f_{xy} = f_{yx} = \\frac{\\partial}{\\partial y}(2xy) = 2x$

The symmetric Hessian matrix is:
$$H(x, y) = \\begin{pmatrix} 2y & 2x \\\\ 2x & 6 \\end{pmatrix}$$

#### 3. Saddle Point / Second Derivative Test
The determinant of the Hessian (discriminant $D$) is:
$$D(x, y) = \\det(H) = f_{xx}f_{yy} - (f_{xy})^2 = (2y)(6) - (2x)^2 = 12y - 4x^2$$

- **Local Minimum**: If $D > 0$ and $f_{xx} > 0$
- **Local Maximum**: If $D > 0$ and $f_{xx} < 0$
- **Saddle Point**: If $D < 0$ (the eigenvalues of $H$ have opposite signs)`,
  });

  const agentsList = [
    {
      name: 'Math Solver Agent',
      icon: Calculator,
      desc: 'Computational problem solving, derivatives, integrals, and SymPy checks',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      name: 'Explanation Agent',
      icon: MessageSquare,
      desc: 'Pedagogical conceptual explanations at Beginner, Intermediate, and Advanced depth',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      name: 'RAG Agent',
      icon: FileText,
      desc: 'Dense vector retrieval over uploaded textbooks and notes with ChromaDB',
      color: 'from-purple-600 to-pink-600',
    },
    {
      name: 'Quiz Agent',
      icon: HelpCircle,
      desc: 'Formative assessment design with calibrated multiple choice and numerical questions',
      color: 'from-emerald-600 to-teal-600',
    },
    {
      name: 'Evaluator Agent',
      icon: CheckSquare,
      desc: 'Submission grading, error diagnostics (Conceptual, Arithmetic), and remediation',
      color: 'from-amber-600 to-orange-600',
    },
  ];

  const handleRunSupervisor = async () => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/supervise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          level,
        }),
      });

      if (!res.ok) throw new Error('Supervisor execution failed');
      const data = await res.json();
      if (data.data) {
        setResult(data.data);
      }
    } catch (err: any) {
      alert(`Agent routing failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Multi-Agent Supervisor Architecture</h2>
          </div>
          <p className="text-xs text-slate-500">
            Orchestrates 5 specialized agent nodes via dynamic intent classification and execution pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> 5 Agent Nodes Active
          </span>
        </div>
      </div>

      {/* Agents Visual Topology Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {agentsList.map((agent) => {
          const Icon = agent.icon;
          const isSelected = result?.selectedAgent?.includes(agent.name.split(' ')[0]);
          return (
            <div
              key={agent.name}
              className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 shadow-2xs opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${agent.color} text-white flex items-center justify-center shadow-xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white animate-pulse">
                    SELECTED
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{agent.name}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-3 leading-snug">{agent.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Query Tester Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
          Test Supervisor Routing with Custom Query:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any math request (e.g. Generate a quiz on linear algebra / Solve differential equation)..."
            className="flex-1 text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            id="btn-run-supervisor"
            onClick={handleRunSupervisor}
            disabled={isLoading || !query.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shrink-0 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Routing Agents...' : 'Route & Execute'}</span>
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-500 pt-1 scrollbar-none">
          <span className="shrink-0 text-slate-400 font-medium">Test Routing:</span>
          <button
            onClick={() => setQuery('Solve the integral of sin(x)*cos(x)^3 from 0 to pi/2 with SymPy proof.')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 whitespace-nowrap"
          >
            👉 Math Solver Agent
          </button>
          <button
            onClick={() => setQuery('Explain the epsilon-delta definition of a limit with rigorous geometric proofs.')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 whitespace-nowrap"
          >
            👉 Explanation Agent
          </button>
          <button
            onClick={() => setQuery('Generate a 4-question quiz on Bayes Theorem and conditional probability distributions.')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 whitespace-nowrap"
          >
            👉 Quiz Agent
          </button>
        </div>
      </div>

      {/* Supervisor Output & Timeline */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Left: Supervisor Decision & Trace Timeline */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Supervisor Decision</span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {Math.round(result.confidence * 100)}% Confidence
                </span>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Target Node:</span>
                <div className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  <span>{result.selectedAgent}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="font-semibold text-slate-800 block mb-1">Supervisor Reasoning:</span>
                {result.supervisorReasoning}
              </div>
            </div>

            {/* Execution Trace */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Supervisor Routing Pipeline
              </span>
              <div className="space-y-2.5">
                {result.routingTrace.map((trace, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-indigo-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800 block">{trace.stage}</span>
                      <span className="text-slate-500 text-[11px] leading-snug">{trace.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Specialized Agent Output */}
          <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900">
                  Execution Output from <span className="text-indigo-600">{result.selectedAgent}</span>
                </h3>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                Verified LaTeX
              </span>
            </div>

            <div className="text-slate-800 text-sm md:text-base leading-relaxed">
              <MathRenderer content={result.agentResponse} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
