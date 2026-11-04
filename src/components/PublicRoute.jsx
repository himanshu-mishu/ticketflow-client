
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-center">Checking authentication...</p>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
