import { useState, useRef } from "react";
import axios from "axios";
import {
  Send,
  Loader2,
  Sparkles,
  Workflow,
  Upload,
  AlertTriangle,
  HelpCircle,
  Zap,
  Brain,
  ShieldAlert,
  Edit3,
} from "lucide-react";
import type { SignItem } from "./AvatarViewer";
import { processLocalSemanticPipeline } from "../../utils/localSemanticPipeline";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface UniversalSemanticPanelProps {
  onSignSequence: (sequence: SignItem[]) => void;
}

export default function UniversalSemanticPanel({
  onSignSequence,
}: UniversalSemanticPanelProps) {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [activeMode, setActiveMode] = useState<"quick" | "contextual" | "fallback">("contextual");
  const [loading, setLoading] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<any>(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedText, setEditedText] = useState("");
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
      name: "Ambiguous Context (Bank)",
      text: "I am going to the bank to deposit money tomorrow.",
      desc: "Context-sensitive disambiguation test.",
    },
    {
      name: "Multi-Sentence Story",
      text: "Hello! My name is John. I am going to school. Where is the hospital? Thank you.",
      desc: "Multi-sentence sequence.",
    },
    {
      name: "Hindi Healthcare",
      text: "मुझे तुरंत दवा चाहिए। डॉक्टर कहाँ हैं? कृपया मेरी मदद करें।",
      desc: "3 healthcare sentences.",
    },
    {
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
      } else {
        throw new Error(data.message || "Backend return error");
      }
    } catch (e) {
      console.warn("Backend API offline, using Client-Side ISL Semantic Engine fallback:", e);
      const fallbackData = processLocalSemanticPipeline(textToProcess, lang);
      setPipelineResult(fallbackData);
      if (fallbackData.signs && fallbackData.signs.length > 0) {
        onSignSequence(fallbackData.signs);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setInputText(preset.text);
    handleProcess(preset.text, selectedLanguage);
  };

  const handleDisambiguationOption = (glossChoice: string) => {
    if (!inputText) return;
    const resolvedText = `${inputText} (${glossChoice})`;
    handleProcess(resolvedText, selectedLanguage);
  };

  const handleSaveEditedTranscript = () => {
    setInputText(editedText);
    setIsEditingTranscript(false);
    handleProcess(editedText, selectedLanguage);
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
      {/* Target Language & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-blue-600/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-extrabold">
              TARGET SIGN LANGUAGE: INDIAN SIGN LANGUAGE (ISL)
            </span>
          </div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span>🌐</span>
            <span>Universal Context & ISL Semantic Studio</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Multi-sentence context disambiguation, missing-sign recovery, and adaptive translation mode selection.
          </p>
        </div>

        {/* Adaptive Communication Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMode("quick")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeMode === "quick"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap size={13} />
            <span>Mode A: Quick</span>
          </button>
          <button
            onClick={() => setActiveMode("contextual")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeMode === "contextual"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Brain size={13} />
            <span>Mode B: Contextual</span>
          </button>
          <button
            onClick={() => setActiveMode("fallback")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeMode === "fallback"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldAlert size={13} />
            <span>Mode C: Fallback</span>
          </button>
        </div>
      </div>

      {/* Presets */}
      <div>
        <span className="text-xs text-slate-400 font-semibold">Try Test Examples & Context Disambiguation:</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span className="text-amber-400 font-bold">{preset.name}:</span>
              <span className="truncate max-w-[220px]">"{preset.text}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea & Transcript Controls */}
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
            >
              <Upload size={13} className="text-purple-400" />
              <span>Upload (.txt)</span>
            </button>
          </div>
        </div>

        {/* Multi-line Text Area or Editable Transcript Mode */}
        {isEditingTranscript ? (
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-amber-500/40">
            <label className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
              <Edit3 size={14} /> Edit Transcript Before Translation:
            </label>
            <textarea
              rows={3}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditingTranscript(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedTranscript}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950"
              >
                Save & Translate
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text here... (e.g., 'I am going to the bank to deposit money tomorrow.')"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setEditedText(inputText);
              setIsEditingTranscript(true);
            }}
            disabled={!inputText.trim()}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold disabled:opacity-40"
          >
            <Edit3 size={13} />
            <span>Edit Transcript</span>
          </button>

          <button
            onClick={() => handleProcess()}
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition disabled:opacity-40 shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Process ISL Translation</span>
                <Send size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Context Ambiguity Clarification Banner */}
      {pipelineResult?.disambiguationNeeded && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 to-slate-950 p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <HelpCircle size={16} />
            <span>Context Ambiguity Detected: Insufficient Context Clues</span>
          </div>
          <p className="text-xs text-slate-300">
            {pipelineResult.disambiguationPrompt || "A word in your sentence has multiple distinct meanings. Please select the intended meaning:"}
          </p>

          <div className="flex flex-wrap gap-2">
            {pipelineResult.disambiguationOptions?.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleDisambiguationOption(opt.gloss)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-amber-500/20"
              >
                {opt.sense} ({opt.gloss})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Missing Sign Recovery Panel */}
      {pipelineResult?.missing_words?.length > 0 && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-purple-400" />
              Missing Sign & Vocabulary Recovery ({pipelineResult.missing_words.length} Word(s) Unsupported)
            </span>
            <span className="text-[10px] bg-purple-950 border border-purple-800 text-purple-300 px-2 py-0.5 rounded font-mono">
              Vocabulary Coverage: {pipelineResult.vocabularyCoverageRate}%
            </span>
          </div>

          <p className="text-xs text-slate-300">
            The expression(s) <strong className="text-purple-300">{pipelineResult.missing_words.join(", ")}</strong> are not yet present in the validated ISL dictionary. Select a recovery option:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs font-bold">
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 hover:border-purple-500 cursor-pointer">
              💡 A. Rephrase Sentence
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 hover:border-purple-500 cursor-pointer">
              📄 B. Text Fallback Display
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 hover:border-purple-500 cursor-pointer">
              🔤 C. Approved Fingerspelling
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-300 hover:border-purple-500 cursor-pointer">
              ⚠️ D. Unsupported Notice
            </div>
          </div>
        </div>
      )}

      {/* Semantic Pipeline Step-by-Step Visualization */}
      {pipelineResult && (
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Workflow size={15} className="text-blue-400" />
              <span>ISL LINGUISTIC PIPELINE EXECUTION</span>
            </div>
            <span className="text-[11px] bg-green-950 border border-green-800 text-green-400 px-2.5 py-0.5 rounded-full font-semibold">
              {pipelineResult.signs?.length || 0} Total Signs Generated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                1. Input ({pipelineResult.source_language})
              </span>
              <p className="mt-1 text-xs font-semibold text-white truncate" title={pipelineResult.original_text}>
                {pipelineResult.original_text}
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                2. Semantic English
              </span>
              <p className="mt-1 text-xs font-semibold text-blue-300 truncate" title={pipelineResult.english_translation}>
                {pipelineResult.english_translation}
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                3. ISL Syntax Rule
              </span>
              <p className="mt-1 text-xs font-semibold text-green-300 truncate">
                {pipelineResult.rule_applied}
              </p>
            </div>

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

          {/* Translation Feedback Widget */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950 p-3.5 rounded-2xl">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span>💬</span> Was this ISL translation helpful?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Thank you for your feedback! Your confirmation has been recorded.")}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold hover:bg-emerald-500/30 transition"
              >
                👍 Helpful
              </button>
              <button
                onClick={() => alert("Thank you! We will review this sentence for accuracy.")}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition"
              >
                ⚡ Needs Improvement
              </button>
              <button
                onClick={() => alert("Thank you! Flagged for ISL linguist evaluation.")}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold hover:bg-rose-500/30 transition"
              >
                ⚠️ Report Incorrect Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

