import { Brain, Sparkles, BookMarked, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AIIntelligence() {
  return (
    <section className="relative bg-[#F5F3FF] py-28 text-slate-900 border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-purple-200/80 text-purple-900 border border-purple-300">
            Chroma Intelligence — Section 4: AI Intelligence
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Research-Driven Linguistic Engine
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Advanced NLP models and semantic disambiguation tuned specifically for Indian Sign Language grammar.
          </p>
        </div>

        {/* 3 Royal Violet AI Intelligence Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mt-16">
          {/* Card 1: Context Processing */}
          <div className="rounded-3xl border border-[#DDD6FE] bg-[#EDE9FE] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-[#C4B5FD] text-[#6D28D9] shadow-inner">
                  <Brain size={28} />
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#6D28D9]/15 text-[#6D28D9] border border-[#6D28D9]/30 uppercase tracking-wider">
                  Disambiguation
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#5B21B6] mb-3">
                1. Context Processing
              </h3>

              <p className="text-sm leading-relaxed text-[#4C1D95]">
                Disambiguates polysemous words (e.g. financial <strong>"bank"</strong> vs river <strong>"bank"</strong>) using conversational domain analysis and domain keyword triggers.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#C4B5FD] flex items-center justify-between text-xs font-bold text-[#6D28D9]">
              <span>Polysemy Disambiguated</span>
              <Link to="/dashboard" className="hover:underline flex items-center gap-1">
                Try Context <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Translation Quality */}
          <div className="rounded-3xl border border-[#F5D0FE] bg-[#FAE8FF] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-[#F0ABFC] text-[#A21CAF] shadow-inner">
                  <Sparkles size={28} />
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#A21CAF]/15 text-[#A21CAF] border border-[#A21CAF]/30 uppercase tracking-wider">
                  SOV Grammar
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#86198F] mb-3">
                2. Translation Quality & Grammar
              </h3>

              <p className="text-sm leading-relaxed text-[#701A75]">
                Reorders Subject-Verb-Object (SVO) English/Hindi speech into Subject-Object-Verb (SOV), Time, and Topic-Comment Indian Sign Language structure.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F0ABFC] flex items-center justify-between text-xs font-bold text-[#A21CAF]">
              <span>Grammar Reordered</span>
              <Link to="/dashboard" className="hover:underline flex items-center gap-1">
                View Syntax <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3: Vocabulary Assistance */}
          <div className="rounded-3xl border border-[#C7D2FE] bg-[#E0E7FF] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-[#A5B4FC] text-[#4338CA] shadow-inner">
                  <BookMarked size={28} />
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#4338CA]/15 text-[#3730A3] border border-[#4338CA]/30 uppercase tracking-wider">
                  Sign Recovery
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#3730A3] mb-3">
                3. Vocabulary Recovery & Fallback
              </h3>

              <p className="text-sm leading-relaxed text-[#312E81]">
                Provides 4 transparent recovery paths (Rephrase, Text Display, Approved Fingerspelling, Notice) when encountering unverified words.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#A5B4FC] flex items-center justify-between text-xs font-bold text-[#4338CA]">
              <span>100% Transparent</span>
              <Link to="/dashboard" className="hover:underline flex items-center gap-1">
                Test Recovery <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
