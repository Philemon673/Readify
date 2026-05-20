"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Heart, Star, ChevronLeft, ChevronRight, ChevronDown,
  X, BookOpen, Calendar, User, Tag, ArrowRight, Compass,
  Menu, Bell,
} from "lucide-react";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { MdOutlineAutoStories } from "react-icons/md";
import { PiBookmarkSimpleFill } from "react-icons/pi";
import { GiBookshelf } from "react-icons/gi";

/* ─── DATA ───────────────────────────────────────────────────────────── */
const ALL_BOOKS = [
  { id: 1,  title: "Harry Potter and the Sorcerer's Stone",     author: "J.K. Rowling", rating: 4.8, bg: "from-red-900 via-red-800 to-yellow-900",       color: "#fcd34d", year: 1997, genre: "Fantasy", pages: 309,  desc: "The story of Harry Potter, an orphan who discovers on his 11th birthday that he is a wizard and has been accepted to Hogwarts School of Witchcraft and Wizardry." },
  { id: 2,  title: "Harry Potter and the Chamber of Secrets",   author: "J.K. Rowling", rating: 4.7, bg: "from-emerald-900 via-green-800 to-teal-900",    color: "#6ee7b7", year: 1998, genre: "Fantasy", pages: 341,  desc: "Harry Potter's second year at Hogwarts is marked by a series of mysterious attacks on students. Someone has opened the Chamber of Secrets, unleashing a deadly monster." },
  { id: 3,  title: "Harry Potter and the Prisoner of Azkaban",  author: "J.K. Rowling", rating: 4.8, bg: "from-sky-900 via-blue-800 to-indigo-900",       color: "#93c5fd", year: 1999, genre: "Fantasy", pages: 435,  desc: "In his third year at Hogwarts, Harry learns that a convicted murderer and his father's best friend, Sirius Black, has escaped from Azkaban prison." },
  { id: 4,  title: "Harry Potter and the Goblet of Fire",       author: "J.K. Rowling", rating: 4.7, bg: "from-violet-900 via-purple-800 to-fuchsia-900",  color: "#d8b4fe", year: 2000, genre: "Fantasy", pages: 734,  desc: "Harry Potter's name is mysteriously entered into the Triwizard Tournament, a dangerous magical competition between three wizarding schools." },
  { id: 5,  title: "Harry Potter and the Order of the Phoenix", author: "J.K. Rowling", rating: 4.6, bg: "from-slate-900 via-gray-800 to-zinc-900",       color: "#cbd5e1", year: 2003, genre: "Fantasy", pages: 870,  desc: "Lord Voldemort is back and now Harry must rely on his friends and the secret Order of the Phoenix to fight the rise of dark forces." },
  { id: 6,  title: "Harry Potter and the Half-Blood Prince",    author: "J.K. Rowling", rating: 4.7, bg: "from-amber-900 via-orange-800 to-red-900",      color: "#fbbf24", year: 2005, genre: "Fantasy", pages: 652,  desc: "Dumbledore mentors Harry in Voldemort's past while war rages outside Hogwarts. Secrets about the Half-Blood Prince are slowly uncovered." },
  { id: 7,  title: "Harry Potter and the Deathly Hallows",      author: "J.K. Rowling", rating: 4.9, bg: "from-indigo-900 via-violet-800 to-purple-900",   color: "#a5b4fc", year: 2007, genre: "Fantasy", pages: 759,  desc: "The epic conclusion to the Harry Potter series. Harry, Ron and Hermione must destroy all of Voldemort's Horcruxes to defeat him once and for all." },
  { id: 8,  title: "Harry Potter and the Cursed Child",         author: "J.K. Rowling & J. Tiffany", rating: 4.6, bg: "from-zinc-900 via-neutral-800 to-stone-900", color: "#e7e5e4", year: 2016, genre: "Fantasy", pages: 336, desc: "The eighth story. Nineteen years later. Harry and his son Albus must grapple with a revisited past while time itself is threatened." },
  { id: 9,  title: "Fantastic Beasts and Where to Find Them",  author: "J.K. Rowling", rating: 4.4, bg: "from-lime-900 via-green-800 to-emerald-900",     color: "#bef264", year: 2001, genre: "Fantasy", pages: 128,  desc: "An A–Z of magical creatures from Newt Scamander's famous compendium, now available to the general wizarding public." },
  { id: 10, title: "Quidditch Through the Ages",                author: "J.K. Rowling", rating: 4.3, bg: "from-cyan-900 via-sky-800 to-blue-900",         color: "#67e8f9", year: 2001, genre: "Sports/Fantasy", pages: 112, desc: "The history of Quidditch, from its earliest days in the eleventh century to modern tournaments. Essential reading for any Quidditch fan." },
  { id: 11, title: "The Tales of Beedle the Bard",              author: "J.K. Rowling", rating: 4.2, bg: "from-rose-900 via-pink-800 to-fuchsia-900",     color: "#fda4af", year: 2008, genre: "Fantasy", pages: 128,  desc: "A collection of five classic wizarding fairy tales including The Tale of the Three Brothers, as referenced in The Deathly Hallows." },
  { id: 12, title: "Hogwarts: An Incomplete and Unreliable Guide", author: "J.K. Rowling", rating: 4.1, bg: "from-teal-900 via-cyan-800 to-sky-900",    color: "#5eead4", year: 2016, genre: "Fantasy", pages: 90,   desc: "Pottermore Presents stories about Hogwarts itself — its history, its secrets, and the mysterious magic that enchants the famous castle." },
  { id: 13, title: "Short Stories from Hogwarts of Power",       author: "J.K. Rowling", rating: 4.0, bg: "from-purple-900 via-violet-800 to-indigo-900",  color: "#c4b5fd", year: 2016, genre: "Fantasy", pages: 78,   desc: "Pottermore Presents three short volumes exploring some of the most powerful and notorious characters from the Harry Potter stories." },
  { id: 14, title: "Harry Potter: A Pop-Up Book",               author: "Various",       rating: 4.3, bg: "from-orange-900 via-amber-800 to-yellow-900",   color: "#fdba74", year: 2010, genre: "Art Book", pages: 60,   desc: "An extraordinary pop-up paper engineering experience celebrating the iconic world of Harry Potter with stunning 3-D paper artistry." },
  { id: 15, title: "The HP Wizarding Almanac",                   author: "J.K. Rowling", rating: 4.5, bg: "from-blue-900 via-indigo-800 to-violet-900",    color: "#93c5fd", year: 2023, genre: "Fantasy", pages: 272,  desc: "A beautifully illustrated visual guide through the wizarding world, packed with stunning artwork and detailed magical information." },
  { id: 16, title: "Harry Potter: MinaLima Edition",             author: "J.K. Rowling", rating: 4.9, bg: "from-yellow-900 via-amber-800 to-orange-900",   color: "#fde68a", year: 2020, genre: "Fantasy", pages: 352,  desc: "A gorgeous illustrated edition of the Sorcerer's Stone, with over 150 full-color decorations by design studio MinaLima." },
  ...Array.from({ length: 104 }, (_, i) => ({
    id: 17 + i,
    title: `Harry Potter – Collector's Vol. ${i + 1}`,
    author: "J.K. Rowling",
    rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1)),
    bg: ["from-red-900 via-rose-800 to-pink-900","from-blue-900 via-indigo-800 to-violet-900","from-green-900 via-teal-800 to-cyan-900","from-amber-900 via-orange-800 to-red-900","from-violet-900 via-purple-800 to-fuchsia-900","from-slate-900 via-gray-800 to-zinc-900"][i % 6],
    color: ["#fca5a5","#93c5fd","#6ee7b7","#fbbf24","#d8b4fe","#cbd5e1"][i % 6],
    year: 1997 + (i % 27),
    genre: "Fantasy",
    pages: 200 + (i * 7) % 600,
    desc: `A special collector's edition volume celebrating the magic of Harry Potter's wizarding world, featuring exclusive artwork and bonus content.`,
  })),
];

