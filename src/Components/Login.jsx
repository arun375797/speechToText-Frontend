import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const API = (API_BASE_URL || "").replace(/\/$/, "");
  const [waking, setWaking] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Email/Password login state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // 1) If already logged in, go straight to /home
  useEffect(() => {
    let alive = true;

    axios
      .get(`${API}/auth/session`, { withCredentials: true })
      .then((res) => {
        if (!alive) return;
        if (res?.data?.user) navigate("/home");
      })
      .catch(() => {})
      .finally(() => alive && setChecking(false));

    // Best-effort warmup
    setWaking(true);
    fetch(`${API}/health`, {
      cache: "no-store",
      mode: "cors",
      credentials: "include",
    })
      .catch(() => {})
      .finally(() => alive && setWaking(false));

    return () => {
      alive = false;
    };
  }, [API, navigate]);

  // 2) Start Google OAuth
  const startGoogleLogin = () => {
    try {
      // fire-and-forget warmup
      if (navigator.sendBeacon) navigator.sendBeacon(`${API}/health`);
    } catch {}
    window.location.assign(`${API}/auth/google`);
  };

  // 3) Email/Password login functions
  const validateLoginForm = () => {
    let errors = {};
    
    if (!loginForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = "Email address is invalid";
    }
    
    if (!loginForm.password) {
      errors.password = "Password is required";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginErrors({ ...loginErrors, [e.target.name]: null }); // Clear error on change
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setLoginLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, loginForm, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success("Login successful!");
        navigate("/home");
      } else if (response.data.requiresVerification) {
        toast.error(response.data.message);
        // You could redirect to OTP verification page here if needed
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      
      // Set specific field errors if available
      if (error.response?.data?.errors) {
        setLoginErrors(error.response.data.errors);
      }
    } finally {
      setLoginLoading(false);
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
        <h1 className="text-5xl font-extrabold mb-4 text-gradient">
          🎙️ SpeechAI
        </h1>
        <p className="mb-8 text-xl text-slate-400 leading-relaxed">
          Professional speech-to-text solutions powered by advanced AI technology.
        </p>

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-5 mb-6">
          {/* <h2 className="text-2xl font-semibold text-slate-200 mb-6">Sign In</h2> */}
          
          {/* Email */}
          {/* <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginForm.email}
                onChange={handleLoginChange}
                className={`w-full p-3 pl-10 rounded-xl bg-slate-800/60 text-slate-200 border ${
                  loginErrors.email ? "border-red-500" : "border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                disabled={loginLoading || checking}
              />
            </div>
            {loginErrors.email && <p className="text-red-400 text-sm mt-2 text-left">{loginErrors.email}</p>}
          </div> */}

          {/* Password */}
          {/* <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className={`w-full p-3 pl-10 pr-10 rounded-xl bg-slate-800/60 text-slate-200 border ${
                  loginErrors.password ? "border-red-500" : "border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                disabled={loginLoading || checking}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {loginErrors.password && <p className="text-red-400 text-sm mt-2 text-left">{loginErrors.password}</p>}
          </div> */}

          {/* <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loginLoading || checking}
          >
            {loginLoading ? "Signing In..." : "Sign In"}
          </button> */}
        </form>

        {/* Divider */}
        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-900 text-slate-400">Or continue with</span>
          </div>
        </div> */}

        {/* Google Login */}
        <button
          onClick={startGoogleLogin}
          className="btn btn-google btn-lg w-full"
          disabled={checking || loginLoading}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 mr-3"
          />
          {checking ? "Checking session…" : "Sign in with Google"}
        </button>

        {/* Sign Up Link */}
        {/* <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
            >
              Create Account
            </Link>
          </p>
        </div> */}
      </motion.div>

      {/* Warmup hint + no-JS fallback */}
      <div className="mt-4 text-sm opacity-90 text-center">
        {waking && <div>Contacting server…</div>}
        <noscript>
          <div className="mt-2">
            JavaScript is required. Or{" "}
            <a
              href={`${API}/auth/google`}
              className="underline font-semibold text-white hover:text-blue-300 transition-colors duration-300"
            >
              continue to Google
            </a>
            .
          </div>
        </noscript>
      </div>
    </div>
  );
}
