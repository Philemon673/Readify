"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  BookOpen,
  Star,
  Heart,
  Smartphone,
  Sparkles,
  Bookmark,
  Menu,
  X,
  ChevronRight,
  Flame,
} from "lucide-react";
import BookModal from "../../app/searchresults/bookmodal";
/* ── Nav links ── */
const navLinks = [
  { label: "Home",       href: "/" },
  { label: "Explore",    href: "/explore" },
  { label: "Categories", href: "/categories" },
  { label: "About",      href: "/about" },
];

/* ── Book data — using Open Library cover images ── */
const books = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/id/10527843-M.jpg",
    bgColor: "#1a2e4a",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/id/10804932-M.jpg",
    bgColor: "#2d1a0e",
  },
  {
    id: 3,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/id/12202823-M.jpg",
    bgColor: "#1a2e1a",
  },
  {
    id: 4,
    title: "It Ends With Us",
    author: "Colleen Hoover",
    rating: 4.2,
    coverUrl: "https://covers.openlibrary.org/b/id/12645114-M.jpg",
    bgColor: "#2e1a2e",
  },
  {
    id: 5,
    title: "The Alchemist",
    author: "Paulo Coelho",
    rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/id/8479819-M.jpg",
    bgColor: "#2e2200",
  },
];

/* ── Feature strip ── */
const features = [
  {
    Icon: BookOpen,
    title: "Millions of Books at your fingertips",
    textSize: "text-xs",
    width: "w-[160px]",
  },
  {
    Icon: Sparkles,
    title: "Personalized recommendations",
    textSize: "text-xs",
    width: "w-[160px]",
  },
  {
    Icon: Bookmark,
    title: "Save & organise your favourites",
    textSize: "text-xs",
    width: "w-[160px]",
  },
  {
    Icon: Smartphone,
    title: "Read anywhere, anytime",
    textSize: "text-xs",
    width: "w-[140px]",
  },
];

