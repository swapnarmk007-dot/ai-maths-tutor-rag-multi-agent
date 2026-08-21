import React, { useState } from 'react';
import { ExplanationLevel } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatTutorView } from './components/ChatTutorView';
import { SolverView } from './components/SolverView';
import { RagTutorView } from './components/RagTutorView';
import { MultiAgentVisualizerView } from './components/MultiAgentVisualizerView';
import { QuizView } from './components/QuizView';
import { FormulaLibraryView } from './components/FormulaLibraryView';
import { PerformanceDashboardView } from './components/PerformanceDashboardView';
import { CodeInspectorView } from './components/CodeInspectorView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [level, setLevel] = useState<ExplanationLevel>('intermediate');

  const handleSelectFormula = (formulaName: string, topic: string) => {
    setActiveTab('solver');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar with Swapna V developer info & level controls */}
      <Navbar level={level} setLevel={setLevel} activeView={activeTab} />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Streamlit Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} documentCount={3} />

        {/* Dynamic View Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'chat' && <ChatTutorView level={level} onSendToSolver={() => setActiveTab('solver')} />}
          {activeTab === 'solver' && <SolverView />}
          {activeTab === 'rag' && <RagTutorView />}
          {activeTab === 'agents' && <MultiAgentVisualizerView level={level} />}
          {activeTab === 'quiz' && <QuizView />}
          {activeTab === 'formulas' && <FormulaLibraryView onSelectFormula={handleSelectFormula} />}
          {activeTab === 'performance' && <PerformanceDashboardView />}
          {activeTab === 'code' && <CodeInspectorView />}
        </main>
      </div>
    </div>
  );
}
