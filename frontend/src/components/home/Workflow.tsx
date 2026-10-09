import { Mic, Cpu, MessageSquareHeart } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Step 1 — Speak & Input",
    subtitle: "Voice or Text Capture",
    description:
      "The user speaks into the microphone or types text in English, Hindi, Bhojpuri, Tamil, or 14+ supported regional languages.",
    icon: <Mic size={28} className="text-[#1D4ED8]" />,
    cardBg: "bg-[#DBEAFE]",
    border: "border-[#BFDBFE]",
    iconBg: "bg-[#BFDBFE]",
    titleColor: "text-[#1E40AF]",
    textColor: "text-[#1E3A8A]",
    badgeText: "Step 1",
  },
  {
    step: "02",
    title: "Step 2 — Process & Interpret",
    subtitle: "NLP Grammar & Context Engine",
    description:
      "The AI pipeline normalizes transcript text, resolves polysemous words, reorders syntax into ISL SOV structure, and maps glosses.",
    icon: <Cpu size={28} className="text-[#7E22CE]" />,
    cardBg: "bg-[#F3E8FF]",
    border: "border-[#E9D5FF]",
    iconBg: "bg-[#E9D5FF]",
    titleColor: "text-[#6B21A8]",
    textColor: "text-[#581C87]",
    badgeText: "Step 2",
  },
  {
    step: "03",
    title: "Step 3 — Communicate & Visualize",
    subtitle: "3D Avatar & Sign Playback",
    description:
      "The platform renders skeletal 3D avatar animations, displays gloss breakdown cards, and provides accessible speed controls.",
    icon: <MessageSquareHeart size={28} className="text-[#047857]" />,
    cardBg: "bg-[#D1FAE5]",
    border: "border-[#A7F3D0]",
    iconBg: "bg-[#A7F3D0]",
    titleColor: "text-[#065F46]",
    textColor: "text-[#064E3B]",
    badgeText: "Step 3",
  },
];

export default function Workflow() {
  return (
    <section
      className="relative py-28 text-slate-900 border-b border-orange-200"
      style={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFF1F2 50%, #FEF3C7 100%)",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-orange-200/80 text-orange-900 border border-orange-300">
            Chroma Intelligence — Section 5: How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Seamless 3-Step ISL Pipeline
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
            Bridging speech and sign language through transparent, intelligent processing.
          </p>
        </div>

        {/* Responsive Step Timeline */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-20 right-20 h-1 bg-gradient-to-r from-[#1D4ED8] via-[#7E22CE] to-[#047857] -translate-y-6 z-0 opacity-40 rounded-full"></div>

          {steps.map((s, idx) => (
            <div
              key={s.step}
              className={`relative z-10 rounded-3xl border ${s.cardBg} ${s.border} p-8 shadow-xl hover:-translate-y-2 transition duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-4xl font-black ${s.titleColor}`}>
                    {s.step}
                  </span>
                  <div className={`p-3.5 rounded-2xl ${s.iconBg} shadow-inner`}>
                    {s.icon}
                  </div>
                </div>

                <span className={`text-xs font-extrabold uppercase tracking-wider block mb-1.5 ${s.titleColor}`}>
                  {s.subtitle}
                </span>
                <h3 className={`text-2xl font-extrabold tracking-wide mb-3 ${s.titleColor}`}>
                  {s.title}
                </h3>
                <p className={`text-sm leading-relaxed font-medium ${s.textColor}`}>
                  {s.description}
                </p>
              </div>

              <div className={`mt-8 pt-4 border-t ${s.border} text-xs font-bold ${s.titleColor} flex items-center justify-between`}>
                <span>Step {idx + 1} of 3</span>
                <span>100% Adherence</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


