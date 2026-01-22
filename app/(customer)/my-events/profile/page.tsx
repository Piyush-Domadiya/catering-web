"use client";

import { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "@/actions/customer-profile";
import { User, Lock, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-500/20 disabled:opacity-50 w-full sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-5 w-5" />
          Save Changes
        </>
      )}
    </button>
  );
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [state, action] = useActionState(updateProfile, null);

  useEffect(() => {
    if (state?.success && state?.name) {
      update({ name: state.name });
    }
  }, [state, update]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link
          href="/my-events"
          className="p-2 bg-bg-primary rounded-xl border border-border-color hover:bg-bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
          <p className="text-text-secondary">Manage your account settings</p>
        </div>
      </div>

      <div className="bg-bg-primary rounded-[2.5rem] p-8 md:p-10 border border-border-color shadow-sm max-w-2xl">
        <form action={action} className="space-y-8">
          {state?.error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl text-sm font-bold border border-red-100">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100">
              {state.success}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-text-primary border-b border-border-color pb-4">
              Personal Details
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  name="name"
                  type="text"
                  defaultValue={session?.user?.name || ""}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Phone Number
              </label>
              <div className="relative opacity-70">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center font-bold text-text-muted">
                  #
                </span>
                <input
                  type="text"
                  value={session?.user?.phone || ""}
                  disabled
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color font-medium text-text-muted cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-text-muted ml-1">
                Phone number cannot be changed.
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-text-primary border-b border-border-color pb-4">
              Security
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  New Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border-color flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
