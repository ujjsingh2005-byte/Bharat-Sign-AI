import {
  Mic,
  BrainCircuit,
  Languages,
  Hand,
  User,
  FileText,
} from "lucide-react";

const workflow = [
  {
    icon: <Mic size={36} />,
    title: "Live Voice",
    description: "Capture speech from microphone or uploaded audio.",
  },
  {
    icon: <BrainCircuit size={36} />,
    title: "AI Processing",
    description: "Speech recognition and natural language understanding.",
  },
  {
    icon: <Languages size={36} />,
    title: "Language Detection",
    description: "Automatically detects Hindi, Bhojpuri, Tamil and more.",
  },
  {
    icon: <Hand size={36} />,
    title: "ISL Translation",
    description: "Convert text into Indian Sign Language grammar.",
  },
  {
    icon: <User size={36} />,
    title: "3D Avatar",
    description: "Real-time animated avatar performs ISL signs.",
  },
  {
    icon: <FileText size={36} />,
    title: "Text Output",
    description: "Generate Hindi and English text from sign language.",
  },
];

export default function Workflow() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="text-center">
        <p className="text-blue-400 uppercase tracking-widest">Workflow</p>

        <h2 className="text-4xl font-bold mt-4">How Bharat-Sign AI Works</h2>

        <p className="text-slate-400 mt-5 max-w-3xl mx-auto">
          Our AI processes speech, understands regional languages, translates
          them into Indian Sign Language, and animates a real-time 3D avatar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {workflow.map((step, index) => (
          <div
            key={step.title}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500 transition duration-300"
          >
            <div className="text-blue-400">{step.icon}</div>

            <h3 className="text-2xl font-semibold mt-5">
              {index + 1}. {step.title}
            </h3>

            <p className="text-slate-400 mt-4">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
