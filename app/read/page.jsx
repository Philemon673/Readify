"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Sun,
  Moon,
  Type,
  List,
  Bookmark,
  MoreHorizontal,
  BookOpen,
  AlignJustify,
  Lock,
  Check,
  ChevronUp,
  ChevronDown,
  Circle,
  Info,
} from "lucide-react";
import { BsCircleFill } from "react-icons/bs";
import { MdOutlineEditNote } from "react-icons/md";
import { useRouter } from "next/navigation";
// ─── Book Data ────────────────────────────────────────────────────────────────
const BOOK = {
  title: "The Midnight Library",
  author: "Matt Haig",
  cover: "🌙",
  totalPages: 304,
};

const CHAPTERS = [
  { id: 1, title: "Between Life and Death", done: true, locked: false },
  { id: 2, title: "A Library of Possibilities", done: true, locked: false },
  { id: 3, title: "The First Book of Regret", done: true, locked: false },
  { id: 4, title: "Another Life", done: true, locked: false },
  { id: 5, title: "The Mountain View", done: true, locked: false },
  { id: 6, title: "The Musician", done: true, locked: false },
  { id: 7, title: "The Nurse", done: true, locked: false },
  { id: 8, title: "The Olympian", done: false, locked: false, current: true },
  { id: 9, title: "The Entrepreneur", done: false, locked: false },
  { id: 10, title: "The Philosopher", done: false, locked: false },
  { id: 11, title: "The Friend", done: false, locked: false },
  { id: 12, title: "The Mother", done: false, locked: false },
  { id: 13, title: "The Midnight Library", done: false, locked: true },
  { id: 14, title: "The Choice", done: false, locked: true },
  { id: 15, title: "Notes from the Other Side", done: false, locked: true },
];

const CHAPTER_CONTENT = {
  8: {
    title: "The Olympian",
    subtitle: "CHAPTER 8",
    paragraphs: [
      "Nora ran.",
      "The wind rushed past her ears, cool and sharp, as her feet pounded against the damp pavement. The stadium lights blazed above, casting long shadows across the track. For the first time in a long time, she felt alive.",
      "In this life, she was an Olympian.",
      "It had not been an easy path. Years of training. Early mornings. Sacrifices. Pain. Doubt. But here she was, seconds away from everything she had ever dreamed of.",
      "The starting gun fired.",
      "Nora soared.",
      "As she crossed the finish line, gasping for breath, tears filled her eyes. She had never felt more real.",
    ],
    startPage: 96,
  },
  9: {
    title: "The Entrepreneur",
    subtitle: "CHAPTER 9",
    paragraphs: [
      "In this life, Nora Seed was wealthy.",
      "She had built a company from scratch, a technology startup in San Francisco that had grown from a kitchen table project into a billion-dollar enterprise.",
      "Yet standing in her glass-walled office, overlooking the city, she felt the familiar hollowness.",
      "The money was there. The success was undeniable. The magazine covers, the speaking engagements, the charity galas.",
      "But something was missing.",
      "It was always missing.",
      "She looked at the photo on her desk — the one of her mother, taken before everything fell apart — and wondered if any version of herself would ever feel truly complete.",
    ],
    startPage: 112,
  },
  10: {
    title: "The Philosopher",
    subtitle: "CHAPTER 10",
    paragraphs: [
      "The lecture hall was full.",
      "Professor Nora Seed stood at the podium, her voice steady and clear as she spoke about the works of Schopenhauer and the nature of regret.",
      "She had written four books. Tenure at Oxford. Students who flew from across the world to hear her speak.",
      "Knowledge, she often told them, was not the same as wisdom.",
      "She had knowledge in abundance. Wisdom, perhaps, was still finding its way to her.",
      "After the lecture, a young student approached her with eyes full of desperate questions.",
      "\"How do you know,\" the student asked, \"when a life is the right one?\"",
      "Nora paused. It was the one question she still could not answer.",
    ],
    startPage: 128,
  },
};

