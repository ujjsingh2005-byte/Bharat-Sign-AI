import { useState, useRef, useEffect } from "react";
import { Palette, Check, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = availableThemes.find((t) => t.id === theme) || availableThemes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-white transition shadow-sm"
        aria-label="Select Color Theme"
      >
        <span
          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: currentTheme.color }}
        />
        <span className="hidden sm:inline">{currentTheme.name}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5">
              <Palette size={13} className="text-indigo-400" />
              Multicolor Design System
            </span>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto">
            {availableThemes.map((t) => {
              const isSelected = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition text-left ${
                    isSelected
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md"
                      style={{ backgroundColor: t.color }}
                    />
                    <div className="truncate">
                      <span className="font-bold block">{t.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{t.desc}</span>
                    </div>
                  </div>

                  {isSelected && <Check size={14} className="text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
