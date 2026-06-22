"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Plus, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchTestimonials();
        setFormData({ name: "", role: "", content: "", rating: 5 });
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Failed to add testimonial", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error("Failed to delete testimonial", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-text-primary">
            Testimonials
          </h3>
          <p className="text-text-muted mt-1">
            Manage customer reviews displayed on your homepage
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Testimonial
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-bg-primary border border-border-color rounded-[2rem] p-8"
          >
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-text-muted uppercase tracking-widest">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-bold text-text-primary"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-text-muted uppercase tracking-widest">
                    Role
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-bold text-text-primary"
                    placeholder="CEO, Company Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-text-muted uppercase tracking-widest">
                  Review Content
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary resize-none"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-text-muted uppercase tracking-widest">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= formData.rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-amber-600 transition-all"
                >
                  Save Testimonial
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-bg-secondary text-text-primary px-8 py-3 rounded-2xl font-bold hover:bg-bg-tertiary transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-bg-primary rounded-[2rem] border border-dashed border-border-color">
            <MessageSquare className="h-16 w-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              No Testimonials Yet
            </h3>
            <p className="text-text-secondary">
              Add your first customer review to showcase on your homepage
            </p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-bg-primary border border-border-color rounded-[2rem] p-6 relative group hover:shadow-xl transition-all"
            >
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              <p className="text-text-secondary italic mb-6 line-clamp-4">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
