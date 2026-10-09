import { useEffect, useRef, useState, useCallback } from "react";
import {
  Mic,
  Square,
  Languages,
  Loader2,
  Volume2,
  Sparkles,
  Edit3,
  AlertTriangle,
  Zap,
  Brain,
  ShieldAlert,
} from "lucide-react";
import axios from "axios";
import type { SignItem } from "./AvatarViewer";
import { processLocalSemanticPipeline } from "../../utils/localSemanticPipeline";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface VoicePanelProps {
  onSignSequence: (signs: SignItem[]) => void;
}

export default function VoicePanel({ onSignSequence }: VoicePanelProps) {
  const [transcript, setTranscript] = useState("");
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState("");
  const [inputLanguage, setInputLanguage] = useState("en-IN");
  const [activeMode, setActiveMode] = useState<"quick" | "contextual" | "fallback">("contextual");

  const [backendText, setBackendText] = useState("");
  const [backendLanguage, setBackendLanguage] = useState("Detected");
  const [translatedText, setTranslatedText] = useState("");
  const [glossText, setGlossText] = useState("");
  const [activeSigns, setActiveSigns] = useState<SignItem[]>([]);
  const [ruleApplied, setRuleApplied] = useState("");
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [lowConfidence, setLowConfidence] = useState(false);

  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const recognitionRef = useRef<any>(null);
  const liveTranscriptCapturedRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const VOICE_LANGUAGES = [
    { code: "en-IN", name: "Indian English" },
    { code: "hi-IN", name: "Hindi (हिन्दी)" },
    { code: "bn-IN", name: "Bengali (বাংলা)" },
    { code: "mr-IN", name: "Marathi (मराठी)" },
    { code: "gu-IN", name: "Gujarati (ગુજરાતી)" },
    { code: "ta-IN", name: "Tamil (தமிழ்)" },
    { code: "te-IN", name: "Telugu (తెలుగు)" },
    { code: "ml-IN", name: "Malayalam (മലയാളം)" },
    { code: "kn-IN", name: "Kannada (ಕನ್ನಡ)" },
    { code: "pa-IN", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "ur-IN", name: "Urdu (اردو)" },
  ];

  const processResponse = useCallback((data: any) => {
    if (!data?.success) {
      setBackendText(data?.message || "Speech Recognition Failed");
      setBackendLanguage("Unknown");
      setTranslatedText("");
      setGlossText("");
      setActiveSigns([]);
      setLowConfidence(true);
      return;
    }

    setBackendText(data.original_text || data.text || "");
    setBackendLanguage(data.source_language || data.language || "Detected");
    setTranslatedText(data.english_translation || data.translated_text || "");
    setGlossText(data.gloss_text || "");
    setRuleApplied(data.rule_applied || "ISL Grammar Reordering");

    const returnedSigns: SignItem[] = Array.isArray(data.signs) ? data.signs : [];
    setActiveSigns(returnedSigns);

    const conf = data.confidence || 0.92;
    setConfidenceScore(conf);
    setLowConfidence(Boolean(data.lowConfidenceWarning || conf < 0.70));

    if (returnedSigns.length > 0) {
      onSignSequence(returnedSigns);
    }
  }, [onSignSequence]);

  const processTextDirectly = useCallback(async (text: string) => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API}/translation/semantic-pipeline`, {
        text: text,
        source_language: inputLanguage.split("-")[0],
      });
      if (res.data.success) {
        liveTranscriptCapturedRef.current = true;
        processResponse(res.data);
      } else {
        throw new Error(res.data.message || "Pipeline error");
      }
    } catch (e) {
      console.warn("Direct API unreachable, using client-side ISL semantic fallback:", e);
      const fallbackResult = processLocalSemanticPipeline(text, inputLanguage.split("-")[0]);
      liveTranscriptCapturedRef.current = true;
      processResponse(fallbackResult);
    } finally {
      setLoading(false);
    }
  }, [inputLanguage, processResponse]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = inputLanguage;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interimTranscript += res[0].transcript;
        }
      }

      const text = (finalTranscript || interimTranscript).trim();
      if (text) {
        setTranscript(text);
        if (finalTranscript) {
          processTextDirectly(finalTranscript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech API Notice:", event.error);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [inputLanguage, processTextDirectly]);

  const handleStart = async () => {
    try {
      setTranscript("");
      setBackendText("");
      setTranslatedText("");
      setGlossText("");
      setActiveSigns([]);
      setLowConfidence(false);
      liveTranscriptCapturedRef.current = false;

      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Microphone access is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options = { mimeType: "audio/webm;codecs=opus" };
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options = { mimeType: "audio/webm" };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (audioChunksRef.current.length > 0 && !liveTranscriptCapturedRef.current) {
          try {
            setLoading(true);
            const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType || "audio/webm" });
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            formData.append("target_language", inputLanguage.split("-")[0]);

            const res = await axios.post(`${API}/voice/speech-to-text`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
              setTranscript(res.data.text || "");
              processResponse(res.data);
            }
          } catch (err) {
            console.warn("Backend audio ASR endpoint unreachable, using WebSpeech API transcript fallback:", err);
          } finally {
            setLoading(false);
          }
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }

      setRecording(true);
    } catch (error) {
      console.error("Mic start error:", error);
      alert("Unable to access microphone. Please check browser permissions.");
      setRecording(false);
    }
  };

  const handleStop = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setRecording(false);

      if (transcript.trim() && !glossText) {
        processTextDirectly(transcript);
      }
    } catch (error) {
      console.error("Mic stop error:", error);
      setRecording(false);
    }
  };

  const handleSaveEditedTranscript = () => {
    setTranscript(editedTranscript);
    setIsEditingTranscript(false);
    processTextDirectly(editedTranscript);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-blue-600/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-extrabold">
              TARGET SIGN LANGUAGE: INDIAN SIGN LANGUAGE (ISL)
            </span>
          </div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span>🎤</span>
            <span>Voice & Speech → ISL Translation</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Microphone speech recognition with confidence scoring, editable transcript, and ISL Time-Subject-Object-Verb reordering.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Languages size={15} className="text-blue-400" />
          <span className="text-xs text-slate-400">Voice Language:</span>
          <select
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {VOICE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs w-fit">
        <button
          onClick={() => setActiveMode("quick")}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeMode === "quick" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          <Zap size={13} />
          <span>Mode A: Quick</span>
        </button>
        <button
          onClick={() => setActiveMode("contextual")}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeMode === "contextual" ? "bg-amber-500 text-slate-950" : "text-slate-400"
          }`}
        >
          <Brain size={13} />
          <span>Mode B: Contextual</span>
        </button>
        <button
          onClick={() => setActiveMode("fallback")}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeMode === "fallback" ? "bg-purple-600 text-white" : "text-slate-400"
          }`}
        >
          <ShieldAlert size={13} />
          <span>Mode C: Fallback</span>
        </button>
      </div>

      {/* Mic Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Mic size={18} />
            </span>
            <span className="font-bold text-sm text-white">Live Microphone Speech Capture</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {loading ? (
              <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                <Loader2 size={13} className="animate-spin" /> Processing
              </span>
            ) : recording ? (
              <span className="text-green-400 flex items-center gap-1 font-semibold">
                <Volume2 size={14} className="animate-pulse" /> Listening...
              </span>
            ) : (
              <span className="text-slate-500">Idle</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStart}
            disabled={recording || loading}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 font-bold text-xs transition disabled:opacity-50 text-white"
          >
            <Mic size={15} />
            Start Listening
          </button>

          <button
            onClick={handleStop}
            disabled={!recording}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 font-bold text-xs transition disabled:opacity-50 text-white"
          >
            <Square size={15} />
            Stop
          </button>
        </div>
      </div>

      {/* Low Confidence Warning Alert Banner */}
      {lowConfidence && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 text-amber-300">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Low Speech-Recognition Confidence Triggered</span>
              <span className="text-slate-300 text-[11px]">We detected uncertainty in the recognized speech. You can edit the transcript or try repeating your sentence.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditedTranscript(transcript || backendText);
                setIsEditingTranscript(true);
              }}
              className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
            >
              <Edit3 size={13} /> Edit Transcript
            </button>
            <button
              onClick={handleStart}
              className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl font-bold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Transcript & Inline Edit */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">Recognized Speech Transcript:</span>
          {confidenceScore !== null && (
            <span className="text-emerald-400 font-mono text-[11px] font-bold">
              Confidence: {(confidenceScore * 100).toFixed(1)}%
            </span>
          )}
        </div>

        {isEditingTranscript ? (
          <div className="space-y-2">
            <textarea
              rows={2}
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
            <div className="flex gap-2 justify-end text-xs">
              <button
                onClick={() => setIsEditingTranscript(false)}
                className="px-3 py-1 rounded-xl font-bold bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedTranscript}
                className="px-4 py-1 rounded-xl font-bold bg-amber-500 text-slate-950"
              >
                Save & Re-translate
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">
              {transcript || backendText || (
                <span className="text-slate-500 italic text-xs">Speak into the microphone...</span>
              )}
            </p>
            {transcript && (
              <button
                onClick={() => {
                  setEditedTranscript(transcript);
                  setIsEditingTranscript(true);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold shrink-0 ml-2"
              >
                <Edit3 size={13} /> Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Output ISL Sequence & Semantic English */}
      {glossText && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Semantic English ({backendLanguage})</span>
              <p className="text-xs font-semibold text-blue-300">{translatedText || transcript}</p>
            </div>
            <div className="rounded-2xl border border-purple-500/40 bg-slate-950 p-4">
              <div className="flex items-center justify-between text-xs text-purple-400 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles size={13} /> ISL Gloss Sequence:
                </span>
                <span className="text-[10px] text-slate-400">{ruleApplied}</span>
              </div>
              <p className="text-sm font-extrabold text-purple-300 tracking-wide font-mono">
                {glossText}
              </p>
            </div>
          </div>

          {activeSigns.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Playing <strong className="text-emerald-400">{activeSigns.length}</strong> signs on 3D Avatar</span>
              <span className="text-blue-400 font-bold">{activeSigns.map((s) => s.word).join(" → ")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}