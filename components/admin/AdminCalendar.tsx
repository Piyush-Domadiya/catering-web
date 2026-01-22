"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
} from "lucide-react";

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

interface CalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export default function AdminCalendar({ events, onEventClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const eventMap = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((event) => {
      const dateStr = format(new Date(event.date), "yyyy-MM-dd");
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(event);
    });
    return map;
  }, [events]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-bg-primary rounded-[2.5rem] border border-border-color shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-8 border-b border-border-color flex items-center justify-between bg-bg-secondary/30">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-lg shadow-amber-500/20">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <p className="text-sm text-text-muted font-medium">
              View and manage your event schedule
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-3 hover:bg-bg-secondary rounded-xl border border-border-color text-text-secondary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-6 py-3 hover:bg-bg-secondary rounded-xl border border-border-color text-text-primary font-bold text-sm transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-3 hover:bg-bg-secondary rounded-xl border border-border-color text-text-secondary transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* WeekDays Header */}
      <div className="grid grid-cols-7 border-b border-border-color bg-bg-secondary/10">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-4 text-center text-xs font-bold text-text-muted uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr min-h-[600px] divide-x divide-y divide-border-color">
        {days.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = eventMap[dateStr] || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={dateStr}
              className={`p-4 min-h-[120px] transition-colors ${
                isCurrentMonth ? "bg-bg-primary" : "bg-bg-secondary/20"
              } ${isToday ? "ring-2 ring-inset ring-amber-500/20" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                    isToday
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                      : isCurrentMonth
                        ? "text-text-primary"
                        : "text-text-muted"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {dayEvents.length}{" "}
                    {dayEvents.length === 1 ? "Event" : "Events"}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={`w-full text-left p-2 rounded-xl text-[10px] font-bold transition-all truncate border border-transparent hover:border-amber-500/50 ${
                      event.status === "COMPLETED"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                        : event.status === "CANCELLED"
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600"
                          : "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <span>{event.time || "No time"}</span>
                    </div>
                    <div className="truncate">{event.name}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
