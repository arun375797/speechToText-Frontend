import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";
import OTPVerification from "./OTPVerification";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (response.data.success) {
        toast.success("Account created successfully! Please check your email for verification code.");
        setUserEmail(formData.email.trim().toLowerCase());
        setUserName(formData.name.trim());
        setShowOTPVerification(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const message = error.response?.data?.message || "Failed to create account. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setShowOTPVerification(false);
    setUserEmail("");
    setUserName("");
  };

  // Show OTP verification if needed
  if (showOTPVerification) {
    return (
      <OTPVerification 
        userEmail={userEmail}
        userName={userName}
        onBack={handleBackToSignup}
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, delay: 0.2 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6 py-12">
      <motion.div 
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back to Login */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-gradient">
            Create Account
          </h1>
          <p className="text-slate-400 text-lg">
            Join SpeechAI and start transcribing audio
          </p>
        </div>

        {/* Signup Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="card card-hover p-8"
          variants={formVariants}
        >
          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-3 font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/60 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-3 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/60 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-3 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-800/60 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-8">
            <label className="block text-sm text-slate-300 mb-3 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-800/60 text-slate-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link 
                to="/" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.form>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            By creating an account, you agree to our{" "}
            <a href="#terms" className="text-blue-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
