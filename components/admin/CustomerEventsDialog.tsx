"use client";

import { useEffect, useState } from "react";
import { X, Calendar, MapPin, Loader2, Clock } from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string | null;
  location: string;
  type: string;
  customerId: string;
  status: string;
}

interface CustomerEventsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
  customerName: string;
  onEventClick: (event: Event) => void;
}

export default function CustomerEventsDialog({
  isOpen,
  onClose,
  customerId,
  customerName,
  onEventClick,
}: CustomerEventsDialogProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerEvents();
    }
  }, [isOpen, customerId]);

  // Fetch the list of events for the selected customer when the dialog opens
  const fetchCustomerEvents = async () => {
    if (!customerId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers/${customerId}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch customer events", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-[2.5rem] p-8 max-w-2xl w-full border border-border-color shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Events History
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              For {customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-grow -mr-4 pr-4">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : events.length === 0 ? (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">
              No events found for this customer.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="w-full text-left p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {event.name}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
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

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-500" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      {event.time || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      {event.location}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
