import { useState } from "react";
import type { EarlyYearsSign } from "../../data/earlyYearsSignsData";
import {
  CheckCircle2,
  Circle,
  Play,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";

interface SignCardProps {
  sign: EarlyYearsSign;
  isLearned: boolean;
  onToggleLearned: (id: string) => void;
  onWatchSign: (sign: EarlyYearsSign) => void;
  onPracticeSign: (sign: EarlyYearsSign) => void;
  onSelectSign?: (sign: EarlyYearsSign) => void;
  onPrevSign?: () => void;
  onNextSign?: () => void;
  showNavigationControls?: boolean;
}

export default function SignCard({
  sign,
  isLearned,
  onToggleLearned,
  onWatchSign,
  onPracticeSign,
  onSelectSign,
  onPrevSign,
  onNextSign,
  showNavigationControls = false,
}: SignCardProps) {
  const [showSteps, setShowSteps] = useState(false);
  const isNeedsVerification = sign.verificationStatus === "needs_verification";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 p-5 backdrop-blur-md overflow-hidden ${
        isLearned
          ? "bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
          : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10"
      }`}
    >
      {/* Top Banner: Order, Verification, Learned Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 text-xs font-black border border-indigo-500/30">
              #{sign.order}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
              {sign.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isNeedsVerification ? (
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30"
                title="Needs regional dialect verification"
              >
                <AlertTriangle className="w-3 h-3" />
                <span className="hidden sm:inline">Verification</span>
              </span>
            ) : (
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                title="Verified BSL/EYFS Movement Reference"
              >
                <ShieldCheck className="w-3 h-3" />
                <span className="hidden sm:inline">Verified</span>
              </span>
            )}

            {/* Quick Learned Checkmark Indicator */}
            <button
              onClick={() => onToggleLearned(sign.id)}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                isLearned
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              title={isLearned ? "Mark as Not Learned" : "Mark as Learned"}
              aria-label={isLearned ? "Mark as Not Learned" : "Mark as Learned"}
            >
              {isLearned ? (
                <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Poster Illustration Hero */}
        <div
          onClick={() => onSelectSign ? onSelectSign(sign) : onWatchSign(sign)}
          className="relative w-full aspect-4/3 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900 border border-slate-800/80 p-3 flex items-center justify-center cursor-pointer group-hover:border-indigo-500/50 transition-colors shadow-inner"
        >
          <img
            src={sign.image}
            alt={`Gesture for ${sign.word} - ${sign.hindi}`}
            className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Quick Hover Overlay: Watch Icon */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white text-xs font-bold shadow-lg">
              <Play className="w-3.5 h-3.5 fill-white" />
              Inspect Sign Details
            </span>
          </div>
        </div>

        {/* Word, Hindi, and Description */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-indigo-300 transition-colors">
              {sign.word}
            </h3>
            <span className="text-base font-bold text-indigo-400">
              {sign.hindi}
            </span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {sign.meaning}
          </p>
        </div>

        {/* Handshape & Position Summary Pill */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Handshape: <strong className="text-white">{sign.handshape?.split("/")[0] || "Standard"}</strong></span>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {sign.startingPosition}
          </div>
        </div>

        {/* Numbered Steps Preview Toggle */}
        <div className="mt-2.5">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center justify-between w-full text-[11px] font-bold text-slate-400 hover:text-indigo-300 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {showSteps ? "Hide Movement Steps" : "Show 3 Movement Steps"}
            </span>
            <span>{showSteps ? "▲" : "▼"}</span>
          </button>

          {showSteps && (
            <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] animate-fadeIn">
              {sign.movementSteps.map((step) => (
                <div key={step.stepNumber} className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div>
                    <strong className="text-slate-200">{step.title}: </strong>
                    <span className="text-slate-400">{step.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Controls & Buttons */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Watch Sign Button */}
          <button
            onClick={() => onWatchSign(sign)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Watch Sign</span>
          </button>

          {/* Practice This Sign Button */}
          <button
            onClick={() => onPracticeSign(sign)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Practice</span>
          </button>
        </div>

        {/* Mark as Learned Toggle Button */}
        <button
          onClick={() => onToggleLearned(sign.id)}
          className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isLearned
              ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
              : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          {isLearned ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Marked as Learned</span>
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5 text-slate-500" />
              <span>Mark as Learned</span>
            </>
          )}
        </button>

        {/* Previous and Next Navigation Controls (when requested) */}
        {showNavigationControls && onPrevSign && onNextSign && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-xs">
            <button
              onClick={onPrevSign}
              className="flex items-center gap-1 text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="text-[10px] text-slate-500">#{sign.order} of 16</span>
            <button
              onClick={onNextSign}
              className="flex items-center gap-1 text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
