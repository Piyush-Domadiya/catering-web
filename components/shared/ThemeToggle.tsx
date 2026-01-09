"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-amber-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-white/10 transition-all border border-transparent hover:border-amber-200 dark:hover:border-white/10 hover:shadow-lg hover:glow-amber-sm overflow-hidden"
    >
      <div className="relative z-10">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute top-0 left-0 h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}
