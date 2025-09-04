/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import TranscriptionCard from "./ReusableComponent/TranscriptionCard"
import Navbar from "./ReusableComponent/Navbar"
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config"; 
export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
   const [user, setUser] = useState(null);

  // ✅ Fetch history on mount
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
const [error, setError] = useState(null);

useEffect(() => {
  axios
    .get(`${API_BASE_URL}/api/history`, { withCredentials: true })
    .then((res) => {
      setHistory(res.data);
      setLoading(false); // ✅ stop loading
    })
    .catch((err) => {
      setError("Could not load history");
      console.error("Failed to fetch history:", err);
      setLoading(false); // ✅ stop loading even on error
    });
}, []);

  // ✅ Delete a transcription
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transcription?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/history/${id}`, {
        withCredentials: true,
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete transcription");
    }
  };

  return (
     <div className="min-h-screen bg-black text-white flex flex-col">
    {/* <Navbar user={user} setUser={setUser} /> */}
    <h1 className="text-3xl font-extrabold mb-6 text-center mt-6">📝 Transcription History</h1>

{loading ? (
  <p className="text-gray-400">Loading history...</p>
) : error ? (
  <p className="text-red-400">{error}</p>
) : history.length === 0 ? (
  <p className="text-gray-500">No history yet.</p>
) : (
  <div className="flex justify-center w-full">
  <motion.div layout className="w-full max-w-3xl space-y-4">
    
      {history.map((item) => (
        <TranscriptionCard
          key={item._id}
          item={item}
          onDelete={handleDelete}
        />
      ))}
      </motion.div>
    </div>
  
)}


    </div>
  );
}
