import { useEffect, useState } from "react";
import { 
  Rocket, 
  HandCoins, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  PlusCircle,
  ExternalLink,
  History,
  LayoutDashboard,
  User,
  ShieldCheck,
  Wallet,
  Mail,
  Clock,
  Info,
  Trash2,
  Award,
  Bell,
  BellOff,
  CheckCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";
import ProgressBar from "../components/ProgressBar";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ContributionDetailModal from "../components/ContributionDetailModal";

const ProfilePage = () => {
  const { user } = useAuth();
  const { accountAddress, balance } = useWallet();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("user/dashboard");
        setData(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to load profile data. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Fetching your profile details..." />;
  }

  if (!data) {
    return (
      <EmptyState 
        icon={User} 
        title="Profile Unavailable" 
        message="We couldn't retrieve your profile data. Please refresh or sign in again."
      />
    );
  }

  const myCampaigns = data.myCampaigns || [];
  const myContributions = data.myContributions || [];
  const totalRaised = myCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2024";

  const handleOpenModal = (contribution) => {
    setSelectedContribution(contribution);
    setIsModalOpen(true);
  };

  const getTier = (amount) => {
    if (amount >= 50) return "gold";
    if (amount >= 20) return "silver";
    if (amount >= 5) return "bronze";
    return null;
  };

  const TIER_COLORS = {
    bronze: "text-orange-500",
    silver: "text-slate-300",
    gold: "text-amber-400"
  };

  const handleDelete = async (e, campaignId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this campaign? Contributors will be able to claim refunds immediately.")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`campaign/${campaignId}`);
      toast.success("Campaign deleted successfully.");
      const { data: updatedData } = await api.get("user/dashboard");
      setData(updatedData);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await api.post("user/notifications/read");
      setData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          notifications: prev.user.notifications.map(n => ({ ...n, read: true }))
        }
      }));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const notifications = data.user?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Profile Hero Section */}
      <section className="relative rounded-[48px] overflow-hidden glass-card border-brand-500/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-gradient-to-br from-brand-600 to-indigo-500 p-1 shadow-2xl shadow-brand-500/20 group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-[38px] bg-slate-950 flex items-center justify-center overflow-hidden">
                <span className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-4 border-slate-950 flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform shadow-lg">
              <ShieldCheck size={20} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{user?.name}</h2>
                <span className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 self-center">
                  Verified Innovator
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-slate-400 font-medium pb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-brand-400" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-400" />
                  Joined {joinedDate}
                </div>
              </div>
            </div>

            {/* Wallet Overview */}
            <div className="inline-flex flex-wrap justify-center md:justify-start items-center gap-4 bg-white/5 p-2 rounded-[24px] border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3 pl-4 pr-6 py-2 border-r border-white/10">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                  <Wallet size={20} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Wallet</div>
                  <div className="text-sm font-mono font-bold text-white tracking-tight">
                    {accountAddress ? `${accountAddress.slice(0, 6)}...${accountAddress.slice(-6)}` : "Not Connected"}
                  </div>
                </div>
              </div>
              <div className="px-6 py-2 text-left">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Balance</div>
                <div className="text-lg font-black text-brand-400 italic">
                  {balance != null ? balance.toFixed(2) : "0.00"} <span className="text-xs not-italic text-slate-500 ml-1">ALGO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 md:pt-0">
            <Link to="/campaigns/create" className="btn-primary h-14 px-8 flex items-center gap-3 text-lg font-bold shadow-2xl shadow-brand-500/30">
              <PlusCircle size={22} /> Launch Project
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-card rounded-[32px] p-8 border-brand-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400">
              <Rocket size={24} />
            </div>
            <div className="px-3 py-1 rounded-full bg-brand-500/5 text-brand-500 text-[10px] font-black uppercase tracking-tighter">
              Creator Mode
            </div>
          </div>
          <div className="text-4xl font-black text-white italic">{myCampaigns.length}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
            Projects Launched <ChevronRight size={12} className="text-brand-500" />
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8 border-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-tighter">
              Revenue
            </div>
          </div>
          <div className="text-4xl font-black text-white italic">{totalRaised.toLocaleString()}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
            Total ALGO Raised <ChevronRight size={12} className="text-emerald-500" />
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8 border-amber-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <HandCoins size={24} />
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/5 text-amber-500 text-[10px] font-black uppercase tracking-tighter">
              Supporting
            </div>
          </div>
          <div className="text-4xl font-black text-white italic">{myContributions.length}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2">
            Impact Contributions <ChevronRight size={12} className="text-amber-500" />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <section className="glass-card rounded-[40px] p-8 border-brand-500/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={24} className="text-brand-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">Mission Alerts</h3>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAsRead}
                className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-brand-400 transition-colors uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5"
              >
                <CheckCheck size={14} /> Mark all as read
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[...notifications].reverse().slice(0, 4).map((n, i) => (
              <div 
                key={i} 
                className={`p-5 rounded-[24px] border transition-all flex items-start gap-4 ${n.read ? 'bg-white/[0.02] border-white/5' : 'bg-brand-500/5 border-brand-500/20 shadow-lg shadow-brand-500/5'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'refund' ? 'bg-amber-500/10 text-amber-400' : 
                  n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-brand-500/10 text-brand-400'
                }`}>
                  {n.type === 'refund' ? <HandCoins size={20} /> : <Rocket size={20} />}
                </div>
                <div className="space-y-1 flex-1">
                  <p className={`text-sm font-medium leading-relaxed ${n.read ? 'text-slate-400' : 'text-white'}`}>
                    {n.message}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                   <LayoutDashboard size={20} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">Active Endeavors</h3>
             </div>
          </div>
          
          {myCampaigns.length === 0 ? (
            <div className="glass-card rounded-[40px] p-12 text-center space-y-4 border-dashed border-white/5">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-600">
                  <Rocket size={32} />
               </div>
               <div className="space-y-1">
                 <p className="text-slate-400 text-sm font-medium">Your launchpad is empty.</p>
                 <Link to="/campaigns/create" className="text-brand-400 font-bold flex items-center justify-center gap-1 hover:underline text-sm">
                   Start Your First Mission <ChevronRight size={16} />
                 </Link>
               </div>
            </div>
          ) : (
            <div className="space-y-4">
              {myCampaigns.map((c) => {
                const progress = c.goalAmount && c.goalAmount > 0 ? Math.min(100, (c.raisedAmount / c.goalAmount) * 100) : 0;
                return (
                  <div key={c._id} className="relative group">
                    <Link 
                      to={`/campaign/${c._id}`} 
                      className="block glass-card rounded-[32px] p-6 hover:bg-white/5 transition-all duration-300 border-white/5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1 pr-12">
                          <div className="font-bold text-white group-hover:text-brand-400 transition-colors">{c.title}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck size={10} className="text-emerald-500" />
                            {c.status === 'active' ? 'Live on Chain' : c.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="text-xs font-bold text-slate-400">Raised</div>
                           <div className="font-black text-white italic">{c.raisedAmount.toLocaleString()} <span className="text-[10px] not-italic text-slate-500">ALGO</span></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                          <span className="text-brand-400">{Math.round(progress)}% Complete</span>
                          <span className="text-slate-500">Goal: {c.goalAmount} ALGO</span>
                        </div>
                        <ProgressBar value={progress} size="sm" />
                      </div>
                    </Link>

                    {c.status !== 'deleted' && c.status !== 'withdrawn' && (
                      <button
                        onClick={(e) => handleDelete(e, c._id)}
                        className="absolute top-6 right-6 p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                        title="Delete Campaign"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                   <History size={20} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">Funding History</h3>
             </div>
          </div>

          {myContributions.length === 0 ? (
            <div className="glass-card rounded-[40px] p-12 text-center space-y-4 border-dashed border-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-600">
                   <HandCoins size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 text-sm font-medium">No impact recorded yet.</p>
                  <Link to="/campaigns" className="text-brand-400 font-bold flex items-center justify-center gap-1 hover:underline text-sm">
                    Support Student Talent <ChevronRight size={16} />
                  </Link>
                </div>
            </div>
          ) : (
            <div className="space-y-3">
              {myContributions.map((c) => (
                <div
                  key={c._id}
                  className="glass-card rounded-[24px] p-5 flex items-center justify-between border-white/5 hover:bg-white/[0.03] hover:border-brand-500/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                      <HandCoins size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm line-clamp-1 group-hover:text-brand-400 transition-colors">
                        {c.campaignId?.title ?? "Project Support"}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 flex items-center gap-2">
                        {c.contributedAt ? new Date(c.contributedAt).toLocaleDateString() : 'Recent'}
                        {getTier(c.amount) && (
                          <span className={`flex items-center gap-0.5 ${TIER_COLORS[getTier(c.amount)]}`}>
                            <Award size={10} /> {getTier(c.amount).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right pl-4">
                      <div className="font-black text-white text-lg italic whitespace-nowrap">
                        {c.amount.toLocaleString()} ALGO
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`text-[10px] font-black uppercase tracking-tighter ${
                          c.status === 'refunded' ? 'text-emerald-500' : 
                          c.status === 'refund_failed' ? 'text-red-500' :
                          (c.campaignId?.status === 'failed' || c.campaignId?.status === 'deleted') ? 'text-amber-500' :
                          'text-brand-400'
                        }`}>
                          {c.status === 'refunded' ? 'REFUNDED' : 
                           c.status === 'refund_failed' ? 'REFUND ERROR' :
                           (c.campaignId?.status === 'failed' || c.campaignId?.status === 'deleted') ? 'SETTLING...' :
                           'SUCCESS'}
                        </div>
                        {c.status === 'funded' && (c.campaignId?.status === 'deleted' || (new Date(c.campaignId?.deadline) < new Date() && c.campaignId?.raisedAmount < c.campaignId?.goalAmount)) && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRefund(c); }}
                            className="mt-1 px-3 py-1 rounded-lg bg-amber-500/10 text-[9px] font-bold text-amber-400 hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20"
                          >
                            Claim Refund
                          </button>
                        )}
                        {c.status === 'funded' && c.campaignId?.status === 'deleted' && (
                          <span className="text-[8px] font-bold text-red-400/60 uppercase mt-0.5 mt-1">Campaign Deleted</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenModal(c)}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all border border-transparent hover:border-brand-500/20"
                      title="View Transaction Details"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Contribution Detail Modal */}
      <ContributionDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contribution={selectedContribution}
      />
    </div>
  );
};

export default ProfilePage;
