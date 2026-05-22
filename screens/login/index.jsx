"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  HandMetal,
  LogIn,
} from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/BookCard");
    } catch (err) {
      const errMsg = err.response?.data?.message;
      if (Array.isArray(errMsg)) {
        setError(errMsg[0]);
      } else if (typeof errMsg === "string") {
        setError(errMsg);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Background: Derived Gradient ── */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a0618] via-[#1c0e35] to-[#4c1245]" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen font-sans">

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
              <h1 className="text-white text-2xl font-bold mb-1">Welcome Back</h1>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-1.5">
                Good to see you again
                <HandMetal size={14} className="text-yellow-400" />
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-300 text-xs font-medium">Email address</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-purple-500 transition-colors">
                  <Mail size={14} className="text-gray-500 shrink-0" />
                  <input
                    type="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-xs font-medium">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-purple-400 text-xs hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-purple-500 transition-colors">
                  <Lock size={14} className="text-gray-500 shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                    autoComplete="current-password"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-600/40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Logging in…
                  </span>
                ) : (
                  <>
                    <LogIn size={15} />
                    Log in
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

            {/* Sign up link */}
            <p className="text-center text-gray-400 text-xs mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}