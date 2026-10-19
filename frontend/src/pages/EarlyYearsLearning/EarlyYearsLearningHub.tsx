import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  EARLY_YEARS_SIGNS,
  type EarlyYearsSign,
  type EarlyYearsCategory,
} from "../../data/earlyYearsSignsData";
import { useEarlyYearsProgress } from "../../hooks/useEarlyYearsProgress";
import SignGrid from "../../components/early_years/SignGrid";
import SignDetail from "../../components/early_years/SignDetail";
import MovementViewer from "../../components/early_years/MovementViewer";
import MasterPosterViewer from "../../components/early_years/MasterPosterViewer";
import PracticeMode, { type PracticeActivity } from "../../components/early_years/PracticeMode";
import ProgressDashboard from "../../components/early_years/ProgressDashboard";
import {
  LayoutGrid,
  FileImage,
  BookOpen,
  Dumbbell,
  GraduationCap,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export type HubTab =
  | "all_signs"
  | "poster_view"
  | "sign_detail"
  | "practice"
  | "quiz"
  | "dashboard";

export default function EarlyYearsLearningHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Progress hook with localStorage persistence
  const {
    learnedIds,
    recentlyPracticed,
    totalSigns,
    signsLearnedCount,
    signsRemainingCount,
    progressPercentage,
    nextSignToLearn,
    toggleLearned,
    markLearned,
    recordPractice,
    addQuizResult,
    resetAllProgress,
  } = useEarlyYearsProgress();

  // Active Hub Tab from URL search params or state
  const tabParam = (searchParams.get("tab") as HubTab) || "all_signs";
  const signIdParam = searchParams.get("sign") || "drink";

  const [activeTab, setActiveTab] = useState<HubTab>(tabParam);
  const [selectedSign, setSelectedSign] = useState<EarlyYearsSign>(() => {
    return (
      EARLY_YEARS_SIGNS.find((s) => s.id === signIdParam) ||
      EARLY_YEARS_SIGNS[0]
    );
  });

  const [practiceActivity, setPracticeActivity] = useState<PracticeActivity>("word_recognition");

  // Sync tab with URL
  const setTab = (tab: HubTab, signId?: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    if (signId) {
      params.set("sign", signId);
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Watch sign click from card
  const handleWatchSign = (sign: EarlyYearsSign) => {
    setSelectedSign(sign);
    recordPractice(sign.id);
    setTab("sign_detail", sign.id);
  };

  // Practice sign click from card
  const handlePracticeSign = (sign: EarlyYearsSign) => {
    setSelectedSign(sign);
    recordPractice(sign.id);
    setPracticeActivity("movement_review");
    setTab("practice", sign.id);
  };

  // Select sign from list or poster
  const handleSelectSign = (sign: EarlyYearsSign) => {
    setSelectedSign(sign);
    recordPractice(sign.id);
    setTab("sign_detail", sign.id);
  };

  // Navigation from dashboard buttons
  const handleContinueLearning = () => {
    if (nextSignToLearn) {
      handleSelectSign(nextSignToLearn);
    } else {
      setTab("all_signs");
    }
  };

  const handleReviseLearned = () => {
    setTab("all_signs");
  };

  const handlePracticeUnlearned = () => {
    setPracticeActivity("revision_mode");
    setTab("practice");
  };

  const handleQuizComplete = (score: number, total: number, mode: string) => {
    addQuizResult({
      date: new Date().toISOString(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
      mode,
    });
  };

  return (
    <div className="bg-[#050816] text-white min-h-screen selection:bg-indigo-600 selection:text-white flex flex-col">
      <Navbar />

      {/* Hero Header for Early Years Hub */}
      <header className="relative border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span>Interactive Learning</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-indigo-400 font-bold">Early Years Everyday Signs (16)</span>
          </div>

          {/* Title & Quick Stats Ribbon */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  EARLY YEARS - EVERYDAY THINGS WE DO
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                  16 Verified Signs
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                Interactive Sign Language Learning App
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Learn what each of the 16 everyday action signs means, how its verified BSL / EYFS gesture is performed with Hindi translations, step-by-step movement tutorials, interactive practice quizzes, and persistent progress tracking.
              </p>
            </div>

            {/* Quick Progress Dial */}
            <div
              onClick={() => setTab("dashboard")}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer shadow-xl flex items-center gap-4 shrink-0"
              title="Click to view detailed progress dashboard"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-600/30">
                {progressPercentage}%
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{signsLearnedCount} of {totalSigns} Learned</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {signsRemainingCount} signs remaining
                </div>
              </div>
            </div>
          </div>

          {/* Top Main Navigation Tabs */}
          <nav
            className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none border-t border-slate-800/80"
            aria-label="Early Years Learning Tabs"
          >
            {/* Tab 1: All Signs Grid */}
            <button
              onClick={() => setTab("all_signs")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "all_signs"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>1. All 16 Signs Gallery</span>
            </button>

            {/* Tab 2: Full Poster View */}
            <button
              onClick={() => setTab("poster_view")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "poster_view"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <FileImage className="w-4 h-4" />
              <span>2. Full Reference Poster</span>
            </button>

            {/* Tab 3: Sign Details & Movement Viewer */}
            <button
              onClick={() => setTab("sign_detail")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "sign_detail"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3. Sign Details &amp; Movement</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300">
                {selectedSign.word}
              </span>
            </button>

            {/* Tab 4: Practice Suite */}
            <button
              onClick={() => {
                setPracticeActivity("word_recognition");
                setTab("practice");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "practice"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>4. Practice Modes (5 Activities)</span>
            </button>

            {/* Tab 5: Gamified Quiz */}
            <button
              onClick={() => {
                setPracticeActivity("sign_recognition");
                setTab("quiz");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>5. Sign Quiz</span>
            </button>

            {/* Tab 6: Learning Dashboard */}
            <button
              onClick={() => setTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>6. Progress Dashboard</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {/* ========================================================= */}
        {/* TAB 1: ALL 16 SIGNS GALLERY */}
        {/* ========================================================= */}
        {activeTab === "all_signs" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white">All 16 Early Years Action Signs</h2>
                <p className="text-xs text-slate-400">
                  Organized in the exact sequence 1 to 16 as shown on the original "EARLY YEARS - EVERYDAY THINGS WE DO" chart.
                </p>
              </div>
            </div>

            <SignGrid
              learnedIds={learnedIds}
              onToggleLearned={toggleLearned}
              onWatchSign={handleWatchSign}
              onPracticeSign={handlePracticeSign}
              onSelectSign={handleSelectSign}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FULL REFERENCE POSTER */}
        {/* ========================================================= */}
        {activeTab === "poster_view" && (
          <div className="space-y-6 animate-fadeIn">
            <MasterPosterViewer onSelectSign={handleSelectSign} />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SIGN DETAILS & MOVEMENT TUTORIAL */}
        {/* ========================================================= */}
        {activeTab === "sign_detail" && (
          <div className="space-y-6 animate-fadeIn">
            <SignDetail
              sign={selectedSign}
              isLearned={learnedIds.has(selectedSign.id)}
              onToggleLearned={toggleLearned}
              onPracticeSign={handlePracticeSign}
              onNavigateSign={(next) => {
                setSelectedSign(next);
                recordPractice(next.id);
                setSearchParams({ tab: "sign_detail", sign: next.id });
              }}
              onBackToGrid={() => setTab("all_signs")}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PRACTICE MODES (5 ACTIVITIES) */}
        {/* ========================================================= */}
        {activeTab === "practice" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1 mb-6">
              <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                Interactive Practice Studio
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Practice &amp; Strengthen Your Sign Recall
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Test your knowledge through Word Recognition, Meaning Recognition, Movement Review, or focus purely on unlearned signs.
              </p>
            </div>

            <PracticeMode
              learnedIds={learnedIds}
              onMarkLearned={markLearned}
              onRecordPractice={recordPractice}
              onCompleteQuiz={handleQuizComplete}
              initialActivity={practiceActivity}
              focusedSignId={selectedSign.id}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: GAMIFIED QUIZ */}
        {/* ========================================================= */}
        {activeTab === "quiz" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1 mb-6">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                Comprehensive Assessment
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Everyday Actions Sign Language Quiz
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Challenge yourself to identify gestures and movements across all 16 signs to record your score in your history.
              </p>
            </div>

            <PracticeMode
              learnedIds={learnedIds}
              onMarkLearned={markLearned}
              onRecordPractice={recordPractice}
              onCompleteQuiz={handleQuizComplete}
              initialActivity="sign_recognition"
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: PROGRESS DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            <ProgressDashboard
              learnedIds={learnedIds}
              recentlyPracticed={recentlyPracticed}
              totalSigns={totalSigns}
              signsLearnedCount={signsLearnedCount}
              signsRemainingCount={signsRemainingCount}
              progressPercentage={progressPercentage}
              nextSignToLearn={nextSignToLearn}
              onToggleLearned={toggleLearned}
              onSelectSign={handleSelectSign}
              onContinueLearning={handleContinueLearning}
              onReviseLearned={handleReviseLearned}
              onPracticeUnlearned={handlePracticeUnlearned}
              onResetProgress={resetAllProgress}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
