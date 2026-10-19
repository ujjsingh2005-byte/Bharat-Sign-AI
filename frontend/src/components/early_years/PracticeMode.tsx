import { useState, useMemo, useEffect } from "react";
import { EARLY_YEARS_SIGNS, type EarlyYearsSign } from "../../data/earlyYearsSignsData";
import QuizQuestion, { type QuizOption } from "./QuizQuestion";
import MovementViewer from "./MovementViewer";
import {
  BookOpen,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Eye,
  Languages,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export type PracticeActivity =
  | "word_recognition"
  | "meaning_recognition"
  | "sign_recognition"
  | "movement_review"
  | "revision_mode";

interface PracticeModeProps {
  learnedIds: Set<string>;
  onMarkLearned: (id: string, learned?: boolean) => void;
  onRecordPractice: (id: string) => void;
  onCompleteQuiz?: (score: number, total: number, mode: string) => void;
  initialActivity?: PracticeActivity;
  focusedSignId?: string;
}

interface QuestionItem {
  id: string;
  sign: EarlyYearsSign;
  title: string;
  prompt: string;
  visualImage?: string;
  visualCue?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export default function PracticeMode({
  learnedIds,
  onMarkLearned,
  onRecordPractice,
  onCompleteQuiz,
  initialActivity = "word_recognition",
  focusedSignId,
}: PracticeModeProps) {
  const [activity, setActivity] = useState<PracticeActivity>(initialActivity);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  // If focused sign passed, set initial review index to it
  useEffect(() => {
    if (focusedSignId) {
      const idx = EARLY_YEARS_SIGNS.findIndex((s) => s.id === focusedSignId);
      if (idx !== -1) setReviewIndex(idx);
    }
  }, [focusedSignId]);

  // Reset quiz when activity changes
  const handleSwitchActivity = (newActivity: PracticeActivity) => {
    setActivity(newActivity);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredCount(0);
    setIsFinished(false);
  };

  // Generate question sets based on selected activity
  const questions: QuestionItem[] = useMemo(() => {
    // 1. Revision Mode: filter only unlearned signs (fallback to all if all learned)
    let candidateSigns = EARLY_YEARS_SIGNS;
    if (activity === "revision_mode") {
      const unlearned = EARLY_YEARS_SIGNS.filter((s) => !learnedIds.has(s.id));
      candidateSigns = unlearned.length > 0 ? unlearned : EARLY_YEARS_SIGNS;
    }

    if (activity === "movement_review") {
      return [];
    }

    return candidateSigns.map((sign) => {
      // Pick 3 distractors
      const otherSigns = EARLY_YEARS_SIGNS.filter((s) => s.id !== sign.id);
      const shuffledOthers = [...otherSigns].sort(() => Math.random() - 0.5).slice(0, 3);
      const allChoices = [sign, ...shuffledOthers].sort(() => Math.random() - 0.5);

      if (activity === "word_recognition") {
        // Display illustration, choose English word
        return {
          id: sign.id,
          sign,
          title: "Activity A: Word Recognition",
          prompt: `Look closely at the sign illustration below. Which English action word does it represent?`,
          visualImage: sign.image,
          visualCue: `Handshape: ${sign.handshape?.split("/")[0] || "Standard"} • ${sign.startingPosition}`,
          options: allChoices.map((c) => ({
            id: c.id,
            label: c.word,
            sublabel: `(${c.hindi})`,
          })),
          correctOptionId: sign.id,
          explanation: `This sign is "${sign.word}" (${sign.hindi}). ${sign.meaning} Starting position: ${sign.startingPosition}.`,
        };
      }

      if (activity === "meaning_recognition") {
        // Display English word, choose Hindi meaning
        return {
          id: sign.id,
          sign,
          title: "Activity B: Meaning Recognition",
          prompt: `What is the correct Hindi meaning and action for the English sign "${sign.word.toUpperCase()}"?`,
          visualCue: `Example: "${sign.exampleSentence}"`,
          options: allChoices.map((c) => ({
            id: c.id,
            label: c.hindi,
            sublabel: `English: ${c.word}`,
          })),
          correctOptionId: sign.id,
          explanation: `The English word "${sign.word}" translates to "${sign.hindi}" in Hindi. Example sentence: "${sign.hindiSentence}".`,
        };
      }

      if (activity === "sign_recognition") {
        // Display verified movement cue, choose matching action
        return {
          id: sign.id,
          sign,
          title: "Activity C: Sign Recognition",
          prompt: `Which action matches this movement: "${sign.movementSteps[0]?.title || sign.movementDirection} — ${sign.movementSteps[0]?.description || ""}"?`,
          visualCue: `Dominant hand: ${sign.dominantHand} • Palm: ${sign.palmOrientation}`,
          options: allChoices.map((c) => ({
            id: c.id,
            label: c.word,
            sublabel: c.hindi,
          })),
          correctOptionId: sign.id,
          explanation: `The movement sequence describes the sign for "${sign.word}" (${sign.hindi}). ${sign.physicalVsLinguistic}`,
        };
      }

      // Default for Revision Mode (mix of recognition)
      return {
        id: sign.id,
        sign,
        title: "Activity E: Revision Practice",
        prompt: `Revision: Identify the sign demonstrated in the illustration below:`,
        visualImage: sign.image,
        visualCue: `${sign.category} • Steps: ${sign.movementSteps.map((s) => s.title).join(" → ")}`,
        options: allChoices.map((c) => ({
          id: c.id,
          label: c.word,
          sublabel: c.hindi,
        })),
        correctOptionId: sign.id,
        explanation: `Correct! "${sign.word}" (${sign.hindi}) is part of "${sign.category}". Review the verified steps to solidify your memory!`,
      };
    });
  }, [activity, learnedIds]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelected = (isCorrect: boolean, selectedId: string) => {
    setAnsweredCount((prev) => prev + 1);
    if (isCorrect) {
      setScore((prev) => prev + 1);
      if (currentQuestion) {
        onRecordPractice(currentQuestion.sign.id);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      if (onCompleteQuiz) {
        onCompleteQuiz(score + 1, questions.length, activity);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredCount(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Activity Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        <button
          onClick={() => handleSwitchActivity("word_recognition")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activity === "word_recognition"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>A. Word Recognition</span>
        </button>

        <button
          onClick={() => handleSwitchActivity("meaning_recognition")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activity === "meaning_recognition"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>B. Meaning Recognition</span>
        </button>

        <button
          onClick={() => handleSwitchActivity("sign_recognition")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activity === "sign_recognition"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>C. Sign Recognition</span>
        </button>

        <button
          onClick={() => handleSwitchActivity("movement_review")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activity === "movement_review"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>D. Movement Review</span>
        </button>

        <button
          onClick={() => handleSwitchActivity("revision_mode")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activity === "revision_mode"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>E. Revision Mode</span>
        </button>
      </div>

      {/* Educational Accuracy Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Educational Integrity: </strong>
            Practice assesses conceptual comprehension and movement sequence recall. Real-world manual execution should be practiced alongside qualified signers.
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE D: MOVEMENT REVIEW (INTERACTIVE FLASHCARD STEP VIEWER) */}
      {/* ============================================================== */}
      {activity === "movement_review" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h3 className="text-base font-black text-white">Movement Flashcard Review</h3>
              <p className="text-xs text-slate-400">Review step-by-step verified instructions for each sign.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReviewIndex((i) => (i - 1 + EARLY_YEARS_SIGNS.length) % EARLY_YEARS_SIGNS.length)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
              >
                Previous Sign
              </button>
              <span className="text-xs font-bold text-indigo-400">
                {reviewIndex + 1} / {EARLY_YEARS_SIGNS.length}
              </span>
              <button
                onClick={() => setReviewIndex((i) => (i + 1) % EARLY_YEARS_SIGNS.length)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
              >
                Next Sign
              </button>
            </div>
          </div>

          <MovementViewer
            sign={EARLY_YEARS_SIGNS[reviewIndex]}
            onPracticeClick={() => handleSwitchActivity("word_recognition")}
          />
        </div>
      ) : isFinished ? (
        /* ============================================================== */
        /* QUIZ SUMMARY & COMPLETION SCREEN */
        /* ============================================================== */
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md max-w-xl mx-auto animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
              Activity Completed!
            </span>
            <h3 className="text-3xl font-black text-white">
              Score: {score} / {questions.length}
            </h3>
            <p className="text-sm text-slate-300">
              {score === questions.length
                ? "Perfect score! Outstanding mastery of these early everyday action signs!"
                : score >= questions.length * 0.7
                ? "Great job! You have demonstrated strong recall of the sign movements and meanings."
                : "Good practice! Review the missed signs and try once more to reinforce memory."}
            </p>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
              <p className="text-xl font-black text-indigo-400">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Questions</span>
              <p className="text-xl font-black text-white">{questions.length}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Quiz Again</span>
            </button>

            <button
              onClick={() => handleSwitchActivity("movement_review")}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black transition-all border border-slate-700 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Review Step Viewer</span>
            </button>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* ACTIVE MULTIPLE CHOICE QUESTION */
        /* ============================================================== */
        currentQuestion && (
          <QuizQuestion
            key={currentQuestion.id + currentQuestionIndex}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            title={currentQuestion.title}
            prompt={currentQuestion.prompt}
            visualImage={currentQuestion.visualImage}
            visualCue={currentQuestion.visualCue}
            options={currentQuestion.options}
            correctOptionId={currentQuestion.correctOptionId}
            explanation={currentQuestion.explanation}
            onAnswerSelected={handleAnswerSelected}
            onNextQuestion={handleNextQuestion}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        )
      )}
    </div>
  );
}
