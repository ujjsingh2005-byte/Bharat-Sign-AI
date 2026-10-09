import { BookOpen, Smile, Hash, MessageSquare, Target, Award } from "lucide-react";
import FeatureCard, { type CardVariant } from "../ui/FeatureCard";

interface LearningCardItem {
  id: string;
  variant: CardVariant;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  footerText: string;
}

const learningCards: LearningCardItem[] = [
  {
    id: "everyday-words",
    variant: "emerald",
    title: "1. Everyday Vocabulary",
    description: "Learn essential daily signs for food, water, help, doctor, home, and school with 3D avatar animations.",
    icon: <BookOpen size={26} />,
    badge: "Basic Signs",
    footerText: "30+ Daily Words",
  },
  {
    id: "greetings",
    variant: "ocean",
    title: "2. Greetings & Courtesy",
    description: "Master ISL greetings including Hello, Namaste, Thank You, Goodbye, Welcome, and Please.",
    icon: <Smile size={26} />,
    badge: "Greetings",
    footerText: "15+ Expressions",
  },
  {
    id: "numbers",
    variant: "amber",
    title: "3. Numbers & Counting",
    description: "Standard Indian Sign Language single and double digit counting formations for numbers 0 through 9.",
    icon: <Hash size={26} />,
    badge: "Numbers",
    footerText: "Digits 0-9",
  },
  {
    id: "common-phrases",
    variant: "pink",
    title: "4. Common Conversations",
    description: "Interactive sign sequences for conversational phrases like 'How are you?', 'What is your name?', and 'Where is hospital?'.",
    icon: <MessageSquare size={26} />,
    badge: "Phrases",
    footerText: "25+ Key Phrases",
  },
  {
    id: "practice-sessions",
    variant: "violet",
    title: "5. Interactive Practice",
    description: "Test your recognition skills with interactive gesture playback and custom sentence drills.",
    icon: <Target size={26} />,
    badge: "Practice Drills",
    footerText: "Self-Paced Drills",
  },
  {
    id: "learning-progress",
    variant: "lime",
    title: "6. Progress Tracking",
    description: "Track mastered vocabulary, saved bookmarks, and fingerspelling speed benchmarks over time.",
    icon: <Award size={26} />,
    badge: "Progress",
    footerText: "Achievement Logs",
  },
];

export default function ISLLearningSection() {
  return (
    <section className="relative bg-[#ECFDF5] py-28 text-slate-900 border-b border-emerald-200">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-200/80 text-emerald-900 border border-emerald-300">
            Chroma Intelligence — Section 6: ISL Learning
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Vibrant ISL Learning Studio
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
            Explore 100+ verified Indian Sign Language gestures, fingerspelling alphabets, and numbers.
          </p>
        </div>

        {/* 6 Vibrant Learning Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {learningCards.map((card) => (
            <FeatureCard
              key={card.id}
              variant={card.variant}
              icon={card.icon}
              badge={card.badge}
              title={card.title}
              description={card.description}
              footerText={card.footerText}
              actionText="Start Lesson"
              onAction={() => window.location.href = "/dashboard"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
