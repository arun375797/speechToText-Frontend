// src/hooks/useSession.js
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api.get("/auth/session")
      .then(res => {
        if (!alive) return;
        setUser(res?.data?.user ?? null);
      })
      .catch(() => {
        if (!alive) return;
        setUser(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  return { user, setUser, loading };
}
