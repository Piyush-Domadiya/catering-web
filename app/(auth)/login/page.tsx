"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Utensils,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const msg = searchParams.get("message");
    const err = searchParams.get("error");
    if (msg) setMessage(msg);
    if (err)
      setError(err === "CredentialsSignin" ? "Invalid email or password" : err);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        phone,
        password,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        const session = await getSession();

        if (session?.user?.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/my-events");
        }
        router.refresh();
      }
    } catch (_err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary dark:bg-background p-4 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
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
              Welcome Back
            </h1>
            <p className="text-text-secondary font-medium">
              Login to your account
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-medium text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-text-secondary">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
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
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-border-color text-center transition-colors">
            <p className="text-text-secondary font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-amber-500 font-bold hover:text-amber-600 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
