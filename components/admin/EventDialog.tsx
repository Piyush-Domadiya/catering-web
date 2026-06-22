"use client";

import { useState, useEffect } from "react";
import { X, Loader2, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import MenuSelector from "@/components/shared/MenuSelector";

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

  interface MenuOption {
    id: string;
    name: string;
    items: string; // JSON string of selected items
  }

  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [error, setError] = useState("");
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);
  const [guestCount, setGuestCount] = useState<string>("");
  const [taxRate, setTaxRate] = useState<string>("0");
  const [discount, setDiscount] = useState<string>("0");
  const [menuModalOpen, setMenuModalOpen] = useState(false);


  const isEditing = !!event;

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchPackages();
      
      let initialOptions: MenuOption[] = [];
      const rawMenu = event?.menuItems || initialData?.menuItems || "";
      
      try {
        const parsed = JSON.parse(rawMenu);
        if (parsed.options && Array.isArray(parsed.options)) {
          initialOptions = parsed.options;
        } else if (Array.isArray(parsed)) {
          // Wrap single menu array in options format (migration)
          initialOptions = [{ id: "1", name: "Menu 1", items: JSON.stringify(parsed) }];
        }
      } catch (e) {
        // Legacy text or empty
        if (rawMenu && !rawMenu.startsWith("[") && !rawMenu.startsWith("{")) {
           initialOptions = [{ id: "1", name: "Menu 1", items: rawMenu }];
        } else {
           initialOptions = [{ id: "1", name: "Menu 1", items: "" }];
        }
      }
      
      setMenuOptions(initialOptions);
      setActiveMenuIndex(0);
      
      setGuestCount(event?.guestCount?.toString() || initialData?.guestCount?.toString() || "");
      setTaxRate(event?.taxRate?.toString() || initialData?.taxRate?.toString() || "0");
      setDiscount(event?.discount?.toString() || initialData?.discount?.toString() || "0");
      setConflictWarning(null); // Reset warning on open
    }
  }, [isOpen, event, initialData]);

  const handleMenuChange = (optionIndex: number, newSelection: string) => {
    setMenuOptions(prev => {
      const updated = [...prev];
      updated[optionIndex] = { ...updated[optionIndex], items: newSelection };
      return updated;
    });
  };

  const addMenuOption = () => {
    const nextId = (menuOptions.length + 1).toString();
    setMenuOptions([...menuOptions, { id: nextId, name: `Menu ${nextId}`, items: "" }]);
    setActiveMenuIndex(menuOptions.length);
  };

  const removeMenuOption = (index: number) => {
    if (menuOptions.length <= 1) return;
    const updated = menuOptions.filter((_, i) => i !== index);
    setMenuOptions(updated);
    setActiveMenuIndex(0);
  };

  const updateMenuName = (index: number, name: string) => {
    setMenuOptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  // Helper to calculate total for a specific option
  const calculateOptionTotal = (itemsJson: string) => {
    try {
      const parsed = JSON.parse(itemsJson);
      if (Array.isArray(parsed)) {
        const base = parsed.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
        const guests = parseInt(guestCount) || 1;
        const subtotal = guests > 1 ? base * guests : base;
        const tax = subtotal * ((parseFloat(taxRate) || 0) / 100);
        const finalDiscount = parseFloat(discount) || 0;
        return Math.max(0, subtotal + tax - finalDiscount);
      }
    } catch (e) {}
    return 0;
  };

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

  const checkAvailability = async (date: string) => {
    if (!date) return;
    try {
      const res = await fetch(`/api/events/check-availability?date=${date}`);
      if (res.ok) {
        const { count } = await res.json();
        if (count > 0) {
          setConflictWarning(
            `Heads up! There are already ${count} event(s) scheduled for this date.`,
          );
        } else {
          setConflictWarning(null);
        }
      }
    } catch (error) {
      console.error("Failed to check availability", error);
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
      guestCount: guestCount ? parseInt(guestCount) : null,
      perPlateCost: 0, // Legacy field, we now use per-menu pricing
      taxRate: taxRate ? parseFloat(taxRate) : 0,
      discount: discount ? parseFloat(discount) : 0,
      menuItems: JSON.stringify({ options: menuOptions }), // Save as multi-menu JSON
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
      <div className="bg-bg-primary rounded-[2.5rem] p-8 md:p-10 max-w-5xl w-full border border-border-color shadow-2xl my-8">
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
            {/* Event Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Event Name *
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={event?.name || initialData?.name || ""}
                  placeholder="Event Name"
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 transition-all font-medium text-text-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Event Type *
                </label>
                <select
                  name="type"
                  defaultValue={event?.type || initialData?.type || ""}
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 transition-all font-medium text-text-primary uppercase tracking-wider text-xs font-black"
                >
                  <option value="">Select Type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Customer *
                </label>
                <select
                  name="customerId"
                  defaultValue={event?.customerId || initialData?.customerId || ""}
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 transition-all font-medium text-text-primary"
                >
                  <option value="">Select customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Venue Location *
                </label>
                <input
                  name="location"
                  type="text"
                  defaultValue={event?.location || initialData?.location || ""}
                  placeholder="e.g. Grand Ballroom, City Hotel"
                  required
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 transition-all font-medium text-text-primary text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Event Date *
                </label>
                <input
                  name="date"
                  type="date"
                  defaultValue={event?.date ? format(new Date(event.date), "yyyy-MM-dd") : ""}
                  onChange={(e) => checkAvailability(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 transition-all font-medium text-text-primary"
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
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 transition-all font-bold text-text-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Guest Count
                </label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 transition-all font-medium text-text-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={event?.status || "UPCOMING"}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 transition-all font-medium text-text-primary"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="QUOTATION">Quotation</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Pricing Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 transition-all font-medium text-text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary ml-1">
                  Discount Amount (₹)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 transition-all font-medium text-text-primary"
                />
              </div>
            </div>

            {/* Multi-Menu Section */}
            <div className="bg-bg-secondary/50 rounded-3xl p-6 border border-border-color space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                  Menu Options
                </h3>
                <button
                  type="button"
                  onClick={addMenuOption}
                  className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-500/10 px-4 py-2 rounded-xl transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Add Option
                </button>
              </div>

              {/* Menu Manage Tabs */}
              <div className="flex flex-wrap gap-3">
                {menuOptions.map((option, idx) => {
                   const total = calculateOptionTotal(option.items);
                   return (
                    <div key={option.id} className="relative group">
                      <div
                        className={`px-4 py-3 rounded-2xl border transition-all text-left min-w-[160px] flex flex-col cursor-default ${
                          activeMenuIndex === idx
                            ? "bg-bg-primary border-amber-500 shadow-md ring-1 ring-amber-500"
                            : "bg-bg-primary text-text-primary border-border-color"
                        }`}
                      >
                         <div className="flex justify-between items-start mb-1">
                            <input
                              value={option.name}
                              onChange={(e) => updateMenuName(idx, e.target.value)}
                              className="text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 w-24 p-0"
                            />
                            {menuOptions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMenuOption(idx)}
                                className="text-text-muted hover:text-red-500 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                         </div>
                         <div className="flex justify-between items-center mt-auto gap-2">
                            <span className="text-sm font-black text-amber-600">₹{total.toFixed(0)}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuIndex(idx);
                                setMenuModalOpen(true);
                              }}
                              className="px-2 py-1 bg-amber-500 text-[9px] font-bold text-white rounded-lg hover:bg-amber-600 transition-colors uppercase tracking-tight"
                            >
                              Edit Items
                            </button>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-bg-secondary text-text-secondary hover:bg-bg-tertiary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isEditing ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>

        {/* Menu Items Modal */}
        {menuModalOpen && menuOptions[activeMenuIndex] && (
           <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[80] p-4">
              <div className="bg-bg-primary rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-2 border-border-color">
                 <div className="p-8 border-b border-border-color flex justify-between items-center bg-bg-secondary/20">
                    <div>
                       <h3 className="text-xl font-bold text-text-primary uppercase tracking-wider italic">
                          Manage: {menuOptions[activeMenuIndex].name}
                       </h3>
                       <p className="text-xs text-text-muted font-bold mt-1">Select items for this proposal</p>
                    </div>
                    <button
                      onClick={() => setMenuModalOpen(false)}
                      className="p-3 bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-500/20 transition-all"
                    >
                      <X className="h-6 w-6" />
                    </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-4 bg-bg-secondary/10">
                    <MenuSelector
                      initialSelection={menuOptions[activeMenuIndex].items}
                      onChange={(val) => handleMenuChange(activeMenuIndex, val)}
                    />
                 </div>
                 
                 <div className="p-6 border-t border-border-color flex justify-center bg-bg-primary">
                    <button
                      onClick={() => setMenuModalOpen(false)}
                      className="px-12 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-amber-600 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                    >
                       Confirm Selections
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
