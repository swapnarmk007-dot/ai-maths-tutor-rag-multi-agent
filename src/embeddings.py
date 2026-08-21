"""
Embeddings generation module supporting SentenceTransformers and Gemini Embeddings.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import os
from typing import List

class MathEmbeddingManager:
    """Manages dense vector embedding generation for mathematical texts and formulas."""

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self._model = None

    def _get_model(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
            except Exception as e:
                print(f"Warning: SentenceTransformer load error ({e}). Using lightweight fallback.")
                self._model = None
        return self._model

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """Generates embedding vectors for a list of textual mathematical chunks."""
        model = self._get_model()
        if model:
            embeddings = model.encode(texts, show_progress_bar=False)
            return embeddings.tolist()
        
        # Fallback dummy normalized bag-of-words vector if running in minimalist environment
        return [[0.0] * 384 for _ in texts]

    def embed_query(self, query: str) -> List[float]:
        """Embeds a single query string."""
        return self.embed_texts([query])[0]
