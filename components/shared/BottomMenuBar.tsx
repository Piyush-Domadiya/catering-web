"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  Image as ImageIcon,
  Mail,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Menu", href: "/menu", icon: UtensilsCrossed },
  { name: "Plan", href: "/plan-menu", icon: PlusCircle, highlight: true },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Contact", href: "/contact", icon: Mail },
];

export function BottomMenuBar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100]">
      <nav className="bg-bg-primary/80 backdrop-blur-xl border border-border-color/50 rounded-[2rem] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex justify-between items-center relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 gradient-mesh opacity-20 pointer-events-none"></div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-6"
              >
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-full shadow-lg shadow-amber-500/40 text-white active:scale-95 transition-transform border-4 border-bg-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
                isActive
                  ? "text-amber-600 dark:text-amber-400 scale-110"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold uppercase tracking-tighter">
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -bottom-1 w-1 h-1 bg-amber-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
