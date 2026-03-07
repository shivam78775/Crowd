import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    try {
      const payload = {
        ...form,
        goalAmount: Number(form.goalAmount),
      };
      await api.post("/campaign/create", payload);
      toast.success("Campaign created successfully!");
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
    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-900/80 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Create a new campaign</h2>
        <p className="text-xs text-slate-300">
          Share your campus project and invite others to support it.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-200">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            placeholder="e.g. AI Lab Equipment for Final-Year Projects"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-200">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            placeholder="Explain what you're building, why it matters, and how funds will be used."
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-200">Goal amount (₹)</label>
            <input
              type="number"
              min="1"
              name="goalAmount"
              value={form.goalAmount}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
              placeholder="e.g. 50000"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-200">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-200">
            Campaign image URL (Cloudinary)
          </label>
          <input
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            placeholder="Paste your Cloudinary image URL here"
          />
          <p className="text-[11px] text-slate-400">
            Upload your image to Cloudinary and paste the secure URL. We keep
            it simple in this phase — no direct file uploads yet.
          </p>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-200">
            Creator Algorand wallet (Testnet)
          </label>
          <input
            name="creatorWallet"
            value={form.creatorWallet}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            placeholder="Enter the Algorand address that will receive ALGO"
          />
          <p className="text-[11px] text-slate-400">
            All contributions will be sent directly to this Algorand Testnet
            address via Pera Wallet. No private keys are ever stored.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-brand-500/40 hover:shadow-brand-400/60 transition-all disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignPage;

