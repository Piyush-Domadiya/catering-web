"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  Info,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { getNotifications, markAsRead } from "@/actions/notifications";

export function HeaderActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };
    fetchNotifications();

    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "ERROR":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-center gap-3 md:gap-4 relative">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2.5 rounded-xl transition-all border border-transparent hover:border-amber-200 ${
            isOpen
              ? "bg-bg-tertiary text-amber-500"
              : "bg-bg-secondary text-text-secondary hover:text-amber-500 hover:bg-bg-tertiary"
          }`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-bg-secondary">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-bg-primary border border-border-color rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-border-color flex items-center justify-between bg-bg-secondary/50">
                  <h3 className="font-bold text-text-primary flex items-center gap-2">
                    <Bell className="h-4 w-4 text-amber-500" />
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-bg-tertiary rounded-lg text-text-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="w-12 h-12 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 text-text-muted">
                        <Bell className="h-6 w-6" />
                      </div>
                      <p className="text-sm text-text-muted font-medium">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border-color">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 transition-colors relative group ${notification.read ? "bg-bg-primary opacity-70" : "bg-amber-50/30 dark:bg-amber-500/5 hover:bg-bg-secondary"}`}
                        >
                          <div className="flex gap-3">
                            <div className="mt-0.5">
                              {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-bold text-text-primary leading-tight ${notification.read ? "font-medium" : ""}`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-text-muted mt-2 font-medium">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkRead(notification.id)}
                                className="p-1.5 hover:bg-emerald-500/10 hover:text-emerald-600 text-text-muted rounded-lg transition-all"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 bg-bg-secondary/30 text-center border-t border-border-color">
                    <button className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider">
                      View all activity
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <ThemeToggle />
    </div>
  );
}
