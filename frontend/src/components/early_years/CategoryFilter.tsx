import { EARLY_YEARS_CATEGORIES, type EarlyYearsCategory } from "../../data/earlyYearsSignsData";
import { Coffee, Footprints, Users, MessageSquareHeart, HandMetal, Sparkles } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: EarlyYearsCategory;
  onSelectCategory: (category: EarlyYearsCategory) => void;
  categoryCounts?: Record<string, number>;
}

const CATEGORY_ICONS: Record<string, any> = {
  All: Sparkles,
  "Daily Activities": Coffee,
  Movement: Footprints,
  "Social Actions": Users,
  "Communication and Expression": MessageSquareHeart,
  "Other Actions": HandMetal,
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Sign Categories">
      {EARLY_YEARS_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const Icon = CATEGORY_ICONS[cat] || Sparkles;
        const count = categoryCounts ? categoryCounts[cat] : undefined;

        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(cat)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSelected
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/50"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-indigo-400"}`} />
            <span>{cat}</span>
            {typeof count === "number" && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
