"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X, Star, User, Calendar, Tag, BookOpen, Compass, ArrowRight, Heart
} from "lucide-react";
import { MdOutlineAutoStories } from "react-icons/md";
import { PiBookmarkSimpleFill } from "react-icons/pi";
import { GiBookshelf } from "react-icons/gi";

export default function BookModal({ book, onClose }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!book) return null;

  const handleReadNow = () => {
    // Save to localStorage so reader can display this book's title/info dynamically
    const bookData = {
      title: book.title,
      author: book.author,
      totalPages: book.pages || 304,
      cover: "📖",
    };
    localStorage.setItem("currentBook", JSON.stringify(bookData));
    
    // Close modal first
    onClose();
    
    // Navigate to read page
    router.push("/read");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-xl bg-[#16141f] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${book.bg || "from-violet-900 via-purple-800 to-indigo-950"}`} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <X size={15} />
        </button>

        <div className="flex gap-6 p-6 pb-5">
          {/* Cover thumbnail */}
          <div className={`shrink-0 w-28 h-40 rounded-xl bg-gradient-to-br ${book.bg || "from-violet-900 via-purple-800 to-indigo-950"} border border-white/10 shadow-lg shadow-black/50 flex flex-col items-center justify-center p-2 gap-1`}>
            <MdOutlineAutoStories size={22} style={{ color: book.color || "#a78bfa" }} />
            <p className="text-center text-[9px] font-extrabold uppercase leading-tight" style={{ color: book.color || "#a78bfa" }}>
              {book.title.replace("Harry Potter and the ", "").replace("Harry Potter: ", "").replace("Harry Potter – ", "").slice(0, 40)}
            </p>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base leading-snug mb-1">{book.title}</h2>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={11} className={s <= Math.round(book.rating) ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/10"} />
                ))}
              </div>
              <span className="text-amber-400 text-xs font-bold">{book.rating}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <User size={11} className="text-violet-400 shrink-0" />
                <span className="truncate">{book.author}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar size={11} className="text-violet-400 shrink-0" />
                <span>{book.year || 2023}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Tag size={11} className="text-violet-400 shrink-0" />
                <span>{book.genre || "Fiction"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <BookOpen size={11} className="text-violet-400 shrink-0" />
                <span>{book.pages || 320} pages</span>
              </div>
            </div>

            {/* Availability badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-semibold">Available in Library</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-5">
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {book.desc || "An engaging story that will keep you hooked from the first page to the last. Discover characters you will love and a plot full of unexpected turns."}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-white/5" />

        {/* Action buttons */}
        <div className="flex items-center gap-3 p-5">
          {/* Primary — Read Now */}
          <button
            onClick={handleReadNow}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-violet-900/40 group"
          >
            <GiBookshelf size={16} />
            Read Now
          </button>

          {/* Explore More — key CTA */}
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-white text-sm font-semibold py-2.5 rounded-xl transition-all group">
            <Compass size={15} className="text-violet-400 group-hover:rotate-12 transition-transform" />
            Explore More
            <ArrowRight size={13} className="text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Icon actions */}
          <button
            onClick={() => setLiked(!liked)}
            className="w-10 h-10 rounded-xl border border-white/10 hover:border-rose-500/40 bg-white/5 flex items-center justify-center transition-all"
          >
            <Heart size={15} className={liked ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-400"} />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className="w-10 h-10 rounded-xl border border-white/10 hover:border-violet-500/40 bg-white/5 flex items-center justify-center transition-all"
          >
            <PiBookmarkSimpleFill size={15} className={saved ? "text-violet-400" : "text-gray-400"} />
          </button>
        </div>
      </div>
    </div>
  );
}