/* ── Book Card ── */
function BookCard({ book, onOpen }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onOpen && onOpen(book)}
      className="flex flex-col gap-2 min-w-[115px] group cursor-pointer shrink-0"
    >
      {/* Cover */}
      <div
        className="relative rounded-xl overflow-hidden h-[168px] w-[115px] shadow-2xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-purple-900/50"
        style={{ background: book.bgColor }}
      >
        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm rounded-full p-1 transition-transform hover:scale-110"
          aria-label="Like"
        >
          <Heart
            size={13}
            fill={liked ? "#e91e8c" : "none"}
            stroke={liked ? "#e91e8c" : "rgba(255,255,255,0.9)"}
          />
        </button>

        {/* Book cover image */}
        {!imgError ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback gradient cover */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(145deg, ${book.bgColor}, #6d28d9)`,
            }}
          >
            <BookOpen size={36} className="text-white/40" />
          </div>
        )}

        {/* Bottom title overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-8"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
        >
          <p className="text-white text-[9px] font-semibold leading-tight line-clamp-2">
            {book.title}
          </p>
        </div>
      </div>

      {/* Info below card */}
      <div>
        <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2 max-w-[115px]">
          {book.title}
        </p>
        <p className="text-purple-300/80 text-[10px] mt-0.5">{book.author}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={10} fill="#ffd700" stroke="none" />
          <span className="text-yellow-300 text-[10px]">{book.rating}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function HomePage() {
  const router   = useRouter();
  const pathname = usePathname();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  function handleSearch(e) {
    e.preventDefault();
    const q = searchVal.trim();
    if (q) {
      router.push(`/searchresults?q=${encodeURIComponent(q)}`);
      setMenuOpen(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans" style={{ background: "#0a0618" }}>

      {/* ── BACKGROUND: image with masked left edge for seamless blend ── */}
      <div
        className="fixed right-0 top-0 bottom-0 w-[62%] z-0"
        style={{
          backgroundImage: "url(/bg-readify.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          /* Fade the image's own left edge to transparent — zero color clash */
          maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 18%, rgba(0,0,0,0.85) 35%, black 55%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 18%, rgba(0,0,0,0.85) 35%, black 55%)",
        }}
      />

      {/* Top-bottom vignette for depth */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,6,24,0.55) 0%, transparent 20%, transparent 75%, rgba(10,6,24,0.85) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen pt-[65px]">

        {/* ── NAVBAR ── */}
        <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-4 backdrop-blur-sm border-b border-white/5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/40">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-wide">Readify</span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-15 text-sm">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`transition-colors duration-200 ${
                      active
                        ? "text-purple-600 font-semibold"
                        : "text-gray-400 hover:text-purple-600"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop search + auth */}
          <div className="hidden md:flex items-center gap-3">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-white/[0.07] border border-white/10 rounded-full px-3 py-1.5 hover:border-purple-500/40 transition-colors"
            >
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-transparent text-white text-xs placeholder-gray-500 outline-none w-90"
              />
              <button type="submit" aria-label="Search">
                <Search size={13} className="text-gray-400 hover:text-purple-400 transition-colors" />
              </button>
            </form>

            <Link
              href="/login"
              className="text-gray-300 text-sm hover:text-white transition-colors px-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-600 hover:from-purple-600 hover:via-violet-500 hover:to-fuchsia-500 text-white text-sm px-5 py-1.5 rounded-sm transition-all font-medium shadow-lg shadow-purple-600/30 hover:shadow-purple-500/40"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-xl px-6 py-5 flex flex-col gap-4 border-b border-white/10">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm transition-colors ${
                  pathname === href
                    ? "text-purple-400 font-semibold"
                    : "text-white hover:text-purple-300"
                }`}
              >
                {label}
              </Link>
            ))}

            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-2 mt-1"
            >
              <Search size={13} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-transparent text-white text-xs placeholder-gray-400 outline-none flex-1"
              />
              <button type="submit" className="text-purple-400 text-xs font-semibold">
                Go
              </button>
            </form>

            <div className="flex gap-3 pt-1">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-white text-sm">
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-600 text-white text-sm px-4 py-1.5 rounded-full font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <section className="flex-1 flex flex-col justify-center px-6 md:px-10 pt-10 pb-4 max-w-xl">

          {/* Tag */}
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-5"
            style={{ color: "#f5a623" }}
          >
            Your next adventure starts here
          </p>

          {/* Heading */}
          <h1 className="text-white text-[2.6rem] md:text-5xl font-extrabold leading-[1.15] mb-5">
            Discover Books
            <br />
            That{" "}
            <span className="relative inline-block">
              <span
                style={{
                  background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Inspire
              </span>
              {/* Underline squiggle */}
              <svg
                className="absolute left-0 w-full"
                style={{ bottom: "-4px" }}
                height="5"
                viewBox="0 0 100 5"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,3.5 Q12,0.5 25,3.5 Q37,6.5 50,3.5 Q62,0.5 75,3.5 Q87,6.5 100,3.5"
                  fill="none"
                  stroke="url(#pinkGrad)"
                  strokeWidth="1.8"
                />
                <defs>
                  <linearGradient id="pinkGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            You
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed mb-8 max-w-[340px]">
            Explore, discover and save books that speak to your soul.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/explore"
             className="flex items-center gap-2 bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-600 hover:from-purple-600 hover:via-violet-500 hover:to-fuchsia-500 text-white text-sm px-6 py-2.5 rounded-sm font-semibold transition-all shadow-lg shadow-purple-700/40 hover:shadow-purple-500/50">
              <BookOpen size={14} />
              Explore Books
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white text-sm px-6 py-2.5 rounded-sm font-medium transition-all"
            >
              View Categories
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── POPULAR PICKS ── */}
        <section className="px-6 md:px-10 pb-5">
          <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2 tracking-wide">
            Popular Picks
            <Flame size={15} className="text-orange-400" />
          </h2>
          <div
            className="flex gap-8 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {books.map((book) => (
              <BookCard key={book.id} book={book} onOpen={setSelectedBook} />
            ))}
          </div>
        </section>

        {/* ── FEATURE STRIP ── */}
        <section className="px-6 py-3 border border-white/[0.07] mb-6 w-fit mx-auto rounded-xl flex justify-center items-center bg-[#222222]/50 backdrop-blur-xl">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {features.map(({ Icon, title, textSize, width }, i) => (
              <div key={i} className={`flex items-center gap-2.5 text-gray-400 ${width}`}>
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-purple-400" />
                </div>
                <span className={`${textSize} leading-tight`}>{title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Modal */}
        {selectedBook && (
          <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}

      </div>
    </div>
  );
}