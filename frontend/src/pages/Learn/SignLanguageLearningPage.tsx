import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import SignLanguagePlaylistPlayer from "../../components/learning/SignLanguagePlaylistPlayer";
import LearnSignLanguage from "../../components/dashboard/LearnSignLanguage";
import {
  Video,
  Layers,
  GraduationCap,
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export default function SignLanguageLearningPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode: "video" (YouTube Course) or "avatar" (3D Avatar Chart)
  const initialMode = searchParams.get("mode") === "avatar" ? "avatar" : "video";
  const [activeMode, setActiveMode] = useState<"video" | "avatar">(initialMode);

  const handleModeChange = (mode: "video" | "avatar") => {
    setActiveMode(mode);
    setSearchParams({ mode });
  };

  return (
    <div className="bg-[#050816] text-white min-h-screen selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Navigation Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <GraduationCap size={13} />
                ISL Learning Academy
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Dual Learning Modalities
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Indian Sign Language Learning Section
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => handleModeChange("video")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeMode === "video"
                  ? "bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-lg shadow-red-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Video size={15} />
              <span>YouTube Video Course</span>
              <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-md font-mono">
                13 Lessons
              </span>
            </button>

            <button
              onClick={() => handleModeChange("avatar")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeMode === "avatar"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers size={15} />
              <span>3D Avatar Studio</span>
              <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-md font-mono">
                18 Signs
              </span>
            </button>
          </div>
        </div>

        {/* Content based on Active Mode */}
        {activeMode === "video" ? (
          <SignLanguagePlaylistPlayer
            onOpenAvatarPractice={(topic) => handleModeChange("avatar")}
            onOpenCameraPractice={() => navigate("/dashboard?tab=camera_recognition")}
          />
        ) : (
          <LearnSignLanguage
            onSwitchToCamera={() => navigate("/dashboard?tab=camera_recognition")}
          />
        )}

        {/* Bottom CTA to Master Studio */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span>Ready for Real-Time Translation & Two-Way Conversations?</span>
            </h3>
            <p className="text-xs text-slate-300">
              Access 14+ Indian regional languages, speech recognition, and live webcam signing in the Master Studio.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/30"
          >
            <span>Launch Master Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
