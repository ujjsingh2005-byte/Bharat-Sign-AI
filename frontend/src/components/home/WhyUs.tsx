import {
  BrainCircuit,
  Languages,
  Hand,
  Camera,
  Mic,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: <BrainCircuit size={38} />,
    title: "AI Powered",
    description:
      "Advanced Artificial Intelligence processes speech and sign language with high accuracy.",
    color: "text-blue-400",
  },
  {
    icon: <Languages size={38} />,
    title: "Regional Languages",
    description:
      "Supports multiple Indian regional languages including Bhojpuri, Hindi, Tamil and more.",
    color: "text-green-400",
  },
  {
    icon: <Hand size={38} />,
    title: "3D ISL Avatar",
    description:
      "Natural Indian Sign Language animations generated using a realistic 3D avatar.",
    color: "text-purple-400",
  },
  {
    icon: <Mic size={38} />,
    title: "Live Voice",
    description:
      "Translate directly from live microphone, recorded audio or uploaded audio.",
    color: "text-cyan-400",
  },
  {
    icon: <Camera size={38} />,
    title: "Live Camera",
    description:
      "Recognize Indian Sign Language using webcam or uploaded videos.",
    color: "text-orange-400",
  },
  {
    icon: <ShieldCheck size={38} />,
    title: "Secure & Fast",
    description:
      "Designed for real-time communication with privacy and performance in mind.",
    color: "text-emerald-400",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-blue-400">
            Why Choose Us
          </span>

          <h2 className="mt-6 text-5xl font-bold">Why Bharat-Sign AI?</h2>

          <p className="mt-6 text-slate-400 max-w-3xl mx-auto text-lg">
            Bharat-Sign AI combines Artificial Intelligence, Computer Vision,
            Natural Language Processing and 3D Animation to make communication
            accessible for everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-20">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 hover:border-blue-500 hover:-translate-y-2 transition duration-300"
            >
              <div className={item.color}>{item.icon}</div>

              <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>

              <p className="mt-4 text-slate-400 leading-7">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
