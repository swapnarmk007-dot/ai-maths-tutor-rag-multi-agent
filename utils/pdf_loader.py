"""
PDF Document Loader, Text Cleaner, and Chunker for RAG pipeline.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import io
import re
from typing import List, Dict, Any

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """Extracts text page-by-page from raw PDF binary data."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(pdf_bytes))
        pages_content = []
        for idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            cleaned = clean_math_text(text)
            if cleaned:
                pages_content.append({
                    "page": idx + 1,
                    "text": cleaned
                })
        return pages_content
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return []

def clean_math_text(text: str) -> str:
    """Cleans extracted mathematical text, fixing broken hyphens and whitespace."""
    # Fix hyphenated words across line breaks
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
    # Remove multiple whitespace while preserving paragraph breaks
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def chunk_text_by_paragraphs(pages: List[Dict[str, Any]], chunk_size: int = 500, overlap: int = 100) -> List[Dict[str, Any]]:
    """Splits extracted page text into meaningful semantic mathematical chunks."""
    chunks = []
    for page in pages:
        page_num = page.get("page", 1)
        raw_text = page.get("text", "")
        paragraphs = raw_text.split("\n\n")
        
        current_chunk = ""
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            if len(current_chunk) + len(para) > chunk_size:
                if current_chunk:
                    chunks.append({
                        "page": page_num,
                        "text": current_chunk.strip()
                    })
                current_chunk = para
            else:
                current_chunk += "\n\n" + para if current_chunk else para
                
        if current_chunk:
            chunks.append({
                "page": page_num,
                "text": current_chunk.strip()
            })
            
    return chunks
