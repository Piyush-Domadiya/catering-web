"use client";

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Building,
  Bell,
  Save,
  ShieldCheck,
  Loader2,
  Home,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessInfoForm } from "@/components/admin/BusinessInfoForm";
import { TestimonialManager } from "@/components/admin/TestimonialManager";
import { HomepageSettingsForm } from "@/components/admin/HomepageSettingsForm";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      await update({ name: profileData.name, email: profileData.email });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "My Profile", icon: User },
    { id: "security", name: "Security", icon: Lock },
    { id: "business", name: "Business Info", icon: Building },
    { id: "homepage", name: "Homepage", icon: Home },
    { id: "testimonials", name: "Testimonials", icon: MessageSquare },
    { id: "notifications", name: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">
            Settings
          </h1>
          <p className="text-text-secondary mt-2 text-lg font-medium opacity-80">
            Customize your account and business preferences.
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <div className="w-full lg:w-72 space-y-3">
          <div className="glass-strong p-3 rounded-[2rem] space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage(null);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all relative group ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-text-secondary hover:bg-bg-secondary/50 hover:text-text-primary"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/30 z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon
                  className={`h-5 w-5 relative z-10 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "group-hover:text-amber-500"
                  }`}
                />
                <span className="relative z-10 text-sm">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-strong rounded-[2.5rem] p-8 md:p-12 min-h-[500px]"
            >
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-10 p-5 rounded-2xl text-sm font-bold flex items-center gap-3 border ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500/20"
                      : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/20"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "success"
                        ? "bg-emerald-500/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    {message.type === "success" ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </div>
                  {message.text}
                </motion.div>
              )}

              {activeTab === "profile" && (
                <form onSubmit={handleProfileUpdate} className="space-y-10">
                  <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-border-color/50">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-5xl text-white font-black shadow-2xl shadow-amber-500/40 relative z-10">
                        {profileData.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute inset-0 bg-amber-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-3xl font-black text-text-primary tracking-tight">
                        {profileData.name || "User"}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                        <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/20">
                          {session?.user?.role || "USER"}
                        </span>
                        <span className="text-text-muted text-sm font-medium">
                          {profileData.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-text-primary text-bg-primary px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-text-primary/10 active:scale-95 disabled:opacity-50 group"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handlePasswordUpdate} className="space-y-10">
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-6 mb-8 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-text-primary">
                        Password Security
                      </h4>
                      <p className="text-sm text-text-muted font-medium">
                        Ensure your account stays safe with a strong password.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-black text-text-muted uppercase tracking-widest ml-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="w-full px-6 py-4 rounded-2xl bg-bg-secondary/50 border border-border-color/50 focus:bg-bg-primary focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 focus:outline-none transition-all font-bold text-text-primary shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-text-primary text-bg-primary px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-text-primary/10 active:scale-95 disabled:opacity-50 group"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Lock className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      )}
                      Update Password
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "business" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <BusinessInfoForm />
                </div>
              )}

              {activeTab === "homepage" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <HomepageSettingsForm />
                </div>
              )}

              {activeTab === "testimonials" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <TestimonialManager />
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-bg-secondary flex items-center justify-center mb-6">
                    <Bell className="h-10 w-10 text-text-muted opacity-20" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">
                    Notification Center
                  </h3>
                  <p className="text-text-muted mt-2 font-medium max-w-sm mx-auto">
                    Advanced push and email notification settings are coming in
                    a future update.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
