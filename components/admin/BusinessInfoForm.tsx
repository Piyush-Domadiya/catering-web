"use client";

import { useState, useEffect } from "react";
import { Building, Save, Loader2, Globe, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function BusinessInfoForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    address: "",
    facebookUrl: "",
    instagramUrl: "",
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
          companyName: data.companyName || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          whatsappNumber: data.whatsappNumber || "",
          address: data.address || "",
          facebookUrl: data.facebookUrl || "",
          instagramUrl: data.instagramUrl || "",
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
        setMessage({ type: "success", text: "Settings saved successfully!" });
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

      <div className="bg-blue-500/5 border border-blue-500/10 rounded-[2rem] p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Building className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h4 className="font-black text-text-primary">Contact Information</h4>
          <p className="text-sm text-text-muted font-medium">
            This information will be displayed on your public profile.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Company Name
          </label>
          <div className="relative group">
            <Building className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
              placeholder="Your Brand Name"
            />
          </div>
        </div>
        <div className="space-y-3 md:col-span-2 lg:col-span-1">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Business Address
          </label>
          <div className="relative group">
            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
              placeholder="City, State, Country"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Support Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-amber-500 transition-colors" />
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
              placeholder="support@example.com"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Phone Number
          </label>
          <div className="relative group">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-amber-500 transition-colors" />
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            WhatsApp Number
          </label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-text-muted group-focus-within:text-amber-500 transition-colors">
              91
            </div>
            <input
              type="tel"
              placeholder="9876543210"
              value={formData.whatsappNumber}
              onChange={(e) =>
                setFormData({ ...formData, whatsappNumber: e.target.value })
              }
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-purple-500/5 border border-purple-500/10 rounded-[2rem] p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <Globe className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h4 className="font-black text-text-primary">Social Presence</h4>
          <p className="text-sm text-text-muted font-medium">
            Connect your social media accounts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Facebook Profile
          </label>
          <input
            type="url"
            value={formData.facebookUrl}
            onChange={(e) =>
              setFormData({ ...formData, facebookUrl: e.target.value })
            }
            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
            placeholder="https://facebook.com/yourpage"
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
            Instagram Handle
          </label>
          <input
            type="url"
            value={formData.instagramUrl}
            onChange={(e) =>
              setFormData({ ...formData, instagramUrl: e.target.value })
            }
            className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
            placeholder="https://instagram.com/yourhandle"
          />
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
          Update Business Info
        </button>
      </div>
    </form>
  );
}
