import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  BookOpen,
  Camera,
  Play,
  Square,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Cpu,
  Activity,
  Award,
  Filter,
  Search,
  Check,
  RefreshCw,
  Video,
  BarChart2,
  X,
  Clock,
  ShieldCheck,
  Hand,
} from "lucide-react";
import { API_BASE_URL as API } from "../../utils/apiConfig";

export interface ISLSignItem {
  id: number;
  sign: string;
  display: string;
  hindi: string;
  category: string;
  category_id: number;
  hands_required: number;
  is_dynamic: boolean;
  anatomical_cue: string;
  status: "Not recorded" | "Samples collected" | "Ready for training" | "Trained" | "Passed independent testing";
  sample_count: number;
  test_accuracy?: number | null;
  has_avatar_animation: boolean;
}

export interface ISLCategoryItem {
  id: number;
  name: string;
  count: number;
}

export interface RecordedSampleMeta {
  sample_id: string;
  sign_label: string;
  session_id: string;
  recorded_at: string;
  num_frames: number;
  duration_ms: number;
  num_hands: number;
  handedness: string[];
  quality_status: string;
}

export interface EvaluationReport {
  version: string;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  trained_classes_count: number;
  overall_accuracy: number;
  overall_accuracy_pct: string;
  per_class_metrics: Record<
    string,
    {
      precision: number;
      recall: number;
      f1_score: number;
      test_samples: number;
    }
  >;
  confusion_matrix: {
    classes: string[];
    matrix: number[][];
  };
  timestamp: string;
}

interface SignTrainingStudioProps {
  cameraOn: boolean;
  startCamera: () => void;
  stopCamera: () => void;
  handDetected: boolean;
  handCount: number;
  allHandsLandmarksRef: React.MutableRefObject<any[][]>;
  liveLandmarksRef: React.MutableRefObject<any[] | null>;
  allHandsHandednessRef: React.MutableRefObject<any[]>;
  onModelTrained?: () => void;
}

