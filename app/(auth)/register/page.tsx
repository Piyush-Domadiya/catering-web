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
        body: JSON.stringify({ ...data, role: "STAFF" }),
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
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary dark:bg-background p-4 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="bg-bg-primary rounded-[2.5rem] shadow-2xl p-10 md:p-12 border border-border-color transition-colors">
          <div className="text-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-2xl mb-6 shadow-lg shadow-amber-200 dark:shadow-amber-500/20"
            >
              <Utensils className="h-8 w-8 text-white" />
            </Link>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Create Account
            </h1>
            <p className="text-text-secondary font-medium">
              Register to access your account
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
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <input
                    name="email"
                    type="email"
                    placeholder="john@testful.com"
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium disabled:opacity-50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-text-primary text-bg-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all active:scale-[0.98] shadow-xl hover:shadow-amber-200/50 disabled:opacity-50 mt-8"
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

          <div className="mt-10 pt-10 border-t border-border-color text-center transition-colors">
            <p className="text-text-secondary font-medium">
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
