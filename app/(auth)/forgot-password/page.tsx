"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "PHONE" | "OTP" | "RESET" | "SUCCESS";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("PHONE");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        setStep("OTP");
      } else {
        const text = await res.text();
        setError(text || "Failed to send OTP. Please check your phone number.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp, newPassword }),
      });

      if (res.ok) {
        setStep("SUCCESS");
      } else {
        const text = await res.text();
        setError(
          text || "Failed to reset password. Please check your details.",
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-bg-primary rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-border-color">
          <div className="text-center mb-8">
            <Link
              href="/login"
              className="inline-flex items-center justify-center p-2 bg-amber-500 rounded-xl mb-4 shadow-lg shadow-amber-200"
            >
              <Utensils className="h-6 w-6 text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              Reset Password
            </h1>
            <p className="text-text-secondary text-sm font-medium">
              {step === "PHONE" && "Enter your phone to receive OTP"}
              {step === "OTP" && "Enter the 6-digit code sent to you"}
              {step === "RESET" && "Create a new strong password"}
              {step === "SUCCESS" && "Your password has been reset"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "PHONE" && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-text-primary text-bg-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                  {!isLoading && <ArrowRight className="h-5 w-5" />}
                </button>
              </motion.form>
            )}

            {(step === "OTP" || step === "RESET") && (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={
                  step === "OTP"
                    ? (e) => {
                        e.preventDefault();
                        setStep("RESET");
                      }
                    : handleResetPassword
                }
                className="space-y-6"
              >
                {step === "OTP" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary ml-1">
                      Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium"
                        required
                      />
                    </div>
                    <p className="text-xs text-text-muted ml-1 italic">
                      Check your server console/logs for the simulated OTP.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-text-primary transition-all font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(step === "RESET" ? "OTP" : "PHONE")}
                    className="flex-[1] bg-bg-secondary text-text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all border border-border-color"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] bg-text-primary text-bg-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : step === "OTP" ? (
                      "Verify Code"
                    ) : (
                      "Reset Password"
                    )}
                    {!isLoading && <ArrowRight className="h-5 w-5" />}
                  </button>
                </div>
              </motion.form>
            )}

            {step === "SUCCESS" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="p-4 bg-emerald-100 rounded-full">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-text-primary">
                    Success!
                  </h2>
                  <p className="text-text-secondary font-medium">
                    Your password has been successfully updated. You can now
                    login with your new credentials.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="w-full bg-text-primary text-bg-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all shadow-xl"
                >
                  Back to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center pt-6 border-t border-border-color">
            <Link
              href="/login"
              className="text-amber-500 font-bold hover:text-amber-600 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
