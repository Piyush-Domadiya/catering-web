"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  User,
  MoreVertical,
  Filter,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import EventDialog from "@/components/admin/EventDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import StaffAssignmentDialog from "@/components/admin/StaffAssignmentDialog";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
  status: string;
  customer: {
    id: string;
    name: string;
  };
  _count?: {
    staff: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });
  const [staffAssignmentDialog, setStaffAssignmentDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });

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

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent({
      id: event.id,
      name: event.name,
      date: event.date,
      location: event.location,
      type: event.type,
      customerId: event.customer.id,
      status: event.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!deleteDialog.event) return;

    const res = await fetch(`/api/events/${deleteDialog.event.id}`, {
      method: "DELETE",
    });

    if (res.ok || res.status === 204) {
      await fetchEvents();
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Event Management
          </h1>
          <p className="text-text-secondary">
            Track and organize all your upcoming and past events.
          </p>
        </div>
        <button
          onClick={handleAddEvent}
          className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Plan New Event
        </button>
      </div>

      <div className="bg-bg-primary rounded-[2.5rem] border border-border-color shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border-color flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search events, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-secondary border border-transparent focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all text-text-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-border-color border-t border-border-color">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-8 hover:bg-bg-secondary transition-colors group relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      event.status === "UPCOMING"
                        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                        : event.status === "COMPLETED"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                        : "bg-red-50 dark:bg-red-500/10 text-red-600"
                    }`}
                  >
                    {event.status}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 rounded-xl transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, event })}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-2 truncate group-hover:text-amber-600 transition-colors">
                  {event.name}
                </h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
                  {event.type}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary font-medium">
                    <User className="h-4 w-4 text-amber-500" />
                    {event.customer.name}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-color flex items-center justify-between">
                  <div className="text-xs text-text-muted font-bold">
                    {event._count?.staff || 0} Staff Assigned
                  </div>
                  <button
                    onClick={() =>
                      setStaffAssignmentDialog({ isOpen: true, event })
                    }
                    className="text-xs font-bold text-amber-500 hover:underline"
                  >
                    Manage Staff
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-text-primary font-bold mb-1">
              No events found
            </h3>
            <p className="text-text-muted">
              {searchQuery
                ? "Try a different search or filter."
                : "Plan your first event to get started."}
            </p>
          </div>
        )}
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchEvents}
        event={editingEvent}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, event: null })}
        onConfirm={handleDeleteEvent}
        title="Delete Event?"
        message={`Are you sure you want to delete ${deleteDialog.event?.name}? This action cannot be undone.`}
      />

      {staffAssignmentDialog.event && (
        <StaffAssignmentDialog
          isOpen={staffAssignmentDialog.isOpen}
          onClose={() => {
            setStaffAssignmentDialog({ isOpen: false, event: null });
            fetchEvents(); // Refresh to update staff count
          }}
          eventId={staffAssignmentDialog.event.id}
          eventName={staffAssignmentDialog.event.name}
        />
      )}
    </div>
  );
}
