import { ArrowRight, Mic, Sparkles, BookOpen, Volume2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
      {/* Background Orbs & Gradients */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 text-xs font-bold text-indigo-300 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Built for More Inclusive Communication</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Every Voice Deserves to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Be Understood.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-normal">
              Experience a smarter way to bridge communication with AI-powered tools designed around Indian Sign Language.
              Seamlessly translate spoken speech and 14+ Indian regional languages into accurate ISL gestures, 3D skeletal avatars, and accessible learning modules.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all duration-200"
              >
                <Mic size={18} />
                <span>Start Translating</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 rounded-2xl border border-slate-700/80 bg-slate-900/80 px-8 py-4 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all duration-200 backdrop-blur-md"
              >
                <BookOpen size={18} className="text-purple-400" />
                <span>Explore ISL Learning</span>
              </Link>
            </div>

            {/* Regional Language Badges */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Supported Indian Languages & Dialects (14+)
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
                    className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PREVIEW COLUMN */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Interactive Translation Preview (Demo)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  AI Pipeline Active
                </span>
              </div>

              {/* Simulated Waveform & Speech Card */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                      <Volume2 size={14} /> Speech Input
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
                        className="w-1 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400 animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${idx * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Translation Output Card */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-indigo-500/30 p-5 shadow-lg">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-cyan-300 uppercase tracking-wide">
                      ISL Gloss Syntax (SOV)
                    </span>
                    <span className="text-[11px] font-semibold text-purple-300 bg-purple-900/40 px-2.5 py-0.5 rounded-full border border-purple-700/50">
                      Grammar Reordered
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-white tracking-wide">
                    WELCOME BHARAT SIGN AI NAMASTE 🤟
                  </p>

                  <div className="mt-4 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 size={14} /> Contextual Disambiguation
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

