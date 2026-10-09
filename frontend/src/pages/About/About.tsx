import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Crown, Heart, ShieldCheck, Cpu, Globe2, BookOpen } from "lucide-react";
import FeatureCard from "../../components/ui/FeatureCard";

export default function About() {
  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#090D1F] py-24 text-center border-b border-indigo-900/40">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto px-6 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/40 px-4 py-1.5 text-xs font-bold text-indigo-300">
            <Crown size={15} className="text-cyan-300" /> About Bharat Sign AI
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connecting Languages. Empowering Communication.
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Bharat Sign AI is an AI-powered Indian Sign Language (ISL) communication platform designed to bridge speech, 14+ regional languages, and 3D avatar gestures.
          </p>
        </div>
      </section>

      {/* Core Values & Pillars Section */}
      <section className="bg-[#F8FAFC] py-24 text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-indigo-100 text-indigo-800 px-3.5 py-1 rounded-full border border-indigo-200">
              Our Core Pillars
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Driven by 5 Product Qualities
            </h2>
            <p className="text-slate-600 text-sm">
              Innovation, Inclusivity, Trust, Intelligence, and Simplicity in every interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              variant="indigo"
              icon={<Cpu size={26} />}
              badge="Innovation"
              title="1. Research Innovation"
              description="Built on paper-aligned NLP speech normalization, context disambiguation, and ISL Subject-Object-Verb syntax reordering."
            />
            <FeatureCard
              variant="emerald"
              icon={<Heart size={26} />}
              badge="Inclusivity"
              title="2. Universal Inclusivity"
              description="Bridging hearing and deaf communities with accessible 3D avatar rendering, fingerspelling fallbacks, and captions."
            />
            <FeatureCard
              variant="ocean"
              icon={<ShieldCheck size={26} />}
              badge="Trust"
              title="3. Trust & Transparency"
              description="Displays transparent confidence scores and highlights low-confidence speech with editable transcript alerts."
            />
          </div>
        </div>
      </section>

      {/* Regional Language Mission */}
      <section className="bg-[#111827] py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-3.5 py-1 rounded-full">
              Regional Accessibility
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Supporting 14+ Indian Languages & Dialects
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              From Hindi and Bhojpuri to Tamil, Telugu, Bengali, Marathi, and Gujarati — our universal semantic pipeline translates speech from across India into standardized Indian Sign Language.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Globe2 size={16} /> 14 Dialects
              </span>
              <span className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <BookOpen size={16} /> 100+ Validated Gestures
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-indigo-300">Technical Specifications</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Frontend Framework</span>
                <strong className="text-white">Vite + React 18 + TypeScript</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Styling & Design</span>
                <strong className="text-white">Tailwind CSS + 7 Color Palettes</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span>3D Avatar Engine</span>
                <strong className="text-white">Three.js + React Three Fiber (Mixamo)</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Computer Vision</span>
                <strong className="text-white">MediaPipe Hand Landmark Tracking</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Backend API</span>
                <strong className="text-white">FastAPI + Python NLP Engine</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
