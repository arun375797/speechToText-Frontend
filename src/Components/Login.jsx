import { API_BASE_URL } from "../config";

export default function Login() {
  const API = (API_BASE_URL || "").replace(/\/$/, "");
  useEffect(() => {
    fetch(`${API}/health`, { cache: "no-store", mode: "cors" }).catch(()=>{});
  }, []);
  
  const startGoogleLogin = async () => {
    // warm the backend so we don't see the wake page
    try {
      await fetch(`${API}/health`, {
        credentials: "include",
        cache: "no-store",
        mode: "cors",
        keepalive: true,
      });
    } catch { /* ignore – we just want to wake it */ }

    // now do the real OAuth redirect
    window.location.href = `${API}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      <h1 className="text-4xl font-extrabold mb-6">🎙️ Speech-to-Text App</h1>
      <p className="mb-10 text-lg opacity-90 text-center max-w-md">
        Sign in with Google to start uploading and converting your audio to text.
      </p>

      <button
        onClick={startGoogleLogin}
        className="flex items-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="w-6 h-6 mr-3"
        />
        Sign in with Google
      </button>
    </div>
  );
}
