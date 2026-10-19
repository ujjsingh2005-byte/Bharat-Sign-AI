import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  totalResults?: number;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search sign by English word or Hindi (e.g. 'Drink', 'पीना')...",
  totalResults,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5 text-indigo-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-24 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
        aria-label="Search signs"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-12 pr-1 flex items-center text-slate-400 hover:text-white transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {typeof totalResults === "number" && (
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {totalResults} {totalResults === 1 ? "sign" : "signs"}
          </span>
        </div>
      )}
    </div>
  );
}
