"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Customer {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
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
    packageId?: string | null;
    status: string;
    guestCount?: number | null;
    perPlateCost?: number | null;
    taxRate?: number | null;
    discount?: number | null;
    menuItems?: string | null;
    isQuote?: boolean;
  } | null;
  initialData?: any;
}

export default function EventDialog({
  isOpen,
  onClose,
  onSuccess,
  event,
  initialData,
}: EventDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [error, setError] = useState("");

  const isEditing = !!event;

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchPackages();
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

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
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
      packageId: (formData.get("packageId") as string) || null,
      status: formData.get("status") as string,
      guestCount: formData.get("guestCount")
        ? parseInt(formData.get("guestCount") as string)
        : null,
      perPlateCost: formData.get("perPlateCost")
        ? parseFloat(formData.get("perPlateCost") as string)
        : null,
      taxRate: formData.get("taxRate")
        ? parseFloat(formData.get("taxRate") as string)
        : 0,
      discount: formData.get("discount")
        ? parseFloat(formData.get("discount") as string)
        : 0,
      menuItems: formData.get("menuItems") as string,
      isQuote: formData.get("isQuote") === "on",
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[70] p-4 overflow-y-auto">
      <div className="bg-bg-primary rounded-[2.5rem] p-8 md:p-10 max-w-3xl w-full border border-border-color shadow-2xl my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary">
            {isEditing ? "Edit Event" : "Plan New Event"}
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

        <form
          key={event?.id || "new"}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Row 1: Event Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Event Name *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={event?.name || initialData?.name || ""}
                placeholder="Johnson Wedding"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              />
            </div>

            {/* Row 2: Event Type and Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Event Type *
                </label>
                <select
                  name="type"
                  defaultValue={event?.type || initialData?.type || ""}
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
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
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Customer *
                </label>
                <select
                  key={customers.length}
                  name="customerId"
                  defaultValue={
                    event?.customerId || initialData?.customerId || ""
                  }
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
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

            {/* Row 3: Event Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Event Date *
                </label>
                <input
                  name="date"
                  type="date"
                  defaultValue={
                    event?.date
                      ? format(new Date(event.date), "yyyy-MM-dd")
                      : initialData?.date
                        ? format(new Date(initialData.date), "yyyy-MM-dd")
                        : ""
                  }
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
                  defaultValue={event?.time || initialData?.time || ""}
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
                />
              </div>
            </div>

            {/* Row 4: Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Location *
              </label>
              <input
                name="location"
                type="text"
                defaultValue={event?.location || initialData?.location || ""}
                placeholder="Grand Plaza Hotel"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              />
            </div>

            {/* Row 5: Assigned Package */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Assigned Package
              </label>
              <select
                name="packageId"
                defaultValue={event?.packageId || initialData?.packageId || ""}
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
              >
                <option value="">No Package Selected</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - ₹{pkg.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 6: Status and Quotation Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Status *
                </label>
                <select
                  name="status"
                  defaultValue={
                    event?.status || initialData?.status || "UPCOMING"
                  }
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="QUOTATION">Quotation</option>
                  <option
                    value="COMPLETED"
                    className="text-emerald-600 font-bold"
                  >
                    Completed
                  </option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center md:pt-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      name="isQuote"
                      type="checkbox"
                      defaultChecked={
                        event?.isQuote || initialData?.isQuote || false
                      }
                      disabled={isLoading}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-bg-secondary border border-border-color rounded-full peer peer-checked:bg-amber-500 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7"></div>
                  </div>
                  <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">
                    Save as Quotation
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-bg-secondary/50 rounded-3xl border border-border-color space-y-6">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
              Quotation & Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Guest Count
                </label>
                <input
                  name="guestCount"
                  type="number"
                  defaultValue={
                    event?.guestCount || initialData?.guestCount || ""
                  }
                  placeholder="e.g. 100"
                  disabled={isLoading}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Per Plate Cost (₹)
                </label>
                <input
                  name="perPlateCost"
                  type="number"
                  step="0.01"
                  defaultValue={event?.perPlateCost || ""}
                  placeholder="e.g. 500"
                  disabled={isLoading}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Tax Rate (%)
                </label>
                <input
                  name="taxRate"
                  type="number"
                  step="0.1"
                  defaultValue={event?.taxRate || 0}
                  disabled={isLoading}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Discount Amount (₹)
                </label>
                <input
                  name="discount"
                  type="number"
                  step="0.01"
                  defaultValue={event?.discount || 0}
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary ml-1">
                Menu Selection
              </label>
              <textarea
                name="menuItems"
                defaultValue={event?.menuItems || initialData?.menuItems || ""}
                placeholder="List menu items chosen for this event..."
                rows={4}
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary disabled:opacity-50 resize-none"
              ></textarea>
            </div>
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
                <>{isEditing ? "Update Event" : "Create Event"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
