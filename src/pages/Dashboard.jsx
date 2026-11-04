import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Ticket, User } from "lucide-react";

import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      setError("");

      // Call backend logout API
      await api.post("/auth/logout");

      // Clear global authentication state
      setUser(null);

      // Redirect to login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);

      setError(
        error.response?.data?.message || "Unable to logout. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600 p-2 text-white">
            <Ticket size={22} />
          </div>

          <h1 className="text-xl font-bold text-slate-900">Ticketflow</h1>
        </div>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <LogOut size={16} className="mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </header>

      <main className="mx-auto mt-8 max-w-5xl">
        <section className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-indigo-600">
            <User size={20} />
            <span className="text-sm font-medium">Your workspace</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.name || "User"}!
          </h2>

          <p className="mt-2 text-slate-600">
            Welcome to your Ticketflow dashboard. Manage your support tickets in
            one place.
          </p>

          {user?.email && (
            <p className="mt-4 text-sm text-slate-500">
              Signed in as: {user.email}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
