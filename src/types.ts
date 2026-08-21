/**
 * Global TypeScript interfaces for AI Maths Tutor
 * Developer: Swapna V | Agentic AI Engineer | IPEC Solutions
 */

export type ExplanationLevel = 'beginner' | 'intermediate' | 'advanced';

export type MathTopic =
  | 'General Mathematics'
  | 'Calculus'
  | 'Algebra'
  | 'Trigonometry'
  | 'Linear Algebra'
  | 'Probability & Statistics'
  | 'Differential Equations'
  | 'Real Analysis'
  | 'Complex Analysis';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  level?: ExplanationLevel;
  topic?: string;
  agent?: string;
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
}

export interface MathSolution {
  problemStatement: string;
  category: string;
  difficulty: string;
  steps: SolutionStep[];
  finalAnswer: string;
  sympyCode: string;
  verifiedResult: string;
  verificationStatus: 'VERIFIED_EXACT' | 'NUMERICALLY_CONFIRMED';
  alternativeMethods?: string;
  commonMistakes?: string[];
  localSymPyExecution?: string;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  content: string;
  pageNumber?: number;
  topic?: string;
}

export interface StoredDocument {
  id: string;
  title: string;
  fileSize: number;
  uploadedAt: string;
  chunkCount: number;
  topic: string;
}

export interface RAGSource {
  docTitle: string;
  pageNumber: number;
  snippet: string;
  topic?: string;
}

export interface RAGResponse {
  answer: string;
  retrievedSources: RAGSource[];
  contextFound: boolean;
  agent: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'numerical';
  question: string;
  options?: string[];
  correctAnswer: string;
  correctOptionIndex?: number;
  explanation: string;
  keyConcept: string;
}

export interface Quiz {
  quizTitle: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface QuestionEvaluation {
  questionId: string;
  isCorrect: boolean;
  score: number;
  mistakeType: 'None' | 'Conceptual' | 'Calculation' | 'Sign Error' | 'Incomplete';
  detailedFeedback: string;
  remedialAdvice: string;
}

export interface QuizEvaluation {
  totalScore: number;
  maxScore: number;
  percentage: number;
  overallVerdict: string;
  summaryFeedback: string;
  questionEvaluations: QuestionEvaluation[];
  weakAreas: string[];
  recommendedStudyTopics: Array<{
    topic: string;
    reason: string;
    recommendedAction: string;
  }>;
}

export interface SupervisorTraceStep {
  stage: string;
  detail: string;
}

export interface SupervisorResult {
  selectedAgent: string;
  confidence: number;
  supervisorReasoning: string;
  routingTrace: SupervisorTraceStep[];
  agentResponse: string;
}

export interface FormulaItem {
  name: string;
  formula: string;
  desc: string;
  category: string;
}
