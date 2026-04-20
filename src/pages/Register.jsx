import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      toast.success("Account created successfully!");
      setAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] p-8 max-w-md w-full rounded-2xl shadow-xl border border-[var(--color-border)] backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl -z-10 blur-[80px]"></div>
        <h2 className="text-3xl font-bold mb-6 text-center text-white z-10 relative">
          Create an account
        </h2>

        <div className="flex bg-[var(--color-surface-2)] p-1 rounded-lg mb-8">
          <Link
            to="/login"
            className="flex-1 text-[var(--color-text-muted)] text-sm font-semibold rounded-md py-2 hover:bg-[var(--color-border)] text-center transition-colors block"
          >
            Login
          </Link>
          <button className="flex-1 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-md py-2 shadow transition-colors">
            Register
          </button>
        </div>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-5 z-10 relative"
        >
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-4 py-3 placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-4 py-3 placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-4 py-3 placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Minimum 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-md mt-2 hover:bg-[var(--color-primary-dark)] transition-transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center">
          <span className="text-[var(--color-text-muted)] text-xs mb-4">
            — OR —
          </span>
          <button className="w-full bg-transparent border border-[var(--color-border)] text-[var(--color-text)] font-semibold py-3 rounded-md hover:bg-[var(--color-surface-2)] transition-colors flex items-center justify-center gap-2">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
