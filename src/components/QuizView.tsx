import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  BarChart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz, QuizEvaluation, MathTopic } from '../types';
import { MathRenderer } from './MathRenderer';

export const QuizView: React.FC = () => {
  const [topic, setTopic] = useState<MathTopic>('Calculus');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [quiz, setQuiz] = useState<Quiz | null>({
    quizTitle: 'Intermediate Calculus Diagnostic Assessment',
    topic: 'Calculus',
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is the derivative of $f(x) = x^3 \\ln(x)$ with respect to $x$?',
        options: [
          'A) $3x^2 \\ln(x) + x^2$',
          'B) $3x^2 \\ln(x) + x^3$',
          'C) $\\frac{3x^2}{x}$',
          'D) $x^2 \\ln(x) + 3x^2$',
        ],
        correctAnswer: 'A) $3x^2 \\ln(x) + x^2$',
        correctOptionIndex: 0,
        explanation: 'By the Product Rule: $\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'$. Here $u = x^3 \\implies u\' = 3x^2$ and $v = \\ln(x) \\implies v\' = \\frac{1}{x}$. Thus $f\'(x) = (3x^2)\\ln(x) + x^3(1/x) = 3x^2\\ln(x) + x^2$.',
        keyConcept: 'Product Rule of Differentiation',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Evaluate the definite integral $\\int_0^{\\pi} \\sin(x) \\, dx$.',
        options: ['A) $0$', 'B) $1$', 'C) $2$', 'D) $-2$'],
        correctAnswer: 'C) $2$',
        correctOptionIndex: 2,
        explanation: 'The antiderivative of $\\sin(x)$ is $-\\cos(x)$. Evaluating from $0$ to $\\pi$: $[-\\cos(\\pi)] - [-\\cos(0)] = [-(-1)] - [-1] = 1 + 1 = 2$.',
        keyConcept: 'Definite Integration & Fundamental Theorem',
      },
      {
        id: 'q3',
        type: 'numerical',
        question: 'Find the limit: $\\lim_{x \\to 0} \\frac{\\sin(4x)}{x}$. Enter the numerical value.',
        correctAnswer: '4',
        explanation: 'Using the fundamental trigonometric limit $\\lim_{u \\to 0} \\frac{\\sin(u)}{u} = 1$, we rewrite as $4 \\lim_{x \\to 0} \\frac{\\sin(4x)}{4x} = 4(1) = 4$. Alternatively, applying L\'Hôpital\'s Rule gives $\\lim_{x \\to 0} \\frac{4\\cos(4x)}{1} = 4(1) = 4$.',
        keyConcept: 'Trigonometric Limits & L\'Hôpital\'s Rule',
      },
    ],
  });

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({
    q1: 'A) $3x^2 \\ln(x) + x^2$',
    q2: 'C) $2$',
    q3: '4',
  });

  const [evaluation, setEvaluation] = useState<QuizEvaluation | null>(null);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setEvaluation(null);
    setUserAnswers({});

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount,
        }),
      });

      const data = await res.json();
      if (data.quiz) {
        setQuiz(data.quiz);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error('Quiz generator error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: quiz.questions,
          userAnswers,
          topic: quiz.topic,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        if (data.evaluation.percentage >= 75) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Generator Controls */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Mathematics Quiz & Assessment</h2>
              <p className="text-xs text-slate-500">
                Automated problem generation, answer grading, error diagnosis, and study plan generator.
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
            Quiz Agent & Evaluator Agent
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
              Topic Domain:
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as MathTopic)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Calculus">Calculus</option>
              <option value="Linear Algebra">Linear Algebra</option>
              <option value="Probability & Statistics">Probability & Statistics</option>
              <option value="Algebra">Algebra</option>
              <option value="Trigonometry">Trigonometry</option>
              <option value="Differential Equations">Differential Equations</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
              Target Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Beginner">Beginner (Foundations)</option>
              <option value="Intermediate">Intermediate (College Level)</option>
              <option value="Advanced">Advanced (Rigorous Proofs)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
              Number of Questions: ({questionCount})
            </label>
            <input
              type="range"
              min={2}
              max={6}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            id="btn-generate-quiz"
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-xs"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Designing Assessment...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Diagnostic Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Quiz Test Taker */}
      {quiz && (
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">{quiz.quizTitle}</h3>
              <p className="text-xs text-slate-500">
                {quiz.topic} • {quiz.difficulty} • {quiz.questions.length} Questions
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              In Progress
            </span>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 md:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {q.type === 'multiple-choice' ? 'Multiple Choice' : 'Numerical Entry'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Concept: {q.keyConcept}</span>
                </div>

                <div className="text-slate-900 text-sm md:text-base font-medium pl-8">
                  <MathRenderer content={q.question} />
                </div>

                {/* Question Options or Numerical input */}
                <div className="pl-8 pt-2">
                  {q.type === 'multiple-choice' && q.options ? (
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                            userAnswers[q.id] === opt
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-medium shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz_${q.id}`}
                            value={opt}
                            checked={userAnswers[q.id] === opt}
                            onChange={(e) =>
                              setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span className="flex-1">
                            <MathRenderer content={opt} />
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="max-w-md">
                      <input
                        type="text"
                        value={userAnswers[q.id] || ''}
                        onChange={(e) =>
                          setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        placeholder="Enter numerical answer or simplified value..."
                        className="w-full text-sm p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              id="btn-submit-evaluation"
              onClick={handleSubmitQuiz}
              disabled={isEvaluating}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xs"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluator Agent Grading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Evaluate Answers</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Evaluation Results Banner */}
      {evaluation && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                    Diagnostic Score Report
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {evaluation.totalScore} / {evaluation.maxScore} Correct ({evaluation.percentage}%)
                  </h3>
                </div>
              </div>

              <div className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20 text-sm font-bold text-emerald-300 self-start sm:self-auto">
                {evaluation.overallVerdict}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
              {evaluation.summaryFeedback}
            </p>
          </div>

          {/* Breakdown per question */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Question-by-Question Diagnostic
            </h4>

            <div className="space-y-4">
              {quiz?.questions.map((q, idx) => {
                const evalItem = evaluation.questionEvaluations.find((e) => e.questionId === q.id);
                const isCorrect = evalItem?.isCorrect ?? false;
                const studentAns = userAnswers[q.id] || 'Not answered';

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900">
                          Question {idx + 1}: {q.keyConcept}
                        </span>
                      </div>
                      {evalItem && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {evalItem.mistakeType === 'None' ? 'Correct' : `${evalItem.mistakeType} Mistake`}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-800 pl-7">
                      <div className="mb-1">
                        <strong>Problem:</strong> <MathRenderer content={q.question} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Your Answer:</span>
                          <span className={isCorrect ? 'text-emerald-800 font-medium' : 'text-rose-800 font-medium'}>
                            <MathRenderer content={studentAns} />
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Correct Solution:</span>
                          <span className="text-slate-900 font-medium">
                            <MathRenderer content={q.correctAnswer} />
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="mt-2.5 p-3 rounded-lg bg-white border border-slate-200/80 text-slate-700">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 block mb-1">
                          Step-by-Step Derivation:
                        </span>
                        <MathRenderer content={q.explanation} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations Box */}
          {evaluation.recommendedStudyTopics && evaluation.recommendedStudyTopics.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Personalized Recommended Study Topics</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evaluation.recommendedStudyTopics.map((rec, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                    <span className="text-xs font-bold text-indigo-950 block">{rec.topic}</span>
                    <p className="text-[11px] text-indigo-900/80 leading-snug">{rec.reason}</p>
                    <span className="text-[10px] text-indigo-600 font-semibold block pt-1">
                      👉 Action: {rec.recommendedAction}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
