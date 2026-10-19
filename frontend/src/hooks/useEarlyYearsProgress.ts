import { useState, useEffect, useCallback } from "react";
import { EARLY_YEARS_SIGNS, type EarlyYearsSign } from "../data/earlyYearsSignsData";

const STORAGE_KEY_LEARNED = "bharat_sign_early_years_learned";
const STORAGE_KEY_RECENT = "bharat_sign_early_years_recent";
const STORAGE_KEY_QUIZ = "bharat_sign_early_years_quiz_stats";

export interface QuizStatRecord {
  date: string;
  score: number;
  total: number;
  percentage: number;
  mode: string;
}

export function useEarlyYearsProgress() {
  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEARNED);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore JSON error
    }
    // Default initial seed: 2 learned signs for immediate visual feedback
    return new Set<string>(["drink", "eat"]);
  });

  const [recentlyPracticed, setRecentlyPracticed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // ignore
    }
    return ["drink", "eat", "walk"];
  });

  const [quizHistory, setQuizHistory] = useState<QuizStatRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUIZ);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEARNED, JSON.stringify(Array.from(learnedIds)));
    } catch (e) {
      console.error("Failed to persist learned signs to localStorage", e);
    }
  }, [learnedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recentlyPracticed));
    } catch (e) {
      console.error("Failed to persist recent signs to localStorage", e);
    }
  }, [recentlyPracticed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(quizHistory));
    } catch (e) {
      console.error("Failed to persist quiz history to localStorage", e);
    }
  }, [quizHistory]);

  const toggleLearned = useCallback((id: string) => {
    setLearnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const markLearned = useCallback((id: string, learned = true) => {
    setLearnedIds((prev) => {
      const next = new Set(prev);
      if (learned) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const recordPractice = useCallback((id: string) => {
    setRecentlyPracticed((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [id, ...filtered].slice(0, 8);
    });
  }, []);

  const addQuizResult = useCallback((record: QuizStatRecord) => {
    setQuizHistory((prev) => [record, ...prev].slice(0, 20));
  }, []);

  const resetAllProgress = useCallback(() => {
    setLearnedIds(new Set<string>());
    setRecentlyPracticed([]);
    try {
      localStorage.removeItem(STORAGE_KEY_LEARNED);
      localStorage.removeItem(STORAGE_KEY_RECENT);
    } catch {
      // ignore
    }
  }, []);

  const isLearned = useCallback((id: string) => learnedIds.has(id), [learnedIds]);

  const totalSigns = EARLY_YEARS_SIGNS.length; // 16
  const signsLearnedCount = learnedIds.size;
  const signsRemainingCount = Math.max(0, totalSigns - signsLearnedCount);
  const progressPercentage = Math.round((signsLearnedCount / totalSigns) * 100);

  // Next sign to learn (first sign not yet learned in original order)
  const nextSignToLearn: EarlyYearsSign | undefined = EARLY_YEARS_SIGNS.find(
    (sign) => !learnedIds.has(sign.id)
  ) || EARLY_YEARS_SIGNS[0];

  return {
    learnedIds,
    recentlyPracticed,
    quizHistory,
    totalSigns,
    signsLearnedCount,
    signsRemainingCount,
    progressPercentage,
    nextSignToLearn,
    toggleLearned,
    markLearned,
    recordPractice,
    addQuizResult,
    resetAllProgress,
    isLearned,
  };
}
