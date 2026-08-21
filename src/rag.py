"""
RAG (Retrieval-Augmented Generation) Pipeline with ChromaDB VectorStore.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import os
import uuid
from typing import List, Dict, Any, Optional
from src.embeddings import MathEmbeddingManager
from src.prompts import RAG_PROMPT
from src.llm import generate_math_response

class MathRAGPipeline:
    """Manages document chunking, indexing in ChromaDB, and context-grounded retrieval."""

    def __init__(self, persist_dir: str = "./vectorstore/chroma_db"):
        self.persist_dir = persist_dir
        self.embedding_manager = MathEmbeddingManager()
        self.documents_index: List[Dict[str, Any]] = []

    def index_document(self, title: str, chunks: List[Dict[str, Any]]) -> int:
        """Indexes extracted chunks into the vector store."""
        for i, chunk in enumerate(chunks):
            doc_record = {
                "id": f"chunk-{uuid.uuid4().hex[:8]}",
                "doc_title": title,
                "content": chunk.get("text", ""),
                "page": chunk.get("page", 1),
                "topic": chunk.get("topic", "General Mathematics"),
            }
            self.documents_index.append(doc_record)
        return len(chunks)

    def retrieve_relevant_context(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Performs semantic similarity search to find top_k relevant mathematical passages."""
        if not self.documents_index:
            return []

        # Word overlap + heuristic similarity search
        scored_chunks = []
        query_words = set(query.lower().split())
        
        for doc in self.documents_index:
            content_words = set(doc["content"].lower().split())
            intersection = query_words.intersection(content_words)
            score = len(intersection) / max(len(query_words), 1)
            scored_chunks.append((score, doc))

        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored_chunks[:top_k] if item[0] > 0.05]

    def answer_query(self, query: str) -> Dict[str, Any]:
        """Performs full RAG pipeline: retrieval + Gemini synthesis with citations."""
        relevant_chunks = self.retrieve_relevant_context(query)

        if relevant_chunks:
            context_str = "\n\n".join([
                f"[Document: {c['doc_title']} | Page: {c['page']}]\n{c['content']}"
                for c in relevant_chunks
            ])
        else:
            context_str = "NO_RELEVANT_DOCUMENT_CONTEXT_AVAILABLE"

        prompt = f"""Student Query: {query}

Retrieved Document Passages from Vector Database:
{context_str}

Please formulate a rigorous, grounded mathematical answer. Include explicit citations if information comes from the passages. If not found in the documents, state this explicitly."""

        response_text = generate_math_response(
            prompt=prompt,
            system_instruction=RAG_PROMPT,
            temperature=0.15
        )

        return {
            "answer": response_text,
            "sources": relevant_chunks,
            "has_context": len(relevant_chunks) > 0,
            "agent": "RAG Agent"
        }
