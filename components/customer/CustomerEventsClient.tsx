"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Utensils,
  Image as ImageIcon,
  Phone,
  MessageCircle, // WhatsApp similar icon
  Loader2,
  ChevronRight,
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string | null;
  location: string;
  status: string;
  type: string;
}

interface CustomerEventsClientProps {
  settings: any;
}

export default function CustomerEventsClient({
  settings,
}: CustomerEventsClientProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/user/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const contactPhone = settings?.contactPhone || "+91 98765 43210";
  const whatsappNumber = settings?.whatsappNumber || "919876543210";

  return (
    <div className="space-y-12">
      {/* Welcome & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-amber-200 dark:shadow-none">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="opacity-90 max-w-md mb-8">
              Track your upcoming events, plan your perfect menu, and relive the
              memories in our gallery.
            </p>
            <div className="flex gap-4">
              <Link
                href="/plan-menu"
                className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-50 transition-colors"
              >
                <Utensils className="h-5 w-5" />
                Plan New Menu
              </Link>
              <Link
                href="/gallery"
                className="bg-black/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black/30 transition-colors backdrop-blur-md"
              >
                <ImageIcon className="h-5 w-5" />
                View Gallery
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

      {/* Events List */}
      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          Your Events
        </h3>
        {loading ? (
          <div className="flex justify-center py-20 bg-bg-secondary rounded-[2.5rem]">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-bg-secondary rounded-[2.5rem] border border-dashed border-border-color">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4 opacity-50" />
            <h4 className="text-lg font-bold text-text-secondary">
              No events found
            </h4>
            <p className="text-text-muted">
              You haven't booked any events with us yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-bg-primary rounded-[2rem] p-6 border border-border-color shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-2xl text-amber-600 dark:text-amber-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      event.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : event.status === "CANCELLED"
                        ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-text-primary mb-2 line-clamp-1">
                  {event.name}
                </h4>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-6">
                  {event.type}
                </p>

                <div className="space-y-3 border-t border-border-color pt-4">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Clock className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()}
                    {event.time && ` • ${event.time}`}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>

                {/* Future enhancement: Link to specific event details or menu planning for this event */}
                <div className="mt-6 pt-4 border-t border-border-color opacity-0 group-hover:opacity-100 transition-opacity -mb-2">
                  <Link
                    href="/plan-menu"
                    className="flex items-center justify-between text-sm font-bold text-text-primary hover:text-amber-500 transition-colors"
                  >
                    Update Guest Count / Menu
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
