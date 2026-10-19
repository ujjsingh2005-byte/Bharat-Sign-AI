import { useState } from "react";
import Sidebar, { type DashboardTab } from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import VoicePanel from "../../components/dashboard/VoicePanel";
import AvatarViewer, { type SignItem } from "../../components/dashboard/AvatarViewer";
import CameraSignPanel from "../../components/dashboard/CameraSignPanel";
import UniversalSemanticPanel from "../../components/dashboard/UniversalSemanticPanel";
import LiveCommunicationStudio from "../../components/dashboard/LiveCommunicationStudio";
import ISLDictionary from "../../components/dashboard/ISLDictionary";
import ResearchStudio from "../../components/research/ResearchStudio";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Eye, Radio } from "lucide-react";

const TAB_BACKGROUNDS: Record<DashboardTab, string> = {
  all: "bg-[#050816]",
  research: "bg-[#090D18]",
  voice_to_sign: "bg-[#061225]",
  semantic_to_sign: "bg-[#120A22]",
  camera_recognition: "bg-[#04171D]",
  live_studio: "bg-[#100B22]",
  dictionary: "bg-[#071A17]",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("all");
  const [activeSignSequence, setActiveSignSequence] = useState<SignItem[]>([]);

  const handleSetSignSequence = (signs: SignItem[]) => {
    if (signs && signs.length > 0) {
      setActiveSignSequence(signs);
    }
  };

  const bgClass = TAB_BACKGROUNDS[activeTab] || "bg-[#050816]";

  return (
    <div className={`flex min-h-screen ${bgClass} text-white selection:bg-blue-600 selection:text-white transition-colors duration-500`}>
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
              <div 
                style={{ background: "linear-gradient(135deg, #17153B 0%, #312E81 55%, #164E63 100%)" }}
                className="rounded-3xl border border-[#4F46E5] p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 bg-[#4F46E5]/30 text-[#A5B4FC] text-xs px-3 py-1 rounded-full border border-[#4F46E5]/60 font-bold mb-3">
                    <Sparkles size={13} />
                    CHROMA AI STUDIO — UNIVERSAL ISL ECOSYSTEM
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Bharat Sign AI 3 Master Platform
                  </h1>
                  <p className="mt-2 text-sm text-[#C7D2FE] leading-relaxed">
                    Connecting 14+ Indian languages (Hindi, Bhojpuri, Bengali, Marathi, Tamil, Telugu, etc.) with Indian Sign Language (ISL) using 3D skeletal avatars, computer vision, and speech AI.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab("live_studio")}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                    >
                      <span>Open Live 2-Way Studio</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setActiveTab("semantic_to_sign")}
                      className="bg-[#0B1020] hover:bg-[#151A3A] border border-[#263653] text-[#F8FAFC] text-xs font-bold px-4 py-2.5 rounded-xl transition"
                    >
                      Try Bhojpuri & Regional Translation
                    </button>
                  </div>
                </div>
              </div>

              {/* Module 1: 6 Studio Overview Quick-Access Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Card 1: Translation Studio */}
                <div 
                  onClick={() => setActiveTab("voice_to_sign")}
                  className="cursor-pointer rounded-2xl border border-[#2563EB] bg-[#102A43] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-[#1D4ED8] text-[#7DD3FC]">
                      <Radio size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#7DD3FC] bg-[#2563EB]/30 px-2.5 py-0.5 rounded-full border border-[#2563EB]">
                      MODE 1 & 2
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#7DD3FC]">Voice & Audio Studio</h3>
                  <p className="text-xs text-slate-300 mt-1">Speech recognition & Whisper audio transcription to ISL</p>
                </div>

                {/* Card 2: Research Studio */}
                <div 
                  onClick={() => setActiveTab("research")}
                  className="cursor-pointer rounded-2xl border border-[#7C3AED] bg-[#251542] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-[#6D28D9] text-[#C4B5FD]">
                      <Cpu size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#C4B5FD] bg-[#7C3AED]/30 px-2.5 py-0.5 rounded-full border border-[#7C3AED]">
                      PAPER AI
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#C4B5FD]">Research & Paper Studio</h3>
                  <p className="text-xs text-slate-300 mt-1">WER/CER benchmarks, paper metrics & pipeline evaluation</p>
                </div>

                {/* Card 3: Regional Languages */}
                <div 
                  onClick={() => setActiveTab("semantic_to_sign")}
                  className="cursor-pointer rounded-2xl border border-[#EA580C] bg-[#352016] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-[#C2410C] text-[#FDBA74]">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#FDBA74] bg-[#EA580C]/30 px-2.5 py-0.5 rounded-full border border-[#EA580C]">
                      14+ LANGUAGES
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#FDBA74]">Regional Languages</h3>
                  <p className="text-xs text-slate-300 mt-1">Hindi, Bhojpuri, Bengali, Marathi & South Indian languages</p>
                </div>

                {/* Card 4: Camera Recognition */}
                <div 
                  onClick={() => setActiveTab("camera_recognition")}
                  className="cursor-pointer rounded-2xl border border-[#0D9488] bg-[#10312F] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-[#0F766E] text-[#5EEAD4]">
                      <Eye size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#5EEAD4] bg-[#0D9488]/30 px-2.5 py-0.5 rounded-full border border-[#0D9488]">
                      VISION LAB
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#5EEAD4]">Camera Sign Recognition</h3>
                  <p className="text-xs text-slate-300 mt-1">Real-time webcam hand tracking & sign gesture decoding</p>
                </div>

                {/* Card 5: Live Communication */}
                <div 
                  onClick={() => setActiveTab("live_studio")}
                  className="cursor-pointer rounded-2xl border border-[#DB2777] bg-[#32152B] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-900/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-[#BE185D] text-[#F9A8D4]">
                      <ArrowRight size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#F9A8D4] bg-[#DB2777]/30 px-2.5 py-0.5 rounded-full border border-[#DB2777]">
                      MODE 6
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F9A8D4]">Live 2-Way Studio</h3>
                  <p className="text-xs text-slate-300 mt-1">Bi-directional sign & speech conversation hub</p>
                </div>

                {/* Card 6: ISL Dictionary */}
                <div 
                  onClick={() => setActiveTab("dictionary")}
                  className="cursor-pointer rounded-2xl border border-[#16A34A] bg-[#183026] p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-[#15803D] text-[#86EFAC]">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-[#86EFAC] bg-[#16A34A]/30 px-2.5 py-0.5 rounded-full border border-[#16A34A]">
                      100+ SIGNS
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#86EFAC]">ISL Dictionary & Learning</h3>
                  <p className="text-xs text-slate-300 mt-1">Categorized sign library with 3D playback controls</p>
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

          {/* ========================================================= */}
          {/* TAB 7: RESEARCH STUDIO & PAPER EVALUATION LAYER */}
          {/* ========================================================= */}
          {activeTab === "research" && (
            <div className="max-w-7xl mx-auto">
              <ResearchStudio />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}