export default function SignTrainingStudio({
  cameraOn,
  startCamera,
  stopCamera,
  handDetected,
  handCount,
  allHandsLandmarksRef,
  liveLandmarksRef,
  allHandsHandednessRef,
  onModelTrained,
}: SignTrainingStudioProps) {
  // Curriculum & Catalog
  const [curriculum, setCurriculum] = useState<ISLSignItem[]>([]);
  const [categories, setCategories] = useState<ISLCategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSign, setSelectedSign] = useState<ISLSignItem | null>(null);

  // Existing Samples for selected sign
  const [existingSamples, setExistingSamples] = useState<RecordedSampleMeta[]>([]);
  const [loadingSamples, setLoadingSamples] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordProgressMs, setRecordProgressMs] = useState(0);
  const [capturedFramesCount, setCapturedFramesCount] = useState(0);
  const recordedFramesBufferRef = useRef<any[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Pending Sample awaiting confirmation
  const [pendingSample, setPendingSample] = useState<{
    frames: any[];
    durationMs: number;
    numHands: number;
    handedness: string[];
  } | null>(null);
  const [isConfirmedBySigner, setIsConfirmedBySigner] = useState(false);
  const [isSavingSample, setIsSavingSample] = useState(false);

  // Model Training & Evaluation Report
  const [isTraining, setIsTraining] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Status Alerts
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Audio Beeper using Web Audio API for recording countdown
  const playBeep = useCallback((freq = 600, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {}
  }, []);

  // Fetch Curriculum Catalog
  const fetchCurriculum = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/sign/curriculum`);
      if (res.data && res.data.success) {
        setCurriculum(res.data.signs || []);
        setCategories(res.data.categories || []);
        if (!selectedSign && res.data.signs && res.data.signs.length > 0) {
          // Default to EAT or first sign
          const eatSign = res.data.signs.find((s: ISLSignItem) => s.sign === "EAT") || res.data.signs[0];
          setSelectedSign(eatSign);
        } else if (selectedSign) {
          // Update selectedSign status
          const updated = res.data.signs.find((s: ISLSignItem) => s.sign === selectedSign.sign);
          if (updated) setSelectedSign(updated);
        }
      }
    } catch (e) {
      console.warn("Failed to load ISL curriculum:", e);
    }
  }, [selectedSign]);

  useEffect(() => {
    fetchCurriculum();
  }, []);

  // Fetch Samples for Selected Sign
  const fetchSamplesForSelectedSign = useCallback(async (signLabel: string) => {
    setLoadingSamples(true);
    try {
      const res = await axios.get(`${API}/sign/samples/${signLabel}`);
      if (res.data && res.data.success) {
        setExistingSamples(res.data.samples || []);
      }
    } catch (e) {
      console.warn("Error fetching samples:", e);
      setExistingSamples([]);
    } finally {
      setLoadingSamples(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSign) {
      fetchSamplesForSelectedSign(selectedSign.sign);
      setPendingSample(null);
      setIsConfirmedBySigner(false);
    }
  }, [selectedSign?.sign, fetchSamplesForSelectedSign]);

  // Fetch latest evaluation report on mount
  useEffect(() => {
    axios
      .get(`${API}/sign/model-evaluation-report`)
      .then((res) => {
        if (res.data && res.data.has_report && res.data.report) {
          setEvaluationReport(res.data.report);
        }
      })
      .catch(() => {});
  }, []);

  // Filtered Signs
  const filteredSigns = curriculum.filter((s) => {
    const matchesCategory = selectedCategoryId === "all" || s.category_id === selectedCategoryId;
    const matchesSearch =
      !searchQuery.trim() ||
      s.sign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.display.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hindi.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // ---------------------------------------------------------------------------
  // Recording Sequence Controller
  // ---------------------------------------------------------------------------
  const RECORDING_MAX_DURATION_MS = 2500; // 2.5 seconds per sign recording

  const triggerStartCountdown = () => {
    if (!cameraOn) {
      setFeedbackMessage({ type: "error", text: "Please start the camera before recording!" });
      return;
    }
    if (!selectedSign) return;

    setPendingSample(null);
    setIsConfirmedBySigner(false);
    setCountdown(3);
    playBeep(440, 0.1);

    const countInterval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          window.clearInterval(countInterval);
          startActualRecording();
          return null;
        }
        playBeep(440 + (4 - prev) * 100, 0.1);
        return prev - 1;
      });
    }, 900);
  };

  const startActualRecording = () => {
    playBeep(880, 0.25);
    setIsRecording(true);
    setRecordProgressMs(0);
    setCapturedFramesCount(0);
    recordedFramesBufferRef.current = [];
    recordingStartTimeRef.current = Date.now();

    const sampleRateInterval = 33; // ~30 FPS

    recordingTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - recordingStartTimeRef.current;
      setRecordProgressMs(elapsed);

      // Extract current MediaPipe hands landmarks
      const currentHands = allHandsLandmarksRef.current;
      const currentHandedness = allHandsHandednessRef.current || ["Right"];

      if (currentHands && currentHands.length > 0) {
        // Deep copy clean x, y, z points
        const cleanHands = currentHands.map((h) =>
          h.map((pt) => ({
            x: pt.x,
            y: pt.y,
            z: pt.z ?? 0.0,
          }))
        );

        recordedFramesBufferRef.current.push({
          timestamp_ms: elapsed,
          hands: cleanHands,
          handedness: currentHandedness,
        });
        setCapturedFramesCount(recordedFramesBufferRef.current.length);
      }

      if (elapsed >= RECORDING_MAX_DURATION_MS) {
        stopActualRecording();
      }
    }, sampleRateInterval);
  };

  const stopActualRecording = () => {
    if (recordingTimerRef.current !== null) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    playBeep(330, 0.2);
    setIsRecording(false);

    const frames = [...recordedFramesBufferRef.current];
    const duration = Date.now() - recordingStartTimeRef.current;

    if (frames.length < 5) {
      setFeedbackMessage({
        type: "error",
        text: "Recording rejected: Insufficient hand landmarks detected. Keep your hands visible in the camera frame.",
      });
      return;
    }

    const detectedHandsCount = frames.reduce((acc, f) => Math.max(acc, f.hands?.length || 0), 1);
    const handedness = frames[0]?.handedness || ["Right"];

    setPendingSample({
      frames,
      durationMs: duration,
      numHands: detectedHandsCount,
      handedness,
    });

    setFeedbackMessage({
      type: "info",
      text: `Captured ${frames.length} frames (${Math.round(duration)}ms). Review and confirm below to save to dataset.`,
    });
  };

  // ---------------------------------------------------------------------------
  // Save Verified Sample to Dataset
  // ---------------------------------------------------------------------------
  const handleSaveVerifiedSample = async () => {
    if (!pendingSample || !selectedSign || !isConfirmedBySigner) return;

    setIsSavingSample(true);
    setFeedbackMessage(null);

    try {
      const sessionId = `session_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
      const payload = {
        sign_label: selectedSign.sign,
        session_id: sessionId,
        duration_ms: pendingSample.durationMs,
        num_hands: pendingSample.numHands,
        handedness: pendingSample.handedness,
        frames: pendingSample.frames,
        is_verified: true,
      };

      const res = await axios.post(`${API}/sign/record-sample`, payload);

      if (res.data && res.data.success) {
        setFeedbackMessage({
          type: "success",
          text: `Verified sample saved successfully for '${selectedSign.display}' (${res.data.frames_saved} frames)! Total samples: ${res.data.new_sample_count}.`,
        });
        setPendingSample(null);
        setIsConfirmedBySigner(false);
        // Refresh local samples and curriculum
        fetchSamplesForSelectedSign(selectedSign.sign);
        fetchCurriculum();
      } else {
        setFeedbackMessage({
          type: "error",
          text: res.data?.message || "Failed to save sample.",
        });
      }
    } catch (err: any) {
      console.error("Save sample error:", err);
      setFeedbackMessage({
        type: "error",
        text: err?.response?.data?.detail || "Server error while saving sample.",
      });
    } finally {
      setIsSavingSample(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Delete Sample
  // ---------------------------------------------------------------------------
  const handleDeleteSample = async (sampleId: string) => {
    if (!selectedSign) return;
    if (!window.confirm(`Are you sure you want to delete recording '${sampleId}'?`)) return;

    try {
      const res = await axios.delete(`${API}/sign/sample/${selectedSign.sign}/${sampleId}`);
      if (res.data && res.data.success) {
        setFeedbackMessage({
          type: "info",
          text: `Sample '${sampleId}' deleted.`,
        });
        fetchSamplesForSelectedSign(selectedSign.sign);
        fetchCurriculum();
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: "error",
        text: err?.response?.data?.detail || "Failed to delete sample.",
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Train ISL Model on Collected Data
  // ---------------------------------------------------------------------------
  const handleTrainModel = async () => {
    setIsTraining(true);
    setFeedbackMessage({
      type: "info",
      text: "Starting model training with session-aware stratified split...",
    });

    try {
      const res = await axios.post(`${API}/sign/train-expanded-model`);
      if (res.data && res.data.success) {
        setEvaluationReport(res.data);
        setShowReportModal(true);
        setFeedbackMessage({
          type: "success",
          text: `Model successfully trained! Version: ${res.data.version} • Accuracy: ${res.data.overall_accuracy_pct}.`,
        });
        fetchCurriculum();
        if (onModelTrained) onModelTrained();
      } else {
        setFeedbackMessage({
          type: "error",
          text: res.data?.message || "Training aborted: Insufficient training data.",
        });
      }
    } catch (err: any) {
      console.error("Training error:", err);
      setFeedbackMessage({
        type: "error",
        text: err?.response?.data?.detail || "Server error during model training.",
      });
    } finally {
      setIsTraining(false);
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Passed independent testing":
        return {
          bg: "bg-purple-950/80 text-purple-300 border-purple-500/40",
          dot: "bg-purple-400",
          label: "🟣 Passed Testing",
        };
      case "Trained":
        return {
          bg: "bg-blue-950/80 text-blue-300 border-blue-500/40",
          dot: "bg-blue-400",
          label: "🔵 Trained",
        };
      case "Ready for training":
        return {
          bg: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
          dot: "bg-emerald-400",
          label: "🟢 Ready for Training",
        };
      case "Samples collected":
        return {
          bg: "bg-amber-950/80 text-amber-300 border-amber-500/40",
          dot: "bg-amber-400",
          label: "🟡 Samples Collected",
        };
      default:
        return {
          bg: "bg-slate-900 text-slate-400 border-slate-700",
          dot: "bg-slate-500",
          label: "⚪ Not Recorded",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Studio Overview Header */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-950 to-orange-950/30 p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <BookOpen size={20} />
              </span>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>Sign Data Collection & Model Training Studio</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {curriculum.length} ISL Signs Curriculum
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Record authentic MediaPipe landmark sequences (21 landmarks single-hand, 42 dual-hand) across {categories.length} categories.
              Train real RandomForest & Sequence classifiers with stratified zero-leakage session evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTrainModel}
              disabled={isTraining}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 transition disabled:opacity-50"
            >
              {isTraining ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Training Model...</span>
                </>
              ) : (
                <>
                  <Cpu size={14} />
                  <span>Train ISL Recognition Model</span>
                </>
              )}
            </button>

            {evaluationReport && (
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 transition shadow"
              >
                <BarChart2 size={14} className="text-purple-400" />
                <span>View Evaluation Report ({evaluationReport.version})</span>
              </button>
            )}
          </div>
        </div>

        {/* Studio Stats Ticker */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-semibold">Total Curriculum Signs</span>
            <span className="text-base font-black text-white">{curriculum.length} Signs ({categories.length} Categories)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-amber-400 block font-semibold">Samples Collected</span>
            <span className="text-base font-black text-amber-300">
              {curriculum.filter((s) => s.sample_count > 0).length} Signs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-emerald-400 block font-semibold">Ready for Training (≥3)</span>
            <span className="text-base font-black text-emerald-300">
              {curriculum.filter((s) => s.sample_count >= 3).length} Signs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-blue-400 block font-semibold">Trained in Model</span>
            <span className="text-base font-black text-blue-300">
              {curriculum.filter((s) => s.status === "Trained" || s.status === "Passed independent testing").length} Signs
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-purple-400 block font-semibold">Passed Independent Testing</span>
            <span className="text-base font-black text-purple-300">
              {curriculum.filter((s) => s.status === "Passed independent testing").length} Signs
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Alert Banner */}
      {feedbackMessage && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-xs font-semibold shadow ${
            feedbackMessage.type === "success"
              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
              : feedbackMessage.type === "error"
              ? "bg-red-950/80 text-red-300 border-red-500/40"
              : "bg-blue-950/80 text-blue-300 border-blue-500/40"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
            {feedbackMessage.type === "error" && <AlertTriangle size={16} className="text-red-400 shrink-0" />}
            {feedbackMessage.type === "info" && <Sparkles size={16} className="text-blue-400 shrink-0" />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Studio Workspace: Left Sidebar (Curriculum Browser) + Right Area (Recording & Sample Management) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 80 Signs Curriculum Browser (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-amber-400" />
                <span>ISL Vocabulary Catalog</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredSigns.length} / {curriculum.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by sign, English, Hindi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              <button
                onClick={() => setSelectedCategoryId("all")}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition ${
                  selectedCategoryId === "all"
                    ? "bg-amber-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                All ({curriculum.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition ${
                    selectedCategoryId === c.id
                      ? "bg-amber-600 text-white font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {c.name.split(" ")[0]} ({(c as any).sign_count ?? c.count ?? 0})
                </button>
              ))}
            </div>
          </div>

          {/* Signs List */}
          <div className="max-h-[580px] overflow-y-auto space-y-1.5 pr-1">
            {filteredSigns.map((s) => {
              const isSelected = selectedSign?.sign === s.sign;
              const badge = getStatusBadge(s.status);
              return (
                <div
                  key={s.sign}
                  onClick={() => setSelectedSign(s)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-amber-950/40 border-amber-500 shadow-md"
                      : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{s.display}</span>
                      <span className="text-[11px] text-amber-300/90 font-medium">({s.hindi})</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{s.hands_required === 2 ? "👐 2 Hands" : "✋ 1 Hand"}</span>
                      <span>•</span>
                      <span>{s.is_dynamic ? "🌊 Dynamic" : "🛑 Static"}</span>
                      {s.has_avatar_animation && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-400">3D Avatar</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {s.sample_count} samples
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Sign Inspector & Live Recording Console (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedSign ? (
            <>
              {/* Selected Sign Reference Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-white">{selectedSign.display}</span>
                      <span className="text-base font-bold text-amber-400">({selectedSign.hindi})</span>
                      <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        #{selectedSign.id} • {selectedSign.sign}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Category: <span className="text-slate-200 font-semibold">{selectedSign.category}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                        getStatusBadge(selectedSign.status).bg
                      }`}
                    >
                      {getStatusBadge(selectedSign.status).label}
                    </span>
                    <span className="text-xs font-bold bg-slate-900 border border-slate-800 text-amber-300 px-2.5 py-1 rounded-lg">
                      {selectedSign.sample_count} Samples Stored
                    </span>
                  </div>
                </div>

                {/* ISL Verified Anatomical Cue & Mechanics */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <ShieldCheck size={14} />
                    <span>Official ISL Verified Anatomical Mechanics:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedSign.anatomical_cue}
                  </p>

                  {/* Visual Landmark Reference Image */}
                  <div className="pt-2">
                    <img
                      key={selectedSign.sign}
                      src={`/guide_${selectedSign.sign.toLowerCase()}.jpg`}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      alt={`${selectedSign.display} Landmark Guide`}
                      className="max-h-52 rounded-xl border border-slate-700 object-contain shadow bg-black"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Hand size={13} className="text-blue-400" />
                      <span>Configuration: <strong>{selectedSign.hands_required} Hand(s) Required</strong></span>
                    </span>
                    <span>•</span>
                    <span>Movement: <strong>{selectedSign.is_dynamic ? "Dynamic Movement Sequence" : "Static Spatial Handshape"}</strong></span>
                    <span>•</span>
                    <span>Avatar Support: <strong>{selectedSign.has_avatar_animation ? "✅ Available" : "❌ No 3D Asset"}</strong></span>
                  </div>
                </div>

                {/* Hand Presence Verification HUD */}
                <div className="p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">MediaPipe Vision Status:</span>
                    {cameraOn ? (
                      handDetected ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {handCount >= 2
                            ? "42 Landmarks Tracked (Both Hands Active)"
                            : "21 Landmarks Tracked (Single Hand Active)"}
                        </span>
                      ) : (
                        <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          Hand not visible. Please bring your hand into the camera frame.
                        </span>
                      )
                    ) : (
                      <span className="text-slate-500 font-semibold">Camera is currently paused</span>
                    )}
                  </div>

                  {/* Dual hand check warning */}
                  {selectedSign.hands_required === 2 && handCount < 2 && cameraOn && handDetected && (
                    <span className="text-xs text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30 font-semibold flex items-center gap-1">
                      <AlertTriangle size={13} />
                      Second hand missing: this sign requires both hands.
                    </span>
                  )}
                </div>

                {/* Recording Controls Bar */}
                <div className="space-y-3 pt-2">
                  {!isRecording && countdown === null ? (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={triggerStartCountdown}
                        disabled={!cameraOn}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 transition disabled:opacity-40"
                      >
                        <Play size={16} fill="white" />
                        <span>Start Recording '{selectedSign.display}' ({selectedSign.hindi})</span>
                      </button>

                      {!cameraOn ? (
                        <button
                          onClick={startCamera}
                          className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition shadow"
                        >
                          <Camera size={16} />
                          <span>Turn On Camera</span>
                        </button>
                      ) : null}
                    </div>
                  ) : countdown !== null ? (
                    /* Countdown Display */
                    <div className="p-6 rounded-xl bg-amber-950/40 border border-amber-500/50 text-center space-y-2 animate-pulse">
                      <span className="text-4xl font-black text-amber-400">{countdown}</span>
                      <p className="text-xs font-bold text-amber-200">
                        Get Ready! Place hand in posture for "{selectedSign.display}"...
                      </p>
                    </div>
                  ) : (
                    /* Active Recording Bar */
                    <div className="p-5 rounded-xl bg-red-950/60 border border-red-500 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                          <span className="text-sm font-black text-white uppercase tracking-wider">
                            Recording Live Sign Gesture...
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-red-300">
                          {Math.round(recordProgressMs)} ms / {RECORDING_MAX_DURATION_MS} ms ({capturedFramesCount} frames)
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                        <div
                          className="bg-red-500 h-2.5 rounded-full transition-all duration-75"
                          style={{ width: `${Math.min(100, (recordProgressMs / RECORDING_MAX_DURATION_MS) * 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={stopActualRecording}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition"
                        >
                          <Square size={14} className="text-red-400" />
                          <span>Stop Early & Review</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Pending Sample Review & Confirmation Card */}
                  {pendingSample && (
                    <div className="p-4 rounded-xl border border-amber-500/50 bg-slate-900 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>Sample Recorded • Label Confirmation Required</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-300">
                          {pendingSample.frames.length} frames • {Math.round(pendingSample.durationMs)}ms
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Sign Label</span>
                          <span className="font-bold text-white">{selectedSign.sign}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Hands Captured</span>
                          <span className="font-bold text-white">{pendingSample.numHands} Hand(s)</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Handedness</span>
                          <span className="font-bold text-white">{pendingSample.handedness.join(", ")}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block">Integrity</span>
                          <span className="font-bold text-emerald-400">21 3D Landmarks / Hand</span>
                        </div>
                      </div>

                      {/* Explicit confirmation checkbox */}
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-amber-500/30 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isConfirmedBySigner}
                          onChange={(e) => setIsConfirmedBySigner(e.target.checked)}
                          className="mt-0.5 accent-amber-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs text-slate-200">
                          I verify and confirm that this recorded sample is the genuine, authentic Indian Sign Language sign for{" "}
                          <strong className="text-amber-300">"{selectedSign.display} ({selectedSign.hindi})"</strong>.
                        </span>
                      </label>

                      <div className="flex flex-wrap items-center gap-2 justify-end pt-1">
                        <button
                          onClick={() => {
                            setPendingSample(null);
                            setIsConfirmedBySigner(false);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          Discard
                        </button>

                        <button
                          onClick={handleSaveVerifiedSample}
                          disabled={!isConfirmedBySigner || isSavingSample}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition disabled:opacity-40"
                        >
                          {isSavingSample ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              <span>Save Verified Sample</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recorded Samples Table for Selected Sign */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      Collected Samples for '{selectedSign.display}' ({existingSamples.length})
                    </span>
                  </div>
                  <button
                    onClick={() => fetchSamplesForSelectedSign(selectedSign.sign)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <RefreshCw size={12} className={loadingSamples ? "animate-spin" : ""} />
                    <span>Refresh</span>
                  </button>
                </div>

                {existingSamples.length === 0 ? (
                  <div className="text-center py-8 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    No samples recorded yet for {selectedSign.display}. Select 'Start Recording' above to collect genuine sign data.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="pb-2">Sample ID</th>
                          <th className="pb-2">Frames</th>
                          <th className="pb-2">Duration</th>
                          <th className="pb-2">Hands</th>
                          <th className="pb-2">Quality</th>
                          <th className="pb-2">Recorded At</th>
                          <th className="pb-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {existingSamples.map((s) => (
                          <tr key={s.sample_id} className="hover:bg-slate-900/50 transition">
                            <td className="py-2.5 font-mono text-[11px] text-slate-300">{s.sample_id}</td>
                            <td className="py-2.5 font-semibold text-white">{s.num_frames} frames</td>
                            <td className="py-2.5 text-slate-400">{Math.round(s.duration_ms)} ms</td>
                            <td className="py-2.5 text-slate-300">{s.num_hands} hand ({s.handedness?.join(", ")})</td>
                            <td className="py-2.5">
                              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                                {s.quality_status}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-400 text-[11px]">
                              {new Date(s.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => handleDeleteSample(s.sample_id)}
                                className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                                title="Delete Sample"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-400">
              Select any sign from the left vocabulary catalog to begin data collection.
            </div>
          )}
        </div>
      </div>

      {/* Model Evaluation Report Modal */}
      {showReportModal && evaluationReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <BarChart2 size={18} />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">Model Evaluation & Metrics Report</h3>
                  <p className="text-xs text-slate-400">Version: {evaluationReport.version}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Overall Test Accuracy</span>
                <span className="text-2xl font-black text-emerald-400">{evaluationReport.overall_accuracy_pct}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Trained Classes</span>
                <span className="text-2xl font-black text-white">{evaluationReport.trained_classes_count}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Train Samples</span>
                <span className="text-2xl font-black text-blue-400">{evaluationReport.train_samples}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Test Samples (Held-out)</span>
                <span className="text-2xl font-black text-purple-400">{evaluationReport.test_samples}</span>
              </div>
            </div>

            {/* Per-Class Metrics Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Per-Class Detailed Metrics</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Sign Label</th>
                      <th className="p-2.5">Precision</th>
                      <th className="p-2.5">Recall</th>
                      <th className="p-2.5">F1-Score</th>
                      <th className="p-2.5">Test Support</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                    {Object.entries(evaluationReport.per_class_metrics).map(([clsName, metrics]) => (
                      <tr key={clsName} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-bold text-white">{clsName}</td>
                        <td className="p-2.5 text-slate-300">{(metrics.precision * 100).toFixed(1)}%</td>
                        <td className="p-2.5 text-slate-300">{(metrics.recall * 100).toFixed(1)}%</td>
                        <td className="p-2.5 font-bold text-emerald-400">{(metrics.f1_score * 100).toFixed(1)}%</td>
                        <td className="p-2.5 text-slate-400">{metrics.test_samples}</td>
                        <td className="p-2.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              metrics.f1_score >= 0.70
                                ? "bg-purple-950 text-purple-300 border-purple-500/30"
                                : "bg-blue-950 text-blue-300 border-blue-500/30"
                            }`}
                          >
                            {metrics.f1_score >= 0.70 ? "Passed Testing" : "Trained"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Confusion Matrix Visualization */}
            {evaluationReport.confusion_matrix && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Confusion Matrix (Held-out Test)</h4>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
                  <div className="inline-block min-w-full">
                    <div className="flex items-center gap-2 mb-2 text-[11px] text-slate-400">
                      <span>Row: Actual Sign</span>
                      <span>•</span>
                      <span>Column: Predicted Sign</span>
                    </div>
                    <div className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(${evaluationReport.confusion_matrix.classes.length}, 44px)` }}>
                      <div className="text-[10px] text-slate-500"></div>
                      {evaluationReport.confusion_matrix.classes.map((c) => (
                        <div key={c} className="text-[10px] font-bold text-center text-slate-400 truncate" title={c}>
                          {c.slice(0, 4)}
                        </div>
                      ))}
                      {evaluationReport.confusion_matrix.matrix.map((row, rIdx) => (
                        <React.Fragment key={rIdx}>
                          <div className="text-[11px] font-bold text-slate-300 truncate" title={evaluationReport.confusion_matrix.classes[rIdx]}>
                            {evaluationReport.confusion_matrix.classes[rIdx].slice(0, 8)}
                          </div>
                          {row.map((val, cIdx) => (
                            <div
                              key={cIdx}
                              className={`h-8 rounded flex items-center justify-center font-mono text-xs font-bold border ${
                                rIdx === cIdx && val > 0
                                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                                  : val > 0
                                  ? "bg-red-600/30 border-red-500 text-red-300"
                                  : "bg-slate-950 border-slate-800 text-slate-600"
                              }`}
                            >
                              {val}
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
