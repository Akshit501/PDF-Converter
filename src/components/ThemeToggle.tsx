"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const initialDark = storedTheme === "dark";

    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className={`w-16 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode theme"
      className={`relative w-16 h-8 rounded-full p-1 border transition-colors flex items-center justify-between cursor-pointer ${
        isDark
          ? "bg-slate-900 border-slate-700"
          : "bg-slate-100 border-slate-200"
      } ${className}`}
    >
      {/* Track Icons */}
      <div className="w-full flex items-center justify-between px-1 pointer-events-none text-xs">
        <Sun className={`w-3.5 h-3.5 ${isDark ? "text-slate-400" : "opacity-0"}`} />
        <Moon className={`w-3.5 h-3.5 ${!isDark ? "text-slate-400" : "opacity-0"}`} />
      </div>

      {/* Sliding Knob */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 w-6.5 h-6.5 rounded-full flex items-center justify-center shadow-sm transition-all ${
          isDark
            ? "right-0.5 bg-indigo-500 text-white"
            : "left-0.5 bg-white text-amber-500 border border-slate-200"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-current" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
