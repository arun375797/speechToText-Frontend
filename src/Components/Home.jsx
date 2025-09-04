/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "./ReusableComponent/Navbar";
import TranscriptionCard from "./ReusableComponent/TranscriptionCard";
import { API_BASE_URL } from "../config";

export default function Home() {
  // auth
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // upload & results
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("auto");
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0); // seconds
  const [cost, setCost] = useState(0);

  // history
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // --- 1) Fetch session on mount (be tolerant of “service waking up”) ---
  useEffect(() => {
    let alive = true;
    axios
      .get(`${API_BASE_URL}/auth/session`, { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        setUser(res?.data?.user ?? null);
      })
      .catch((err) => {
        console.error("Session fetch error:", err);
        if (alive) setUser(null);
      })
      .finally(() => {
        if (alive) setLoadingUser(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // --- 2) Load history *after* user is known & logged in ---
  useEffect(() => {
    if (!user) return;
    let alive = true;
    setHistoryError(null);

    axios
      .get(`${API_BASE_URL}/api/history`, { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        setHistory(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        if (alive) setHistoryError("Could not load history.");
      });

    return () => {
      alive = false;
    };
  }, [user]);

  // --- Helpers ---
  const formatDuration = (sec) =>
    sec < 60 ? `${Math.round(sec)} sec` : `${Math.round(sec / 60)} min`;

  // --- File selected: estimate duration & cost locally ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setDuration(0);
    setCost(0);

    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    const audio = new Audio(objectUrl);
    audio.addEventListener("loadedmetadata", () => {
      const durSeconds = audio.duration;
      if (!isNaN(durSeconds) && durSeconds > 0) {
        const billableMinutes = Math.ceil(durSeconds / 60);
        setDuration(Math.round(durSeconds));

        // Simple estimate (adjust as you like)
        const USD_PER_MIN = 0.006;
        const INR_PER_USD = 84;
        const MARKUP = 1.5;
        const estimate =
          Math.round(billableMinutes * USD_PER_MIN * INR_PER_USD * MARKUP * 100) /
          100;
        setCost(estimate);
      } else {
        setCost(0.76); // minimum
      }
      URL.revokeObjectURL(objectUrl);
    });
  };

  // --- Upload to backend ---
  const handleUpload = async () => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }
    if (!file) {
      toast.error("⚠️ Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // MUST match multer field name
    formData.append("language", language);

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/transcriptions`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Tolerant to response shapes
      const data = res.data || {};
      const item = data.transcription ?? data.item ?? data.doc ?? data;
      const text = item?.transcription ?? item?.text ?? "";
      const minutes =
        typeof item?.duration === "number"
          ? item.duration
          : typeof item?.durationMinutes === "number"
          ? item.durationMinutes
          : typeof item?.durationSec === "number"
          ? item.durationSec / 60
          : 0;
      const rupees =
        typeof item?.cost === "number"
          ? item.cost
          : typeof data?.cost === "number"
          ? data.cost
          : 0;

      setTranscription(text);
      setDuration(Math.round(minutes * 60));
      setCost(rupees);
      setHistory((prev) => [item, ...prev]);
      toast.success("✅ Transcription completed!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete one history item ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transcription?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/history/${id}`, {
        withCredentials: true,
      });
      setHistory((prev) => prev.filter((h) => h._id !== id));
      toast.success("Deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("❌ Failed to delete transcription");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navbar always mounted so avatar/logout can appear as soon as session arrives */}
      <Navbar user={user} setUser={setUser} />

      <main className="pt-20 flex-1 flex">
        {/* If we’re still determining session */}
        {loadingUser ? (
          <div className="w-full flex items-center justify-center">
            <p className="text-gray-400">Checking session…</p>
          </div>
        ) : !user ? (
          // Not logged in → CTA
          <div className="w-full flex items-center justify-center px-6">
            <div className="max-w-md text-center">
              <h1 className="text-3xl font-extrabold mb-4">
                🎙️ Speech-to-Text Converter
              </h1>
              <p className="text-gray-400 mb-6">
                Sign in to upload audio, transcribe, and view your history.
              </p>
              <a
                href={`${API_BASE_URL}/auth/google`}
                className="inline-block px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/10"
              >
                Sign in with Google
              </a>
            </div>
          </div>
        ) : (
          // Logged in → full UI
          <motion.div layout className="flex flex-1">
            {/* Sidebar (History) */}
            <aside
              className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 z-40 pt-16`}
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold">📝 History</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✖
                </button>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100%-64px)]">
                {historyError && (
                  <p className="text-red-400">{historyError}</p>
                )}
                {!historyError && history.length === 0 && (
                  <p className="text-gray-500">No history yet</p>
                )}
                {history.map((item, idx) => (
                  <TranscriptionCard
                    key={item._id ?? idx}
                    item={item}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </aside>

            {/* Main Upload Section */}
            <section className="flex-1 flex flex-col items-center p-6 w-full">
              <button
                onClick={() => setSidebarOpen(true)}
                className="self-start mb-6 flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-md border border-gray-700 hover:bg-gray-700"
              >
                <Menu size={18} /> <span>Show History</span>
              </button>

              <h1 className="text-3xl font-extrabold mb-4">
                🎙️ Speech-to-Text Converter
              </h1>
              <p className="text-gray-400 mb-8 text-center max-w-xl">
                Upload or record your audio and convert it into text instantly
                with AI.
              </p>

              <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>

                {/* Language Selector */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mb-4 w-full p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none"
                >
                  <option value="auto">🌍 Auto Detect</option>
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="hi">Hindi</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>

                {/* File Upload */}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="mb-2 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 cursor-pointer"
                />

                {/* Show Duration & Cost */}
                {duration > 0 && (
                  <div className="mb-4 text-gray-300">
                    <p>Duration: {formatDuration(duration)}</p>
                    <p>Estimated Cost: ₹{cost.toFixed(2)}</p>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition disabled:opacity-50"
                >
                  {loading ? "⏳ Transcribing..." : "🚀 Upload & Transcribe"}
                </button>
              </div>

              {/* Latest Transcription */}
              {transcription && (
                <div className="mt-8 bg-gray-900 p-6 rounded-xl shadow-md w-full max-w-lg border border-gray-700">
                  <h2 className="text-lg font-semibold mb-3">
                    ✨ Latest Transcription
                  </h2>
                  <p className="text-gray-200 mb-2">{transcription}</p>
                  {duration > 0 && (
                    <p className="text-gray-300 text-sm">
                      Duration: {formatDuration(duration)} | Cost: ₹
                      {cost.toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
