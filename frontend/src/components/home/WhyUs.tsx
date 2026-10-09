import { Keyboard, Type, SunMoon, Eye, CheckCircle2 } from "lucide-react";

const accessibilityFeatures = [
  {
    icon: <SunMoon size={28} className="text-white" />,
    title: "1. High Contrast & 7 Color Themes",
    description:
      "Includes an optional High-Contrast accessibility theme with pitch-black backgrounds, high-visibility white text, and yellow focus rings.",
    cardBg: "bg-[#111827]",
    border: "border-slate-800",
    iconBg: "bg-slate-800",
    titleColor: "text-white",
    textColor: "text-slate-300",
    badgeText: "High Contrast Theme",
  },
  {
    icon: <Type size={28} className="text-[#0284C7]" />,
    title: "2. Scalable Text & Subtitle Controls",
    description:
      "Simultaneous sign gloss breakdowns and customizable caption sizes ensure both hearing and deaf users can read along comfortably.",
    cardBg: "bg-[#E0F2FE]",
    border: "border-[#BAE6FD]",
    iconBg: "bg-[#BAE6FD]",
    titleColor: "text-[#0369A1]",
    textColor: "text-[#334155]",
    badgeText: "Text Controls",
  },
  {
    icon: <Keyboard size={28} className="text-[#15803D]" />,
    title: "3. Full Keyboard Focus Navigation",
    description:
      "100% accessible via Tab, Shift+Tab, and Enter keys with WCAG 2.2 AA compliant focus rings around every button, tab, and input.",
    cardBg: "bg-[#DCFCE7]",
    border: "border-[#BBF7D0]",
    iconBg: "bg-[#BBF7D0]",
    titleColor: "text-[#166534]",
    textColor: "text-[#334155]",
    badgeText: "Keyboard Accessible",
  },
  {
    icon: <Eye size={28} className="text-[#7E22CE]" />,
    title: "4. Motion Preferences & Speed Controls",
    description:
      "Supports OS `prefers-reduced-motion` settings and variable 3D avatar playback speeds (0.5x, 0.75x, 1x, 1.5x, 2x) for comfortable learning.",
    cardBg: "bg-[#F3E8FF]",
    border: "border-[#E9D5FF]",
    iconBg: "bg-[#E9D5FF]",
    titleColor: "text-[#6B21A8]",
    textColor: "text-[#475569]",
    badgeText: "Motion Preferences",
  },
];

export default function WhyUs() {
  return (
    <section className="relative bg-[#F8FAFC] py-28 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={14} /> Chroma Intelligence — Section 8: Accessibility
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Universal Accessibility Standards
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
            Designed for WCAG 2.2 AA compliance, ensuring first-time users, people with disabilities, and students have an optimal experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {accessibilityFeatures.map((item) => (
            <div
              key={item.title}
              className={`rounded-3xl border ${item.cardBg} ${item.border} p-8 shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3.5 rounded-2xl ${item.iconBg} shadow-inner`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${item.titleColor}`}>
                    {item.badgeText}
                  </span>
                </div>

                <h3 className={`text-2xl font-extrabold tracking-wide mb-3 ${item.titleColor}`}>
                  {item.title}
                </h3>

                <p className={`text-sm leading-relaxed font-medium ${item.textColor}`}>
                  {item.description}
                </p>
              </div>

              <div className={`mt-8 pt-4 border-t ${item.border} flex items-center justify-between text-xs font-bold ${item.titleColor}`}>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Verified Standard
                </span>
                <span>WCAG 2.2 AA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


