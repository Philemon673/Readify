"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user session on mount (refresh checks)
  useEffect(() => {
    async function checkSession() {
      try {
        const data = await authService.getMe();
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // Not authenticated, ignore error and keep user as null
        console.log("No active session found:", err.message);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data && data.user) {
      setUser(data.user);
    }
    return data;
  };

  const register = async (username, email, password, confirmPassword) => {
    const data = await authService.register(username, email, password, confirmPassword);
    if (data && data.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RouteGuard({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const protectedRoutes = ["/BookCard", "/favourite", "/searchresults", "/read"];
  const guestRoutes = ["/login", "/register"];

  useEffect(() => {
    if (!loading) {
      const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
      const isGuest = guestRoutes.some((route) => pathname.startsWith(route));

      if (isProtected && !user) {
        router.replace("/login");
      } else if (isGuest && user) {
        router.replace("/BookCard");
      }
    }
  }, [user, loading, pathname, router]);

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isGuest = guestRoutes.some((route) => pathname.startsWith(route));

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#06040d] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-purple-600 animate-spin" />
          </div>
          <span className="text-gray-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading Readify...
          </span>
        </div>
      </div>
    );
  }

  // Prevent flash of page content during redirect
  if (isProtected && !user) {
    return null;
  }
  if (isGuest && user) {
    return null;
  }

  return children;
}
