import { useState, useMemo, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Camera,
  Gauge,
  Hand,
  Video,
} from "lucide-react";
import AvatarViewer, { type SignItem } from "./AvatarViewer";
import SignLanguagePlaylistPlayer from "../learning/SignLanguagePlaylistPlayer";
import {
  SIMPLE_SIGNS_LIBRARY,
  type SignGestureItem,
} from "../../data/simpleSignsLibrary";

interface LearnSignLanguageProps {
  onSwitchToCamera?: () => void;
}

export default function LearnSignLanguage({ onSwitchToCamera }: LearnSignLanguageProps) {
  // Learning Modality: "video" (YouTube Course) or "avatar" (3D Avatar Visual Reference)
  const [learningModality, setLearningModality] = useState<"video" | "avatar">("video");

  // Selected sign or phrase
  const [selectedId, setSelectedId] = useState<string>("hello");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "phrase">("all");
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Active phrase single-word override (if user clicks on a single word inside a phrase)
  const [subWordOverride, setSubWordOverride] = useState<SignItem | null>(null);

  // Persistent Learning Progress tracking
  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("bharat_sign_learned_items");
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback on storage error
    }
    return new Set<string>(["namaste", "hello"]);
  });

  const toggleLearned = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLearnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("bharat_sign_learned_items", JSON.stringify(Array.from(next)));
      } catch {
        // storage fallback
      }
      return next;
    });
  };

  // Currently selected item object
  const activeItem: SignGestureItem = useMemo(() => {
    return (
      SIMPLE_SIGNS_LIBRARY.find((item) => item.id === selectedId) ||
      SIMPLE_SIGNS_LIBRARY[0]
    );
  }, [selectedId]);

  // When selected item changes, reset sub-word override
  useEffect(() => {
    setSubWordOverride(null);
  }, [selectedId]);

  // Filtered gestures and phrases
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SIMPLE_SIGNS_LIBRARY.filter((item) => {
      const matchesSearch =
        !q ||
        item.word.toLowerCase().includes(q) ||
        item.meaningHindi.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesType =
        typeFilter === "all" || item.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, categoryFilter, typeFilter]);

  // Derived 3D Avatar sequence or single item
  const avatarSignSequence: SignItem[] = useMemo(() => {
    if (subWordOverride) {
      return [subWordOverride];
    }
    if (activeItem.type === "phrase" && activeItem.sequence && activeItem.sequence.length > 0) {
      return activeItem.sequence.map((step) => ({
        word: step.word,
        animation: step.animation,
        description: step.description,
        is_validated: true,
      }));
    }
    return [
      {
        word: activeItem.word,
        animation: activeItem.animationKey,
        description: activeItem.description,
        is_validated: true,
      },
    ];
  }, [activeItem, subWordOverride]);

  // Calculate learning progress statistics
  const progressPercent = Math.round(
    (learnedIds.size / SIMPLE_SIGNS_LIBRARY.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 0. LEARNING MODALITY SELECTOR (VIDEO ACADEMY vs 3D AVATAR) */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLearningModality("video")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              learningModality === "video"
                ? "bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-lg shadow-red-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Video size={15} />
            <span>YouTube Video Academy</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-md font-mono">
              13 Lessons
            </span>
          </button>

          <button
            onClick={() => setLearningModality("avatar")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              learningModality === "avatar"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers size={15} />
            <span>3D Avatar Studio</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-md font-mono">
              18 Signs
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium px-3 hidden sm:inline-block">
          {learningModality === "video"
            ? "Embedded YouTube playlist player • 13 Lessons • 77 Mins"
            : "Interactive 3D avatar animations with anatomical hand pose breakdown"}
        </span>
      </div>

      {learningModality === "video" ? (
        <SignLanguagePlaylistPlayer
          onOpenAvatarPractice={(topic) => {
            setLearningModality("avatar");
            if (topic) setSearchQuery(topic);
          }}
          onOpenCameraPractice={onSwitchToCamera}
        />
      ) : (
        <>
          {/* ========================================================= */}
          {/* 1. MASTER HEADER & LEARNING PROGRESS HERO BANNER */}
          {/* ========================================================= */}
          <div 
            style={{ background: "linear-gradient(135deg, #111827 0%, #1E1B4B 50%, #0F172A 100%)" }}
            className="rounded-3xl border border-indigo-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-600/30 text-blue-300 border border-blue-500/50 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                <GraduationCap size={13} />
                Visual Reference Master Course
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck size={12} />
                18 Verified ISL Signs & Phrases
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Learn Sign Language — Simple Signs Chart
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Explore the 18 verified conversational gestures and complete phrases from the visual reference chart.
              Watch the 3D avatar demonstrate accurate anatomical hand poses, slow down playback, and practice word-by-word.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 md:p-5 min-w-[260px] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Learning Progress</span>
              </div>
              <span className="text-sm font-extrabold text-blue-400 font-mono">
                {learnedIds.size} / {SIMPLE_SIGNS_LIBRARY.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{progressPercent}% Mastered</span>
              {progressPercent === 100 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Completed!
                </span>
              ) : (
                <span>{SIMPLE_SIGNS_LIBRARY.length - learnedIds.size} signs remaining</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THREE-COLUMN WORKSPACE: LIST | 3D AVATAR | SIGN GUIDE */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ------------------------------------------------------- */}
        {/* COLUMN 1 (LEFT): GESTURE & PHRASE CATALOG LIST (3 cols) */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-4 xl:col-span-3.5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sign or Hindi (e.g. Hello, How, नाम)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Type Switcher Pills */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-semibold">
              <button
                onClick={() => setTypeFilter("all")}
                className={`py-1 rounded-lg transition ${
                  typeFilter === "all"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({SIMPLE_SIGNS_LIBRARY.length})
              </button>
              <button
                onClick={() => setTypeFilter("individual")}
                className={`py-1 rounded-lg transition ${
                  typeFilter === "individual"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Signs ({SIMPLE_SIGNS_LIBRARY.filter((i) => i.type === "individual").length})
              </button>
              <button
                onClick={() => setTypeFilter("phrase")}
                className={`py-1 rounded-lg transition ${
                  typeFilter === "phrase"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Phrases ({SIMPLE_SIGNS_LIBRARY.filter((i) => i.type === "phrase").length})
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {["All", "Greetings", "Questions", "Basics", "Descriptors", "Phrases"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                    categoryFilter === cat
                      ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Sign Items List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = item.id === selectedId;
              const isLearned = learnedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white group-hover:text-blue-400 transition">
                          {item.word}
                        </span>
                        {item.type === "phrase" && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-bold">
                            Phrase
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-amber-300/90 block">
                        {item.meaningHindi}
                      </span>
                    </div>

                    {/* Learned status checkbox */}
                    <button
                      onClick={(e) => toggleLearned(item.id, e)}
                      title={isLearned ? "Marked as learned" : "Click to mark learned"}
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition"
                    >
                      {isLearned ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <Circle size={16} className="text-slate-600 hover:text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-slate-400">{item.category}</span>
                    <span className="flex items-center gap-1 text-blue-400 group-hover:translate-x-0.5 transition font-semibold">
                      <span>View</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No gestures match your search. Try adjusting the query.
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* COLUMN 2 (CENTER): 3D SKELETAL AVATAR STAGE (5 cols)    */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-8 xl:col-span-5.5 space-y-4">
          {/* Main 3D Stage Container */}
          <div className="space-y-3">
            {/* Speed Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 pl-2">
                <Gauge size={14} className="text-blue-400" />
                <span>Playback Speed:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "0.5x Slow", val: 0.5 },
                  { label: "1.0x Normal", val: 1.0 },
                  { label: "1.5x", val: 1.5 },
                  { label: "2.0x Fast", val: 2.0 },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setPlaybackSpeed(s.val)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                      playbackSpeed === s.val
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <AvatarViewer
              sequence={avatarSignSequence}
              playbackSpeed={playbackSpeed}
            />

            {/* Phrase Word-by-Word Interactive Stepper (If viewing a phrase) */}
            {activeItem.type === "phrase" && activeItem.sequence && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={13} />
                    Step-by-Step ISL Sequence:
                  </span>
                  {subWordOverride && (
                    <button
                      onClick={() => setSubWordOverride(null)}
                      className="text-[10px] bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold hover:bg-blue-600 hover:text-white transition"
                    >
                      Play Full Phrase
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {activeItem.sequence.map((step, idx) => {
                    const isStepActive = subWordOverride?.word === step.word;
                    return (
                      <button
                        key={step.word + idx}
                        onClick={() =>
                          setSubWordOverride({
                            word: step.word,
                            animation: step.animation,
                            description: step.description,
                            is_validated: true,
                          })
                        }
                        className={`p-2 rounded-xl text-left border transition ${
                          isStepActive
                            ? "bg-blue-600/30 border-blue-500 text-white"
                            : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <span className="text-[9px] text-slate-400 block font-mono">
                          Step {idx + 1}
                        </span>
                        <span className="text-xs font-black block">{step.word}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* COLUMN 3 (RIGHT): ANATOMICAL GESTURE GUIDE (3.5 cols)   */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">
                  {activeItem.category} • {activeItem.signLanguage}
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                  <CheckCircle2 size={10} /> VERIFIED
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-black text-white">
                {activeItem.word}
              </h2>
              <span className="text-base font-bold text-amber-300">
                {activeItem.meaningHindi}
              </span>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed italic">
                "{activeItem.description}"
              </p>
            </div>

            {/* Gesture Kinematics Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block flex items-center gap-1.5">
                <Hand size={13} className="text-blue-400" />
                Anatomical Pose Specification
              </span>

              <div className="space-y-2 text-xs">
                {/* Hand Shape */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Hand Configuration
                  </span>
                  <p className="text-slate-200 mt-0.5">{activeItem.handConfiguration}</p>
                </div>

                {/* Finger Positions */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Finger Positions
                  </span>
                  <p className="text-slate-200 mt-0.5">{activeItem.fingerPositions}</p>
                </div>

                {/* Orientation */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Palm & Wrist Orientation
                  </span>
                  <p className="text-slate-200 mt-0.5">
                    {activeItem.palmOrientation} • {activeItem.wristOrientation}
                  </p>
                </div>

                {/* Movement Sequence */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Movement Trajectory
                  </span>
                  <p className="text-slate-200 mt-0.5">{activeItem.movementSequence}</p>
                </div>

                {/* Facial Expression */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Facial Expression & Head
                  </span>
                  <p className="text-slate-200 mt-0.5">{activeItem.facialExpression}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons: Mark Learned & Practice in Camera */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => toggleLearned(activeItem.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  learnedIds.has(activeItem.id)
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                <CheckCircle2 size={15} />
                <span>
                  {learnedIds.has(activeItem.id) ? "Marked as Mastered ✓" : "Mark as Mastered"}
                </span>
              </button>

              {onSwitchToCamera && (
                <button
                  onClick={onSwitchToCamera}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Camera size={15} />
                  <span>Practice with Camera</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
