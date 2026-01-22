/**
 * CustomerEventDialog Component
 * ===============================
 * यह component customers को अपना event create करने देता है
 * This component allows customers to create their own events
 *
 * Features:
 * - Event details input (name, type, date, location)
 * - Guest count tracking
 * - Optional menu selection
 * - Direct API integration
 */
"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Tag,
  Utensils,
} from "lucide-react";

// Props interface - Properties to control the dialog
interface CustomerEventDialogProps {
  isOpen: boolean; // Is dialog open?
  onClose: () => void; // Function to call on close
  onSuccess: () => void; // Function to call on successful event creation
  customerId: string; // ID of the customer
  businessId: string; // ID of the business
}

export default function CustomerEventDialog({
  isOpen,
  onClose,
  onSuccess,
  customerId,
  businessId,
}: CustomerEventDialogProps) {
  // State management - Tracking component state
  const [isLoading, setIsLoading] = useState(false); // Is form submitting?
  const [error, setError] = useState(""); // Error message if any
  const [showMenuBuilder, setShowMenuBuilder] = useState(false); // Show/hide menu section

  /**
   * Form Submit Handler
   * Runs when customer clicks "Create Event" button
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);
    setError("");

    // Collect all form details
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string, // Event name
      date: formData.get("date") as string, // Event date
      time: formData.get("time") as string, // Event time
      location: formData.get("location") as string, // Event location
      type: formData.get("type") as string, // Event type
      guestCount: formData.get("guestCount")
        ? parseInt(formData.get("guestCount") as string)
        : null, // Guest count
      menuItems: (formData.get("menuItems") as string) || null, // Menu preferences
      customerId, // Customer ID
      businessId, // Business ID
      status: "UPCOMING", // New events are UPCOMING
      isQuote: false, // This is an actual event, not a quote
    };

    try {
      // Create event via API
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create event");
      }

      // Success! Notify parent and close dialog
      onSuccess();
      onClose();
    } catch (err: any) {
      // Show error to user
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[70] p-4 overflow-y-auto">
      <div className="bg-bg-primary rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full border border-border-color shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Create Your Event
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary rounded-xl transition-colors"
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary ml-1">
              Event Name *
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g., My Wedding Celebration"
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Event Type *
              </label>
              <select
                name="type"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              >
                <option value="">Select type...</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guest Count
              </label>
              <input
                name="guestCount"
                type="number"
                placeholder="e.g., 100"
                disabled={isLoading}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Event Date *
              </label>
              <input
                name="date"
                type="date"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Event Time
              </label>
              <input
                name="time"
                type="time"
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary ml-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location *
            </label>
            <input
              name="location"
              type="text"
              placeholder="e.g., Grand Plaza Hotel"
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
            />
          </div>

          <div className="p-6 bg-bg-secondary/50 rounded-3xl border border-border-color space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-500" />
                Menu Selection (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowMenuBuilder(!showMenuBuilder)}
                className="text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors"
              >
                {showMenuBuilder ? "Hide" : "Add Menu"}
              </button>
            </div>

            {showMenuBuilder && (
              <div className="space-y-2">
                <p className="text-xs text-text-muted">
                  Describe your menu preferences, or skip this for now and
                  discuss with our team later.
                </p>
                <textarea
                  name="menuItems"
                  placeholder="Example:&#10;- Veg Starters: Paneer Tikka, Spring Rolls&#10;- Main Course: Dal Makhani, Mix Veg, Naan&#10;- Desserts: Gulab Jamun, Ice Cream"
                  rows={6}
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50 resize-none"
                ></textarea>
              </div>
            )}
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
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
