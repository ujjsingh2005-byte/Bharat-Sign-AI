import type { SignItem } from "../components/dashboard/AvatarViewer";

// Core ISL Vocabulary Dictionary Map
const VOCABULARY_MAP: Record<string, string> = {
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
};

// Common Indian Language Word Mappings to English for offline translation
const OFFLINE_TRANSLATION_MAP: Record<string, string> = {
  // Hindi & Hinglish
  namaste: "hello",
  mera: "my",
  meri: "my",
  mere: "my",
  naam: "name",
  naam_hai: "name is",
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

  // Bhojpuri
  hamar: "my",
  hamra: "me",
  tohar: "your",
  ka: "what",
  kahwa: "where",
  pani_chahi: "need water",
  ja_tani: "going",
  rahal: "being",

  // Bengali
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

  // Tamil & Telugu & Kannada & Marathi
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
  original_text: string;
  source_language: string;
  english_translation: string;
  gloss: string[];
  gloss_text: string;
  signs: SignItem[];
  rule_applied: string;
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

function parseSingleSentence(sentenceText: string): {
  gloss: string[];
  signs: SignItem[];
  semantics: any;
  english: string;
} {
  const raw = (sentenceText || "").trim();
  if (!raw) {
    return { gloss: [], signs: [], semantics: {}, english: "" };
  }

  const rawWords = raw.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  const engWords = rawWords.map(translateWordOffline);
  const engSentence = engWords.join(" ");

  const timeTokens: string[] = [];
  const subjectTokens: string[] = [];
  const questionTokens: string[] = [];
  const verbTokens: string[] = [];
  const objectTokens: string[] = [];
  let negation = false;

  for (const w of engWords) {
    const upper = w.toUpperCase();
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
    } else if (VOCABULARY_MAP[upper]) {
      verbTokens.push(upper);
    } else if (!STOP_WORDS.has(w)) {
      objectTokens.push(upper);
    }
  }

  // Construct standard ISL Sentence Order: Time -> Subject -> Object -> Verb -> Negation -> Question
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

  // Map gloss to signs or fingerspelling
  const signs: SignItem[] = [];
  for (const glossWord of finalGloss) {
    const animationKey = VOCABULARY_MAP[glossWord];
    if (animationKey) {
      signs.push({
        word: glossWord,
        animation: animationKey,
        type: "sign",
        description: `ISL Gesture animation for '${glossWord}'.`,
      });
    } else {
      // Fingerspelling fallback for unknown proper nouns / names
      for (const char of glossWord) {
        if (/[A-Z0-9]/.test(char)) {
          signs.push({
            word: char,
            animation: char.toLowerCase(),
            type: "letter",
            description: `Fingerspelling letter '${char}'.`,
          });
        }
      }
    }
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
      original_text: "",
      source_language: sourceLanguage,
      english_translation: "",
      gloss: [],
      gloss_text: "",
      signs: [],
      rule_applied: "None",
      semantics: {},
    };
  }

  // Split into sentence chunks
  const sentenceStrings = raw.split(/[.\n!?;\r]+/).map((s) => s.trim()).filter(Boolean);

  const allGloss: string[] = [];
  const allSigns: SignItem[] = [];
  const breakdowns: any[] = [];
  const engTranslations: string[] = [];

  for (const sentence of sentenceStrings) {
    const res = parseSingleSentence(sentence);
    if (res.gloss.length > 0) {
      allGloss.push(...res.gloss);
      allSigns.push(...res.signs);
      breakdowns.push(res.semantics);
      engTranslations.push(res.english);
    }
  }

  return {
    success: true,
    original_text: raw,
    source_language: sourceLanguage,
    english_translation: engTranslations.join(". "),
    gloss: allGloss,
    gloss_text: allGloss.join(" "),
    signs: allSigns,
    rule_applied: `Client & ISL Semantic Alignment (${sentenceStrings.length} Sentence(s))`,
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
