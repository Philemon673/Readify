"use client";

import { Bell, Menu, ChevronRight } from "lucide-react";
import SearchBar from "../search";

export default function Navbar({ onMenuClick, searchValue }) {
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
        <button className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#582fff] to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#582fff]/40">
            U
          </div>
          <ChevronRight size={14} className="text-gray-500 rotate-90 group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  );
}
