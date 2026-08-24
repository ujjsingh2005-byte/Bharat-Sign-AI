import { Languages as LanguagesIcon } from "lucide-react";

const languages = [
  "Hindi",
  "English",
  "Bhojpuri",
  "Awadhi",
  "Maithili",
  "Punjabi",
  "Gujarati",
  "Marathi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Odia",
  "Assamese",
  "Urdu",
];

export default function Languages() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-blue-400">
            <LanguagesIcon size={18} />
            Supported Languages
          </div>

          <h2 className="mt-6 text-5xl font-bold">Communicate Across India</h2>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg">
            Bharat-Sign AI understands multiple Indian regional languages and
            converts them into Indian Sign Language while also recognizing ISL
            back into English and Hindi.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {languages.map((language) => (
            <div
              key={language}
              className="rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-slate-300 hover:border-blue-500 hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer"
            >
              {language}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
