"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface PackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pkg?: {
    id: string;
    name: string;
    description: string;
    price: number;
    features: string;
    tag?: string;
  } | null;
}

export default function PackageDialog({
  isOpen,
  onClose,
  onSuccess,
  pkg,
}: PackageDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!pkg;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      features: formData.get("features") as string,
      tag: formData.get("tag") as string,
    };

    try {
      const url = isEditing ? `/api/packages/${pkg.id}` : "/api/packages";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save package");
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
            {isEditing ? "Edit Package" : "Create New Package"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Package Name *
            </label>
            <input
              name="name"
              defaultValue={pkg?.name}
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Description *
            </label>
            <textarea
              name="description"
              defaultValue={pkg?.description}
              required
              rows={3}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Price (₹) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={pkg?.price}
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Tag (Optional)
              </label>
              <input
                name="tag"
                defaultValue={pkg?.tag || ""}
                placeholder="e.g. Popular"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Features (Comma separated) *
            </label>
            <textarea
              name="features"
              defaultValue={pkg?.features}
              required
              rows={4}
              placeholder="Welcome Drinks, 3-Course Menu, Table Service..."
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isEditing ? "Update Package" : "Create Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
