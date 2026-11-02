import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Ticket, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      console.log("Login successful:", response.data);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to connect to the server. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Ticket size={22} />
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Ticketflow
          </span>
        </Link>

        <p className="mb-2 text-sm font-semibold text-indigo-600">
          WELCOME BACK
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your support tickets, all in one place.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <button
                type="button"
                disabled
                title="Password recovery will be implemented later"
                className="text-xs font-medium text-slate-400"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-11 w-full rounded-lg border border-slate-300 px-3 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            {!isSubmitting && <ArrowRight size={16} />}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">NEW TO TICKETFLOW?</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <Link
          to="/signup"
          className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Create an account
        </Link>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Secure access to your support workspace.
        </p>
      </section>
    </main>
  );
}
