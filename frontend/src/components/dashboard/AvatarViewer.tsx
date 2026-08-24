import { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
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
} from "lucide-react";

export interface SignItem {
  word: string;
  asset?: string;
  type?: "sign" | "letter" | "number";
  category?: string;
  animation?: string;
  description?: string;
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
    if (single) return [{ word: single }];
    return [{ word: "HELLO", description: "Default greeting sign." }];
  }, [rawList, currentSign, sign]);

  const [currentIndex, setCurrentIndex] = useState(propIndex);
  const [isPlaying, setIsPlaying] = useState(propIsPlaying);
  const [speed, setSpeed] = useState(propSpeed);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [sequenceList]);

  useEffect(() => {
    setSpeed(propSpeed);
  }, [propSpeed]);

  const activeItem = sequenceList[currentIndex] || sequenceList[0];
  const activeWord = activeItem ? activeItem.word : "HELLO";

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sequenceList.length - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < sequenceList.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
    onReplaySequence?.();
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
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
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

        {/* Three.js Canvas Container */}
        <div className="w-full h-full">
          <AvatarStage
            currentSign={activeWord}
            isPlaying={isPlaying}
            playbackSpeed={speed}
            onSignDone={handleInternalSignDone}
          />
        </div>

        {/* Current Active Sign Overlay Card */}
        {activeWord && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-950/90 backdrop-blur-md border border-blue-500/40 px-6 py-2.5 rounded-2xl text-center shadow-2xl">
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block mb-0.5">
              INDIAN SIGN LANGUAGE (ISL)
            </span>
            <span className="text-xl font-black text-white tracking-wide">
              {activeWord}
            </span>
          </div>
        )}
      </div>

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
            <RotateCcw size={15} />
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
                  <span>{item.word}</span>
                  {active && isPlaying && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface AvatarStageProps {
  currentSign: string | null;
  isPlaying: boolean;
  playbackSpeed: number;
  onSignDone?: () => void;
}

function AvatarStage({
  currentSign,
  isPlaying,
  playbackSpeed,
  onSignDone,
}: AvatarStageProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.25, 3.2], fov: 38 }}
      className="w-full h-full"
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 4, 3]} intensity={1.4} />
      <directionalLight position={[-2, 2, -2]} intensity={0.5} />
      <pointLight position={[0, 2, 2]} intensity={0.8} />

      <Avatar
        signName={currentSign}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        animationKey={Date.now()}
        onSignDone={onSignDone}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.0}
        maxDistance={5.0}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.15, 0]}
      />
    </Canvas>
  );
}

interface AvatarSubProps {
  signName: string | null;
  isPlaying: boolean;
  playbackSpeed: number;
  animationKey: number;
  onSignDone?: () => void;
}