const SORT_OPTIONS = [
  { label: "Relevance",         value: "relevance" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Rating: Low to High", value: "rating_asc" },
  { label: "Newest First",      value: "year_desc" },
  { label: "Oldest First",      value: "year_asc" },
  { label: "Title A–Z",         value: "title_asc" },
  { label: "Title Z–A",         value: "title_desc" },
];

const PER_PAGE = 8;

import BookModal from "./bookmodal";

/* ─── BOOK CARD ──────────────────────────────────────────────────────── */
function BookCard({ book, onOpen }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group flex flex-col cursor-pointer" onClick={() => onOpen(book)}>
      <div className={`relative w-full aspect-[2/3] rounded-xl bg-gradient-to-br ${book.bg} overflow-hidden shadow-lg shadow-black/40 border border-white/5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-violet-950/50`}>
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart size={13} className={liked ? "fill-rose-500 text-rose-500" : "text-white/80"} />
        </button>

        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-1">
          <MdOutlineAutoStories size={18} style={{ color: book.color, opacity: 0.7 }} />
          <p
            className="text-center text-[11px] font-extrabold leading-tight uppercase mt-1"
            style={{ color: book.color, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {book.title.replace("Harry Potter and the ", "").replace("Harry Potter: ", "").replace("Harry Potter – ", "").slice(0, 35)}
          </p>
        </div>

        {/* Hover overlay — "View Details" prompt */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-white text-[11px] font-semibold bg-violet-600/80 px-3 py-1 rounded-full backdrop-blur-sm">
            View Details
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            <span className="text-amber-400 text-[9px] font-bold">{book.rating}</span>
          </div>
          <span className="text-white/40 text-[9px]">{book.year}</span>
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <p className="text-white text-[12px] font-semibold leading-snug line-clamp-2">{book.title}</p>
        <p className="text-gray-500 text-[11px] mt-0.5">{book.author}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-amber-400 text-[10px] font-semibold">{book.rating}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGINATION ─────────────────────────────────────────────────────── */
function Pagination({ currentPage, totalPages, onPage }) {
  const pages = useMemo(() => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`el-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-600 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all border ${
              p === currentPage
                ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-900/50"
                : "border-white/10 text-gray-400 hover:text-white hover:border-violet-500"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

/* ─── SORT DROPDOWN ──────────────────────────────────────────────────── */
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-violet-500/50 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
      >
        <span className="text-gray-400 text-xs">Sort by:</span>
        <span>{current?.label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1825] border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                opt.value === value
                  ? "bg-violet-600/30 text-violet-300 font-semibold"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN INNER (needs useSearchParams, must be inside Suspense) ──────── */
function SearchResultsInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("relevance");
  const [selectedBook, setSelectedBook] = useState(null);

  // Reset to page 1 whenever the query changes
  useEffect(() => { setCurrentPage(1); }, [query]);

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_BOOKS;
    const q = query.toLowerCase();
    return ALL_BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
    );
  }, [query]);

  const sorted = useMemo(() => {
    const books = [...filtered];
    switch (sort) {
      case "rating_desc": return books.sort((a, b) => b.rating - a.rating);
      case "rating_asc":  return books.sort((a, b) => a.rating - b.rating);
      case "year_desc":   return books.sort((a, b) => b.year - a.year);
      case "year_asc":    return books.sort((a, b) => a.year - b.year);
      case "title_asc":   return books.sort((a, b) => a.title.localeCompare(b.title));
      case "title_desc":  return books.sort((a, b) => b.title.localeCompare(a.title));
      default:            return books;
    }
  }, [filtered, sort]);

  const handleSort = (val) => { setSort(val); setCurrentPage(1); };
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const pageBooks = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="flex min-h-screen bg-[#06040d] font-sans text-gray-100 overflow-x-hidden">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Nav */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} searchValue={query} />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-8 py-8 space-y-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {query ? (
                    <>Search results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a6eff] to-fuchsia-400">"{query}"</span></>
                  ) : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a6eff] to-fuchsia-400">All Books</span>
                  )}
                </h1>
                <p className="text-gray-500 text-xs font-semibold mt-1.5 uppercase tracking-wider">
                  {sorted.length} {sorted.length === 1 ? "book" : "books"} found
                  {query ? ` for "${query}"` : " in catalog"}
                </p>
              </div>
              <SortDropdown value={sort} onChange={handleSort} />
            </div>

            {sorted.length === 0 ? (
              /* ── Not Found Empty State ── */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                {/* Animated icon */}
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full bg-[#582fff]/10 animate-ping opacity-30" />
                  <div className="relative w-24 h-24 rounded-full bg-[#100c1f] border border-[#582fff]/20 flex items-center justify-center">
                    <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
                      <circle cx="28" cy="28" r="14" stroke="#582fff" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M38 38 L52 52" stroke="#582fff" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M22 28 h12 M28 22 v12" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                    </svg>
                  </div>
                </div>

                <h2 className="text-white text-xl font-extrabold mb-2 tracking-tight">
                  No books found
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-2">
                  We couldn&apos;t find any books matching{" "}
                  <span className="text-[#a78bfa] font-semibold">&quot;{query}&quot;</span>.
                </p>
                <p className="text-gray-600 text-xs mb-8">
                  Try a different title, author name, or genre.
                </p>

                <a
                  href="/BookCard"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#582fff] to-[#7c3aed] hover:from-[#7651ff] hover:to-[#8b5cf6] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#582fff]/30 hover:shadow-[#582fff]/50 hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 3a7 7 0 100 14A7 7 0 0010 3zm-9 7a9 9 0 1118 0A9 9 0 011 10z"/>
                    <path d="M6.5 10a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"/>
                  </svg>
                  Explore Other Books
                </a>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pageBooks.map((book) => (
                    <BookCard key={book.id} book={book} onOpen={setSelectedBook} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPage={setCurrentPage} />

                <p className="text-center text-gray-500 text-[11px] font-medium mt-6">
                  Page {currentPage} of {totalPages} · Showing {Math.min((currentPage - 1) * PER_PAGE + 1, sorted.length)}–{Math.min(currentPage * PER_PAGE, sorted.length)} of {sorted.length} books
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}

/* ─── EXPORTED PAGE (wraps inner in Suspense for useSearchParams) ─────── */
export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-[#06040d] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#582fff]/30 border-t-[#582fff] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Searching books...</p>
        </div>
      </div>
    }>
      <SearchResultsInner />
    </Suspense>
  );
}