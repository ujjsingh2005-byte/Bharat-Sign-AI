import { Languages, Mic, Camera, Bot } from "lucide-react";

const stats = [
  {
    icon: <Languages size={40} />,
    value: "15+",
    title: "Supported Languages",
    color: "text-blue-400",
  },
  {
    icon: <Mic size={40} />,
    value: "3",
    title: "Voice Input Methods",
    color: "text-green-400",
  },
  {
    icon: <Camera size={40} />,
    value: "2",
    title: "Sign Detection Modes",
    color: "text-purple-400",
  },
  {
    icon: <Bot size={40} />,
    value: "AI",
    title: "3D Avatar Powered",
    color: "text-cyan-400",
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-blue-400">
            Project Highlights
          </span>

          <h2 className="mt-6 text-5xl font-bold">
            Bharat-Sign AI at a Glance
          </h2>

          <p className="mt-6 text-slate-400 max-w-3xl mx-auto">
            A modern AI-powered platform designed to bridge communication
            between hearing individuals and the deaf community.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-16">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center hover:border-blue-500 transition duration-300"
            >
              <div className={`flex justify-center ${item.color}`}>
                {item.icon}
              </div>

              <h3 className="mt-6 text-5xl font-bold">{item.value}</h3>

              <p className="mt-4 text-slate-400">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
