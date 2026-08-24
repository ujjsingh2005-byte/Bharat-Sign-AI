import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Sparkles,
  Play,
  Layers,
} from "lucide-react";
import AvatarViewer, { type SignItem } from "./AvatarViewer";

// Base dictionary items
const DICTIONARY_DATA: SignItem[] = [
  // Greetings
  { word: "HELLO", animation: "hello", category: "Greetings", description: "Open hand raised near temple waving outward with warmth." },
  { word: "NAMASTE", animation: "namaste", category: "Greetings", description: "Both palms joined in front of chest with gentle head nod." },
  { word: "THANK YOU", animation: "thank_you", category: "Greetings", description: "Fingertips touch chin and move forward towards the listener." },
  { word: "GOODBYE", animation: "goodbye", category: "Greetings", description: "Open hand raised high waving gently side-to-side." },
  { word: "PLEASE", animation: "please", category: "Greetings", description: "Flat palm rubs chest in a circular clockwise motion." },
  { word: "WELCOME", animation: "welcome", category: "Greetings", description: "Open palm sweeps inward toward the body." },
  { word: "SORRY", animation: "sorry", category: "Greetings", description: "Closed fist makes a circular motion over heart." },
  { word: "HOW ARE YOU", animation: "how_are_you", category: "Greetings", description: "Cupped palms roll outward into open question posture." },
  { word: "NICE TO MEET YOU", animation: "nice_to_meet_you", category: "Greetings", description: "Palms slide together followed by index fingers meeting." },

  // Emergency & Healthcare
  { word: "HELP", animation: "help", category: "Emergency", description: "Thumbs-up fist placed on flat open palm, lifted together." },
  { word: "EMERGENCY", animation: "emergency", category: "Emergency", description: "'E' handshape shakes urgently side-to-side." },
  { word: "DOCTOR", animation: "doctor", category: "Emergency", description: "Index and middle fingers tap pulse of opposite wrist twice." },
  { word: "HOSPITAL", animation: "hospital", category: "Emergency", description: "Index & middle fingers trace a cross on the left shoulder." },
  { word: "MEDICINE", animation: "medicine", category: "Emergency", description: "Middle finger twists gently into open opposite palm." },
  { word: "POLICE", animation: "police", category: "Emergency", description: "'C' handshape touches chest representing official badge." },

  // Food & Living
  { word: "WATER", animation: "water", category: "Food & Water", description: "'W' handshape (3 fingers) taps twice against the chin." },
  { word: "FOOD", animation: "food", category: "Food & Water", description: "Flat 'O' handshape fingertips tap repeatedly near mouth." },
  { word: "DRINK", animation: "drink", category: "Food & Water", description: "'C' shaped hand tilts toward mouth mimicking cup." },
  { word: "EAT", animation: "eat", category: "Food & Water", description: "Brought fingers to mouth in eating motion." },

  // Education & Work
  { word: "SCHOOL", animation: "school", category: "Education", description: "Open right palm claps gently down twice on left palm." },
  { word: "COLLEGE", animation: "college", category: "Education", description: "Right palm circles above left palm and glides forward." },
  { word: "STUDY", animation: "study", category: "Education", description: "Left palm as book, right fingers flutter towards it." },
  { word: "BOOK", animation: "book", category: "Education", description: "Palms joined edge-to-edge open up like opening a book." },

  // Basics & Pronouns
  { word: "YES", animation: "yes", category: "Basics", description: "Closed fist nods up and down like head nodding." },
  { word: "NO", animation: "no", category: "Basics", description: "Index and middle fingers snap down against thumb." },
  { word: "ME", animation: "me", category: "Basics", description: "Index finger points directly to one's own chest." },
  { word: "YOU", animation: "you", category: "Basics", description: "Index finger points outward toward conversational partner." },
  { word: "MY", animation: "my", category: "Basics", description: "Flat open palm rests firmly on the chest." },
  { word: "GO", animation: "go", category: "Basics", description: "Both index fingers point forward and roll outward." },
  { word: "COME", animation: "come", category: "Basics", description: "Both hands beckon inward toward the body." },
  { word: "TODAY", animation: "today", category: "Time", description: "'Y' handshapes dropped down sharply twice." },
  { word: "TOMORROW", animation: "tomorrow", category: "Time", description: "Thumbs-up hand touches cheek and arcs forward." },
  { word: "YESTERDAY", animation: "yesterday", category: "Time", description: "Thumbs-up hand touches chin and moves backward to ear." },
];

// Add A-Z Fingerspelling
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((char) => {
  DICTIONARY_DATA.push({
    word: `Letter ${char}`,
    animation: `letter_${char.toLowerCase()}`,
    category: "Alphabet (A-Z)",
    description: `Indian Sign Language fingerspelling handshape for letter '${char}'.`,
  });
});

// Add 0-9 Numbers
"0123456789".split("").forEach((digit) => {
  DICTIONARY_DATA.push({
    word: `Number ${digit}`,
    animation: `number_${digit}`,
    category: "Numbers (0-9)",
    description: `Indian Sign Language finger count formation for digit '${digit}'.`,
  });
});

export default function ISLDictionary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSign, setActiveSign] = useState<SignItem>(DICTIONARY_DATA[0]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    DICTIONARY_DATA.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, []);

  const filteredSigns = useMemo(() => {
    return DICTIONARY_DATA.filter((item) => {
      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
              <BookOpen size={13} />
              ISL LEARNING STUDIO
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Indian Sign Language Interactive Dictionary
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Browse 100+ standard ISL signs, A-Z fingerspelling alphabet, and numbers with live 3D avatar demonstrations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-slate-950 border border-slate-800 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
              {DICTIONARY_DATA.length} Total Gestures
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Avatar Preview, Right is Dictionary Browser */}
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
              <span className="text-xs bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                {activeSign.animation}
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
              Showing {filteredSigns.length} of {DICTIONARY_DATA.length} signs
            </span>
            <span className="text-[11px] text-slate-500">
              Click any card to animate on the 3D Avatar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
