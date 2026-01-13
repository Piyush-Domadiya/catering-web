"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-bg-primary transition-colors duration-700 py-20">
      {/* Dark Mode Background Image */}
      <div className="absolute inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
        <Image
          src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
          alt="Catering Background"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
      </div>

      {/* Light Mode Abstract Background */}
      <div className="absolute inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-700 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary/30">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-amber-200/20 to-transparent rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 z-[1] gradient-mesh opacity-30 dark:opacity-60 mix-blend-overlay dark:mix-blend-normal pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-bg-secondary/80 text-amber-700 dark:text-amber-400 border border-border-color backdrop-blur-md shadow-sm">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-bold tracking-wide uppercase">
              Premier Catering Services
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 text-text-primary tracking-tight">
            Making Every Event{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500">
                Testful
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-200/40 dark:bg-amber-500/20 -rotate-2 -z-0 rounded-full blur-sm"></span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed max-w-2xl font-light">
            Experience the pinnacle of culinary excellence. We provide bespoke
            catering solutions tailored to your unique taste, style, and
            moments.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/plan-menu"
              className="bg-text-primary text-bg-primary px-10 py-5 rounded-full font-bold flex items-center gap-3 hover:bg-amber-500 hover:text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg"
            >
              Start Planning Menu
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="bg-bg-secondary/80 text-text-primary px-10 py-5 rounded-full font-bold border border-border-color hover:bg-bg-primary transition-all hover:shadow-lg active:scale-95 text-lg backdrop-blur-md"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center p-1 opacity-50">
          <div className="w-1 h-3 rounded-full bg-text-muted animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}
