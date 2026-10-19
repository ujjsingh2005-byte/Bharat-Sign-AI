import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode =
  | "aurora"
  | "emerald"
  | "ocean"
  | "sunset"
  | "violet"
  | "light"
  | "high-contrast";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  availableThemes: Array<{ id: ThemeMode; name: string; color: string; desc: string }>;
}

const THEMES: Array<{ id: ThemeMode; name: string; color: string; desc: string }> = [
  { id: "aurora", name: "Aurora AI", color: "#635BFF", desc: "Midnight Navy & Neon Cyan Glow" },
  { id: "emerald", name: "Emerald Accessibility", color: "#10B981", desc: "Calm Mint & Deep Forest Green" },
  { id: "ocean", name: "Ocean Intelligence", color: "#2563EB", desc: "Deep Slates & Sky Blue Highlights" },
  { id: "sunset", name: "Sunset Innovation", color: "#FB923C", desc: "Coral, Warm Orange & Amber" },
  { id: "violet", name: "Royal Violet", color: "#8B5CF6", desc: "Royal Purple & Lavender Accents" },
  { id: "light", name: "Clean Light", color: "#4F46E5", desc: "Crisp White & High Contrast Dark Text" },
  { id: "high-contrast", name: "High Contrast", color: "#FFFFFF", desc: "Maximum Contrast for Accessibility" },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("bharat_sign_theme");
    return (saved as ThemeMode) || "aurora";
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("bharat_sign_theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
