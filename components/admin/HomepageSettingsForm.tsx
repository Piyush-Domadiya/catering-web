"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Home, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export function HomepageSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    aboutTitle: "",
    aboutDescription: "",
    aboutImage: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroImage: data.heroImage || "",
          aboutTitle: data.aboutTitle || "",
          aboutDescription: data.aboutDescription || "",
          aboutImage: data.aboutImage || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Homepage settings saved successfully!",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
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
    <form onSubmit={handleSubmit} className="space-y-10">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl text-sm font-bold flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500/20"
              : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/20"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
            }`}
          >
            <Save className="h-4 w-4" />
          </div>
          {message.text}
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Home className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h4 className="font-black text-text-primary">Hero Section</h4>
          <p className="text-sm text-text-muted font-medium">
            Main banner content displayed at the top of your homepage
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Hero Title
          </label>
          <input
            type="text"
            value={formData.heroTitle}
            onChange={(e) =>
              setFormData({ ...formData, heroTitle: e.target.value })
            }
            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
            placeholder="Making Every Event Tasteful"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Hero Subtitle
          </label>
          <textarea
            value={formData.heroSubtitle}
            onChange={(e) =>
              setFormData({ ...formData, heroSubtitle: e.target.value })
            }
            rows={3}
            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-medium text-text-primary shadow-sm resize-none"
            placeholder="Experience the pinnacle of culinary excellence..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Hero Background Image URL
          </label>
          <div className="relative group">
            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-amber-500 transition-colors" />
            <input
              type="url"
              value={formData.heroImage}
              onChange={(e) =>
                setFormData({ ...formData, heroImage: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
              placeholder="https://example.com/hero-image.jpg"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-[2rem] p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <ImageIcon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h4 className="font-black text-text-primary">About Us Section</h4>
          <p className="text-sm text-text-muted font-medium">
            Tell your story and showcase your expertise
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            About Title
          </label>
          <input
            type="text"
            value={formData.aboutTitle}
            onChange={(e) =>
              setFormData({ ...formData, aboutTitle: e.target.value })
            }
            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
            placeholder="A Passion for Food and Unforgettable Moments"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            About Description
          </label>
          <textarea
            value={formData.aboutDescription}
            onChange={(e) =>
              setFormData({ ...formData, aboutDescription: e.target.value })
            }
            rows={4}
            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-medium text-text-primary shadow-sm resize-none"
            placeholder="At Tasteful Affaire, we believe that every event is an opportunity to create a masterpiece..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            About Image URL
          </label>
          <div className="relative group">
            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-amber-500 transition-colors" />
            <input
              type="url"
              value={formData.aboutImage}
              onChange={(e) =>
                setFormData({ ...formData, aboutImage: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
              placeholder="https://example.com/about-image.jpg"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-text-primary text-bg-primary px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-text-primary/10 active:scale-95 disabled:opacity-50 group"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
          )}
          Update Homepage Settings
        </button>
      </div>
    </form>
  );
}
