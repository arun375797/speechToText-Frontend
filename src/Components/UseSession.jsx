// src/auth/useSession.js   <-- ensure casing matches your imports
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function useSession({ revalidateOnFocus = true, intervalMs = 0 } = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = (API_BASE_URL || "").replace(/\/$/, "");

  const refresh = useCallback(async (signal) => {
    try {
      setError(null);
      const res = await axios.get(`${API}/auth/session`, {
        withCredentials: true,
        signal,
        headers: { "Cache-Control": "no-cache" },
      });
      setUser(res?.data?.user ?? null);
    } catch (err) {
      if (signal?.aborted) return;          // ignore aborts
      setUser(null);
      setError(err);
      if (import.meta.env.DEV) console.warn("useSession error:", err);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [API]);

  // initial fetch
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  // revalidate when tab regains focus (optional)
  useEffect(() => {
    if (!revalidateOnFocus) return;
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [revalidateOnFocus, refresh]);

  // periodic revalidate (optional)
  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(() => refresh(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, refresh]);

  return { user, loading, error, refresh };
}
