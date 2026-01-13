"use client";

import { useState, useEffect } from "react";
import { Building, Save, Loader2, Globe, Phone, Mail } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-bold ${
            message.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-700 dark:text-blue-400">
        <Building className="h-5 w-5" />
        <span className="text-sm font-bold">Public Contact Information</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary ml-1">
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary ml-1">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-5 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-900 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary ml-1">
            Contact Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-900 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary ml-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-900 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary ml-1">
            WhatsApp Number
          </label>
          <input
            type="tel"
            placeholder="Without + like 919876543210"
            value={formData.whatsappNumber}
            onChange={(e) =>
              setFormData({ ...formData, whatsappNumber: e.target.value })
            }
            className="w-full px-5 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-900 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8 mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-700 dark:text-purple-400">
        <Globe className="h-5 w-5" />
        <span className="text-sm font-bold">Social Media Links</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary ml-1">
            Facebook URL
          </label>
          <input
            type="url"
            value={formData.facebookUrl}
            onChange={(e) =>
              setFormData({ ...formData, facebookUrl: e.target.value })
            }
            className="w-full px-5 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-900 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-secondary ml-1">
            Instagram URL
          </label>
          <input
            type="url"
            value={formData.instagramUrl}
            onChange={(e) =>
              setFormData({ ...formData, instagramUrl: e.target.value })
            }
            className="w-full px-5 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-900 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
          />
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save Business Info
        </button>
      </div>
    </form>
  );
}
