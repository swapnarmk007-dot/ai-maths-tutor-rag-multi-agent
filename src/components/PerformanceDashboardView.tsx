import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowUpRight,
  Flame,
  Brain,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from 'recharts';

export const PerformanceDashboardView: React.FC = () => {
  const topicMasteryData = [
    { topic: 'Calculus', mastery: 94, questions: 28, color: '#4F46E5' },
    { topic: 'Algebra', mastery: 89, questions: 22, color: '#6366F1' },
    { topic: 'Linear Algebra', mastery: 82, questions: 18, color: '#818CF8' },
    { topic: 'Trigonometry', mastery: 78, questions: 15, color: '#A5B4FC' },
    { topic: 'Probability', mastery: 68, questions: 14, color: '#F59E0B' },
    { topic: 'Diff. Equations', mastery: 74, questions: 12, color: '#10B981' },
  ];

  const accuracyTimelineData = [
    { session: 'Quiz 1', accuracy: 65 },
    { session: 'Quiz 2', accuracy: 70 },
    { session: 'Quiz 3', accuracy: 78 },
    { session: 'Quiz 4', accuracy: 82 },
    { session: 'Quiz 5', accuracy: 85 },
    { session: 'Quiz 6', accuracy: 91 },
  ];

  const weakTopics = [
    {
      topic: 'Continuous Random Variables & Bayes Theorem',
      issue: 'Integration limits on continuous probability density functions.',
      action: 'Practice 4 problems on CDF/PDF integration and conditional expectation.',
    },
    {
      topic: 'Second-Order Non-Homogeneous Differential Equations',
      issue: 'Undetermined coefficients vs. Variation of parameters choice.',
      action: 'Review formula assistant integrating factor and characteristic roots.',
    },
  ];

  const strongTopics = [
    'Fundamental Theorem of Calculus Part 1 & 2',
    'Matrix Eigenvalue Calculation & Characteristic Polynomials',
    'Product Rule & Integration by Parts (LIATE)',
    'Quadratic Discriminant & Extreme Value Theorems',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Personalized Learning Analytics</h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time mastery tracking, error classification patterns, and predictive study roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-emerald-600" />
            <span>5-Day Active Streak</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Questions Attempted</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">109</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14 this week
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Overall Accuracy</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">86.2%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.5% improvement
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Concepts Mastered</span>
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">18 / 24</div>
          <div className="text-[11px] text-slate-400 font-medium">75% syllabus covered</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>SymPy Verifications</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">42 Proofs</div>
          <div className="text-[11px] text-indigo-600 font-semibold">100% exact match</div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Mastery Bar Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Topic-Wise Mastery Index (%)
            </h3>
            <span className="text-[11px] text-slate-400">Target: &gt;80%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicMasteryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="topic" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val}% Mastery`, 'Score']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="mastery" radius={[0, 6, 6, 0]}>
                  {topicMasteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.mastery >= 80 ? '#4F46E5' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Timeline Line Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Assessment Accuracy Progression
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">+26% Total Gain</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTimelineData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="session" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}% Accuracy`, 'Score']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10B981' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Diagnostics: Strengths vs. Remedial Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Weak Topics & Prescribed Study */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Prescribed Focus Areas (Next Study Session)</span>
          </div>

          <div className="space-y-3">
            {weakTopics.map((w, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <div className="text-xs font-bold text-amber-950">{w.topic}</div>
                <div className="text-[11px] text-amber-900/80 leading-snug">
                  <strong>Diagnostic note:</strong> {w.issue}
                </div>
                <div className="text-[11px] text-indigo-700 font-medium pt-1">
                  👉 <strong>Recommended action:</strong> {w.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mastered Strengths */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstrated Strong Competencies</span>
          </div>

          <div className="space-y-2">
            {strongTopics.map((s, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-950 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