const DEFAULT_CONTENT = (chapterId) => ({
  title: CHAPTERS[chapterId - 1]?.title || "Chapter",
  subtitle: `CHAPTER ${chapterId}`,
  paragraphs: [
    "The story continued, page after page, life after life.",
    "Nora moved through each world with the quiet awareness of someone who had seen too many versions of herself to be surprised by anything.",
    "Yet each life brought something new — a feeling, a memory, a fragment of what could have been.",
    "She was learning, slowly, what it meant to simply be.",
  ],
  startPage: 96 + (chapterId - 8) * 16,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getContent(chapterId) {
  return CHAPTER_CONTENT[chapterId] || DEFAULT_CONTENT(chapterId);
}

function progressPercent(chapterId) {
  return Math.round(((chapterId - 1) / CHAPTERS.length) * 100);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EReaderPage() {
  const router = useRouter();
  const [currentChapter, setCurrentChapter] = useState(8);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [activeTab, setActiveTab] = useState("chapters"); // chapters | bookmarks | notes
  const [showLess, setShowLess] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const contentRef = useRef(null);

  const [activeBook, setActiveBook] = useState(BOOK);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("currentBook");
      if (saved) {
        try {
          setActiveBook(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const content = getContent(currentChapter);
  const progress = progressPercent(currentChapter);
  const currentPage = content.startPage;

  const visibleChapters = showLess
    ? CHAPTERS.filter((c) => c.done || c.current).slice(0, 5)
    : CHAPTERS;

  function goToChapter(id) {
    const ch = CHAPTERS.find((c) => c.id === id);
    if (ch?.locked) return;
    setCurrentChapter(id);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }

  function goNext() {
    const nextUnlocked = CHAPTERS.find(
      (c) => c.id > currentChapter && !c.locked
    );
    if (nextUnlocked) goToChapter(nextUnlocked.id);
  }

  function goPrev() {
    const prevChapters = CHAPTERS.filter(
      (c) => c.id < currentChapter && !c.locked
    );
    if (prevChapters.length > 0)
      goToChapter(prevChapters[prevChapters.length - 1].id);
  }

  // ─── Theme vars ─────────────────────────────────────────────────────────────
  const t = {
    appBg: darkMode ? "bg-[#1a1a2e]" : "bg-gray-100",
    sidebar: darkMode ? "bg-[#16213e]" : "bg-white",
    sidebarBorder: darkMode ? "border-[#2a2a4a]" : "border-gray-200",
    sidebarText: darkMode ? "text-gray-100" : "text-gray-900",
    sidebarMuted: darkMode ? "text-gray-400" : "text-gray-500",
    chapterActive: darkMode ? "bg-[#6c5ce7] text-white" : "bg-[#6c5ce7] text-white",
    chapterHover: darkMode ? "hover:bg-[#2a2a4a]" : "hover:bg-gray-100",
    pageBg: darkMode ? "bg-[#f5f0e8]" : "bg-[#faf8f3]",
    pageText: "text-[#2c2415]",
    topBar: darkMode ? "bg-[#16213e] border-[#2a2a4a]" : "bg-white border-gray-200",
    topBarText: darkMode ? "text-gray-100" : "text-gray-900",
    topBarIcon: darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900",
    bottomBar: darkMode ? "bg-[#f5f0e8]" : "bg-[#faf8f3]",
    progressBg: darkMode ? "bg-[#2a2a4a]" : "bg-gray-200",
    progressFill: "bg-[#6c5ce7]",
    iconBtn: darkMode
      ? "text-gray-300 hover:text-white hover:bg-[#2a2a4a] rounded-lg p-1.5 transition-all"
      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-all",
    panel: darkMode
      ? "bg-[#16213e] border border-[#2a2a4a] shadow-2xl"
      : "bg-white border border-gray-200 shadow-2xl",
    panelText: darkMode ? "text-gray-100" : "text-gray-900",
  };

  return (
    <div className={`flex flex-col h-screen ${t.appBg} font-sans overflow-hidden`}>
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header
        className={`flex items-center justify-between px-4 py-2.5 border-b ${t.topBar} ${t.topBarText} z-20 shrink-0`}
      >
        {/* Left */}
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-1.5 text-sm font-medium ${t.topBarIcon} transition-colors`}
        >
          <ChevronLeft size={18} />
          <span>Back to Library</span>
        </button>

        {/* Center */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm font-semibold leading-tight">{activeBook.title}</p>
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            by {activeBook.author}
          </p>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={t.iconBtn}
            title="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Font size panel */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFontPanel((p) => !p);
                setShowMenu(false);
                setShowToc(false);
              }}
              className={`${t.iconBtn} ${showFontPanel ? (darkMode ? "bg-[#2a2a4a] text-white" : "bg-gray-100 text-gray-900") : ""}`}
              title="Font size"
            >
              <Type size={18} />
            </button>
            {showFontPanel && (
              <div
                className={`absolute right-0 top-10 w-48 p-3 rounded-xl z-50 ${t.panel}`}
              >
                <p className={`text-xs mb-2 font-medium ${t.panelText}`}>
                  Font size
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSize((s) => Math.max(12, s - 1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold border ${darkMode ? "border-[#2a2a4a] text-gray-200 hover:bg-[#2a2a4a]" : "border-gray-200 text-gray-700 hover:bg-gray-100"} transition-colors`}
                  >
                    A<span className="text-xs">−</span>
                  </button>
                  <span className={`flex-1 text-center text-sm font-medium ${t.panelText}`}>
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold border ${darkMode ? "border-[#2a2a4a] text-gray-200 hover:bg-[#2a2a4a]" : "border-gray-200 text-gray-700 hover:bg-gray-100"} transition-colors`}
                  >
                    A<span className="text-xs">+</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TOC toggle (mobile-friendly) */}
          <button
            onClick={() => {
              setShowToc((t) => !t);
              setShowFontPanel(false);
              setShowMenu(false);
            }}
            className={`${t.iconBtn} ${showToc ? (darkMode ? "bg-[#2a2a4a] text-white" : "bg-gray-100 text-gray-900") : ""}`}
            title="Table of contents"
          >
            <List size={18} />
          </button>

          <button
            onClick={() => setBookmarked((b) => !b)}
            className={`${t.iconBtn} ${bookmarked ? "text-[#6c5ce7]" : ""}`}
            title="Bookmark"
          >
            <Bookmark size={18} fill={bookmarked ? "#6c5ce7" : "none"} />
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMenu((m) => !m);
                setShowFontPanel(false);
                setShowToc(false);
              }}
              className={t.iconBtn}
              title="More options"
            >
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div
                className={`absolute right-0 top-10 w-44 rounded-xl z-50 overflow-hidden ${t.panel}`}
              >
                {["Share", "Copy link", "Report issue", "About this book"].map(
                  (item) => (
                    <button
                      key={item}
                      className={`w-full text-left px-4 py-2.5 text-sm ${darkMode ? "text-gray-200 hover:bg-[#2a2a4a]" : "text-gray-700 hover:bg-gray-50"} transition-colors`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className={`w-72 shrink-0 flex flex-col border-r ${t.sidebar} ${t.sidebarBorder} z-10 overflow-hidden`}
        >
          {/* Book info */}
          <div className={`p-4 border-b ${t.sidebarBorder}`}>
            <div className="flex items-center gap-3">
              {/* Cover */}
              <div className="w-16 h-20 rounded-lg bg-[#1a0a3e] flex flex-col items-center justify-center shrink-0 shadow-md p-1">
                <span className="text-2xl">{activeBook.cover || "🌙"}</span>
                <span className="text-[7px] text-purple-300 font-bold mt-0.5 text-center leading-tight uppercase line-clamp-2">
                  {activeBook.title}
                </span>
              </div>
              <div>
                <p className={`font-semibold text-sm leading-tight ${t.sidebarText}`}>
                  {activeBook.title}
                </p>
                <p className={`text-xs mt-0.5 ${t.sidebarMuted}`}>{activeBook.author}</p>
                <p className={`text-xs mt-2 ${t.sidebarMuted}`}>{progress}% Complete</p>
                <div className={`mt-1 h-1 rounded-full w-36 ${t.progressBg}`}>
                  <div
                    className={`h-1 rounded-full ${t.progressFill} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className={`flex border-b ${t.sidebarBorder} shrink-0`}>
            {[
              { id: "chapters", icon: <AlignJustify size={16} /> },
              { id: "bookmarks", icon: <Bookmark size={16} /> },
              { id: "notes", icon: <MdOutlineEditNote size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-3 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-[#6c5ce7] border-b-2 border-[#6c5ce7]"
                    : t.sidebarMuted
                }`}
              >
                {tab.icon}
              </button>
            ))}
          </div>

          {/* Chapter list */}
          {activeTab === "chapters" && (
            <div className="flex-1 overflow-y-auto">
              <p
                className={`px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest ${t.sidebarMuted}`}
              >
                Chapters
              </p>
              <ul className="pb-2">
                {visibleChapters.map((ch) => (
                  <li key={ch.id}>
                    <button
                      onClick={() => goToChapter(ch.id)}
                      disabled={ch.locked}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg mx-1 transition-all duration-150 ${
                        ch.current || ch.id === currentChapter
                          ? t.chapterActive
                          : ch.locked
                          ? `${t.sidebarMuted} cursor-not-allowed opacity-50`
                          : `${t.sidebarText} ${t.chapterHover}`
                      }`}
                      style={{ width: "calc(100% - 8px)" }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs shrink-0 w-4 text-right ${ch.id === currentChapter ? "text-purple-200" : t.sidebarMuted}`}>
                          {ch.id}
                        </span>
                        <span className="truncate text-left">{ch.title}</span>
                      </div>
                      <div className="shrink-0 ml-2">
                        {ch.locked ? (
                          <Lock size={13} className="opacity-60" />
                        ) : ch.done ? (
                          <Check size={14} className={ch.id === currentChapter ? "text-purple-200" : "text-[#6c5ce7]"} />
                        ) : ch.id === currentChapter ? (
                          <BsCircleFill size={8} className="text-purple-200" />
                        ) : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <Bookmark size={32} className={t.sidebarMuted} />
              <p className={`mt-3 text-sm font-medium ${t.sidebarText}`}>No bookmarks yet</p>
              <p className={`mt-1 text-xs text-center ${t.sidebarMuted}`}>
                Tap the bookmark icon in the top bar to save your spot.
              </p>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <MdOutlineEditNote size={36} className={t.sidebarMuted} />
              <p className={`mt-3 text-sm font-medium ${t.sidebarText}`}>No notes yet</p>
              <p className={`mt-1 text-xs text-center ${t.sidebarMuted}`}>
                Highlight text while reading to add notes.
              </p>
            </div>
          )}

          {/* Show less / more toggle */}
          {activeTab === "chapters" && (
            <button
              onClick={() => setShowLess((s) => !s)}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-t ${t.sidebarBorder} ${t.sidebarMuted} hover:text-[#6c5ce7] transition-colors`}
            >
              {showLess ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              {showLess ? "Show More" : "Show Less"}
            </button>
          )}
        </aside>

        {/* ── Reading area ─────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Scroll container */}
          <div
            ref={contentRef}
            className={`flex-1 overflow-y-auto ${t.pageBg}`}
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.04) 31px, rgba(0,0,0,0.04) 32px)",
            }}
          >
            {/* Page content */}
            <div
              className={`max-w-xl mx-auto px-8 pt-14 pb-8 ${t.pageText}`}
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              {/* Chapter header */}
              <p
                className="text-center text-xs font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: "#6c5ce7" }}
              >
                {content.subtitle}
              </p>
              <h1
                className="text-center mb-8"
                style={{ fontSize: "2rem", fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                {content.title}
              </h1>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 mb-8 opacity-40">
                <Circle size={4} fill="currentColor" />
                <span className="text-lg">✦</span>
                <Circle size={4} fill="currentColor" />
              </div>

              {/* Body paragraphs */}
              <div className="space-y-5">
                {content.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="leading-relaxed"
                    style={{
                      fontSize: `${fontSize}px`,
                      textIndent: i === 0 ? "0" : "1.5rem",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Padding at bottom */}
              <div className="h-16" />
            </div>
          </div>

          {/* ── Bottom bar ─────────────────────────────────────────────────── */}
          <div
            className={`${t.bottomBar} ${t.pageText} border-t border-black/10 px-6 py-3 flex items-center gap-4 shrink-0`}
          >
            {/* Prev */}
            <button
              onClick={goPrev}
              disabled={currentChapter <= 1}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                currentChapter <= 1
                  ? "opacity-30 cursor-not-allowed border-black/10"
                  : "border-black/15 hover:bg-black/5 active:scale-95"
              }`}
            >
              <ChevronLeft size={16} />
              Previous Chapter
            </button>

            {/* Progress scrubber */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <input
                type="range"
                min={1}
                max={activeBook.totalPages}
                value={currentPage}
                readOnly
                className="w-full accent-[#6c5ce7]"
                style={{ accentColor: "#6c5ce7" }}
              />
              <span className="text-xs opacity-50">
                {currentPage} of {activeBook.totalPages}
              </span>
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              disabled={CHAPTERS.find((c) => c.id > currentChapter && !c.locked) == null}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                CHAPTERS.find((c) => c.id > currentChapter && !c.locked) == null
                  ? "opacity-30 cursor-not-allowed bg-gray-300"
                  : "bg-[#6c5ce7] text-white hover:bg-[#5b4bd6] active:scale-95"
              }`}
            >
              Next Chapter
              <ChevronLeft size={16} className="rotate-180" />
            </button>
          </div>

          {/* Right side quick-access rail */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {[
              {
                icon: <Type size={15} />,
                action: () => setShowFontPanel((p) => !p),
                title: "Font size",
              },
              {
                icon: darkMode ? <Sun size={15} /> : <Moon size={15} />,
                action: () => setDarkMode((d) => !d),
                title: "Toggle theme",
              },
              {
                icon: <Sun size={15} />,
                action: () => {},
                title: "Brightness",
              },
              {
                icon: <AlignJustify size={15} />,
                action: () => {},
                title: "Line spacing",
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                title={btn.title}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/10 hover:bg-black/20 text-[#2c2415] transition-all active:scale-95"
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Click-outside overlay for panels */}
      {(showFontPanel || showMenu || showToc) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowFontPanel(false);
            setShowMenu(false);
            setShowToc(false);
          }}
        />
      )}
    </div>
  );
}