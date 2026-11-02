import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Ticket, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // Validate name
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    // Validate email
    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Send signup request to Express backend
      const response = await api.post("/auth/signup", {
        name: name.trim(),
        email: normalizedEmail,
        password,
      });

      console.log("Signup successful:", response.data);

      // Redirect to login after successful signup
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
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
          GET STARTED
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Join Ticketflow to manage and track support tickets.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Full name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
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

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                className="h-11 w-full rounded-lg border border-slate-300 px-3 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-900"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* API error */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isSubmitting ? "Creating account..." : "Create account"}

            {!isSubmitting && <ArrowRight size={16} />}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Your account is protected with secure password hashing and HTTP-only
          session cookies.
        </p>
      </section>
    </main>
  );
}
