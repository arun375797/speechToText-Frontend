import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const API = (API_BASE_URL || "").replace(/\/$/, "");
  const [waking, setWaking] = useState(false);
  const [checking, setChecking] = useState(true);

  // 1) If already logged in, go straight to /home
  useEffect(() => {
    let alive = true;

    axios
      .get(`${API}/auth/session`, { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        if (res?.data?.user) navigate("/home");
      })
      .catch(() => {})
      .finally(() => alive && setChecking(false));

    // Best-effort warmup
    setWaking(true);
    fetch(`${API}/health`, {
      cache: "no-store",
      mode: "cors",
      credentials: "include",
    })
      .catch(() => {})
      .finally(() => alive && setWaking(false));

    return () => {
      alive = false;
    };
  }, [API, navigate]);

  // 2) Start Google OAuth
  const startGoogleLogin = () => {
    try {
      // fire-and-forget warmup
      if (navigator.sendBeacon) navigator.sendBeacon(`${API}/health`);
    } catch {}
    window.location.assign(`${API}/auth/google`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold mb-4 text-gradient">
          🎙️ SpeechAI
        </h1>
        <p className="mb-8 text-xl text-slate-400 leading-relaxed">
          Professional speech-to-text solutions powered by advanced AI technology.
        </p>

        <button
          onClick={startGoogleLogin}
          className="btn btn-google btn-xl"
          disabled={checking}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6 mr-3"
          />
          {checking ? "Checking session…" : "Sign in with Google"}
        </button>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Warmup hint + no-JS fallback */}
      <div className="mt-4 text-sm opacity-90 text-center">
        {waking && <div>Contacting server…</div>}
        <noscript>
          <div className="mt-2">
            JavaScript is required. Or{" "}
            <a
              href={`${API}/auth/google`}
              className="underline font-semibold text-white hover:text-blue-300 transition-colors duration-300"
            >
              continue to Google
            </a>
            .
          </div>
        </noscript>
      </div>
    </div>
  );
}
