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
    // Default to Light Mode unless explicitly set to dark in localStorage
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
      <div className={`w-[72px] h-9 rounded-full bg-[#0B0B14] border-2 border-[#0B0B14] ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode theme"
      className={`relative w-[76px] h-9 rounded-full p-1 border-2 border-[#0B0B14] transition-colors flex items-center justify-between cursor-pointer shadow-[2px_2px_0_#0B0B14] ${
        isDark ? "bg-[#0B0B14]" : "bg-[#F5F2FF]"
      } ${className}`}
    >
      {/* Sliding Pill Knob */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-0.75 w-7 h-7 rounded-full border-2 border-[#0B0B14] flex items-center justify-center font-bold shadow-xs ${
          isDark ? "left-[41px] bg-[#C6FF3D] text-[#0B0B14]" : "left-1 bg-[#6E3CF6] text-white"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-[#0B0B14]" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-white" />
        )}
      </motion.div>

      {/* Track Icons */}
      <div className="w-full flex items-center justify-between px-1.5 pointer-events-none text-xs">
        <Sun className={`w-3.5 h-3.5 ${isDark ? "text-[#54506a]" : "opacity-0"}`} />
        <Moon className={`w-3.5 h-3.5 ${!isDark ? "text-[#54506a]" : "opacity-0"}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;
