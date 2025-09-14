/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import Home from "./Components/Home.jsx";
import Live from "./Components/Live.jsx";
import History from "./Components/History.jsx";
import Profile from "./Components/Profile.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Navbar from "./Components/ReusableComponent/Navbar.jsx";
import BulbBackground from "./Components/ReusableComponent/BulbBackground.jsx";
import Footer from "./Components/ReusableComponent/Footer.jsx";
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
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: "rgba(15, 23, 42, 0.95)", 
            color: "#f1f5f9",
            border: "1px solid rgba(71, 85, 105, 0.3)",
            backdropFilter: "blur(12px)"
          } 
        }} 
      />
      
      {/* Professional Layout */}
      <div className="min-h-screen flex flex-col relative">
        <BulbBackground />
        
        {hasNavbar && <Navbar />}

        <main className="flex-1 relative z-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={page}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              className={hasNavbar ? "pt-16" : ""}
            >
              <Routes location={location}>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/home" element={
                  <ProtectedRoute><Home /></ProtectedRoute>
                } />
                <Route path="/live" element={
                  <ProtectedRoute><Live /></ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute><History /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </>
  );
}
