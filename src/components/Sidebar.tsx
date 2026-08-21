import React from 'react';
import {
  MessageSquareText,
  Calculator,
  FileText,
  Network,
  HelpCircle,
  BookOpen,
  BarChart3,
  Code2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, documentCount = 3 }) => {
  const menuItems = [
    {
      id: 'chat',
      label: 'AI Tutor Chat',
      desc: 'Interactive multi-level math tutoring',
      icon: MessageSquareText,
      badge: 'Interactive',
    },
    {
      id: 'solver',
      label: 'Problem Solver',
      desc: 'Step-by-step with SymPy CAS check',
      icon: Calculator,
      badge: 'SymPy',
    },
    {
      id: 'rag',
      label: 'Document RAG Tutor',
      desc: 'Zero-hallucination PDF Q&A',
      icon: FileText,
      badge: `${documentCount} Docs`,
    },
    {
      id: 'agents',
      label: 'Multi-Agent Routing',
      desc: 'Supervisor agent orchestration',
      icon: Network,
      badge: '5 Agents',
    },
    {
      id: 'quiz',
      label: 'AI Quiz & Evaluation',
      desc: 'Adaptive testing & misconception analysis',
      icon: HelpCircle,
      badge: 'Diagnostic',
    },
    {
      id: 'formulas',
      label: 'Formula Library',
      desc: '7 mathematical domain catalogs',
      icon: BookOpen,
    },
    {
      id: 'performance',
      label: 'Learning Analytics',
      desc: 'Topic mastery & study suggestions',
      icon: BarChart3,
    },
    {
      id: 'code',
      label: 'Python Codebase & Docs',
      desc: 'Full 13-stage Streamlit files & README',
      icon: Code2,
      badge: 'Stage 1-13',
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white lg:min-h-[calc(100vh-65px)] border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Streamlit Navigation Tag */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Navigation Menu</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">v2.4</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-100/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm truncate">{item.label}</div>
                      <div className="text-[11px] text-slate-400 truncate group-hover:text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-indigo-200/60 text-indigo-800'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile card */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              SV
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Swapna V</div>
              <div className="text-[10px] text-indigo-700 font-medium">Agentic AI Engineer</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 leading-snug">
            IPEC Solutions • AI Research & Educational Systems
          </div>
        </div>
      </div>
    </aside>
  );
};
