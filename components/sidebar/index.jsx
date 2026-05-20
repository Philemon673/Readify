"use client";

import { useState } from "react";
import {
  Home,
  Compass,
  LayoutGrid,
  BookOpen,
  Heart,
  Bookmark,
  FolderOpen,
  BookMarked,
  X,
  Sparkles,
  Search as SearchIcon,
  Atom,
  History,
  User,
  Skull,
} from "lucide-react";
import { MdOutlineAutoStories } from "react-icons/md";

const navItems = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Compass },
  { label: "Categories", icon: LayoutGrid },
  { label: "My Library", icon: BookOpen },
  { label: "Favourites", icon: Heart },
  { label: "Want to Read", icon: Bookmark },
  { label: "Collections", icon: FolderOpen },
];

const genres = [
  { label: "Fiction", icon: BookOpen },
  { label: "Fantasy", icon: Sparkles },
  { label: "Mystery", icon: SearchIcon },
  { label: "Romance", icon: Heart },
  { label: "Science Fiction", icon: Atom },
  { label: "History", icon: History },
  { label: "Biography", icon: User },
  { label: "Horror", icon: Skull },
];

export default function Sidebar({ isOpen, onClose }) {
  const [activeNav, setActiveNav] = useState("Home");

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 w-[240px] h-screen overflow-y-auto no-scrollbar bg-[#080510] flex flex-col py-6 px-4 border-r border-white/5 shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between mb-8 px-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#582fff] rounded-lg flex items-center justify-center shadow-lg shadow-[#582fff]/30">
              <MdOutlineAutoStories className="text-white text-lg animate-pulse" />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Readify
            </span>
          </div>

          {/* Close button for mobile view */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 shrink-0">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  if (onClose) onClose(); // close mobile sidebar on navigation
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 w-full text-left group
                  ${isActive
                    ? "bg-[#582fff]/20 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-[#582fff]"
                  }`}
                />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Genres */}
        <div className="mt-8 px-2 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Genres</span>
            <button className="text-[11px] text-[#582fff] hover:text-[#7651ff] transition-colors font-semibold">
              View all
            </button>
          </div>
          <ul className="flex flex-col gap-0.5">
            {genres.map(({ label, icon: Icon }) => (
              <li key={label}>
                <button className="flex items-center gap-3 text-xs font-semibold text-gray-400 hover:text-white w-full px-2 py-2 rounded-lg hover:bg-white/5 transition-all group">
                  <Icon
                    size={14}
                    className="text-gray-600 group-hover:text-[#582fff] transition-colors shrink-0"
                  />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Reading Streak Card */}
        <div className="mt-auto mx-1 rounded-2xl bg-[#0d0a21] border border-white/5 shadow-lg shadow-black/40 overflow-hidden shrink-0 flex flex-col">
          <div className="relative w-full h-[170px] shrink-0">
            <img
              src="/sidebarbadge-readify.png"
              alt="Reading Streak"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 pt-3 flex flex-col items-center text-center">
            <p className="text-white text-sm font-extrabold leading-tight mb-2">
              Make every day<br />a reading day
            </p>
            <p className="text-gray-400 text-[11px] leading-relaxed mb-4 px-2">
              Track your reading progress and build your streak.
            </p>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-600 hover:from-purple-600 hover:via-violet-500 hover:to-fuchsia-500 text-white text-sm px-6 py-2.5 rounded-sm font-semibold transition-all shadow-lg shadow-purple-700/40 hover:shadow-purple-500/50">
              Start Reading
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}