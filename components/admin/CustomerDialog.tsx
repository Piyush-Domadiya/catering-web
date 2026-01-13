"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface CustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: {
    id: string;
    name: string;
    email?: string | null;
    phone: string;
    address?: string | null;
  } | null;
}

export default function CustomerDialog({
  isOpen,
  onClose,
  onSuccess,
  customer,
}: CustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!customer;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    try {
      const url = isEditing
        ? `/api/customers/${customer.id}`
        : "/api/customers";
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
      <div className="bg-bg-primary rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full border border-border-color shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary">
            {isEditing ? "Edit Customer" : "Add New Customer"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-text-muted" />
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
              <label className="text-sm font-bold text-text-secondary ml-1">
                Full Name *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={customer?.name || ""}
                placeholder="John Doe"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={customer?.email || ""}
                placeholder="john@example.com"
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary ml-1">
              Phone Number *
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={customer?.phone || ""}
              placeholder="+1 234 567 890"
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-800 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary dark:text-white disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary ml-1">
              Address
            </label>
            <textarea
              name="address"
              defaultValue={customer?.address || ""}
              placeholder="123 Main St, City, State"
              rows={3}
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl bg-bg-secondary dark:bg-gray-800 border border-transparent focus:bg-bg-primary dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary dark:text-white disabled:opacity-50"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-bg-secondary text-text-secondary hover:bg-bg-tertiary transition-all disabled:opacity-50"
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
                <>{isEditing ? "Update Customer" : "Add Customer"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
