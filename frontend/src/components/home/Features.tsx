import { Mic, Zap, BookOpen, ShieldCheck, HeartHandshake, History } from "lucide-react";
import FeatureCard, { type CardVariant } from "../ui/FeatureCard";

interface FeatureItem {
  id: string;
  variant: CardVariant;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  footerText: string;
}

const features: FeatureItem[] = [
  {
    id: "speech-to-isl",
    variant: "ocean",
    title: "1. Speech-to-ISL Translation",
    description:
      "Convert live spoken voice and audio files in 14+ Indian regional languages into accurate Indian Sign Language glosses and 3D avatar animations.",
    icon: <Mic size={26} />,
    badge: "Speech Engine",
    footerText: "14+ Languages",
  },
  {
    id: "ai-processing",
    variant: "violet",
    title: "2. AI-Powered Processing",
    description:
      "NLP context engine resolves polysemous homonyms (e.g. financial bank vs river bank) and reorders grammar into ISL SOV syntax structure.",
    icon: <Zap size={26} />,
    badge: "AI Core",
    footerText: "SOV Syntax Engine",
  },
  {
    id: "learning-experience",
    variant: "emerald",
    title: "3. ISL Learning Studio",
    description:
      "Interactive dictionary and self-paced learning lessons covering greetings, everyday phrases, numbers 0-9, and fingerspelling A-Z.",
    icon: <BookOpen size={26} />,
    badge: "Learning Studio",
    footerText: "100+ Validated Gestures",
  },
  {
    id: "accessibility-tools",
    variant: "sunset",
    title: "4. Universal Accessibility Tools",
    description:
      "Designed for WCAG 2.2 AA standards with full keyboard focus navigation, high-contrast themes, variable avatar speed controls, and captions.",
    icon: <ShieldCheck size={26} />,
    badge: "WCAG 2.2 AA",
    footerText: "High Contrast Ready",
  },
  {
    id: "translation-feedback",
    variant: "pink",
    title: "5. Interactive Feedback Widget",
    description:
      "Confirm helpful translations, suggest rephrasing, or report unverified signs to continuously refine the ISL linguistic database.",
    icon: <HeartHandshake size={26} />,
    badge: "User Feedback",
    footerText: "Continuous Learning",
  },
  {
    id: "translation-history",
    variant: "amber",
    title: "6. Translation History & Export",
    description:
      "Log past speech-to-sign conversions, review gloss breakdowns, export transcript reports, and organize saved learning bookmarks.",
    icon: <History size={26} />,
    badge: "History & Logs",
    footerText: "Export & Save",
  },
];

export default function Features() {
  return (
    <section className="relative bg-[#F8FAFC] py-28 text-slate-900 border-b border-slate-200">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-indigo-100 text-indigo-700 border border-indigo-200">
            Chroma Intelligence — Feature Overview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Platform Capabilities
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Every feature card is tailored with its own color identity to provide a rich, clear visual hierarchy.
          </p>
        </div>

        {/* 6 Distinct Color Identity Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((item) => (
            <FeatureCard
              key={item.id}
              variant={item.variant}
              icon={item.icon}
              badge={item.badge}
              title={item.title}
              description={item.description}
              footerText={item.footerText}
              actionText="Open Feature"
              onAction={() => window.location.href = "/dashboard"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


