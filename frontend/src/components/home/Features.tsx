import { Mic, Zap, Brain, ShieldCheck, BookOpen, History, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    id: "speech-to-isl",
    title: "Speech-to-ISL Translation",
    description:
      "Convert spoken audio and speech in 14+ Indian regional languages into accurate Indian Sign Language glosses and 3D avatar gestures.",
    icon: <Mic size={32} />,
    themeClass: "from-indigo-600/20 to-purple-600/20 border-indigo-500/40 text-indigo-300",
    badge: "Aurora AI",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  },
  {
    id: "real-time-translation",
    title: "Real-Time Translation",
    description:
      "Streamlined live microphone listening and camera sign gesture recognition powered by MediaPipe hand landmark tracking.",
    icon: <Zap size={32} />,
    themeClass: "from-sky-600/20 to-blue-600/20 border-sky-500/40 text-sky-300",
    badge: "Ocean Intelligence",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  },
  {
    id: "context-aware",
    title: "Context-Aware Disambiguation",
    description:
      "NLP semantic engine resolves homonyms and polysemous words (e.g. financial 'bank' vs river 'bank') based on conversational domain.",
    icon: <Brain size={32} />,
    themeClass: "from-purple-600/20 to-violet-600/20 border-purple-500/40 text-purple-300",
    badge: "Royal Violet",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
  {
    id: "confidence-aware",
    title: "Confidence-Aware Results",
    description:
      "Displays transparent ASR and translation confidence scores. Highlights low-confidence words with editable transcript alerts.",
    icon: <ShieldCheck size={32} />,
    themeClass: "from-emerald-600/20 to-teal-600/20 border-emerald-500/40 text-emerald-300",
    badge: "Emerald Accessibility",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  {
    id: "isl-learning",
    title: "ISL Learning Studio",
    description:
      "Interactive dictionary and learning lessons for basic signs, alphabets, numbers, common phrases, and practice sessions.",
    icon: <BookOpen size={32} />,
    themeClass: "from-rose-600/20 to-orange-600/20 border-rose-500/40 text-rose-300",
    badge: "Sunset Innovation",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  },
  {
    id: "translation-history",
    title: "Translation History & Export",
    description:
      "Save past translations, review gloss breakdowns, export transcripts, and log user feedback securely.",
    icon: <History size={32} />,
    themeClass: "from-slate-800/40 to-slate-900/80 border-slate-700/60 text-slate-200",
    badge: "Clean Slate",
    badgeColor: "bg-slate-700/40 text-slate-300 border-slate-600/50",
  },
];

export default function Features() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Core Innovations & Features
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Everything Needed for Accessible ISL Communication
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Powered by research-aligned NLP pipelines, 3D skeletal avatar rendering, and multi-theme accessibility standards.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`group relative rounded-3xl border bg-gradient-to-b ${feature.themeClass} p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
                  {feature.icon}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mt-3 font-normal">
                {feature.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-cyan-300 transition"
              >
                <span>Launch Feature</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

