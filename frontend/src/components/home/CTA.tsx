import { ArrowRight, Sparkles, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section
      className="relative overflow-hidden py-32 text-white border-b border-indigo-900/60"
      style={{
        background: "linear-gradient(135deg, #312E81 0%, #7C3AED 35%, #DB2777 70%, #F97316 100%)",
      }}
    >
      {/* Soft Animated Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl animate-pulse pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="rounded-[40px] border border-white/20 bg-slate-950/40 p-10 sm:p-16 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex justify-center mb-6">
            <div className="rounded-2xl bg-white/20 border border-white/30 p-4 shadow-xl">
              <Sparkles className="text-yellow-300" size={36} />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Let's Make Communication <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-white bg-clip-text text-transparent">
              More Inclusive.
            </span>
          </h2>

          <p className="mt-6 text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Start exploring a more accessible way to communicate through AI speech translation, 14+ Indian regional languages, and 3D avatar animations.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-2xl bg-white text-slate-950 px-8 py-4 text-sm font-extrabold shadow-2xl hover:bg-slate-100 hover:scale-[1.03] transition duration-200"
            >
              <span>Start Translating</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-2xl border border-white/40 bg-white/10 text-white px-8 py-4 text-sm font-bold hover:bg-white/20 transition duration-200 backdrop-blur-md"
            >
              <Compass size={18} className="text-yellow-300" />
              <span>Explore the Platform</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


