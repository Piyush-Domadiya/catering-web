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
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    { id: "notifications", name: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account preferences and business configuration.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessage(null);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${
                activeTab === tab.id
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                  : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white dark:bg-gray-950 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-bold ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          {activeTab === "profile" && (
            <form
              onSubmit={handleProfileUpdate}
              className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex items-center gap-6 pb-8 border-b border-gray-50 dark:border-gray-800">
                <div className="w-24 h-24 rounded-3xl bg-amber-500 flex items-center justify-center text-4xl text-white font-bold shadow-2xl shadow-amber-200/50">
                  {profileData.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profileData.name || "User"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Role: {session?.user?.role || "USER"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form
              onSubmit={handlePasswordUpdate}
              className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-bold">
                  Secure Password Change
                </span>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
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
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
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
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
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
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          )}

          {/* Placeholders for other tabs */}
          {(activeTab === "business" || activeTab === "notifications") && (
            <div className="text-center py-20 text-gray-400">
              <Building className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>These settings are managed by your system administrator.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
