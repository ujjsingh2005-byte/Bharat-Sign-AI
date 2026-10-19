import { useEffect, useRef, useMemo, useState, Suspense, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useProgress } from "@react-three/drei";
import * as THREE from "three";
import {
  Gauge,
  Sparkles,
  ZoomIn,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Activity,
  Ruler,
  Compass,
  Layers,
  Sliders,
  ChevronDown,
  ChevronUp,
  Repeat,
  Hand,
} from "lucide-react";
import {
  PRECISE_GESTURES_MAP,
  resolveKinematicKey,
  sampleKinematicsAtTime,
  PRESET_PINCHED_EATING_MORSEL,
  PRESET_FLATTENED_O,
  PRESET_C_CUP,
  PRESET_CLOSED_FIST_S,
  PRESET_NO_OPEN,
  PRESET_NO_CLOSED,
  PRESET_PLEASE_CHIN_THUMB_CLOSED,
  PRESET_QUIET_SHHH_INDEX_LIPS,
  PRESET_SAD_TEAR_INDEX_EYE,
  PRESET_RUN_L_HAND,
  PRESET_BEAUTIFUL_L_HAND,
  PRESET_BEAUTIFUL_THREE_FINGERS,
  PRESET_OPEN_SPREAD_5,
  type PreciseGestureDefinition,
  type HandAnatomicalPose,
  type FingerJointAngles,
  type ThumbJointAngles,
} from "../../utils/signKinematicsEngine";

export interface SignItem {
  word: string;
  asset?: string;
  type?: "sign" | "letter" | "number" | "text_fallback";
  category?: string;
  animation?: string;
  description?: string;
  available?: boolean;
  is_validated?: boolean;
  validation_status?: string;
  referenceVideo?: string;
}

export interface AvatarViewerProps {
  currentSign?: string | null;
  sign?: string | null;
  isPlaying?: boolean;
  playbackSpeed?: number;
  signSequence?: SignItem[];
  sequence?: SignItem[];
  currentSignIndex?: number;
  onSignDone?: () => void;
  onReplaySequence?: () => void;
}

function skeletonClone(source: any) {
  const clone = {
    scene: source.clone(true),
  };
  const skelMap: Record<string, any> = {};
  source.traverse((node: any) => {
    if (node.isSkinnedMesh) {
      skelMap[node.name] = node.skeleton;
    }
  });
  clone.scene.traverse((node: any) => {
    if (node.isSkinnedMesh) {
      const parentSkel = skelMap[node.name];
      if (parentSkel) {
        const bones = parentSkel.bones.map((b: any) => {
          return clone.scene.getObjectByName(b.name);
        });
        node.bind(new THREE.Skeleton(bones, parentSkel.boneInverses), node.matrixWorld);
      }
    }
  });
  return clone.scene;
}

