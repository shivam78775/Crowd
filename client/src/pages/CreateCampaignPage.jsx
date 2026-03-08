import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Rocket, 
  Target, 
  Calendar, 
  Image as ImageIcon, 
  Wallet,
  ArrowRight,
  ChevronLeft,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    imageURL: "",
    creatorWallet: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (new Date(form.deadline) < new Date()) {
      toast.error("Deadline must be in the future.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        goalAmount: Number(form.goalAmount),
        deadline: new Date(form.deadline).toISOString(),
      };
      await api.post("campaign/create", payload);
      toast.success("Project launched successfully! Welcome to orbit.");
      navigate("/campaigns");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to create campaign. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-400 font-bold text-xs uppercase tracking-widest mb-8 transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="grid lg:grid-cols-[1fr,320px] gap-12">
        <div className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Launch New Project</h2>
            <p className="text-slate-400 font-medium">Ready to change your campus? Fill out the details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Project Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-brand-400">
                <FileText size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Basic Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="form-input h-14 text-lg font-bold"
                    placeholder="What's your project name?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="form-input py-4 text-sm leading-relaxed"
                    placeholder="Details about your vision, goals, and why people should care..."
                  />
                </div>
              </div>
            </div>

            {/* Funding Metrics */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <Target size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Funding & Timeframe</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Goal Amount (ALGO)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500">ALGO</span>
                    <input
                      type="number"
                      min="1"
                      name="goalAmount"
                      value={form.goalAmount}
                      onChange={handleChange}
                      required
                      className="form-input h-14 pl-14 font-bold"
                      placeholder="50,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campaign Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      required
                      className="form-input h-14 pl-12 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Management */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-amber-400">
                <ImageIcon size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Visual Assets</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campaign Image URL</label>
                <div className="relative">
                   <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input
                    name="imageURL"
                    value={form.imageURL}
                    onChange={handleChange}
                    required
                    className="form-input h-14 pl-12 text-sm"
                    placeholder="Paste Cloudinary link (e.g. res.cloudinary.com/...)"
                  />
                </div>
                <p className="text-[10px] text-slate-600 font-bold italic ml-1">Pro Tip: High-quality covers increase funding by 40%.</p>
              </div>
            </div>

            {/* Blockchain Configuration */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Wallet size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Blockchain Destination</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Algorand Wallet Address</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    name="creatorWallet"
                    value={form.creatorWallet}
                    onChange={handleChange}
                    required
                    className="form-input h-14 pl-12 text-sm font-mono tracking-tight"
                    placeholder="Enter your Algorand Testnet address"
                  />
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mt-2">
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    <span className="text-blue-400 font-black">SECURITY CHECK:</span> This wallet will receive all project funds directly. Ensure you have the recovery phrase for this address. Fundify never stores your private keys.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary h-16 w-full text-xl font-black uppercase tracking-wider group"
            >
              {loading ? (
                <span className="flex items-center gap-2">LAUNCHING IN PROGRESS...</span>
              ) : (
                <span className="flex items-center gap-3">Launch To Orbit <Rocket size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></span>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Tips */}
        <div className="hidden lg:block space-y-8">
          <div className="glass-card rounded-[32px] p-6 border-white/10 space-y-4 sticky top-10">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
               <Rocket size={20} />
            </div>
            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">Creator Tips</h4>
            
            <ul className="space-y-4">
              {[
                { title: "Story Matters", desc: "Creators who describe their 'Why' get more backers." },
                { title: "Clear Rewards", desc: "What will your community get if this succeeds?" },
                { title: "Visuals", desc: "Use high-res images and clear concepts." }
              ].map((tip, i) => (
                <li key={i} className="space-y-1">
                  <div className="text-[11px] font-black text-white uppercase tracking-widest">{tip.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
                </li>
              ))}
            </ul>
            
            <div className="pt-4 border-t border-white/5">
               <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Powered by</p>
               <div className="flex items-center gap-2 mt-2 opacity-50 grayscale">
                  <div className="w-6 h-6 rounded-full bg-blue-500" />
                  <span className="text-xs font-black text-white">Algorand</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;

