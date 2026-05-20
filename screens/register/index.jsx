"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaApple } from "react-icons/fa";
import { BookOpen } from "lucide-react";

const EyeIcon = ({ visible }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FIELDS = [
  { label: "Full name",        id: "name",     type: "text",     placeholder: "Enter your full name",   autoComplete: "name" },
  { label: "Email address",    id: "email",    type: "email",    placeholder: "you@example.com",        autoComplete: "email" },
  { label: "Password",         id: "password", type: "password", placeholder: "Create a password",      autoComplete: "new-password", hasToggle: true },
  { label: "Confirm password", id: "confirm",  type: "password", placeholder: "Confirm your password",  autoComplete: "new-password", hasToggle: true },
];

const SOCIAL_BUTTONS = [
  { id: "google", icon: <FaGoogle size={16} />, label: "Google" },
  { id: "apple",  icon: <FaApple  size={17} />, label: "Apple"  },
];

export default function ReadifySignup() {
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [visible, setVisible] = useState({ password: false, confirm: false });
  const [focused, setFocused] = useState("");
  const [agreed,  setAgreed]  = useState(false);

  const handleChange     = (e) => setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const toggleVisibility = (field) => setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  const handleSubmit     = (e) => e.preventDefault();

  return (
    <div
      className="relative flex flex-col min-h-screen w-full"
      style={{
        background: "linear-gradient(135deg, #0a0618 0%, #1c0e35 50%, #4c1245 100%)",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Navbar */}
      <nav className="px-6 py-4 z-20">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-md bg-purple-600 flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">Readify</span>
        </Link>
      </nav>

      {/* Card Wrapper */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 md:px-8 z-10">
        <div
          className="w-full max-w-[420px] rounded-3xl px-8 py-9 border border-white/70 shadow-2xl"
          style={{
            background: "rgba(255, 252, 248, 0.93)",
            margin: "auto", // Safe vertical alignment for smaller screen heights
            animation: "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
        {/* Header */}
        <h1 className="text-[22px] font-bold tracking-tight text-[#1e0a3c] mb-1">
          Create Your Account
        </h1>
        <p className="text-[13px] text-[#7c6b8a] mb-6">
          Start your reading journey today
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Fields */}
          <div className="flex flex-col gap-3 mb-4">
            {FIELDS.map(({ label, id, type, placeholder, autoComplete, hasToggle }) => {
              const inputType = hasToggle && visible[id] ? "text" : type;
              const isFocused = focused === id;

              return (
                <div key={id}>
                  <label htmlFor={id} className="block text-[12px] font-semibold text-[#4a3560] mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={id}
                      type={inputType}
                      placeholder={placeholder}
                      value={form[id]}
                      onChange={handleChange}
                      onFocus={() => setFocused(id)}
                      onBlur={() => setFocused("")}
                      autoComplete={autoComplete}
                      className="w-full rounded-[10px] text-sm text-[#1e0a3c] outline-none transition-all duration-200 placeholder:text-[#b8a8cc]"
                      style={{
                        padding: hasToggle ? "9px 42px 9px 12px" : "9px 12px",
                        border: isFocused ? "1.5px solid #a855f7" : "1.5px solid #e2d8f0",
                        background: isFocused ? "rgba(168, 85, 247, 0.04)" : "rgba(255, 255, 255, 0.8)",
                        boxShadow: isFocused ? "0 0 0 3px rgba(168, 85, 247, 0.12)" : "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                      }}
                    />
                    {hasToggle && (
                      <button
                        type="button"
                        onClick={() => toggleVisibility(id)}
                        aria-label={visible[id] ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#9b8aaa] bg-transparent border-none cursor-pointer p-0.5"
                      >
                        <EyeIcon visible={visible[id]} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terms */}
          <div
            role="checkbox"
            aria-checked={agreed}
            tabIndex={0}
            className="flex items-start gap-2.5 cursor-pointer mb-4"
            onClick={() => setAgreed((v) => !v)}
            onKeyDown={(e) => e.key === " " && setAgreed((v) => !v)}
          >
            <div
              className="w-4 h-4 min-w-4 rounded-[4px] mt-0.5 flex items-center justify-center flex-shrink-0 transition-all duration-200 text-white"
              style={{
                border: agreed ? "none" : "1.5px solid #c4b5d8",
                background: agreed ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "white",
              }}
            >
              {agreed && <CheckIcon />}
            </div>
            <span className="text-[13px] text-[#6b5a7e] leading-relaxed">
              I agree to the{" "}
              <a
                href="#"
                className="text-[#7c3aed] font-semibold no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#7c3aed] font-semibold no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Submit */}
          <Link
            href="/BookCard"
            className="w-full py-[11px] rounded-xl text-[15px] font-bold text-white tracking-wide border-none cursor-pointer transition-transform duration-150 hover:-translate-y-px mb-4"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
              fontFamily: "inherit",
            }}
          >
            Create Account
          </Link>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-[#e8dff5]" />
          <span className="text-[12px] text-[#9b8aaa] whitespace-nowrap">or continue with</span>
          <div className="flex-1 h-px bg-[#e8dff5]" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-3 mb-4">
          {SOCIAL_BUTTONS.map(({ id, icon, label }) => (
            <button
              key={id}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-[9px] rounded-[10px] text-sm font-semibold text-[#3b0764] cursor-pointer transition-all duration-200 hover:border-[#a855f7] hover:bg-purple-50"
              style={{
                border: "1.5px solid #e2d8f0",
                background: "rgba(255, 255, 255, 0.8)",
                fontFamily: "inherit",
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Login Link */}
        <p className="text-center text-[13px] text-[#7c6b8a] m-0">
          Already have an account?{" "}
          <Link href="/login" className="text-[#7c3aed] font-bold no-underline">
            Log in
          </Link>
        </p>
      </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}