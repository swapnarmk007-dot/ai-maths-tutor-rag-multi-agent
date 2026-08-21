# 📐 AI Maths Tutor — RAG & Multi-Agent Generative AI Learning Assistant

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://streamlit.io)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Google Gemini API](https://img.shields.io/badge/Gemini%20API-3.7%20Flash-orange.svg)](https://ai.google.dev/)
[![LangChain](https://img.shields.io/badge/LangChain-Enabled-green.svg)](https://www.langchain.com/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorStore-red.svg)](https://www.trychroma.com/)
[![SymPy](https://img.shields.io/badge/SymPy-Symbolic%20Verification-blueviolet.svg)](https://www.sympy.org/)

---

## 👨‍💻 Developer Profile
- **Developer Name:** **Swapna V**
- **Role:** Agentic AI Engineer | IPEC Solutions
- **Email:** Swapnarmk007@gmail.com
- **Specialization:** Multi-Agent Architectures, Retrieval-Augmented Generation (RAG), LLM Reasoning Engines & Educational AI

---

## 🎯 Executive Overview

**AI Maths Tutor** is a production-grade generative AI mathematics learning system engineered to provide personalized, step-by-step mathematical tutoring across all levels (Beginner, Intermediate, Advanced).

By combining **Google Gemini 3.7 Flash**, **LangChain RAG with ChromaDB**, **SymPy symbolic verification**, and a **Supervisor Multi-Agent architecture**, the platform ensures mathematical accuracy, eliminates hallucinations in document Q&A, generates diagnostic assessments, and visualizes personalized student learning curves.

---

## 🏛️ System Architecture

```
                               ┌───────────────────────────┐
                               │     Student / User UI     │
                               │  (Streamlit / React Web)  │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │     Supervisor Agent      │
                               │ (Intent & Routing Engine) │
                               └──────┬───┬───┬───┬───┬────┘
                                      │   │   │   │   │
           ┌──────────────────────────┘   │   │   │   └──────────────────────────┐
           │                              │   │   │                              │
           ▼                              ▼   │   ▼                              ▼
┌────────────────────┐ ┌────────────────────┐ │ ┌────────────────────┐ ┌────────────────────┐
│ Math Solver Agent  │ │ Explanation Agent  │ │ │     Quiz Agent     │ │  Evaluator Agent   │
│ (Step-by-Step CAS) │ │ (Pedagogic Levels) │ │ │ (Adaptive Testing) │ │ (Error Diagnosis)  │
└─────────┬──────────┘ └────────────────────┘ │ └────────────────────┘ └────────────────────┘
          │                                   ▼
          ▼                        ┌────────────────────┐
┌────────────────────┐             │     RAG Agent      │
│  SymPy Validation  │             │ (ChromaDB Vectors) │
│ (Exact Verification│             └─────────┬──────────┘
└────────────────────┘                       │
                                             ▼
                               ┌──────────────────────────┐
                               │ Dense Embeddings (MiniLM)│
                               │ PDF Text Parser & Chunks │
                               └──────────────────────────┘
```

---

## ✨ Core Capabilities

1. **🤖 Multi-Level AI Mathematics Chatbot**
   - Explains concepts with customizable depth: *Beginner* (intuitive visuals), *Intermediate* (undergraduate rigor), *Advanced* (formal theorems & $\epsilon$-$\delta$ proofs).
   - Universal standard **LaTeX formatting** ($...$ inline, $$...$$ display).

2. **📐 Problem Solver with SymPy Verification**
   - Handles Algebra, Calculus, Trigonometry, Linear Algebra, Probability, Statistics, Real/Complex Analysis, and Differential Equations.
   - Generates executable **Python SymPy** code and confirms mathematical validity with zero guesswork.

3. **📚 Zero-Hallucination Document RAG Tutor**
   - Ingests mathematics PDF textbooks, lecture notes, and formula sheets.
   - Chunks text semantically, generates vector embeddings, and stores them in **ChromaDB**.
   - Cites page numbers and document passages; strictly discloses when information is outside the document context.

4. **🧠 Multi-Agent Supervisor Orchestration**
   - Coordinates five specialized agents with structured intent classification, confidence scores, and real-time execution traces.

5. **📝 AI Quiz Generator & Evaluator**
   - Generates diagnostic multiple-choice and numerical questions.
   - Evaluates submissions, categorizes error types (Conceptual vs. Arithmetic vs. Boundary), and recommends remediation.

6. **📖 Interactive Formula Catalog**
   - Quick-reference mathematical formula sheets across 7 domains with instant copy & solve integrations.

7. **📊 Mastery & Performance Dashboard**
   - Visualizes learning velocity, accuracy rates, topic strengths, and weak areas.

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| **Core LLM** | Google Gemini 3.7 Flash via `@google/genai` & `google-genai` | Multi-agent reasoning, solution generation, quiz creation |
| **Agent Framework** | LangChain & Custom Supervisor Architecture | Task routing, prompt chaining, tool execution |
| **Vector Database** | ChromaDB / Dense Vector Store | Document embedding indexing & similarity retrieval |
| **Embeddings** | Sentence-Transformers (`all-MiniLM-L6-v2`) | Semantic embedding generation for math passages |
| **Verification Engine** | SymPy (Python Symbolic Mathematics) | Exact verification of integrals, derivatives, matrices, roots |
| **PDF Extraction** | PyPDF & Custom Regex Math Cleaner | Document ingestion and chunking |
| **Web Frontend** | Streamlit & React 19 / Tailwind CSS | Responsive dashboard, KaTeX math rendering, Recharts |
| **Backend API** | Express.js / Node.js & FastAPI | Server-side Gemini API proxy, endpoints, and utilities |

---

## 📁 Repository Structure

```
ai-maths-tutor/
│
├── app.py                     # Streamlit Main Application
├── requirements.txt           # Python package dependencies
├── README.md                  # Comprehensive documentation
├── .env.example               # Environment variables template
├── .gitignore                 # Excluded directories and credentials
│
├── data/                      # Sample mathematics textbooks and notes
│   ├── sample_calculus.txt
│   └── linear_algebra.txt
│
├── vectorstore/               # ChromaDB persistent directory
│   └── chroma_db/
│
├── src/                       # Core Python Modules
│   ├── __init__.py
│   ├── llm.py                 # Gemini Client initialization
│   ├── rag.py                 # RAG pipeline & ChromaDB retriever
│   ├── embeddings.py          # SentenceTransformers embeddings
│   ├── solver.py              # Math Solver with SymPy integration
│   ├── quiz.py                # AI Quiz generator
│   ├── evaluator.py           # Quiz grading and diagnostic agent
│   ├── agents.py              # Multi-Agent supervisor coordinator
│   └── prompts.py             # System prompts for all agents
│
└── utils/                     # Utility functions
    ├── __init__.py
    ├── pdf_loader.py          # PDF parsing and semantic chunker
    └── helpers.py             # KaTeX formatter & formula catalog
```

---

## 🚀 Step-by-Step Installation & Local Execution

### Prerequisites
- Python 3.11 or higher
- Node.js 20+ (for full-stack web runtime)
- Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/SwapnaV/ai-maths-tutor.git
cd ai-maths-tutor
```

### 2. Set Up Python Virtual Environment
```bash
python3 -m venv venv
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Add your Gemini API key:
```env
GEMINI_API_KEY="your-actual-gemini-api-key"
```

### 5. Launch the Streamlit Application
```bash
streamlit run app.py
```
Open your browser at `http://localhost:8501`.

---

## ☁️ Streamlit Cloud Deployment Guide

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of AI Maths Tutor"
   git branch -M main
   git remote add origin https://github.com/SwapnaV/ai-maths-tutor.git
   git push -u origin main
   ```
2. Navigate to [share.streamlit.io](https://share.streamlit.io/) and log in with GitHub.
3. Click **"New App"** and select repository `SwapnaV/ai-maths-tutor`, branch `main`, file `app.py`.
4. Under **"Advanced settings > Secrets"**, paste your Gemini API key:
   ```toml
   GEMINI_API_KEY = "your-actual-gemini-api-key"
   ```
5. Click **"Deploy"**!

---

## 🛡️ Mathematical Verification Methodology

Every calculation processed by the **Math Solver Agent** is routed through a dual-validation pipeline:
1. **Generative Step Decomposition**: The LLM creates the pedagogical explanation and intermediate steps.
2. **CAS Symbolic Check**: The solver runs SymPy code to verify boundary conditions, integrals, derivatives, and matrix eigenvalues, returning a `VERIFIED_EXACT` certification badge.

---

## 🏆 Portfolio Contact

For inquiries, collaborations, or AI engineering roles:
- **Developer:** Swapna V
- **Organization:** IPEC Solutions
- **Role:** Agentic AI Engineer
- **Email:** Swapnarmk007@gmail.com
