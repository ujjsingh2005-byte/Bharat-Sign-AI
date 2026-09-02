import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Mic,
  Send,
  Camera,
  Volume2,
  ScanLine,
  User,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";
import AvatarViewer, { type SignItem } from "./AvatarViewer";

const API = "http://127.0.0.1:8000";

interface Message {
  id: string;
  sender: "hearing" | "deaf";
  originalText: string;
  language: string;
  translatedText?: string;
  islGloss?: string[];
  timestamp: string;
}

export default function LiveCommunicationStudio() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "hearing",
      originalText: "Hello! How can I help you today?",
      language: "en",
      translatedText: "Hello! How can I help you today?",
      islGloss: ["HELLO", "TODAY", "YOU", "HELP", "HOW"],
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "deaf",
      originalText: "WATER",
      language: "ISL",
      translatedText: "I need water please.",
      timestamp: "10:31 AM",
    },
  ]);

  // Hearing Side State
  const [hearingInput, setHearingInput] = useState("");
  const [hearingLang, setHearingLang] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [avatarSequence, setAvatarSequence] = useState<SignItem[]>([
    { word: "HELLO", animation: "hello" },
  ]);

  // Deaf Side State (Camera)
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [visionDetecting, setVisionDetecting] = useState(false);
  const [lastDetectedSign, setLastDetectedSign] = useState<string | null>(null);
  const [deafTargetLang, setDeafTargetLang] = useState("hi");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "bho", name: "Bhojpuri (भोजपुरी)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
    { code: "as", name: "Assamese (অসমীয়া)" },
    { code: "ur", name: "Urdu (اردو)" },
    { code: "sa", name: "Sanskrit (संस्कृतम्)" },
  ];

  // -------------------------------------------------------------
  // TTS Voice Output
  // -------------------------------------------------------------
  const speakVoice = useCallback((text: string, lang = "en") => {
    if (!window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(text);
      ut.rate = 0.95;
      ut.lang = lang === "hi" || lang === "bho" ? "hi-IN" : "en-IN";
      ut.onstart = () => setIsSpeaking(true);
      ut.onend = () => setIsSpeaking(false);
      ut.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(ut);
    } catch (e) {
      console.warn("TTS notice:", e);
    }
  }, []);

  // -------------------------------------------------------------
  // Hearing Person Sends Message (Speech / Text)
  // -------------------------------------------------------------
  const sendHearingMessage = async (textToSend = hearingInput) => {
    if (!textToSend.trim()) return;

    try {
      const res = await axios.post(`${API}/translation/semantic-pipeline`, {
        text: textToSend,
        source_language: hearingLang,
      });

      const data = res.data;
      if (data.success) {
        const newMsg: Message = {
          id: Date.now().toString(),
          sender: "hearing",
          originalText: textToSend,
          language: hearingLang,
          translatedText: data.english_translation,
          islGloss: data.gloss,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, newMsg]);
        setHearingInput("");

        if (data.signs && data.signs.length > 0) {
          setAvatarSequence(data.signs);
        }
      }
    } catch (err) {
      console.error("Hearing message pipeline error:", err);
    }
  };

  // Browser Speech Recognition for Hearing Person
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = hearingLang === "hi" ? "hi-IN" : "en-IN";

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setHearingInput(transcript);
      sendHearingMessage(transcript);
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  // -------------------------------------------------------------
  // Deaf Person Camera Controls & Frame Recognition
  // -------------------------------------------------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (e) {
      console.error("Deaf camera start error:", e);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setVisionDetecting(false);
  };

  const sendSignFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;
    ctx.drawImage(video, 0, 0, 400, 300);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const fd = new FormData();
      fd.append("image", new File([blob], "deaf_frame.jpg", { type: "image/jpeg" }));
      fd.append("target_language", deafTargetLang);

      try {
        const res = await axios.post(`${API}/sign/recognize`, fd);
        const data = res.data;
        if (data.success && data.sign) {
          const sign = data.sign;
          const translated = data.text || sign;

          if (sign !== lastDetectedSign) {
            setLastDetectedSign(sign);

            // Add to conversation thread
            const newMsg: Message = {
              id: Date.now().toString(),
              sender: "deaf",
              originalText: sign,
              language: "ISL",
              translatedText: translated,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, newMsg]);

            // Speak out in hearing person's regional language
            speakVoice(translated, deafTargetLang);
          }
        }
      } catch (e) {
        console.warn("Sign frame error:", e);
      }
    }, "image/jpeg");
  };

  const toggleVisionDetection = () => {
    if (visionDetecting) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setVisionDetecting(false);
    } else {
      if (!cameraActive) {
        startCamera();
      }
      setVisionDetecting(true);
      sendSignFrame();
      intervalRef.current = window.setInterval(sendSignFrame, 1200);
    }
  };

  // Quick Sign Trigger Simulation for testing
  const simulateDeafSign = (signWord: string) => {
    axios
      .post(`${API}/translation/translate`, {
        text: signWord.toLowerCase(),
        source_language: "en",
        target_language: deafTargetLang,
      })
      .then((res) => {
        const translated = res.data.translated_text || signWord;
        const newMsg: Message = {
          id: Date.now().toString(),
          sender: "deaf",
          originalText: signWord,
          language: "ISL",
          translatedText: translated,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, newMsg]);
        speakVoice(translated, deafTargetLang);
      });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
              <ArrowRightLeft size={13} />
              MASTER MODE 6
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Live Two-Way Communication Studio
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Real-time interactive room connecting Hearing Persons (Speech/Text in 14+ Indian languages) and Deaf Individuals (Camera ISL Recognition + 3D Avatar ISL Synthesis).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 bg-green-950/60 border border-green-800/80 text-green-400 text-xs font-semibold px-4 py-2 rounded-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></span>
              Live Room Connected
            </span>
          </div>
        </div>
      </div>

      {/* Split Screen Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN: HEARING PERSON VIEWPORT */}
        {/* ========================================================= */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between shadow-2xl space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Hearing Person</h3>
                  <p className="text-[11px] text-slate-400">Speaks or types in regional language</p>
                </div>
              </div>

              {/* Language Selector */}
              <select
                value={hearingLang}
                onChange={(e) => setHearingLang(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Conversation Log (Hearing Side) */}
            <div className="mt-4 h-64 overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "hearing" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                      m.sender === "hearing"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] opacity-75 mb-1 font-semibold">
                      <span>{m.sender === "hearing" ? "You (Hearing)" : "Deaf Person (ISL)"}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <p className="font-semibold text-sm">
                      {m.sender === "hearing" ? m.originalText : m.translatedText}
                    </p>

                    {m.islGloss && (
                      <div className="mt-1.5 pt-1.5 border-t border-blue-500/40 text-[10px] text-blue-200 font-mono">
                        🤟 ISL GLOSS: {m.islGloss.join(" ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hearing Person Input Controls */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={hearingInput}
                onChange={(e) => setHearingInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendHearingMessage()}
                placeholder="Type or speak a message for the Deaf person..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <button
                onClick={toggleListening}
                className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  isListening
                    ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700"
                }`}
                title="Toggle Microphone"
              >
                <Mic size={15} />
                <span className="hidden sm:inline">{isListening ? "Listening" : "Mic"}</span>
              </button>

              <button
                onClick={() => sendHearingMessage()}
                disabled={!hearingInput.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-lg shadow-blue-600/20"
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </div>

            <div className="flex gap-1.5 text-[11px] text-slate-400">
              <span>Quick Presets:</span>
              <button
                onClick={() => sendHearingMessage("Hello! How are you today?")}
                className="text-blue-400 hover:underline"
              >
                "Hello!"
              </button>
              <span>•</span>
              <button
                onClick={() => sendHearingMessage("Where is the hospital?")}
                className="text-blue-400 hover:underline"
              >
                "Where is the hospital?"
              </button>
              <span>•</span>
              <button
                onClick={() => sendHearingMessage("Please take this medicine.")}
                className="text-blue-400 hover:underline"
              >
                "Take medicine"
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: DEAF PERSON VIEWPORT (3D Avatar & Sign Camera) */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* Top: 3D Avatar Rendering Hearing Person's Speech into ISL */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Deaf Person's View: 3D ISL Avatar</h4>
                  <p className="text-[10px] text-slate-400">
                    Signing what the hearing person just said
                  </p>
                </div>
              </div>

              <span className="text-[11px] bg-slate-950 border border-slate-800 text-purple-300 px-2.5 py-1 rounded-lg">
                3D Mixamo Engine
              </span>
            </div>

            <AvatarViewer sequence={avatarSequence} />
          </div>

          {/* Bottom: Camera Recognition of Deaf Person's Signing */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-green-600/20 text-green-400 border border-green-500/30">
                  <Camera size={16} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Deaf Person Signing (Camera)</h4>
                  <p className="text-[10px] text-slate-400">
                    Sign gestures translated to audio & text for hearing person
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Speak in:</span>
                <select
                  value={deafTargetLang}
                  onChange={(e) => setDeafTargetLang(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-white rounded-lg px-2 py-1 focus:outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-black mb-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] ${
                  cameraActive ? "block" : "hidden"
                }`}
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <Camera size={28} className="mb-1" />
                  <span>Deaf Person Camera Idle</span>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Actions & Preset Gesture Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition"
                  >
                    Start Camera
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleVisionDetection}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                        visionDetecting
                          ? "bg-green-600 text-white animate-pulse"
                          : "bg-slate-800 text-green-400 border border-slate-700"
                      }`}
                    >
                      <ScanLine size={13} />
                      {visionDetecting ? "Scanning Live..." : "Detect Sign"}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-xl font-semibold transition"
                    >
                      Stop Camera
                    </button>
                  </>
                )}
              </div>

              {/* Quick Gesture Simulator for instant testing */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 text-[10px]">Test Sign:</span>
                {["HELLO", "THANK YOU", "WATER", "HELP", "YES"].map((sign) => (
                  <button
                    key={sign}
                    onClick={() => simulateDeafSign(sign)}
                    className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-purple-300 px-2 py-1 rounded-lg transition"
                  >
                    {sign}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Spoken Voice Output Indicator */}
            {isSpeaking && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-400 bg-green-950/40 p-2 rounded-xl border border-green-800">
                <Volume2 size={15} className="animate-bounce" />
                <span>Speaking translated sign in selected language aloud...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
