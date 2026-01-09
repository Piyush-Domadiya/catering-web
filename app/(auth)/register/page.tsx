"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import {
  Utensils,
  User,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("STAFF");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role }),
      });

      if (res.ok) {
        router.push(
          "/login?message=Account created successfully. Please sign in."
        );
      } else {
        const errorData = await res.text();
        setError(errorData || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-10 md:p-12 border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="text-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-2xl mb-6 shadow-lg shadow-amber-200 dark:shadow-amber-500/20"
            >
              <Utensils className="h-8 w-8 text-white" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Join the Team
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Create your professional account below
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 dark:text-white transition-all font-medium disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="john@testful.com"
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 dark:text-white transition-all font-medium disabled:opacity-50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setRole("ADMIN")}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                    role === "ADMIN"
                      ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-500/20"
                      : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-amber-200 dark:hover:border-amber-500/30"
                  } disabled:opacity-50`}
                >
                  <Shield className="h-4 w-4" />
                  Administrator
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setRole("STAFF")}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                    role === "STAFF"
                      ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-500/20"
                      : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-amber-200 dark:hover:border-amber-500/30"
                  } disabled:opacity-50`}
                >
                  <User className="h-4 w-4" />
                  User
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 dark:text-white transition-all font-medium disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 dark:bg-amber-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-600 transition-all active:scale-[0.98] shadow-xl hover:shadow-amber-200/50 disabled:opacity-50 mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 dark:border-gray-800 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-amber-500 font-bold hover:text-amber-600 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
