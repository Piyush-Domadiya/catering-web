"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  Users,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      eventType: formData.get("eventType") as string,
      guestCount: formData.get("guestCount") as string,
      eventDate: formData.get("eventDate") as string,
      venueLocation: formData.get("venueLocation") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setIsSuccess(true);
    } catch (err) {
      setError("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-bg-secondary transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary/30 transition-colors duration-500"></div>
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/20 dark:bg-amber-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300/20 dark:bg-amber-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-bg-secondary/60 border border-border-color backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-400 tracking-wide uppercase">
                24/7 Concierge
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-text-primary tracking-tight">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500">
                Touch
              </span>
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto font-light">
              Ready to plan your next extraordinary event? Our team is here to
              bring your vision to life with precision and care.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-bg-primary p-10 rounded-[2.5rem] shadow-2xl border border-border-color relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <h3 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-2">
                Contact Info
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="flex gap-5 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
                      Email Us
                    </p>
                    <p className="text-lg font-bold text-text-primary group-hover/item:text-amber-500 transition-colors">
                      events@testful.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
                      Call Us
                    </p>
                    <p className="text-lg font-bold text-text-primary group-hover/item:text-amber-500 transition-colors">
                      +91 9510616980 <br /> +91 9427474690
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
                      Visit Us
                    </p>
                    <p className="text-lg font-bold text-text-primary group-hover/item:text-amber-500 transition-colors leading-tight">
                      Diamond party plot,
                      <br /> kothariya road, Rajkot, Gujarat
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
                      Office Hours
                    </p>
                    <p className="text-lg font-bold text-text-primary group-hover/item:text-amber-500 transition-colors">
                      Mon - Fri, 9am - 6pm
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-border-color relative z-10">
                <p className="text-sm font-bold text-text-primary mb-6 flex items-center gap-2">
                  Follow Our Journey
                </p>
                <div className="flex gap-4">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-12 h-12 rounded-2xl bg-bg-secondary dark:bg-bg-tertiary flex items-center justify-center text-text-muted hover:bg-amber-500 hover:text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20"
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-bg-primary p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-border-color h-full relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative z-10"
                  >
                    <h3 className="text-3xl font-bold text-text-primary mb-4">
                      Tailor Your Experience
                    </h3>
                    <p className="text-text-secondary mb-10 text-lg">
                      Tell us about your event and our concierge will reach out
                      within 24 hours to begin the planning process.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                          <label className="text-sm font-bold text-text-secondary ml-1 uppercase tracking-wider text-[10px]">
                            Your Name
                          </label>
                          <input
                            required
                            name="name"
                            type="text"
                            placeholder="Jane Cooper"
                            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary placeholder:text-text-muted backdrop-blur-sm"
                          />
                        </div>
                        <div className="space-y-2 group">
                          <label className="text-sm font-bold text-text-secondary ml-1 uppercase tracking-wider text-[10px]">
                            Email Address
                          </label>
                          <input
                            required
                            name="email"
                            type="email"
                            placeholder="jane@example.com"
                            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary placeholder:text-text-muted backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                          <label className="text-sm font-bold text-text-secondary ml-1 uppercase tracking-wider text-[10px]">
                            Event Type
                          </label>
                          <div className="relative">
                            <select
                              name="eventType"
                              required
                              className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
                            >
                              <option value="">Select event type...</option>
                              <option>Wedding</option>
                              <option>Corporate Event</option>
                              <option>Birthday Party</option>
                              <option>Anniversary</option>
                              <option>Other</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 group">
                          <label className="text-sm font-bold text-text-secondary ml-1 uppercase tracking-wider text-[10px]">
                            Approx. Guest Count
                          </label>
                          <div className="relative">
                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                            <input
                              name="guestCount"
                              type="number"
                              placeholder="e.g. 50"
                              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary placeholder:text-text-muted backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                          <label className="text-sm font-bold text-text-secondary ml-1 uppercase tracking-wider text-[10px]">
                            Event Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                            <input
                              name="eventDate"
                              type="date"
                              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 group">
                          <label className="text-sm font-bold text-text-secondary ml-1 uppercase tracking-wider text-[10px]">
                            Venue Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                            <input
                              name="venueLocation"
                              type="text"
                              placeholder="City / Area"
                              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary placeholder:text-text-muted backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 group">
                        <label className="text-sm font-bold text-text-secondary ml-1 uppercase tracking-wider text-[10px]">
                          Special Requirements
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          placeholder="Dietary restrictions, theme ideas, or specific menu requests..."
                          className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-amber-500 focus:outline-none transition-all font-medium resize-none dark:text-white placeholder:text-gray-400 backdrop-blur-sm"
                        />
                      </div>

                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-text-primary text-bg-primary py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-bg-secondary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending Inquiry...
                          </>
                        ) : (
                          <span className="flex items-center gap-2 relative z-10">
                            <Send className="h-5 w-5" />
                            Submit Inquiry
                          </span>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20 relative z-10"
                  >
                    <div className="w-24 h-24 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center text-amber-500 mb-8 ring-4 ring-amber-500/5">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-4xl font-bold text-text-primary mb-4">
                      Inquiry Received!
                    </h3>
                    <p className="text-text-secondary max-w-sm mx-auto text-lg leading-relaxed mb-12">
                      Thank you for choosing Testful Affaire. Our events team is
                      already reviewing your details and will call you shortly.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-amber-500 font-bold hover:text-amber-400 transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" /> Send another inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
