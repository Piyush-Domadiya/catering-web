"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

interface HomeHeroProps {
  settings: {
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    heroImage?: string | null;
  } | null;
}

export function HomeHero({ settings }: HomeHeroProps) {
  const title = settings?.heroTitle || "Making Every Event Tasteful";
  const subtitle =
    settings?.heroSubtitle ||
    "Experience the pinnacle of culinary excellence. We provide bespoke catering solutions tailored to your unique taste, style, and moments.";
  const heroImage =
    settings?.heroImage ||
    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-bg-primary transition-colors duration-700 py-20">
      {/* Dark Mode Background Image */}
      <div className="absolute inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
        <Image
          src={heroImage}
          alt="Catering Background"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
      </div>

      {/* Light Mode Abstract Background */}
      <div className="absolute inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-700 bg-gradient-to-br from-bg-primary via-bg-secondary/40 to-bg-primary">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-amber-200/20 to-transparent rounded-full blur-[130px] translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 z-[1] gradient-mesh opacity-0 dark:opacity-60 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="max-w-3xl"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-bg-secondary/90 text-amber-800 dark:text-amber-400 border border-border-color backdrop-blur-md shadow-sm"
          >
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-black tracking-widest uppercase">
              Premier Catering Services
            </span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black leading-tight mb-8 text-black dark:text-white tracking-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
            className="text-xl md:text-2xl text-black dark:text-gray-100 mb-12 leading-relaxed max-w-2xl font-bold"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/plan-menu"
              className="bg-text-primary text-bg-primary px-10 py-5 rounded-full font-bold flex items-center gap-3 hover:bg-amber-500 hover:text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg w-full sm:w-auto justify-center"
            >
              Start Planning Menu
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="bg-bg-secondary/80 text-text-primary px-10 py-5 rounded-full font-bold border border-border-color hover:bg-bg-primary transition-all hover:shadow-lg active:scale-95 text-lg backdrop-blur-md w-full sm:w-auto justify-center"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[5%] w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[15%] left-[5%] w-80 h-80 bg-amber-600/5 rounded-full blur-3xl"
        />
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
