/**
 * Navbar Component
 * This is the main navigation bar that appears on every page
 *
 * Features:
 * - Responsive design (mobile + desktop)
 * - Role-based navigation (Admin vs Customer vs Guest)
 * - Theme toggle
 * - Scroll-based styling
 * - User authentication status
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Utensils,
  LogIn,
  Menu as MenuIcon,
  X,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderActions } from "./HeaderActions";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Navigation links - For all public pages
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname(); // Current page path
  const { data: session, status } = useSession(); // User login status
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [scrolled, setScrolled] = useState(false); // Page scroll state

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-md border-b border-border-color py-0 shadow-lg"
          : "bg-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2.5 rounded-xl shadow-lg group-hover:glow-amber transition-all duration-300">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-amber-800 dark:group-hover:from-amber-400 dark:group-hover:to-amber-600 transition-all duration-300">
              Testful Affaire
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="bg-bg-secondary/50 backdrop-blur-sm px-6 py-2 rounded-full hidden lg:flex items-center gap-6 border border-border-color/50">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-all hover:text-amber-500 relative py-1 ${
                    pathname === link.href
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-text-secondary"
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-4">
              <HeaderActions />

              {status === "authenticated" ? (
                <div className="flex items-center gap-3">
                  {session.user.role === "ADMIN" ? (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-text-secondary font-medium hover:text-amber-500 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      href="/my-events"
                      className="flex items-center gap-2 text-text-secondary font-medium hover:text-amber-500 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden xl:inline">My Events</span>
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 bg-text-primary text-bg-primary px-5 py-2.5 rounded-full text-sm font-medium hover:bg-amber-500 hover:text-white transition-all active:scale-95 border border-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95 glow-amber hover:glow-amber-lg"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <HeaderActions />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary p-2 hover:bg-bg-secondary rounded-full transition-colors"
            >
              {isOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-primary/95 backdrop-blur-md border-b border-border-color overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-xl transition-all ${
                    pathname === link.href
                      ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "text-text-secondary hover:bg-bg-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-border-color flex flex-col gap-3">
                {status === "authenticated" ? (
                  <>
                    {session.user.role === "ADMIN" ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 w-full bg-text-primary text-bg-primary px-5 py-3 rounded-xl justify-center font-medium"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/my-events"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 w-full bg-text-primary text-bg-primary px-5 py-3 rounded-xl justify-center font-medium"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        My Events
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-5 py-3 rounded-xl justify-center font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-3 rounded-xl text-center justify-center font-bold glow-amber"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 w-full border border-border-color text-text-secondary px-5 py-3 rounded-xl text-center justify-center font-medium hover:bg-bg-secondary"
                    >
                      <User className="h-4 w-4" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
