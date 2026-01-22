"use client";

import { useState, useEffect } from "react";
import AdminCalendar from "@/components/admin/AdminCalendar";
import EventDialog from "@/components/admin/EventDialog";
import { Loader2, Plus, LayoutGrid } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string | null;
  location: string;
  type: string;
  status: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
  };
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Event Calendar
          </h1>
          <p className="text-text-secondary">
            Visualize and plan your catering schedule.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="p-3 bg-bg-primary rounded-2xl border border-border-color text-text-secondary hover:text-text-primary transition-all shadow-sm flex items-center gap-2 font-bold text-sm"
          >
            <LayoutGrid className="h-5 w-5" />
            List View
          </Link>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setIsDialogOpen(true);
            }}
            className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-500/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Plan New Event
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        </div>
      ) : (
        <AdminCalendar events={events} onEventClick={handleEventClick} />
      )}

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={fetchEvents}
        event={selectedEvent}
      />
    </div>
  );
}
