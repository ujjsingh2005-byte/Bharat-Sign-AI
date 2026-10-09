import { ArrowRight, Sparkles, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-28 bg-slate-950">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-cyan-500/10 blur-3xl animate-pulse"></div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
        <div className="rounded-[36px] border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950 p-10 sm:p-16 text-center shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl"></div>

          <div className="flex justify-center mb-6">
            <div className="rounded-2xl bg-indigo-500/20 border border-indigo-500/40 p-4 shadow-lg">
              <Sparkles className="text-cyan-300" size={36} />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Let's Make Communication <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              More Inclusive.
            </span>
          </h2>

          <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience real-time AI speech translation, 14+ regional Indian languages, context-aware ISL syntax reordering, and 3D avatar rendering today.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition duration-200"
            >
              <span>Start Translating</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-2xl border border-slate-700/80 bg-slate-900/80 px-8 py-4 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition duration-200"
            >
              <Compass size={18} className="text-purple-400" />
              <span>Explore the Platform</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

