"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ArrowRight,
  Flame,
  Crown,
  Menu,
} from "lucide-react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import BookModal from "../searchresults/bookmodal";
import { bookService } from "@/app/services/bookService";

/* ─── DATA ──────────────────────────────────────────────────────────── */
// Mock data removed in favor of dynamic API fetching

/* ─── API → UI NORMALIZER ────────────────────────────────────────────── */
const DASHBOARD_GRADIENTS = [
  { bg: "from-red-900 via-red-800 to-yellow-900",       color: "#fcd34d" },
  { bg: "from-emerald-900 via-green-800 to-teal-900",   color: "#6ee7b7" },
  { bg: "from-sky-900 via-blue-800 to-indigo-900",      color: "#93c5fd" },
  { bg: "from-violet-900 via-purple-800 to-fuchsia-900",color: "#d8b4fe" },
  { bg: "from-slate-900 via-gray-800 to-zinc-900",      color: "#cbd5e1" },
  { bg: "from-amber-900 via-orange-800 to-red-900",     color: "#fbbf24" },
  { bg: "from-indigo-900 via-violet-800 to-purple-900", color: "#a5b4fc" },
];

function mapDashboardBook(apiBook, index) {
  const style = DASHBOARD_GRADIENTS[index % DASHBOARD_GRADIENTS.length];
  return {
    id:           apiBook.id,
    title:        apiBook.title,
    author:       Array.isArray(apiBook.authors)
                    ? apiBook.authors.join(", ")
                    : (apiBook.author || "Unknown Author"),
    rating:       apiBook.averageRating || 4.5,
    pages:        apiBook.pageCount     || 320,
    desc:         apiBook.description   || "No description available.",
    year:         apiBook.publishedDate ? apiBook.publishedDate.split("-")[0] : "2024",
    genre:        apiBook.categories?.length ? apiBook.categories[0] : "Fiction",
    thumbnail:    apiBook.thumbnail     || null,
    bg:           style.bg,
    color:        style.color,
    isReadable:   apiBook.isReadable    ?? false,
    webReaderLink:apiBook.webReaderLink ?? null,
  };
}

