import { useEffect, useRef, useState, useCallback } from "react";
import {
  Mic,
  Square,
  Languages,
  FileAudio,
  Loader2,
  Volume2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import type { SignItem } from "./AvatarViewer";

const API = "http://127.0.0.1:8000";

interface VoicePanelProps {
  onSignSequence: (signs: SignItem[]) => void;
}

export default function VoicePanel({ onSignSequence }: VoicePanelProps) {
  const [transcript, setTranscript] = useState("");
  const [inputLanguage, setInputLanguage] = useState("en-IN");

  const [backendText, setBackendText] = useState("");
  const [backendLanguage, setBackendLanguage] = useState("Detected");
  const [translatedText, setTranslatedText] = useState("");
  const [glossText, setGlossText] = useState("");
  const [activeSigns, setActiveSigns] = useState<SignItem[]>([]);
  const [ruleApplied, setRuleApplied] = useState("");

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

  // Process pipeline response into UI and Avatar sequence
  const processResponse = useCallback((data: any) => {
    if (!data?.success) {
      setBackendText(data?.message || "Speech Recognition Failed");
      setBackendLanguage("Unknown");
      setTranslatedText("");
      setGlossText("");
      setActiveSigns([]);
      return;
    }

    setBackendText(data.original_text || data.text || "");
    setBackendLanguage(data.source_language || data.language || "Detected");
    setTranslatedText(data.english_translation || data.translated_text || "");
    setGlossText(data.gloss_text || "");
    setRuleApplied(data.rule_applied || "ISL Grammar Reordering");

    const returnedSigns: SignItem[] = Array.isArray(data.signs) ? data.signs : [];
    setActiveSigns(returnedSigns);

    if (returnedSigns.length > 0) {
      onSignSequence(returnedSigns);
    }
  }, [onSignSequence]);

  // Process speech transcript directly through the semantic pipeline
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
      }
    } catch (e) {
      console.warn("Direct text processing error:", e);
    } finally {
      setLoading(false);
    }
  }, [inputLanguage, processResponse]);

  // Initialize Web Speech Recognition
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

  // Send Recorded Audio to Backend Whisper (Only as fallback if no live transcript)
  const sendRecordedAudio = async (audioBlob: Blob) => {
    // If live transcript was already captured accurately from browser speech, DO NOT overwrite with audio noise
    if (liveTranscriptCapturedRef.current && transcript.trim()) {
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      const audioFile = new File([audioBlob], "recording.webm", {
        type: audioBlob.type || "audio/webm",
      });
      formData.append("audio", audioFile);

      const response = await axios.post(`${API}/voice/speech-to-text`, formData);
      if (response.data?.success && response.data?.text) {
        setTranscript(response.data.text);
        processResponse(response.data);
      }
    } catch (error) {
      console.error("Backend speech upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start Live Microphone
  const handleStart = async () => {
    try {
      setTranscript("");
      setBackendText("");
      setTranslatedText("");
      setGlossText("");
      setActiveSigns([]);
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (audioBlob.size > 0) {
          await sendRecordedAudio(audioBlob);
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

  // Stop Live Microphone
  const handleStop = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setRecording(false);

      // If transcript was spoken, ensure it gets processed
      if (transcript.trim() && !glossText) {
        processTextDirectly(transcript);
      }
    } catch (error) {
      console.error("Mic stop error:", error);
      setRecording(false);
    }
  };

  // Upload Audio File (MP3, WAV, M4A)
  const uploadAudio = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      liveTranscriptCapturedRef.current = false;
      const formData = new FormData();
      formData.append("audio", file);

      const response = await axios.post(`${API}/voice/speech-to-text`, formData);
      const data = response.data;
      if (data?.success) {
        setTranscript(data.text || "");
        processResponse(data);
      } else {
        setBackendText("No speech detected in uploaded audio file.");
      }
    } catch (error) {
      console.error("Audio upload error:", error);
      setBackendText("Speech Recognition Failed for uploaded audio.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span>🎤</span>
            <span>Voice & Audio → Indian Sign Language</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Real-time microphone speech recognition and audio file translation with Whisper AI & ISL Grammar Engine
          </p>
        </div>

        {/* Input Voice Language Selector */}
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

      {/* Grid: Live Mic and Audio Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Live Microphone Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Mic size={18} />
                </span>
                <span className="font-bold text-sm text-white">Live Microphone</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                {loading ? (
                  <span className="text-yellow-400 flex items-center gap-1">
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
            <p className="text-xs text-slate-400 mb-4">
              Speak in English, Hindi, or regional languages to generate sign language.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleStart}
              disabled={recording || loading}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 font-bold text-xs transition disabled:opacity-50 shadow-lg shadow-blue-600/20 text-white"
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

        {/* Audio File Upload Box */}
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-5 flex flex-col items-center justify-center text-center">
          <FileAudio size={36} className="text-purple-400 mb-2" />
          <h4 className="text-sm font-bold text-white">Upload Audio File</h4>
          <p className="text-[11px] text-slate-400 mb-3">MP3, WAV, M4A, WEBM audio recordings</p>

          <input
            id="voice-audio-upload"
            type="file"
            accept=".wav,.mp3,.m4a,.webm,audio/*"
            className="hidden"
            onChange={uploadAudio}
          />
          <label
            htmlFor="voice-audio-upload"
            className="cursor-pointer rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-xs font-bold transition shadow-lg shadow-purple-600/20"
          >
            Choose Audio File
          </label>
        </div>
      </div>

      {/* Voice Recognition Pipeline Output */}
      <div className="space-y-3">
        {/* Recognized Transcript */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold">Recognized Speech:</span>
            <span className="text-blue-400 font-mono text-[11px]">
              Lang: {backendLanguage || "Auto"}
            </span>
          </div>
          <p className="text-sm font-medium text-white min-h-[24px]">
            {transcript || backendText || (
              <span className="text-slate-500 italic text-xs">
                Speak into the microphone or upload an audio file...
              </span>
            )}
          </p>
        </div>

        {/* Semantic English & ISL Gloss */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Translated English */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-semibold">Semantic English:</span>
            </div>
            <p className="text-xs font-semibold text-blue-300 min-h-[20px]">
              {translatedText || transcript || (
                <span className="text-slate-600 italic">Translation will appear here...</span>
              )}
            </p>
          </div>

          {/* ISL Gloss */}
          <div className="rounded-2xl border border-purple-500/30 bg-slate-950 p-4">
            <div className="flex items-center justify-between text-xs text-purple-400 mb-1.5">
              <span className="font-bold flex items-center gap-1">
                <Sparkles size={12} />
                ISL Gloss Sequence:
              </span>
              {ruleApplied && (
                <span className="text-[10px] text-slate-400 truncate max-w-[50%]">
                  {ruleApplied}
                </span>
              )}
            </div>
            <p className="text-xs font-extrabold text-purple-300 min-h-[20px] tracking-wide">
              {glossText || (
                <span className="text-slate-600 font-normal italic">
                  ISL Gloss tokens will appear here...
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Active Animated Signs List */}
        {activeSigns.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold">● Animation Active:</span>
              <span className="text-slate-300">
                {activeSigns.map((s) => s.word).join(" → ")}
              </span>
            </div>
            <span className="text-blue-400 flex items-center gap-1">
              Playing on 3D Avatar <ArrowRight size={13} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}