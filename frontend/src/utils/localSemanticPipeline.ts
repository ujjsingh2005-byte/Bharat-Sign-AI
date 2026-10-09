import type { SignItem } from "../components/dashboard/AvatarViewer";

// Core ISL Vocabulary Dictionary Map
export const VOCABULARY_MAP: Record<string, string> = {
  HELLO: "hello",
  NAMASTE: "hello",
  WELCOME: "welcome",
  ME: "me",
  I: "me",
  MY: "me",
  MINE: "me",
  YOU: "you",
  YOUR: "you",
  YOURS: "you",
  HE: "he",
  HIM: "he",
  HIS: "he",
  SHE: "she",
  HER: "she",
  WE: "we",
  US: "we",
  OUR: "we",
  THEY: "they",
  THEM: "they",
  THANK: "thankyou",
  THANKS: "thankyou",
  THANKYOU: "thankyou",
  YES: "yes",
  NO: "no",
  NOT: "no",
  NEVER: "no",
  PLEASE: "please",
  HELP: "help",
  NAME: "name",
  WHAT: "what",
  WHERE: "where",
  WHEN: "when",
  WHY: "why",
  HOW: "how",
  WHO: "who",
  GO: "go",
  GOING: "go",
  WENT: "go",
  COME: "come",
  COMING: "come",
  CAME: "come",
  WANT: "want",
  WANTS: "want",
  WANTED: "want",
  NEED: "need",
  NEEDS: "need",
  NEEDED: "need",
  LIKE: "like",
  LIKES: "like",
  LOVE: "love",
  GOOD: "good",
  BAD: "bad",
  HAPPY: "happy",
  SAD: "sad",
  EAT: "eat",
  EATING: "eat",
  ATE: "eat",
  FOOD: "eat",
  DRINK: "drink",
  DRINKING: "drink",
  WATER: "water",
  SCHOOL: "school",
  COLLEGE: "school",
  STUDY: "study",
  READ: "read",
  BOOK: "book",
  HOME: "home",
  HOUSE: "home",
  HOSPITAL: "hospital",
  DOCTOR: "doctor",
  MEDICINE: "medicine",
  PAIN: "pain",
  FEVER: "fever",
  TIME: "time",
  TODAY: "today",
  TOMORROW: "tomorrow",
  YESTERDAY: "yesterday",
  MORNING: "morning",
  NIGHT: "night",
  NOW: "now",
  LATER: "later",
  BUS: "bus",
  TRAIN: "train",
  TICKET: "ticket",
  MONEY: "money",
  FRIEND: "friend",
  FAMILY: "family",
  FATHER: "father",
  MOTHER: "mother",
  BROTHER: "brother",
  SISTER: "sister",
  WORK: "work",
  JOB: "work",
  GREAT: "good",
  HONORABLE: "respect",
  RESPECT: "respect",
  MAN: "father",
  WOMAN: "mother",
  BOY: "brother",
  GIRL: "sister",
  PERSON: "me",
  HUMAN: "me",
  TEACHER: "study",
  STUDENT: "study",
  POLICE: "help",
  IMPORTANT: "good",
  HONEST: "good",
  STRONG: "work",
  SMART: "study",
  BEAUTIFUL: "like",
  KIND: "love",
  BRAVE: "help",
  PEACE: "welcome",
  HEALTH: "doctor",
  CARE: "help",
  SAFE: "welcome",
  WORLD: "home",
  INDIA: "home",
};

