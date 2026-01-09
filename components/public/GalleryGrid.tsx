"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Maximize2, X, Camera } from "lucide-react";

export function GalleryGrid({ events }: { events: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative cursor-pointer"
            onClick={() => setSelectedImage(event.image)}
          >
            <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 dark:bg-gray-900">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-6 right-6 p-4 glass-strong rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-white shadow-lg z-10">
                <Maximize2 className="h-5 w-5" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20">
                    {event.category}
                  </span>
                  {event.time && (
                    <span className="glass px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                      ⏰ {event.time}
                    </span>
                  )}
                  {event.type === "highlight" && (
                    <span className="glass px-2 py-1 rounded-full text-white text-xs flex items-center gap-1">
                      <Camera className="h-3 w-3" /> Featured
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {event.title}
                </h3>

                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 leading-relaxed">
                  {event.description ||
                    "A glimpse into our premium catering service and event management excellence."}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Premium Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-amber-500 p-4 rounded-full hover:bg-white/10 transition-all z-50"
            >
              <X className="h-8 w-8" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-7xl aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
