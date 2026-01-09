"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Calendar, Users, Cake } from "lucide-react";

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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Premium Services
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto glow-amber-sm rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="premium-card p-8 rounded-3xl group cursor-pointer hover-glow"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300 glow-amber-sm group-hover:glow-amber">
              <service.icon className="h-7 w-7 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {service.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
