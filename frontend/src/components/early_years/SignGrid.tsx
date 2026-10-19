import { useState, useMemo } from "react";
import { EARLY_YEARS_SIGNS, type EarlyYearsSign, type EarlyYearsCategory } from "../../data/earlyYearsSignsData";
import SignCard from "./SignCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { ArrowUpDown, CheckCircle, Sparkles, SlidersHorizontal } from "lucide-react";

interface SignGridProps {
  learnedIds: Set<string>;
  onToggleLearned: (id: string) => void;
  onWatchSign: (sign: EarlyYearsSign) => void;
  onPracticeSign: (sign: EarlyYearsSign) => void;
  onSelectSign?: (sign: EarlyYearsSign) => void;
  initialCategory?: EarlyYearsCategory;
}

type SortOption = "order" | "alpha" | "learned_first" | "unlearned_first";

export default function SignGrid({
  learnedIds,
  onToggleLearned,
  onWatchSign,
  onPracticeSign,
  onSelectSign,
  initialCategory = "All",
}: SignGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EarlyYearsCategory>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("order");

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: EARLY_YEARS_SIGNS.length };
    EARLY_YEARS_SIGNS.forEach((sign) => {
      counts[sign.category] = (counts[sign.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered and sorted signs
  const filteredSigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return EARLY_YEARS_SIGNS.filter((sign) => {
      const matchesCategory =
        selectedCategory === "All" || sign.category === selectedCategory;

      const matchesSearch =
        !q ||
        sign.word.toLowerCase().includes(q) ||
        sign.hindi.includes(q) ||
        sign.meaning.toLowerCase().includes(q) ||
        sign.category.toLowerCase().includes(q) ||
        sign.order.toString() === q;

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "order") return a.order - b.order;
      if (sortBy === "alpha") return a.word.localeCompare(b.word);
      if (sortBy === "learned_first") {
        const aL = learnedIds.has(a.id) ? 1 : 0;
        const bL = learnedIds.has(b.id) ? 1 : 0;
        return bL - aL || a.order - b.order;
      }
      if (sortBy === "unlearned_first") {
        const aL = learnedIds.has(a.id) ? 1 : 0;
        const bL = learnedIds.has(b.id) ? 1 : 0;
        return aL - bL || a.order - b.order;
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy, learnedIds]);

  return (
    <div className="space-y-6">
      {/* Search, Filter & Sort Controls Header */}
      <div className="space-y-4 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            totalResults={filteredSigns.length}
          />

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="order">Original Poster Order (1 - 16)</option>
              <option value="alpha">Alphabetical (A - Z)</option>
              <option value="unlearned_first">Unlearned First</option>
              <option value="learned_first">Learned First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-slate-800/60">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>

      {/* Grid of Learning Cards */}
      {filteredSigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSigns.map((sign, index) => {
            const prevSign = filteredSigns[(index - 1 + filteredSigns.length) % filteredSigns.length];
            const nextSign = filteredSigns[(index + 1) % filteredSigns.length];

            return (
              <SignCard
                key={sign.id}
                sign={sign}
                isLearned={learnedIds.has(sign.id)}
                onToggleLearned={onToggleLearned}
                onWatchSign={onWatchSign}
                onPracticeSign={onPracticeSign}
                onSelectSign={onSelectSign}
                onPrevSign={() => onSelectSign && onSelectSign(prevSign)}
                onNextSign={() => onSelectSign && onSelectSign(nextSign)}
                showNavigationControls={false}
              />
            );
          })}
        </div>
      ) : (
        /* Empty Search State */
        <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/40 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No signs match your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any signs matching "{searchQuery}" in category "{selectedCategory}". Try clearing your search or category filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
