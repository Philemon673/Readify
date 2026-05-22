"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Bell, Menu, ChevronDown, LogOut } from "lucide-react";
import SearchBar from "../search";

export default function Navbar({ onMenuClick, searchValue }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Get user initial (fallback to U)
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <header className="relative h-16 flex items-center px-6 gap-4 bg-[#080510]/60 backdrop-blur-xl sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.5),_inset_0_1px_0_0_rgba(255,255,255,0.05)] border-b border-white/[0.06] transition-all duration-300">
      {/* Glass Glow Ambient Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(88,47,255,0.12),transparent_75%)] pointer-events-none" />

      {/* Mobile hamburger menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
        aria-label="Open navigation sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <SearchBar value={searchValue} />

      {/* Profile and Bell */}
      <div className="ml-auto flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#582fff] transition-all bg-white/5">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#582fff] rounded-full border-2 border-[#080510]" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#582fff] to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#582fff]/40 group-hover:scale-105 transition-transform duration-200">
              {initial}
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-500 group-hover:text-white transition-all duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Glassmorphic Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2.5 w-52 rounded-xl border border-white/10 p-1.5 shadow-2xl z-30"
              style={{
                background: "rgba(10, 7, 28, 0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="px-3 py-2">
                <p className="text-white text-sm font-semibold truncate">
                  {user?.username || "Guest User"}
                </p>
                <p className="text-gray-400 text-[11px] truncate mt-0.5">
                  {user?.email || "No email linked"}
                </p>
              </div>

              <div className="h-px bg-white/10 my-1.5" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-all text-left"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
