"use client";

import { motion } from "framer-motion";

export function GalleryHeader() {
  return (
    <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden transition-colors duration-500 bg-bg-secondary">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary/30 transition-colors duration-500"></div>

      {/* Animated Glow Effects */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/20 dark:bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300/20 dark:bg-amber-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-bg-primary/60 border border-border-color backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-sm font-medium text-amber-800 dark:text-amber-400 tracking-wide uppercase">
              Visual Journey
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-text-primary tracking-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500">
              Masterpieces
            </span>
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto font-light">
            Explore a curated collection of our finest culinary creations and
            memorable events. Each image tells a story of taste, elegance, and
            passion.
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary to-transparent z-10"></div>
    </div>
  );
}