/* ─── COVER ILLUSTRATOR (PREMIUM CSS BOOK ART) ───────────────────────── */
function BookCoverIllustration({ book }) {
  switch (book.title) {
    case "A Curse So Dark and Lonely":
      return (
        <div className="absolute inset-0 bg-[#070415] flex flex-col justify-between p-3 border-r border-purple-500/10">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(1px_1px_at_20px_30px,#fff,transparent),radial-gradient(1px_1px_at_75px_120px,#fff,transparent),radial-gradient(1px_1px_at_120px_50px,#fff,transparent)]" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-purple-400/80 font-bold uppercase tracking-wider">A CURSE</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10 py-1">
            <span className="text-[12px] text-purple-300 font-extrabold leading-tight text-center tracking-wide font-serif" style={{ textShadow: "0 2px 6px rgba(139,92,246,0.5)" }}>
              SO DARK
            </span>
            <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest mt-0.5">AND</span>
            <span className="text-[12px] text-purple-300 font-extrabold leading-tight text-center tracking-wide font-serif mt-0.5" style={{ textShadow: "0 2px 6px rgba(139,92,246,0.5)" }}>
              LONELY
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-gray-500 font-semibold">BRIGID KEMMERER</span>
          </div>
        </div>
      );
    case "The Atlas Six":
      return (
        <div className="absolute inset-0 bg-[#16171d] flex flex-col justify-between p-3 border-r border-slate-500/10">
          <div className="absolute inset-0 opacity-25 border border-slate-600/40 rounded-full scale-75 transform -translate-y-4" />
          <div className="absolute inset-0 opacity-25 border border-slate-600/40 rounded-full scale-50 transform translate-y-4" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">THE</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[13px] text-slate-200 font-extrabold tracking-widest text-center font-sans">
              ATLAS
            </span>
            <span className="text-[15px] text-amber-400 font-extrabold tracking-widest text-center mt-0.5">
              SIX
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-slate-500 font-semibold">OLIVIE BLAKE</span>
          </div>
        </div>
      );
    case "The Seven Husbands of Evelyn Hugo":
      return (
        <div className="absolute inset-0 bg-[#061e14] flex flex-col justify-between p-3 border-r border-emerald-500/10">
          <div className="absolute inset-x-2 top-2 bottom-2 border border-emerald-700/30 opacity-40 rounded-lg" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-emerald-400/85 font-bold uppercase tracking-wider">THE SEVEN</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[11px] text-emerald-300 font-extrabold leading-tight text-center tracking-wide" style={{ textShadow: "0 2px 4px rgba(16,185,129,0.3)" }}>
              HUSBANDS
            </span>
            <span className="text-[8px] text-emerald-400 font-bold uppercase my-0.5">OF</span>
            <span className="text-[12px] text-amber-300 font-extrabold leading-tight text-center tracking-wider">
              EVELYN HUGO
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-emerald-600 font-semibold">TAYLOR J. REID</span>
          </div>
        </div>
      );
    case "Iron Flame":
      return (
        <div className="absolute inset-0 bg-[#240a04] flex flex-col justify-between p-3 border-r border-orange-500/10">
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(ellipse_at_bottom,#ef4444,transparent_70%)]" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider">REBECCA YARROS</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[16px] text-orange-500 font-black tracking-tighter text-center leading-none uppercase" style={{ textShadow: "0 2px 8px rgba(239,68,68,0.6)" }}>
              IRON
            </span>
            <span className="text-[16px] text-amber-500 font-black tracking-tighter text-center leading-none uppercase mt-0.5" style={{ textShadow: "0 2px 8px rgba(245,158,11,0.6)" }}>
              FLAME
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-amber-500/60 font-extrabold">BOOK TWO</span>
          </div>
        </div>
      );
    case "The Teacher":
      return (
        <div className="absolute inset-0 bg-[#061320] flex flex-col justify-between p-3 border-r border-sky-500/10">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-12 h-16 border-2 border-sky-400 rounded-sm" />
          </div>
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[7px] text-sky-400 font-bold uppercase tracking-widest leading-none">BESTSELLER</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[13px] text-sky-300 font-bold tracking-widest text-center leading-tight uppercase">
              THE
            </span>
            <span className="text-[15px] text-white font-extrabold tracking-wider text-center leading-tight uppercase mt-0.5" style={{ textShadow: "0 2px 6px rgba(14,165,233,0.4)" }}>
              TEACHER
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-sky-500 font-semibold">FREIDA MCFADDEN</span>
          </div>
        </div>
      );
    case "Fourth Wing":
      return (
        <div className="absolute inset-0 bg-[#2d2212] flex flex-col justify-between p-3 border-r border-amber-500/10">
          <div className="absolute inset-0 opacity-15 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400" />
          </div>
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-amber-500 font-bold uppercase tracking-wider">REBECCA YARROS</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[14px] text-amber-400 font-extrabold tracking-tight text-center leading-tight uppercase" style={{ textShadow: "0 2px 6px rgba(245,158,11,0.4)" }}>
              FOURTH
            </span>
            <span className="text-[14px] text-amber-300 font-extrabold tracking-tight text-center leading-tight uppercase mt-0.5">
              WING
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-amber-600 font-extrabold">EMPYREAN</span>
          </div>
        </div>
      );
    case "The Night Circus":
      return (
        <div className="absolute inset-0 bg-[#0e0e11] flex flex-col justify-between p-3 border-r border-gray-500/10 overflow-hidden">
          <div className="absolute inset-0 opacity-5 flex flex-row justify-around">
            <div className="w-px h-full bg-white" />
            <div className="w-px h-full bg-white" />
          </div>
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">ERIN MORGENSTERN</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[12px] text-gray-300 font-extrabold tracking-widest text-center leading-tight uppercase">
              THE
            </span>
            <span className="text-[14px] text-white font-extrabold tracking-wider text-center leading-tight uppercase mt-0.5">
              NIGHT
            </span>
            <span className="text-[14px] text-[#ef4444] font-black tracking-widest text-center leading-tight uppercase mt-0.5" style={{ textShadow: "0 2px 6px rgba(239,68,68,0.4)" }}>
              CIRCUS
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-gray-500 font-semibold">A NOVEL</span>
          </div>
        </div>
      );
    case "The House in the Cerulean Sea":
      return (
        <div className="absolute inset-0 bg-[#072428] flex flex-col justify-between p-3 border-r border-teal-500/10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#2dd4bf,transparent_60%)]" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-teal-400 font-bold uppercase tracking-wider">TJ KLUNE</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[9px] text-teal-300 font-bold tracking-widest uppercase">THE HOUSE IN THE</span>
            <span className="text-[13px] text-teal-200 font-extrabold tracking-normal text-center leading-tight uppercase mt-0.5" style={{ textShadow: "0 2px 6px rgba(45,212,191,0.4)" }}>
              CERULEAN
            </span>
            <span className="text-[15px] text-amber-300 font-black tracking-normal text-center leading-tight uppercase mt-0.5">
              SEA
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-teal-600 font-semibold">BESTSELLER</span>
          </div>
        </div>
      );
    case "Heir of Fire":
      return (
        <div className="absolute inset-0 bg-[#051c0f] flex flex-col justify-between p-3 border-r border-emerald-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">SARAH J. MAAS</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[11px] text-emerald-300 font-extrabold uppercase tracking-wide">HEIR</span>
            <span className="text-[8px] text-emerald-400 font-bold uppercase my-0.5">OF</span>
            <span className="text-[14px] text-emerald-200 font-extrabold tracking-widest uppercase" style={{ textShadow: "0 2px 6px rgba(52,211,153,0.4)" }}>
              FIRE
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-emerald-600 font-semibold">THRONE OF GLASS</span>
          </div>
        </div>
      );
    case "It Ends With Us":
      return (
        <div className="absolute inset-0 bg-[#250a1b] flex flex-col justify-between p-3 border-r border-pink-500/10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#f472b6,transparent_60%)]" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-pink-400 font-bold uppercase tracking-wider">COLLEEN HOOVER</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[13px] text-pink-300 font-extrabold tracking-tight uppercase leading-none">IT</span>
            <span className="text-[13px] text-white font-extrabold tracking-tight uppercase leading-none mt-0.5">ENDS</span>
            <span className="text-[8px] text-pink-400 font-bold uppercase my-0.5">WITH</span>
            <span className="text-[15px] text-pink-400 font-black tracking-normal uppercase leading-none" style={{ textShadow: "0 2px 6px rgba(244,114,182,0.4)" }}>
              US
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-pink-600 font-semibold">SMASH HIT NOVEL</span>
          </div>
        </div>
      );
    case "Verity":
      return (
        <div className="absolute inset-0 bg-[#161d07] flex flex-col justify-between p-3 border-r border-lime-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-lime-400 font-bold uppercase tracking-wider">COLLEEN HOOVER</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[16px] text-lime-400 font-extrabold tracking-widest uppercase font-serif" style={{ textShadow: "0 2px 6px rgba(163,230,53,0.4)" }}>
              VERITY
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-lime-600 font-semibold">THRILLER</span>
          </div>
        </div>
      );
    case "The Midnight Library":
      return (
        <div className="absolute inset-0 bg-[#090622] flex flex-col justify-between p-3 border-r border-violet-500/10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom,#a78bfa,transparent_60%)]" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-violet-400 font-bold uppercase tracking-wider">MATT HAIG</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[9px] text-violet-300 font-bold tracking-widest uppercase">THE</span>
            <span className="text-[11px] text-white font-extrabold tracking-wide uppercase leading-tight mt-0.5">MIDNIGHT</span>
            <span className="text-[12px] text-violet-400 font-extrabold tracking-normal uppercase leading-tight mt-0.5" style={{ textShadow: "0 2px 6px rgba(139,92,246,0.4)" }}>
              LIBRARY
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-violet-600 font-semibold">BESTSELLER</span>
          </div>
        </div>
      );
    case "The Cruel Prince":
      return (
        <div className="absolute inset-0 bg-[#251b0a] flex flex-col justify-between p-3 border-r border-yellow-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-amber-500 font-bold uppercase tracking-wider">HOLLY BLACK</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[9px] text-amber-400 font-bold tracking-widest uppercase">THE</span>
            <span className="text-[13px] text-amber-500 font-extrabold tracking-normal uppercase leading-tight" style={{ textShadow: "0 2px 6px rgba(245,158,11,0.4)" }}>
              CRUEL
            </span>
            <span className="text-[14px] text-white font-extrabold tracking-normal uppercase leading-tight mt-0.5">
              PRINCE
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-amber-700 font-semibold">THE FOLK OF THE AIR</span>
          </div>
        </div>
      );
    case "Project Hail Mary":
      return (
        <div className="absolute inset-0 bg-[#061c20] flex flex-col justify-between p-3 border-r border-cyan-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-wider">ANDY WEIR</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[10px] text-cyan-300 font-bold tracking-widest uppercase leading-none">PROJECT</span>
            <span className="text-[13px] text-white font-black tracking-normal uppercase leading-tight mt-0.5" style={{ textShadow: "0 2px 6px rgba(6,182,212,0.4)" }}>
              HAIL MARY
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-cyan-600 font-semibold">THE MARTIAN AUTHOR</span>
          </div>
        </div>
      );
    case "The Maid":
      return (
        <div className="absolute inset-0 bg-[#22070c] flex flex-col justify-between p-3 border-r border-red-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">NITA PROSE</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[10px] text-rose-300 font-bold tracking-widest uppercase leading-none">THE</span>
            <span className="text-[15px] text-white font-black tracking-normal uppercase leading-tight mt-0.5" style={{ textShadow: "0 2px 6px rgba(244,63,94,0.4)" }}>
              MAID
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-rose-600 font-semibold">A NOVEL</span>
          </div>
        </div>
      );
    case "Shadow and Bone":
      return (
        <div className="absolute inset-0 bg-[#090b24] flex flex-col justify-between p-3 border-r border-indigo-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider">LEIGH BARDUGO</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[11px] text-indigo-300 font-extrabold tracking-wide uppercase leading-tight">SHADOW</span>
            <span className="text-[8px] text-indigo-400 font-bold uppercase my-0.5">AND</span>
            <span className="text-[14px] text-white font-extrabold tracking-normal uppercase leading-tight" style={{ textShadow: "0 2px 6px rgba(99,102,241,0.4)" }}>
              BONE
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-indigo-600 font-semibold">THE GRISHA TRILOGY</span>
          </div>
        </div>
      );
    case "Dune":
      return (
        <div className="absolute inset-0 bg-[#2d1204] flex flex-col justify-between p-3 border-r border-orange-500/10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#f97316,transparent_60%)]" />
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-orange-400 font-bold uppercase tracking-wider">FRANK HERBERT</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[18px] text-orange-500 font-black tracking-widest text-center leading-none uppercase font-serif" style={{ textShadow: "0 2px 8px rgba(249,115,22,0.6)" }}>
              DUNE
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-orange-700 font-semibold">SCIENCE FICTION EPIC</span>
          </div>
        </div>
      );
    case "The Hobbit":
      return (
        <div className="absolute inset-0 bg-[#051c0f] flex flex-col justify-between p-3 border-r border-green-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-green-400/80 font-bold uppercase tracking-wider">J.R.R. TOLKIEN</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[9px] text-green-300 font-bold uppercase leading-none">THE</span>
            <span className="text-[14px] text-green-200 font-extrabold tracking-wider uppercase leading-tight mt-0.5" style={{ textShadow: "0 2px 6px rgba(34,197,94,0.4)" }}>
              HOBBIT
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-green-600 font-semibold">THERE AND BACK AGAIN</span>
          </div>
        </div>
      );
    case "1984":
      return (
        <div className="absolute inset-0 bg-[#161616] flex flex-col justify-between p-3 border-r border-neutral-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">GEORGE ORWELL</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[20px] text-neutral-200 font-black tracking-widest text-center leading-none" style={{ textShadow: "0 2px 8px rgba(255,255,255,0.2)" }}>
              1984
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-neutral-600 font-semibold">CLASSIC DYSTOPIA</span>
          </div>
        </div>
      );
    case "Pride and Prejudice":
      return (
        <div className="absolute inset-0 bg-[#250d13] flex flex-col justify-between p-3 border-r border-rose-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">JANE AUSTEN</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10 text-center">
            <span className="text-[11px] text-rose-300 font-extrabold tracking-wide uppercase leading-tight" style={{ textShadow: "0 2px 6px rgba(244,63,94,0.3)" }}>
              PRIDE
            </span>
            <span className="text-[8px] text-rose-400 font-bold uppercase my-0.5">AND</span>
            <span className="text-[11px] text-amber-300 font-extrabold tracking-wide uppercase leading-tight">
              PREJUDICE
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-rose-600 font-semibold">CLASSIC LITERATURE</span>
          </div>
        </div>
      );
    case "The Alchemist":
      return (
        <div className="absolute inset-0 bg-[#241a05] flex flex-col justify-between p-3 border-r border-amber-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">PAULO COELHO</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[9px] text-amber-300 font-bold tracking-widest uppercase">THE</span>
            <span className="text-[13px] text-amber-400 font-extrabold tracking-wider uppercase leading-tight" style={{ textShadow: "0 2px 6px rgba(245,158,11,0.4)" }}>
              ALCHEMIST
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-amber-600 font-semibold">INTERNATIONAL BESTSELLER</span>
          </div>
        </div>
      );
    case "The Book Thief":
      return (
        <div className="absolute inset-0 bg-[#061427] flex flex-col justify-between p-3 border-r border-blue-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-blue-400 font-bold uppercase tracking-wider">MARKUS ZUSAK</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10">
            <span className="text-[9px] text-blue-300 font-bold tracking-widest uppercase">THE</span>
            <span className="text-[12px] text-white font-extrabold tracking-wide uppercase leading-tight">BOOK</span>
            <span className="text-[13px] text-blue-400 font-extrabold tracking-normal uppercase leading-tight mt-0.5" style={{ textShadow: "0 2px 6px rgba(59,130,246,0.4)" }}>
              THIEF
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-blue-600 font-semibold">CLASSIC NOVEL</span>
          </div>
        </div>
      );
    case "Sapiens":
      return (
        <div className="absolute inset-0 bg-[#1e1c18] flex flex-col justify-between p-3 border-r border-stone-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">YUVAL NOAH HARARI</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10 text-center">
            <span className="text-[13px] text-stone-300 font-extrabold tracking-widest uppercase leading-none" style={{ textShadow: "0 2px 4px rgba(255,255,255,0.1)" }}>
              SAPIENS
            </span>
            <span className="text-[6px] text-stone-400 font-semibold uppercase mt-0.5 tracking-wider">A BRIEF HISTORY OF HUMANKIND</span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-stone-600 font-semibold">BESTSELLER</span>
          </div>
        </div>
      );
    case "The Psychology of Money":
      return (
        <div className="absolute inset-0 bg-[#072420] flex flex-col justify-between p-3 border-r border-teal-500/10">
          <div className="w-full text-center mt-2 z-10">
            <span className="text-[8px] text-teal-400 font-bold uppercase tracking-wider">MORGAN HOUSEL</span>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 z-10 text-center">
            <span className="text-[9px] text-teal-300 font-bold tracking-widest uppercase leading-none">THE</span>
            <span className="text-[11px] text-white font-extrabold tracking-normal uppercase leading-tight mt-0.5">PSYCHOLOGY</span>
            <span className="text-[8px] text-teal-400 font-bold uppercase my-0.5">OF</span>
            <span className="text-[12px] text-teal-400 font-extrabold tracking-normal uppercase leading-tight mt-0.5" style={{ textShadow: "0 2px 6px rgba(45,212,191,0.4)" }}>
              MONEY
            </span>
          </div>
          <div className="w-full text-center mb-1 z-10">
            <span className="text-[7px] text-teal-600 font-semibold">TIMELESS LESSONS</span>
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 to-indigo-950 flex flex-col items-center justify-center p-3">
          <p className="text-white text-xs font-bold leading-tight uppercase tracking-wider text-center">{book.title}</p>
        </div>
      );
  }
}

/* ─── FORMATTERS & UTILS ────────────────────────────────────────────── */
const mapApiBookToUI = (apiBook, index) => {
  const gradients = [
    { bg: "from-purple-900 to-indigo-950", color: "#c084fc" },
    { bg: "from-slate-800 to-zinc-900", color: "#94a3b8" },
    { bg: "from-amber-900 to-orange-950", color: "#fbbf24" },
    { bg: "from-orange-900 to-red-950", color: "#f97316" },
    { bg: "from-sky-900 to-blue-950", color: "#38bdf8" },
    { bg: "from-yellow-900 to-amber-950", color: "#eab308" },
    { bg: "from-teal-900 to-cyan-950", color: "#2dd4bf" },
    { bg: "from-pink-900 to-rose-950", color: "#f472b6" },
  ];
  const style = gradients[index % gradients.length];

  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.authors ? apiBook.authors.join(", ") : "Unknown Author",
    rating: apiBook.averageRating || 4.5,
    pages: apiBook.pageCount || 320,
    desc: apiBook.description || "No description available for this book.",
    year: apiBook.publishedDate ? apiBook.publishedDate.split("-")[0] : "2024",
    genre: apiBook.categories && apiBook.categories.length > 0 ? apiBook.categories[0] : "Fiction",
    thumbnail: apiBook.thumbnail,
    bg: apiBook.bg || style.bg,
    color: apiBook.color || style.color,
    isReadable: apiBook.isReadable ?? false,
    webReaderLink: apiBook.webReaderLink ?? null,
  };
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────── */

function BookCardSkeleton() {
  return (
    <div className="flex flex-col shrink-0 w-[140px] animate-pulse">
      <div className="w-full h-[200px] rounded-2xl bg-white/5 border border-white/5 shadow-lg shadow-black/30" />
      <div className="mt-3 px-1 space-y-2">
        <div className="h-3 bg-white/10 rounded w-5/6" />
        <div className="h-2 bg-white/5 rounded w-1/2" />
        <div className="h-2.5 bg-white/10 rounded w-1/3" />
      </div>
    </div>
  );
}

function BookCard({ book, showRank = false, onOpen }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      onClick={() => onOpen && onOpen(book)}
      className="group relative flex flex-col cursor-pointer shrink-0 w-[140px] select-none"
    >
      {/* Cover Container */}
      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-lg shadow-black/50 border border-white/5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-[#582fff]/20 group-hover:border-[#582fff]/40">
        {/* Realistic book spine lighting effect */}
        <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent z-20" />

        {/* Custom CSS Illustration Cover or Image Cover */}
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover z-10"
            loading="lazy"
          />
        ) : (
          <BookCoverIllustration book={book} />
        )}

        {/* Rank badge */}
        {showRank && (
          <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-[#582fff] border border-[#795eff]/30 flex items-center justify-center z-20 shadow-md">
            <span className="text-white text-[10px] font-black">{book.rank}</span>
          </div>
        )}
        
        {/* Badge */}
        {book.badge && !showRank && (
          <div className="absolute top-2.5 left-2.5 bg-[#582fff] text-white text-[8px] font-black px-2 py-0.5 rounded-full z-20 shadow-sm border border-white/10 uppercase tracking-widest">
            {book.badge}
          </div>
        )}
        
        {/* Heart icon overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2.5 right-2.5 z-30 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/60 active:scale-95 transition-all border border-white/5"
        >
          <Heart
            size={11}
            className={liked ? "fill-rose-500 text-rose-500" : "text-white/80 hover:text-rose-400"}
          />
        </button>

        {/* Soft bottom cover gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
      </div>

      {/* Info Section Below Cover */}
      <div className="mt-3 px-1">
        <h3 className="text-white text-xs font-bold leading-snug line-clamp-1 group-hover:text-[#582fff] transition-colors">{book.title}</h3>
        <p className="text-gray-500 text-[10px] mt-0.5 font-medium line-clamp-1">{book.author}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-amber-400 text-[10px] font-black">{book.rating}</span>
          <Star size={9} className="fill-amber-400 text-amber-400" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, href }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white font-extrabold text-base flex items-center gap-2 tracking-tight">
        {title} {icon}
      </h2>
      <div className="flex items-center gap-4">
        {href && (
          <button 
            onClick={() => router.push(href)}
            className="text-[#582fff] hover:text-[#7651ff] text-xs font-bold transition-all"
          >
            View all
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function ReadifyPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popularPicks, setPopularPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchBooks() {
      try {
        setLoading(true);
        // Fetch featured categories and free readable books
        const [featuredData, freeData] = await Promise.all([
          bookService.getFeatured(),
          bookService.getFree("bestsellers", 8),
        ]);

        if (!active) return;

        // Map responses to UI expected shape
        // Backend returns: { fiction, mystery, science, fantasy, biography }
        const freeBooks     = (freeData?.books          || []).map((b, i) => mapDashboardBook(b, i));
        const trendingBooks = (featuredData?.fantasy     || featuredData?.fiction   || []).map((b, i) => mapDashboardBook(b, i)).slice(0, 8);
        const popularBooks  = (featuredData?.mystery     || featuredData?.biography || []).map((b, i) => mapDashboardBook(b, i)).slice(0, 8);

        setRecentlyAdded(freeBooks.length > 0 ? freeBooks : (featuredData?.science || []).map((b, i) => mapDashboardBook(b, i)).slice(0, 8));
        setTrending(trendingBooks);
        setPopularPicks(popularBooks);
      } catch (err) {
        console.error("Failed to load dashboard books:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchBooks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#06040d] font-sans text-gray-100 overflow-x-hidden">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Nav */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-8 pt-0 pb-6 space-y-8">

          {/* Hero Banner (Majestic Cozy Library Split-Layout) */}
          <div className="relative w-[calc(100%+4rem)] -mx-8 h-[390px] overflow-hidden shadow-2xl shadow-[#0c0722]/30 flex items-center bg-gradient-to-br from-[#120a2e] via-[#06040d] to-[#2c0b2c]">
            {/* Left side text content */}
            <div className="relative z-30 px-10 flex flex-col justify-center max-w-[100%] md:max-w-[55%] h-full">
              <p className="text-[#a78bfa] text-xs font-bold mb-1.5 tracking-widest uppercase">
                Welcome to Readify,
              </p>
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
                Where Stories <br />
                Come to <span className="text-[#a78bfa] animate-pulse" style={{ textShadow: "0 0 15px rgba(167,139,250,0.4)" }}>Life</span> ✨
              </h1>
              <p className="text-gray-300 text-xs leading-relaxed mb-6 max-w-sm">
                Explore books that inspire, entertain, and stay with you forever.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.push("/searchresults")}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-600 hover:from-purple-600 hover:via-violet-500 hover:to-fuchsia-500 text-white text-sm px-6 py-2.5 rounded-sm font-semibold transition-all shadow-lg shadow-purple-700/40 hover:shadow-purple-500/50"
                >
                  Explore Now
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => router.push("/favourite")}
                  className="flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white text-sm px-6 py-2.5 rounded-sm font-medium transition-all"
                >
                  My Library
                </button>
              </div>
            </div>

            {/* Right side Cozy Library artwork illustration */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-[85%] h-full select-none pointer-events-none hidden md:block z-20"
              style={{
                WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 35%, transparent 95%)",
                maskImage: "radial-gradient(ellipse at 80% 50%, black 35%, transparent 95%)"
              }}
            >
              <img
                src="/readify-banner.png"
                alt="Cozy library illustration"
                className="w-full h-full object-cover object-right object-bottom mix-blend-screen opacity-100 contrast-[1.08] brightness-[1.04]"
              />
            </div>

            {/* Ambient bottom blend overlay to dissolve into page background */}
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#06040d] to-transparent z-30 pointer-events-none" />
          </div>

          {/* Recently Added */}
          <section>
            <SectionHeader title="Recently Added" href="/searchresults?q=new" />
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10 scrollbar-track-transparent">
              {loading
                ? Array(8).fill(null).map((_, i) => <BookCardSkeleton key={i} />)
                : recentlyAdded.map((book) => (
                    <BookCard key={book.id || book.title} book={book} onOpen={setSelectedBook} />
                  ))}
            </div>
          </section>

          {/* Trending Now */}
          <section>
            <SectionHeader
              title="Trending Now"
              icon={<Flame className="text-[#ff5c2f] text-base shrink-0" size={18} />}
              href="/searchresults?q=trending"
            />
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10 scrollbar-track-transparent">
              {loading
                ? Array(8).fill(null).map((_, i) => <BookCardSkeleton key={i} />)
                : trending.map((book, idx) => (
                    <BookCard
                      key={book.id || book.title}
                      book={{ ...book, rank: idx + 1 }}
                      showRank
                      onOpen={setSelectedBook}
                    />
                  ))}
            </div>
          </section>

          {/* Popular Picks */}
          <section>
            <SectionHeader
              title="Popular Picks"
              icon={<Crown className="text-amber-400 text-base shrink-0" size={18} />}
              href="/searchresults?q=popular"
            />
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10 scrollbar-track-transparent">
              {loading
                ? Array(8).fill(null).map((_, i) => <BookCardSkeleton key={i} />)
                : popularPicks.map((book) => (
                    <BookCard key={book.id || book.title} book={book} onOpen={setSelectedBook} />
                  ))}
            </div>
          </section>

        </main>
      </div>
      {/* Modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
