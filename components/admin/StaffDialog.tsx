"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface StaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staff?: {
    id: string;
    name: string;
    role: string;
    phone: string;
  } | null;
}

export default function StaffDialog({
  isOpen,
  onClose,
  onSuccess,
  staff,
}: StaffDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!staff;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
    };

    try {
      const url = isEditing ? `/api/staff/${staff.id}` : "/api/staff";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Something went wrong");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full border border-gray-100 dark:border-gray-800 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Full Name *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={staff?.name || ""}
                placeholder="Chef Gordon"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Role *
              </label>
              <select
                name="role"
                defaultValue={staff?.role || ""}
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
              >
                <option value="">Select role...</option>
                <option value="Chef">Chef</option>
                <option value="Manager">Manager</option>
                <option value="Helper">Helper</option>
                <option value="Waiter">Waiter</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Phone Number *
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={staff?.phone || ""}
              placeholder="+1 234 567 890"
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update Staff" : "Add Staff"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
