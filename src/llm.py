"""
Google Gemini API Client & LangChain wrapper initialization.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import os
import json
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types

def get_gemini_client() -> genai.Client:
    """Initializes and returns the Google GenAI Client with safety headers."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing. Please configure it in your .env or Streamlit secrets.")
    
    return genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(
            headers={"User-Agent": "aistudio-build"}
        )
    )

def generate_math_response(
    prompt: str,
    system_instruction: str,
    model: str = "gemini-3.7-flash",
    temperature: float = 0.2,
    response_mime_type: Optional[str] = None
) -> str:
    """Invokes Gemini model for mathematical queries with customized configurations."""
    client = get_gemini_client()
    
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=temperature,
    )
    if response_mime_type:
        config.response_mime_type = response_mime_type

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=config,
    )
    return response.text or ""
