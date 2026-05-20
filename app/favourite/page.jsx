"use client";

import { useState, useMemo } from "react";
import { Heart, Star, ChevronDown, ChevronLeft, ChevronRight, Trash2, BookOpen } from "lucide-react";
import { MdOutlineAutoStories } from "react-icons/md";
import { PiHeartFill } from "react-icons/pi";

/* ─── DATA ───────────────────────────────────────────────────────────── */
const INITIAL_FAVOURITES = [
  { id: 1,  title: "The Midnight Library",              author: "Matt Haig",            rating: 4.6, bg: "from-slate-900 via-blue-900 to-indigo-950",    color: "#93c5fd", dateAdded: "2024-01-10", genre: "Fiction" },
  { id: 2,  title: "Atomic Habits",                     author: "James Clear",          rating: 4.8, bg: "from-stone-800 via-neutral-700 to-zinc-900",   color: "#fde68a", dateAdded: "2024-01-14", genre: "Self-Help" },
  { id: 3,  title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid",  rating: 4.7, bg: "from-amber-900 via-orange-800 to-red-950",     color: "#fdba74", dateAdded: "2024-01-18", genre: "Fiction" },
  { id: 4,  title: "It Ends With Us",                   author: "Colleen Hoover",       rating: 4.7, bg: "from-pink-900 via-rose-800 to-fuchsia-950",    color: "#fda4af", dateAdded: "2024-01-22", genre: "Romance" },
  { id: 5,  title: "The Alchemist",                     author: "Paulo Coelho",         rating: 4.6, bg: "from-orange-900 via-amber-800 to-yellow-950",  color: "#fbbf24", dateAdded: "2024-01-25", genre: "Fiction" },
  { id: 6,  title: "Dune",                              author: "Frank Herbert",         rating: 4.8, bg: "from-yellow-900 via-orange-800 to-red-950",   color: "#fde68a", dateAdded: "2024-01-28", genre: "Sci-Fi" },
  { id: 7,  title: "The Power of Habit",                author: "Charles Duhigg",       rating: 4.5, bg: "from-orange-800 via-amber-700 to-yellow-900",  color: "#fdba74", dateAdded: "2024-02-02", genre: "Self-Help" },
  { id: 8,  title: "Thinking, Fast and Slow",           author: "Daniel Kahneman",      rating: 4.6, bg: "from-zinc-800 via-gray-700 to-slate-900",      color: "#e2e8f0", dateAdded: "2024-02-06", genre: "Psychology" },
  { id: 9,  title: "Educated",                          author: "Tara Westover",        rating: 4.6, bg: "from-red-900 via-rose-800 to-pink-950",        color: "#fca5a5", dateAdded: "2024-02-10", genre: "Memoir" },
  { id: 10, title: "Sapiens",                           author: "Yuval Noah Harari",    rating: 4.6, bg: "from-teal-900 via-cyan-800 to-sky-950",        color: "#5eead4", dateAdded: "2024-02-14", genre: "History" },
  { id: 11, title: "The Psychology of Money",           author: "Morgan Housel",        rating: 4.7, bg: "from-violet-900 via-purple-800 to-indigo-950", color: "#c4b5fd", dateAdded: "2024-02-18", genre: "Finance" },
  { id: 12, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson",       rating: 4.5, bg: "from-gray-800 via-zinc-700 to-neutral-900",    color: "#d4d4d4", dateAdded: "2024-02-22", genre: "Self-Help" },
];

// Extra books so pagination is meaningful
const EXTRA_BOOKS = [
  { id: 13, title: "The Alchemist – Collector's Ed.", author: "Paulo Coelho",     rating: 4.7, bg: "from-amber-900 via-yellow-800 to-orange-950", color: "#fde68a", dateAdded: "2024-03-01", genre: "Fiction" },
  { id: 14, title: "Rich Dad Poor Dad",               author: "Robert Kiyosaki",  rating: 4.5, bg: "from-green-900 via-emerald-800 to-teal-950",  color: "#6ee7b7", dateAdded: "2024-03-04", genre: "Finance" },
  { id: 15, title: "The Pragmatic Programmer",        author: "Andrew Hunt",      rating: 4.6, bg: "from-sky-900 via-blue-800 to-indigo-950",     color: "#7dd3fc", dateAdded: "2024-03-07", genre: "Tech" },
  { id: 16, title: "Man's Search for Meaning",        author: "Viktor Frankl",    rating: 4.8, bg: "from-neutral-800 via-stone-700 to-zinc-900",  color: "#d4d4d4", dateAdded: "2024-03-10", genre: "Psychology" },
  { id: 17, title: "The Great Gatsby",                author: "F. Scott Fitzgerald", rating: 4.4, bg: "from-yellow-800 via-amber-700 to-orange-900", color: "#fbbf24", dateAdded: "2024-03-13", genre: "Classic" },
  { id: 18, title: "1984",                            author: "George Orwell",    rating: 4.7, bg: "from-zinc-900 via-gray-800 to-slate-950",     color: "#a1a1aa", dateAdded: "2024-03-16", genre: "Dystopia" },
  { id: 19, title: "Brave New World",                 author: "Aldous Huxley",    rating: 4.5, bg: "from-indigo-900 via-violet-800 to-purple-950", color: "#a5b4fc", dateAdded: "2024-03-19", genre: "Dystopia" },
  { id: 20, title: "The Hitchhiker's Guide",          author: "Douglas Adams",    rating: 4.7, bg: "from-cyan-900 via-sky-800 to-blue-950",       color: "#67e8f9", dateAdded: "2024-03-22", genre: "Sci-Fi" },
  { id: 21, title: "Becoming",                        author: "Michelle Obama",   rating: 4.8, bg: "from-rose-900 via-pink-800 to-fuchsia-950",   color: "#fda4af", dateAdded: "2024-03-25", genre: "Memoir" },
  { id: 22, title: "Zero to One",                     author: "Peter Thiel",      rating: 4.5, bg: "from-slate-800 via-gray-700 to-zinc-900",     color: "#cbd5e1", dateAdded: "2024-03-28", genre: "Business" },
  { id: 23, title: "The Book Thief",                  author: "Markus Zusak",     rating: 4.6, bg: "from-blue-900 via-indigo-800 to-violet-950",  color: "#93c5fd", dateAdded: "2024-04-01", genre: "Fiction" },
  { id: 24, title: "Meditations",                     author: "Marcus Aurelius",  rating: 4.7, bg: "from-stone-900 via-neutral-800 to-zinc-950",  color: "#d6d3d1", dateAdded: "2024-04-04", genre: "Philosophy" },
];

const ALL_INITIAL = [...INITIAL_FAVOURITES, ...EXTRA_BOOKS];

const PER_PAGE = 12;

const SORT_OPTIONS = [
  { label: "Date Added",    value: "date_desc" },
  { label: "Date: Oldest", value: "date_asc" },
  { label: "Rating: High", value: "rating_desc" },
  { label: "Rating: Low",  value: "rating_asc" },
  { label: "Title A–Z",    value: "title_asc" },
  { label: "Title Z–A",    value: "title_desc" },
];

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
        <span className="text-sm">{current?.label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1825] border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
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
        </>
      )}
    </div>
  );
}

