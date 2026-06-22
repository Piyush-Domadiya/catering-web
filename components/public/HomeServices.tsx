"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Calendar,
  Users,
  Cake,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: UtensilsCrossed,
    title: "Wedding Catering",
    description:
      "Crafting unforgettable culinary experiences for your special day.",
  },
  {
    icon: Cake,
    title: "Birthday Parties",
    description: "Fun, vibrant, and delicious menus for all ages.",
  },
  {
    icon: Users,
    title: "Corporate Catering",
    description:
      "Professional service and sophisticated flavors for your business events.",
  },
  {
    icon: Calendar,
    title: "Festival Catering",
    description:
      "Large-scale catering solutions with rapid service and high quality.",
  },
];

export function HomeServices() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-radial-amber opacity-20 pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Our Premium Services
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto glow-amber-sm rounded-full" />
      </div>

      <div className="flex flex-nowrap md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="premium-card p-8 rounded-[2.5rem] group cursor-pointer hover:border-amber-400/50 dark:hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 min-w-[280px] md:min-w-0 snap-center"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500 glow-amber-sm group-hover:glow-amber">
              <service.icon className="h-7 w-7 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {service.title}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Swipe Indicator */}
      <div className="md:hidden flex flex-col items-center mt-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
          Swipe to explore
        </p>
        <Link
          href="/menu"
          className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2 group"
        >
          View All Services
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
