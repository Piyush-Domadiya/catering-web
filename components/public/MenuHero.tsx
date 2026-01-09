"use client";

import { motion } from "framer-motion";

export function MenuHero() {
  return (
    <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-amber-50/50 dark:bg-black transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/50 to-amber-100/30 dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-500"></div>
      <div className="absolute inset-0 opacity-40 dark:opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-300/20 dark:bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-300/20 dark:bg-amber-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-amber-100 dark:border-white/10 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-sm font-medium text-amber-800 dark:text-amber-400 tracking-wide uppercase">
              Culinary Excellence
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
            Curated{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500">
              Culinary Art
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            Experience a symphony of flavors with our carefully crafted menus.
            From traditional favorites to modern fusion, we serve perfection.
          </p>
        </motion.div>
      </div>

      {/* Decorative fade to content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fdfdfd] dark:from-[#0a0a0a] to-transparent z-10"></div>
    </section>
  );
}
