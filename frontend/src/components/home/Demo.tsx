import { Mic, Camera, Upload, Radio, ArrowRight } from "lucide-react";

export default function Demo() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-sm text-blue-400">
            Live AI Demonstration
          </span>

          <h2 className="mt-6 text-5xl font-bold">Try Bharat-Sign AI</h2>

          <p className="mt-6 text-slate-400 max-w-3xl mx-auto">
            Experience two-way communication powered by Artificial Intelligence.
            Convert speech into Indian Sign Language and recognize sign language
            back into text.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mt-20">
          {/* Voice to Sign */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 hover:border-blue-500 transition">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 p-4 rounded-2xl">
                <Mic className="text-blue-400" size={34} />
              </div>

              <div>
                <h3 className="text-3xl font-bold">Voice → Sign</h3>

                <p className="text-slate-400">
                  Speech into Indian Sign Language
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button className="w-full flex items-center justify-between rounded-xl border border-slate-700 px-5 py-4 hover:border-blue-500 transition">
                <div className="flex items-center gap-3">
                  <Radio />
                  Start Live Microphone
                </div>

                <ArrowRight />
              </button>

              <button className="w-full flex items-center justify-between rounded-xl border border-slate-700 px-5 py-4 hover:border-blue-500 transition">
                <div className="flex items-center gap-3">
                  <Mic />
                  Record Audio
                </div>

                <ArrowRight />
              </button>

              <button className="w-full flex items-center justify-between rounded-xl border border-slate-700 px-5 py-4 hover:border-blue-500 transition">
                <div className="flex items-center gap-3">
                  <Upload />
                  Upload Audio
                </div>

                <ArrowRight />
              </button>
            </div>
          </div>

          {/* Sign to Text */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 hover:border-purple-500 transition">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600/20 p-4 rounded-2xl">
                <Camera className="text-purple-400" size={34} />
              </div>

              <div>
                <h3 className="text-3xl font-bold">Sign → Text</h3>

                <p className="text-slate-400">Indian Sign Language into Text</p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button className="w-full flex items-center justify-between rounded-xl border border-slate-700 px-5 py-4 hover:border-purple-500 transition">
                <div className="flex items-center gap-3">
                  <Camera />
                  Start Live Camera
                </div>

                <ArrowRight />
              </button>

              <button className="w-full flex items-center justify-between rounded-xl border border-slate-700 px-5 py-4 hover:border-purple-500 transition">
                <div className="flex items-center gap-3">
                  <Upload />
                  Upload Video
                </div>

                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
