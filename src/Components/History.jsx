/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Navbar from "./ReusableComponent/Navbar";
import TranscriptionCard from "./ReusableComponent/TranscriptionCard";
import Modal from "./ReusableComponent/Modal";
import useModal from "../hooks/useModal";
import { API_BASE_URL } from "../config";

export default function History() {
  // modal
  const { modal, hideModal, showConfirm, showError } = useModal();

  // auth/user
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // history
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);

  // 1) Fetch session on mount (don’t auto-redirect on transient errors)
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

  // 2) Load history only after we know the user
  useEffect(() => {
    if (!user) return; // not signed in → show CTA below
    let alive = true;
    setLoadingHistory(true);
    setError(null);

    axios
      .get(`${API_BASE_URL}/api/history`, { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setHistory(list);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        if (alive) setError("Could not load history.");
      })
      .finally(() => {
        if (alive) setLoadingHistory(false);
      });

    return () => {
      alive = false;
    };
  }, [user]);

  // 3) Delete a transcription
  const handleDelete = async (id) => {
    showConfirm(
      "Are you sure you want to delete this transcription? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`${API_BASE_URL}/api/history/${id}`, {
            withCredentials: true,
          });
          setHistory((prev) => prev.filter((item) => item._id !== id));
          toast.success("✅ Transcription deleted successfully");
        } catch (err) {
          console.error("Delete failed:", err);
          showError("Failed to delete transcription. Please try again.");
        }
      },
      {
        title: "Delete Transcription",
        type: "danger",
        confirmText: "Yes, Delete",
        cancelText: "Cancel"
      }
    );
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Top bar */}
      <Navbar user={user} setUser={setUser} />

      {/* Page content */}
      <main className="pt-20 px-4 sm:px-6 pb-10 w-full flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          📝 Transcription History
        </h1>

        {/* Phase 1: figuring out who the user is */}
        {loadingUser ? (
          <p className="text-gray-400">Checking session…</p>
        ) : !user ? (
          // Not logged in
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              You’re not signed in. Please sign in to view your history.
            </p>
            <a
              href={`${API_BASE_URL}/auth/google`}
              className="btn-ghost"
            >
              Sign in with Google
            </a>
          </div>
        ) : (
          // Logged in → show history states
          <>
            {loadingHistory ? (
              <p className="text-gray-400">Loading history…</p>
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
          </>
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
