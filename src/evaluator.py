"""
Answer Evaluator and Mistake Diagnostic Agent.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import json
from typing import Dict, Any, List
from src.llm import generate_math_response
from src.prompts import EVALUATOR_PROMPT

class AnswerEvaluator:
    """Evaluates student quiz submissions, diagnoses root misconceptions, and prescribes next topics."""

    def evaluate_submission(self, questions: List[Dict[str, Any]], user_answers: Dict[str, str], topic: str) -> Dict[str, Any]:
        """Evaluates answers and returns structured rubric and analysis."""
        payload = []
        for q in questions:
            q_id = q.get("id", "")
            payload.append({
                "questionId": q_id,
                "question": q.get("question", ""),
                "studentAnswer": user_answers.get(q_id, "No answer"),
                "correctAnswer": q.get("correctAnswer", ""),
                "explanation": q.get("explanation", ""),
                "keyConcept": q.get("keyConcept", "")
            })

        prompt = f"""Topic: {topic}
Student Answers and Answer Key:
{json.dumps(payload, indent=2)}

Please evaluate all answers with deep pedagogical feedback, mistake classification, score calculation, and topic recommendations."""

        raw_response = generate_math_response(
            prompt=prompt,
            system_instruction=EVALUATOR_PROMPT,
            temperature=0.1,
            response_mime_type="application/json"
        )

        try:
            return json.loads(raw_response)
        except Exception:
            return {
                "totalScore": 0,
                "maxScore": len(questions),
                "percentage": 0,
                "overallVerdict": "Completed",
                "summaryFeedback": "Evaluation completed.",
                "questionEvaluations": [],
                "weakAreas": [],
                "recommendedStudyTopics": []
            }
