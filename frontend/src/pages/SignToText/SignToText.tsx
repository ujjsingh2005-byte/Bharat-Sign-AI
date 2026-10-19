import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CameraSignPanel from "../../components/dashboard/CameraSignPanel";

export default function SignToText() {
  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
            Sign → Text Computer Vision Mode
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Camera Sign Recognition Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time hand landmark tracking powered by MediaPipe computer vision.
          </p>
        </div>

        <CameraSignPanel />
      </main>

      <Footer />
    </div>
  );
}
