"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  BookOpen,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", href: "/BookCard" },
  { icon: Compass, label: "Discover", href: "/BookCard" },
  { icon: BookOpen, label: "My Library", href: "/BookCard" },
  { icon: Heart, label: "Favorites", href: "/BookCard" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0910] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-900/40">
          <BookOpen size={16} />
        </div>
        <span className="text-white font-extrabold text-lg tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Readify
        </span>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-[#582fff]/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                size={18}
                className={`transition-colors duration-200 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/BookCard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
        >
          <Settings size={18} className="text-gray-400 group-hover:text-white transition-colors" />
          Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 group"
        >
          <LogOut size={18} className="text-gray-400 group-hover:text-rose-400 transition-colors" />
          Log Out
        </Link>
      </div>
    </aside>
  );
}
