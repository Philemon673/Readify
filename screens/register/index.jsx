"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  User,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Mail,
} from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";

export default function ReadifySignup() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Simulate signup, redirecting to BookCard dashboard
    setTimeout(() => {
      setLoading(false);
      router.push("/BookCard");
    }, 1200);
  };

  return (
    <>
      {/* ── Background: Derived Gradient ── */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a0618] via-[#1c0e35] to-[#4c1245]" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen font-sans text-white">

        {/* Navbar */}
        <nav className="px-6 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-md bg-purple-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">Readify</span>
          </Link>
        </nav>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div
            className="w-full max-w-sm rounded-2xl px-8 py-9 shadow-2xl"
            style={{
              background: "rgba(10, 7, 28, 0.78)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Heading */}
            <div className="text-center mb-7">
              <h1 className="text-white text-2xl font-bold mb-1">Create Account</h1>
              <p className="text-gray-400 text-sm">
                Start your reading journey today
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-xs font-medium">Username</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-purple-500 transition-colors">
                  <User size={14} className="text-gray-500 shrink-0" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your username"
                    value={form.name}
                    onChange={handleChange}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-xs font-medium">Email address</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-purple-500 transition-colors">
                  <Mail size={14} className="text-gray-500 shrink-0" />
                  <input
                    id="email"
                    type="email"
                    placeholder="youremail@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-xs font-medium">Password</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-purple-500 transition-colors">
                  <Lock size={14} className="text-gray-500 shrink-0" />
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-xs font-medium">Confirm Password</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-purple-500 transition-colors">
                  <Lock size={14} className="text-gray-500 shrink-0" />
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••••"
                    value={form.confirm}
                    onChange={handleChange}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-600/40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  <>
                    <UserPlus size={15} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* OAuth buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm py-2.5 rounded-lg transition-all">
                <FaGoogle size={16} className="text-blue-400" />
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm py-2.5 rounded-lg transition-all">
                <FaApple size={16} className="text-gray-200" />
                Apple
              </button>
            </div>

            {/* Login link */}
            <p className="text-center text-gray-400 text-xs mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}