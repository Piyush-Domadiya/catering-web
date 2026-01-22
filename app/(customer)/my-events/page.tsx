/**
 * My Events Page - Customer Dashboard
 * This is the customer's main dashboard where they can view all their events
 *
 * Features:
 * - Welcome banner with quick actions
 * - Contact information section
 * - All customer events list
 * - Create new event option
 * - View event photos for completed events
 * - Menu builder integration
 */
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Image as ImageIcon,
  Phone,
  MessageCircle,
  ChevronRight,
  User,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import CustomerEventDialog from "@/components/customer/CustomerEventDialog";

// Event interface - Defines the structure of an event object
interface Event {
  id: string; // Unique event ID
  name: string; // Event name
  date: string; // Event date
  time?: string | null; // Event time (optional)
  location: string; // Event location
  type: string; // Event type (Wedding, Birthday, etc.)
  status: string; // UPCOMING, COMPLETED, CANCELLED
  menuItems?: string | null; // Menu items if selected
  package?: {
    // Selected package (optional)
    name: string;
    price: number;
  } | null;
  images: any[]; // Event photos
}

export default function MyEventsPage() {
  // State management - Current state of the page
  const [events, setEvents] = useState<Event[]>([]); // All customer events
  const [settings, setSettings] = useState<any>(null); // Business settings (phone, whatsapp)
  const [customerData, setCustomerData] = useState<any>(null); // Current customer details
  const [isLoading, setIsLoading] = useState(true); // Is data loading?
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false); // Is event create dialog open?

  // Fetch data when page loads
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Data Fetching Function
   * Fetches customer details and events from API
   */
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Step 1: Check if user is logged in
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (!sessionData?.user?.phone) {
        // Redirect to login if not logged in
        window.location.href = "/login";
        return;
      }

      // Step 2: Fetch customer profile details
      const customerRes = await fetch(
        `/api/customers?phone=${sessionData.user.phone}`,
      );
      const customers = await customerRes.json();
      const customer = customers.find(
        (c: any) => c.phone === sessionData.user.phone,
      );

      if (customer) {
        setCustomerData(customer);

        // Step 3: Fetch all customer events
        const eventsRes = await fetch(`/api/events?customerId=${customer.id}`);
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }

      // Step 4: Fetch business settings (contact info)
      const settingsRes = await fetch("/api/settings");
      const settingsData = await settingsRes.json();
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const contactPhone = settings?.contactPhone || "+91 98765 43210";
  const whatsappNumber = settings?.whatsappNumber || "919876543210";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome & Actions Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-amber-200 dark:shadow-none">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="opacity-90 max-w-md mb-8">
              Track your upcoming events, plan your perfect menu, and relive the
              memories in our gallery.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsEventDialogOpen(true)}
                className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-50 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Create Event
              </button>
              <Link
                href="/menu-builder"
                className="bg-black/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black/30 transition-colors backdrop-blur-md"
              >
                <Utensils className="h-5 w-5" />
                Plan Menu
              </Link>
              <Link
                href="/gallery"
                className="bg-black/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black/30 transition-colors backdrop-blur-md"
              >
                <ImageIcon className="h-5 w-5" />
                View Gallery
              </Link>
              <Link
                href="/my-events/profile"
                className="bg-black/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black/30 transition-colors backdrop-blur-md"
              >
                <User className="h-5 w-5" />
                My Profile
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        </div>

        <div className="bg-bg-primary rounded-[2.5rem] p-8 border border-border-color shadow-sm flex flex-col justify-center">
          <h3 className="text-xl font-bold text-text-primary mb-6">
            Need Assistance?
          </h3>
          <div className="space-y-4">
            <a
              href={`tel:${contactPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary hover:bg-bg-tertiary transition-colors group"
            >
              <div className="bg-bg-primary p-2 rounded-full shadow-sm text-text-primary group-hover:text-amber-500 transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">
                  Call Us
                </p>
                <p className="font-bold text-text-secondary">{contactPhone}</p>
              </div>
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors group"
            >
              <div className="bg-[#25D366] p-2 rounded-full shadow-sm text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#25D366] font-bold uppercase tracking-wider">
                  WhatsApp
                </p>
                <p className="font-bold text-gray-700 dark:text-gray-300">
                  Chat with us
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          Your Events
        </h3>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-bg-primary rounded-[2.5rem] border border-dashed border-border-color">
            <Calendar className="h-16 w-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              No Events Found
            </h3>
            <p className="text-text-secondary mb-6">
              You haven&apos;t created any events yet.
            </p>
            <button
              onClick={() => setIsEventDialogOpen(true)}
              className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg mx-auto"
            >
              <Plus className="h-5 w-5" />
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-bg-primary rounded-[2rem] p-6 border border-border-color shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-2xl text-amber-600 dark:text-amber-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 
                      ${
                        event.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-transparent"
                          : event.status === "UPCOMING"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-transparent"
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-transparent"
                      }`}
                  >
                    {event.status}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">
                  {event.name}
                </h4>
                <p className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">
                  {event.type}
                </p>

                <div className="space-y-3 border-t border-border-color pt-4">
                  <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                    <Clock className="h-4 w-4 text-amber-500" />
                    {new Date(event.date).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                    {event.time && ` • ${event.time}`}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    {event.location}
                  </div>
                  {event.package && (
                    <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                      <Utensils className="h-4 w-4 text-amber-500" />
                      <span>
                        {event.package.name} (₹{event.package.price}/plate)
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border-color flex flex-col gap-3 -mb-2">
                  {event.status === "COMPLETED" && event.images?.length > 0 && (
                    <Link
                      href={`/my-events/${event.id}/photos`}
                      className="flex items-center justify-between text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors"
                    >
                      View Photos
                      <ImageIcon className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/menu-builder?event=${event.id}`}
                    className="flex items-center justify-between text-sm font-bold text-text-primary hover:text-amber-500 transition-colors"
                  >
                    {event.menuItems ? "View/Edit Menu" : "Add Menu"}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {customerData && (
        <CustomerEventDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          onSuccess={() => {
            fetchData();
            setIsEventDialogOpen(false);
          }}
          customerId={customerData.id}
          businessId={customerData.businessId}
        />
      )}
    </div>
  );
}
