
import { Navigate } from "react-router-dom";
import useSession from "./UseSession";


export default function ProtectedRoute({ children }) {
  const { user, loading } = useSession();

  // While we’re checking, block rendering to avoid top-left flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
        <div className="animate-pulse rounded-xl bg-white/5 px-6 py-3">Checking session…</div>
      </div>
    );
  }

  // Not authenticated → go to login
  if (!user) return <Navigate to="/" replace />;

  // Authenticated → render the page
  return children;
}
