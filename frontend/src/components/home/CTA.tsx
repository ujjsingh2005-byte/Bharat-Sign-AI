import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-28 bg-slate-950">
      {/* Background Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-8 relative">
        <div className="rounded-[32px] border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-16 text-center shadow-2xl">
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-600/20 p-4">
              <Sparkles className="text-blue-400" size={40} />
            </div>
          </div>

          <h2 className="mt-8 text-5xl font-bold">
            Ready to Break
            <br />
            Communication Barriers?
          </h2>

          <p className="mt-8 text-slate-400 text-lg max-w-3xl mx-auto">
            Experience the power of Artificial Intelligence, Indian Sign
            Language and 3D Avatar technology with Bharat-Sign AI.
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <button className="flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700 transition">
              Start Translating
              <ArrowRight size={20} />
            </button>

            <button className="rounded-xl border border-slate-700 px-8 py-4 hover:bg-slate-800 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
