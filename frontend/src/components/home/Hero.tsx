import { ArrowRight, PlayCircle, Mic, Languages } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-sm text-blue-300">
              <Languages size={16} />
              AI Powered Communication
            </span>

            <h1 className="mt-8 text-5xl md:text-6xl font-bold leading-tight">
              Breaking
              <span className="text-blue-500"> Communication Barriers</span>
              <br />
              with Bharat Sign AI 3
            </h1>

            <p className="mt-8 text-slate-400 text-lg leading-8">
              Universal Indian Language & Sign Language Translation Platform.
              Translate Voice, Speech & 14+ Regional Languages to Indian Sign Language (ISL),
              and recognize Sign Language gestures via Camera in real time.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
              >
                <Mic size={20} />
                Launch Bharat Sign AI Studio
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-slate-700 px-8 py-4 hover:bg-slate-900 transition text-slate-200"
              >
                <PlayCircle size={20} />
                Live 2-Way Demo
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
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
                "Sanskrit",
              ].map((lang) => (
                <span
                  key={lang}
                  className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-300"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">3D ISL Avatar System</h2>

                <span className="flex items-center gap-2 text-green-400 font-medium text-sm">
                  <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                  AI Engine Online
                </span>
              </div>

              <div className="mt-8 h-72 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-6xl mb-3 animate-bounce">🤟</div>
                <h3 className="text-xl font-bold text-blue-400">Bidirectional ISL Bridge</h3>
                <p className="mt-2 text-slate-400 text-sm max-w-sm">
                  Voice ⇄ Text ⇄ Indian Sign Language ⇄ 14+ Regional Indian Languages
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="bg-blue-900/40 text-blue-300 border border-blue-800 text-xs px-3 py-1 rounded-full">
                    Skeletal Mixamo Rig
                  </span>
                  <span className="bg-purple-900/40 text-purple-300 border border-purple-800 text-xs px-3 py-1 rounded-full">
                    A-Z Fingerspelling
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Universal Semantic Layer</span>
                  <span className="text-green-400 font-medium">Active (15 Languages)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">ISL Grammar Engine</span>
                  <span className="text-blue-400 font-medium">SOV & Topic-Comment</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Camera Computer Vision</span>
                  <span className="text-purple-400 font-medium">MediaPipe & Heuristics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
