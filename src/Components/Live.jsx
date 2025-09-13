/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import Navbar from "./ReusableComponent/Navbar";
import Modal from "./ReusableComponent/Modal";
import useModal from "../hooks/useModal";
import { API_BASE_URL } from "../config";

export default function Live() {
  // modal
  const { modal, hideModal, showError, showSuccess } = useModal();

  // ---- auth ----
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ---- speech state ----
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState(""); // final confirmed text
  const [interim, setInterim] = useState(""); // live preview text
  const [language, setLanguage] = useState("en-US"); // default language
  const [saving, setSaving] = useState(false);

  const recognitionRef = useRef(null);

  // 1) Session (Render backend, with credentials)
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

  // 2) Initialize recognition instance (created once, re-init when language changes)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const part = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += part + " ";
        } else {
          interimText += part + " ";
        }
      }

      if (finalText) setTranscript((prev) => prev + finalText);
      setInterim(interimText);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error || e);
      setListening(false);
      if (e.error === "not-allowed") {
        showError("Microphone permission blocked. Please allow microphone access to use live transcription.");
      } else if (e.error === "no-speech") {
        showError("No speech detected. Please try speaking again.");
      } else if (e.error === "audio-capture") {
        showError("Microphone not found. Please check your microphone connection.");
      } else {
        showError("Speech recognition error. Please try again.");
      }
    };

    recognition.onend = () => {
      // Chrome calls onend after stop() *and* sometimes after long silence
      setListening(false);
    };

    recognitionRef.current = recognition;

    // cleanup
    return () => {
      try {
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, [language]);

  // Stop listening when tab becomes hidden (prevents stuck mic)
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && recognitionRef.current && listening) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [listening]);

  const startListening = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      showError("Your browser does not support Speech Recognition. Please use Chrome or Edge for the best experience.");
      return;
    }
    if (!listening) {
      try {
        rec.lang = language;
        rec.start();
        setListening(true);
      } catch (e) {
        console.error(e);
        showError("Could not start listening. Please try again.");
      }
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec && listening) {
      try {
        rec.stop();
      } catch {}
      setListening(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript + interim);
      toast.success("✅ Copied to clipboard!");
    } catch {
      toast.error("Copy failed.");
    }
  };

  const clearTranscript = () => {
    stopListening();
    setTranscript("");
    setInterim("");
  };

  const saveToHistory = async () => {
    const text = (transcript + " " + interim).trim();
    if (!text) {
      showError("Nothing to save. Please speak something first to create a transcription.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/history`,
        { transcription: text },
        { withCredentials: true }
      );
      showSuccess("Transcription saved to history successfully!");
    } catch (err) {
      console.error("Save failed", err);
      showError("Failed to save transcription. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // UI
  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Always mount the Navbar so avatar/logout show as soon as session arrives */}
      <Navbar user={user} setUser={setUser} />

      <main className="pt-20 flex-1 flex justify-center px-6">
        {loadingUser ? (
          <div className="text-gray-400 mt-10">Checking session…</div>
        ) : !user ? (
          <div className="max-w-md w-full text-center mt-10">
            <h1 className="text-3xl font-extrabold mb-4">🎙️ Live Transcription</h1>
            <p className="text-gray-400 mb-6">
              Sign in to use live speech recognition and save transcripts.
            </p>
            <a
              href={`${API_BASE_URL}/auth/google`}
              className="btn-ghost"
            >
              Sign in with Google
            </a>
          </div>
        ) : (
          <motion.section
            layout
            className="w-full max-w-3xl mt-6 flex flex-col items-stretch"
          >
            <h1 className="text-3xl font-extrabold mb-2">🎙️ Live Transcription</h1>
            <p className="text-gray-400 mb-6">
              Speak into your microphone and see the transcription in real time.
              (Chrome desktop recommended. iOS Safari does not support this API.)
            </p>

            {/* Language selector */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">
                Recognition language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none"
              >
                <option value="en-US">English (US)</option>
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">Hindi (India)</option>
                <option value="ta-IN">Tamil (India)</option>
                <option value="fr-FR">French</option>
                <option value="es-ES">Spanish</option>
              </select>
            </div>

            {/* Transcript box */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mb-4 h-56 overflow-y-auto">
              <p className="whitespace-pre-wrap">
                {transcript}
                <span className="opacity-50">{interim}</span>
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startListening}
                disabled={listening}
                className="btn-success"
              >
                ▶️ Start
              </button>
              <button
                onClick={stopListening}
                disabled={!listening}
                className="btn-danger"
              >
                ⏹️ Stop
              </button>
              <button
                onClick={clearTranscript}
                className="btn-warning"
              >
                🗑️ Clear
              </button>
              <button
                onClick={copyToClipboard}
                className="btn-secondary"
              >
                📋 Copy
              </button>
              <button
                onClick={saveToHistory}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? "💾 Saving…" : "💾 Save to History"}
              </button>
            </div>
          </motion.section>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={hideModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        showCancel={modal.showCancel}
        showConfirm={modal.showConfirm}
      />
    </div>
  );
}
