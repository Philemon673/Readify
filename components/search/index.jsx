"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar({
  value: propValue,
  onChange: propOnChange,
  placeholder = "Search by title, author, or genre...",
  ...props
}) {
  const router = useRouter();
  const [localValue, setLocalValue] = useState(propValue ?? "");
  const debounceRef = useRef(null);

  // Sync if parent updates the controlled value (e.g. searchresults page URL changes)
  useEffect(() => {
    if (propValue !== undefined) setLocalValue(propValue);
  }, [propValue]);

  const navigate = (query) => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/searchresults?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    if (propOnChange) propOnChange(e);

    // Live search: navigate after 350ms of no typing
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => navigate(val), 350);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      clearTimeout(debounceRef.current);
      navigate(localValue);
    }
    if (props.onKeyDown) props.onKeyDown(e);
  };

  return (
    <div className="flex-1 max-w-lg relative group">
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-[#120e24]/30 border border-[#582fff]/20 rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#582fff]/60 focus:bg-[#120e24]/60 focus:shadow-[0_0_22px_rgba(88,47,255,0.3)] shadow-[0_0_15px_rgba(88,47,255,0.06)] transition-all font-semibold"
        {...props}
      />
      <Search
        size={14}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#582fff] transition-colors duration-200"
      />
    </div>
  );
}
