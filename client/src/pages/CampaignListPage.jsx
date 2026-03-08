import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Rocket, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import CampaignCard from "../components/CampaignCard";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

const CampaignListPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await api.get("campaign/all");
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

  const filteredCampaigns = campaigns.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingState message="Discovering campus innovation..." />;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header section with Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
               <Rocket size={20} />
             </div>
             <h2 className="text-3xl font-black text-white">Explore Campaigns</h2>
          </div>
          <p className="text-slate-400 font-medium">
            Support the next generation of student innovation and project ideas.
          </p>
        </div>
        
        <div className="relative group min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/5 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold uppercase tracking-widest">
            <LayoutGrid size={14} /> All Projects
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Showing {filteredCampaigns.length} campaigns
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <EmptyState 
          title="No campaigns found" 
          message="Try adjusting your search or check back later to support new projects."
        />
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignListPage;

