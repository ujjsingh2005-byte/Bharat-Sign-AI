import {
  Keyboard,
  Subtitles,
  SunMoon,
  Eye,
  Languages,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";

const accessibilityFeatures = [
  {
    icon: <Keyboard size={32} className="text-cyan-400" />,
    title: "Full Keyboard Navigation",
    description:
      "Every interactive button, modal, tab, and playback control is 100% accessible via Tab, Shift+Tab, and Enter keys with clear focus rings.",
  },
  {
    icon: <Subtitles size={32} className="text-indigo-400" />,
    title: "Captions & Transcripts",
    description:
      "Simultaneous sign gloss breakdowns and text captions ensure hearing and deaf users can read along seamlessly.",
  },
  {
    icon: <SunMoon size={32} className="text-yellow-400" />,
    title: "High-Contrast & 7 Themes",
    description:
      "Includes an optional High-Contrast accessibility theme with maximum legibility alongside 6 curated dark/light color palettes.",
  },
  {
    icon: <Eye size={32} className="text-emerald-400" />,
    title: "Accessible Controls & Speed",
    description:
      "Adjustable avatar playback speeds (0.5x, 0.75x, 1x, 1.5x) and sign sequence step-jumping for comfortable learning.",
  },
  {
    icon: <Languages size={32} className="text-purple-400" />,
    title: "14+ Regional Indian Languages",
    description:
      "Bridges Hindi, Bhojpuri, Tamil, Telugu, Bengali, Marathi, and more into unified Indian Sign Language syntax.",
  },
  {
    icon: <ShieldAlert size={32} className="text-rose-400" />,
    title: "Transparent Error Handling",
    description:
      "Identifies unverified signs or low-confidence speech input, presenting editable transcripts instead of silent failures.",
  },
];

export default function WhyUs() {
  return (
    <section className="relative bg-slate-950 py-24 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={14} /> Trust & Accessibility First
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Designed for Universal Accessibility
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Bharat Sign AI prioritizes WCAG 2.2 AA accessibility standards, ensuring that first-time users, people with disabilities, and students have a smooth experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">
          {accessibilityFeatures.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-emerald-500/40 hover:bg-slate-900 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3.5 w-fit rounded-2xl bg-slate-950 border border-slate-800 mb-6">
                  {item.icon}
                </div>

                <h3 className="text-xl font-extrabold text-white">{item.title}</h3>

                <p className="mt-3 text-slate-300 text-sm leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 size={14} /> WCAG AA Compliant
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