// Polysemous Words Context-Disambiguation Clues
const POLYSEMOUS_WORDS: Record<string, {
  senses: Array<{ sense: string; gloss: string; keywords: string[] }>;
  ambiguousPrompt: string;
}> = {
  bank: {
    senses: [
      { sense: "Financial Institution", gloss: "MONEY", keywords: ["money", "account", "pay", "deposit", "cash", "withdraw", "rupee", "financial", "loan", "vault", "card", "check"] },
      { sense: "River Bank", gloss: "WATER", keywords: ["river", "water", "stream", "shore", "lake", "boat", "flow", "riverbank", "sea"] }
    ],
    ambiguousPrompt: "Did you mean Financial Institution (Money) or River Bank (Water)?"
  },
  train: {
    senses: [
      { sense: "Railway Vehicle", gloss: "TRAIN", keywords: ["ticket", "station", "railway", "go", "travel", "platform", "ride", "express", "track"] },
      { sense: "Practice / Exercise", gloss: "WORK", keywords: ["gym", "exercise", "workout", "practice", "athlete", "sports", "coach", "train"] }
    ],
    ambiguousPrompt: "Did you mean Railway Train or Physical Exercise Training?"
  },
  light: {
    senses: [
      { sense: "Illumination / Brightness", gloss: "LIGHT", keywords: ["lamp", "dark", "sun", "bright", "color", "room", "switch", "on", "off", "bulb"] },
      { sense: "Low Weight", gloss: "GOOD", keywords: ["heavy", "weight", "bag", "carry", "feather", "box", "easy"] }
    ],
    ambiguousPrompt: "Did you mean Illumination (Light) or Low Weight (Not heavy)?"
  },
  right: {
    senses: [
      { sense: "Direction (Right Turn)", gloss: "RIGHT", keywords: ["left", "turn", "direction", "side", "road", "street", "way"] },
      { sense: "Correct / True", gloss: "YES", keywords: ["correct", "wrong", "true", "yes", "answer", "good"] }
    ],
    ambiguousPrompt: "Did you mean Direction (Right Turn) or Correct/True?"
  }
};

const OFFLINE_TRANSLATION_MAP: Record<string, string> = {
  namaste: "hello",
  mera: "my",
  meri: "my",
  mere: "my",
  naam: "name",
  kya: "what",
  kahan: "where",
  kab: "when",
  kyun: "why",
  kaise: "how",
  haan: "yes",
  nahi: "no",
  nahin: "no",
  madad: "help",
  pani: "water",
  paani: "water",
  khana: "food",
  hospital: "hospital",
  doctor: "doctor",
  dawa: "medicine",
  karo: "do",
  chahiye: "need",
  school: "school",
  ja: "go",
  rahe: "going",
  ho: "are",
  hain: "is",
  apka: "your",
  aapka: "your",
  tum: "you",
  aap: "you",
  swagat: "welcome",
  shukriya: "thank you",
  dhanyawad: "thank you",
  kal: "tomorrow",
  aaj: "today",
  dilli: "delhi",
  bhookh: "hungry",
  hamar: "my",
  hamra: "me",
  tohar: "your",
  ka: "what",
  kahwa: "where",
  pani_chahi: "need water",
  ja_tani: "going",
  rahal: "being",
  amar: "my",
  tomar: "your",
  ki: "what",
  kothay: "where",
  kemon: "how",
  jal: "water",
  khabar: "food",
  hoyeche: "happened",
  jabo: "will go",
  bari: "home",
  kaha: "where",
  kuthe: "where",
  aahet: "are",
  vanakkam: "hello",
  namaskaram: "hello",
};

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "am", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "to", "at", "by", "for", "with",
  "about", "against", "between", "into", "through", "during", "before", "after",
  "above", "below", "from", "up", "down", "in", "out", "on", "off", "over",
  "under", "again", "further", "then", "once", "hai", "hain", "hoon", "tha",
  "thi", "the", "ko", "se", "me", "par", "ke", "ki", "ka",
]);

const TIME_WORDS: Record<string, string> = {
  today: "TODAY",
  tomorrow: "TOMORROW",
  yesterday: "YESTERDAY",
  morning: "MORNING",
  night: "NIGHT",
  now: "NOW",
  later: "LATER",
  kal: "TOMORROW",
  aaj: "TODAY",
};

const QUESTION_WORDS: Record<string, string> = {
  what: "WHAT",
  where: "WHERE",
  when: "WHEN",
  why: "WHY",
  how: "HOW",
  who: "WHO",
  kya: "WHAT",
  kahan: "WHERE",
  kahwa: "WHERE",
  kothay: "WHERE",
};

const PRONOUN_MAP: Record<string, string> = {
  i: "ME",
  me: "ME",
  my: "ME",
  mine: "ME",
  mera: "ME",
  meri: "ME",
  mere: "ME",
  hamar: "ME",
  amar: "ME",
  you: "YOU",
  your: "YOU",
  yours: "YOU",
  tum: "YOU",
  aap: "YOU",
  he: "HE",
  him: "HE",
  she: "SHE",
  her: "SHE",
  we: "WE",
  us: "WE",
  our: "WE",
  they: "THEY",
  them: "THEY",
};

