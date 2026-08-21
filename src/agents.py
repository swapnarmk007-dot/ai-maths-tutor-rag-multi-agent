"""
Multi-Agent Orchestrator and Supervisor Architecture.
Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
"""

import json
from typing import Dict, Any, List
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
        supervisor_prompt = f"""User Mathematics Query: "{user_query}"
Explanation Level: {level}

Analyze the request, decide the primary agent, establish routing confidence, and devise execution plan."""

        raw_supervisor = generate_math_response(
            prompt=supervisor_prompt,
            system_instruction=SUPERVISOR_PROMPT,
            temperature=0.1,
            response_mime_type="application/json"
        )

        try:
            plan = json.loads(raw_supervisor)
        except Exception:
            plan = {
                "selected_agent": "Explanation Agent",
                "confidence_score": 0.90,
                "reasoning": "Standard mathematical query routed to Explanation Agent.",
                "query_plan": ["Classify topic", "Generate comprehensive mathematical breakdown"]
            }

        agent_name = plan.get("selected_agent", "Explanation Agent")

        # Execute chosen agent pipeline
        if "Solver" in agent_name:
            result = self.solver.solve_problem(user_query)
            final_content = f"### Final Answer\n{result.get('finalAnswer')}\n\n"
            for step in result.get("steps", []):
                final_content += f"**Step {step.get('stepNumber')}: {step.get('title')}**\n{step.get('explanation')}\n{step.get('formula')}\n\n"
            execution_output = final_content
        elif "RAG" in agent_name:
            rag_res = self.rag.answer_query(user_query)
            execution_output = rag_res.get("answer", "")
        elif "Quiz" in agent_name:
            quiz_res = self.quiz.generate_quiz(topic="Calculus", difficulty=level)
            execution_output = f"Generated Quiz: {quiz_res.get('quizTitle')}"
        else:
            # Explanation Agent
            prompt = f"Explain the following mathematical query at {level} level: {user_query}"
            execution_output = generate_math_response(
                prompt=prompt,
                system_instruction=EXPLANATION_PROMPT,
                temperature=0.2
            )

        return {
            "supervisor_plan": plan,
            "selected_agent": agent_name,
            "execution_output": execution_output
        }
