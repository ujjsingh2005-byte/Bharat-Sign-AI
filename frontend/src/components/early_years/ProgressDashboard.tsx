import { useMemo } from "react";
import {
  EARLY_YEARS_SIGNS,
  EARLY_YEARS_CATEGORIES,
  type EarlyYearsSign,
  type EarlyYearsCategory,
} from "../../data/earlyYearsSignsData";
import {
  GraduationCap,
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  TrendingUp,
  BarChart3,
  Dumbbell,
  Play,
} from "lucide-react";

interface ProgressDashboardProps {
  learnedIds: Set<string>;
  recentlyPracticed: string[];
  totalSigns: number;
  signsLearnedCount: number;
  signsRemainingCount: number;
  progressPercentage: number;
  nextSignToLearn?: EarlyYearsSign;
  onToggleLearned: (id: string) => void;
  onSelectSign: (sign: EarlyYearsSign) => void;
  onContinueLearning: () => void;
  onReviseLearned: () => void;
  onPracticeUnlearned: () => void;
  onResetProgress: () => void;
}

export default function ProgressDashboard({
  learnedIds,
  recentlyPracticed,
  totalSigns,
  signsLearnedCount,
  signsRemainingCount,
  progressPercentage,
  nextSignToLearn,
  onToggleLearned,
  onSelectSign,
  onContinueLearning,
  onReviseLearned,
  onPracticeUnlearned,
  onResetProgress,
}: ProgressDashboardProps) {
  // Category progress breakdown
  const categoryStats = useMemo(() => {
    return EARLY_YEARS_CATEGORIES.filter((c) => c !== "All").map((cat) => {
      const signsInCat = EARLY_YEARS_SIGNS.filter((s) => s.category === cat);
      const learnedInCat = signsInCat.filter((s) => learnedIds.has(s.id)).length;
      const pct = Math.round((learnedInCat / (signsInCat.length || 1)) * 100);
      return {
        category: cat,
        total: signsInCat.length,
        learned: learnedInCat,
        percentage: pct,
      };
    });
  }, [learnedIds]);

  // Sourced recently practiced sign objects
  const recentSignObjects = useMemo(() => {
    return recentlyPracticed
      .map((id) => EARLY_YEARS_SIGNS.find((s) => s.id === id))
      .filter(Boolean) as EarlyYearsSign[];
  }, [recentlyPracticed]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Banner & Progress Callout */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900/90 border border-indigo-500/30 p-6 md:p-8 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Early Years Learning Journey
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Everyday Things We Do: Progress Tracker
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Master all 16 foundational everyday action signs in British Sign Language (BSL / EYFS) with verified steps and Hindi translations.
            </p>
          </div>

          {/* Quick Continue Learning Action Card */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center w-full md:w-auto min-w-[220px] space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Ready to learn next?
            </div>
            {nextSignToLearn ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                    #{nextSignToLearn.order}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-black text-white leading-tight">{nextSignToLearn.word}</p>
                    <p className="text-[11px] text-indigo-400 font-semibold">{nextSignToLearn.hindi}</p>
                  </div>
                </div>
                <button
                  onClick={onContinueLearning}
                  className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="text-xs font-bold">All 16 Signs Learned!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Signs */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Inventory</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl md:text-4xl font-black text-white">{totalSigns}</p>
          <p className="text-[11px] text-slate-400 font-medium">Standard Early Years signs</p>
        </div>

        {/* Metric 2: Signs Learned */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Signs Learned</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl md:text-4xl font-black text-emerald-400">{signsLearnedCount}</p>
          <p className="text-[11px] text-slate-400 font-medium">Marked verified by learner</p>
        </div>

        {/* Metric 3: Signs Remaining */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Signs Remaining</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-3xl md:text-4xl font-black text-amber-400">{signsRemainingCount}</p>
          <p className="text-[11px] text-slate-400 font-medium">Awaiting practice</p>
        </div>

        {/* Metric 4: Progress Percentage */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {progressPercentage}%
          </p>
          {/* Linear bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onContinueLearning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continue Learning Next Sign</span>
          </button>

          <button
            onClick={onReviseLearned}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Revise Learned Signs ({signsLearnedCount})</span>
          </button>

          <button
            onClick={onPracticeUnlearned}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <span>Practice Remaining ({signsRemainingCount})</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset your learning progress?")) {
              onResetProgress();
            }
          }}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
        >
          Reset Learning Progress
        </button>
      </div>

      {/* Two Column Section: Category Breakdown + Recently Practiced */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Mastery */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-black text-white">Category Mastery Breakdown</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">5 Categories</span>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-200">{stat.category}</span>
                  <span className="text-indigo-400 font-black">
                    {stat.learned} / {stat.total} ({stat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      stat.percentage === 100
                        ? "bg-emerald-500"
                        : stat.percentage > 0
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                        : "bg-slate-700"
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recently Practiced Signs */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">Recently Practiced Signs</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">{recentSignObjects.length} active</span>
          </div>

          {recentSignObjects.length > 0 ? (
            <div className="space-y-2">
              {recentSignObjects.map((sign) => (
                <div
                  key={sign.id}
                  onClick={() => onSelectSign(sign)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={sign.image}
                      alt={sign.word}
                      className="w-10 h-10 object-contain rounded-xl bg-slate-900 border border-slate-800 p-1"
                    />
                    <div>
                      <p className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">
                        {sign.word}
                      </p>
                      <p className="text-[10px] text-slate-400">{sign.hindi} • #{sign.order}</p>
                    </div>
                  </div>

                  <span className="text-xs text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No recent practice sessions recorded yet. Start practicing to track your activity!
            </p>
          )}
        </div>
      </div>

      {/* 16 Signs Quick Mastery Grid: Toggle Learned Directly */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white">16 Signs Inventory Checklist</h3>
            <p className="text-xs text-slate-400">Click any checkmark to instantly mark or unmark a sign as learned.</p>
          </div>
          <span className="text-xs font-bold text-indigo-400">
            {signsLearnedCount} of 16 Complete
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {EARLY_YEARS_SIGNS.map((sign) => {
            const learned = learnedIds.has(sign.id);
            return (
              <div
                key={sign.id}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  learned
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-950/60 border-slate-800 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black text-indigo-400">#{sign.order}</span>
                  <button
                    onClick={() => onToggleLearned(sign.id)}
                    className="cursor-pointer"
                    title={learned ? "Unmark" : "Mark as learned"}
                  >
                    {learned ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                </div>
                <div
                  onClick={() => onSelectSign(sign)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={sign.image}
                    alt={sign.word}
                    className="w-10 h-10 object-contain mx-auto my-1"
                  />
                  <p className="text-xs font-extrabold text-white truncate">{sign.word}</p>
                  <p className="text-[10px] text-slate-400 truncate">{sign.hindi}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
