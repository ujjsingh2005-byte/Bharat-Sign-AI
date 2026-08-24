import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import {
  Camera,
  Square,
  ScanLine,
  Volume2,
  Copy,
  Trash2,
  Video,
  Languages,
  CheckCircle2,
} from "lucide-react";

const API = "http://127.0.0.1:8000";

interface AlternativePrediction {
  sign: string;
  confidence: number;
}

export default function CameraSignPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const sendingFrameRef = useRef(false);
  const mediaPipeHandsRef = useRef<any>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");

  // Recognition Results
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState("Waiting for camera...");
  const [confidence, setConfidence] = useState(0);
  const [alternatives, setAlternatives] = useState<AlternativePrediction[]>([]);
  const [sentence, setSentence] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const lastAddedSignRef = useRef<string | null>(null);
  const signHoldCountRef = useRef<number>(0);
  const liveLandmarksRef = useRef<any[] | null>(null);

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
  // Text to Speech (TTS)
  // -------------------------------------------------------------
  const speakText = useCallback((textToSpeak: string, langCode = "en") => {
    if (!window.speechSynthesis || !textToSpeak) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;

      const langMap: Record<string, string> = {
        en: "en-IN",
        hi: "hi-IN",
        bho: "hi-IN",
        mr: "mr-IN",
        bn: "bn-IN",
        gu: "gu-IN",
        pa: "pa-IN",
        ta: "ta-IN",
        te: "te-IN",
        ml: "ml-IN",
        kn: "kn-IN",
        ur: "ur-IN",
        sa: "hi-IN",
      };
      utterance.lang = langMap[langCode] || "en-IN";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  }, []);

  // -------------------------------------------------------------
  // Draw Live Skeleton ON TOP OF THE USER'S ACTUAL HAND
  // -------------------------------------------------------------
  const drawOverlay = useCallback(() => {
    const video = videoRef.current;
    const overlay = overlayCanvasRef.current;
    if (!video || !overlay || !cameraOn) return;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    overlay.width = video.videoWidth || 640;
    overlay.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    if (detecting) {
      const w = overlay.width;
      const h = overlay.height;
      const time = performance.now() * 0.003;

      // Draw bounding guide box
      const boxX = w * 0.2;
      const boxY = h * 0.1;
      const boxW = w * 0.6;
      const boxH = h * 0.8;

      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Draw active scanner laser line
      const scanY = boxY + ((Math.sin(time * 2.5) + 1) / 2) * boxH;
      const grad = ctx.createLinearGradient(boxX, scanY, boxX + boxW, scanY);
      grad.addColorStop(0, "rgba(59, 130, 246, 0)");
      grad.addColorStop(0.5, "rgba(96, 165, 250, 0.85)");
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(boxX, scanY);
      ctx.lineTo(boxX + boxW, scanY);
      ctx.stroke();

      // If MediaPipe hand landmarks are detected, draw directly over actual hand
      const landmarks = liveLandmarksRef.current;
      if (landmarks && landmarks.length >= 21) {
        // MediaPipe connections for hand skeleton
        const HAND_CONNECTIONS = [
          [0,1],[1,2],[2,3],[3,4], // Thumb
          [0,5],[5,6],[6,7],[7,8], // Index
          [5,9],[9,10],[10,11],[11,12], // Middle
          [9,13],[13,14],[14,15],[15,16], // Ring
          [13,17],[17,18],[18,19],[19,20],[0,17] // Pinky & Palm
        ];

        // Draw bone connection lines
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const p1 = landmarks[i];
          const p2 = landmarks[j];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x * w, p1.y * h);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.stroke();
          }
        });

        // Draw 21 landmark nodes
        landmarks.forEach((pt: any, idx: number) => {
          const px = pt.x * w;
          const py = pt.y * h;
          ctx.fillStyle = idx === 0 ? "#3b82f6" : idx % 4 === 0 ? "#ef4444" : "#22c55e";
          ctx.beginPath();
          ctx.arc(px, py, idx % 4 === 0 ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }
    }

    animFrameRef.current = requestAnimationFrame(drawOverlay);
  }, [cameraOn, detecting]);

  useEffect(() => {
    if (cameraOn) {
      animFrameRef.current = requestAnimationFrame(drawOverlay);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraOn, drawOverlay]);

  // -------------------------------------------------------------
  // Initialize MediaPipe Hands client-side if available
  // -------------------------------------------------------------
  useEffect(() => {
    if ((window as any).Hands) {
      try {
        const hands = new (window as any).Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            liveLandmarksRef.current = results.multiHandLandmarks[0];
          } else {
            liveLandmarksRef.current = null;
          }
        });

        mediaPipeHandsRef.current = hands;
      } catch (e) {
        console.warn("MediaPipe Hands setup note:", e);
      }
    }
  }, []);

  // -------------------------------------------------------------
  // Stop Detection & Camera
  // -------------------------------------------------------------
  const stopDetection = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    sendingFrameRef.current = false;
    liveLandmarksRef.current = null;
    setDetecting(false);
  };

  const stopCamera = () => {
    stopDetection();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setTranslatedText("Camera stopped");
    setErrorMessage("");
    setConfidence(0);
    setDetectedSign(null);
    setAlternatives([]);
  };

  // -------------------------------------------------------------
  // Start Camera
  // -------------------------------------------------------------
  const startCamera = async () => {
    try {
      setErrorMessage("");
      setConfidence(0);
      setTranslatedText("Requesting camera access...");

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Video element not found");

      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve();
        } else {
          video.onloadedmetadata = () => resolve();
        }
      });

      await video.play();
      setCameraOn(true);
      setTranslatedText("Camera ready. Click 'Start Detection' to begin recognizing gestures.");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraOn(false);
      setTranslatedText("Camera unavailable");
      setErrorMessage(err?.message || "Unable to start camera. Please verify permissions.");
    }
  };

  // -------------------------------------------------------------
  // Process Recognition Results
  // -------------------------------------------------------------
  const handleRecognitionData = useCallback((data: any) => {
    if (data && data.success && data.sign) {
      const sign = data.sign;
      const text = data.text || sign;
      const conf = Math.round((data.confidence || 0.92) * 100);

      setDetectedSign(sign);
      setTranslatedText(text);
      setConfidence(conf);
      setAlternatives(data.alternatives || []);

      if (sign === lastAddedSignRef.current) {
        signHoldCountRef.current += 1;
      } else {
        lastAddedSignRef.current = sign;
        signHoldCountRef.current = 1;
      }

      if (signHoldCountRef.current === 2) {
        setSentence((prev) => {
          if (prev[prev.length - 1] !== text) {
            const updated = [...prev, text];
            speakText(text, targetLanguage);
            return updated;
          }
          return prev;
        });
      }
    } else if (data && data.message) {
      setTranslatedText(data.message);
    }
  }, [speakText, targetLanguage]);

  // -------------------------------------------------------------
  // Capture Frame & Send to Recognition Engine
  // -------------------------------------------------------------
  const captureAndSendFrame = async () => {
    if (sendingFrameRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) return;

    // Send frame to MediaPipe client-side tracking if enabled
    if (mediaPipeHandsRef.current) {
      try {
        await mediaPipeHandsRef.current.send({ image: video });
      } catch {}
    }

    sendingFrameRef.current = true;

    try {
      // 1. If MediaPipe landmarks are available, send high-precision landmarks
      const landmarks = liveLandmarksRef.current;
      if (landmarks && landmarks.length >= 21) {
        const res = await axios.post(`${API}/sign/recognize-landmarks`, {
          landmarks: landmarks,
          target_language: targetLanguage,
        });
        handleRecognitionData(res.data);
        return;
      }

      // 2. Otherwise send camera frame JPEG to backend computer vision endpoint
      const context = canvas.getContext("2d");
      if (!context) return;

      const width = 480;
      const height = Math.round((video.videoHeight / video.videoWidth) * width) || 360;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(video, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.8);
      });

      if (!blob) return;

      const formData = new FormData();
      formData.append("image", new File([blob], "camera_frame.jpg", { type: "image/jpeg" }));
      formData.append("target_language", targetLanguage);

      const response = await axios.post(`${API}/sign/recognize`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 8000,
      });

      handleRecognitionData(response.data);
    } catch (err) {
      console.warn("Frame recognition notice:", err);
    } finally {
      sendingFrameRef.current = false;
    }
  };

  // -------------------------------------------------------------
  // Start Gesture Detection Loop
  // -------------------------------------------------------------
  const startDetection = () => {
    if (!cameraOn) {
      alert("Please start the camera first.");
      return;
    }
    setDetecting(true);
    setTranslatedText("Scanning camera for sign language gestures...");
    captureAndSendFrame();

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      captureAndSendFrame();
    }, 700);
  };

  const copySentence = () => {
    if (sentence.length === 0) return;
    navigator.clipboard.writeText(sentence.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearSentence = () => {
    setSentence([]);
    setDetectedSign(null);
    setConfidence(0);
    lastAddedSignRef.current = null;
    signHoldCountRef.current = 0;
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span>📷</span>
            <span>Camera Sign Recognition Studio</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Real-time hand landmark tracking & gesture classification to English & 14+ Indian Languages
          </p>
        </div>

        {/* Target Translation Language */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Languages size={15} className="text-blue-400" />
          <span className="text-xs text-slate-400">Translate to:</span>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Stream + Skeleton Overlay Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-cover transform -scale-x-100 ${
            cameraOn ? "block" : "hidden"
          }`}
        />

        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 h-full w-full object-cover transform -scale-x-100 pointer-events-none ${
            cameraOn ? "block" : "hidden"
          }`}
        />

        {/* Camera Off Placeholder */}
        {!cameraOn && (
          <div className="text-center p-6">
            <Video size={48} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-300">Camera is currently turned off</p>
            <p className="text-xs text-slate-500 mt-1">
              Click 'Start Camera' below to launch real-time ISL recognition.
            </p>
          </div>
        )}

        {/* Live Status Badge */}
        {cameraOn && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                detecting
                  ? "bg-green-500 text-slate-950 animate-pulse"
                  : "bg-blue-600 text-white"
              }`}
            >
              <ScanLine size={13} />
              {detecting ? "Live Vision Tracking" : "Camera Standby"}
            </span>
          </div>
        )}
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap gap-3">
        {!cameraOn ? (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-blue-600/20"
          >
            <Camera size={16} />
            Start Camera
          </button>
        ) : !detecting ? (
          <button
            onClick={startDetection}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-green-600/20"
          >
            <ScanLine size={16} />
            Start Detection
          </button>
        ) : (
          <button
            onClick={stopDetection}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-yellow-600/20"
          >
            <Square size={16} />
            Pause Detection
          </button>
        )}

        {cameraOn && (
          <button
            onClick={stopCamera}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-5 py-3 font-bold text-xs transition text-white shadow-lg shadow-red-600/20"
          >
            <Square size={16} />
            Stop Camera
          </button>
        )}
      </div>

      {/* Recognized Gesture Output Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Recognition Output:</span>
          {confidence > 0 && (
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
              Confidence: {confidence}%
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{translatedText || "Perform sign in front of camera..."}</span>
              {detectedSign && (
                <button
                  onClick={() => speakText(translatedText, targetLanguage)}
                  className={`p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition ${
                    isSpeaking ? "animate-pulse text-green-400" : ""
                  }`}
                  title="Listen Pronunciation"
                >
                  <Volume2 size={18} />
                </button>
              )}
            </div>
            {detectedSign && (
              <p className="text-xs font-medium text-slate-400 mt-1">
                Indian Sign: <span className="text-blue-400 font-bold">{detectedSign}</span>
              </p>
            )}
          </div>
        </div>

        {/* Alternative Predictions */}
        {alternatives.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 font-semibold">
              Alternative Candidates:
            </span>
            <div className="flex flex-wrap gap-2">
              {alternatives.map((alt, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg"
                >
                  {alt.sign} ({Math.round(alt.confidence * 100)}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Sentence Builder */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>📝</span> Constructed ISL Sentence:
          </span>

          <div className="flex gap-2">
            <button
              onClick={copySentence}
              disabled={sentence.length === 0}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-40 transition"
            >
              {copied ? <CheckCircle2 size={13} className="text-green-400" /> : <Copy size={13} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              onClick={clearSentence}
              disabled={sentence.length === 0}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 disabled:opacity-40 transition"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="min-h-[42px] rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-wrap items-center gap-2">
          {sentence.length > 0 ? (
            sentence.map((w, idx) => (
              <span
                key={idx}
                className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-xs font-bold shadow"
              >
                {w}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">
              Recognized signs will automatically construct full sentences here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}