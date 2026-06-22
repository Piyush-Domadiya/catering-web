"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface HomeTestimonialsProps {
  testimonials: Testimonial[];
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Event Planner, TechCorp",
    content:
      "Tasteful Affaire transformed our annual gala into a legendary experience. The attention to detail and flavor profile were unmatched.",
    rating: 5,
  },
  {
    id: "2",
    name: "Michael & Emily",
    role: "Newlyweds",
    content:
      "Our wedding menu was a dream come true. Our guests are still talking about the truffle arancini weeks later!",
    rating: 5,
  },
  {
    id: "3",
    name: "David Chen",
    role: "Private Client",
    content:
      "Professional, creative, and most importantly, delicious. They handled our 50-person home party with absolute grace.",
    rating: 5,
  },
];

export function HomeTestimonials({ testimonials }: HomeTestimonialsProps) {
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : fallbackTestimonials;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl gradient-radial-amber opacity-20 pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Voices of Satisfaction
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full glow-amber-sm" />
      </div>

      <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-6 md:gap-8 relative z-10 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {displayTestimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="glass p-8 rounded-[2rem] border border-border-color dark:border-gray-800/50 relative group hover:border-amber-400/50 dark:hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 min-w-[300px] md:min-w-0 snap-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <Quote className="absolute top-6 right-8 h-12 w-12 text-amber-500/5 group-hover:text-amber-500/20 transition-all duration-500 rotate-12" />

            <div className="flex gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-500 text-amber-500 glow-amber-sm"
                />
              ))}
            </div>

            <p className="text-text-secondary italic mb-8 relative z-10 leading-relaxed font-medium">
              &quot;{t.content}&quot;
            </p>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-amber-500/10">
                {t.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-text-primary group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {t.name}
                </h4>
                <p className="text-sm text-text-muted">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Swipe Indicator */}
      <div className="md:hidden flex justify-center mt-2">
        <div className="flex gap-1.5 items-center">
          {displayTestimonials.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500/20" />
          ))}
        </div>
      </div>
    </section>
  );
}
