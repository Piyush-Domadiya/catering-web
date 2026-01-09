"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Utensils,
  UserSquare2,
  Database,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Package,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Events", icon: Calendar, href: "/events" },
  { name: "Highlights", icon: Sparkles, href: "/highlights" },
  { name: "Packages", icon: Package, href: "/packages" },
  { name: "Menu Items", icon: Utensils, href: "/admin-menu" },
  { name: "Staff Management", icon: UserSquare2, href: "/staff" },
  { name: "Create Menu", icon: Utensils, href: "/create-menu" },
  { name: "Backup & Data", icon: Database, href: "/backup" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-gray-400 transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2 h-12">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl truncate">
                Testful
              </span>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all group ${
                  isActive
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "group-hover:text-amber-500"
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-800 space-y-2">
          <Link
            href="/settings"
            className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all hover:bg-gray-800 hover:text-white ${
              pathname === "/settings" ? "bg-gray-800 text-white" : ""
            }`}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
