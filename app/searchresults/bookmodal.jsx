"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X, Star, User, Calendar, Tag, BookOpen, Compass, ArrowRight, Heart
} from "lucide-react";
import { MdOutlineAutoStories } from "react-icons/md";
import { PiBookmarkSimpleFill } from "react-icons/pi";
import { GiBookshelf } from "react-icons/gi";
import { bookService } from "@/app/services/bookService";

export default function BookModal({ book, onClose }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [fullBook, setFullBook] = useState(book);
  const [detailLoading, setDetailLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Sync fullBook when the book prop changes
  useEffect(() => {
    setFullBook(book);
  }, [book]);

  // If the book is missing rich fields (e.g. came from Favourites), fetch them
  useEffect(() => {
    if (!book?.id) return;
    const needsEnrich = !book.desc || book.desc === "No description available for this book.";
    if (!needsEnrich) return;

    setDetailLoading(true);
    bookService.getBookById(book.id)
      .then((data) => {
        if (!data) return;
        const GRADIENTS = [
          "from-violet-900 via-purple-800 to-fuchsia-900",
          "from-sky-900 via-blue-800 to-indigo-900",
          "from-red-900 via-red-800 to-yellow-900",
        ];
        setFullBook((prev) => ({
          ...prev,
          desc:          data.description   || prev.desc,
          pages:         data.pageCount     || prev.pages,
          year:          data.publishedDate ? data.publishedDate.split("-")[0] : prev.year,
          genre:         data.categories?.length ? data.categories[0] : prev.genre,
          rating:        data.averageRating || prev.rating,
          thumbnail:     data.thumbnail     || prev.thumbnail,
          isReadable:    data.isReadable    ?? prev.isReadable,
          webReaderLink: data.webReaderLink ?? prev.webReaderLink,
          bg:            prev.bg            || GRADIENTS[0],
        }));
      })
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  }, [book?.id]);

  // Check if this book is already favourited when modal opens
  useEffect(() => {
    if (!book?.id) return;
    bookService.checkFavourite(book.id)
      .then((res) => setLiked(res.isFavourited))
      .catch(() => {});
  }, [book?.id]);

  if (!book) return null;

  // Normalise fields — use enriched fullBook data
  const author = fullBook.author || "Unknown Author";
  const desc   = fullBook.desc   || "No description available for this book.";
  const year   = fullBook.year   || "—";
  const genre  = fullBook.genre  || "Fiction";
  const pages  = fullBook.pages  || "—";

  const handleReadNow = () => {
    const bookData = {
      id: fullBook.id,
      title: fullBook.title,
      author,
      totalPages: fullBook.pages || 304,
      cover: "📖",
      thumbnail: fullBook.thumbnail || null,
      webReaderLink: fullBook.webReaderLink || null,
    };
    localStorage.setItem("currentBook", JSON.stringify(bookData));
    onClose();
    if (fullBook.webReaderLink) {
      window.open(fullBook.webReaderLink, "_blank");
    } else {
      router.push("/read");
    }
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (liked) {
        await bookService.removeFavourite(fullBook.id);
        setLiked(false);
      } else {
        await bookService.addFavourite(fullBook.id, fullBook.title, author, fullBook.thumbnail);
        setLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle favourite:", err);
    } finally {
      setLikeLoading(false);
    }
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
        <div className={`h-1.5 w-full bg-gradient-to-r ${fullBook.bg || "from-violet-900 via-purple-800 to-indigo-950"}`} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <X size={15} />
        </button>

        <div className="flex gap-6 p-6 pb-5">
          {/* Cover — thumbnail image or CSS art fallback */}
          <div
            className={`shrink-0 w-28 h-40 rounded-xl bg-gradient-to-br ${fullBook.bg || "from-violet-900 via-purple-800 to-indigo-950"} border border-white/10 shadow-lg shadow-black/50 overflow-hidden flex flex-col items-center justify-center p-2 gap-1`}
          >
            {fullBook.thumbnail ? (
              <img
                src={fullBook.thumbnail}
                alt={fullBook.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <MdOutlineAutoStories size={22} style={{ color: fullBook.color || "#a78bfa" }} />
                <p
                  className="text-center text-[9px] font-extrabold uppercase leading-tight"
                  style={{ color: fullBook.color || "#a78bfa" }}
                >
                  {fullBook.title?.slice(0, 40)}
                </p>
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base leading-snug mb-1">{fullBook.title}</h2>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={11}
                    className={
                      s <= Math.round(fullBook.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-white/10 text-white/10"
                    }
                  />
                ))}
              </div>
              <span className="text-amber-400 text-xs font-bold">{fullBook.rating}</span>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <User size={11} className="text-violet-400 shrink-0" />
                <span className="truncate">{author}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar size={11} className="text-violet-400 shrink-0" />
                <span>{year}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Tag size={11} className="text-violet-400 shrink-0" />
                <span>{genre}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <BookOpen size={11} className="text-violet-400 shrink-0" />
                <span>{pages} pages</span>
              </div>
            </div>

            {/* Availability badge */}
            {fullBook.isReadable ? (
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[11px] font-semibold">Free to Read</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-violet-400 text-[11px] font-semibold">Preview Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-5">
          {detailLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-full" />
              <div className="h-3 bg-white/10 rounded w-5/6" />
              <div className="h-3 bg-white/10 rounded w-4/6" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{desc}</p>
          )}
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-white/5" />

        {/* Action buttons */}
        <div className="flex items-center gap-3 p-5">
          {/* Primary — Read / Preview */}
          <button
            onClick={handleReadNow}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-violet-900/40"
          >
            <GiBookshelf size={16} />
            {fullBook.isReadable ? "Read Now" : "Preview"}
          </button>

          {/* Explore More */}
          <button 
            onClick={() => {
              onClose();
              router.push("/searchresults");
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-white text-sm font-semibold py-2.5 rounded-xl transition-all group"
          >
            <Compass size={15} className="text-violet-400 group-hover:rotate-12 transition-transform" />
            Explore More
            <ArrowRight size={13} className="text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Heart — connected to real favourites API */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            title={liked ? "Remove from favourites" : "Add to favourites"}
            className={`w-10 h-10 rounded-xl border bg-white/5 flex items-center justify-center transition-all ${
              liked
                ? "border-rose-500/40 bg-rose-500/10"
                : "border-white/10 hover:border-rose-500/40"
            } ${likeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart size={15} className={liked ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-400"} />
          </button>

          {/* Bookmark */}
          <button className="w-10 h-10 rounded-xl border border-white/10 hover:border-violet-500/40 bg-white/5 flex items-center justify-center transition-all">
            <PiBookmarkSimpleFill size={15} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}