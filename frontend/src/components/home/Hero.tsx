import { ArrowRight, Mic, Sparkles, BookOpen, Volume2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#090D1F] py-24 lg:py-32 border-b border-indigo-900/40">
      {/* Background Orbs & Cosmic Gradients */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-cyan-400/10 blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 h-[400px] w-[400px] rounded-full bg-indigo-900/30 blur-3xl pointer-events-none"></div>
      
      {/* Subtle Grid Overlay Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-400/40 px-4 py-2 text-xs font-bold text-indigo-300 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-300" />
              <span>Chroma Intelligence — Next-Gen ISL Ecosystem</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Every Voice Deserves to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Be Understood.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-normal">
              Discover a smarter way to bridge communication through AI-powered tools designed around Indian Sign Language.
              Translate speech and 14+ Indian regional languages into accurate ISL gestures, 3D skeletal avatars, and accessible learning modules.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/40 hover:shadow-indigo-600/60 hover:scale-[1.02] transition-all duration-200"
              >
                <Mic size={18} />
                <span>Start Translating</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 rounded-2xl border border-indigo-400/30 bg-indigo-950/40 px-8 py-4 text-sm font-bold text-slate-200 hover:bg-indigo-900/60 hover:text-white transition-all duration-200 backdrop-blur-md"
              >
                <BookOpen size={18} className="text-purple-300" />
                <span>Explore ISL Learning</span>
              </Link>
            </div>

            {/* Regional Language Badges */}
            <div className="pt-4 border-t border-indigo-900/40">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Supported Indian Languages (14+)
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Hindi",
                  "English",
                  "Bhojpuri",
                  "Tamil",
                  "Telugu",
                  "Bengali",
                  "Marathi",
                  "Gujarati",
                  "Punjabi",
                  "Malayalam",
                  "Kannada",
                  "Odia",
                  "Assamese",
                  "Urdu",
                ].map((lang) => (
                  <span
                    key={lang}
                    className="rounded-xl border border-indigo-900/60 bg-indigo-950/60 px-3 py-1 text-xs text-indigo-200 font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PREVIEW COLUMN */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-indigo-500/30 bg-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl"></div>

              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-indigo-900/40 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                    Interactive Translation Preview
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  AI Pipeline Online
                </span>
              </div>

              {/* Simulated Waveform & Speech Card */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-indigo-950/60 border border-indigo-800/40 p-4">
                  <div className="flex items-center justify-between text-xs text-indigo-300 mb-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Volume2 size={14} className="text-cyan-300" /> Speech Input
                    </span>
                    <span>English / Hindi</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    "Namaste! Welcome to Bharat Sign AI platform."
                  </p>
                  {/* Simulated Waveform Bars */}
                  <div className="mt-3 flex items-center gap-1 h-6">
                    {[40, 75, 30, 90, 60, 100, 45, 80, 55, 35, 70, 95, 40, 65, 85].map((h, idx) => (
                      <div
                        key={idx}
                        className="w-1 rounded-full bg-gradient-to-t from-indigo-500 via-purple-400 to-cyan-300 animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${idx * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Translation Output Card */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/60 border border-purple-500/30 p-5 shadow-lg">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-cyan-300 uppercase tracking-wide">
                      ISL Gloss Syntax (SOV)
                    </span>
                    <span className="text-[11px] font-semibold text-purple-200 bg-purple-900/60 px-2.5 py-0.5 rounded-full border border-purple-700/50">
                      Grammar Reordered
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-white tracking-wide">
                    WELCOME BHARAT SIGN AI NAMASTE 🤟
                  </p>

                  <div className="mt-4 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-300 font-medium">
                      <CheckCircle2 size={14} /> Context Disambiguated
                    </span>
                    <span className="text-indigo-300 font-bold">3D Skeletal Avatar Ready</span>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-6 text-center">
                <span className="text-[11px] text-slate-400 font-medium">
                  Demonstration layout. Connect microphone in the Master Studio to translate live speech.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


