"""
AI Quiz Generator for adaptive mathematics testing.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import json
from typing import Dict, Any
from src.llm import generate_math_response
from src.prompts import QUIZ_PROMPT

class QuizGenerator:
    """Generates structured multiple-choice and numerical questions."""

    def generate_quiz(self, topic: str = "Calculus", difficulty: str = "Intermediate", count: int = 4) -> Dict[str, Any]:
        """Generates mathematics quiz in JSON format."""
        prompt = f"""Generate a {count}-question mathematics quiz on the topic '{topic}' at the '{difficulty}' level.
Include a balanced mix of multiple choice questions and numerical computation questions.
Ensure all LaTeX formulas are properly formatted."""

        raw_response = generate_math_response(
            prompt=prompt,
            system_instruction=QUIZ_PROMPT,
            temperature=0.3,
            response_mime_type="application/json"
        )

        try:
            return json.loads(raw_response)
        except Exception:
            return {
                "quizTitle": f"{difficulty} {topic} Quiz",
                "topic": topic,
                "difficulty": difficulty,
                "questions": []
            }
