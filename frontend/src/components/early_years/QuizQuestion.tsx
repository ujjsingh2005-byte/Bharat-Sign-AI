import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Sparkles } from "lucide-react";

export interface QuizOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  title: string;
  prompt: string;
  visualImage?: string;
  visualCue?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  onAnswerSelected: (isCorrect: boolean, selectedId: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export default function QuizQuestion({
  questionNumber,
  totalQuestions,
  title,
  prompt,
  visualImage,
  visualCue,
  options,
  correctOptionId,
  explanation,
  onAnswerSelected,
  onNextQuestion,
  isLastQuestion,
}: QuizQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleSelect = (id: string) => {
    if (hasSubmitted) return;
    setSelectedId(id);
    setHasSubmitted(true);
    const isCorrect = id === correctOptionId;
    onAnswerSelected(isCorrect, id);
  };

  const isSelectedCorrect = selectedId === correctOptionId;

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md max-w-2xl mx-auto">
      {/* Question Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {title}
          </span>
          <span className="font-bold text-slate-400">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-2 text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
          {prompt}
        </h3>
      </div>

      {/* Visual Cue or Illustration if Provided */}
      {visualImage && (
        <div className="flex justify-center my-2">
          <div className="relative w-48 h-48 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 p-3 flex items-center justify-center shadow-inner">
            <img
              src={visualImage}
              alt="Quiz visual question reference"
              className="max-h-full max-w-full object-contain filter drop-shadow-md"
            />
          </div>
        </div>
      )}

      {visualCue && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
          <strong className="text-indigo-300">Movement Clue: </strong>
          {visualCue}
        </div>
      )}

      {/* Multiple Choice Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {options.map((option, idx) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.id === correctOptionId;

          let btnClass = "bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200 hover:border-slate-700";

          if (hasSubmitted) {
            if (isCorrect) {
              btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20";
            } else if (isSelected && !isCorrect) {
              btnClass = "bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/20";
            } else {
              btnClass = "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-50";
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={hasSubmitted}
              className={`flex items-center justify-between p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-black flex items-center justify-center">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div>
                  <div className="text-base font-extrabold">{option.label}</div>
                  {option.sublabel && (
                    <div className="text-xs opacity-75 font-normal">{option.sublabel}</div>
                  )}
                </div>
              </div>

              {hasSubmitted && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {hasSubmitted && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box After Answering */}
      {hasSubmitted && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-fadeIn ${
            isSelectedCorrect
              ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-200"
              : "bg-rose-950/30 border-rose-900/50 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {isSelectedCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Well done! That is correct.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span className="text-rose-300">Incorrect choice.</span>
              </>
            )}
          </div>
          <p>{explanation}</p>
        </div>
      )}

      {/* Next Question Button */}
      {hasSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onNextQuestion}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>{isLastQuestion ? "View Final Results" : "Next Question"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
