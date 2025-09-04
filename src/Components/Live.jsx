/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "./ReusableComponent/Navbar";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config"; 
export default function Live() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState(""); // Final confirmed text
  const [interim, setInterim] = useState(""); // Live preview text
  const [user, setUser] = useState(null);
  const recognitionRef = useRef(null);

  // ✅ Fetch user info
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


  // ✅ Initialize speech recognition
  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("❌ Your browser does not support Speech Recognition.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // Change to "hi-IN", "ta-IN", etc.

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + " ";
        } else {
          interimTranscript += transcriptPart + " ";
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript); // confirmed text
      }
      setInterim(interimTranscript); // live text
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return recognition;
  };

  useEffect(() => {
    recognitionRef.current = initRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    toast.success("✅ Copied to clipboard!");
  };

  const clearTranscript = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setTranscript("");
    setInterim("");
    recognitionRef.current = initRecognition();
    setListening(false);
  };

  // ✅ Save to MongoDB history
  const saveToHistory = async () => {
    if (!transcript.trim()) {
    toast.error("⚠️ Nothing to save. Speak something first.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/history`,
        { transcription: transcript },
        { withCredentials: true }
      );
      toast.success("✅ Saved to history!");
      console.log("Saved:", res.data);
    } catch (err) {
      console.error("Save failed", err);
     toast.error("❌ Failed to save transcription");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ✅ Navbar same as Home */}
    {/* <Navbar user={user} setUser={setUser} /> */}

      {/* ✅ Live Transcription Section */}
     
        <motion.main layout className="flex-1 flex flex-col items-center p-6">
        <h1 className="text-3xl font-extrabold mb-6">🎙️ Live Transcription</h1>
        <p className="text-gray-400 mb-8 text-center max-w-xl">
          Speak into your microphone and see transcription in real time.
        </p>

        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-700">
          {/* Transcription Box */}
          <div className="bg-gray-800 p-4 rounded-lg h-48 overflow-y-auto mb-4">
            <p>
              {transcript}
              <span className="opacity-50">{interim}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Copy
            </button>
            <button
              onClick={clearTranscript}
              className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500"
            >
              Clear
            </button>
            <button
              onClick={saveToHistory}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Save
            </button>
            <button
              onClick={startListening}
              disabled={listening}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 disabled:opacity-50"
            >
              Start Listening
            </button>
            <button
              onClick={stopListening}
              disabled={!listening}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 disabled:opacity-50"
            >
              Stop Listening
            </button>
          </div>
        </div>
          </motion.main>

      
    </div>
  );
}
