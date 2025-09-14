import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function OTPVerification({ userEmail, userName, onBack }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email: userEmail,
        otp: otp
      });

      if (response.data.success) {
        toast.success("Email verified successfully! Welcome to SpeechAI!");
        navigate("/home");
      } else {
        setError(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage = error.response?.data?.message || "Verification failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, {
        email: userEmail
      });

      if (response.data.success) {
        toast.success("OTP sent successfully! Check your email.");
        setCountdown(60); // 60 seconds countdown
        setError("");
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6">
      <motion.div 
        className="card p-8 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Verify Your Email</h1>
          <p className="text-slate-400">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-blue-400 font-semibold mt-1">{userEmail}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              className="w-full p-4 text-center text-2xl font-bold tracking-widest rounded-xl bg-slate-800/60 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              maxLength={6}
              disabled={loading}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleResend}
            disabled={resendLoading || countdown > 0}
            className="btn btn-secondary w-full"
          >
            {resendLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              "Resend Code"
            )}
          </button>

          <button
            onClick={onBack}
            className="btn btn-outline w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </button>
        </div>

        <div className="mt-6 text-sm text-slate-400">
          <p>Didn't receive the code? Check your spam folder or try resending.</p>
        </div>
      </motion.div>
    </div>
  );
}
