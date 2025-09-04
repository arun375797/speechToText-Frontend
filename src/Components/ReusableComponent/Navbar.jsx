/* Navbar.jsx */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Navbar({ user: userProp, setUser }) {
  const { pathname } = useLocation();
  const [user, setUserLocal] = useState(userProp ?? null);
  const [loadingUser, setLoadingUser] = useState(!userProp);
  const [menuOpen, setMenuOpen] = useState(false);

  const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  // Build a safe display name (never render objects directly)
  const displayName = (() => {
    const n = user?.name;
    if (typeof n === "string") return n;
    if (n && typeof n === "object") {
      const g = n.givenName || n.given_name || "";
      const f = n.familyName || n.family_name || "";
      const s = `${g} ${f}`.trim();
      if (s) return s;
    }
    return user?.displayName || user?.email || "User";
  })();

  const srcFrom = (p) => {
    if (!p) return "/default-profile.png";
    if (p.startsWith("http")) return p;
    return `${API}${p[0] === "/" ? p : `/${p}`}`;
  };

  useEffect(() => {
    if (userProp) {
      setUserLocal(userProp);
      setLoadingUser(false);
    }
  }, [userProp]);

  useEffect(() => {
    let alive = true;
    if (!userProp) {
      axios.get(`${API}/auth/session`, { withCredentials: true })
        .then((r) => {
          if (!alive) return;
          const u = r?.data?.user ?? null;
          setUserLocal(u);
          setUser?.(u);
        })
        .catch(console.error)
        .finally(() => alive && setLoadingUser(false));
    }
    return () => { alive = false; };
  }, []); // once

  const links = [
    { to: "/home", label: "📂 Upload & Transcribe" },
    { to: "/live", label: "🎧 Live" },
    { to: "/history", label: "📜 History" },
  ];

  const handleLogout = async () => {
    try { await axios.post(`${API}/auth/logout`, {}, { withCredentials: true }); }
    finally {
      setUserLocal(null);
      setUser?.(null);
      window.location.href = "/";
    }
  };

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1621]/95 backdrop-blur border-b border-gray-800">
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-2xl" />
          <span className="text-xl sm:text-2xl font-bold">Speech2Text</span>
        </div>

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
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)", clipPath: "circle(0% at 50% 50%)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0)", clipPath: "circle(120% at 50% 50%)" }}
                        exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)", clipPath: "circle(0% at 50% 50%)" }}
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

        <div className="hidden md:flex items-center gap-5">
          {loadingUser ? (
            <div className="h-10 w-28 rounded-md bg-white/5 animate-pulse" />
          ) : user ? (
            <>
              <span className="text-sm text-gray-300 truncate max-w-[180px]">{displayName}</span>
              <img
                src={srcFrom(user?.picture)}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-600 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/default-profile.png"; }}
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
      </div>
    </header>
  );
}
