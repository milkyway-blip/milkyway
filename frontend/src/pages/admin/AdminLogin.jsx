import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-5" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-3xl border border-brand-navy/5 bg-white p-8 shadow-xl shadow-brand-navy/5"
      >
        <div className="flex justify-center">
          <img src="/logo.png" alt="MilkyWay" className="h-11 w-auto" />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl font-bold text-brand-navy">Panel Admin</h1>
        <p className="mt-1 text-center text-sm text-brand-navy/50">Masuk untuk mengelola MilkyWay</p>

        <form onSubmit={submit} className="mt-7 space-y-4" data-testid="admin-login-form">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy/30" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email admin"
              className="w-full rounded-xl border border-brand-navy/10 bg-brand-cream/50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              data-testid="admin-login-email-input"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy/30" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-brand-navy/10 bg-brand-cream/50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              data-testid="admin-login-password-input"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600" data-testid="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-blue py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:bg-brand-deep active:scale-[0.98] disabled:opacity-60"
            data-testid="admin-login-submit-btn"
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <a href="/" className="mt-5 block text-center text-xs font-semibold text-brand-navy/40 hover:text-brand-blue" data-testid="admin-login-back-link">
          Kembali ke halaman utama
        </a>
      </motion.div>
    </div>
  );
}
