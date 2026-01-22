/**
 * Admin Dashboard Page
 * This is the main admin dashboard showing a complete business overview
 *
 * Features:
 * - Business statistics (customers, events, staff)
 * - Recent events list
 * - Top event types
 * - Calendar integration
 * - Quick event creation/editing
 */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  TrendingUp,
  ArrowUpRight,
  Briefcase,
  Star,
  Loader2,
  UserSquare2,
} from "lucide-react";
import EventDialog from "@/components/admin/EventDialog";
import EventDetailDialog from "@/components/admin/EventDetailDialog";
import AdminCalendar from "@/components/admin/AdminCalendar";
import { Modal } from "@/components/shared/Modal";
import Link from "next/link";

// Structure for dashboard statistics
interface DashboardStats {
  totalCustomers: number;
  totalEvents: number;
  totalStaff: number;
  upcomingEvents: number;
  completedEvents: number;
  recentEvents: Array<{
    id: string;
    name: string;
    customer: string;
    customerId: string;
    date: string;
    time?: string | null;
    status: string;
    type: string;
    location: string;
  }>;
  topEventTypes: Array<{
    type: string;
    count: number;
  }>;
}

export default function DashboardPage() {
  // State management
  const [stats, setStats] = useState<DashboardStats | null>(null); // Dashboard statistics
  const [isLoading, setIsLoading] = useState(true); // Is data loading?
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Selected event for editing
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Event edit dialog state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Calendar view modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false); // Event detail view state
  const [detailEvent, setDetailEvent] = useState<any>(null); // Event for detail view
  const [allEvents, setAllEvents] = useState<any[]>([]); // All events for calendar

  // Fetch data when page loads
  useEffect(() => {
    fetchStats();
    fetchAllEvents();
  }, []);

  // Fetch all events for the calendar
  const fetchAllEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setAllEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch all events", error);
    }
  };

  // Fetch dashboard statistics from API
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <h3 className="text-text-primary font-bold mb-1">
          Failed to load dashboard
        </h3>
        <p className="text-text-secondary">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "bg-emerald-500",
      change: "+0%",
    },
    {
      name: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      icon: Calendar,
      color: "bg-amber-500",
      change: "+0%",
    },
    {
      name: "Total Events",
      value: stats.totalEvents.toString(),
      icon: TrendingUp,
      color: "bg-blue-500",
      change: "+0%",
      href: "/events",
    },
    {
      name: "Staff Members",
      value: stats.totalStaff.toString(),
      icon: UserSquare2,
      color: "bg-purple-500",
      change: "+0%",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Business Intelligence
          </h1>
          <p className="text-text-secondary font-medium">
            Overview of your catering business performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="w-12 h-12 bg-bg-primary/50 backdrop-blur-md rounded-2xl border border-border-color shadow-sm flex items-center justify-center text-amber-500 hover:bg-bg-primary hover:scale-105 transition-all group"
            title="Open Event Calendar"
          >
            <Calendar className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex items-center gap-3 bg-bg-primary/50 backdrop-blur-md p-2 rounded-2xl border border-border-color shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-xs">
              AI
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Current Period
              </p>
              <p className="text-sm font-bold text-text-primary">All Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Content = (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.change !== "+0%" && (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                    {stat.change}
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                )}
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1">
                {stat.name}
              </h3>
              <p className="text-3xl font-bold text-text-primary">
                {stat.value}
              </p>
            </div>
          );

          if ((stat as any).href) {
            return (
              <Link key={stat.name} href={(stat as any).href} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-primary p-6 rounded-[2rem] border border-border-color shadow-sm hover:shadow-xl transition-all group h-full cursor-pointer"
                >
                  {Content}
                </motion.div>
              </Link>
            );
          }

          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-primary p-6 rounded-[2rem] border border-border-color shadow-sm hover:shadow-xl transition-all group h-full"
            >
              {Content}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Event Types */}
        <div className="lg:col-span-1 bg-bg-primary rounded-[2.5rem] p-8 border border-border-color shadow-sm">
          <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-amber-500" />
            Top Event Types
          </h3>
          <div className="space-y-6">
            {stats.topEventTypes.length > 0 ? (
              stats.topEventTypes.map((eventType) => (
                <div key={eventType.type} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-text-muted">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-text-primary mb-0.5">
                      {eventType.type}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {eventType.count} events
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No events yet</p>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="lg:col-span-2 bg-bg-primary rounded-[2.5rem] p-8 border border-border-color shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-text-primary">
              Recent Events
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-text-muted text-[10px] font-bold border-b border-border-color tracking-widest">
                  <th className="pb-4 uppercase">Event</th>
                  <th className="pb-4 uppercase">Customer</th>
                  <th className="pb-4 uppercase">Date</th>
                  <th className="pb-4 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {stats.recentEvents.length > 0 ? (
                  stats.recentEvents.map((event) => (
                    <tr
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDialogOpen(true);
                      }}
                      className="group hover:bg-bg-secondary transition-colors cursor-pointer"
                    >
                      <td className="py-5">
                        <p className="font-bold text-text-primary">
                          {event.name}
                        </p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight">
                          {event.type}
                        </p>
                      </td>
                      <td className="py-5">
                        <p className="text-sm text-text-secondary font-medium">
                          {event.customer}
                        </p>
                      </td>
                      <td className="py-5">
                        <p className="text-sm text-text-secondary font-medium">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        {event.time && (
                          <p className="text-xs text-text-muted font-medium mt-0.5">
                            {formatTime(event.time)}
                          </p>
                        )}
                      </td>
                      <td className="py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            event.status === "UPCOMING"
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                              : event.status === "COMPLETED"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                                : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <p className="text-sm text-[var(--text-muted)]">
                        No recent events
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={() => {
          fetchStats();
          fetchAllEvents();
        }}
        event={selectedEvent}
      />

      <Modal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        title="Event Schedule"
        maxWidth="max-w-7xl"
      >
        <div className="min-w-[80vw] md:min-w-[60vw]">
          <AdminCalendar
            events={allEvents}
            onEventClick={(event) => {
              setDetailEvent(event);
              setIsDetailOpen(true);
            }}
          />
        </div>
      </Modal>

      <EventDetailDialog
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailEvent(null);
        }}
        onEdit={() => {
          setSelectedEvent(detailEvent);
          setIsDetailOpen(false);
          setIsDialogOpen(true);
        }}
        event={detailEvent}
      />
    </div>
  );
}
