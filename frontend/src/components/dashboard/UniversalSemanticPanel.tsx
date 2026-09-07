import { useState, useRef } from "react";
import axios from "axios";
import {
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  Workflow,
  CheckCircle2,
  FileText,
  Upload,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      category: "Multi-Sentence",
      lang: "en",
      name: "Multi-Sentence Story",
      text: "Hello! My name is John. I am going to school. Where is the hospital? Thank you.",
      desc: "4 uploaded sentences sequence.",
    },
    {
      category: "Medical",
      lang: "hi",
      name: "Hindi Healthcare",
      text: "मुझे तुरंत दवा चाहिए। डॉक्टर कहाँ हैं? कृपया मेरी मदद करें।",
      desc: "3 healthcare sentences.",
    },
    {
      category: "Travel",
      lang: "auto",
      name: "Hinglish Travel",
      text: "bus stop kahan hai? ticket kahan milega? hum kal delhi ja rahe hain.",
      desc: "Multi-sentence travel query.",
    },
    {
      category: "Needs",
      lang: "bho",
      name: "Bhojpuri Request",
      text: "हमरा पानी चाहीं। हमका खाना चाहीं। हम स्कूल जा तानी।",
      desc: "3 regional sentences.",
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        handleProcess(content, selectedLanguage);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span>🌐</span>
            <span>Universal Semantic Layer</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-purple-600/20 text-purple-300 text-xs px-3 py-1.5 rounded-full border border-purple-500/30 font-semibold">
              Multi-Sentence & File Upload Engine
            </span>
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Upload or type multiple sentences across 14+ Indian languages. Each sentence is parsed into grammatically ordered ISL signs for seamless 3D avatar execution.
        </p>
      </div>

      {/* Presets */}
      <div>
        <span className="text-xs text-slate-400 font-semibold">Try Multi-Sentence Examples:</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span className="text-purple-400 font-bold">{preset.name}:</span>
              <span className="truncate max-w-[220px]">"{preset.text}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea & File Upload Controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt,.json,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              title="Upload text file with multiple sentences"
            >
              <Upload size={13} className="text-purple-400" />
              <span>Upload Sentences File (.txt)</span>
            </button>
          </div>
        </div>

        {/* Multi-line Text Area */}
        <div className="relative">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste multiple sentences here... (e.g. 'Hello. My name is John. I live in Delhi. Where is the hospital?')"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <FileText size={12} />
            {inputText.trim() ? `${inputText.trim().split(/[.!?\n]+/).filter(Boolean).length} sentence(s) entered` : "Enter single or multiple sentences"}
          </span>

          <button
            onClick={() => handleProcess()}
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Analyze & Translate All Sentences</span>
                <Send size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Semantic Pipeline Step-by-Step Visualization */}
      {pipelineResult && (
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Workflow size={15} className="text-blue-400" />
              <span>UNIVERSAL SEMANTIC PIPELINE EXECUTION</span>
            </div>
            <span className="text-[11px] bg-green-950 border border-green-800 text-green-400 px-2.5 py-0.5 rounded-full font-semibold">
              {pipelineResult.signs?.length || 0} Total Signs Generated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1: Raw Input */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                1. Input ({pipelineResult.source_language})
              </span>
              <p className="mt-1 text-xs font-semibold text-white truncate" title={pipelineResult.original_text}>
                {pipelineResult.original_text}
              </p>
            </div>

            {/* Step 2: Meaning Extraction */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                2. Semantic English
              </span>
              <p className="mt-1 text-xs font-semibold text-blue-300 truncate" title={pipelineResult.english_translation}>
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
                4. ISL Gloss Sequence
              </span>
              <p className="mt-1 text-xs font-extrabold text-purple-300 truncate" title={pipelineResult.gloss_text}>
                {pipelineResult.gloss_text}
              </p>
            </div>
          </div>

          {/* Detailed Sentence-by-Sentence Breakdown if available */}
          {pipelineResult.semantics?.sentences_breakdown?.length > 1 && (
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Multi-Sentence Grammar Breakdown ({pipelineResult.semantics.sentences_breakdown.length} Sentences):
              </span>
              <div className="space-y-2">
                {pipelineResult.semantics.sentences_breakdown.map((sb: any, i: number) => (
                  <div key={i} className="flex flex-wrap items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">
                      S{i + 1}: "{sb.raw}"
                    </span>
                    <span className="font-mono text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                      ISL Gloss: {sb.gloss_text || sb.isl_gloss?.join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5 text-green-400 font-medium text-xs">
              <CheckCircle2 size={14} />
              Full multi-sentence sequence sent to 3D Avatar Engine
            </span>
            <span className="text-xs text-blue-400 flex items-center gap-1 font-semibold">
              Playing {pipelineResult.signs?.length || 0} Signs on Avatar
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
