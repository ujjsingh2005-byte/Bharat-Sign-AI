import { Mic, Camera, Upload, Radio, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Demo() {
  return (
    <section className="relative bg-[#EFF6FF] py-28 text-slate-900 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-blue-200/80 text-blue-900 border border-blue-300">
            Chroma Intelligence — Section 3: Translation Workspace
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Try Bharat Sign AI Translation Workspace
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Experience bidirectional translation connecting speech, regional languages, and camera gestures.
          </p>
        </div>

        {/* Workspace Cards */}
        <div className="grid lg:grid-cols-2 gap-10 mt-16">
          {/* Card 1: Voice -> Sign */}
          <div className="rounded-3xl border border-[#BFDBFE] bg-white p-8 shadow-xl hover:shadow-2xl hover:border-blue-400 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-blue-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="bg-[#E0F2FE] p-4 rounded-2xl border border-[#BAE6FD]">
                  <Mic className="text-[#0284C7]" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0369A1]">Voice → Sign Workspace</h3>
                  <p className="text-xs text-slate-500 font-semibold">Speech & Audio to 3D ISL Avatar</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] flex items-center gap-1">
                <CheckCircle2 size={12} /> Live Engine Active
              </span>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-between rounded-2xl border border-blue-200 bg-[#F0F9FF] px-5 py-4 text-sm font-bold text-[#0369A1] hover:bg-[#E0F2FE] transition"
              >
                <div className="flex items-center gap-3">
                  <Radio size={18} className="text-[#0284C7] animate-pulse" />
                  <span>Start Live Microphone Capture</span>
                </div>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Mic size={18} className="text-slate-500" />
                  <span>Interactive Transcript Editor</span>
                </div>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Upload size={18} className="text-slate-500" />
                  <span>Upload Audio File (.wav/.mp3)</span>
                </div>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Status Indicator Badges */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
              <span className="text-slate-500">Confidence Score: <strong className="text-[#0284C7]">98.4%</strong></span>
              <span className="text-amber-700 font-medium bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 text-[11px]">
                <AlertTriangle size={11} /> Context Disambiguation Ready
              </span>
            </div>
          </div>

          {/* Card 2: Sign -> Text */}
          <div className="rounded-3xl border border-[#E9D5FF] bg-white p-8 shadow-xl hover:shadow-2xl hover:border-purple-400 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-purple-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="bg-[#F3E8FF] p-4 rounded-2xl border border-[#E9D5FF]">
                  <Camera className="text-[#7E22CE]" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#6B21A8]">Sign → Text Workspace</h3>
                  <p className="text-xs text-slate-500 font-semibold">MediaPipe Hand Landmark Vision</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">
                Webcam Vision
              </span>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-between rounded-2xl border border-purple-200 bg-[#FAF5FF] px-5 py-4 text-sm font-bold text-[#6B21A8] hover:bg-[#F3E8FF] transition"
              >
                <div className="flex items-center gap-3">
                  <Camera size={18} className="text-[#7E22CE]" />
                  <span>Start Live Webcam Sign Recognition</span>
                </div>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Upload size={18} className="text-slate-500" />
                  <span>Upload Sign Video File (.mp4)</span>
                </div>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Visual Specs */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Tracking 21 Keypoints per Hand</span>
              <span className="text-[#7E22CE] font-bold">14+ Regional Outputs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

