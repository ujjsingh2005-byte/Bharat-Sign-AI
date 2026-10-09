import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import VoicePanel from "../../components/dashboard/VoicePanel";
import AvatarViewer, { type SignItem } from "../../components/dashboard/AvatarViewer";
import { useState } from "react";

export default function VoiceToSign() {
  const [activeSignSequence, setActiveSignSequence] = useState<SignItem[]>([]);

  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
            Voice → Sign Workspace Mode
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Speech & Audio to 3D ISL Translation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Microphone speech recognition with confidence scoring, transcript editing, and 3D avatar rendering.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-7">
            <VoicePanel onSignSequence={setActiveSignSequence} />
          </div>
          <div className="xl:col-span-5 sticky top-28">
            <AvatarViewer sequence={activeSignSequence} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
