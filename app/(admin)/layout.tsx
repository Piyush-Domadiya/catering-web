"use client";

import Sidebar from "@/components/admin/Sidebar";
import { HeaderActions } from "@/components/shared/HeaderActions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = session?.user as any;
  const userName = user?.name || "User";
  const userRole = user?.role || "STAFF";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    // Check if user is not an admin
    if (status === "authenticated" && userRole !== "ADMIN") {
      redirect("/my-events"); // Redirect non-admin to customer dashboard
    }
  }, [status, userRole]);

  return (
    <div className="flex min-h-screen bg-bg-secondary dark:bg-background transition-colors duration-500">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar aria-label="Sidebar navigation" />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-[60] md:hidden"
            >
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-grow md:ml-72 transition-all duration-300 print:ml-0 print:w-full">
        <header className="h-20 bg-bg-primary/80 dark:bg-bg-primary/50 backdrop-blur-md border-b border-border-color flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 print:hidden">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-bg-secondary dark:hover:bg-bg-tertiary rounded-xl transition-colors md:hidden text-text-primary"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-text-primary truncate max-w-[150px] sm:max-w-none">
              Admin
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <HeaderActions />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-text-primary uppercase tracking-tight">
                {userName}
              </p>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                {userRole === "ADMIN" ? "Administrator" : "Staff Member"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-amber)] flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
              {userInitial}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8 print:p-0 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
