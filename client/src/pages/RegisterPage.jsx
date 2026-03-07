import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ChevronRight, Rocket } from "lucide-react";
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
      toast.success("Welcome to the Fundify community!");
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
    <div className="max-w-md mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass-card rounded-[40px] p-10 border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mx-auto mb-4">
               <UserPlus size={32} />
            </div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Join The Mission</h2>
            <p className="text-slate-500 text-sm font-medium">Create your campus innovator account today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-input h-14 pl-12 text-sm"
                  placeholder="Alex Johnson"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campus Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input h-14 pl-12 text-sm"
                  placeholder="you@campus.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="form-input h-14 pl-12 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-14 w-full text-lg font-black uppercase tracking-wider group mt-4"
            >
              {loading ? "CREATING ACCOUNT..." : (
                <span className="flex items-center gap-2">LAUNCH ACCOUNT <Rocket size={20} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></span>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 font-bold">
              ALREADY REGISTERED?{" "}
              <Link
                to="/login"
                className="text-brand-400 hover:text-brand-300 transition-colors ml-1 uppercase"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