export interface LocalSemanticPipelineResult {
  success: boolean;
  targetLanguage: string;
  original_text: string;
  source_language: string;
  english_translation: string;
  gloss: string[];
  gloss_text: string;
  signs: SignItem[];
  rule_applied: string;
  confidence: number;
  lowConfidenceWarning: boolean;
  disambiguationNeeded: boolean;
  disambiguationPrompt?: string;
  disambiguationOptions?: Array<{ sense: string; gloss: string }>;
  missing_words: string[];
  vocabularyCoverageRate: number;
  semantics: {
    time?: string | null;
    subject?: string | null;
    object?: string | null;
    verb?: string | null;
    question?: string | null;
    negation?: boolean;
    sentences_breakdown?: any[];
  };
}

function translateWordOffline(word: string): string {
  const clean = word.toLowerCase().trim();
  return OFFLINE_TRANSLATION_MAP[clean] || clean;
}

// Disambiguate context for polysemous words
function disambiguateWord(word: string, contextWords: string[]): {
  resolvedGloss: string | null;
  ambiguous: boolean;
  prompt?: string;
  options?: Array<{ sense: string; gloss: string }>;
} {
  const poly = POLYSEMOUS_WORDS[word.toLowerCase()];
  if (!poly) return { resolvedGloss: null, ambiguous: false };

  for (const s of poly.senses) {
    for (const kw of s.keywords) {
      if (contextWords.includes(kw)) {
        return { resolvedGloss: s.gloss, ambiguous: false };
      }
    }
  }

  return {
    resolvedGloss: poly.senses[0].gloss,
    ambiguous: true,
    prompt: poly.ambiguousPrompt,
    options: poly.senses.map((s) => ({ sense: s.sense, gloss: s.gloss })),
  };
}

function parseSingleSentence(sentenceText: string): {
  gloss: string[];
  signs: SignItem[];
  semantics: any;
  english: string;
  missing: string[];
  ambiguousInfo?: any;
} {
  const raw = (sentenceText || "").trim();
  if (!raw) {
    return { gloss: [], signs: [], semantics: {}, english: "", missing: [] };
  }

  const rawWords = raw.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  const engWords = rawWords.map(translateWordOffline);
  const engSentence = engWords.join(" ");

  const timeTokens: string[] = [];
  const subjectTokens: string[] = [];
  const questionTokens: string[] = [];
  const verbTokens: string[] = [];
  const objectTokens: string[] = [];
  const missingWords: string[] = [];
  let negation = false;
  let ambiguousInfo: any = null;

  for (let i = 0; i < engWords.length; i++) {
    const w = engWords[i];
    const upper = w.toUpperCase();

    // Check Polysemy Context Disambiguation
    const disRes = disambiguateWord(w, engWords);
    if (disRes.ambiguous && !ambiguousInfo) {
      ambiguousInfo = {
        word: w,
        prompt: disRes.prompt,
        options: disRes.options,
      };
    }

    if (["not", "no", "never", "dont", "don't", "cant", "can't", "nahi", "nahin"].includes(w)) {
      negation = true;
      continue;
    }
    if (TIME_WORDS[w]) {
      timeTokens.push(TIME_WORDS[w]);
    } else if (QUESTION_WORDS[w]) {
      questionTokens.push(QUESTION_WORDS[w]);
    } else if (PRONOUN_MAP[w]) {
      subjectTokens.push(PRONOUN_MAP[w]);
    } else if (VOCABULARY_MAP[upper] || disRes.resolvedGloss) {
      const glossToUse = disRes.resolvedGloss || VOCABULARY_MAP[upper];
      verbTokens.push(glossToUse);
    } else if (!STOP_WORDS.has(w)) {
      objectTokens.push(upper);
      if (!VOCABULARY_MAP[upper]) {
        missingWords.push(upper);
      }
    }
  }

  // Construct ISL Sentence Order: Time -> Subject -> Object -> Verb -> Negation -> Question
  const islGloss: string[] = [];
  islGloss.push(...timeTokens);
  islGloss.push(...subjectTokens);
  islGloss.push(...objectTokens);
  islGloss.push(...verbTokens);
  if (negation) islGloss.push("NO");
  islGloss.push(...questionTokens);

  let finalGloss = islGloss;
  if (finalGloss.length === 0) {
    finalGloss = engWords.filter((w) => !STOP_WORDS.has(w)).map((w) => w.toUpperCase());
  }
  if (finalGloss.length === 0) {
    finalGloss = [raw.toUpperCase()];
  }

  const signs: SignItem[] = [];
  for (const glossWord of finalGloss) {
    if (!glossWord || !glossWord.trim()) continue;

    const animationKey = VOCABULARY_MAP[glossWord] || glossWord.toLowerCase();
    const isAvailable = Boolean(VOCABULARY_MAP[glossWord]);

    signs.push({
      word: glossWord,
      animation: animationKey,
      type: "sign",
      available: isAvailable,
      description: isAvailable
        ? `Validated ISL Whole-Word Gesture for '${glossWord}'.`
        : `Procedural Sign Item for '${glossWord}'.`,
    });
  }

  return {
    gloss: finalGloss,
    signs,
    semantics: {
      time: timeTokens.join(" ") || null,
      subject: subjectTokens.join(" ") || null,
      object: objectTokens.join(" ") || null,
      verb: verbTokens.join(" ") || null,
      question: questionTokens.join(" ") || null,
      negation,
      raw,
      gloss_text: finalGloss.join(" "),
    },
    english: engSentence,
    missing: missingWords,
    ambiguousInfo,
  };
}

