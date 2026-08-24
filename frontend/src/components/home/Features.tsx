import { Mic, Camera, Languages } from "lucide-react";

const features = [
  {
    title: "Voice to Sign",
    description:
      "Convert speech from multiple Indian regional languages into Indian Sign Language using AI.",
    icon: <Mic size={40} />,
    color: "text-blue-400",
  },
  {
    title: "Sign to Text",
    description:
      "Recognize Indian Sign Language from live camera or uploaded videos and convert it into text.",
    icon: <Camera size={40} />,
    color: "text-green-400",
  },
  {
    title: "Regional Languages",
    description:
      "Supports Hindi, Bhojpuri, Tamil, Telugu, Malayalam, Bengali, Marathi and more.",
    icon: <Languages size={40} />,
    color: "text-purple-400",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="text-center">
        <p className="text-blue-400 uppercase tracking-widest">Features</p>

        <h2 className="text-4xl font-bold mt-4">Everything You Need</h2>

        <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
          An AI-powered platform that bridges communication between hearing
          people and the deaf community using real-time translation and a 3D
          avatar.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-16">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
          >
            <div className={feature.color}>{feature.icon}</div>

            <h3 className="text-2xl font-semibold mt-6">{feature.title}</h3>

            <p className="text-slate-400 mt-4 leading-7">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
