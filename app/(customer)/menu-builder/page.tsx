"use client";

import { useState, useEffect } from "react";
import {
  Utensils,
  Plus,
  Minus,
  Check,
  Send,
  Save,
  Loader2,
  ShoppingCart,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: {
    id: string;
    name: string;
  };
}

interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
}

interface SelectedItem {
  item: MenuItem;
  quantity: number;
}

export default function CustomerMenuBuilderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch customer data and events
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
        // Fetch customer's events
        const eventsRes = await fetch(`/api/events?customerId=${customer.id}`);
        const eventsData = await eventsRes.json();
        setEvents(eventsData);

        // Check if event ID in URL
        const eventId = searchParams.get("event");
        if (eventId) {
          setSelectedEvent(eventId);
        }
      }

      // Fetch menu items
      const menuRes = await fetch("/api/menu");
      const menuData = await menuRes.json();
      setMenuItems(menuData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    const newSelected = new Map(selectedItems);
    const current = newSelected.get(itemId) || 0;
    const newQuantity = Math.max(0, current + delta);

    if (newQuantity === 0) {
      newSelected.delete(itemId);
    } else {
      newSelected.set(itemId, newQuantity);
    }

    setSelectedItems(newSelected);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedItems.forEach((quantity, itemId) => {
      const item = menuItems.find((i) => i.id === itemId);
      if (item) {
        total += item.price * quantity;
      }
    });
    return total;
  };

  const formatMenuForSave = () => {
    const lines: string[] = [];
    const categorizedItems: Map<string, SelectedItem[]> = new Map();

    selectedItems.forEach((quantity, itemId) => {
      const item = menuItems.find((i) => i.id === itemId);
      if (item) {
        const categoryName = item.category.name;
        if (!categorizedItems.has(categoryName)) {
          categorizedItems.set(categoryName, []);
        }
        categorizedItems.get(categoryName)!.push({ item, quantity });
      }
    });

    categorizedItems.forEach((items, categoryName) => {
      lines.push(`\n${categoryName}:`);
      items.forEach(({ item, quantity }) => {
        lines.push(
          `  - ${item.name} (x${quantity}) - ₹${(item.price * quantity).toFixed(2)}`,
        );
      });
    });

    lines.push(`\n\nTotal Estimated Price: ₹${calculateTotal().toFixed(2)}`);
    return lines.join("\n");
  };

  const handleSaveToEvent = async () => {
    if (!selectedEvent || selectedItems.size === 0) {
      alert("Please select an event and add menu items");
      return;
    }

    setIsSaving(true);
    try {
      const menuText = formatMenuForSave();
      const res = await fetch(`/api/events/${selectedEvent}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItems: menuText }),
      });

      if (res.ok) {
        alert("Menu saved to event successfully!");
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
    if (selectedItems.size === 0) {
      alert("Please select menu items");
      return;
    }

    setIsSaving(true);
    try {
      const menuText = formatMenuForSave();
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

      const selectedEventData = events.find((e) => e.id === selectedEvent);

      const inquiryData = {
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
        eventType: selectedEventData?.type || "Other",
        guestCount: null,
        eventDate: selectedEventData?.date || null,
        venueLocation: null,
        message: `Menu Selection:\n${menuText}`,
        status: "NEW",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      if (res.ok) {
        alert("Inquiry sent successfully! Our team will contact you soon.");
        setSelectedItems(new Map());
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

  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const categoryName = item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Build Your Menu</h1>
        <p className="opacity-90">
          Select items, associate with your event, and save or send as inquiry
        </p>
      </div>

      {/* Event Selector */}
      <div className="bg-bg-primary rounded-[2.5rem] p-6 border border-border-color shadow-sm">
        <label className="text-sm font-bold text-text-secondary mb-3 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Select Event (Optional)
        </label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:border-amber-500 focus:outline-none transition-all font-medium text-text-primary"
        >
          <option value="">New Inquiry (No Event)</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} - {new Date(event.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Items by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([categoryName, items]) => (
          <div
            key={categoryName}
            className="bg-bg-primary rounded-[2.5rem] p-8 border border-border-color shadow-sm"
          >
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-amber-500" />
              {categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const quantity = selectedItems.get(item.id) || 0;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      quantity > 0
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10"
                        : "border-border-color hover:border-amber-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-text-primary text-sm">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-text-muted mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {quantity > 0 && (
                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <div className="flex justify-end mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={quantity === 0}
                          className="p-1.5 rounded-lg bg-bg-secondary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-text-primary">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary & Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-bg-primary rounded-[2.5rem] p-8 border border-border-color shadow-lg sticky bottom-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-sm text-text-muted">Total Estimated Price</p>
                <p className="text-2xl font-bold text-text-primary">
                  ₹{calculateTotal().toFixed(2)}
                </p>
                <p className="text-xs text-text-muted">
                  {selectedItems.size} item types selected
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {selectedEvent && (
                <button
                  onClick={handleSaveToEvent}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  Save to Event
                </button>
              )}
              <button
                onClick={handleSendInquiry}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
