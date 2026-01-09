"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HighlightCard({
  item,
  index,
  onClick,
}: {
  item: any;
  index: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={item.image || item.imageUrl}
        alt={item.title || "Highlight"}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />
      {/* Subtle dark overlay on hover only */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
    </motion.div>
  );
}
