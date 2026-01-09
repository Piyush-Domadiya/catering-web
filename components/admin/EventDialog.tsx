"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
}

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: {
    id: string;
    name: string;
    date: string;
    time?: string | null;
    location: string;
    type: string;
    customerId: string;
    status: string;
  } | null;
}

export default function EventDialog({
  isOpen,
  onClose,
  onSuccess,
  event,
}: EventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");

  const isEditing = !!event;

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  // Fetch customers to populate the customer selection dropdown
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  // Handle form submission for creating or updating an event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
      customerId: formData.get("customerId") as string,
      status: formData.get("status") as string,
    };

    try {
      const url = isEditing ? `/api/events/${event.id}` : "/api/events";
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 max-w-3xl w-full border border-gray-100 dark:border-gray-800 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Event" : "Plan New Event"}
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

        <form
          key={event?.id || "new"}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Event Name *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={event?.name || ""}
                placeholder="Johnson Wedding"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Event Date *
              </label>
              <input
                name="date"
                type="date"
                defaultValue={
                  event?.date
                    ? new Date(event.date).toISOString().split("T")[0]
                    : ""
                }
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Event Time
              </label>
              <input
                name="time"
                type="time"
                defaultValue={event?.time || ""}
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Location *
            </label>
            <input
              name="location"
              type="text"
              defaultValue={event?.location || ""}
              placeholder="Grand Plaza Hotel"
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Event Type *
              </label>
              <select
                name="type"
                defaultValue={event?.type || ""}
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
              >
                <option value="">Select type...</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                Customer *
              </label>
              <select
                key={customers.length}
                name="customerId"
                defaultValue={event?.customerId || ""}
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
              >
                <option value="">Select customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              Status *
            </label>
            <select
              name="status"
              defaultValue={event?.status || "UPCOMING"}
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-amber-500 focus:outline-none transition-all font-medium text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETED" className="text-emerald-600 font-bold">
                Completed
              </option>
              <option value="CANCELLED">Cancelled</option>
            </select>
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
                <>{isEditing ? "Update Event" : "Create Event"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
