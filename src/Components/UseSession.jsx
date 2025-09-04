import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config"; 
export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    axios
      .get(`${API_BASE_URL}/auth/session`, { withCredentials: true })
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

  return { user, loading };
}
