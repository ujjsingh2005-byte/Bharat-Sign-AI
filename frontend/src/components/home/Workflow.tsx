import { Mic, Cpu, MessageSquareHeart } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Speak & Input",
    subtitle: "Step 1: Voice or Text",
    description:
      "The user speaks into the microphone or inputs text in English, Hindi, Bhojpuri, Tamil, or 14+ supported regional languages.",
    icon: <Mic size={28} className="text-cyan-400" />,
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40",
  },
  {
    step: "02",
    title: "Interpret & Map",
    subtitle: "Step 2: NLP Grammar Engine",
    description:
      "The AI pipeline normalizes text, resolves polysemous words, reorders syntax into ISL SOV structure, and selects validated sign glosses.",
    icon: <Cpu size={28} className="text-indigo-400" />,
    color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/40",
  },
  {
    step: "03",
    title: "Communicate & Visualize",
    subtitle: "Step 3: 3D Avatar & Sign Playback",
    description:
      "The platform renders skeletal 3D avatar animations, displays sign breakdown cards, and provides accessible captions and speed controls.",
    icon: <MessageSquareHeart size={28} className="text-emerald-400" />,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40",
  },
];

export default function Workflow() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-slate-900">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Seamless 3-Step Process
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          How Bharat Sign AI Works
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Bridging speech and sign language through transparent, intelligent processing.
        </p>
      </div>

      {/* Responsive Step Timeline */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Connecting Line for Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-emerald-500/40 -translate-y-6 z-0"></div>

        {steps.map((s, idx) => (
          <div
            key={s.step}
            className={`relative z-10 rounded-3xl border bg-gradient-to-b ${s.color} bg-slate-950 p-8 shadow-xl hover:-translate-y-2 transition duration-300 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {s.step}
                </span>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  {s.icon}
                </div>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                {s.subtitle}
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-wide">
                {s.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mt-4 font-normal">
                {s.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/60 text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Step {idx + 1} of 3</span>
              <span className="text-emerald-400 font-bold">100% Adherence</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

