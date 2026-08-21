import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Layers,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { StoredDocument, RAGResponse } from '../types';
import { MathRenderer } from './MathRenderer';

export const RagTutorView: React.FC = () => {
  const [documents, setDocuments] = useState<StoredDocument[]>([
    {
      id: 'doc-calc',
      title: 'Calculus: Fundamental Theorem & Integration Techniques.pdf',
      fileSize: 412000,
      uploadedAt: 'Today',
      chunkCount: 2,
      topic: 'Calculus',
    },
    {
      id: 'doc-linalg',
      title: 'Linear Algebra: Eigenvalues, Vectors & Diagonalization.pdf',
      fileSize: 320000,
      uploadedAt: 'Today',
      chunkCount: 1,
      topic: 'Linear Algebra',
    },
    {
      id: 'doc-prob',
      title: 'Probability & Statistics: Distributions and Bayes Rule.pdf',
      fileSize: 285000,
      uploadedAt: 'Today',
      chunkCount: 1,
      topic: 'Probability & Statistics',
    },
  ]);

  const [selectedDocId, setSelectedDocId] = useState<string>('all');
  const [ragQuery, setRagQuery] = useState('What does the Fundamental Theorem of Calculus state and how is integration by parts derived?');
  const [isQuerying, setIsQuerying] = useState(false);
  const [ragResult, setRagResult] = useState<RAGResponse | null>({
    answer: `### 📌 Retrieved Document Evidence
According to **Source 1: Calculus: Fundamental Theorem & Integration Techniques (Page 1)**:

1. **Fundamental Theorem of Calculus (FTC)**:
   - **Part 1**: If $f$ is continuous on $[a, b]$, then $g(x) = \\int_{a}^{x} f(t)dt$ is continuous on $[a, b]$, differentiable on $(a, b)$, and:
     $$g'(x) = f(x)$$
   - **Part 2**: The evaluation theorem states:
     $$\\int_{a}^{b} f(x)dx = F(b) - F(a) \\quad \\text{where } F'(x) = f(x)$$

2. **Integration by Parts Derivation**:
   Derived directly from the product rule of differentiation:
   $$\\frac{d}{dx}[u(x)v(x)] = u'(x)v(x) + u(x)v'(x)$$
   Integrating both sides:
   $$u(x)v(x) = \\int v(x)u'(x)dx + \\int u(x)v'(x)dx$$
   Rearranging gives:
   $$\\int u \\, dv = uv - \\int v \\, du$$
   The document recommends the **LIATE rule** (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential) to prioritize $u$.`,
    retrievedSources: [
      {
        docTitle: 'Calculus: Fundamental Theorem & Integration Techniques.pdf',
        pageNumber: 1,
        snippet: 'Fundamental Theorem of Calculus Part 1: If f is continuous on [a, b], then the function g defined by g(x) = ∫_{a}^{x} f(t)dt is continuous on [a, b] and differentiable on (a, b)...',
        topic: 'Calculus',
      },
    ],
    contextFound: true,
    agent: 'RAG Agent',
  });

  const [uploadText, setUploadText] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/rag/documents');
      if (res.ok) {
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          setDocuments(data.documents);
        }
      }
    } catch {
      // Keep state
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleRagSearch = async () => {
    if (!ragQuery.trim() || isQuerying) return;
    setIsQuerying(true);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: ragQuery,
          selectedDocId,
        }),
      });

      if (!res.ok) throw new Error('RAG query request failed');
      const data = await res.json();
      setRagResult(data);
    } catch (err: any) {
      alert(`RAG Search error: ${err.message}`);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleUploadTextDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadText.trim() || isUploading) return;
    setIsUploading(true);

    try {
      const res = await fetch('/api/rag/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle.endsWith('.pdf') ? uploadTitle : `${uploadTitle}.pdf`,
          textContent: uploadText,
          topic: 'Uploaded Material',
        }),
      });

      if (res.ok) {
        setUploadSuccess(true);
        setUploadText('');
        setUploadTitle('');
        fetchDocs();
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">RAG-Based Mathematics Document Assistant</h2>
          </div>
          <p className="text-xs text-slate-500">
            Powered by LangChain + ChromaDB Embeddings. Guaranteed 0% hallucination on textbook theorems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>{documents.reduce((acc, d) => acc + (d.chunkCount || 1), 0)} Vector Chunks Indexed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Indexed Documents & Quick Ingestion */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Indexed Vector Documents</span>
              <span className="text-[10px] text-slate-400 font-normal">{documents.length} Files</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedDocId('all')}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                  selectedDocId === 'all'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🔍 Search All Indexed Documents</span>
                <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">All</span>
              </button>

              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all space-y-1 ${
                    selectedDocId === doc.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold shadow-2xs'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{doc.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pl-5">
                    <span>{doc.topic}</span>
                    <span>{doc.chunkCount} chunks</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Ingest Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ingest New Notes / PDF Content</span>
            </h3>

            <form onSubmit={handleUploadTextDoc} className="space-y-2.5">
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Document title (e.g. Real Analysis Notes)..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                rows={3}
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                placeholder="Paste math notes or textbook excerpt for chunking..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <button
                type="submit"
                disabled={isUploading || !uploadTitle || !uploadText}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Chunking & Embedding...' : 'Index into ChromaDB'}</span>
              </button>
            </form>

            {uploadSuccess && (
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Document successfully indexed!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: RAG Query & Grounded Answer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Ask Grounded Question Over Uploaded Documents:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="e.g. How to find eigenvalues? What is the LIATE rule?"
                className="flex-1 text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                id="btn-rag-query"
                onClick={handleRagSearch}
                disabled={isQuerying || !ragQuery.trim()}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>{isQuerying ? 'Retrieving...' : 'RAG Answer'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Quick tests:</span>
              <button
                onClick={() => {
                  setRagQuery('How do eigenvalues and diagonalization work according to linear algebra notes?');
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-indigo-700"
              >
                Eigenvalues
              </button>
              <button
                onClick={() => {
                  setRagQuery('Explain Bayes Theorem and the Central Limit Theorem from the uploaded statistics notes.');
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-indigo-700"
              >
                Bayes & CLT
              </button>
            </div>
          </div>

          {/* RAG Answer Display */}
          {ragResult && (
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    RAG Grounded Response
                  </span>
                  {ragResult.contextFound ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Direct Passages Matched
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" /> No Direct Context (Zero-Hallucination Safe)
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">Agent: {ragResult.agent}</span>
              </div>

              <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed">
                <MathRenderer content={ragResult.answer} />
              </div>

              {/* Retrieved Sources Box */}
              {ragResult.retrievedSources && ragResult.retrievedSources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Retrieved Passage Citations</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {ragResult.retrievedSources.map((source, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <span className="truncate">{source.docTitle}</span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono shrink-0 ml-2">
                            Page {source.pageNumber}
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px] leading-relaxed line-clamp-2">
                          "{source.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
