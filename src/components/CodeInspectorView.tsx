import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  Copy,
  Check,
  FolderTree,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Download,
  BookOpen,
} from 'lucide-react';

export const CodeInspectorView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  const fileTree = [
    {
      group: 'Root Files',
      files: ['app.py', 'requirements.txt', 'README.md', '.env.example'],
    },
    {
      group: 'src/ (Core Multi-Agent & RAG)',
      files: [
        'src/agents.py',
        'src/solver.py',
        'src/rag.py',
        'src/llm.py',
        'src/prompts.py',
        'src/quiz.py',
        'src/evaluator.py',
        'src/embeddings.py',
      ],
    },
    {
      group: 'utils/ (PDF & Math Helpers)',
      files: ['utils/pdf_loader.py', 'utils/helpers.py'],
    },
  ];

  const codeSnippets: Record<string, string> = {
    'app.py': `"""
AI Maths Tutor — RAG & Multi-Agent Generative AI Learning Assistant
Developer: Swapna V | Role: Agentic AI Engineer | IPEC Solutions
"""

import os
import streamlit as st
import pandas as pd
import numpy as np
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="AI Maths Tutor — RAG & Multi-Agent Assistant",
    page_icon="📐",
    layout="wide"
)

# Sidebar Navigation
with st.sidebar:
    st.markdown("### 🎓 AI Maths Tutor")
    st.markdown("**Developer:** Swapna V \\n*Agentic AI Engineer | IPEC Solutions*")
    nav = st.radio("Navigation", [
        "🤖 AI Tutor Chat",
        "📐 Problem Solver (SymPy)",
        "📚 Document RAG Tutor",
        "🧠 Multi-Agent Visualizer",
        "📝 AI Quiz Generator",
        "📖 Formula Library",
        "📊 Performance Dashboard"
    ])
    level = st.select_slider("Depth", ["Beginner", "Intermediate", "Advanced"], value="Intermediate")

# Render active agent module...
# (See complete file content in project root)`,

    'src/agents.py': `"""
Multi-Agent Orchestrator and Supervisor Architecture.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import json
from typing import Dict, Any
from src.llm import generate_math_response
from src.prompts import SUPERVISOR_PROMPT, EXPLANATION_PROMPT
from src.solver import MathSolver
from src.rag import MathRAGPipeline
from src.quiz import QuizGenerator
from src.evaluator import AnswerEvaluator

class MultiAgentCoordinator:
    """Orchestrates multi-agent routing, tool calling, and synthesis."""

    def __init__(self):
        self.solver = MathSolver()
        self.rag = MathRAGPipeline()
        self.quiz = QuizGenerator()
        self.evaluator = AnswerEvaluator()

    def route_and_execute(self, user_query: str, level: str = "intermediate") -> Dict[str, Any]:
        """Supervisor agent determines best agent and delegates execution."""
        supervisor_prompt = f"User Query: '{user_query}' (Level: {level})"
        raw_plan = generate_math_response(supervisor_prompt, SUPERVISOR_PROMPT, response_mime_type="application/json")
        plan = json.loads(raw_plan)
        
        agent_name = plan.get("selected_agent", "Explanation Agent")
        # Execute specialized pipeline...
        return {"supervisor_plan": plan, "selected_agent": agent_name}`,

    'src/solver.py': `"""
Math Problem Solver with step-by-step resolution and SymPy symbolic verification.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import json
import sympy as sp
from src.llm import generate_math_response
from src.prompts import MATH_SOLVER_PROMPT

class MathSolver:
    """Solves mathematical equations and verifies results using SymPy."""

    def solve_problem(self, problem_text: str, category: str = "Algebra") -> dict:
        prompt = f"Category: {category}\\nProblem: {problem_text}"
        response = generate_math_response(
            prompt,
            MATH_SOLVER_PROMPT,
            temperature=0.1,
            response_mime_type="application/json"
        )
        data = json.loads(response)
        
        # Local symbolic verification
        if data.get("sympyCode"):
            self._verify_sympy(data["sympyCode"])
        return data`,

    'src/rag.py': `"""
RAG (Retrieval-Augmented Generation) Pipeline with ChromaDB.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import os
from src.embeddings import MathEmbeddingManager
from src.prompts import RAG_PROMPT
from src.llm import generate_math_response

class MathRAGPipeline:
    def __init__(self, persist_dir: str = "./vectorstore/chroma_db"):
        self.embedding_manager = MathEmbeddingManager()
        self.documents_index = []

    def answer_query(self, query: str) -> dict:
        passages = self.retrieve_relevant_context(query)
        # Construct grounded context & invoke Gemini with zero-hallucination prompt`,

    'requirements.txt': `streamlit>=1.38.0
google-genai>=0.1.1
langchain>=0.2.14
langchain-community>=0.2.12
langchain-google-genai>=1.0.8
chromadb>=0.5.5
sentence-transformers>=3.0.1
pypdf>=4.3.1
sympy>=1.13.2
pandas>=2.2.2
numpy>=1.26.4
python-dotenv>=1.0.1
plotly>=5.24.0`,

    'README.md': `# AI Maths Tutor — RAG & Multi-Agent Generative AI Learning Assistant
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions

## Quickstart
1. clone repo: git clone https://github.com/SwapnaV/ai-maths-tutor.git
2. install requirements: pip install -r requirements.txt
3. set GEMINI_API_KEY in .env
4. run app: streamlit run app.py`,
  };

  const stages = [
    { num: 1, name: 'Project Setup & Environment', file: 'requirements.txt & .env.example' },
    { num: 2, name: 'Gemini Client & System Prompts', file: 'src/llm.py & src/prompts.py' },
    { num: 3, name: 'Streamlit UI Layout & State', file: 'app.py' },
    { num: 4, name: 'PDF Processing & Text Cleaner', file: 'utils/pdf_loader.py' },
    { num: 5, name: 'Dense Embeddings & VectorStore', file: 'src/embeddings.py' },
    { num: 6, name: 'RAG Retrieval & Grounding', file: 'src/rag.py' },
    { num: 7, name: 'Math Solver & SymPy Verification', file: 'src/solver.py' },
    { num: 8, name: 'AI Quiz Generator & Grading', file: 'src/quiz.py & src/evaluator.py' },
    { num: 9, name: 'Multi-Agent Supervisor Routing', file: 'src/agents.py' },
    { num: 10, name: 'Performance Mastery Dashboard', file: 'app.py' },
    { num: 11, name: 'Error Handling & Security', file: 'src/llm.py' },
    { num: 12, name: 'README & GitHub Repository', file: 'README.md' },
    { num: 13, name: 'Streamlit Cloud Deployment', file: 'secrets.toml' },
  ];

  const handleCopyCode = () => {
    const code = codeSnippets[selectedFile] || '# File loaded from project structure';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Python Project Architecture & Stage Inspector</h2>
          </div>
          <p className="text-xs text-slate-500">
            Complete 13-stage Python, Streamlit, LangChain, ChromaDB & SymPy implementation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied File' : `Copy ${selectedFile}`}</span>
          </button>
        </div>
      </div>

      {/* 13 Stage Implementation Roadmap */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>13-Stage Development Lifecycle</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
          {stages.map((st) => (
            <div
              key={st.num}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center justify-between font-bold text-[11px] text-indigo-700">
                <span>Stage {st.num}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="font-semibold text-slate-800 text-[11px] truncate">{st.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{st.file}</div>
            </div>
          ))}
        </div>
      </div>

      {/* File Explorer & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Tree */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-indigo-600" />
            <span>Repository Files</span>
          </div>

          <div className="space-y-3">
            {fileTree.map((grp, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
                  {grp.group}
                </span>
                <div className="space-y-0.5">
                  {grp.files.map((file) => (
                    <button
                      key={file}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                        selectedFile === file
                          ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{file}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Content */}
        <div className="lg:col-span-2 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-sm p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300 font-bold">{selectedFile}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Python 3.11+ / Streamlit</span>
          </div>

          <pre className="font-mono text-xs text-emerald-300 bg-slate-900/90 p-4 rounded-xl overflow-x-auto border border-slate-800/80 leading-relaxed max-h-[500px]">
            <code>
              {codeSnippets[selectedFile] ||
                `# Complete code for ${selectedFile} is active in the codebase.\n# Import and execute via Streamlit Cloud or local environment.`}
            </code>
          </pre>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span>Author: Swapna V • IPEC Solutions</span>
            <span>Streamlit Cloud Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
