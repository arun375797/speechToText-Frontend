/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import TranscriptionCard from "./ReusableComponent/TranscriptionCard"
import toast from "react-hot-toast";
import Navbar from "./ReusableComponent/Navbar"
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config"; 
export default function Home() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("auto");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [duration, setDuration] = useState(0); // seconds (for display)
  const [cost, setCost] = useState(0);

  // 1) Fetch logged-in user
useEffect(() => {
  axios
    .get(`${API_BASE_URL}/auth/session`, { withCredentials: true })
    .then((res) => {
      if (!res.data?.user) {
        window.location.href = "/";
      } else {
        setUser(res.data.user);
      }
    })
    .catch(() => {
      window.location.href = "/";
    });
}, []);

  // 2) After user is set, load history
  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API_BASE_URL}/api/history`, { withCredentials: true })
      .then((res) => setHistory(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to fetch history:", err));
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setDuration(0);
    setCost(0);








    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      const audio = new Audio(objectUrl);
      audio.addEventListener("loadedmetadata", () => {
        const durSeconds = audio.duration;
        if (!isNaN(durSeconds) && durSeconds > 0) {
          const durMinutes = Math.ceil(durSeconds / 60); // billable minutes
          setDuration(Math.round(durSeconds));
          const WHISPER_COST_PER_MINUTE_USD = 0.006;
          const EXCHANGE_RATE = 84; // ₹ per USD
          const MARKUP = 1.5; // 50% markup
          const costInINR =
            Math.round(
              durMinutes *
                WHISPER_COST_PER_MINUTE_USD *
                EXCHANGE_RATE *
                MARKUP *
                100
            ) / 100;
          setCost(costInINR);
        } else {
          setCost(0.76); // 1-minute minimum
        }
        URL.revokeObjectURL(objectUrl);
      });
    }
  };

  const handleUpload = async () => {
   if (!file) return toast.error("⚠️ Please select a file first!");

    const formData = new FormData();
    formData.append("file", file); // must match multer field
    formData.append("language", language);

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/transcriptions`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      // Be tolerant to different response shapes
      const data = res.data || {};
      const item =
        data.transcription ?? data.item ?? data.doc ?? data; // pick the doc
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
      toast.success("✅ Transcription completed!")
      setDuration(Math.round(minutes * 60)); // store seconds for display
      setCost(rupees);
      setHistory((prev) => [item, ...prev]);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navbar */}
      {/* <Navbar user={user} setUser={setUser} /> */}

      {/* Main Content */}
       <motion.div layout className="flex flex-1">
        {/* Sidebar (History) */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 z-40`}
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
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100%-60px)]">
            {history.length === 0 && (
              <p className="text-gray-500">No history yet</p>
            )}
       {history.map((item, idx) => (
  <TranscriptionCard
    key={item._id ?? idx}
    item={item}
    onDelete={async (id) => {
      try {
        await axios.delete(`${API_BASE_URL}/api/history/${id}`, {
          withCredentials: true,
        });
        setHistory((prev) => prev.filter((h) => h._id !== id));
      } catch (err) {
        console.error("Delete failed", err);
         toast.error("❌ Failed to delete transcription");
      }
    }}
  />
))}
          </div>
        </aside>

        {/* Main Upload Section */}
        <main className="flex-1 flex flex-col items-center p-6">
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
            Upload or record your audio and convert it into text instantly with
            AI.
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
                <p>
                  Duration:{" "}
                  {duration < 60
                    ? `${Math.round(duration)} sec`
                    : `${Math.round(duration / 60)} min`}
                </p>
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
                  Duration:{" "}
                  {duration < 60
                    ? `${Math.round(duration)} sec`
                    : `${Math.round(duration / 60)} min`}{" "}
                  | Cost: ₹{cost.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}
