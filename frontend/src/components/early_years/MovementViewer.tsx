import { useState, useEffect, useRef } from "react";
import type { EarlyYearsSign } from "../../data/earlyYearsSignsData";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Volume2,
  Gauge,
  Sparkles,
} from "lucide-react";

interface MovementViewerProps {
  sign: EarlyYearsSign;
  onPracticeClick?: () => void;
}

export default function MovementViewer({ sign, onPracticeClick }: MovementViewerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1.0 | 1.5>(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<any>(null);

  const steps = sign.movementSteps || [];
  const totalSteps = steps.length;
  const currentStep = steps[activeStepIndex] || steps[0];

  // Reset step when sign changes
  useEffect(() => {
    setActiveStepIndex(0);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [sign.id]);

  // Handle autoplay loop
  useEffect(() => {
    if (!isPlaying || totalSteps === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const stepDurationMs = (2400 / playbackSpeed);

    timerRef.current = setTimeout(() => {
      setActiveStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          // loop back or pause
          return 0;
        }
        return prev + 1;
      });
    }, stepDurationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, activeStepIndex, totalSteps, playbackSpeed]);

  const handleNextStep = () => {
    setIsPlaying(false);
    setActiveStepIndex((prev) => (prev + 1) % totalSteps);
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setActiveStepIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  const handleReplay = () => {
    setActiveStepIndex(0);
    setIsPlaying(true);
  };

  // Text to speech for kids accessibility
  const speakStepDescription = () => {
    if (!("speechSynthesis" in window) || !currentStep) return;
    window.speechSynthesis.cancel();
    const textToSpeak = `${sign.word}. Step ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.description}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackSpeed === 0.5 ? 0.8 : 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // If the sign has no verified steps or status is explicitly unverified without steps
  const isNeedsVerification = sign.verificationStatus === "needs_verification";

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400">
            {sign.order}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">{sign.word}</h3>
              <span className="text-sm font-bold text-indigo-400">({sign.hindi})</span>
            </div>
            <p className="text-xs text-slate-400">{sign.category} • {sign.signLanguage}</p>
          </div>
        </div>

        {/* Verification Pill */}
        {isNeedsVerification ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Regional Verification</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Movement Tutorial</span>
          </div>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* Left Column: Visual Illustration Stage with Step Overlay */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-xs aspect-square rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden shadow-inner group">
            {/* Background Glow */}
            <div
              className={`absolute inset-0 opacity-15 blur-2xl transition-all duration-700 ${
                activeStepIndex === 0
                  ? "bg-blue-500"
                  : activeStepIndex === 1
                  ? "bg-purple-500"
                  : "bg-emerald-500"
              }`}
            />

            {/* Poster / Cropped SVG Illustration */}
            <img
              src={sign.image}
              alt={`Illustration demonstrating sign for ${sign.word}`}
              className="relative max-h-full max-w-full object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
            />

            {/* Live Step Badge Overlay */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-black text-indigo-300 flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Step {currentStep ? currentStep.stepNumber : 1} of {totalSteps}
            </div>

            {/* Playback speed badge */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-slate-400">
              {playbackSpeed}x Speed
            </div>
          </div>

          {/* Step Dots Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStepIndex(idx);
                }}
                className={`transition-all cursor-pointer ${
                  activeStepIndex === idx
                    ? "w-8 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/50"
                    : "w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-slate-600"
                }`}
                title={`Jump to Step ${s.stepNumber}: ${s.title}`}
                aria-label={`Step ${s.stepNumber}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Step Breakdown & Step Description */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Step Selector Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
            {steps.map((s, idx) => {
              const isCurrent = activeStepIndex === idx;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStepIndex(idx);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    isCurrent
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <span className="block text-[10px] opacity-75 font-semibold">
                    {idx === 0 ? "START" : idx === 1 ? "ACTION" : "END"}
                  </span>
                  Step {s.stepNumber}
                </button>
              );
            })}
          </div>

          {/* Active Step Card */}
          {currentStep && (
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black">
                    {currentStep.stepNumber}
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {currentStep.title}
                  </h4>
                </div>

                {/* Listen button */}
                <button
                  onClick={speakStepDescription}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isSpeaking
                      ? "bg-indigo-600 text-white border-indigo-500 animate-pulse"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                  title="Listen to step explanation aloud"
                  aria-label="Speak step description"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Visual Cue Pill */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-300 font-semibold">Hand & Body Cue: </strong>
                  <span>{currentStep.visualCue}</span>
                </div>
              </div>
            </div>
          )}

          {/* Unverified Movement Warning If Applicable */}
          {isNeedsVerification && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Notice on Hand Movement Verification</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                Movement instructions for this sign are based on primary Early Years preschool visual cues. A single static illustration does not establish full dialect kinematics; always verify with local deaf educators.
              </p>
            </div>
          )}

          {/* Reference Source Link */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="truncate">Source: <strong className="text-slate-300">{sign.referenceSource}</strong></span>
            {sign.referenceUrl && (
              <a
                href={sign.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold hover:underline shrink-0"
              >
                <span>Dictionary Ref</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar: Previous, Play/Pause, Next, Replay, Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 bg-slate-950/40 -mx-6 -mb-6 p-4 rounded-b-3xl">
        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevStep}
            disabled={totalSteps <= 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            aria-label="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Step</span>
          </button>

          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs text-white transition-all shadow-md cursor-pointer ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
            }`}
            aria-label={isPlaying ? "Pause Movement" : "Play Movement"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play Steps</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextStep}
            disabled={totalSteps <= 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            aria-label="Next Step"
          >
            <span className="hidden sm:inline">Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReplay}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Replay from Step 1"
            aria-label="Replay Movement"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls & Optional Practice Button */}
        <div className="flex items-center gap-3">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {([0.5, 1.0, 1.5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {onPracticeClick && (
            <button
              onClick={onPracticeClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Practice This Sign
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
