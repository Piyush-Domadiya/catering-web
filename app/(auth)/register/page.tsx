"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  User,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle,
  Copy,
  Info,
} from "lucide-react";

type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  role: string;
};

type RegistrationSuccess = {
  success: boolean;
  businessId: string;
  user: RegisteredUser;
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successData, setSuccessData] = useState<RegistrationSuccess | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone as string)) {
      setError("Please enter a valid 10-digit phone number starting with 6-9");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setSuccessData(result);
      } else {
        const errorData = await res.text();
        setError(errorData || "Something went wrong. Please try again.");
      }
    } catch (_err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const SuccessView = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-green-100 dark:bg-green-500/20 rounded-full animate-bounce">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-text-primary">
        Account Created Successfully!
      </h2>
      <p className="text-text-secondary">
        Welcome to Testful Affaire! Your account is ready.
      </p>

      <div className="bg-bg-secondary p-6 rounded-2xl border border-border-color text-left space-y-4">
        <div>
          <label className="text-xs font-bold text-text-secondary uppercase">
            Login Phone
          </label>
          <div className="flex items-center justify-between gap-2 mt-1 p-3 bg-bg-primary rounded-xl border border-border-color">
            <code className="font-mono text-text-primary font-bold">
              {successData?.user.phone}
            </code>
            <button
              onClick={() => copyToClipboard(successData?.user.phone || "")}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
              title="Copy Phone"
            >
              <Copy className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl flex gap-3 text-sm">
          <Info className="h-5 w-5 text-amber-600 gap-2 shrink-0" />
          <p className="text-amber-800 dark:text-amber-200">
            You can now login to view your event history and updates.
          </p>
        </div>
      </div>

      <Link
        href="/login"
        className="block w-full bg-text-primary text-bg-primary py-4 rounded-2xl font-bold hover:bg-amber-500 hover:text-white transition-all active:scale-[0.98] shadow-xl hover:shadow-amber-200/50 mt-8"
      >
        Proceed to Login
      </Link>
    </div>
  );

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
            {!successData && (
              <>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Create Account
                </h1>
                <p className="text-text-secondary font-medium">
                  Register to manage your events
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {successData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SuccessView />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                        Phone Number *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
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
                  </div>

                  {/* Email removed/hidden for simplicity as per request context, but if API supports it we could keep it. 
                      Based on prompt "only admin login rakha hai...", user wants simple flow.
                      However, keeping it minimal: Name, Phone, Password. 
                  */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary ml-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium disabled:opacity-50"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary ml-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          className="w-full pl-12 pr-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium disabled:opacity-50"
                          required
                          minLength={6}
                        />
                      </div>
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
                      Login
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
