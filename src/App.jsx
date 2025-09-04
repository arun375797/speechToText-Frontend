/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Components/Login.jsx";
import Home from "./Components/Home.jsx";
import Live from "./Components/Live.jsx";
import History from "./Components/History.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Navbar from "./Components/ReusableComponent/Navbar.jsx";
import { Toaster } from "react-hot-toast";

const page = {
  initial: { y: 8, opacity: 1 },  // no opacity fade to avoid white flash
  animate: { y: 0, opacity: 1 },
  exit:    { y: -8, opacity: 1 },
};
const transition = { duration: 0.25, ease: "easeOut" };

export default function App() {
  const location = useLocation();
  const hasNavbar = location.pathname !== "/";

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: "#333", color: "#fff" } }} />
      <div className="min-h-screen bg-black">
        {hasNavbar && <Navbar />}          {/* fixed header */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={page}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className={hasNavbar ? "pt-16" : ""}   // always reserve space for navbar
          >
            <Routes location={location}>
              <Route path="/" element={<Login />} />

              <Route path="/home" element={
                <ProtectedRoute><Home /></ProtectedRoute>
              } />
              <Route path="/live" element={
                <ProtectedRoute><Live /></ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute><History /></ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
