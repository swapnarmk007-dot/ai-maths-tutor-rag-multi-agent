import React from 'react';
import { Sparkles, BrainCircuit, ShieldCheck, Cpu, Database, UserCheck } from 'lucide-react';
import { ExplanationLevel } from '../types';

interface NavbarProps {
  level: ExplanationLevel;
  setLevel: (level: ExplanationLevel) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ level, setLevel, activeView }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Developer Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">AI Maths Tutor</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <BrainCircuit className="w-3 h-3" /> Multi-Agent RAG
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <ShieldCheck className="w-3 h-3" /> SymPy Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span>By</span>
                <span className="font-semibold text-slate-800">Swapna V</span>
                <span className="text-slate-300">•</span>
                <span>Agentic AI Engineer | IPEC Solutions</span>
              </p>
            </div>
          </div>

          {/* Right Controls: Level Selector & Engine Status */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Pedagogical Depth Level */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="px-2.5 text-slate-500 font-medium hidden sm:inline">Depth:</span>
              <button
                id="btn-level-beginner"
                onClick={() => setLevel('beginner')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  level === 'beginner'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Beginner
              </button>
              <button
                id="btn-level-intermediate"
                onClick={() => setLevel('intermediate')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  level === 'intermediate'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Intermediate
              </button>
              <button
                id="btn-level-advanced"
                onClick={() => setLevel('advanced')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  level === 'advanced'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Advanced
              </button>
            </div>

            {/* Model Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium text-slate-700">Gemini 3.7 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