export function processLocalSemanticPipeline(
  inputText: string,
  sourceLanguage = "auto"
): LocalSemanticPipelineResult {
  const raw = inputText.trim();
  if (!raw) {
    return {
      success: false,
      targetLanguage: "Indian Sign Language (ISL)",
      original_text: "",
      source_language: sourceLanguage,
      english_translation: "",
      gloss: [],
      gloss_text: "",
      signs: [],
      rule_applied: "None",
      confidence: 1.0,
      lowConfidenceWarning: false,
      disambiguationNeeded: false,
      missing_words: [],
      vocabularyCoverageRate: 100,
      semantics: {},
    };
  }

  const sentenceStrings = raw.split(/[.\n!?;\r]+/).map((s) => s.trim()).filter(Boolean);

  const allGloss: string[] = [];
  const allSigns: SignItem[] = [];
  const breakdowns: any[] = [];
  const engTranslations: string[] = [];
  const allMissing: string[] = [];
  let detectedAmbiguous: any = null;

  for (const sentence of sentenceStrings) {
    const res = parseSingleSentence(sentence);
    if (res.gloss.length > 0) {
      allGloss.push(...res.gloss);
      allSigns.push(...res.signs);
      breakdowns.push(res.semantics);
      engTranslations.push(res.english);
      allMissing.push(...res.missing);
      if (res.ambiguousInfo && !detectedAmbiguous) {
        detectedAmbiguous = res.ambiguousInfo;
      }
    }
  }

  const totalTokens = allGloss.length || 1;
  const coverageRate = roundNum(((totalTokens - allMissing.length) / totalTokens) * 100, 2);
  const confidenceScore = coverageRate > 80 ? 0.95 : 0.65;

  return {
    success: true,
    targetLanguage: "Indian Sign Language (ISL)",
    original_text: raw,
    source_language: sourceLanguage,
    english_translation: engTranslations.join(". "),
    gloss: allGloss,
    gloss_text: allGloss.join(" "),
    signs: allSigns,
    rule_applied: `Context-Sensitive ISL Grammar Alignment (${sentenceStrings.length} Sentence(s))`,
    confidence: confidenceScore,
    lowConfidenceWarning: confidenceScore < 0.70,
    disambiguationNeeded: Boolean(detectedAmbiguous),
    disambiguationPrompt: detectedAmbiguous?.prompt,
    disambiguationOptions: detectedAmbiguous?.options,
    missing_words: allMissing,
    vocabularyCoverageRate: Math.max(coverageRate, 0),
    semantics: {
      sentences_breakdown: breakdowns,
      time: breakdowns[0]?.time || null,
      subject: breakdowns[0]?.subject || null,
      object: breakdowns[0]?.object || null,
      verb: breakdowns[0]?.verb || null,
      question: breakdowns[0]?.question || null,
      negation: breakdowns[0]?.negation || false,
    },
  };
}

function roundNum(val: number, decimals: number): number {
  return Number(Math.round(Number(val + "e" + decimals)) + "e-" + decimals);
}
