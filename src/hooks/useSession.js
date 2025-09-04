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
        const userData = res?.data?.user || null;
        if (userData) {
          // Normalize the user object structure
          setUser({
            id: userData.id || userData._id,
            name: userData.name || `${userData.givenName} ${userData.familyName}`.trim(),
            email: userData.email,
            picture: userData.picture || userData.avatar,
          });
        } else {
          setUser(null);
        }
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