/* ─── BOOK CARD ──────────────────────────────────────────────────────── */
function FavouriteCard({ book, onUnfavourite }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover */}
      <div className={`relative w-full aspect-[2/3] rounded-xl bg-gradient-to-br ${book.bg} overflow-hidden shadow-lg shadow-black/50 border border-white/5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-violet-950/60`}>

        {/* Heart — always visible, filled rose */}
        <button
          onClick={(e) => { e.stopPropagation(); onUnfavourite(book.id); }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 hover:bg-rose-500/20"
          title="Remove from favourites"
        >
          <PiHeartFill size={13} className="text-rose-500" />
        </button>

        {/* Spine accent */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

        {/* Cover art */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-1.5">
          <MdOutlineAutoStories size={20} style={{ color: book.color, opacity: 0.75 }} />
          <p
            className="text-center text-[10px] font-extrabold leading-tight uppercase mt-0.5"
            style={{ color: book.color, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
          >
            {book.title.length > 32 ? book.title.slice(0, 32) + "…" : book.title}
          </p>
          <p className="text-[8px] text-white/40 uppercase tracking-wide mt-0.5">
            {book.author.split(" ").slice(-1)[0]}
          </p>
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/55 flex flex-col items-center justify-end pb-4 gap-2 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <button className="flex items-center gap-1.5 text-white text-[11px] font-semibold bg-violet-600/80 hover:bg-violet-600 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all">
            <BookOpen size={11} />
            Read Now
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onUnfavourite(book.id); }}
            className="flex items-center gap-1.5 text-rose-400 text-[11px] font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
          >
            <Trash2 size={11} />
            Remove
          </button>
        </div>

        {/* Bottom gradient + rating */}
        <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            <span className="text-amber-400 text-[9px] font-bold">{book.rating}</span>
          </div>
          <span className="text-white/30 text-[8px] uppercase tracking-wide">{book.genre}</span>
        </div>
      </div>

      {/* Below card info */}
      <div className="mt-2.5 px-0.5">
        <p className="text-white text-[12px] font-semibold leading-snug line-clamp-1">{book.title}</p>
        <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">{book.author}</p>
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

/* ─── EMPTY STATE ────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <Heart size={28} className="text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-base">No favourites yet</p>
        <p className="text-gray-500 text-sm mt-1">Books you heart will appear here.</p>
      </div>
      <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all mt-2">
        <MdOutlineAutoStories size={16} />
        Browse Books
      </button>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function MyFavourites() {
  const [books, setBooks] = useState(ALL_INITIAL);
  const [sort, setSort]         = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [removed, setRemoved]   = useState(null);

  const sorted = useMemo(() => {
    const list = [...books];
    switch (sort) {
      case "date_asc":    return list.sort((a, b) => a.dateAdded.localeCompare(b.dateAdded));
      case "rating_desc": return list.sort((a, b) => b.rating - a.rating);
      case "rating_asc":  return list.sort((a, b) => a.rating - b.rating);
      case "title_asc":   return list.sort((a, b) => a.title.localeCompare(b.title));
      case "title_desc":  return list.sort((a, b) => b.title.localeCompare(a.title));
      default:            return list.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    }
  }, [books, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pageBooks  = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSort = (val) => { setSort(val); setCurrentPage(1); };

  const handleUnfavourite = (id) => {
    const book = books.find((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setRemoved(book);
    // If removing causes current page to exceed new totalPages, go back
    const newTotal = Math.max(1, Math.ceil((books.length - 1) / PER_PAGE));
    if (currentPage > newTotal) setCurrentPage(newTotal);
    setTimeout(() => setRemoved(null), 4000);
  };

  const handleUndo = () => {
    if (removed) {
      setBooks((prev) => [...prev, removed]);
      setRemoved(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] text-white px-6 py-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            My Favourites
            <PiHeartFill className="text-rose-500 text-xl" />
          </h1>
          <SortDropdown value={sort} onChange={handleSort} />
        </div>
        <p className="text-gray-500 text-sm mb-7">
          {books.length} {books.length === 1 ? "book" : "books"} saved
        </p>

        {/* Grid or empty */}
        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-6 gap-4">
              {pageBooks.map((book) => (
                <FavouriteCard
                  key={book.id}
                  book={book}
                  onUnfavourite={handleUnfavourite}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPage={setCurrentPage}
            />

            {/* Page info */}
            <p className="text-center text-gray-600 text-xs mt-4">
              Page {currentPage} of {totalPages} · Showing{" "}
              {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, sorted.length)} of {sorted.length} books
            </p>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Undo toast */}
      {removed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1e1b2e] border border-white/10 rounded-2xl px-5 py-3 shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-4 duration-300">
          <Heart size={14} className="text-rose-400" />
          <p className="text-sm text-gray-300">
            <span className="text-white font-semibold">{removed.title}</span> removed from favourites
          </p>
          <button
            onClick={handleUndo}
            className="text-violet-400 hover:text-violet-300 text-sm font-semibold ml-1 transition-colors"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}