import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is Bharat-Sign AI?",
    answer:
      "Bharat-Sign AI is an AI-powered platform that translates voice into Indian Sign Language and Indian Sign Language back into Hindi and English using a 3D avatar and computer vision.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "The platform is designed to support Hindi, English, Bhojpuri, Tamil, Telugu, Malayalam, Bengali, Marathi, Gujarati, Punjabi and more.",
  },
  {
    question: "Can I use a live microphone?",
    answer:
      "Yes. You can translate using a live microphone, record audio, or upload an audio file.",
  },
  {
    question: "Can I upload sign language videos?",
    answer:
      "Yes. Bharat-Sign AI supports both live camera input and uploaded videos for sign language recognition.",
  },
  {
    question: "Is Bharat-Sign AI free to use?",
    answer:
      "The academic version is free for demonstration purposes. Future versions may include premium features.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-blue-400">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-5xl font-bold">Have Questions?</h2>

          <p className="mt-6 text-slate-400">
            Everything you need to know about Bharat-Sign AI.
          </p>
        </div>

        <div className="mt-16 space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>

                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-slate-400 leading-7">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
