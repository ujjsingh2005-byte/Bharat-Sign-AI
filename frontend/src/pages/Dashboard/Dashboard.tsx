import { useState } from "react";
import Sidebar, { type DashboardTab } from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import VoicePanel from "../../components/dashboard/VoicePanel";
import AvatarViewer, { type SignItem } from "../../components/dashboard/AvatarViewer";
import CameraSignPanel from "../../components/dashboard/CameraSignPanel";
import UniversalSemanticPanel from "../../components/dashboard/UniversalSemanticPanel";
import LiveCommunicationStudio from "../../components/dashboard/LiveCommunicationStudio";
import ISLDictionary from "../../components/dashboard/ISLDictionary";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Eye, Radio } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("all");
  const [activeSignSequence, setActiveSignSequence] = useState<SignItem[]>([
    { word: "HELLO", animation: "hello", description: "Open hand raised near temple waving outward." },
  ]);

  const handleSetSignSequence = (signs: SignItem[]) => {
    if (signs && signs.length > 0) {
      setActiveSignSequence(signs);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      {/* Dynamic Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* ========================================================= */}
          {/* TAB 1: STUDIO OVERVIEW (ALL MODES UNIFIED) */}
          {/* ========================================================= */}
          {activeTab === "all" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Quick Hero Banner */}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/40 via-slate-900 to-purple-950/40 p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30 font-bold mb-3">
                    <Sparkles size={13} />
                    UNIVERSAL MULTILINGUAL ECOSYSTEM
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Bharat Sign AI 3 Master Platform
                  </h1>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Connecting 14+ Indian languages (Hindi, Bhojpuri, Bengali, Marathi, Tamil, Telugu, etc.) with Indian Sign Language (ISL) using 3D skeletal avatars, computer vision, and speech AI.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab("live_studio")}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
                    >
                      <span>Open Live 2-Way Studio</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setActiveTab("semantic_to_sign")}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                      Try Bhojpuri & Regional Translation
                    </button>
                  </div>
                </div>
              </div>

              {/* Mode Grid: 3D Avatar + Input Panels */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Column: Voice & Semantic Inputs */}
                <div className="xl:col-span-7 space-y-8">
                  {/* Mode 3: Universal Semantic Layer */}
                  <UniversalSemanticPanel onSignSequence={handleSetSignSequence} />

                  {/* Mode 1 & 2: Voice & Audio */}
                  <VoicePanel onSignSequence={handleSetSignSequence} />
                </div>

                {/* Right Column: 3D ISL Avatar Output */}
                <div className="xl:col-span-5 sticky top-28 space-y-6">
                  <AvatarViewer sequence={activeSignSequence} />

                  {/* Feature Highlights Card */}
                  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                      <ShieldCheck size={18} className="text-green-400" />
                      Platform Capabilities
                    </h3>
                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-blue-400 shrink-0" />
                        <span>ISL Grammar Reordering (SOV + Time + Topic-Comment)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={14} className="text-purple-400 shrink-0" />
                        <span>Real-Time Camera Hand Landmark Tracking (MediaPipe)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Radio size={14} className="text-yellow-400 shrink-0" />
                        <span>Whisper Multi-Format Audio Transcription (MP3/WAV/M4A)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode 4 & 5: Camera Sign Recognition Section */}
              <div className="pt-4">
                <CameraSignPanel />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: VOICE & AUDIO TO SIGN (MODE 1 & 2) */}
          {/* ========================================================= */}
          {activeTab === "voice_to_sign" && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-7">
                <VoicePanel onSignSequence={handleSetSignSequence} />
              </div>
              <div className="xl:col-span-5 sticky top-28">
                <AvatarViewer sequence={activeSignSequence} />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: REGIONAL LANGUAGES & SEMANTIC LAYER (MODE 3) */}
          {/* ========================================================= */}
          {activeTab === "semantic_to_sign" && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-7">
                <UniversalSemanticPanel onSignSequence={handleSetSignSequence} />
              </div>
              <div className="xl:col-span-5 sticky top-28">
                <AvatarViewer sequence={activeSignSequence} />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CAMERA SIGN RECOGNITION (MODE 4 & 5) */}
          {/* ========================================================= */}
          {activeTab === "camera_recognition" && (
            <div className="max-w-5xl mx-auto">
              <CameraSignPanel />
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: LIVE TWO-WAY STUDIO (MODE 6) */}
          {/* ========================================================= */}
          {activeTab === "live_studio" && (
            <div className="max-w-7xl mx-auto">
              <LiveCommunicationStudio />
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: ISL DICTIONARY & LEARNING STUDIO */}
          {/* ========================================================= */}
          {activeTab === "dictionary" && (
            <div className="max-w-7xl mx-auto">
              <ISLDictionary />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}