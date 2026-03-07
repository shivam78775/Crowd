import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      toast.success("Welcome to Fundify Campus!");
      navigate("/campaigns");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to create account. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/80">
      <h2 className="text-xl font-semibold mb-1">Create your account</h2>
      <p className="text-xs text-slate-300 mb-5">
        Launch campaigns, track funding, and celebrate impact with your campus.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-200">Full name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            placeholder="Alex from Robotics Club"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-200">Campus email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            placeholder="you@campus.edu"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-200">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            placeholder="Create a secure password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-brand-500/40 hover:shadow-brand-400/60 transition-all disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-300">
        Already using Fundify Campus?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-200 hover:text-brand-100"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

