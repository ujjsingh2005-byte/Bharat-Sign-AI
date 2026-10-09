import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import Demo from "../../components/home/Demo";
import AIIntelligence from "../../components/home/AIIntelligence";
import Workflow from "../../components/home/Workflow";
import ISLLearningSection from "../../components/home/ISLLearningSection";
import ResearchAnalytics from "../../components/home/ResearchAnalytics";
import WhyUs from "../../components/home/WhyUs";
import CTA from "../../components/home/CTA";
import Footer from "../../components/layout/Footer";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-indigo-600 selection:text-white">
      <Navbar />
      {/* Section 1: Hero — Cosmic Indigo */}
      <Hero />
      {/* Section 2: Feature Overview — Clean Light #F8FAFC */}
      <Features />
      {/* Section 3: Translation Workspace — Ocean Blue #EFF6FF */}
      <Demo />
      {/* Section 4: AI Intelligence — Royal Violet #F5F3FF */}
      <AIIntelligence />
      {/* Section 5: How It Works — Warm Sunset Gradient */}
      <Workflow />
      {/* Section 6: ISL Learning — Emerald Garden #ECFDF5 */}
      <ISLLearningSection />
      {/* Section 7: Research & Analytics — Graphite Luxe #111827 */}
      <ResearchAnalytics />
      {/* Section 8: Accessibility — Clean Light #F8FAFC */}
      <WhyUs />
      {/* Section 10: Final CTA — Electric Sunset Gradient */}
      <CTA />
      {/* Section 11: Footer — Graphite Luxe #0B1020 */}
      <Footer />
    </div>
  );
}

