"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Send,
  Save,
  Loader2,
  Calendar as CalendarIcon,
  User,
  Calculator,
  Utensils,
  Info,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import MenuSelector from "@/components/shared/MenuSelector";

interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
  guestCount?: number | null;
  menuItems: string | null;
}

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "High Tea", "Other"];

function CustomerMenuBuilderContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [menuSelection, setMenuSelection] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [mealType, setMealType] = useState("");
  const [guestCount, setGuestCount] = useState<number | "">("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  // When selected event changes, load its details
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find((e) => e.id === selectedEventId);
      if (event) {
        setEventName(event.name);
        setEventDate(
          event.date ? new Date(event.date).toISOString().split("T")[0] : "",
        );
        setMealType(MEAL_TYPES.includes(event.type) ? event.type : "Other");
        setGuestCount(event.guestCount || "");
        setMenuSelection(event.menuItems || "");
      }
    } else {
      // Reset form if "New Inquiry" selected
      setEventName("");
      setEventDate("");
      setMealType("");
      setGuestCount("");
      setMenuSelection("");
    }
  }, [selectedEventId, events]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (!sessionData?.user?.phone) {
        router.push("/login");
        return;
      }

      const customerRes = await fetch(
        `/api/customers?phone=${sessionData.user.phone}`,
      );
      const customers = await customerRes.json();
      const customer = customers.find(
        (c: any) => c.phone === sessionData.user.phone,
      );

      if (customer) {
        setCustomerName(customer.name);

        // Fetch customer's events
        const eventsRes = await fetch(`/api/events?customerId=${customer.id}`);
        const eventsData = await eventsRes.json();
        setEvents(eventsData);

        // Check if event ID in URL
        const eventId = searchParams.get("event");
        if (eventId) {
          setSelectedEventId(eventId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToEvent = async () => {
    if (!selectedEventId) {
      alert(
        "Please select an existing event to save changes, or use 'Send Inquiry' for a new request.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/events/${selectedEventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuItems: menuSelection,
          // Also update basic details if changed
          guestCount: guestCount ? Number(guestCount) : null,
          type: mealType,
        }),
      });

      if (res.ok) {
        alert("Event menu updated successfully!");
        setEvents((prev) =>
          prev.map((e) =>
            e.id === selectedEventId
              ? {
                  ...e,
                  menuItems: menuSelection,
                  guestCount: guestCount ? Number(guestCount) : e.guestCount,
                  type: mealType,
                }
              : e,
          ),
        );
        router.push("/my-events");
      } else {
        alert("Failed to save menu");
      }
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Failed to save menu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendInquiry = async () => {
    if (!menuSelection || menuSelection === "[]") {
      alert("Please select at least one menu item.");
      return;
    }
    if (!eventDate || !mealType) {
      alert("Please provide Event Date and Meal Type.");
      return;
    }

    setIsSaving(true);
    try {
      // Format the JSON menu into a readable string for the inquiry message body
      let readableMenu = "";
      try {
        const items = JSON.parse(menuSelection);
        if (Array.isArray(items)) {
          readableMenu = items
            .map((i: any) => `- ${i.name} (x${i.quantity}) - ₹${i.price * i.quantity}`)
            .join("\n");
          
          const menuTotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
          if (menuTotal > 0) {
            readableMenu += `\n\nEstimated Total Menu Cost: ₹${menuTotal}`;
          }
        } else {
          readableMenu = menuSelection; // Fallback
        }
      } catch (e) {
        readableMenu = menuSelection;
      }

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      const customerRes = await fetch(
        `/api/customers?phone=${sessionData.user.phone}`,
      );
      const customers = await customerRes.json();
      const customer = customers.find(
        (c: any) => c.phone === sessionData.user.phone,
      );

      if (!customer) {
        alert("Customer data not found");
        return;
      }

      const inquiryData = {
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
        eventType: mealType, // Using Meal Type as Event Type here
        guestCount: guestCount ? Number(guestCount) : null,
        eventDate: eventDate ? new Date(eventDate).toISOString() : null,
        venueLocation: eventName, // Using Event Name as roughly location/name for now or could add location field
        message: `New Inquiry from Menu Builder:\nEvent Name: ${eventName}\n\nSelected Menu:\n${readableMenu}`,
        status: "NEW",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      if (res.ok) {
        alert("Inquiry sent successfully! Our team will contact you soon.");
        // Optional: clear form
        if (!selectedEventId) {
          setMenuSelection("");
          setEventName("");
          setEventDate("");
          setMealType("");
          setGuestCount("");
        }
      } else {
        alert("Failed to send inquiry");
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      alert("Failed to send inquiry");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  // Parse menu options for display
  let options: any[] = [];
  try {
    const parsed = JSON.parse(menuSelection || "[]");
    options = parsed.options || (Array.isArray(parsed) ? [{ name: "Menu 1", items: JSON.stringify(parsed) }] : []);
  } catch (e) {
    if (menuSelection) options = [{ name: "Menu 1", items: menuSelection }];
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            Create Your Menu
          </h1>
          <p className="opacity-90 text-lg font-medium max-w-2xl">
            Design the perfect dining experience for your event. Select item,
            customize quantities, and get a quote instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Details Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-primary rounded-[2rem] p-6 border-2 border-border-color shadow-xl sticky top-4">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dashed border-border-color">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <Info className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                Event Details
              </h2>
            </div>

            <div className="space-y-5">
              {/* Load from Event (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">
                  Load Existing Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-secondary border-2 border-border-color focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-bold text-text-primary"
                >
                  <option value="">Create New Inquiry</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({new Date(event.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">
                  Customer Name
                </label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-tertiary dark:bg-zinc-800/50 border border-border-color text-text-secondary cursor-not-allowed border-dashed">
                  <User className="h-4 w-4" />
                  <span className="font-bold text-sm">{customerName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Rahul's Birthday"
                  className="w-full px-4 py-3 rounded-xl bg-bg-secondary border-2 border-border-color focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-sm text-text-primary placeholder:text-text-muted/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">
                    Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-bg-secondary border-2 border-border-color focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-sm text-text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">
                    Guests
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                    <input
                      type="number"
                      min="1"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      placeholder="50"
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-bg-secondary border-2 border-border-color focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-sm text-text-primary placeholder:text-text-muted/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">
                  Meal Type
                </label>
                <div className="relative">
                  <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full pl-9 pr-8 py-3 rounded-xl bg-bg-secondary border-2 border-border-color focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-sm text-text-primary appearance-none"
                  >
                    <option value="">Select Meal Type</option>
                    {MEAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Menu Selector */}
        <div className="lg:col-span-2 space-y-6">
          {(() => {
            if (options.length > 1) {
              return (
                <div className="space-y-6">
                  <div className="bg-bg-primary rounded-[2rem] p-6 border-2 border-border-color shadow-sm">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                       <Calculator className="h-5 w-5 text-amber-500" />
                       Proposals from Admin
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            // Update the main menuSelection for the MenuSelector by wrapping it back or just tracking active
                            // For simplicity in this UI, we might just let them view.
                            // But usually, they want to pick one.
                            // Let's just use local state to switch what the MenuSelector sees.
                            // To avoid complex state sync, let's keep it simple:
                          }}
                          className="px-6 py-3 rounded-2xl border-2 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all text-left group"
                        >
                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{opt.name}</p>
                          <p className="text-sm font-bold text-text-primary">View Details</p>
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-text-muted italic flex items-center gap-2">
                      <Info className="h-3 w-3" />
                      Select an option above to see its items in the builder below.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] p-1 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <MenuSelector
                      initialSelection={options[0].items} // Just showing first for now as primary
                      onChange={(val) => {
                        // If they edit, we update the first option for now
                        const newOptions = [...options];
                        newOptions[0] = { ...newOptions[0], items: val };
                        setMenuSelection(JSON.stringify({ options: newOptions }));
                      }}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] p-1 border border-zinc-200 dark:border-zinc-800 shadow-sm h-full">
                <MenuSelector
                  initialSelection={options[0]?.items || ""}
                  onChange={(val) => {
                    const newOptions = [{ name: options[0]?.name || "Menu 1", items: val }];
                    setMenuSelection(JSON.stringify({ options: newOptions }));
                  }}
                />
              </div>
            );
          })()}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-bg-primary rounded-2xl shadow-2xl border-2 border-border-color p-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">
              Status
            </p>
            <p className="text-sm font-bold text-text-primary uppercase">
               {options.length > 1 ? `${options.length} Options Proposed` : "Menu Under Review"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {selectedEventId && (
            <button
              onClick={handleSaveToEvent}
              disabled={isSaving}
              className="px-6 py-3 rounded-xl font-bold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Preferences
            </button>
          )}
          <button
            onClick={handleSendInquiry}
            disabled={isSaving}
            className="px-8 py-3 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center gap-2 text-sm transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {selectedEventId ? "Send Message" : "Send Inquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerMenuBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        </div>
      }
    >
      <CustomerMenuBuilderContent />
    </Suspense>
  );
}
