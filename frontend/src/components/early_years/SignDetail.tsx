import { useState } from "react";
import { EARLY_YEARS_SIGNS, type EarlyYearsSign } from "../../data/earlyYearsSignsData";
import MovementViewer from "./MovementViewer";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Dumbbell,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Volume2,
  Sparkles,
  Layers,
  ArrowRight,
  Hand,
  Compass,
  Smile,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface SignDetailProps {
  sign: EarlyYearsSign;
  isLearned: boolean;
  onToggleLearned: (id: string) => void;
  onPracticeSign: (sign: EarlyYearsSign) => void;
  onNavigateSign: (sign: EarlyYearsSign) => void;
  onBackToGrid?: () => void;
}

export default function SignDetail({
  sign,
  isLearned,
  onToggleLearned,
  onPracticeSign,
  onNavigateSign,
  onBackToGrid,
}: SignDetailProps) {
  const currentIndex = EARLY_YEARS_SIGNS.findIndex((s) => s.id === sign.id);
  const prevSign = EARLY_YEARS_SIGNS[(currentIndex - 1 + EARLY_YEARS_SIGNS.length) % EARLY_YEARS_SIGNS.length];
  const nextSign = EARLY_YEARS_SIGNS[(currentIndex + 1) % EARLY_YEARS_SIGNS.length];

  const isNeedsVerification = sign.verificationStatus === "needs_verification";

  // Speech helper
  const speakSentence = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Signs</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-sm flex items-center justify-center border border-indigo-500/30">
              #{sign.order}
            </span>
            <div>
              <h2 className="text-lg font-black text-white">{sign.word} • {sign.hindi}</h2>
              <p className="text-[11px] text-slate-400">{sign.category} • Sign {sign.order} of 16</p>
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous & Next Controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onNavigateSign(prevSign)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Previous: #${prevSign.order} ${prevSign.word}`}
              aria-label="Previous sign"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold px-2 text-slate-400">
              {sign.order} / 16
            </span>
            <button
              onClick={() => onNavigateSign(nextSign)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Next: #${nextSign.order} ${nextSign.word}`}
              aria-label="Next sign"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Practice Button */}
          <button
            onClick={() => onPracticeSign(sign)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <Dumbbell className="w-4 h-4" />
            <span className="hidden sm:inline">Practice</span>
          </button>

          {/* Mark as Learned Toggle */}
          <button
            onClick={() => onToggleLearned(sign.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isLearned
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            }`}
          >
            {isLearned ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Learned</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Mark as Learned</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Section: Interactive Step-by-Step Movement Viewer */}
      <section aria-labelledby="movement-viewer-heading">
        <h3 id="movement-viewer-heading" className="sr-only">Movement Viewer</h3>
        <MovementViewer
          sign={sign}
          onPracticeClick={() => onPracticeSign(sign)}
        />
      </section>

      {/* Two Column Detailed Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Linguistic Hand & Body Anatomy Breakdown */}
        <div className="space-y-6">
          {/* Card 1: Linguistic Specifications */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-black text-white">Linguistic Anatomy & Coordinates</h4>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Handshape */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-semibold shrink-0">Handshape & Digits:</span>
                <span className="text-right text-slate-200 font-bold">{sign.handshape || "Standard"}</span>
              </div>

              {/* Dominant Hand */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-semibold shrink-0">Hand Use:</span>
                <span className="text-right text-slate-200 font-bold capitalize">
                  {sign.dominantHand === "dominant"
                    ? "Dominant hand only"
                    : sign.dominantHand === "both_symmetric"
                    ? "Both hands (symmetric unison)"
                    : "Both hands (dominant acting on base palm)"}
                </span>
              </div>

              {/* Palm Orientation */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-semibold shrink-0">Palm Orientation:</span>
                <span className="text-right text-slate-200 font-medium">{sign.palmOrientation}</span>
              </div>

              {/* Starting Position */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-semibold shrink-0">Starting Position:</span>
                <span className="text-right text-slate-200 font-medium">{sign.startingPosition}</span>
              </div>

              {/* Direction of Movement */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-semibold shrink-0">Direction of Movement:</span>
                <span className="text-right text-slate-200 font-medium">{sign.movementDirection}</span>
              </div>

              {/* Ending Position */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 font-semibold shrink-0">Ending Position:</span>
                <span className="text-right text-slate-200 font-medium">{sign.endingPosition}</span>
              </div>

              {/* Facial Expression & Body Non-Manual Features */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40">
                <div className="flex items-center gap-1.5 text-indigo-300 font-semibold shrink-0">
                  <Smile className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Facial Expression:</span>
                </div>
                <span className="text-right text-indigo-200 font-medium">{sign.facialExpression}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Physical Action vs Linguistic Sign Distinction */}
          <div className="rounded-3xl bg-slate-900/90 border border-indigo-900/30 p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Physical Action vs. Linguistic Sign</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {sign.physicalVsLinguistic}
            </p>
          </div>
        </div>

        {/* Right Column: Educational Applications, Examples & Mistakes */}
        <div className="space-y-6">
          {/* Card 3: Example Sentences in English & Hindi */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-black text-white">Example Sentences</h4>
            </div>

            <div className="space-y-4">
              {/* English Example */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">English</span>
                  <button
                    onClick={() => speakSentence(sign.exampleSentence)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Listen to English sentence"
                    aria-label="Listen to English sentence"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-white">
                  "{sign.exampleSentence}"
                </p>
              </div>

              {/* Hindi Example */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Hindi (हिन्दी)</span>
                  <button
                    onClick={() => speakSentence(sign.hindiSentence)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Listen to Hindi sentence"
                    aria-label="Listen to Hindi sentence"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-emerald-300">
                  "{sign.hindiSentence}"
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Common Beginner Mistakes */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h4 className="text-base font-black text-white">Common Mistakes to Avoid</h4>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              {sign.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span className="leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 5: Authoritative Reference Source */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/40 p-5 flex items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Verified Reference Source</span>
              <p className="text-xs font-bold text-white">{sign.referenceSource}</p>
            </div>
            {sign.referenceUrl && (
              <a
                href={sign.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all shrink-0"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
