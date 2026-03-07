import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import CampaignCard from "../components/CampaignCard";

const CampaignListPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await api.get("/campaign/all");
        setCampaigns(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to load campaigns. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-200">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Discover campaigns</h2>
          <p className="text-xs text-slate-300">
            Support projects led by students across your campus.
          </p>
        </div>
      </div>
      {campaigns.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-6 text-center text-sm text-slate-300">
          No campaigns yet. Be the first to{" "}
          <span className="font-semibold text-brand-200">start one</span>.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignListPage;

