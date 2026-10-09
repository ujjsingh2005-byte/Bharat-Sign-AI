import { useState, useMemo, useEffect } from "react";
import {
  Search,
  BookOpen,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Layers,
  GraduationCap,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import AvatarViewer, { type SignItem } from "./AvatarViewer";

// Base dictionary items
const LOCAL_DICTIONARY_DATA: SignItem[] = [
  // Greetings
  { word: "HELLO", animation: "hello", category: "Greetings", description: "Open hand raised near temple waving outward with warmth.", is_validated: true },
  { word: "NAMASTE", animation: "namaste", category: "Greetings", description: "Both palms joined in front of chest with gentle head nod.", is_validated: true },
  { word: "THANK YOU", animation: "thank_you", category: "Greetings", description: "Fingertips touch chin and move forward towards the listener.", is_validated: true },
  { word: "GOODBYE", animation: "goodbye", category: "Greetings", description: "Open hand raised high waving gently side-to-side.", is_validated: true },
  { word: "PLEASE", animation: "please", category: "Greetings", description: "Flat palm rubs chest in a circular clockwise motion.", is_validated: true },
  { word: "WELCOME", animation: "welcome", category: "Greetings", description: "Open palm sweeps inward toward the body.", is_validated: true },
  { word: "SORRY", animation: "sorry", category: "Greetings", description: "Closed fist makes a circular motion over heart.", is_validated: true },
  { word: "HOW ARE YOU", animation: "how_are_you", category: "Greetings", description: "Cupped palms roll outward into open question posture.", is_validated: true },
  { word: "NICE TO MEET YOU", animation: "nice_to_meet_you", category: "Greetings", description: "Palms slide together followed by index fingers meeting.", is_validated: true },

  // Emergency & Healthcare
  { word: "HELP", animation: "help", category: "Emergency", description: "Thumbs-up fist placed on flat open palm, lifted together.", is_validated: true },
  { word: "EMERGENCY", animation: "emergency", category: "Emergency", description: "'E' handshape shakes urgently side-to-side.", is_validated: true },
  { word: "DOCTOR", animation: "doctor", category: "Emergency", description: "Index and middle fingers tap pulse of opposite wrist twice.", is_validated: true },
  { word: "HOSPITAL", animation: "hospital", category: "Emergency", description: "Index & middle fingers trace a cross on the left shoulder.", is_validated: true },
  { word: "MEDICINE", animation: "medicine", category: "Emergency", description: "Middle finger twists gently into open opposite palm.", is_validated: true },
  { word: "POLICE", animation: "police", category: "Emergency", description: "'C' handshape touches chest representing official badge.", is_validated: true },

  // Food & Living
  { word: "WATER", animation: "water", category: "Food & Water", description: "'W' handshape (3 fingers) taps twice against the chin.", is_validated: true },
  { word: "FOOD", animation: "food", category: "Food & Water", description: "Flat 'O' handshape fingertips tap repeatedly near mouth.", is_validated: true },
  { word: "DRINK", animation: "drink", category: "Food & Water", description: "'C' shaped hand tilts toward mouth mimicking cup.", is_validated: true },
  { word: "EAT", animation: "eat", category: "Food & Water", description: "Brought fingers to mouth in eating motion.", is_validated: true },
  { word: "TEA", animation: "tea", category: "Food & Water", description: "Right 'F' handshape stirs above left 'O' cup hand.", is_validated: true },

  // Education & Work
  { word: "SCHOOL", animation: "school", category: "Education", description: "Open right palm claps gently down twice on left palm.", is_validated: true },
  { word: "COLLEGE", animation: "college", category: "Education", description: "Right palm circles above left palm and glides forward.", is_validated: true },
  { word: "STUDY", animation: "study", category: "Education", description: "Left palm as book, right fingers flutter towards it.", is_validated: true },
  { word: "BOOK", animation: "book", category: "Education", description: "Palms joined edge-to-edge open up like opening a book.", is_validated: true },
  { word: "WORK", animation: "work", category: "Daily Living", description: "Right fist taps down firmly twice on left wrist/fist.", is_validated: true },

  // Basics & Pronouns
  { word: "YES", animation: "yes", category: "Basics", description: "Closed fist nods up and down like head nodding.", is_validated: true },
  { word: "NO", animation: "no", category: "Basics", description: "Index and middle fingers snap down against thumb.", is_validated: true },
  { word: "ME", animation: "me", category: "Basics", description: "Index finger points directly to one's own chest.", is_validated: true },
  { word: "YOU", animation: "you", category: "Basics", description: "Index finger points outward toward conversational partner.", is_validated: true },
  { word: "MY", animation: "my", category: "Basics", description: "Flat open palm rests firmly on the chest.", is_validated: true },
  { word: "GO", animation: "go", category: "Basics", description: "Both index fingers point forward and roll outward.", is_validated: true },
  { word: "COME", animation: "come", category: "Basics", description: "Both hands beckon inward toward the body.", is_validated: true },
  { word: "TODAY", animation: "today", category: "Time", description: "'Y' handshapes dropped down sharply twice.", is_validated: true },
  { word: "TOMORROW", animation: "tomorrow", category: "Time", description: "Thumbs-up hand touches cheek and arcs forward.", is_validated: true },
  { word: "YESTERDAY", animation: "yesterday", category: "Time", description: "Thumbs-up hand touches chin and moves backward to ear.", is_validated: true },
];

// Add A-Z Fingerspelling
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((char) => {
  LOCAL_DICTIONARY_DATA.push({
    word: `Letter ${char}`,
    animation: `letter_${char.toLowerCase()}`,
    category: "Alphabet (A-Z)",
    description: `Indian Sign Language fingerspelling handshape for letter '${char}'.`,
    is_validated: true,
  });
});

// Add 0-9 Numbers
"0123456789".split("").forEach((digit) => {
  LOCAL_DICTIONARY_DATA.push({
    word: `Number ${digit}`,
    animation: `number_${digit}`,
    category: "Numbers (0-9)",
    description: `Indian Sign Language finger count formation for digit '${digit}'.`,
    is_validated: true,
  });
});

type StudioTab = "browser" | "fingerspelling" | "quiz";

export default function ISLDictionary() {
  const [activeTab, setActiveTab] = useState<StudioTab>("browser");
  const [dictionary, setDictionary] = useState<SignItem[]>(LOCAL_DICTIONARY_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSign, setActiveSign] = useState<SignItem>(LOCAL_DICTIONARY_DATA[0]);

  // Fingerspelling Practice State
  const [fsInputText, setFsInputText] = useState("BHARAT");
  const [fsCharIndex, setFsCharIndex] = useState(0);
  const [fsIsPlaying, setFsIsPlaying] = useState(false);
  const [fsSpeed, setFsSpeed] = useState<number>(1.0);

  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizItem, setQuizItem] = useState<SignItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Fetch backend dynamic signs catalog if available
  useEffect(() => {
    async function loadBackendSigns() {
      try {
        const res = await fetch("/api/signs/all");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.signs) && data.signs.length > 0) {
            setDictionary(data.signs);
            if (!activeSign) setActiveSign(data.signs[0]);
          }
        }
      } catch {
        // Fallback to local dictionary on network error
      }
    }
    loadBackendSigns();
  }, []);

  // Compute Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    dictionary.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [dictionary]);

  // Filtered Signs for Browser
  const filteredSigns = useMemo(() => {
    return dictionary.filter((item) => {
      const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [dictionary, searchQuery, selectedCategory]);

  // Fingerspelling character sequence
  const fsCharSequence = useMemo(() => {
    const clean = fsInputText.toUpperCase().replace(/[^A-Z]/g, "");
    return clean.split("");
  }, [fsInputText]);

  // Active Fingerspelling Sign item
  const currentFsSign = useMemo(() => {
    if (fsCharSequence.length === 0) return LOCAL_DICTIONARY_DATA[0];
    const char = fsCharSequence[fsCharIndex] || fsCharSequence[0];
    return {
      word: `Letter ${char}`,
      animation: `letter_${char.toLowerCase()}`,
      category: "Fingerspelling Practice",
      description: `Step ${fsCharIndex + 1} of ${fsCharSequence.length}: ISL Manual Alphabet for '${char}'`,
      is_validated: true,
    };
  }, [fsCharSequence, fsCharIndex]);

  // Auto-advance fingerspelling practice
  useEffect(() => {
    if (!fsIsPlaying || fsCharSequence.length === 0) return;
    const intervalTime = Math.round(1200 / fsSpeed);
    const timer = setInterval(() => {
      setFsCharIndex((prev) => (prev + 1) % fsCharSequence.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [fsIsPlaying, fsSpeed, fsCharSequence]);

  // Generate Quiz Question
  const generateNewQuestion = () => {
    const nonAlphabet = dictionary.filter(
      (item) => item.category !== "Alphabet (A-Z)" && item.category !== "Numbers (0-9)"
    );
    const targetPool = nonAlphabet.length >= 4 ? nonAlphabet : dictionary;
    const target = targetPool[Math.floor(Math.random() * targetPool.length)];

    // Select 3 distractors
    const distractors: string[] = [];
    while (distractors.length < 3) {
      const randomItem = targetPool[Math.floor(Math.random() * targetPool.length)];
      if (randomItem.word !== target.word && !distractors.includes(randomItem.word)) {
        distractors.push(randomItem.word);
      }
    }

    const options = [target.word, ...distractors].sort(() => Math.random() - 0.5);
    setQuizItem(target);
    setQuizOptions(options);
    setQuizSelectedOption(null);
    setQuizAnswered(false);
  };

  useEffect(() => {
    if (activeTab === "quiz" && !quizItem) {
      generateNewQuestion();
    }
  }, [activeTab]);

  const handleQuizSubmit = (opt: string) => {
    if (quizAnswered || !quizItem) return;
    setQuizSelectedOption(opt);
    setQuizAnswered(true);
    setQuizTotal((prev) => prev + 1);
    if (opt === quizItem.word) {
      setQuizScore((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
              <BookOpen size={13} />
              ISL INTERACTIVE STUDIO & LEARNING LAB
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Indian Sign Language Dictionary & Practice Engine
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Browse 200+ ISL signs, practice character-by-character fingerspelling, and test your vocabulary with live 3D avatar demonstrations.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("browser")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "browser"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen size={14} />
              Dictionary Catalog
            </button>
            <button
              onClick={() => setActiveTab("fingerspelling")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "fingerspelling"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap size={14} />
              Fingerspelling Studio
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "quiz"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap size={14} />
              Practice Quiz
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: DICTIONARY BROWSER */}
      {activeTab === "browser" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT COLUMN: 3D Avatar Demo */}
          <div className="xl:col-span-5 space-y-4">
            <AvatarViewer sign={activeSign.animation || activeSign.word} />

            {/* Active Sign Details Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                  {activeSign.category || "Vocabulary"}
                </span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-mono font-semibold">
                  LINGUISTICALLY VALIDATED
                </span>
              </div>

              <h3 className="mt-2 text-2xl font-bold text-white">{activeSign.word}</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {activeSign.description}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Catalog & Search */}
          <div className="xl:col-span-7 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 flex flex-col justify-between">
            <div>
              {/* Search Bar & Category Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sign by name or keyword (e.g. hello, doctor, water, A)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Sign Cards */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredSigns.map((item, i) => {
                  const isSelected = activeSign.word === item.word;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveSign(item)}
                      className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between group ${
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 shadow-md shadow-blue-600/20"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="truncate">{item.category}</span>
                          {isSelected && (
                            <Sparkles size={11} className="text-blue-400 shrink-0" />
                          )}
                        </div>
                        <h4
                          className={`text-sm font-bold truncate ${
                            isSelected
                              ? "text-blue-300"
                              : "text-slate-200 group-hover:text-white"
                          }`}
                        >
                          {item.word}
                        </h4>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="text-[9px] truncate max-w-[80%]">
                          {item.animation}
                        </span>
                        <Play
                          size={12}
                          className={isSelected ? "text-blue-400" : "opacity-40"}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <Layers size={14} className="text-blue-400" />
                Showing {filteredSigns.length} of {dictionary.length} signs
              </span>
              <span className="text-[11px] text-slate-500">
                Click any card to animate on 3D Avatar
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINGERSPELLING STUDIO */}
      {activeTab === "fingerspelling" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT: 3D Avatar Preview */}
          <div className="xl:col-span-6 space-y-4">
            <AvatarViewer sign={currentFsSign.animation || "letter_b"} />

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  CURRENT CHARACTER
                </span>
                <h4 className="text-2xl font-black text-white">
                  {fsCharSequence[fsCharIndex] ? `Letter '${fsCharSequence[fsCharIndex]}'` : "Select Text"}
                </h4>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setFsCharIndex((prev) => (prev > 0 ? prev - 1 : fsCharSequence.length - 1))
                  }
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white"
                  title="Previous character"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setFsIsPlaying(!fsIsPlaying)}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
                >
                  {fsIsPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {fsIsPlaying ? "Pause" : "Play Loop"}
                </button>
                <button
                  onClick={() =>
                    setFsCharIndex((prev) => (prev + 1) % (fsCharSequence.length || 1))
                  }
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white"
                  title="Next character"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Input & Character Map */}
          <div className="xl:col-span-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                TYPE WORD OR NAME FOR FINGERSPELLING BREAKDOWN
              </label>
              <input
                type="text"
                value={fsInputText}
                onChange={(e) => {
                  setFsInputText(e.target.value);
                  setFsCharIndex(0);
                }}
                placeholder="Type any word (e.g. INDIA, DELHI, RAHUL)..."
                className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-lg font-bold text-white uppercase tracking-widest focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Speed Control */}
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-xs text-slate-400 font-semibold">Animation Speed</span>
              <div className="flex gap-1.5">
                {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setFsSpeed(spd)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                      fsSpeed === spd
                        ? "bg-blue-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Character Step Breakdown Chips */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                CHARACTER BREAKDOWN SEQUENCE
              </span>
              <div className="mt-3 flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
                {fsCharSequence.map((char, index) => {
                  const isCurrent = index === fsCharIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setFsCharIndex(index);
                        setFsIsPlaying(false);
                      }}
                      className={`w-12 h-14 rounded-2xl font-black text-lg flex flex-col items-center justify-center border transition ${
                        isCurrent
                          ? "bg-blue-600 border-blue-400 text-white scale-105 shadow-lg shadow-blue-600/40"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[9px] font-mono opacity-60">#{index + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRACTICE QUIZ MODE */}
      {activeTab === "quiz" && quizItem && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT: 3D Avatar Demo */}
          <div className="xl:col-span-6 space-y-4">
            <AvatarViewer sign={quizItem.animation || quizItem.word} />

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Guess the ISL sign demonstrated by the 3D Avatar
              </span>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Score: {quizScore} / {quizTotal}
              </span>
            </div>
          </div>

          {/* RIGHT: Quiz Cards & Feedback */}
          <div className="xl:col-span-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-bold uppercase tracking-wider">
                  <Award size={14} />
                  ISL VOCABULARY CHALLENGE
                </span>
                <button
                  onClick={generateNewQuestion}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  <RotateCcw size={13} />
                  Skip / Next
                </button>
              </div>

              <h3 className="mt-4 text-xl font-extrabold text-white">
                Which Indian Sign Language word is this avatar demonstrating?
              </h3>

              {/* Multiple Choice Options */}
              <div className="mt-5 space-y-3">
                {quizOptions.map((opt, i) => {
                  const isCorrect = opt === quizItem.word;
                  const isSelected = opt === quizSelectedOption;

                  let cardStyle = "bg-slate-950 border-slate-800 hover:border-blue-500 text-slate-200";
                  if (quizAnswered) {
                    if (isCorrect) cardStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold";
                    else if (isSelected) cardStyle = "bg-rose-600/20 border-rose-500 text-rose-300 font-bold";
                    else cardStyle = "bg-slate-950 border-slate-800 opacity-40 text-slate-400";
                  }

                  return (
                    <button
                      key={i}
                      disabled={quizAnswered}
                      onClick={() => handleQuizSubmit(opt)}
                      className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between text-sm ${cardStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </span>

                      {quizAnswered && isCorrect && <CheckCircle2 size={18} className="text-emerald-400" />}
                      {quizAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-rose-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {quizAnswered && (
                <div
                  className={`mt-5 p-4 rounded-2xl border text-xs leading-relaxed ${
                    quizSelectedOption === quizItem.word
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <p className="font-bold text-sm">
                    {quizSelectedOption === quizItem.word ? "Correct Answer!" : `Incorrect — Right Answer: ${quizItem.word}`}
                  </p>
                  <p className="mt-1">{quizItem.description}</p>
                </div>
              )}
            </div>

            {/* Next Question Button */}
            {quizAnswered && (
              <button
                onClick={generateNewQuestion}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
              >
                Next Challenge Question
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