function Avatar({
  signName,
  isPlaying,
  playbackSpeed,
  animationKey,
  onSignDone,
}: AvatarSubProps) {
  const { scene } = useGLTF("/models/isl-avatar.glb");

  const clone = useMemo(() => {
    return skeletonClone(scene);
  }, [scene]);

  const bones = useRef<Record<string, THREE.Bone>>({});
  const base = useRef<Record<string, THREE.Quaternion>>({});
  const animationTime = useRef(0);
  const signDoneTriggered = useRef(false);

  useEffect(() => {
    const foundBones: Record<string, THREE.Bone> = {};

    clone.traverse((obj: any) => {
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

    if (!signName || signName === "idle") {
      applyNeutralRest();
      return;
    }

    if (!isPlaying) return;

    // Auto-advance trigger duration (2.2s per sign)
    const isShort = signName.startsWith("letter_") || signName.startsWith("number_");
    const duration = isShort ? 1.3 : 2.2;
    if (t > duration && !signDoneTriggered.current) {
      signDoneTriggered.current = true;
      onSignDone?.();
    }

    const cleanSign = signName.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const wordTokens = new Set(cleanSign.split("_"));
    const hasWord = (...kw: string[]) => kw.some((w) => wordTokens.has(w) || cleanSign === w);

    // -----------------------------------------------------------------
    // 1. WHERE
    // -----------------------------------------------------------------
    if (hasWord("where", "kahan")) {
      const shake = Math.sin(t * 5) * 0.18;
      const tilt = Math.sin(t * 3) * 0.08;

      rotateBone("head", 0.05, tilt * 1.5, 0.12);
      rotateBone("neck", 0, tilt, 0.05);

      rotateBone("rightarm", -0.85, 0.35, -0.45);
      rotateBone("rightforearm", -1.15 + shake, 0.4, 0.2);
      rotateBone("righthand", 0.3, 0.2 + shake, 0.4);
      setHandFingers("right", 0.1, 0, 0, 0, 0);

      rotateBone("leftarm", -0.85, -0.35, 0.45);
      rotateBone("leftforearm", -1.15 - shake, -0.4, -0.2);
      rotateBone("lefthand", 0.3, -0.2 - shake, -0.4);
      setHandFingers("left", 0.1, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 2. WHAT
    // -----------------------------------------------------------------
    else if (hasWord("what", "kya")) {
      const pulse = (Math.sin(t * 4) + 1) / 2;
      rotateBone("head", 0.08, 0, 0);

      rotateBone("rightarm", -0.65, 0.25, -0.3);
      rotateBone("rightforearm", -1.25, 0.2, 0.1);
      rotateBone("righthand", 0.25, 0.2 + pulse * 0.25, 0.2);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", -0.65, -0.25, 0.3);
      rotateBone("leftforearm", -1.25, -0.2, -0.1);
      rotateBone("lefthand", 0.25, -0.2 - pulse * 0.25, -0.2);
      setHandFingers("left", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 3. WANT
    // -----------------------------------------------------------------
    else if (hasWord("want", "desire")) {
      const pull = (Math.sin(t * 4.0) + 1) / 2;
      rotateBone("head", 0.06, 0, 0);

      rotateBone("rightarm", -0.65 - pull * 0.2, 0.25, -0.3);
      rotateBone("rightforearm", -1.15 - pull * 0.45, 0.15, 0.1);
      rotateBone("righthand", 0.2 + pull * 0.3, 0.1, 0.1);
      setHandFingers("right", 0.4 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4);

      rotateBone("leftarm", -0.65 - pull * 0.2, -0.25, 0.3);
      rotateBone("leftforearm", -1.15 - pull * 0.45, -0.15, -0.1);
      rotateBone("lefthand", 0.2 + pull * 0.3, -0.1, -0.1);
      setHandFingers("left", 0.4 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4, 0.5 + pull * 0.4);
    }

    // -----------------------------------------------------------------
    // 4. NEED
    // -----------------------------------------------------------------
    else if (hasWord("need", "require")) {
      const drop = (Math.sin(t * 5.0) + 1) / 2;
      rotateBone("head", 0.08, 0, 0);

      rotateBone("rightarm", -0.75, 0.25, -0.25);
      rotateBone("rightforearm", -1.2 + drop * 0.4, 0.15, 0.1);
      rotateBone("righthand", 0.2 + drop * 0.3, 0.1, 0.1);
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

      rotateBone("rightarm", -0.75 + pinch * 0.3, 0.3, -0.3);
      rotateBone("rightforearm", -1.45 + pinch * 0.4, 0.1, 0.1);
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

      rotateBone("leftarm", -0.7, -0.25, 0.35);
      rotateBone("leftforearm", -1.3, -0.15, 0);
      rotateBone("lefthand", 0.1, 0, 0);
      setHandFingers("left", 1.2, 0, 0, 1.2, 1.2);

      rotateBone("rightarm", -0.85, 0.25, -0.3);
      rotateBone("rightforearm", -1.35 + tap * 0.25, 0.15, 0.15);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 7. DO
    // -----------------------------------------------------------------
    else if (hasWord("do", "doing", "did", "does", "kar", "kare", "karen")) {
      const sweep = Math.sin(t * 5.0) * 0.25;
      rotateBone("head", 0.05, sweep * 0.5, 0);

      rotateBone("rightarm", -0.7, 0.3 + sweep, -0.3);
      rotateBone("rightforearm", -1.25, 0.2, 0.1);
      rotateBone("righthand", 0.3, sweep, 0);
      setHandFingers("right", 0.2, 0.3, 0.3, 0.3, 0.3);

      rotateBone("leftarm", -0.7, -0.3 + sweep, 0.3);
      rotateBone("leftforearm", -1.25, -0.2, -0.1);
      rotateBone("lefthand", 0.3, sweep, 0);
      setHandFingers("left", 0.2, 0.3, 0.3, 0.3, 0.3);
    }

    // -----------------------------------------------------------------
    // 8. LIVE
    // -----------------------------------------------------------------
    else if (hasWord("live", "reside", "stay", "living", "rehte", "rehta", "rehti", "rahte")) {
      const moveUp = (Math.sin(t * 3.5) + 1) / 2;
      rotateBone("head", 0.05, 0, 0);

      rotateBone("rightarm", -0.75 - moveUp * 0.25, 0.25, -0.3);
      rotateBone("rightforearm", -1.3 + moveUp * 0.3, 0.15, 0.1);
      rotateBone("righthand", 0.2, 0.1, 0.1);
      setHandFingers("right", 0, 1.3, 1.3, 1.3, 1.3);

      rotateBone("leftarm", -0.75 - moveUp * 0.25, -0.25, 0.3);
      rotateBone("leftforearm", -1.3 + moveUp * 0.3, -0.15, -0.1);
      rotateBone("lefthand", 0.2, -0.1, -0.1);
      setHandFingers("left", 0, 1.3, 1.3, 1.3, 1.3);
    }

    // -----------------------------------------------------------------
    // 9. SPEAK / TALK
    // -----------------------------------------------------------------
    else if (hasWord("speak", "talk", "tell", "say")) {
      const roll = Math.sin(t * 5.0) * 0.2;
      rotateBone("head", 0.05, 0.05, 0);

      rotateBone("rightarm", -1.15, 0.3, -0.25);
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

      rotateBone("rightarm", -1.45, 0.35, -0.3);
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

      rotateBone("rightarm", -1.25 + extend * 0.4, 0.25, -0.2);
      rotateBone("rightforearm", -1.35 + extend * 0.6, 0.2, 0.1);
      rotateBone("righthand", 0.2 + extend * 0.4, 0.1, 0.2);
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

      rotateBone("leftarm", -0.7, -0.2, 0.4);
      rotateBone("leftforearm", -1.3, -0.2, 0);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("rightarm", -0.85 + circleX, 0.3, -0.3);
      rotateBone("rightforearm", -1.35 + circleY, 0.2, 0.1);
      rotateBone("righthand", 0.3, 0.2, 0.2);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 13. NAMASTE
    // -----------------------------------------------------------------
    else if (hasWord("namaste", "namaskar")) {
      const bow = (Math.sin(t * 2.5) + 1) / 2;
      rotateBone("head", 0.18 * bow, 0, 0);
      rotateBone("spine1", 0.08 * bow, 0, 0);

      rotateBone("rightarm", -0.85, 0.4, -0.35);
      rotateBone("rightforearm", -1.45, -0.3, 0.4);
      rotateBone("righthand", 0.25, 0.15, -0.3);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", -0.85, -0.4, 0.35);
      rotateBone("leftforearm", -1.45, 0.3, -0.4);
      rotateBone("lefthand", 0.25, -0.15, 0.3);
      setHandFingers("left", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 14. HELLO / HI
    // -----------------------------------------------------------------
    else if (hasWord("hello", "hi", "hey")) {
      const wave = Math.sin(t * 5.5) * 0.55;
      rotateBone("head", 0, -0.05, -0.05);

      rotateBone("rightarm", -1.45, 0.2, -0.35);
      rotateBone("rightforearm", -0.95, 0.15, 0.25);
      rotateBone("righthand", 0.15, 0.1, wave);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 15. THANK YOU
    // -----------------------------------------------------------------
    else if (hasWord("thank_you", "thank", "thanks", "shukriya", "dhanyawad")) {
      const sweep = (Math.sin(t * 3.0) + 1) / 2;
      rotateBone("head", 0.1 * sweep, 0, 0);

      rotateBone("rightarm", -0.95 + sweep * 0.4, 0.15, -0.2);
      rotateBone("rightforearm", -1.45 + sweep * 0.7, 0.15, 0.1);
      rotateBone("righthand", -0.25 + sweep * 0.6, 0, 0.1);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 16. GOODBYE
    // -----------------------------------------------------------------
    else if (hasWord("goodbye", "bye")) {
      const wave = Math.sin(t * 7) * 0.8;
      rotateBone("rightarm", -1.55, 0.25, -0.4);
      rotateBone("rightforearm", -0.85, 0.1, 0.2);
      rotateBone("righthand", 0.2, 0.2, wave);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 17. WATER
    // -----------------------------------------------------------------
    else if (hasWord("water", "drink", "paani")) {
      const tap = (Math.sin(t * 4.5) + 1) / 2;
      rotateBone("head", 0.05, -0.08, 0);

      rotateBone("rightarm", -1.15, 0.35, -0.25);
      rotateBone("rightforearm", -1.45 + tap * 0.2, 0.2, 0.1);
      rotateBone("righthand", 0.4 + tap * 0.25, 0.1, 0.15);
      setHandFingers("right", 1.2, 0, 0, 0, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 18. FOOD
    // -----------------------------------------------------------------
    else if (hasWord("food", "eat", "khana")) {
      const bite = (Math.sin(t * 4.5) + 1) / 2;
      rotateBone("head", 0.08, 0, 0);

      rotateBone("rightarm", -1.05, 0.3, -0.2);
      rotateBone("rightforearm", -1.55 + bite * 0.35, 0.2, 0.1);
      rotateBone("righthand", 0.3 + bite * 0.3, 0.1, 0.1);
      setHandFingers("right", 0.8, 0.9, 0.9, 0.9, 0.9);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 19. HELP
    // -----------------------------------------------------------------
    else if (hasWord("help", "emergency", "madad")) {
      const lift = Math.sin(t * 3.5) * 0.2;

      rotateBone("leftarm", -0.75 + lift, -0.25, 0.35);
      rotateBone("leftforearm", -1.25, -0.15, -0.15);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);

      rotateBone("rightarm", -0.8 + lift, 0.25, -0.3);
      rotateBone("rightforearm", -1.3, 0.15, 0.2);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 0, 1.3, 1.3, 1.3, 1.3);
    }

    // -----------------------------------------------------------------
    // 20. DOCTOR / HOSPITAL
    // -----------------------------------------------------------------
    else if (hasWord("doctor", "hospital", "medicine")) {
      const tap = (Math.sin(t * 4.5) + 1) / 2;

      rotateBone("leftarm", -0.65, -0.35, 0.4);
      rotateBone("leftforearm", -1.35, -0.2, 0);
      rotateBone("lefthand", 0.1, 0, 0);
      setHandFingers("left", 0.2, 0.2, 0.2, 0.2, 0.2);

      rotateBone("rightarm", -0.8, 0.35, -0.35);
      rotateBone("rightforearm", -1.4 + tap * 0.25, 0.15, 0.15);
      rotateBone("righthand", 0.4, 0.1, 0.2);
      setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 21. SCHOOL / COLLEGE / STUDY / BOOK
    // -----------------------------------------------------------------
    else if (hasWord("school", "college", "study", "book")) {
      const clap = (Math.sin(t * 4.0) + 1) / 2;

      rotateBone("leftarm", -0.7, -0.25, 0.35);
      rotateBone("leftforearm", -1.25, -0.15, 0);
      rotateBone("lefthand", 0.2, 0, 0);
      setHandFingers("left", 0, 0, 0, 0, 0);

      rotateBone("rightarm", -0.85 + clap * 0.25, 0.25, -0.3);
      rotateBone("rightforearm", -1.3 + clap * 0.35, 0.15, 0.15);
      rotateBone("righthand", 0.3, 0.1, 0.1);
      setHandFingers("right", 0, 0, 0, 0, 0);
    }

    // -----------------------------------------------------------------
    // 22. YES
    // -----------------------------------------------------------------
    else if (hasWord("yes")) {
      const nod = Math.sin(t * 5.5) * 0.45;
      rotateBone("head", nod * 0.3, 0, 0);

      rotateBone("rightarm", -0.8, 0.2, -0.25);
      rotateBone("rightforearm", -1.2, 0.1, 0.1);
      rotateBone("righthand", 0.2 + nod, 0, 0);
      setHandFingers("right", 1.2, 1.2, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 23. NO
    // -----------------------------------------------------------------
    else if (hasWord("no")) {
      const shake = Math.sin(t * 6.5) * 0.3;
      rotateBone("head", 0, shake, 0);

      rotateBone("rightarm", -0.9, 0.25, -0.3);
      rotateBone("rightforearm", -1.15, 0.1, 0.1);
      rotateBone("righthand", 0.2, shake * 0.5, 0.1);
      const snap = (Math.sin(t * 6.5) + 1) / 2;
      setHandFingers("right", snap * 0.8, snap * 1.2, snap * 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 24. ME / MY
    // -----------------------------------------------------------------
    else if (hasWord("me", "my", "main", "mujhe")) {
      rotateBone("head", 0.08, 0, 0);

      rotateBone("rightarm", -0.7, 0.35, -0.35);
      rotateBone("rightforearm", -1.5, 0.1, 0.1);
      rotateBone("righthand", 0.4, 0.1, 0.2);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 25. YOU
    // -----------------------------------------------------------------
    else if (hasWord("you", "your", "aap", "tum", "tu")) {
      rotateBone("rightarm", -0.95, 0.1, -0.15);
      rotateBone("rightforearm", -0.55, 0.05, 0.05);
      rotateBone("righthand", 0.1, 0, 0.05);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 26. PLEASE
    // -----------------------------------------------------------------
    else if (hasWord("please")) {
      const rubX = Math.cos(t * 4.5) * 0.15;
      const rubY = Math.sin(t * 4.5) * 0.15;
      rotateBone("head", 0.08, 0, 0);

      rotateBone("rightarm", -0.8 + rubX, 0.35, -0.3);
      rotateBone("rightforearm", -1.35 + rubY, 0.1, 0.2);
      rotateBone("righthand", 0.35, 0.15, 0.1);
      setHandFingers("right", 0, 0, 0, 0, 0);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);
    }

    // -----------------------------------------------------------------
    // 27. SORRY
    // -----------------------------------------------------------------
    else if (hasWord("sorry")) {
      const circleX = Math.cos(t * 4.5) * 0.15;
      const circleY = Math.sin(t * 4.5) * 0.15;
      rotateBone("head", 0.12, 0, 0);

      rotateBone("rightarm", -0.75 + circleX, 0.35, -0.35);
      rotateBone("rightforearm", -1.4 + circleY, 0.15, 0.2);
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
      rotateBone("rightarm", -0.9, 0.2, -0.25);
      rotateBone("rightforearm", -0.8 + roll, 0.1, 0.1);
      rotateBone("righthand", 0.2 + roll * 0.6, 0, 0.1);
      setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);

      rotateBone("leftarm", -0.9, -0.2, 0.25);
      rotateBone("leftforearm", -0.8 - roll, -0.1, -0.1);
      rotateBone("lefthand", 0.2 - roll * 0.6, 0, -0.1);
      setHandFingers("left", 1.2, 0, 1.2, 1.2, 1.2);
    }

    // -----------------------------------------------------------------
    // 29. A-Z FINGERSPELLING
    // -----------------------------------------------------------------
    else if (cleanSign.startsWith("letter_")) {
      const char = cleanSign.replace("letter_", "");
      rotateBone("rightarm", -1.0, 0.25, -0.25);
      rotateBone("rightforearm", -1.25, 0.15, 0.1);
      rotateBone("righthand", 0.2, 0.15, 0.1);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);

      if (char === "a") setHandFingers("right", 0, 1.3, 1.3, 1.3, 1.3);
      else if (char === "b") setHandFingers("right", 1.2, 0, 0, 0, 0);
      else if (char === "c") setHandFingers("right", 0.6, 0.6, 0.6, 0.6, 0.6);
      else if (char === "d") setHandFingers("right", 0.9, 0, 0.9, 0.9, 0.9);
      else if (char === "e") setHandFingers("right", 1.1, 1.1, 1.1, 1.1, 1.1);
      else if (char === "f") setHandFingers("right", 0.9, 0.9, 0, 0, 0);
      else setHandFingers("right", 0.3, 0, 0.2, 0.5, 0.8);
    }

    // -----------------------------------------------------------------
    // 30. 0-9 NUMBERS
    // -----------------------------------------------------------------
    else if (cleanSign.startsWith("number_")) {
      const digit = cleanSign.replace("number_", "");
      rotateBone("rightarm", -0.95, 0.25, -0.25);
      rotateBone("rightforearm", -1.2, 0.15, 0.1);
      rotateBone("righthand", 0.2, 0.1, 0.1);

      rotateBone("leftarm", 0.05, -0.05, 1.28);
      rotateBone("leftforearm", -0.22, 0, 0);
      setHandFingers("left", 0.2, 0.25, 0.25, 0.25, 0.25);

      if (digit === "1") setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);
      else if (digit === "2") setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
      else if (digit === "3") setHandFingers("right", 0, 0, 0, 1.2, 1.2);
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

      const armAngleX = -0.7 - ((hash % 100) / 100) * 0.25;
      const armAngleY = 0.2 + (((hash >> 2) % 100) / 100) * 0.2;
      const forearmX = -1.15 - (((hash >> 4) % 100) / 100) * 0.3;
      const isTwoHanded = hash % 2 === 0;

      const motionSpeed = 3.0 + ((hash % 30) / 10);
      const stroke = Math.sin(t * motionSpeed) * 0.2;

      rotateBone("rightarm", armAngleX + stroke * 0.15, armAngleY, -0.3);
      rotateBone("rightforearm", forearmX + stroke * 0.2, 0.15, 0.1);
      rotateBone("righthand", 0.25 + stroke * 0.2, 0.1, 0.1);

      const fingerType = (hash >> 6) % 5;
      if (fingerType === 0) setHandFingers("right", 0, 0, 0, 0, 0);
      else if (fingerType === 1) setHandFingers("right", 1.2, 0, 1.2, 1.2, 1.2);
      else if (fingerType === 2) setHandFingers("right", 0.8, 0.8, 0.8, 0.8, 0.8);
      else if (fingerType === 3) setHandFingers("right", 1.2, 0, 0, 1.2, 1.2);
      else setHandFingers("right", 0, 1.2, 1.2, 1.2, 0);

      if (isTwoHanded) {
        rotateBone("leftarm", armAngleX - stroke * 0.15, -armAngleY, 0.3);
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