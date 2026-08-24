import { useState } from "react";
import axios from "axios";
import {
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  Workflow,
  CheckCircle2,
} from "lucide-react";
import type { SignItem } from "./AvatarViewer";

const API = "http://127.0.0.1:8000";

interface UniversalSemanticPanelProps {
  onSignSequence: (sequence: SignItem[]) => void;
}

export default function UniversalSemanticPanel({
  onSignSequence,
}: UniversalSemanticPanelProps) {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<any>(null);

  const LANGUAGES = [
    { code: "auto", name: "Auto Detect" },
    { code: "bho", name: "Bhojpuri (भोजपुरी)" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "en", name: "English" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
    { code: "as", name: "Assamese (অসমীয়া)" },
    { code: "ur", name: "Urdu (اردو)" },
    { code: "sa", name: "Sanskrit (संस्कृतम्)" },
  ];

  const SAMPLE_PRESETS = [
    {
      lang: "bho",
      name: "Bhojpuri",
      text: "हम स्कूल जा तानी।",
      desc: "I am going to school.",
    },
    {
      lang: "en",
      name: "English",
      text: "I am going to college tomorrow.",
      desc: "Tomorrow I will go to college.",
    },
    {
      lang: "hi",
      name: "Hindi",
      text: "मुझे पानी चाहिए।",
      desc: "I want water.",
    },
    {
      lang: "bho",
      name: "Bhojpuri",
      text: "हमके पानी चाहीं।",
      desc: "I need water.",
    },
    {
      lang: "te",
      name: "Telugu",
      text: "నాకు నీళ్లు కావాలి।",
      desc: "I need water.",
    },
    {
      lang: "hi",
      name: "Hindi",
      text: "आप कैसे हैं?",
      desc: "How are you?",
    },
    {
      lang: "en",
      name: "English",
      text: "Please help me doctor.",
      desc: "Emergency healthcare request.",
    },
  ];

  const handleProcess = async (textToProcess = inputText, lang = selectedLanguage) => {
    if (!textToProcess.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post(`${API}/translation/semantic-pipeline`, {
        text: textToProcess,
        source_language: lang,
      });

      const data = response.data;
      if (data.success) {
        setPipelineResult(data);
        if (data.signs && data.signs.length > 0) {
          onSignSequence(data.signs);
        }
      }
    } catch (e) {
      console.error("Semantic pipeline error:", e);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setInputText(preset.text);
    setSelectedLanguage(preset.lang);
    handleProcess(preset.text, preset.lang);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span>🌐</span>
            <span>Universal Semantic Layer</span>
          </h2>
          <span className="bg-purple-600/20 text-purple-300 text-xs px-3 py-1.5 rounded-full border border-purple-500/30 font-semibold">
            14+ Indian Languages → ISL
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Transform any regional Indian language into Universal Semantic Representation & grammatically accurate ISL avatar animations.
        </p>
      </div>

      {/* Preset Quick Buttons */}
      <div>
        <span className="text-xs text-slate-400 font-semibold">Try Master Examples:</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span className="text-purple-400 font-bold">{preset.name}:</span>
              <span>"{preset.text}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box & Language Select */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleProcess()}
              placeholder="Type in Bhojpuri, Hindi, English, Tamil, Telugu, etc..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-10"
            />
          </div>

          <button
            onClick={() => handleProcess()}
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Analyze & Sign</span>
                <Send size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Semantic Pipeline Step-by-Step Visualization */}
      {pipelineResult && (
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Workflow size={15} className="text-blue-400" />
            <span>UNIVERSAL SEMANTIC PIPELINE EXECUTION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1: Raw Input */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                1. Input ({pipelineResult.source_language})
              </span>
              <p className="mt-1 text-sm font-semibold text-white truncate">
                {pipelineResult.original_text}
              </p>
            </div>

            {/* Step 2: Meaning Extraction */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                2. Semantic English
              </span>
              <p className="mt-1 text-sm font-semibold text-blue-300 truncate">
                {pipelineResult.english_translation}
              </p>
            </div>

            {/* Step 3: Grammar Rule */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                3. ISL Syntax Rule
              </span>
              <p className="mt-1 text-xs font-semibold text-green-300 truncate">
                {pipelineResult.rule_applied}
              </p>
            </div>

            {/* Step 4: ISL Gloss */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-purple-500/40 shadow-sm shadow-purple-500/10">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} />
                4. ISL Gloss Tokens
              </span>
              <p className="mt-1 text-sm font-extrabold text-purple-300 truncate">
                {pipelineResult.gloss_text}
              </p>
            </div>
          </div>

          {/* Detailed Semantic Breakdown Table */}
          {pipelineResult.semantics && (
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
              <span className="font-semibold text-slate-400 mb-2 block">
                Intermediate Semantic Decomposition:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">TIME:</span>
                  <span className="font-bold text-white">
                    {pipelineResult.semantics.time || "—"}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SUBJECT:</span>
                  <span className="font-bold text-white">
                    {pipelineResult.semantics.subject || "—"}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">OBJECT:</span>
                  <span className="font-bold text-white">
                    {pipelineResult.semantics.object || "—"}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">ACTION / VERB:</span>
                  <span className="font-bold text-white">
                    {pipelineResult.semantics.verb || "—"}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">QUESTION / NEG:</span>
                  <span className="font-bold text-white">
                    {pipelineResult.semantics.question ||
                      (pipelineResult.semantics.negation ? "YES (NO)" : "—")}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5 text-green-400 font-medium">
                  <CheckCircle2 size={14} />
                  Sequence dispatched to 3D Avatar Engine
                </span>
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  {pipelineResult.signs?.length || 0} Gesture Animations Generated
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