export default function AvatarViewer({
  currentSign = null,
  sign = null,
  isPlaying: propIsPlaying = true,
  playbackSpeed: propSpeed = 1.0,
  signSequence = [],
  sequence = [],
  currentSignIndex: propIndex = 0,
  onSignDone,
  onReplaySequence,
}: AvatarViewerProps) {
  const rawList = signSequence.length > 0 ? signSequence : sequence;
  const sequenceList: SignItem[] = useMemo(() => {
    if (rawList && rawList.length > 0) return rawList;
    const single = currentSign || sign;
    if (single) return [{ word: single, animation: single }];
    return [{ word: "NAMASTE", animation: "namaste", description: "Traditional Indian Namaste greeting gesture." }];
  }, [rawList, currentSign, sign]);

  const [currentIndex, setCurrentIndex] = useState(propIndex);
  const [isPlaying, setIsPlaying] = useState(propIsPlaying);
  const [speed, setSpeed] = useState(propSpeed);
  const [replayKey, setReplayKey] = useState<number>(0);
  const [poseStep, setPoseStep] = useState<"dynamic" | "start" | "mid" | "end">("dynamic");
  const [scrubProgress, setScrubProgress] = useState<number>(0.5);
  const [showKinematicsPanel, setShowKinematicsPanel] = useState<boolean>(true);
  const [restOverride, setRestOverride] = useState<boolean>(false);
  const [kineticFeedback, setKineticFeedback] = useState<{
    height: number;
    phase: number;
    def?: PreciseGestureDefinition;
  } | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
    setRestOverride(false);
    setPoseStep("dynamic");
    setReplayKey((k) => k + 1);
  }, [sequenceList]);

  useEffect(() => {
    setSpeed(propSpeed);
  }, [propSpeed]);

  const activeItem = sequenceList[currentIndex] || sequenceList[0];
  const activeSignKey = activeItem ? (activeItem.animation || activeItem.word) : "namaste";
  const isNamasteSign = Boolean(
    (activeSignKey && /namaste|namaskar|pranam/i.test(activeSignKey)) ||
    (activeItem && activeItem.word && /namaste|namaskar|pranam/i.test(activeItem.word))
  );

  const resolvedKey = resolveKinematicKey(activeSignKey);
  const currentDef = PRECISE_GESTURES_MAP[resolvedKey] || kineticFeedback?.def;

  const displayTitle = activeItem
    ? activeItem.word?.startsWith("letter_")
      ? activeItem.word.replace("letter_", "Letter ").toUpperCase()
      : activeItem.word
    : "NAMASTE";

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sequenceList.length - 1));
    setIsPlaying(true);
    setRestOverride(false);
    setPoseStep("dynamic");
    setReplayKey((k) => k + 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < sequenceList.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
    setRestOverride(false);
    setPoseStep("dynamic");
    setReplayKey((k) => k + 1);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    setRestOverride(false);
    if (poseStep !== "dynamic") {
      setPoseStep("dynamic");
    }
    setReplayKey((k) => k + 1);
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
    setRestOverride(false);
    setPoseStep("dynamic");
    setReplayKey((k) => k + 1);
    onReplaySequence?.();
  };

  const handleStepPose = (step: "dynamic" | "start" | "mid" | "end") => {
    setPoseStep(step);
    setRestOverride(false);
    if (step === "dynamic") {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      if (step === "start") setScrubProgress(0.0);
      else if (step === "mid") setScrubProgress(0.5);
      else if (step === "end") setScrubProgress(1.0);
    }
  };

  const handleResetToRest = () => {
    setRestOverride(true);
    setIsPlaying(false);
    setPoseStep("dynamic");
    setScrubProgress(0.0);
  };

  const handleCycleSpeed = () => {
    const speeds = [0.5, 1.0, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  const handleInternalSignDone = () => {
    onSignDone?.();
    if (currentIndex < sequenceList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (sequenceList.length === 1) {
        // Continuous smooth demonstration for single sign learning & inspection
        return;
      }
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl space-y-4 p-5">
      {/* Upper-Torso Visual Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>🧍‍♂️</span>
            <span>3D ISL Sign Avatar</span>
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Interactive 3D Mixamo Rig • Upper-Torso ISL Stage with Expressive Gestures
          </p>
        </div>

        {/* Speed Selector Badge */}
        <button
          onClick={handleCycleSpeed}
          title="Click to change playback speed"
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200 font-mono transition"
        >
          <Gauge size={13} className="text-blue-400" />
          <span>{speed}x Speed</span>
        </button>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div 
        style={{ background: "radial-gradient(circle at 50% 25%, #26365B 0%, #131B31 45%, #090D1B 100%)" }}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl border border-[#334155] overflow-hidden flex items-center justify-center shadow-2xl"
      >
        {/* Playback State Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {isPlaying ? (
            <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Signing in Progress ({currentIndex + 1}/{sequenceList.length})
            </span>
          ) : (
            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border">
              Paused / Standby
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10 text-[11px] text-slate-500 flex items-center gap-1">
          <ZoomIn size={12} /> Drag / Scroll to Inspect
        </div>

        {/* Three.js Canvas Container - Completely unobstructed */}
        <div className="w-full h-full">
          <AvatarStage
            currentSign={restOverride ? "rest" : activeSignKey}
            isPlaying={isPlaying}
            playbackSpeed={speed}
            animationKey={replayKey}
            poseStep={poseStep}
            scrubProgress={scrubProgress}
            onSignDone={handleInternalSignDone}
            onKineticUpdate={setKineticFeedback}
          />
        </div>
      </div>

      {/* Current Active Sign Information Banner (Placed below 3D canvas so hands are NEVER blocked) */}
      {displayTitle && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block">
                  INDIAN SIGN LANGUAGE (ISL)
                </span>
                {activeItem?.is_validated === false || activeItem?.validation_status === "UNVALIDATED_TEXT_FALLBACK" ? (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-extrabold">
                    ⚠️ Text Fallback Notice
                  </span>
                ) : activeItem?.validation_status === "ISL_FINGERSPELLING_LETTER" || activeItem?.type === "letter" ? (
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-extrabold">
                    🔤 ISL Manual Alphabet
                  </span>
                ) : (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-extrabold">
                    ✓ Validated Gesture
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-white tracking-wide">
                  {displayTitle}
                </span>
                {isNamasteSign && (
                  <span className="text-base font-bold text-amber-300 tracking-wider">
                    नमस्ते
                  </span>
                )}
              </div>
            </div>
          </div>

          {activeItem?.description && (
            <p className="text-xs text-slate-400 max-w-sm italic hidden md:block">
              "{activeItem.description}"
            </p>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL INTERACTIVE SEQUENCE PLAYBACK CONTROLS BAR */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Sign Button */}
          <button
            onClick={handlePrevious}
            title="Previous Sign"
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition hover:scale-105"
          >
            <SkipBack size={16} />
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? "Pause 3D Avatar" : "Play 3D Avatar"}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:scale-105"
          >
            {isPlaying ? (
              <>
                <Pause size={15} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={15} />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Next Sign Button */}
          <button
            onClick={handleNext}
            title="Next Sign"
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition hover:scale-105"
          >
            <SkipForward size={16} />
          </button>

          {/* Replay Full Sequence Button */}
          <button
            onClick={handleReplay}
            title="Replay Full Sentence Sequence"
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-400 transition hover:scale-105 flex items-center gap-1 text-xs font-bold"
          >
            <Repeat size={15} />
            <span className="hidden sm:inline">Replay Sentence</span>
          </button>
        </div>

        {/* Active Sign Index Counter */}
        <div className="text-xs text-slate-400 font-mono">
          Sign <span className="text-white font-bold">{currentIndex + 1}</span> of{" "}
          <span className="text-white font-bold">{sequenceList.length}</span>
        </div>
      </div>

      {/* Sequential Sentence Signs Strip */}
      {sequenceList.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1">
              <Sparkles size={13} className="text-purple-400" />
              Sequential Sentence Signs (Click any sign to jump):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
            {sequenceList.map((item, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 ring-2 ring-blue-400"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span>
                    {item.word?.startsWith("letter_")
                      ? item.word.replace("letter_", "Letter ").toUpperCase()
                      : item.word}
                  </span>
                  {active && isPlaying && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRECISE KINEMATIC MOTION & ANATOMICAL RIG INSPECTOR */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 shadow-2xl overflow-hidden p-4 space-y-4">
        {/* Header & Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Activity size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white tracking-wide">
                  Kinematic Motion & Hand Rig Inspector
                </h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-extrabold uppercase">
                  Anatomically Calibrated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Measurable hand heights, wrist Euler rotations, independent finger joint flexions & 3D trajectories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKinematicsPanel((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-bold transition flex items-center gap-1.5"
            >
              <span>{showKinematicsPanel ? "Hide Details" : "Show Details"}</span>
              {showKinematicsPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* 1. Keyframe Stepper & Pose Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Layers size={14} className="text-blue-400" />
              Keyframe Step Inspection:
            </span>

            {/* Stepper Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => handleStepPose("dynamic")}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 ${
                  poseStep === "dynamic" && !restOverride && isPlaying
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Play size={11} /> Dynamic Motion
              </button>
              <button
                onClick={() => handleStepPose("start")}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  poseStep === "start"
                    ? "bg-indigo-600 text-white shadow ring-1 ring-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Pose A (Initial)
              </button>
              <button
                onClick={() => handleStepPose("mid")}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  poseStep === "mid"
                    ? "bg-indigo-600 text-white shadow ring-1 ring-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mid-Pose (In-Flight)
              </button>
              <button
                onClick={() => handleStepPose("end")}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  poseStep === "end"
                    ? "bg-indigo-600 text-white shadow ring-1 ring-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Pose B (Target)
              </button>
              <button
                onClick={handleResetToRest}
                title="Reset avatar to neutral resting standby"
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 ${
                  restOverride
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:text-amber-300"
                }`}
              >
                <RotateCcw size={11} /> Reset Rest
              </button>
            </div>
          </div>

          {/* Interactive Trajectory Timeline Scrubber */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Sliders size={12} className="text-indigo-400" />
                Motion Trajectory Timeline:
              </span>
              <span className="text-indigo-300 font-bold">
                {poseStep === "start"
                  ? "0% (Pose A: Initial Setup)"
                  : poseStep === "mid"
                  ? "50% (Mid-Flight Transition)"
                  : poseStep === "end"
                  ? "100% (Pose B: Final Contact)"
                  : isPlaying
                  ? `${Math.round(((kineticFeedback?.phase ?? 0) * 100))}% (Playing)`
                  : `${Math.round(scrubProgress * 100)}% (Scrubbed)`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={
                  poseStep === "start"
                    ? 0
                    : poseStep === "mid"
                    ? 0.5
                    : poseStep === "end"
                    ? 1
                    : isPlaying
                    ? kineticFeedback?.phase ?? 0.5
                    : scrubProgress
                }
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setScrubProgress(val);
                  setIsPlaying(false);
                  setPoseStep("dynamic");
                  setRestOverride(false);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Precision Metrics Grid */}
        {showKinematicsPanel && (
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Metric 1: Hand Involvement & Trajectory */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                  <Hand size={13} className="text-blue-400" />
                  <span>Hand Involvement</span>
                </div>
                <div className="text-white font-black text-sm">
                  {currentDef?.involvesHands === "both"
                    ? "Bilateral Both Hands"
                    : currentDef?.involvesHands === "left"
                    ? "Left Hand Dominant"
                    : "Right Hand Dominant"}
                </div>
                <div className="text-[11px] text-indigo-300 font-mono">
                  Path: <span className="uppercase font-bold">{currentDef?.motionType || "Linear / Tapping"}</span>
                </div>
              </div>

              {/* Metric 2: Wrist Height & Vertical Lowering */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                  <Ruler size={13} className="text-emerald-400" />
                  <span>Hand Height & ΔY</span>
                </div>
                <div className="text-white font-black text-sm">
                  {(kineticFeedback?.height ?? currentDef?.measurements.initialWristHeight ?? 0) >= 0 ? "+" : ""}
                  {(kineticFeedback?.height ?? currentDef?.measurements.initialWristHeight ?? 0).toFixed(2)}m
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    ({(kineticFeedback?.height ?? 0) > 0.25 ? "Head/Face" : (kineticFeedback?.height ?? 0) > 0.05 ? "Chin/Neck" : (kineticFeedback?.height ?? 0) > -0.15 ? "Chest" : "Waist"})
                  </span>
                </div>
                <div className="text-[11px] text-emerald-300 font-mono">
                  ΔY: {(currentDef?.measurements.verticalDisplacement ?? 0) >= 0 ? "+" : ""}
                  {((currentDef?.measurements.verticalDisplacement ?? 0) * 100).toFixed(1)} cm
                </div>
              </div>

              {/* Metric 3: Movement Distance (3D Path) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                  <Compass size={13} className="text-purple-400" />
                  <span>3D Movement Travel</span>
                </div>
                <div className="text-white font-black text-sm">
                  {((currentDef?.measurements.totalMovementDistance ?? 0.20) * 100).toFixed(1)} cm Path
                </div>
                <div className="text-[11px] text-purple-300 font-mono">
                  ΔX: {((currentDef?.measurements.horizontalDisplacement ?? 0) * 100).toFixed(1)}cm • ΔZ: {((currentDef?.measurements.depthDisplacement ?? 0) * 100).toFixed(1)}cm
                </div>
              </div>

              {/* Metric 4: Wrist Rotation & Palm Orientation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                  <Activity size={13} className="text-amber-400" />
                  <span>Wrist Euler Rotation</span>
                </div>
                <div className="text-white font-black text-xs font-mono">
                  [{currentDef?.measurements.wristRotationDegrees?.map((d) => `${d > 0 ? "+" : ""}${d}°`).join(", ") || "[0°, 0°, 0°]"}]
                </div>
                <div className="text-[10px] text-amber-300 font-mono truncate" title={currentDef?.measurements.palmOrientationEnd}>
                  Palm: {currentDef?.measurements.palmOrientationEnd || "Forward Facing"}
                </div>
              </div>
            </div>

            {/* 3. Anatomical Features & Joint Alignments Breakdown */}
            {currentDef?.measurements.anatomicalFeatures && currentDef.measurements.anatomicalFeatures.length > 0 && (
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span className="flex items-center gap-1 text-blue-400">
                    <Sparkles size={12} />
                    Verified Anatomical Hand Joint Rigging:
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px]">
                    Independent Phalanx Rotations Active
                  </span>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  {currentDef.measurements.anatomicalFeatures.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface AvatarStageProps {
  currentSign: string | null;
  isPlaying: boolean;
  playbackSpeed: number;
  animationKey?: number;
  poseStep?: "dynamic" | "start" | "mid" | "end";
  scrubProgress?: number;
  onSignDone?: () => void;
  onKineticUpdate?: (data: {
    height: number;
    phase: number;
    def?: PreciseGestureDefinition;
  }) => void;
}



interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AvatarErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || "Failed to render 3D avatar model" };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[AvatarViewer ErrorBoundary] 3D Model Render Exception:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 backdrop-blur-md">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <AlertTriangle size={28} />
          </div>
          <h4 className="text-base font-black text-white">3D Avatar Load Notice</h4>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm mb-4 leading-relaxed font-mono">
            {this.state.errorMessage}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <RotateCcw size={14} />
            <span>Retry 3D Stage</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function CanvasLoadingOverlay() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm pointer-events-none transition-opacity">
      <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-w-xs text-center">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Loading ISL 3D Avatar
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Decoding 5.32 MB GLTF Skeleton Mesh ({Math.round(progress)}%)
          </p>
        </div>
        <div className="w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${Math.max(8, progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function StageStandbyPlatform({
  signName,
  isPlaying,
  playbackSpeed,
  onSignDone,
}: {
  signName: string | null;
  isPlaying: boolean;
  playbackSpeed: number;
  onSignDone?: () => void;
}) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const durationMs = Math.max(800, Math.round(1800 / playbackSpeed));
    const timer = setTimeout(() => {
      onSignDone?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [signName, isPlaying, playbackSpeed, onSignDone]);

  useFrame((_, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * (isPlaying ? 0.6 : 0.2);
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * (isPlaying ? 0.4 : 0.1);
    }
  });

  return (
    <group position={[0, -0.9, 0]}>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.16, 64]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.17, 0]}>
        <ringGeometry args={[1.35, 1.48, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={isPlaying ? 0.75 : 0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.172, 0]}>
        <ringGeometry args={[1.05, 1.15, 48]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={isPlaying ? 0.6 : 0.25} side={THREE.DoubleSide} />
      </mesh>
      <gridHelper args={[3.4, 16, "#3b82f6", "#1e293b"]} position={[0, 0.001, 0]} />
    </group>
  );
}

function AvatarStage({
  currentSign,
  isPlaying,
  playbackSpeed,
  animationKey = 0,
  poseStep = "dynamic",
  scrubProgress = 0.5,
  onSignDone,
  onKineticUpdate,
}: AvatarStageProps) {
  return (
    <div className="relative w-full h-full">
      <CanvasLoadingOverlay />
      <AvatarErrorBoundary>
        <Canvas
          camera={{ position: [0, 1.28, 2.9], fov: 36 }}
          className="w-full h-full"
          gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
          <ambientLight intensity={0.95} />
          <directionalLight position={[2, 4, 3]} intensity={1.4} />
          <directionalLight position={[-2, 2, -2]} intensity={0.5} />
          <pointLight position={[0, 2, 2]} intensity={0.8} />

          <Suspense
            fallback={
              <StageStandbyPlatform
                signName={currentSign}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                onSignDone={onSignDone}
              />
            }
          >
            <Avatar
              signName={currentSign}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              animationKey={animationKey}
              poseStep={poseStep}
              scrubProgress={scrubProgress}
              onSignDone={onSignDone}
              onKineticUpdate={onKineticUpdate}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.8}
            maxDistance={5.0}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 1.22, 0]}
          />
        </Canvas>
      </AvatarErrorBoundary>
    </div>
  );
}

interface AvatarSubProps {
  signName: string | null;
  isPlaying: boolean;
  playbackSpeed: number;
  animationKey: number;
  poseStep?: "dynamic" | "start" | "mid" | "end";
  scrubProgress?: number;
  onSignDone?: () => void;
  onKineticUpdate?: (data: {
    height: number;
    phase: number;
    def?: PreciseGestureDefinition;
  }) => void;
}

function Avatar({
  signName,
  isPlaying,
  playbackSpeed,
  animationKey,
  poseStep = "dynamic",
  scrubProgress = 0.5,
  onSignDone,
  onKineticUpdate,
}: AvatarSubProps) {
  const { scene } = useGLTF("/models/isl-avatar.glb");

  const clone = useMemo(() => {
    return skeletonClone(scene);
  }, [scene]);

  const bones = useRef<Record<string, THREE.Bone>>({});
  const morphMeshes = useRef<THREE.SkinnedMesh[]>([]);
  const base = useRef<Record<string, THREE.Quaternion>>({});
  const animationTime = useRef(0);
  const signDoneTriggered = useRef(false);
  const lastKineticUpdate = useRef(0);

  useEffect(() => {
    const foundBones: Record<string, THREE.Bone> = {};
    const foundMorphs: THREE.SkinnedMesh[] = [];

    clone.traverse((obj: any) => {
      if (obj.isSkinnedMesh && obj.morphTargetDictionary && obj.morphTargetInfluences) {
        foundMorphs.push(obj);
      }

      if (!obj.isBone) return;

      const raw = obj.name || "";
      if (raw.includes("$AssimpFbx$")) return;

      const key = raw
        .toLowerCase()
        .replace(/mixamorig/g, "")
        .replace(/armature/g, "")
        .replace(/[^a-z0-9]/g, "");

      foundBones[key] = obj;
      base.current[key] = obj.quaternion.clone();
    });

    bones.current = foundBones;
    morphMeshes.current = foundMorphs;
  }, [clone]);

  useEffect(() => {
    animationTime.current = 0;
    signDoneTriggered.current = false;
  }, [signName, animationKey]);

  useFrame((_, delta) => {
    const currentBones = bones.current;
    if (!Object.keys(currentBones).length) return;

    if (isPlaying && signName) {
      animationTime.current += delta * playbackSpeed;
    }

    const t = animationTime.current;

    const setMorphTarget = (name: string, value: number, smooth = 0.20) => {
      for (const mesh of morphMeshes.current) {
        const idx = mesh.morphTargetDictionary?.[name];
        if (idx !== undefined && mesh.morphTargetInfluences) {
          const cur = mesh.morphTargetInfluences[idx] || 0;
          mesh.morphTargetInfluences[idx] = cur + (value - cur) * smooth;
        }
      }
    };

    const rotateBone = (
      nameKey: string,
      eulerX: number,
      eulerY: number,
      eulerZ: number,
      smooth = 0.16
    ) => {
      const bone = currentBones[nameKey];
      const original = base.current[nameKey];
      if (!bone || !original) return;

      const rot = new THREE.Quaternion();
      rot.setFromEuler(new THREE.Euler(eulerX, eulerY, eulerZ, "XYZ"));
      const target = original.clone().multiply(rot);
      bone.quaternion.slerp(target, smooth);
    };

    const applyAnatomicalFinger = (
      side: "right" | "left",
      finger: "index" | "middle" | "ring" | "pinky",
      angles: FingerJointAngles,
      smooth = 0.18
    ) => {
      const baseKey = `${side}hand${finger}1`;
      const spread = (side === "right" ? 1 : -1) * (angles.spread || 0);
      rotateBone(baseKey, angles.base * 0.35, spread, angles.base * 0.70, smooth);

      const midKey = `${side}hand${finger}2`;
      rotateBone(midKey, angles.mid * 0.25, 0, angles.mid * 0.75, smooth);

      const tipKey = `${side}hand${finger}3`;
      rotateBone(tipKey, angles.tip * 0.20, 0, angles.tip * 0.70, smooth);
    };

    const applyAnatomicalThumb = (
      side: "right" | "left",
      angles: ThumbJointAngles,
      smooth = 0.18
    ) => {
      const cmcKey = `${side}handthumb1`;
      const opp = (side === "right" ? 1 : -1) * (angles.opposition || 0);
      rotateBone(cmcKey, angles.cmc * 0.40, opp * 0.50, angles.cmc * 0.60, smooth);

      const mcpKey = `${side}handthumb2`;
      rotateBone(mcpKey, angles.mcp * 0.30, 0, angles.mcp * 0.65, smooth);

      const ipKey = `${side}handthumb3`;
      rotateBone(ipKey, angles.ip * 0.25, 0, angles.ip * 0.65, smooth);
    };

    const applyPinchedMorselHand = (side: "right" | "left", smooth = 0.20) => {
      // Direct 3D calibration: Thumb and all 4 fingertips directly meet & touch at center (<0.7mm)
      // Thumb
      rotateBone(`${side}handthumb1`, -0.15, (side === "right" ? 1 : -1) * 0.25, 0.85, smooth);
      rotateBone(`${side}handthumb2`,  0.00, 0.00, 0.55, smooth);
      rotateBone(`${side}handthumb3`,  0.00, 0.00, 0.45, smooth);

      // Index (touches thumb tip within 0.7mm)
      rotateBone(`${side}handindex1`,  2.39, (side === "right" ? 1 : -1) * -0.60, 0.61, smooth);
      rotateBone(`${side}handindex2`,  0.03, 0.03, 0.09, smooth);
      rotateBone(`${side}handindex3`,  0.09, -0.68, 0.02, smooth);

      // Middle (touches thumb tip within 0.1mm)
      rotateBone(`${side}handmiddle1`, 1.43, (side === "right" ? 1 : -1) * -0.31, 0.38, smooth);
      rotateBone(`${side}handmiddle2`, 0.83, -0.26, 0.08, smooth);
      rotateBone(`${side}handmiddle3`, 0.16, 0.30, 0.30, smooth);

      // Ring (touches thumb tip within 0.2mm)
      rotateBone(`${side}handring1`,   1.39, (side === "right" ? 1 : -1) * -0.23, 0.19, smooth);
      rotateBone(`${side}handring2`,   0.61, 0.04, 0.15, smooth);
      rotateBone(`${side}handring3`,   0.41, -0.46, 0.18, smooth);

      // Pinky (gathers inward to touch thumb/ring cluster within 6.5mm)
      rotateBone(`${side}handpinky1`,  1.89, (side === "right" ? 1 : -1) * -0.11, 0.18, smooth);
      rotateBone(`${side}handpinky2`, -0.18, -0.60, -0.06, smooth);
      rotateBone(`${side}handpinky3`,  0.20, -0.55, 0.25, smooth);
    };

    const applyDrinkingCupHand = (side: "right" | "left", smooth = 0.20) => {
      // Calibrated to user photo (media_1792262961228_52b5ac8b.jpg):
      // Open thumb pointing straight forward/horizontal, 4 fingers bent in arched cup-holding dome
      const sign = side === "right" ? 1 : -1;

      // Thumb: Open, extended straight forward horizontally (no curling into palm)
      rotateBone(`${side}handthumb1`, -0.05, sign * 0.15, 0.20, smooth);
      rotateBone(`${side}handthumb2`,  0.02, 0.00, 0.05, smooth);
      rotateBone(`${side}handthumb3`,  0.00, 0.00, 0.00, smooth);

      // Four fingers: All 4 fingers bent together in a smooth C-cup arc
      // Index
      rotateBone(`${side}handindex1`,  0.42, sign * -0.02, 0.85, smooth);
      rotateBone(`${side}handindex2`,  0.28, 0.00, 0.75, smooth);
      rotateBone(`${side}handindex3`,  0.18, 0.00, 0.60, smooth);

      // Middle
      rotateBone(`${side}handmiddle1`, 0.42, 0.00, 0.85, smooth);
      rotateBone(`${side}handmiddle2`, 0.28, 0.00, 0.75, smooth);
      rotateBone(`${side}handmiddle3`, 0.18, 0.00, 0.60, smooth);

      // Ring
      rotateBone(`${side}handring1`,   0.42, sign * 0.02, 0.85, smooth);
      rotateBone(`${side}handring2`,   0.28, 0.00, 0.75, smooth);
      rotateBone(`${side}handring3`,   0.18, 0.00, 0.60, smooth);

      // Pinky
      rotateBone(`${side}handpinky1`,  0.42, sign * 0.05, 0.85, smooth);
      rotateBone(`${side}handpinky2`,  0.28, 0.00, 0.75, smooth);
      rotateBone(`${side}handpinky3`,  0.18, 0.00, 0.60, smooth);
    };

    const applyClosedSFistHand = (side: "right" | "left", smooth = 0.20) => {
      // Photo-calibrated to user upload (media_1792267414545_48095781.jpg & media_1792267431506_85271ec0.png):
      // All four fingers tightly curled into palm, and thumb folded cleanly across front of index & middle fingers
      const sign = side === "right" ? 1 : -1;

      // Thumb: tightly folded across front of index & middle fingers
      rotateBone(`${side}handthumb1`, 0.20, sign * 0.30, 0.55, smooth);
      rotateBone(`${side}handthumb2`, 0.20, 0.00, 0.65, smooth);
      rotateBone(`${side}handthumb3`, 0.10, 0.00, 0.55, smooth);

      // Four fingers: curled tightly into palm using anatomical primary bend axis (X)
      const fingers = ["index", "middle", "ring", "pinky"] as const;
      fingers.forEach((f) => {
        rotateBone(`${side}hand${f}1`, 1.30, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}2`, 1.35, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}3`, 1.25, 0.00, 0.00, smooth);
      });
    };

    const applyNoSnapHand = (side: "right" | "left", snap: number, smooth = 0.20) => {
      // Photo-calibrated to user upload (media_1792271941698_d19ca306.jpg):
      // Ring and pinky fingers are tightly curled into palm.
      // Index and middle fingers start open with thumb, then snap down to touch the thumb pad directly (<0.7mm distance).
      const sign = side === "right" ? 1 : -1;
      const clampedSnap = Math.max(0, Math.min(1, snap));

      // Thumb: interpolates from open opposing beak to direct contact with index & middle fingertips
      const t1x = 0.05 + clampedSnap * 0.08;
      const t1y = sign * (0.20 + clampedSnap * 0.20);
      const t1z = 0.15 + clampedSnap * 0.18;
      const t2x = 0.05 + clampedSnap * 0.18;
      const t2z = 0.10 + clampedSnap * 0.15;
      const t3x = 0.05 + clampedSnap * 0.10;
      const t3z = 0.05 + clampedSnap * 0.10;

      rotateBone(`${side}handthumb1`, t1x, t1y, t1z, smooth);
      rotateBone(`${side}handthumb2`, t2x, 0.00, t2z, smooth);
      rotateBone(`${side}handthumb3`, t3x, 0.00, t3z, smooth);

      // Index: interpolates from straight open (-0.05, 0.05, 0.05) to touch thumb pad (1.17, 0.35, 0.21)
      const idxBase = -0.05 + clampedSnap * 1.22;
      const idxMid  =  0.05 + clampedSnap * 0.30;
      const idxTip  =  0.05 + clampedSnap * 0.16;
      const idxSpread = sign * (-0.03 - clampedSnap * 0.03);
      rotateBone(`${side}handindex1`, idxBase, idxSpread, 0.00, smooth);
      rotateBone(`${side}handindex2`, idxMid,  0.00,      0.00, smooth);
      rotateBone(`${side}handindex3`, idxTip,  0.00,      0.00, smooth);

      // Middle: interpolates from straight open (-0.05, 0.05, 0.05) to touch thumb pad (1.17, 0.35, 0.21)
      const midBase = -0.05 + clampedSnap * 1.22;
      const midMid  =  0.05 + clampedSnap * 0.30;
      const midTip  =  0.05 + clampedSnap * 0.16;
      const midSpread = sign * (0.03 + clampedSnap * 0.03);
      rotateBone(`${side}handmiddle1`, midBase, midSpread, 0.00, smooth);
      rotateBone(`${side}handmiddle2`, midMid,  0.00,      0.00, smooth);
      rotateBone(`${side}handmiddle3`, midTip,  0.00,      0.00, smooth);

      // Ring & Pinky: strictly curled into palm at all times (Matches user photo media_1792271941698_d19ca306.jpg)
      rotateBone(`${side}handring1`, 1.30, 0.00, 0.00, smooth);
      rotateBone(`${side}handring2`, 1.35, 0.00, 0.00, smooth);
      rotateBone(`${side}handring3`, 1.25, 0.00, 0.00, smooth);

      rotateBone(`${side}handpinky1`, 1.30, 0.00, 0.00, smooth);
      rotateBone(`${side}handpinky2`, 1.35, 0.00, 0.00, smooth);
      rotateBone(`${side}handpinky3`, 1.25, 0.00, 0.00, smooth);
    };

    const applyPleaseChinHand = (side: "right" | "left", smooth = 0.20) => {
      // Photo-calibrated to user upload (media_1792314528941_cdbd81cf.jpg, Pragya ISL 101 Lesson 3):
      // All four fingers (index, middle, ring, pinky) are straight and closed together resting on chin.
      // Thumb is closed / tucked flat across the palm.
      const sign = side === "right" ? 1 : -1;

      // Thumb: curled and folded tightly across the palm
      rotateBone(`${side}handthumb1`, 0.35, sign * 0.45, 0.65, smooth);
      rotateBone(`${side}handthumb2`, 0.25, 0.00, 0.45, smooth);
      rotateBone(`${side}handthumb3`, 0.15, 0.00, 0.35, smooth);

      // Four fingers: extended straight together touching the chin
      const fingers = ["index", "middle", "ring", "pinky"] as const;
      fingers.forEach((f) => {
        rotateBone(`${side}hand${f}1`, 0.00, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}2`, 0.00, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}3`, 0.00, 0.00, 0.00, smooth);
      });
    };

    const applyQuietShhhHand = (side: "right" | "left", smooth = 0.20) => {
      // User calibration: index finger extended upright in mouth; all remaining fingers (middle, ring, pinky) and thumb tightly closed into a firm fist
      const sign = side === "right" ? 1 : -1;

      // Thumb: tightly closed and folded across the curled fingers
      rotateBone(`${side}handthumb1`, 0.20, sign * 0.30, 0.60, smooth);
      rotateBone(`${side}handthumb2`, 0.20, 0.00, 0.65, smooth);
      rotateBone(`${side}handthumb3`, 0.12, 0.00, 0.55, smooth);

      // Index finger: extended straight upright into mouth
      rotateBone(`${side}handindex1`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex2`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex3`, 0.00, 0.00, 0.00, smooth);

      // All remaining fingers (middle, ring, pinky): tightly closed into palm
      const curledFingers = ["middle", "ring", "pinky"] as const;
      curledFingers.forEach((f) => {
        rotateBone(`${side}hand${f}1`, 1.35, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}2`, 1.40, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}3`, 1.30, 0.00, 0.00, smooth);
      });
    };

    const applySadTearHand = (side: "right" | "left", smooth = 0.20) => {
      // User specification: Index finger extended straight, all other fingers (middle, ring, pinky) AND thumb tightly closed in a fist.
      const sign = side === "right" ? 1 : -1;

      // Thumb: tightly closed and folded across the curled fingers
      rotateBone(`${side}handthumb1`, 0.20, sign * 0.35, 0.65, smooth);
      rotateBone(`${side}handthumb2`, 0.25, 0.00, 0.70, smooth);
      rotateBone(`${side}handthumb3`, 0.15, 0.00, 0.60, smooth);

      // Index finger: extended straight (touches eye / traces falling tear down cheek)
      rotateBone(`${side}handindex1`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex2`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex3`, 0.00, 0.00, 0.00, smooth);

      // All remaining fingers (middle, ring, pinky): tightly closed into palm
      const curledFingers = ["middle", "ring", "pinky"] as const;
      curledFingers.forEach((f) => {
        rotateBone(`${side}hand${f}1`, 1.40, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}2`, 1.45, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}3`, 1.35, 0.00, 0.00, smooth);
      });
    };

    const applyRunLHand = (side: "right" | "left", smooth = 0.20) => {
      // User specification:
      // "close all the finger except index finger and thumb of both hands"
      // Index finger extended straight, thumb open/extended forming "L",
      // middle, ring, pinky curled tightly into fist against palm.
      const sign = side === "right" ? 1 : -1;

      // Thumb: extended open upright/forward forming L-shape
      rotateBone(`${side}handthumb1`, 0.15, sign * 0.25, 0.30, smooth);
      rotateBone(`${side}handthumb2`, 0.20, 0.00, 0.25, smooth);
      rotateBone(`${side}handthumb3`, 0.15, 0.00, 0.15, smooth);

      // Index finger: extended straight
      rotateBone(`${side}handindex1`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex2`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex3`, 0.00, 0.00, 0.00, smooth);

      // Middle, ring, pinky: closed tightly into fist against palm
      const curledFingers = ["middle", "ring", "pinky"] as const;
      curledFingers.forEach((f) => {
        rotateBone(`${side}hand${f}1`, 1.40, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}2`, 1.45, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}3`, 1.35, 0.00, 0.00, smooth);
      });
    };

    const applyBeautifulLHand = (side: "right" | "left", smooth = 0.20) => {
      // User specification:
      // "close all the fingers except index finger and thumb after that round with the index finger on the circle of their own face"
      const sign = side === "right" ? 1 : -1;

      // Thumb: extended open upright/forward forming L-shape
      rotateBone(`${side}handthumb1`, 0.15, sign * 0.25, 0.30, smooth);
      rotateBone(`${side}handthumb2`, 0.20, 0.00, 0.25, smooth);
      rotateBone(`${side}handthumb3`, 0.15, 0.00, 0.15, smooth);

      // Index finger: extended straight to trace circle of the face
      rotateBone(`${side}handindex1`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex2`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex3`, 0.00, 0.00, 0.00, smooth);

      // Middle, ring, pinky: closed tightly into fist against palm
      const curledFingers = ["middle", "ring", "pinky"] as const;
      curledFingers.forEach((f) => {
        rotateBone(`${side}hand${f}1`, 1.40, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}2`, 1.45, 0.00, 0.00, smooth);
        rotateBone(`${side}hand${f}3`, 1.35, 0.00, 0.00, smooth);
      });
    };

    const applyBeautifulThreeFingersHand = (side: "right" | "left", smooth = 0.20) => {
      // User specification:
      // "close the index finger and thumb and open another three fingers pointing towards the user"
      const sign = side === "right" ? 1 : -1;

      // Thumb: tightly closed / folded into palm against index
      rotateBone(`${side}handthumb1`, 0.35, sign * 0.40, 0.65, smooth);
      rotateBone(`${side}handthumb2`, 0.40, 0.00, 0.65, smooth);
      rotateBone(`${side}handthumb3`, 0.30, 0.00, 0.55, smooth);

      // Index finger: closed tightly into fist
      rotateBone(`${side}handindex1`, 1.40, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex2`, 1.45, 0.00, 0.00, smooth);
      rotateBone(`${side}handindex3`, 1.35, 0.00, 0.00, smooth);

      // Another three fingers (middle, ring, pinky): open straight pointing towards the user
      rotateBone(`${side}handmiddle1`, 0.00, 0.00, 0.03, smooth);
      rotateBone(`${side}handmiddle2`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handmiddle3`, 0.00, 0.00, 0.00, smooth);

      rotateBone(`${side}handring1`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handring2`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handring3`, 0.00, 0.00, 0.00, smooth);

      rotateBone(`${side}handpinky1`, 0.00, 0.00, -0.04, smooth);
      rotateBone(`${side}handpinky2`, 0.00, 0.00, 0.00, smooth);
      rotateBone(`${side}handpinky3`, 0.00, 0.00, 0.00, smooth);
    };

    const applyAnatomicalHand = (
      side: "right" | "left",
      handPose: HandAnatomicalPose,
      smooth = 0.18
    ) => {
      if (handPose === PRESET_PINCHED_EATING_MORSEL || handPose === PRESET_FLATTENED_O || handPose?.isPinchedMorsel) {
        applyPinchedMorselHand(side, smooth);
        return;
      }
      if (handPose === PRESET_C_CUP || handPose?.isDrinkingCup) {
        applyDrinkingCupHand(side, smooth);
        return;
      }
      if (handPose === PRESET_CLOSED_FIST_S || handPose?.isClosedSFist) {
        applyClosedSFistHand(side, smooth);
        return;
      }
      if (handPose === PRESET_NO_OPEN || handPose === PRESET_NO_CLOSED || handPose?.isNoSnap) {
        applyNoSnapHand(side, handPose.snapProgress ?? (handPose.index.base > 0.5 ? 1 : 0), smooth);
        return;
      }
      if (handPose === PRESET_PLEASE_CHIN_THUMB_CLOSED || handPose?.isPleaseChin) {
        applyPleaseChinHand(side, smooth);
        return;
      }
      if (handPose === PRESET_QUIET_SHHH_INDEX_LIPS || handPose?.isQuietShhh) {
        applyQuietShhhHand(side, smooth);
        return;
      }
      if (handPose === PRESET_SAD_TEAR_INDEX_EYE || handPose?.isSadTearIndex) {
        applySadTearHand(side, smooth);
        return;
      }
      if (handPose === PRESET_RUN_L_HAND || handPose?.isRunLHand) {
        applyRunLHand(side, smooth);
        return;
      }
      if (handPose === PRESET_BEAUTIFUL_L_HAND || handPose?.isBeautifulLHand) {
        applyBeautifulLHand(side, smooth);
        return;
      }
      if (handPose === PRESET_BEAUTIFUL_THREE_FINGERS || handPose?.isBeautifulThreeFingers) {
        applyBeautifulThreeFingersHand(side, smooth);
        return;
      }
      applyAnatomicalThumb(side, handPose.thumb, smooth);
      applyAnatomicalFinger(side, "index", handPose.index, smooth);
      applyAnatomicalFinger(side, "middle", handPose.middle, smooth);
      applyAnatomicalFinger(side, "ring", handPose.ring, smooth);
      applyAnatomicalFinger(side, "pinky", handPose.pinky, smooth);
    };

    const curlFinger = (side: "right" | "left", finger: string, amount: number, smooth = 0.16) => {
      for (let j = 1; j <= 3; j++) {
        const key = `${side}hand${finger}${j}`;
        rotateBone(key, amount * 0.3, 0, amount * 0.6, smooth);
      }
    };

    const setHandFingers = (
      side: "right" | "left",
      thumb: number,
      index: number,
      middle: number,
      ring: number,
      pinky: number,
      smooth = 0.16
    ) => {
      curlFinger(side, "thumb", thumb, smooth);
      curlFinger(side, "index", index, smooth);
      curlFinger(side, "middle", middle, smooth);
      curlFinger(side, "ring", ring, smooth);
      curlFinger(side, "pinky", pinky, smooth);
    };

    const applyNeutralRest = (smooth = 0.12) => {
      rotateBone("rightshoulder", 0, 0, 0, smooth);
      rotateBone("rightarm", 0.05, 0.05, -1.28, smooth);
      rotateBone("rightforearm", -0.22, 0.05, 0.05, smooth);
      rotateBone("righthand", 0.1, 0, -0.05, smooth);
      setHandFingers("right", 0.2, 0.25, 0.25, 0.25, 0.25, smooth);

      rotateBone("leftshoulder", 0, 0, 0, smooth);
      rotateBone("leftarm", 0.05, -0.05, 1.28, smooth);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, smooth);
      rotateBone("lefthand", 0.1, 0, 0.05, smooth);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, smooth);

      rotateBone("spine", 0, 0, 0, smooth);
      rotateBone("spine1", 0, 0, 0, smooth);
      rotateBone("neck", 0, 0, 0, smooth);
      rotateBone("head", 0, 0, 0, smooth);
    };

    if (!signName || signName === "rest" || signName === "standby") {
      applyNeutralRest();
      return;
    }

    if (!isPlaying && poseStep === "dynamic") return;

    const rawLower = (signName || "").toLowerCase();
    const cleanSign = rawLower.replace(/[^a-z0-9_]/g, "");
    const tokenList = rawLower.replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/);
    const wordTokens = new Set([...tokenList, ...cleanSign.split("_")]);
    const hasWord = (...kw: string[]) =>
      kw.some((w) => wordTokens.has(w) || cleanSign === w || rawLower.includes(w));

    // -----------------------------------------------------------------
    // 0. PRECISE ANATOMICAL KINEMATICS ENGINE INTEGRATION
    // Evaluates exact bone angles, wrist heights, and independent finger joints
    // for all 19 reference signs + Namaste
    // -----------------------------------------------------------------
    const resolvedKey = resolveKinematicKey(cleanSign);
    const preciseDef = PRECISE_GESTURES_MAP[resolvedKey];

    if (preciseDef) {
      const duration = preciseDef.durationSeconds || 2.2;
      let evalTime = t;

      if (poseStep === "start") {
        evalTime = 0.001;
      } else if (poseStep === "mid") {
        evalTime = duration * 0.5;
      } else if (poseStep === "end") {
        evalTime = duration * 0.999;
      } else if (!isPlaying && scrubProgress !== undefined) {
        evalTime = duration * scrubProgress;
      }

      const isLooping =
        resolvedKey === "hello" ||
        resolvedKey === "hi" ||
        resolvedKey === "bye" ||
        resolvedKey === "drink" ||
        resolvedKey === "yes" ||
        resolvedKey === "no" ||
        resolvedKey === "thank_you" ||
        resolvedKey === "please" ||
        resolvedKey === "climb" ||
        resolvedKey === "run" ||
        resolvedKey === "fall" ||
        resolvedKey === "give" ||
        resolvedKey === "push" ||
        resolvedKey === "cry" ||
        resolvedKey === "sleep" ||
        resolvedKey === "sit_down" ||
        resolvedKey === "kick" ||
        resolvedKey === "wait" ||
        resolvedKey === "walk" ||
        resolvedKey === "wash" ||
        resolvedKey === "look" ||
        resolvedKey === "jump" ||
        resolvedKey === "quiet" ||
        resolvedKey === "loud" ||
        resolvedKey === "happy" ||
        resolvedKey === "sad" ||
        resolvedKey === "beautiful" ||
        resolvedKey === "ugly" ||
        resolvedKey === "deaf" ||
        resolvedKey === "blind" ||
        hasWord("hello", "hi", "hey", "goodbye", "bye", "alvida", "tata", "drink", "drinking", "peena", "peeyo", "yes", "haan", "no", "nahi", "nahin", "thank", "thanks", "thank_you", "dhanyawad", "shukriya", "please", "kripya", "krpya", "climb", "run", "fall", "give", "push", "cry", "sleep", "sit_down", "kick", "wait", "walk", "wash", "look", "jump", "quiet", "shhh", "shh", "shaant", "shant", "silence", "chup", "loud", "shor", "awaaz", "chillana", "hungama", "awaz", "happy", "khush", "khushi", "prasann", "anand", "sad", "dukhi", "dukh", "udaas", "udas", "sorrow", "beautiful", "sundar", "khoobsurat", "khubsurat", "pretty", "ugly", "kurup", "bhadha", "bhadda", "badsurat", "deaf", "badhir", "bahra", "behra", "blind", "andha", "andhaa", "drishtihin", "netrahin");
      if (t > duration && !signDoneTriggered.current && poseStep === "dynamic") {
        if (!isLooping) {
          signDoneTriggered.current = true;
          onSignDone?.();
        }
      }

      const sampled = sampleKinematicsAtTime(resolvedKey, evalTime);

      // Apply upper torso & head/neck
      rotateBone("head", sampled.head[0], sampled.head[1], sampled.head[2]);
      rotateBone("neck", sampled.neck[0], sampled.neck[1], sampled.neck[2]);
      rotateBone("spine1", sampled.spine[0], sampled.spine[1], sampled.spine[2]);

      // Apply shoulders if specified by kinematics
      if (sampled.rightArm.shoulder) {
        rotateBone("rightshoulder", sampled.rightArm.shoulder[0], sampled.rightArm.shoulder[1], sampled.rightArm.shoulder[2], 0.28);
      } else {
        rotateBone("rightshoulder", 0, 0, 0, 0.20);
      }
      if (sampled.leftArm.shoulder) {
        rotateBone("leftshoulder", sampled.leftArm.shoulder[0], sampled.leftArm.shoulder[1], sampled.leftArm.shoulder[2], 0.28);
      } else {
        rotateBone("leftshoulder", 0, 0, 0, 0.20);
      }

      // Apply right arm & wrist with responsive tracking
      rotateBone("rightarm", sampled.rightArm.arm[0], sampled.rightArm.arm[1], sampled.rightArm.arm[2], 0.28);
      rotateBone("rightforearm", sampled.rightArm.forearm[0], sampled.rightArm.forearm[1], sampled.rightArm.forearm[2], 0.28);
      rotateBone("righthand", sampled.rightArm.wrist[0], sampled.rightArm.wrist[1], sampled.rightArm.wrist[2], 0.35);

      // Apply left arm & wrist with responsive tracking
      rotateBone("leftarm", sampled.leftArm.arm[0], sampled.leftArm.arm[1], sampled.leftArm.arm[2], 0.28);
      rotateBone("leftforearm", sampled.leftArm.forearm[0], sampled.leftArm.forearm[1], sampled.leftArm.forearm[2], 0.28);
      rotateBone("lefthand", sampled.leftArm.wrist[0], sampled.leftArm.wrist[1], sampled.leftArm.wrist[2], 0.35);

      // Apply precise anatomical fingers to both hands independently
      applyAnatomicalHand("right", sampled.rightHand);
      applyAnatomicalHand("left", sampled.leftHand);

      // Apply facial expression morph targets (e.g. radiant smile for happy)
      if (sampled.mouthSmile !== undefined) {
        setMorphTarget("mouthSmile", sampled.mouthSmile);
      } else {
        setMorphTarget("mouthSmile", 0.0);
      }

      if (t - lastKineticUpdate.current > 0.1 || !isPlaying) {
        lastKineticUpdate.current = t;
        onKineticUpdate?.({
          height: sampled.currentWristHeight,
          phase: sampled.phase,
          def: preciseDef,
        });
      }
      return;
    }

    let letterChar: string | null = null;
    if (cleanSign.startsWith("letter_")) {
      letterChar = cleanSign.replace("letter_", "").slice(0, 1);
    } else if (cleanSign.startsWith("letter") && cleanSign.length === 7) {
      letterChar = cleanSign.replace("letter", "").slice(0, 1);
    } else if (cleanSign.length === 1 && cleanSign >= "a" && cleanSign <= "z") {
      letterChar = cleanSign;
    }

    let digitChar: string | null = null;
    if (cleanSign.startsWith("number_")) {
      digitChar = cleanSign.replace("number_", "").slice(0, 1);
    } else if (cleanSign.startsWith("number") && cleanSign.length === 7) {
      digitChar = cleanSign.replace("number", "").slice(0, 1);
    } else if (cleanSign.length === 1 && cleanSign >= "0" && cleanSign <= "9") {
      digitChar = cleanSign;
    }

    // Auto-advance trigger duration (1.3s for letter/digit, 2.2s for whole-word sign)
    const isShort = Boolean(letterChar || digitChar);
    const duration = isShort ? 1.3 : 2.2;
    if (t > duration && !signDoneTriggered.current) {
      signDoneTriggered.current = true;
      onSignDone?.();
    }

    // -----------------------------------------------------------------
    // 1. WHERE (Matching chart: Right index pointing up, waving side-to-side)
    // -----------------------------------------------------------------
    if (hasWord("where", "kahan")) {
      const shake = Math.sin(t * 5.5) * 0.25;
      const tilt = Math.sin(t * 3.5) * 0.08;

      rotateBone("head", 0.05, tilt * 1.5, 0.1);
      rotateBone("neck", 0, tilt, 0.05);

      // Right hand up with index finger pointing up, waving side-to-side
      rotateBone("rightarm", -0.65, 0.15, -1.05);
      rotateBone("rightforearm", -1.35, 0.15, 0.1);
      rotateBone("righthand", 0.25, 0.1 + shake, 0.1);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2); // Pointing index finger

      // Left hand rests neutrally
      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 2. WHAT (Matching chart: Both hands open in front of body, palms up, shaking side-to-side)
    // -----------------------------------------------------------------
    else if (hasWord("what", "kya")) {
      const shake = Math.sin(t * 5.0) * 0.22;
      rotateBone("head", 0.08, shake * 0.2, 0.05);

      // Both open palms held in front of chest/waist level, undulating side to side
      rotateBone("leftarm", -0.55, -0.18 + shake * 0.1, 1.05);
      rotateBone("leftforearm", -1.25, -0.15, -0.10);
      rotateBone("lefthand", 0.25, shake * 0.3, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);

      rotateBone("rightarm", -0.55, 0.18 - shake * 0.1, -1.05);
      rotateBone("rightforearm", -1.25, 0.15, 0.10);
      rotateBone("righthand", 0.25, -shake * 0.3, 0);
      setHandFingers("right", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 3. WANT
    // -----------------------------------------------------------------
    else if (hasWord("want", "desire")) {
      const pull = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("head", 0.06, 0, 0);

      rotateBone("rightarm", -0.55 - pull * 0.15, 0.15, -1.05);
      rotateBone("rightforearm", -1.25 - pull * 0.35, 0.15, 0.1);
      rotateBone("righthand", 0.2 + pull * 0.25, 0.1, 0.1);
      setHandFingers("right", 0.4 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4);

      rotateBone("leftarm", -0.55 - pull * 0.15, -0.15, 1.05);
      rotateBone("leftforearm", -1.25 - pull * 0.35, -0.15, -0.1);
      rotateBone("lefthand", 0.2 + pull * 0.25, -0.1, -0.1);
      setHandFingers("left", 0.4 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4);
    }

    // -----------------------------------------------------------------
    // 4. NEED
    // -----------------------------------------------------------------
    else if (hasWord("need", "require")) {
      const drop = (Math.sin(t * 5.0) + 1) / 2;
      rotateBone("head", 0.08, 0, 0);

      rotateBone("rightarm", -0.55, 0.15, -1.05);
      rotateBone("rightforearm", -1.35 + drop * 0.3, 0.1, 0.1);
      rotateBone("righthand", 0.25 + drop * 0.25, 0.1, 0.1);
      setHandFingers("right", 0.8, 0.7, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 5. LIKE
    // -----------------------------------------------------------------
    else if (hasWord("like")) {
      const pinch = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("head", -0.05, 0, 0);

      rotateBone("rightarm", -0.6 + pinch * 0.2, 0.2, -1.05);
      rotateBone("rightforearm", -1.5 + pinch * 0.3, 0.1, 0.1);
      rotateBone("righthand", 0.3 + pinch * 0.2, 0.1, 0.1);
      setHandFingers("right", pinch * 0.9, 0, pinch * 0.9, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 6. NAME
    // -----------------------------------------------------------------
    else if (hasWord("name")) {
      const tap = (Math.sin(t * 5.0) + 1) / 2;

      rotateBone("leftarm", -0.55, -0.2, 1.05);
      rotateBone("leftforearm", -1.4, -0.1, 0.1);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 1.2, 0, 0, 1.2, 1.2);

      rotateBone("rightarm", -0.55, 0.2, -1.05);
      rotateBone("rightforearm", -1.4 + tap * 0.2, 0.1, -0.1);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 7. DO
    // -----------------------------------------------------------------
    else if (hasWord("do", "doing", "did", "does", "kar", "kare", "karen")) {
      const sweep = Math.sin(t * 5.0) * 0.2;
      rotateBone("head", 0.05, sweep * 0.5, 0);

      rotateBone("rightarm", -0.55, 0.2 + sweep, -1.05);
      rotateBone("rightforearm", -1.3, 0.15, 0.1);
      rotateBone("righthand", 0.3, sweep, 0);
      setHandFingers("right", 0.2, 0.3, 0.3, 0.3, 0.3);

      rotateBone("leftarm", -0.55, -0.2 + sweep, 1.05);
      rotateBone("leftforearm", -1.3, -0.15, -0.1);
      rotateBone("lefthand", 0.3, sweep, 0);
      setHandFingers("left", 0.2, 0.3, 0.3, 0.3, 0.3);
    }

    // -----------------------------------------------------------------
    // 8. LIVE (Matching chart: Both hands in 'L' handshape moving upward along torso)
    // -----------------------------------------------------------------
    else if (hasWord("live", "reside", "stay", "living", "rehte", "rehta", "rehti", "rahte")) {
      const moveUp = (Math.sin(t * 3.5) + 1) / 2;
      rotateBone("head", 0.05, 0, 0);

      // Both hands with L-handshape (thumb & index straight, middle/ring/pinky curled)
      rotateBone("rightarm", -0.50 - moveUp * 0.20, 0.18, -1.05);
      rotateBone("rightforearm", -1.30 + moveUp * 0.25, 0.12, 0.10);
      rotateBone("righthand", 0.20, 0.10, 0.05);
      setHandFingers("right", 0, 0, 1.3, 1.3, 1.3);

      rotateBone("leftarm", -0.50 - moveUp * 0.20, -0.18, 1.05);
      rotateBone("leftforearm", -1.30 + moveUp * 0.25, -0.12, -0.10);
      rotateBone("lefthand", 0.20, -0.10, -0.05);
      setHandFingers("left", 0, 0, 1.3, 1.3, 1.3);
    }

    // -----------------------------------------------------------------
    // 9. SPEAK / TALK
    // -----------------------------------------------------------------
    else if (hasWord("speak", "talk", "tell", "say")) {
      const roll = Math.sin(t * 5.0) * 0.2;
      rotateBone("head", 0.05, 0.05, 0);

      rotateBone("rightarm", -0.75, 0.2, -1.05);
      rotateBone("rightforearm", -1.45 + roll, 0.2, 0.1);
      rotateBone("righthand", 0.3 + roll, 0.1, 0.1);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 10. LISTEN / HEAR
    // -----------------------------------------------------------------
    else if (hasWord("listen", "hear")) {
      const lean = (Math.sin(t * 3.0) + 1) / 2;
      rotateBone("head", 0.1 * lean, 0.15, 0.1);

      rotateBone("rightarm", -0.85, 0.25, -1.05);
      rotateBone("rightforearm", -1.55, 0.2, 0.2);
      rotateBone("righthand", 0.4, 0.2, 0.2);
      setHandFingers("right", 0.3, 0.3, 0.3, 0.3, 0.3);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 11. WHY
    // -----------------------------------------------------------------
    else if (hasWord("why", "kyun")) {
      const extend = (Math.sin(t * 3) + 1) / 2;
      rotateBone("head", 0.05, 0.1, 0.08);

      rotateBone("rightarm", -0.65 + extend * 0.25, 0.2, -1.05);
      rotateBone("rightforearm", -1.35 + extend * 0.4, 0.2, 0.1);
      rotateBone("righthand", 0.2 + extend * 0.3, 0.1, 0.2);
      setHandFingers("right", 0, 1.2, 1.2, 1.2, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.2, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 12. WHEN
    // -----------------------------------------------------------------
    else if (hasWord("when", "kab")) {
      const circleX = Math.cos(t * 4) * 0.15;
      const circleY = Math.sin(t * 4) * 0.15;

      rotateBone("leftarm", -0.55, -0.2, 1.05);
      rotateBone("leftforearm", -1.3, -0.2, 0);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("rightarm", -0.65 + circleX, 0.2, -1.05);
      rotateBone("rightforearm", -1.35 + circleY, 0.2, 0.1);
      rotateBone("righthand", 0.3, 0.2, 0.2);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 13. NAMASTE / NAMASKAR / PRANAM (Traditional Indian Anjali Mudra)
    // -----------------------------------------------------------------
    else if (hasWord("namaste", "namaskar", "pranam")) {
      const bow = (Math.sin(t * 2.5) + 1) / 2;
      rotateBone("head", 0.18 * bow, 0, 0);
      rotateBone("neck", 0.10 * bow, 0, 0);
      rotateBone("spine1", 0.08 * bow, 0, 0);

      // Shoulders relaxed and drawn slightly forward
      rotateBone("rightshoulder", 0.04, 0.05, -0.02);
      rotateBone("leftshoulder", 0.04, -0.05, 0.02);

      // Upper arms: angled forward and inward so wrists meet flush at center chest (X ≈ 0)
      rotateBone("rightarm", 0.32, 0.00, -1.12);
      rotateBone("leftarm", 0.32, 0.00, 1.12);

      // Forearms: elbows bent inward toward center chest
      rotateBone("rightforearm", 1.00, 0.00, 0.40);
      rotateBone("leftforearm", 1.00, 0.00, -0.40);

      // Wrists: palms pressed flush together at midline (X = 0), fingers pointing directly UP
      rotateBone("righthand", -1.20, 0.88, -1.68);
      rotateBone("lefthand", -1.20, -0.88, 1.68);

      // All fingers extended flat and pressed palm-to-palm
      setHandFingers("right", 0, 0, 0, 0, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 14. HELLO (Canonical salute: touching forehead with thumb closed & 4 fingers open, sweeping outward to side)
    // -----------------------------------------------------------------
    else if (hasWord("hello", "hey", "namaskar")) {
      const cycleDuration = 2.4;
      const c = (t % cycleDuration) / cycleDuration;
      let frac = 0.0;
      if (c < 0.25) {
        frac = 0.0; // Dwell at forehead touch (Matches User Selfie Photo)
      } else if (c < 0.70) {
        const u = (c - 0.25) / 0.45;
        frac = u * u * (3 - 2 * u); // Smooth outward sweep away from forehead to side (Matches Image 2)
      } else if (c < 0.82) {
        frac = 1.0; // Open greeting hold at side
      } else {
        const u = (c - 0.82) / 0.18;
        frac = 1.0 - u * u * (3 - 2 * u); // Smooth return from side to touch forehead
      }

      rotateBone("head", -0.04, 0, -0.03);
      rotateBone("neck", 0, 0, 0);

      // Interpolate from forehead mesh touch (frac = 0) to Quadrant III outward/downward extension (frac = 1)
      const armX = -0.80 + 0.50 * frac;
      const armY = -0.10 + 0.30 * frac;
      const armZ = -1.05 + 0.25 * frac;

      const faX = -2.00 + 0.50 * frac;
      const faY =  0.80 + 0.40 * frac;
      const faZ = -0.45 + 0.65 * frac;

      const wristX =  0.40 - 0.60 * frac;
      const wristY = -0.25 + 0.10 * frac;
      const wristZ = -0.65 + 0.05 * frac;

      rotateBone("rightarm", armX, armY, armZ, 0.28);
      rotateBone("rightforearm", faX, faY, faZ, 0.28);
      rotateBone("righthand", wristX, wristY, wristZ, 0.35);

      // Thumb is closed across palm (1.0), four fingers (index, middle, ring, pinky) are open straight upright (0, 0, 0, 0)
      setHandFingers("right", 1.0, 0, 0, 0, 0);

      // Left arm down relaxed at side doing nothing
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 14b. HI (Single right-hand wave elevated above shoulder like goodbye, left hand relaxed at side)
    // -----------------------------------------------------------------
    else if (hasWord("hi")) {
      const ramp = Math.min(1.0, Math.max(0.0, (t - 0.35) / 0.35));
      const smoothRamp = ramp * ramp * (3 - 2 * ramp);
      const wave = Math.sin((t - 0.35) * 6.0) * smoothRamp;
      const armSway = Math.sin((t - 0.35) * 6.0) * 0.18 * smoothRamp;

      rotateBone("head", -0.04, 0, -0.03);
      rotateBone("neck", 0, 0, 0);

      // Right hand only elevated above shoulder and waving like goodbye
      rotateBone("rightarm", -0.40, 0.20, -0.90);
      rotateBone("rightforearm", -1.60, 1.20, armSway * 0.25, 0.30);
      rotateBone("righthand", 0.0, -0.25, -0.50 + wave * 0.45, 0.35);
      setHandFingers("right", 0, 0, 0, 0, 0);

      // Left arm down relaxed at side (only right hand is up, unlike goodbye where both hands are up)
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 14b. HOW (Matching chart: Both hands curved at chest, thumbs up, rotating outward so palms face up)
    // -----------------------------------------------------------------
    else if (hasWord("how", "kaise")) {
      const roll = (Math.sin(t * 3.8) + 1) / 2;
      rotateBone("head", 0.08, 0, 0.05);
      rotateBone("neck", 0.04, 0, 0.02);

      // Upper arms brought forward and angled inward toward center chest
      rotateBone("rightarm", -0.55, 0.18, -1.05);
      rotateBone("leftarm", -0.55, -0.18, 1.05);

      // Forearms horizontal in front of chest
      rotateBone("rightforearm", -1.25, 0.15, 0.10);
      rotateBone("leftforearm", -1.25, -0.15, -0.10);

      // Wrists: roll outward from backs facing forward to palms facing up
      rotateBone("righthand", 0.25, 0.10 + roll * 0.75, 0.10);
      rotateBone("lefthand", 0.25, -0.10 - roll * 0.75, -0.10);

      // Fingers: curved/cupped loose posture rolling open
      const curl = (1 - roll) * 0.6;
      setHandFingers("right", 0, curl, curl, curl, curl);
      setHandFingers("left", 0, curl, curl, curl, curl);
    }

    // -----------------------------------------------------------------
    // 14c. ARE / IS / AM (Matching chart: Right index pointing upright from chin/lips, moving straight forward)
    // -----------------------------------------------------------------
    else if (hasWord("are", "is", "am", "hai", "hain", "hoon", "ho")) {
      const push = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("head", 0.05, 0, 0);

      rotateBone("rightarm", -0.70, 0.18, -1.05);
      rotateBone("rightforearm", -1.45 + push * 0.35, 0.15, 0.10);
      rotateBone("righthand", 0.25 + push * 0.15, 0.10, 0.10);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 15. THANK YOU (Matching reference image media_1792274690401_fe5d1879.jpg: Flat hand starts on chin, then moves towards user)
    // -----------------------------------------------------------------
    else if (hasWord("thank_you", "thank", "thanks", "shukriya", "dhanyawad")) {
      const cycleDuration = 2.2;
      const c = (t % cycleDuration) / cycleDuration;
      let sweep = 0.0;
      if (c < 0.22) {
        sweep = 0.0; // Dwell with fingertips directly touching chin
      } else if (c < 0.70) {
        const u = (c - 0.22) / 0.48;
        sweep = u * u * (3 - 2 * u); // Smooth outward & forward sweep towards user
      } else if (c < 0.84) {
        sweep = 1.0; // Hold forward offering pose toward user
      } else {
        const u = (c - 0.84) / 0.16;
        sweep = 1.0 - u * u * (3 - 2 * u); // Return to chin
      }

      rotateBone("head", 0.04 + sweep * 0.08, 0, 0);
      rotateBone("neck", 0.02 + sweep * 0.04, 0, 0);

      // Interpolate from chin touch (sweep = 0) to forward extension toward user (sweep = 1)
      const armX = -1.57 + (-1.57 - (-1.57)) * sweep;
      const armY = -0.90 + (-0.60 - (-0.90)) * sweep;
      const armZ = -0.60 + (-0.80 - (-0.60)) * sweep;

      const faX = -1.90 + (-0.60 - (-1.90)) * sweep;
      const faY =  0.35 + (-0.60 -   0.35) * sweep;
      const faZ = -0.50 + (-0.40 - (-0.50)) * sweep;

      const wristX = -1.04 + (-1.66 - (-1.04)) * sweep;
      const wristY =  2.82 + ( 2.88 -   2.82) * sweep;
      const wristZ = -0.20 + (-0.55 - (-0.20)) * sweep;

      rotateBone("rightarm", armX, armY, armZ, 0.25);
      rotateBone("rightforearm", faX, faY, faZ, 0.25);
      rotateBone("righthand", wristX, wristY, wristZ, 0.25);

      // Open flat B-hand with four fingers and thumb straight together
      setHandFingers("right", 0.0, 0.0, 0.0, 0.0, 0.0);

      // Left arm down relaxed at side doing nothing
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0.00, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 16. GOODBYE / BYE (Both hands raised above shoulders, palms facing front side, continuous left-to-right waving)
    // -----------------------------------------------------------------
    else if (hasWord("goodbye", "bye", "alvida", "tata")) {
      const ramp = Math.min(1.0, Math.max(0.0, (t - 0.35) / 0.35));
      const smoothRamp = ramp * ramp * (3 - 2 * ramp);
      const wave = Math.sin((t - 0.35) * 6.0) * smoothRamp;
      const armSway = Math.sin((t - 0.35) * 6.0) * 0.18 * smoothRamp;

      rotateBone("head", -0.04, 0, -0.03);
      rotateBone("neck", 0, 0, 0);

      // Both arms stably elevated above shoulders with adjusted elbow rotation
      rotateBone("rightarm", -0.40, 0.20, -0.90);
      rotateBone("rightforearm", -1.60, 1.20, armSway * 0.25, 0.30);
      rotateBone("righthand", 0.0, -0.25, -0.50 + wave * 0.45, 0.35);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", -0.40, -0.20, 0.90);
      rotateBone("leftforearm", -1.60, -1.20, -armSway * 0.25, 0.30);
      rotateBone("lefthand", -0.05, 0.30, 0.40 - wave * 0.45, 0.35);
      setHandFingers("left", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 17. WATER (Matching ISL 'W' handshape tapping chin)
    // -----------------------------------------------------------------
    else if (hasWord("water", "paani")) {
      const tap = (Math.sin(t * 4.5) + 1) / 2;
      rotateBone("head", 0.05, -0.08, 0);

      rotateBone("rightarm", -0.75, 0.25, -1.05);
      rotateBone("rightforearm", -1.45 + tap * 0.2, 0.2, 0.1);
      rotateBone("righthand", 0.4 + tap * 0.25, 0.1, 0.15);
      setHandFingers("right", 1.2, 0, 0, 0, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 17b. DRINK (Matching photo: 4 fingers bent, thumb open in 'C' cup, moving from Quadrant III to Mouth)
    // -----------------------------------------------------------------
    else if (hasWord("drink", "drinking", "peena", "peeyo", "water", "paani")) {
      const cycleDuration = 2.4;
      const sipCycle = 1.2;
      const localT = (t % cycleDuration) % sipCycle;
      const u = localT / sipCycle;
      let f = 0.0;
      if (u < 0.40) {
        const s = u / 0.40;
        f = s * s * (3 - 2 * s); // Move from Quadrant III up to Mouth
      } else if (u < 0.65) {
        f = 1.0; // Dwell tilting cup to mouth / lips
      } else {
        const s = (u - 0.65) / 0.35;
        f = 1.0 - s * s * (3 - 2 * s); // Return to Quadrant III
      }

      rotateBone("head", 0.02 + f * 0.06, 0, 0);
      rotateBone("neck", 0.01 + f * 0.03, 0, 0);

      // Interpolate from Quadrant III (f = 0: X = -0.22, Y = 1.28) to Mouth-Touch (f = 1: X = 0.00, Y = 1.512)
      // Wrist turned 180° opposite from current position (Y: -1.60 -> +1.54 rad) with elbow adjusted to situation
      const q3Arm = [0.97, -0.80, 0.59];
      const q3FA = [-2.15, 0.10, -0.45];
      const q3Wrist = [0.04, 1.54, 0.19];

      const mouthArm = [-1.37, -0.45, -0.99];
      const mouthFA = [-1.95, 0.45, -0.65];
      const mouthWrist = [0.15, 1.54, 0.11];

      const armX = q3Arm[0] + (mouthArm[0] - q3Arm[0]) * f;
      const armY = q3Arm[1] + (mouthArm[1] - q3Arm[1]) * f;
      const armZ = q3Arm[2] + (mouthArm[2] - q3Arm[2]) * f;

      const faX = q3FA[0] + (mouthFA[0] - q3FA[0]) * f;
      const faY = q3FA[1] + (mouthFA[1] - q3FA[1]) * f;
      const faZ = q3FA[2] + (mouthFA[2] - q3FA[2]) * f;

      const wristX = q3Wrist[0] + (mouthWrist[0] - q3Wrist[0]) * f;
      const wristY = q3Wrist[1] + (mouthWrist[1] - q3Wrist[1]) * f;
      const wristZ = q3Wrist[2] + (mouthWrist[2] - q3Wrist[2]) * f;

      rotateBone("rightarm", armX, armY, armZ, 0.28);
      rotateBone("rightforearm", faX, faY, faZ, 0.28);
      rotateBone("righthand", wristX, wristY, wristZ, 0.35);

      // Open thumb, 4 fingers bent in C-cup shape (Matches user photo)
      applyDrinkingCupHand("right", 0.28);

      // Left arm down relaxed at side
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0.00, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 18. FOOD / EAT (Moving from Quadrant III to Mouth with pinched fingers & thumb)
    // -----------------------------------------------------------------
    else if (hasWord("food", "eat", "khana")) {
      const cycleDuration = 2.4;
      const biteCycle = 1.2;
      const localT = (t % cycleDuration) % biteCycle;
      const u = localT / biteCycle;
      let f = 0.0;
      if (u < 0.40) {
        const s = u / 0.40;
        f = s * s * (3 - 2 * s); // Move from Quadrant III to Mouth
      } else if (u < 0.60) {
        f = 1.0; // Dwell touching mouth / lips (Matches Image 2)
      } else {
        const s = (u - 0.60) / 0.40;
        f = 1.0 - s * s * (3 - 2 * s); // Return to Quadrant III
      }

      rotateBone("head", 0.03 + f * 0.05, 0, 0);
      rotateBone("neck", 0.02 + f * 0.03, 0, 0);

      // Interpolate from Quadrant III (f = 0) to Mouth Touch (f = 1)
      // From Quadrant III (f = 0: X = -0.22, Y = 1.28) moving smoothly to Mouth-Touch (f = 1: X = 0.00, Y = 1.513)
      const q3Arm = [0.97, -0.80, 0.59];
      const q3FA = [-2.15, 0.10, -0.45];
      const q3Wrist = [0.04, 3.11, 0.19];

      const mouthArm = [-1.37, -0.45, -0.99];
      const mouthFA = [-1.95, 0.45, -0.65];
      const mouthWrist = [-0.05, 3.11, 0.11];

      const armX = q3Arm[0] + (mouthArm[0] - q3Arm[0]) * f;
      const armY = q3Arm[1] + (mouthArm[1] - q3Arm[1]) * f;
      const armZ = q3Arm[2] + (mouthArm[2] - q3Arm[2]) * f;

      const faX = q3FA[0] + (mouthFA[0] - q3FA[0]) * f;
      const faY = q3FA[1] + (mouthFA[1] - q3FA[1]) * f;
      const faZ = q3FA[2] + (mouthFA[2] - q3FA[2]) * f;

      const wristX = q3Wrist[0] + (mouthWrist[0] - q3Wrist[0]) * f;
      const wristY = q3Wrist[1] + (mouthWrist[1] - q3Wrist[1]) * f;
      const wristZ = q3Wrist[2] + (mouthWrist[2] - q3Wrist[2]) * f;

      rotateBone("rightarm", armX, armY, armZ, 0.28);
      rotateBone("rightforearm", faX, faY, faZ, 0.28);
      rotateBone("righthand", wristX, wristY, wristZ, 0.35);

      // All four fingers and thumb brought together in pinched morsel posture with fingertips touching (Matches Image 1)
      applyPinchedMorselHand("right", 0.28);

      // Left arm down relaxed at side doing nothing
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0.00, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 19. HELP
    // -----------------------------------------------------------------
    else if (hasWord("help", "emergency", "madad")) {
      const lift = Math.sin(t * 3.5) * 0.2;

      rotateBone("leftarm", -0.55 + lift, -0.2, 1.05);
      rotateBone("leftforearm", -1.25, -0.15, -0.15);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);

      rotateBone("rightarm", -0.6 + lift, 0.2, -1.05);
      rotateBone("rightforearm", -1.3, 0.15, 0.2);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 0, 1.3, 1.3, 1.3, 1.3);
    }

    // -----------------------------------------------------------------
    // 20. DOCTOR / HOSPITAL
    // -----------------------------------------------------------------
    else if (hasWord("doctor", "hospital", "medicine")) {
      const tap = (Math.sin(t * 4.5) + 1) / 2;

      rotateBone("leftarm", -0.5, -0.25, 1.05);
      rotateBone("leftforearm", -1.35, -0.2, 0);
      rotateBone("lefthand", 0.1, 0, 0);
      setHandFingers("left", 0.2, 0.2, 0.2, 0.2, 0.2);

      rotateBone("rightarm", -0.6, 0.25, -1.05);
      rotateBone("rightforearm", -1.4 + tap * 0.25, 0.15, 0.15);
      rotateBone("righthand", 0.4, 0.1, 0.2);
      setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 21. SCHOOL / COLLEGE / STUDY / BOOK
    // -----------------------------------------------------------------
    else if (hasWord("school", "college", "study", "book")) {
      const clap = (Math.sin(t * 4.0) + 1) / 2;

      rotateBone("leftarm", -0.55, -0.2, 1.05);
      rotateBone("leftforearm", -1.25, -0.15, 0);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);

      rotateBone("rightarm", -0.6 + clap * 0.2, 0.2, -1.05);
      rotateBone("rightforearm", -1.3 + clap * 0.25, 0.15, 0.15);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 22. YES (Matching user photos: Closed S-fist with all fingers & thumb closed; starts UP and nods DOWN)
    // -----------------------------------------------------------------
    else if (hasWord("yes", "haan")) {
      const cycleDuration = 1.4;
      const cycle = (t % cycleDuration) / cycleDuration;
      // Affirmative nod: 0 = UP position (knuckles pointing up), 1 = DOWN position (knuckles dipping down)
      const nod = Math.pow((1 - Math.cos(cycle * Math.PI * 2)) / 2, 1.5);

      rotateBone("head", 0.04 + nod * 0.18, 0, 0);
      rotateBone("neck", 0.02 + nod * 0.08, 0, 0);

      // Single right arm with elbow turned 45 degrees from right to left, holding fist facing directly towards the user
      rotateBone("rightarm", -0.50, -0.20, -0.90, 0.25);
      rotateBone("rightforearm", -1.60, 1.00, -0.25, 0.25);
      // Hand starts in UP position with fist facing user, then flexes cleanly DOWN at wrist
      rotateBone(
        "righthand",
        -0.35 + nod * 1.40,
        -0.20 - nod * 0.20,
        -0.40 + nod * 0.60,
        0.30
      );

      // Tightly closed S-fist with all fingers & thumb closed (Matches user photo media_1792267414545_48095781.jpg)
      applyClosedSFistHand("right", 0.25);

      // Left arm down relaxed at side doing nothing (only right hand up)
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0.00, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 23. NO (Matching reference image media_1792271941698_d19ca306.jpg: Index & middle snap to touch thumb pad, ring & pinky curled to palm, head shakes side-to-side)
    // -----------------------------------------------------------------
    else if (hasWord("no", "nahi", "nahin")) {
      const shake = Math.sin(t * 5.0) * 0.18; // Head shake side-to-side in refusal
      const snap = Math.pow((Math.sin(t * 6.5) + 1) / 2, 1.8); // Snapping cycle: 0 = open beak, 1 = index & middle touching thumb pad
      rotateBone("head", 0.02, shake, 0);
      rotateBone("neck", 0.00, shake * 0.6, 0);

      // Right arm held forward at chest/shoulder level with elbow turned 45 degrees from right to left
      rotateBone("rightarm", -0.55, -0.20, -0.95, 0.25);
      rotateBone("rightforearm", -1.35, 0.90, -0.10, 0.25);
      rotateBone("righthand", 0.20, 0.10, 0.05, 0.25);

      // Finger movement: Index & middle snap down touching thumb pad directly; ring & pinky tightly curled to palm
      applyNoSnapHand("right", snap, 0.25);

      // Left arm down relaxed at side doing nothing (only right hand active)
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0.00, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 24. I / ME (Matching chart: Index finger points directly to own chest)
    // -----------------------------------------------------------------
    else if (hasWord("i", "me", "main", "mujhe")) {
      rotateBone("head", 0.08, 0, 0);

      rotateBone("rightarm", -0.55, 0.25, -1.05);
      rotateBone("rightforearm", -1.50, 0.10, 0.10);
      rotateBone("righthand", 0.40, 0.10, 0.20);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 24b. MY / MINE (Flat open palm placed against center of chest)
    // -----------------------------------------------------------------
    else if (hasWord("my", "mine", "mera", "meri", "mere")) {
      rotateBone("head", 0.06, 0, 0);

      rotateBone("rightarm", -0.55, 0.22, -1.05);
      rotateBone("rightforearm", -1.45, 0.12, 0.15);
      rotateBone("righthand", 0.35, 0.10, 0.15);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 24c. YOUR / YOURS (Matching chart: Open flat palm pushed forward toward partner)
    // -----------------------------------------------------------------
    else if (hasWord("your", "yours", "aapka", "tumhara", "tera", "aapki", "tumhari", "teri")) {
      const push = (Math.sin(t * 3.5) + 1) / 2;
      rotateBone("head", 0.05, 0, 0);

      rotateBone("rightarm", -0.65, 0.12, -1.05);
      rotateBone("rightforearm", -0.85 + push * 0.20, 0.10, 0.05);
      rotateBone("righthand", 0.50, 0.10, 0.05);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 25. YOU (Both hands index fingers pointing forward towards the user)
    // -----------------------------------------------------------------
    else if (hasWord("you", "aap", "tum", "tu")) {
      const pointPulse = Math.sin(t * 3.5) * 0.08;
      rotateBone("head", 0.04, 0, 0);

      // Right arm pointing forward towards user
      rotateBone("rightarm", -0.65, 0.10, -1.05);
      rotateBone("rightforearm", -0.65 + pointPulse, 0.05, 0.05);
      rotateBone("righthand", 0.10, 0, 0.05);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      // Left arm pointing forward towards user
      rotateBone("leftarm", -0.65, -0.10, 1.05);
      rotateBone("leftforearm", -0.65 + pointPulse, -0.05, -0.05);
      rotateBone("lefthand", 0.10, 0, -0.05);
      setHandFingers("left", 1.2, 0, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 25b. FINE (Matching chart: Open 5-hand with thumb touching center of chest)
    // -----------------------------------------------------------------
    else if (hasWord("fine", "theek", "thik", "badhiya", "well")) {
      const tap = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("head", 0.06, 0, 0);

      rotateBone("rightarm", -0.55, 0.22, -1.05);
      rotateBone("rightforearm", -1.45 + tap * 0.12, 0.12, 0.10);
      rotateBone("righthand", 0.30 + tap * 0.10, 0.10, 0.15);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 26. PLEASE (Shoulder moves from right to left, elbow turns 90° from right to left, palm/wrist touches chest, head bows down)
    // -----------------------------------------------------------------
    else if (hasWord("please", "kripya", "krpya")) {
      const cycleDuration = 2.4;
      const u = (t % cycleDuration) / cycleDuration;
      let f = 0.0;
      if (u < 0.40) {
        const s = u / 0.40;
        f = s * s * (3 - 2 * s); // Move shoulder from right to left, turn elbow 90°, touch chest, bow head
      } else if (u < 0.75) {
        f = 1.0; // Dwell with palm/wrist touching chest, elbow turned 90°, head bowed down
      } else {
        const s = (u - 0.75) / 0.25;
        f = 1.0 - s * s * (3 - 2 * s); // Smooth return to right side
      }

      // Head bows down while touching chest
      rotateBone("head", 0.04 + f * 0.20, 0, 0, 0.25);
      rotateBone("neck", 0.02 + f * 0.08, 0, 0, 0.25);

      // Shoulder moves from right to left: starts at -0.10 rad and rotates across to +0.7854 rad
      const shoulderY = -0.10 + (0.7854 - (-0.10)) * f;
      rotateBone("rightshoulder", 0.04 * f, shoulderY, 0.02 * f, 0.25);

      // Start position on right side at chest height (no 3rd quadrant backward flaring)
      const startArm = [-0.55, 0.35, -1.05];
      const startFA = [-1.45, 0.10, 0.15];
      const startWrist = [0.25, 0.10, 0.15];

      // Chest target pose: elbow turned 90° from right to left across chest, wrist/palm touching chest
      const touchArm = [-0.55, -0.15, -1.05];
      const touchFA = [-1.55, 1.5708, 0.15]; // Elbow turned 90° from right to left
      const touchWrist = [0.35, -0.45, 0.25]; // Palm and wrist touching chest directly

      const armX = startArm[0] + (touchArm[0] - startArm[0]) * f;
      const armY = startArm[1] + (touchArm[1] - startArm[1]) * f;
      const armZ = startArm[2] + (touchArm[2] - startArm[2]) * f;

      const faX = startFA[0] + (touchFA[0] - startFA[0]) * f;
      const faY = startFA[1] + (touchFA[1] - startFA[1]) * f;
      const faZ = startFA[2] + (touchFA[2] - startFA[2]) * f;

      const wristX = startWrist[0] + (touchWrist[0] - startWrist[0]) * f;
      const wristY = startWrist[1] + (touchWrist[1] - startWrist[1]) * f;
      const wristZ = startWrist[2] + (touchWrist[2] - startWrist[2]) * f;

      rotateBone("rightarm", armX, armY, armZ, 0.25);
      rotateBone("rightforearm", faX, faY, faZ, 0.25);
      rotateBone("righthand", wristX, wristY, wristZ, 0.25);

      // Four fingers straight, thumb closed across palm
      applyPleaseChinHand("right", 0.25);

      // Left arm down relaxed at side doing nothing
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.20);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.20);
      rotateBone("lefthand", 0.10, 0.00, 0.05, 0.20);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 27. SORRY
    // -----------------------------------------------------------------
    else if (hasWord("sorry")) {
      const circleX = Math.cos(t * 4.5) * 0.15;
      const circleY = Math.sin(t * 4.5) * 0.15;
      rotateBone("head", 0.12, 0, 0);

      rotateBone("rightarm", -0.55 + circleX, 0.2, -1.05);
      rotateBone("rightforearm", -1.45 + circleY, 0.15, 0.15);
      rotateBone("righthand", 0.45, 0.1, 0.2);
      setHandFingers("right", 1.2, 1.2, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 28. GO / COME
    // -----------------------------------------------------------------
    else if (hasWord("go", "come")) {
      const roll = Math.sin(t * 4.5) * 0.3;
      rotateBone("rightarm", -0.6, 0.15, -1.05);
      rotateBone("rightforearm", -0.8 + roll, 0.1, 0.1);
      rotateBone("righthand", 0.2 + roll * 0.6, 0, 0.1);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", -0.6, -0.15, 1.05);
      rotateBone("leftforearm", -0.8 - roll, -0.1, -0.1);
      rotateBone("lefthand", 0.2 - roll * 0.6, 0, -0.1);
      setHandFingers("left", 1.2, 0, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 29. FRIEND
    // -----------------------------------------------------------------
    else if (hasWord("friend", "dost", "mitra")) {
      const hook = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("rightarm", -0.55, 0.2, -1.05);
      rotateBone("rightforearm", -1.35, 0.2, 0.15);
      rotateBone("righthand", 0.3 + hook * 0.2, 0.1, 0.1);
      setHandFingers("right", 1.2, 0.6, 1.3, 1.3, 1.3);

      rotateBone("leftarm", -0.55, -0.2, 1.05);
      rotateBone("leftforearm", -1.35, -0.2, -0.15);
      rotateBone("lefthand", 0.3 + hook * 0.2, -0.1, -0.1);
      setHandFingers("left", 1.2, 0.6, 1.3, 1.3, 1.3);
    }

    // -----------------------------------------------------------------
    // 30. FAMILY
    // -----------------------------------------------------------------
    else if (hasWord("family", "parivar")) {
      const circle = Math.sin(t * 3.5) * 0.3;
      rotateBone("rightarm", -0.55, 0.2 + circle, -1.05);
      rotateBone("rightforearm", -1.3, 0.2, 0.1);
      rotateBone("righthand", 0.3, 0.2, 0.1);
      setHandFingers("right", 0.9, 0.9, 0, 0, 0);

      rotateBone("leftarm", -0.55, -0.2 - circle, 1.05);
      rotateBone("leftforearm", -1.3, -0.2, -0.1);
      rotateBone("lefthand", 0.3, -0.2, -0.1);
      setHandFingers("left", 0.9, 0.9, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 31. FATHER
    // -----------------------------------------------------------------
    else if (hasWord("father", "papa", "pitaji")) {
      const tap = (Math.sin(t * 4.5) + 1) / 2;
      rotateBone("rightarm", -0.85, 0.2, -1.05);
      rotateBone("rightforearm", -1.45 + tap * 0.2, 0.2, 0.1);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 32. MOTHER
    // -----------------------------------------------------------------
    else if (hasWord("mother", "mummy", "mataji", "maa")) {
      const tap = (Math.sin(t * 4.5) + 1) / 2;
      rotateBone("rightarm", -0.75, 0.2, -1.05);
      rotateBone("rightforearm", -1.5 + tap * 0.2, 0.15, 0.1);
      rotateBone("righthand", 0.35, 0.1, 0.1);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 33. HE / SHE / IT / THIRD PERSON PRONOUN
    // -----------------------------------------------------------------
    else if (hasWord("he", "she", "it", "woh", "usne", "unka", "uska", "his", "her", "they")) {
      rotateBone("rightarm", -0.65, 0.3, -1.05);
      rotateBone("rightforearm", -0.75, 0.1, 0.1);
      rotateBone("righthand", 0.2, 0.1, 0.1);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 34. WE / US / OUR
    // -----------------------------------------------------------------
    else if (hasWord("we", "us", "our", "hum", "hamara")) {
      const sweep = Math.sin(t * 3.5) * 0.3;
      rotateBone("rightarm", -0.55, 0.2 + sweep, -1.05);
      rotateBone("rightforearm", -1.35, 0.15, 0.1);
      rotateBone("righthand", 0.2, sweep, 0.1);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 35. HAPPY (Both flat hands brushing upward along chest to collarbones)
    // -----------------------------------------------------------------
    else if (hasWord("happy", "khush", "khushi", "prasann", "anand")) {
      const cycle = 2.8;
      const c = (t % cycle) / cycle;

      const smooth = (x: number) => {
        const cl = Math.max(0, Math.min(1, x));
        return cl * cl * (3 - 2 * cl);
      };
      const lerpV = (a: number[], b: number[], factor: number) => [
        a[0] + (b[0] - a[0]) * factor,
        a[1] + (b[1] - a[1]) * factor,
        a[2] + (b[2] - a[2]) * factor,
      ];

      // Posture 1: Rest at Sides / Waist (Reference Video Phase 1)
      const rArmRest = [-0.10, 0.05, -0.20];
      const rFARest  = [-0.15, 0.05, 0.05];
      const rWrRest  = [0.05, 0.00, 0.00];

      const lArmRest = [-0.10, -0.05, 0.20];
      const lFARest  = [-0.15, -0.05, -0.05];
      const lWrRest  = [0.05, 0.00, 0.00];

      // User Calibrated: Right elbow turned 90 deg from right to left across to chest,
      // Left elbow turned 90 deg from left to right across to chest.
      const rArmLow = [-0.20, 0.00, -0.85];
      const rFALow  = [-1.35, -0.30, -1.45]; // Turned 90 deg from right to left

      const lArmLow = [-0.20, 0.00, 0.85];
      const lFALow  = [-1.35, 0.30, 1.45];   // Turned 90 deg from left to right

      // Upper chest brushing posture
      const rArmHigh = [-0.38, 0.05, -0.95];
      const rFAHigh  = [-1.35, -0.30, -1.45];

      const lArmHigh = [-0.38, -0.05, 0.95];
      const lFAHigh  = [-1.35, 0.30, 1.45];

      // Wrists DOWN: fingers pointing downward, wrists turned 180 deg
      const rWrDown = [-1.94, 0.70, -2.04];
      const lWrDown = [-1.94, -0.70, 2.04];

      // Wrists UP: turned from down to up slowly, fingers pointing upward, wrists turned 180 deg
      const rWrUp = [-2.14, 0.80, 1.94];
      const lWrUp = [-2.14, -0.80, -1.94];

      let rArmCur = rArmRest;
      let rFACur  = rFARest;
      let rWrCur  = rWrRest;
      let lArmCur = lArmRest;
      let lFACur  = lFARest;
      let lWrCur  = lWrRest;

      let headPitch = 0.0;
      let flatHand = 0.0;
      let smileWeight = 0.0;

      if (c < 0.10) {
        // Phase 1: Waist Rest
        rArmCur = rArmRest; rFACur = rFARest; rWrCur = rWrRest;
        lArmCur = lArmRest; lFACur = lFARest; lWrCur = lWrRest;
        headPitch = 0.0;
        flatHand = 0.0;
        smileWeight = 0.0;
      } else if (c < 0.20) {
        // Phase 2: Approach to lower chest (elbows turn 90 deg into position, wrists in DOWN pose)
        const u = smooth((c - 0.10) / 0.10);
        rArmCur = lerpV(rArmRest, rArmLow, u);
        rFACur  = lerpV(rFARest, rFALow, u);
        rWrCur  = lerpV(rWrRest, rWrDown, u);
        lArmCur = lerpV(lArmRest, lArmLow, u);
        lFACur  = lerpV(lFARest, lFALow, u);
        lWrCur  = lerpV(lWrRest, lWrDown, u);
        headPitch = -0.02 * u;
        flatHand = u;
        smileWeight = 0.40 * u;
      } else if (c < 0.48) {
        // Phase 3 (Stroke 1): "AFTER THAT TURN THE WRIST FROM DOWN TO UP SLOWLY"
        // Wrists turn slowly from DOWN to UP while palms brush upward along chest with a joyful smile!
        const u = smooth((c - 0.20) / 0.28);
        rArmCur = lerpV(rArmLow, rArmHigh, u);
        rFACur  = rFAHigh;
        rWrCur  = lerpV(rWrDown, rWrUp, u);
        lArmCur = lerpV(lArmLow, lArmHigh, u);
        lFACur  = lFAHigh;
        lWrCur  = lerpV(lWrDown, lWrUp, u);
        headPitch = -0.02 - 0.07 * u;
        flatHand = 1.0;
        smileWeight = 0.40 + 0.55 * u; // Radiant warm smile (0.95)
      } else if (c < 0.56) {
        // Smooth reset dip between strokes (wrists dip back toward DOWN)
        const u = smooth((c - 0.48) / 0.08);
        rArmCur = lerpV(rArmHigh, rArmLow, u * 0.85);
        rFACur  = rFAHigh;
        rWrCur  = lerpV(rWrUp, rWrDown, u * 0.85);
        lArmCur = lerpV(lArmHigh, lArmLow, u * 0.85);
        lFACur  = lFAHigh;
        lWrCur  = lerpV(lWrUp, lWrDown, u * 0.85);
        headPitch = -0.09 + 0.04 * u;
        flatHand = 1.0;
        smileWeight = 0.95 - 0.10 * u;
      } else if (c < 0.80) {
        // Stroke 2: Second slow upward wrist turn (DOWN to UP) brushing upward with warm smile
        const u = smooth((c - 0.56) / 0.24);
        const rArmMid = lerpV(rArmHigh, rArmLow, 0.85);
        const lArmMid = lerpV(lArmHigh, lArmLow, 0.85);
        const rWrMid  = lerpV(rWrUp, rWrDown, 0.85);
        const lWrMid  = lerpV(lWrUp, lWrDown, 0.85);
        rArmCur = lerpV(rArmMid, rArmHigh, u);
        rFACur  = rFAHigh;
        rWrCur  = lerpV(rWrMid, rWrUp, u);
        lArmCur = lerpV(lArmMid, lArmHigh, u);
        lFACur  = lFAHigh;
        lWrCur  = lerpV(lWrMid, lWrUp, u);
        headPitch = -0.05 - 0.05 * u;
        flatHand = 1.0;
        smileWeight = 0.85 + 0.10 * u; // Radiant warm smile (0.95)
      } else {
        // Phase 5: Smooth deceleration return back past chest to neutral waist rest
        const u = smooth((c - 0.80) / 0.20);
        rArmCur = lerpV(rArmHigh, rArmRest, u);
        rFACur  = lerpV(rFAHigh, rFARest, u);
        rWrCur  = lerpV(rWrUp, rWrRest, u);
        lArmCur = lerpV(lArmHigh, lArmRest, u);
        lFACur  = lerpV(lFAHigh, lFARest, u);
        lWrCur  = lerpV(lWrUp, lWrRest, u);
        headPitch = -0.10 * (1.0 - u);
        flatHand = 1.0 - u;
        smileWeight = 0.95 * (1.0 - u);
      }

      rotateBone("head", headPitch, 0, 0, 0.28);
      rotateBone("neck", headPitch * 0.4, 0, 0, 0.28);
      rotateBone("spine1", headPitch * 0.35, 0, 0, 0.28);

      // Facial expression: Warm radiant smile
      setMorphTarget("mouthSmile", smileWeight);

      // Right arm (elbow turned 90 deg right-to-left across chest, wrist turning DOWN to UP)
      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2], 0.28);
      rotateBone("rightforearm", rFACur[0], rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1], rWrCur[2], 0.32);
      setHandFingers("right", 0.05 * (1.0 - flatHand), 0.0, 0.0, 0.0, 0.0);

      // Left arm (elbow turned 90 deg left-to-right across chest, wrist turning DOWN to UP)
      rotateBone("leftarm", lArmCur[0], lArmCur[1], lArmCur[2], 0.28);
      rotateBone("leftforearm", lFACur[0], lFACur[1], lFACur[2], 0.28);
      rotateBone("lefthand", lWrCur[0], lWrCur[1], lWrCur[2], 0.32);
      setHandFingers("left", 0.05 * (1.0 - flatHand), 0.0, 0.0, 0.0, 0.0);
    }

    // -----------------------------------------------------------------
    // 36. SAD (Index finger at eye tear line moving UP to DOWN along cheek)
    // -----------------------------------------------------------------
    else if (hasWord("sad", "dukhi", "dukh", "udaas", "udas", "sorrow")) {
      const cycle = 2.6;
      const progress = (t % cycle) / cycle;

      // Rest arm references
      const rArmRest = [0.05, 0.05, -1.28];
      const rFARest  = [-0.22, 0.05, 0.05];
      const rWrRest  = [0.10, 0.00, -0.05];

      const lArmRest = [0.05, -0.05, 1.28];
      const lFARest  = [-0.22, -0.05, -0.05];
      const lWrRest  = [0.10, 0.00, 0.05];

      // Eye Contact Pose (Start: fingertips at eyes tear lines)
      const rArmEye = [-1.22, -1.05, -1.70];
      const rFAEye  = [-2.28, 2.95, 0.80];
      const rWrEye  = [0.15, 0.65, -0.45];

      const lArmEye = [-1.22, 1.05, 1.70];
      const lFAEye  = [-2.28, -2.95, -0.80];
      const lWrEye  = [0.15, -0.65, 0.45];

      // Cheek / Lower Jaw Pose (End: fingertips trace down along cheeks)
      const rArmDrop = [-1.45, -1.25, -1.35];
      const rFADrop  = [-2.20, 2.90, 0.75];
      const rWrDrop  = [-0.15, 0.55, -0.45];

      const lArmDrop = [-1.45, 1.25, 1.35];
      const lFADrop  = [-2.20, -2.90, -0.75];
      const lWrDrop  = [-0.15, -0.55, 0.45];

      const lerpV = (a: number[], b: number[], w: number) => [
        a[0] + (b[0] - a[0]) * w,
        a[1] + (b[1] - a[1]) * w,
        a[2] + (b[2] - a[2]) * w,
      ];

      let rArmCur = rArmRest;
      let rFACur  = rFARest;
      let rWrCur  = rWrRest;

      let lArmCur = lArmRest;
      let lFACur  = lFARest;
      let lWrCur  = lWrRest;

      let headDroop = 0.0;

      if (progress < 0.22) {
        // Phase 1: Both hands ascend directly to eye tear lines
        const u = progress / 0.22;
        rArmCur = lerpV(rArmRest, rArmEye, u);
        rFACur  = lerpV(rFARest, rFAEye, u);
        rWrCur  = lerpV(rWrRest, rWrEye, u);
        lArmCur = lerpV(lArmRest, lArmEye, u);
        lFACur  = lerpV(lFARest, lFAEye, u);
        lWrCur  = lerpV(lWrRest, lWrEye, u);
        headDroop = 0.14 * u;
      } else if (progress < 0.72) {
        // Phase 2: Both index fingers trace slowly from UP to DOWN along cheeks (falling tears)
        const u = (progress - 0.22) / 0.50;
        rArmCur = lerpV(rArmEye, rArmDrop, u);
        rFACur  = lerpV(rFAEye, rFADrop, u);
        rWrCur  = lerpV(rWrEye, rWrDrop, u);
        lArmCur = lerpV(lArmEye, lArmDrop, u);
        lFACur  = lerpV(lFAEye, lFADrop, u);
        lWrCur  = lerpV(lWrEye, lWrDrop, u);
        headDroop = 0.14 + 0.03 * Math.sin(u * Math.PI);
      } else {
        // Phase 3: Smooth return to rest
        const u = (progress - 0.72) / 0.28;
        rArmCur = lerpV(rArmDrop, rArmRest, u);
        rFACur  = lerpV(rFADrop, rFARest, u);
        rWrCur  = lerpV(rWrDrop, rWrRest, u);
        lArmCur = lerpV(lArmDrop, lArmRest, u);
        lFACur  = lerpV(lFADrop, lFARest, u);
        lWrCur  = lerpV(lWrDrop, lWrRest, u);
        headDroop = 0.14 * (1.0 - u);
      }

      // Head drooping downward sadly, mouthSmile flat/0
      rotateBone("head", headDroop, 0, 0, 0.25);
      rotateBone("neck", headDroop * 0.4, 0, 0, 0.25);
      rotateBone("spine1", headDroop * 0.3, 0, 0, 0.25);
      setMorphTarget("mouthSmile", 0.0);

      // Right arm tracing tear
      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2], 0.28);
      rotateBone("rightforearm", rFACur[0], rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1], rWrCur[2], 0.30);
      applySadTearHand("right", 0.25);

      // Left arm tracing tear simultaneously
      rotateBone("leftarm", lArmCur[0], lArmCur[1], lArmCur[2], 0.28);
      rotateBone("leftforearm", lFACur[0], lFACur[1], lFACur[2], 0.28);
      rotateBone("lefthand", lWrCur[0], lWrCur[1], lWrCur[2], 0.30);
      applySadTearHand("left", 0.25);
    }

    // -----------------------------------------------------------------
    // 36b. RUN (Modified L-handshape, left elbow turned 90° left-to-right across torso,
    // left index finger touching right thumb from back, right index finger pointing forward towards user)
    // -----------------------------------------------------------------
    else if (hasWord("run", "bhagna", "daudna", "running")) {
      const cycle = 2.6;
      const c = (t % cycle) / cycle;

      const smooth = (x: number) => {
        const cl = Math.max(0, Math.min(1, x));
        return cl * cl * (3 - 2 * cl);
      };
      const lerpV = (a: number[], b: number[], factor: number) => [
        a[0] + (b[0] - a[0]) * factor,
        a[1] + (b[1] - a[1]) * factor,
        a[2] + (b[2] - a[2]) * factor,
      ];

      // Resting standby position at waist
      const rArmRest = [-0.10, 0.05, -0.20];
      const rFARest  = [-0.15, 0.05, 0.05];
      const rWrRest  = [0.05, 0.00, 0.00];

      const lArmRest = [-0.10, -0.05, 0.20];
      const lFARest  = [-0.15, -0.05, -0.05];
      const lWrRest  = [0.05, 0.00, 0.00];

      // Running Contact Base Posture:
      // Left elbow turned 90° from left to right across chest
      const lArmBase = [-0.35, -0.05, 1.15];
      const lFABase  = [-1.45, 0.30, 1.45]; // Turned 90° left to right
      const lWrBase  = [0.10, 0.20, 0.25];

      // Right arm with index finger pointing forward towards user, thumb upright touching left index
      const rArmBase = [-0.35, 0.45, -0.70];
      const rFABase  = [-1.35, 0.10, -0.95];
      const rWrBase  = [0.75, -0.20, -0.35]; // Index points forward towards user (+Z)

      // Running Strides (Forward Propulsion Pulse)
      const lArmPulse = [-0.48, -0.05, 1.15];
      const lFAPulse  = [-1.15, 0.30, 1.45];
      const lWrPulse  = [0.15, 0.20, 0.25];

      const rArmPulse = [-0.48, 0.40, -0.70];
      const rFAPulse  = [-1.05, 0.10, -0.95];
      const rWrPulse  = [0.85, -0.20, -0.35];

      let rArmCur = rArmRest;
      let rFACur  = rFARest;
      let rWrCur  = rWrRest;

      let lArmCur = lArmRest;
      let lFACur  = lFARest;
      let lWrCur  = lWrRest;

      let headPitch = 0.0;
      let spinePitch = 0.0;
      let isRunning = true;

      if (c < 0.12) {
        // Phase 1: Waist Rest
        rArmCur = rArmRest; rFACur = rFARest; rWrCur = rWrRest;
        lArmCur = lArmRest; lFACur = lFARest; lWrCur = lWrRest;
        headPitch = 0.0;
        spinePitch = 0.0;
        isRunning = false;
      } else if (c < 0.25) {
        // Phase 2: Approach & Contact Setup (Left elbow turns 90° across, right index aims at user, fingers take L-shape, left index touches back of right thumb)
        const u = smooth((c - 0.12) / 0.13);
        rArmCur = lerpV(rArmRest, rArmBase, u);
        rFACur  = lerpV(rFARest, rFABase, u);
        rWrCur  = lerpV(rWrRest, rWrBase, u);
        lArmCur = lerpV(lArmRest, lArmBase, u);
        lFACur  = lerpV(lFARest, lFABase, u);
        lWrCur  = lerpV(lWrRest, lWrBase, u);
        headPitch = 0.08 * u;
        spinePitch = 0.05 * u;
        isRunning = true;
      } else if (c < 0.50) {
        // Phase 3 (Running Stride 1): Forward running thrust and rebound while maintaining hook contact
        const u = (c - 0.25) / 0.25;
        const stride = Math.sin(u * Math.PI);
        rArmCur = lerpV(rArmBase, rArmPulse, stride);
        rFACur  = lerpV(rFABase, rFAPulse, stride);
        rWrCur  = lerpV(rWrBase, rWrPulse, stride);
        lArmCur = lerpV(lArmBase, lArmPulse, stride);
        lFACur  = lerpV(lFABase, lFAPulse, stride);
        lWrCur  = lerpV(lWrBase, lWrPulse, stride);
        headPitch = 0.08 + 0.03 * stride;
        spinePitch = 0.05 + 0.02 * stride;
        isRunning = true;
      } else if (c < 0.78) {
        // Phase 4 (Running Stride 2): Second crisp forward propulsion stride
        const u = (c - 0.50) / 0.28;
        const stride = Math.sin(u * Math.PI);
        rArmCur = lerpV(rArmBase, rArmPulse, stride);
        rFACur  = lerpV(rFABase, rFAPulse, stride);
        rWrCur  = lerpV(rWrBase, rWrPulse, stride);
        lArmCur = lerpV(lArmBase, lArmPulse, stride);
        lFACur  = lerpV(lFABase, lFAPulse, stride);
        lWrCur  = lerpV(lWrBase, lWrPulse, stride);
        headPitch = 0.08 + 0.03 * stride;
        spinePitch = 0.05 + 0.02 * stride;
        isRunning = true;
      } else {
        // Phase 5: Smooth deceleration return back to waist rest
        const u = smooth((c - 0.78) / 0.22);
        rArmCur = lerpV(rArmBase, rArmRest, u);
        rFACur  = lerpV(rFABase, rFARest, u);
        rWrCur  = lerpV(rWrBase, rWrRest, u);
        lArmCur = lerpV(lArmBase, lArmRest, u);
        lFACur  = lerpV(lFABase, lFARest, u);
        lWrCur  = lerpV(lWrBase, lWrRest, u);
        headPitch = 0.08 * (1.0 - u);
        spinePitch = 0.05 * (1.0 - u);
        isRunning = u < 0.6;
      }

      rotateBone("head", headPitch, 0, 0, 0.25);
      rotateBone("neck", headPitch * 0.4, 0, 0, 0.25);
      rotateBone("spine1", spinePitch, 0, 0, 0.25);

      // Right arm (index pointing forward towards user, thumb upright touching left index)
      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2], 0.28);
      rotateBone("rightforearm", rFACur[0], rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1], rWrCur[2], 0.32);

      // Left arm (elbow turned 90 deg left to right across chest, left index touching back of right thumb)
      rotateBone("leftarm", lArmCur[0], lArmCur[1], lArmCur[2], 0.28);
      rotateBone("leftforearm", lFACur[0], lFACur[1], lFACur[2], 0.28);
      rotateBone("lefthand", lWrCur[0], lWrCur[1], lWrCur[2], 0.32);

      if (isRunning) {
        applyRunLHand("right", 0.25);
        applyRunLHand("left", 0.25);
      } else {
        setHandFingers("right", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
        setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
      }
    }

    // -----------------------------------------------------------------
    // 36c. BEAUTIFUL (Elbow turns 180 degrees from 3rd quadrant towards mouth, wrist rotates 180 degrees towards mouth, L-hand circles face contour with index, then index & thumb close, 3 fingers open pointing to user with wrist at 90° of elbow)
    // -----------------------------------------------------------------
    else if (hasWord("beautiful", "sundar", "khoobsurat", "khubsurat", "pretty")) {
      const cycle = 3.2;
      const c = (t % cycle) / cycle;

      const smooth = (x: number) => {
        const cl = Math.max(0, Math.min(1, x));
        return cl * cl * (3 - 2 * cl);
      };
      const lerpV = (a: number[], b: number[], factor: number) => [
        a[0] + (b[0] - a[0]) * factor,
        a[1] + (b[1] - a[1]) * factor,
        a[2] + (b[2] - a[2]) * factor,
      ];

      const rArmRest = [-0.10, 0.05, -0.20];
      const rFARest  = [-0.15, 0.05, 0.05];
      const rWrRest  = [0.05, 0.00, 0.00];

      // 3rd Quadrant starting pose (right elbow turned in 3rd quadrant across lower body, wrist rotated left)
      const rArmQ3       = [-0.20, 0.10, -0.85];
      const rFAQ3        = [-1.30, -0.30, -1.57]; // elbow starts turned at -1.57 rad (-90°)
      const rWrQ3        = [-0.30, -1.57, 0.20];  // wrist starts turned at -1.57 rad (-90° left)

      const rArmMouth    = [-0.72, -0.28, -1.18];
      const rFAMouth     = [-1.52, 0.45, 1.57];  // elbow turns 180° (+1.57 - (-1.57) = 3.14 rad / 180°) towards mouth
      const rWrMouth     = [0.15, 1.57, -0.15];   // wrist rotates 180° (+1.57 - (-1.57) = 3.14 rad / 180°) towards mouth

      const rArmRCheek   = [-0.78, -0.32, -1.24];
      const rFARCheek    = [-1.58, 0.68, 0.44];
      const rWrRCheek    = [0.15, 0.35, -0.22];

      const rArmForehead = [-0.94, -0.42, -1.34];
      const rFAForehead  = [-1.72, 0.82, 0.52];
      const rWrForehead  = [0.22, 0.42, -0.28];

      const rArmLCheek   = [-0.76, -0.52, -1.22];
      const rFALCheek    = [-1.62, 0.62, 0.38];
      const rWrLCheek    = [0.18, 0.30, -0.22];

      const rArmPresent  = [-0.45, -0.10, -1.05];
      const rFAPresent   = [-1.40, 0.15, 0.10];
      const rWrPresent   = [1.57, 0.00, 0.00]; // exactly 90° bend relative to forearm directing fingers to user

      let rArmCur = rArmRest, rFACur = rFARest, rWrCur = rWrRest;
      let smile = 0.0;
      let handMode: "L_HAND" | "THREE_FINGERS" | "TRANSITION" | "REST" = "L_HAND";
      let transU = 0.0;

      if (c < 0.25) {
        // Phase 1: Elbow turns 180 degrees from 3rd quadrant towards mouth,
        // and wrist rotates 180 degrees towards mouth with L-handshape (all fingers closed except index and thumb)
        const u = smooth(c / 0.25);
        rArmCur = lerpV(rArmQ3, rArmMouth, u);
        rFACur  = lerpV(rFAQ3,  rFAMouth,  u); // 180° elbow turn towards mouth
        rWrCur  = lerpV(rWrQ3,  rWrMouth,  u); // 180° wrist rotation towards mouth
        smile = u * 0.4;
        handMode = "L_HAND";
      } else if (c < 0.65) {
        // Phase 2: Index finger traces a smooth circle around own face starting and finishing at the mouth
        const u = (c - 0.25) / 0.40;
        handMode = "L_HAND";
        smile = 0.4 + u * 0.35;
        if (u < 0.25) {
          const seg = smooth(u / 0.25);
          rArmCur = lerpV(rArmMouth, rArmRCheek, seg);
          rFACur  = lerpV(rFAMouth,  rFARCheek,  seg);
          rWrCur  = lerpV(rWrMouth,  rWrRCheek,  seg);
        } else if (u < 0.50) {
          const seg = smooth((u - 0.25) / 0.25);
          rArmCur = lerpV(rArmRCheek, rArmForehead, seg);
          rFACur  = lerpV(rFARCheek,  rFAForehead,   seg);
          rWrCur  = lerpV(rWrRCheek,  rWrForehead,   seg);
        } else if (u < 0.75) {
          const seg = smooth((u - 0.50) / 0.25);
          rArmCur = lerpV(rArmForehead, rArmLCheek, seg);
          rFACur  = lerpV(rFAForehead,   rFALCheek,  seg);
          rWrCur  = lerpV(rWrForehead,   rWrLCheek,  seg);
        } else {
          const seg = smooth((u - 0.75) / 0.25);
          rArmCur = lerpV(rArmLCheek, rArmMouth, seg);
          rFACur  = lerpV(rFALCheek,  rFAMouth,  seg);
          rWrCur  = lerpV(rWrLCheek,  rWrMouth,  seg);
        }
      } else if (c < 0.86) {
        // Phase 3: Transition to 3-finger presentation with wrist at 90° of elbow
        const uTrans = Math.min(1.0, (c - 0.65) / 0.08);
        const eTrans = smooth(uTrans);
        rArmCur = lerpV(rArmMouth, rArmPresent, eTrans);
        rFACur  = lerpV(rFAMouth,  rFAPresent,  eTrans);
        rWrCur  = lerpV(rWrMouth,  rWrPresent,  eTrans);
        smile = 0.75 + eTrans * 0.17;
        handMode = eTrans >= 1.0 ? "THREE_FINGERS" : "TRANSITION";
        transU = eTrans;
      } else {
        // Phase 4: Return smoothly to rest
        const u = smooth((c - 0.86) / 0.14);
        rArmCur = lerpV(rArmPresent, rArmRest, u);
        rFACur  = lerpV(rFAPresent,  rFARest,  u);
        rWrCur  = lerpV(rWrPresent,  rWrRest,  u);
        smile = (1.0 - u) * 0.92;
        handMode = "REST";
        transU = u;
      }

      rotateBone("head", -0.05, 0.04, 0, 0.25);
      rotateBone("neck", -0.02, 0.02, 0, 0.25);
      setMorphTarget("mouthSmile", smile);

      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2], 0.28);
      rotateBone("rightforearm", rFACur[0], rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1], rWrCur[2], 0.30);

      if (handMode === "L_HAND") {
        applyBeautifulLHand("right", 0.20);
      } else if (handMode === "THREE_FINGERS") {
        applyBeautifulThreeFingersHand("right", 0.20);
      } else if (handMode === "TRANSITION") {
        // thumb closes, index curls, 3 fingers open
        const tCl = 0.05 + transU * 0.95;
        const iCl = transU * 1.35;
        const oOp = (1 - transU) * 1.35 + transU * 0.05;
        setHandFingers("right", tCl, iCl, oOp, oOp, oOp, 0.20);
      } else {
        setHandFingers("right", 0.20, 0.25, 0.25, 0.25, 0.25, 0.20);
      }

      // Left hand at side
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.25);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.25);
      rotateBone("lefthand", 0.1, 0, 0.05, 0.25);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 36d. UGLY (Right claw hand sweeps across face, pulling away with distaste)
    // -----------------------------------------------------------------
    else if (hasWord("ugly", "kurup", "bhadha", "bhadda", "badsurat")) {
      const cycle = 2.6;
      const c = (t % cycle) / cycle;

      const smooth = (x: number) => {
        const cl = Math.max(0, Math.min(1, x));
        return cl * cl * (3 - 2 * cl);
      };
      const lerpV = (a: number[], b: number[], factor: number) => [
        a[0] + (b[0] - a[0]) * factor,
        a[1] + (b[1] - a[1]) * factor,
        a[2] + (b[2] - a[2]) * factor,
      ];

      const rArmRest = [-0.10, 0.05, -0.20];
      const rFARest  = [-0.15, 0.05, 0.05];
      const rWrRest  = [0.05, 0.00, 0.00];

      const rArmFace = [-0.85, -0.65, -1.25];
      const rFAFace  = [-1.75, 1.10, 0.85];
      const rWrFace  = [0.15, 0.50, -0.30];

      const rArmPull = [-0.55, -0.15, -1.60];
      const rFAPull  = [-1.15, 0.35, 0.30];
      const rWrPull  = [0.10, 0.10, -0.05];

      let rArmCur = rArmRest, rFACur = rFARest, rWrCur = rWrRest;
      let headYaw = 0.0;

      if (c < 0.22) {
        const u = smooth(c / 0.22);
        rArmCur = lerpV(rArmRest, rArmFace, u);
        rFACur  = lerpV(rFARest,  rFAFace,  u);
        rWrCur  = lerpV(rWrRest,  rWrFace,  u);
        headYaw = u * -0.08;
      } else if (c < 0.65) {
        const u = smooth((c - 0.22) / 0.43);
        rArmCur = lerpV(rArmFace, rArmPull, u);
        rFACur  = lerpV(rFAFace,  rFAPull,  u);
        rWrCur  = lerpV(rWrFace,  rWrPull,  u);
        headYaw = -0.08 - u * 0.12;
      } else if (c < 0.80) {
        rArmCur = [...rArmPull];
        rFACur  = [...rFAPull];
        rWrCur  = [...rWrPull];
        headYaw = -0.20;
      } else {
        const u = smooth((c - 0.80) / 0.20);
        rArmCur = lerpV(rArmPull, rArmRest, u);
        rFACur  = lerpV(rFAPull,  rFARest,  u);
        rWrCur  = lerpV(rWrPull,  rWrRest,  u);
        headYaw = (1.0 - u) * -0.20;
      }

      rotateBone("head", 0.06, headYaw, -0.04, 0.25);
      rotateBone("neck", 0.03, headYaw * 0.5, -0.02, 0.25);
      setMorphTarget("mouthSmile", 0.0);

      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2], 0.28);
      rotateBone("rightforearm", rFACur[0], rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1], rWrCur[2], 0.30);
      // Claw hand shape
      setHandFingers("right", 0.45, 0.65, 0.65, 0.65, 0.65, 0.20);

      // Left hand at side
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.25);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.25);
      rotateBone("lefthand", 0.1, 0, 0.05, 0.25);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 36e. DEAF (Right index finger touches ear then sweeps to mouth/chin)
    // -----------------------------------------------------------------
    else if (hasWord("deaf", "badhir", "bahra", "behra")) {
      const cycle = 2.8;
      const c = (t % cycle) / cycle;

      const smooth = (x: number) => {
        const cl = Math.max(0, Math.min(1, x));
        return cl * cl * (3 - 2 * cl);
      };
      const lerpV = (a: number[], b: number[], factor: number) => [
        a[0] + (b[0] - a[0]) * factor,
        a[1] + (b[1] - a[1]) * factor,
        a[2] + (b[2] - a[2]) * factor,
      ];

      const rArmRest = [-0.10, 0.05, -0.20];
      const rFARest  = [-0.15, 0.05, 0.05];
      const rWrRest  = [0.05, 0.00, 0.00];

      const rArmEar = [-0.95, -0.90, -1.45];
      const rFAEar  = [-1.95, 1.45, 0.90];
      const rWrEar  = [0.25, 0.60, -0.40];

      const rArmMouth = [-0.78, -0.40, -1.18];
      const rFAMouth  = [-1.60, 0.90, 0.58];
      const rWrMouth  = [0.15, 0.35, -0.20];

      let rArmCur = rArmRest, rFACur = rFARest, rWrCur = rWrRest;

      if (c < 0.22) {
        const u = smooth(c / 0.22);
        rArmCur = lerpV(rArmRest, rArmEar, u);
        rFACur  = lerpV(rFARest,  rFAEar,  u);
        rWrCur  = lerpV(rWrRest,  rWrEar,  u);
      } else if (c < 0.38) {
        rArmCur = [...rArmEar];
        rFACur  = [...rFAEar];
        rWrCur  = [...rWrEar];
      } else if (c < 0.68) {
        const u = smooth((c - 0.38) / 0.30);
        rArmCur = lerpV(rArmEar, rArmMouth, u);
        rFACur  = lerpV(rFAEar,  rFAMouth,  u);
        rWrCur  = lerpV(rWrEar,  rWrMouth,  u);
      } else if (c < 0.82) {
        rArmCur = [...rArmMouth];
        rFACur  = [...rFAMouth];
        rWrCur  = [...rWrMouth];
      } else {
        const u = smooth((c - 0.82) / 0.18);
        rArmCur = lerpV(rArmMouth, rArmRest, u);
        rFACur  = lerpV(rFAMouth,  rFARest,  u);
        rWrCur  = lerpV(rWrMouth,  rWrRest,  u);
      }

      rotateBone("head", 0.02, 0.04, 0.02, 0.25);
      rotateBone("neck", 0.01, 0.02, 0.01, 0.25);

      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2], 0.28);
      rotateBone("rightforearm", rFACur[0], rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1], rWrCur[2], 0.30);
      // Index pointing, thumb and others closed
      setHandFingers("right", 0.7, 0.05, 1.3, 1.3, 1.3, 0.20);

      // Left hand at side
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.25);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.25);
      rotateBone("lefthand", 0.1, 0, 0.05, 0.25);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 36f. BLIND (Right V-hand points toward eyes and sweeps horizontally)
    // -----------------------------------------------------------------
    else if (hasWord("blind", "andha", "andhaa", "drishtihin", "netrahin")) {
      const cycle = 2.7;
      const c = (t % cycle) / cycle;

      const smooth = (x: number) => {
        const cl = Math.max(0, Math.min(1, x));
        return cl * cl * (3 - 2 * cl);
      };
      const lerpV = (a: number[], b: number[], factor: number) => [
        a[0] + (b[0] - a[0]) * factor,
        a[1] + (b[1] - a[1]) * factor,
        a[2] + (b[2] - a[2]) * factor,
      ];

      const rArmRest = [-0.10, 0.05, -0.20];
      const rFARest  = [-0.15, 0.05, 0.05];
      const rWrRest  = [0.05, 0.00, 0.00];

      const rArmEyesStart = [-1.05, -0.80, -1.40];
      const rFAEyesStart  = [-1.90, 1.30, 0.85];
      const rWrEyesStart  = [0.20, 0.55, -0.35];

      const rArmEyesEnd = [-0.98, -0.35, -1.20];
      const rFAEyesEnd  = [-1.75, 0.85, 0.65];
      const rWrEyesEnd  = [0.15, 0.30, -0.20];

      let rArmCur = rArmRest, rFACur = rFARest, rWrCur = rWrRest;
      let headPitch = 0.0;

      if (c < 0.24) {
        const u = smooth(c / 0.24);
        rArmCur = lerpV(rArmRest, rArmEyesStart, u);
        rFACur  = lerpV(rFARest,  rFAEyesStart,  u);
        rWrCur  = lerpV(rWrRest,  rWrEyesStart,  u);
        headPitch = u * 0.06;
      } else if (c < 0.70) {
        const u = smooth((c - 0.24) / 0.46);
        rArmCur = lerpV(rArmEyesStart, rArmEyesEnd, u);
        rFACur  = lerpV(rFAEyesStart,  rFAEyesEnd,  u);
        rWrCur  = lerpV(rWrEyesStart,  rWrEyesEnd,  u);
        headPitch = 0.06 + u * 0.02;
      } else if (c < 0.82) {
        rArmCur = [...rArmEyesEnd];
        rFACur  = [...rFAEyesEnd];
        rWrCur  = [...rWrEyesEnd];
        headPitch = 0.08;
      } else {
        const u = smooth((c - 0.82) / 0.18);
        rArmCur = lerpV(rArmEyesEnd, rArmRest, u);
        rFACur  = lerpV(rFAEyesEnd,  rFARest,  u);
        rWrCur  = lerpV(rWrEyesEnd,  rWrRest,  u);
        headPitch = (1.0 - u) * 0.08;
      }

      rotateBone("head", headPitch, 0, 0, 0.25);
      rotateBone("neck", headPitch * 0.5, 0, 0, 0.25);

      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2], 0.28);
      rotateBone("rightforearm", rFACur[0], rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1], rWrCur[2], 0.30);
      // V-handshape: index and middle straight, ring/pinky/thumb closed
      setHandFingers("right", 0.6, 0.05, 0.05, 1.3, 1.3, 0.20);

      // Left hand at side
      rotateBone("leftarm", 0.05, -0.05, 1.28, 0.25);
      rotateBone("leftforearm", -0.22, -0.05, -0.05, 0.25);
      rotateBone("lefthand", 0.1, 0, 0.05, 0.25);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25, 0.20);
    }

    // -----------------------------------------------------------------
    // 37. LOVE
    // -----------------------------------------------------------------
    else if (hasWord("love", "pyar", "prem")) {
      const embrace = (Math.sin(t * 3.0) + 1) / 2;
      rotateBone("head", 0.08 * embrace, 0, 0);
      rotateBone("rightarm", -0.55, -0.15 * embrace, -1.05);
      rotateBone("rightforearm", -1.5, 0.25, 0.25);
      rotateBone("righthand", 0.2, 0, 0);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", -0.55, 0.15 * embrace, 1.05);
      rotateBone("leftforearm", -1.5, -0.25, -0.25);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 37b. I LOVE YOU (Matching chart: 'ILY' handshape - thumb + index + pinky extended)
    // -----------------------------------------------------------------
    else if (hasWord("iloveyou", "i_love_you", "ily", "love_you")) {
      const pulse = (Math.sin(t * 3.5) + 1) / 2;
      rotateBone("head", 0.05, 0, 0);
      rotateBone("rightarm", -0.65, 0.18, -1.05);
      rotateBone("rightforearm", -1.25 + pulse * 0.15, 0.12, 0.08);
      rotateBone("righthand", 0.35 + pulse * 0.10, 0.05, 0.05);
      setHandFingers("right", 0, 0, 1.3, 1.3, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 37c. STOP (Matching chart: Right flat hand chopping down onto flat open left palm)
    // -----------------------------------------------------------------
    else if (hasWord("stop", "ruko", "rok")) {
      const chop = (Math.sin(t * 4.5) + 1) / 2;
      rotateBone("head", 0.05, 0, 0);

      rotateBone("leftarm", -0.55, -0.20, 1.05);
      rotateBone("leftforearm", -1.30, -0.15, 0);
      rotateBone("lefthand", 0.25, 0, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);

      rotateBone("rightarm", -0.65 + chop * 0.15, 0.20, -1.05);
      rotateBone("rightforearm", -1.50 + chop * 0.35, 0.15, 0.10);
      rotateBone("righthand", 0.40, 0.10, -0.30 + chop * 0.25);
      setHandFingers("right", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 37d. PAIN (Matching chart: Both index fingers pointing inward jabbing toward each other)
    // -----------------------------------------------------------------
    else if (hasWord("pain", "hurt", "dard", "takleef")) {
      const jab = (Math.sin(t * 6.0) + 1) / 2;
      rotateBone("head", 0.10, 0, 0);

      rotateBone("rightarm", -0.55, 0.22, -1.05);
      rotateBone("rightforearm", -1.35 + jab * 0.15, 0.20, 0.10);
      rotateBone("righthand", 0.25, 0.10 + jab * 0.15, 0.10);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", -0.55, -0.22, 1.05);
      rotateBone("leftforearm", -1.35 + jab * 0.15, -0.20, -0.10);
      rotateBone("lefthand", 0.25, -0.10 - jab * 0.15, -0.10);
      setHandFingers("left", 1.2, 0, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 37e. MORE (Matching chart: Both flattened 'O' hands tapping fingertips together)
    // -----------------------------------------------------------------
    else if (hasWord("more", "aur", "extra")) {
      const tap = (Math.sin(t * 5.5) + 1) / 2;
      rotateBone("head", 0.05, 0, 0);

      rotateBone("rightarm", -0.55, 0.20, -1.05);
      rotateBone("rightforearm", -1.35 + tap * 0.10, 0.20, 0.10);
      rotateBone("righthand", 0.30 + tap * 0.10, 0.15, 0.10);
      setHandFingers("right", 0.8, 0.9, 0.9, 0.9, 0.9);

      rotateBone("leftarm", -0.55, -0.20, 1.05);
      rotateBone("leftforearm", -1.35 + tap * 0.10, -0.20, -0.10);
      rotateBone("lefthand", 0.30 + tap * 0.10, -0.15, -0.10);
      setHandFingers("left", 0.8, 0.9, 0.9, 0.9, 0.9);
    }

    // -----------------------------------------------------------------
    // 37f. BATHROOM / TOILET (Matching chart: 'T' handshape fist shaking side-to-side)
    // -----------------------------------------------------------------
    else if (hasWord("bathroom", "toilet", "washroom", "restroom", "shauchalay")) {
      const shake = Math.sin(t * 6.5) * 0.35;
      rotateBone("head", 0.04, 0, 0);

      rotateBone("rightarm", -0.65, 0.18, -1.05);
      rotateBone("rightforearm", -1.30, 0.15, 0.10);
      rotateBone("righthand", 0.25, 0.10 + shake, 0.10);
      setHandFingers("right", 0.8, 1.0, 1.3, 1.3, 1.3);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 37g. MY NAME IS (Compound chart sign: MY on chest followed by NAME tap)
    // -----------------------------------------------------------------
    else if (hasWord("my_name_is", "my_name")) {
      const phase = (t % 2.6) / 2.6;
      if (phase < 0.45) {
        rotateBone("head", 0.06, 0, 0);
        rotateBone("rightarm", -0.55, 0.22, -1.05);
        rotateBone("rightforearm", -1.45, 0.12, 0.15);
        rotateBone("righthand", 0.35, 0.10, 0.15);
        setHandFingers("right", 0, 0, 0, 0, 0);

        rotateBone("leftarm", 0.05, -0.05, 1.28);
        rotateBone("leftforearm", -0.22, 0, 0);
        setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
      } else {
        const tap = (Math.sin(t * 6.0) + 1) / 2;
        rotateBone("leftarm", -0.55, -0.20, 1.05);
        rotateBone("leftforearm", -1.35, -0.15, 0.05);
        rotateBone("lefthand", 0.20, 0.05, 0.0);
        setHandFingers("left", 1.2, 0, 0, 1.2, 1.2);

        rotateBone("rightarm", -0.55, 0.22, -1.05);
        rotateBone("rightforearm", -1.35 + tap * 0.18, 0.15, -0.05);
        rotateBone("righthand", 0.25 + tap * 0.15, 0.05, 0.05);
        setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
      }
    }

    // -----------------------------------------------------------------
    // 38. CAR / DRIVE
    // -----------------------------------------------------------------
    else if (hasWord("car", "drive", "gadi")) {
      const steer = Math.sin(t * 4.5) * 0.35;
      rotateBone("rightarm", -0.6 + steer * 0.15, 0.2, -1.05);
      rotateBone("rightforearm", -1.2, 0.15, 0.1);
      rotateBone("righthand", 0.25 + steer, 0.1, 0.1);
      setHandFingers("right", 1.2, 1.2, 1.2, 1.2, 1.2);

      rotateBone("leftarm", -0.6 - steer * 0.15, -0.2, 1.05);
      rotateBone("leftforearm", -1.2, -0.15, -0.1);
      rotateBone("lefthand", 0.25 - steer, -0.1, -0.1);
      setHandFingers("left", 1.2, 1.2, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 39. TRAIN
    // -----------------------------------------------------------------
    else if (hasWord("train", "railway", "rail")) {
      const slide = Math.sin(t * 5.0) * 0.25;
      rotateBone("leftarm", -0.55, -0.2, 1.05);
      rotateBone("leftforearm", -1.3, -0.15, 0);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 1.2, 0, 0, 1.2, 1.2);

      rotateBone("rightarm", -0.6 + slide * 0.2, 0.2, -1.05);
      rotateBone("rightforearm", -1.35, 0.15, 0.15);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 40. MONEY / BANK / CASH
    // -----------------------------------------------------------------
    else if (hasWord("money", "paisa", "rupaye", "rupee", "bank", "cash")) {
      const rub = Math.sin(t * 6.0) * 0.2;
      rotateBone("rightarm", -0.55, 0.2, -1.05);
      rotateBone("rightforearm", -1.25, 0.15, 0.1);
      rotateBone("righthand", 0.25, 0.15 + rub, 0.1);
      setHandFingers("right", rub > 0 ? 0 : 0.8, rub > 0 ? 0.3 : 0.8, rub > 0 ? 0.3 : 0.8, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 41. INDIA / BHARAT
    // -----------------------------------------------------------------
    else if (hasWord("india", "bharat", "hindustan")) {
      const tap = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("rightarm", -0.85, 0.2, -1.05);
      rotateBone("rightforearm", -1.5 + tap * 0.2, 0.2, 0.1);
      rotateBone("righthand", 0.35, 0.1, 0.1);
      setHandFingers("right", 0, 1.3, 1.3, 1.3, 1.3);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 42. TIME
    // -----------------------------------------------------------------
    else if (hasWord("time", "samay", "waqt")) {
      const tap = (Math.sin(t * 5.0) + 1) / 2;
      rotateBone("leftarm", -0.55, -0.25, 1.05);
      rotateBone("leftforearm", -1.3, -0.15, 0);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 0.2, 0.2, 0.2, 0.2, 0.2);

      rotateBone("rightarm", -0.6, 0.25, -1.05);
      rotateBone("rightforearm", -1.4 + tap * 0.25, 0.15, 0.15);
      rotateBone("righthand", 0.4, 0.1, 0.2);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 43. TEACHER / STUDENT
    // -----------------------------------------------------------------
    else if (hasWord("teacher", "sir", "madam", "guruji")) {
      const teach = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("rightarm", -0.85 + teach * 0.25, 0.2, -1.05);
      rotateBone("rightforearm", -1.35 + teach * 0.35, 0.15, 0.1);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 0.6, 0.6, 0.6, 0.6, 0.6);

      rotateBone("leftarm", -0.85 + teach * 0.25, -0.2, 1.05);
      rotateBone("leftforearm", -1.35 + teach * 0.35, -0.15, -0.1);
      rotateBone("lefthand", 0.3, -0.1, -0.1);
      setHandFingers("left", 0.6, 0.6, 0.6, 0.6, 0.6);
    }

    // -----------------------------------------------------------------
    // 43b. QUIET / SHHH (Single right index finger held upright against mouth/lips)
    // -----------------------------------------------------------------
    else if (hasWord("quiet", "shhh", "shh", "shaant", "shant", "silence", "chup")) {
      rotateBone("head", 0.0, 0.0, 0.0);
      rotateBone("neck", 0.0, 0.0, 0.0);

      // Right arm brings index finger vertically upright directly on mouth with wrist turned 45 degrees up and elbow turned 180 degrees towards mouth
      rotateBone("rightarm", -1.2491, -1.0362, -1.6999, 0.28);
      rotateBone("rightforearm", -2.2844, 2.9492, 0.8000, 0.28);
      rotateBone("righthand", 0.1469, 0.6916, -0.3526, 0.35);
      applyQuietShhhHand("right", 0.20);

      // Left hand rests neutrally at side
      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, -0.05, -0.05);
      rotateBone("lefthand", 0.1, 0.0, 0.05);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 43c. LOUD / SHOR / CHILLANA (Both hands brought to mouth corners cupping like a megaphone, then thrusting forward/outward as shouting loudly)
    // -----------------------------------------------------------------
    // -----------------------------------------------------------------
    // 43c. LOUD / SHOR / CHILLANA (5-Phase Trajectory: Rest -> Ascent -> Chest -> Flare -> Smooth Descent)
    // -----------------------------------------------------------------
    else if (hasWord("loud", "shor", "awaaz", "chillana", "hungama", "awaz")) {
      const cycle = 2.6;
      const c = (t % cycle) / cycle;

      const smooth = (x: number) => {
        const cl = Math.max(0, Math.min(1, x));
        return cl * cl * (3 - 2 * cl);
      };
      const lerpV = (a: number[], b: number[], factor: number) => [
        a[0] + (b[0] - a[0]) * factor,
        a[1] + (b[1] - a[1]) * factor,
        a[2] + (b[2] - a[2]) * factor,
      ];

      // Posture 1: Rest at Sides / Waist (Reference Video Phase 1)
      const rArmRest = [0.05, 0.05, -1.25];
      const rFARest  = [-0.25, 0.10, 0.05];
      const rWrRest  = [0.10, 0.05, 0.05];

      const lArmRest = [0.05, -0.05, 1.25];
      const lFARest  = [-0.25, -0.10, -0.05];
      const lWrRest  = [0.10, -0.05, -0.05];

      // Posture 2: Mid-Ascent from Waist
      const rArmAscent = [-0.55, 0.10, -0.95];
      const rFAAscent  = [-1.25, 0.25, 0.15];
      const rWrAscent  = [0.15, 0.40, 0.10];

      const lArmAscent = [-0.55, -0.10, 0.95];
      const lFAAscent  = [-1.25, -0.25, -0.15];
      const lWrAscent  = [0.15, -0.40, -0.10];

      // Posture 3: Upper Chest Positioning (Hands close together, fingers opening)
      const rArmChest = [-0.95, -0.15, -1.15];
      const rFAChest  = [-1.65, 0.40, -0.15];
      const rWrChest  = [0.18, 0.85, 0.10];

      const lArmChest = [-0.95, 0.15, 1.15];
      const lFAChest  = [-1.65, -0.40, 0.15];
      const lWrChest  = [0.18, -0.85, -0.10];

      // Posture 4: Upward & Outward Expansion to Face Level (Shouting megaphone flare)
      const rArmShout = [-1.15, -0.18, -1.35];
      const rFAShout  = [-1.40, 0.50, 0.15];
      const rWrShout  = [0.22, 0.20, -0.15];

      const lArmShout = [-1.15, 0.18, 1.35];
      const lFAShout  = [-1.40, -0.50, -0.15];
      const lWrShout  = [0.22, -0.20, 0.15];

      let rArmCur = rArmRest;
      let rFACur = rFARest;
      let rWrCur = rWrRest;
      let lArmCur = lArmRest;
      let lFACur = lFARest;
      let lWrCur = lWrRest;

      let fingerCurl = 0.25;
      let headPitch = 0.0;
      let neckPitch = 0.0;
      let pulse = 0.0;

      if (c < 0.12) {
        // Phase 1: Pure Neutral Standing Rest
        rArmCur = rArmRest;
        rFACur = rFARest;
        rWrCur = rWrRest;
        lArmCur = lArmRest;
        lFACur = lFARest;
        lWrCur = lWrRest;
        fingerCurl = 0.25;
      } else if (c < 0.32) {
        // Phase 2: Coordinated Ascent from Waist to Chest
        const u = smooth((c - 0.12) / 0.20);
        if (u < 0.50) {
          const uSub = u / 0.50;
          rArmCur = lerpV(rArmRest, rArmAscent, uSub);
          rFACur  = lerpV(rFARest, rFAAscent, uSub);
          rWrCur  = lerpV(rWrRest, rWrAscent, uSub);
          lArmCur = lerpV(lArmRest, lArmAscent, uSub);
          lFACur  = lerpV(lFARest, lFAAscent, uSub);
          lWrCur  = lerpV(lWrRest, lWrAscent, uSub);
        } else {
          const uSub = (u - 0.50) / 0.50;
          rArmCur = lerpV(rArmAscent, rArmChest, uSub);
          rFACur  = lerpV(rFAAscent, rFAChest, uSub);
          rWrCur  = lerpV(rWrAscent, rWrChest, uSub);
          lArmCur = lerpV(lArmAscent, lArmChest, uSub);
          lFACur  = lerpV(lFAAscent, lFAChest, uSub);
          lWrCur  = lerpV(lWrAscent, lWrChest, uSub);
        }
        fingerCurl = 0.25 - u * 0.10;
      } else if (c < 0.48) {
        // Phase 3: Chest Positioning (Hands close together, fingers opening)
        const u = (c - 0.32) / 0.16;
        rArmCur = rArmChest;
        rFACur  = rFAChest;
        rWrCur  = rWrChest;
        lArmCur = lArmChest;
        lFACur  = lFAChest;
        lWrCur  = lWrChest;
        fingerCurl = 0.15;
        headPitch = 0.02 * Math.sin(u * Math.PI);
      } else if (c < 0.76) {
        // Phase 4: Upward & Outward Expansion toward Face Level
        const u = smooth((c - 0.48) / 0.20);
        rArmCur = lerpV(rArmChest, rArmShout, u);
        rFACur  = lerpV(rFAChest, rFAShout, u);
        rWrCur  = lerpV(rWrChest, rWrShout, u);
        lArmCur = lerpV(lArmChest, lArmShout, u);
        lFACur  = lerpV(lFAChest, lFAShout, u);
        lWrCur  = lerpV(lWrChest, lWrShout, u);

        fingerCurl = 0.15 * (1.0 - u);
        headPitch = -0.07 * u;
        neckPitch = -0.04 * u;

        if (c >= 0.60) {
          pulse = Math.sin((c - 0.60) * 50.0) * 0.035;
        }
      } else {
        // Phase 5: Smooth Descent Back to Neutral Rest Pose
        const u = smooth((c - 0.76) / 0.24);
        if (u < 0.50) {
          const uSub = u / 0.50;
          rArmCur = lerpV(rArmShout, rArmAscent, uSub);
          rFACur  = lerpV(rFAShout, rFAAscent, uSub);
          rWrCur  = lerpV(rWrShout, rWrAscent, uSub);
          lArmCur = lerpV(lArmShout, lArmAscent, uSub);
          lFACur  = lerpV(lFAShout, lFAAscent, uSub);
          lWrCur  = lerpV(lWrShout, lWrAscent, uSub);
          fingerCurl = uSub * 0.20;
        } else {
          const uSub = (u - 0.50) / 0.50;
          rArmCur = lerpV(rArmAscent, rArmRest, uSub);
          rFACur  = lerpV(rFAAscent, rFARest, uSub);
          rWrCur  = lerpV(rWrAscent, rWrRest, uSub);
          lArmCur = lerpV(lArmAscent, lArmRest, uSub);
          lFACur  = lerpV(lFAAscent, lFARest, uSub);
          lWrCur  = lerpV(lWrAscent, lWrRest, uSub);
          fingerCurl = 0.20 + uSub * 0.05;
        }
        headPitch = -0.07 * (1.0 - u);
        neckPitch = -0.04 * (1.0 - u);
      }

      rotateBone("head", headPitch, 0.0, pulse * 0.02, 0.28);
      rotateBone("neck", neckPitch, 0.0, 0.0, 0.28);
      rotateBone("spine1", headPitch * 0.35, 0.0, 0.0, 0.25);

      // Apply right arm
      rotateBone("rightarm", rArmCur[0], rArmCur[1], rArmCur[2] + pulse, 0.28);
      rotateBone("rightforearm", rFACur[0] + pulse, rFACur[1], rFACur[2], 0.28);
      rotateBone("righthand", rWrCur[0], rWrCur[1] + pulse, rWrCur[2], 0.35);

      // Apply left arm
      rotateBone("leftarm", lArmCur[0], lArmCur[1], lArmCur[2] - pulse, 0.28);
      rotateBone("leftforearm", lFACur[0] + pulse, lFACur[1], lFACur[2], 0.28);
      rotateBone("lefthand", lWrCur[0], lWrCur[1] - pulse, lWrCur[2], 0.35);

      setHandFingers("right", fingerCurl, fingerCurl, fingerCurl, fingerCurl, fingerCurl);
      setHandFingers("left", fingerCurl, fingerCurl, fingerCurl, fingerCurl, fingerCurl);
    }

    // -----------------------------------------------------------------
    // 44. ALL 26 A-Z FINGERSPELLING MANUAL ALPHABET SIGNS
    // -----------------------------------------------------------------
    else if (letterChar) {
      rotateBone("rightarm", -0.65, 0.2, -1.05);
      rotateBone("rightforearm", -1.25, 0.15, 0.1);
      rotateBone("righthand", 0.2, 0.15, 0.1);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);

      if (letterChar === "a") setHandFingers("right", 0, 1.3, 1.3, 1.3, 1.3);
      else if (letterChar === "b") setHandFingers("right", 1.2, 0, 0, 0, 0);
      else if (letterChar === "c") setHandFingers("right", 0.6, 0.6, 0.6, 0.6, 0.6);
      else if (letterChar === "d") setHandFingers("right", 0.9, 0, 0.9, 0.9, 0.9);
      else if (letterChar === "e") setHandFingers("right", 1.2, 1.2, 1.2, 1.2, 1.2);
      else if (letterChar === "f") setHandFingers("right", 0.9, 0.9, 0, 0, 0);
      else if (letterChar === "g") setHandFingers("right", 0, 0, 1.3, 1.3, 1.3);
      else if (letterChar === "h") setHandFingers("right", 1.2, 0, 0, 1.3, 1.3);
      else if (letterChar === "i") setHandFingers("right", 1.2, 1.3, 1.3, 1.3, 0);
      else if (letterChar === "j") {
        const jCurve = Math.sin(t * 4.0) * 0.35;
        rotateBone("righthand", 0.2, 0.15 + jCurve, 0.1);
        setHandFingers("right", 1.2, 1.3, 1.3, 1.3, 0);
      }
      else if (letterChar === "k") setHandFingers("right", 0.4, 0, 0.4, 1.3, 1.3);
      else if (letterChar === "l") setHandFingers("right", 0, 0, 1.3, 1.3, 1.3);
      else if (letterChar === "m") setHandFingers("right", 1.0, 0.9, 0.9, 0.9, 1.3);
      else if (letterChar === "n") setHandFingers("right", 1.0, 0.9, 0.9, 1.3, 1.3);
      else if (letterChar === "o") setHandFingers("right", 0.7, 0.7, 0.7, 0.7, 0.7);
      else if (letterChar === "p") {
        rotateBone("righthand", 0.6, 0.1, 0.3);
        setHandFingers("right", 0.4, 0, 0.5, 1.3, 1.3);
      }
      else if (letterChar === "q") {
        rotateBone("righthand", 0.7, 0.1, 0.3);
        setHandFingers("right", 0, 0, 1.3, 1.3, 1.3);
      }
      else if (letterChar === "r") setHandFingers("right", 1.2, 0, 0.2, 1.3, 1.3);
      else if (letterChar === "s") setHandFingers("right", 1.3, 1.3, 1.3, 1.3, 1.3);
      else if (letterChar === "t") setHandFingers("right", 0.8, 1.0, 1.3, 1.3, 1.3);
      else if (letterChar === "u") setHandFingers("right", 1.2, 0, 0, 1.3, 1.3);
      else if (letterChar === "v") setHandFingers("right", 1.2, 0, 0, 1.3, 1.3);
      else if (letterChar === "w") setHandFingers("right", 1.1, 0, 0, 0, 1.3);
      else if (letterChar === "x") setHandFingers("right", 1.2, 0.7, 1.3, 1.3, 1.3);
      else if (letterChar === "y") setHandFingers("right", 0, 1.3, 1.3, 1.3, 0);
      else if (letterChar === "z") {
        const zPath = Math.sin(t * 4.5) * 0.25;
        rotateBone("righthand", 0.2 + zPath, 0.15 + zPath, 0.1);
        setHandFingers("right", 1.2, 0, 1.3, 1.3, 1.3);
      }
      else setHandFingers("right", 0.3, 0, 0.2, 0.5, 0.8);
    }

    // -----------------------------------------------------------------
    // 45. ALL 10 0-9 NUMERIC ISL SIGNS
    // -----------------------------------------------------------------
    else if (digitChar) {
      rotateBone("rightarm", -0.65, 0.2, -1.05);
      rotateBone("rightforearm", -1.2, 0.15, 0.1);
      rotateBone("righthand", 0.2, 0.1, 0.1);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);

      if (digitChar === "0") setHandFingers("right", 0.7, 0.7, 0.7, 0.7, 0.7);
      else if (digitChar === "1") setHandFingers("right", 1.2, 0, 1.3, 1.3, 1.3);
      else if (digitChar === "2") setHandFingers("right", 1.2, 0, 0, 1.3, 1.3);
      else if (digitChar === "3") setHandFingers("right", 0, 0, 0, 1.3, 1.3);
      else if (digitChar === "4") setHandFingers("right", 1.2, 0, 0, 0, 0);
      else if (digitChar === "5") setHandFingers("right", 0, 0, 0, 0, 0);
      else if (digitChar === "6") setHandFingers("right", 0.8, 0, 0, 0, 0.8);
      else if (digitChar === "7") setHandFingers("right", 0.8, 0, 0, 0.8, 0);
      else if (digitChar === "8") setHandFingers("right", 0.8, 0, 0.8, 0, 0);
      else if (digitChar === "9") setHandFingers("right", 0.8, 0.8, 0, 0, 0);
      else setHandFingers("right", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // UNIVERSAL DYNAMIC KINEMATIC SYNTHESIZER FOR ANY ARBITRARY VOCABULARY WORD
    // Generates a UNIQUE, distinct, natural chest-level 3D gesture per word!
    // -----------------------------------------------------------------
    else {
      let hash = 0;
      for (let i = 0; i < cleanSign.length; i++) {
        hash = (hash << 5) - hash + cleanSign.charCodeAt(i);
        hash |= 0;
      }
      hash = Math.abs(hash);

      const armAngleX = -0.55 - ((hash % 100) / 100) * 0.2;
      const armAngleY = 0.15 + (((hash >> 2) % 100) / 100) * 0.15;
      const forearmX = -1.2 - (((hash >> 4) % 100) / 100) * 0.25;
      const isTwoHanded = hash % 2 === 0;

      const motionSpeed = 3.0 + ((hash % 30) / 10);
      const stroke = Math.sin(t * motionSpeed) * 0.2;

      rotateBone("rightarm", armAngleX + stroke * 0.15, armAngleY, -1.05);
      rotateBone("rightforearm", forearmX + stroke * 0.2, 0.15, 0.1);
      rotateBone("righthand", 0.25 + stroke * 0.2, 0.1, 0.1);

      const fingerType = (hash >> 6) % 5;
      if (fingerType === 0) setHandFingers("right", 0, 0, 0, 0, 0);
      else if (fingerType === 1) setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);
      else if (fingerType === 2) setHandFingers("right", 0.8, 0.8, 0.8, 0.8, 0.8);
      else if (fingerType === 3) setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
      else setHandFingers("right", 0, 1.2, 1.2, 1.2, 0);

      if (isTwoHanded) {
        rotateBone("leftarm", armAngleX - stroke * 0.15, -armAngleY, 1.05);
        rotateBone("leftforearm", forearmX - stroke * 0.2, -0.15, -0.1);
        rotateBone("lefthand", 0.25 - stroke * 0.2, -0.1, -0.1);
        if (fingerType === 0) setHandFingers("left", 0, 0, 0, 0, 0);
        else if (fingerType === 1) setHandFingers("left", 1.2, 0, 1.2, 1.2, 1.2);
        else if (fingerType === 2) setHandFingers("left", 0.8, 0.8, 0.8, 0.8, 0.8);
        else if (fingerType === 3) setHandFingers("left", 1.2, 0, 0, 1.2, 1.2);
        else setHandFingers("left", 0, 1.2, 1.2, 1.2, 0);
      } else {
        rotateBone("leftarm", 0.05, -0.05, 1.28);
        rotateBone("leftforearm", -0.22, 0, 0);
        setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
      }
    }
  });

  const modelTransform = useMemo(() => {
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const desiredHeight = 3.6;
    const modelScale = desiredHeight / (size.y || 1);

    return {
      scale: modelScale,
      position: [
        -center.x * modelScale,
        -box.min.y * modelScale - 1.85,
        -center.z * modelScale,
      ] as [number, number, number],
    };
  }, [clone]);

  return (
    <group scale={modelTransform.scale} position={modelTransform.position}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload("/models/isl-avatar.glb");