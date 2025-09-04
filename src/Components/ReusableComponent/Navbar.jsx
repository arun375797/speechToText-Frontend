/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar({ user: userProp, setUser }) {
  const { pathname } = useLocation();
  const [user, setUserLocal] = useState(userProp ?? null);
  const [loadingUser, setLoadingUser] = useState(!userProp);
  const [menuOpen, setMenuOpen] = useState(false);

  // API base for relative images
  const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";
  const srcFrom = (p) => {
    if (!p) return "/default-profile.png";
    if (p.startsWith("http")) return p;
    return `${API}${p.startsWith("/") ? p : `/${p}`}`;
  };

  // Sync if parent passes later
  useEffect(() => {
    if (userProp) {
      setUserLocal(userProp);
      setLoadingUser(false);
    }
  }, [userProp]);

  // Debug user state
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  // Fetch session if missing
  useEffect(() => {
    let isMounted = true;
    if (!userProp) {
      axios
        .get("http://localhost:5000/auth/session", { withCredentials: true })
        .then((res) => {
          if (!isMounted) return;
          const u = res?.data?.user ?? null;
          setUserLocal(u);
          setUser?.(u);
          console.log("Session response:", res.data); // Debug backend response
        })
        .catch((err) => {
          console.error("Session fetch error:", err); // Debug error
        })
        .finally(() => {
          if (isMounted) setLoadingUser(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, []); // once

  const links = [
    { to: "/home", label: "📂 Upload & Transcribe" },
    { to: "/live", label: "🎧 Live" },
    { to: "/history", label: "📜 History" },
  ];

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out");
    } catch {
      toast.error("Logout failed");
    } finally {
      setUserLocal(null);
      setUser?.(null);
      window.location.href = "/";
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1621]/95 backdrop-blur border-b border-gray-800">
      {/* container */}
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between relative">
        {/* Left: logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-2xl" />
          <span className="text-xl sm:text-2xl font-bold">Speech2Text</span>
        </div>

        {/* Center nav (desktop only) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <div className="relative inline-flex items-center gap-2 p-1 rounded-xl bg-gray-800/60 ring-1 ring-gray-700">
            {links.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <div key={to} className="relative">
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600"
                        initial={{
                          opacity: 0,
                          scale: 0.95,
                          filter: "blur(6px)",
                          clipPath: "circle(0% at 50% 50%)",
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                          clipPath: "circle(120% at 50% 50%)",
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.98,
                          filter: "blur(4px)",
                          clipPath: "circle(0% at 50% 50%)",
                        }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                  <Link
                    to={to}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative z-10 px-4 py-2 rounded-lg text-sm font-semibold",
                      active ? "text-white pointer-events-none" : "text-gray-300 hover:text-white",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Right: desktop user + logout; mobile: hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop user block */}
          <div className="hidden md:flex items-center gap-5">
            {loadingUser ? (
              <div className="h-10 w-28 rounded-md bg-white/5 animate-pulse" />
            ) : user ? (
              <>
                <span className="text-sm text-gray-300 truncate max-w-[160px]">{user.name}</span>
                <img
                  src={srcFrom(user?.picture)}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-600 object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-profile.png";
                  }}
                />
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile: avatar (if any) + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <img
                src={srcFrom(user?.picture)}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-gray-600 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/default-profile.png";
                }}
              />
            )}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
            >
              {/* hamburger icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" className="text-gray-200" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu (slide-down) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-[#0f1621]/98 border-b border-gray-800 shadow-xl"
            >
              <div className="mx-auto w-full max-w-6xl px-4 py-3 space-y-2">
                {links.map(({ to, label }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={[
                        "block w-full px-3 py-2 rounded-lg text-sm font-semibold",
                        active
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  );
                })}

                <div className="h-px bg-white/10 my-2" />

                {loadingUser ? (
                  <div className="h-10 w-28 rounded-md bg-white/5 animate-pulse" />
                ) : user ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={srcFrom(user?.picture)}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border border-gray-600 object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/default-profile.png";
                        }}
                      />
                      <span className="text-sm text-gray-300 truncate">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 text-sm font-medium rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition shrink-0"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
