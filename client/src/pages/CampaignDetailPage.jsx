import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Clock, 
  Target, 
  Users, 
  Share2, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Heart,
  ExternalLink,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";
import LoadingState from "../components/LoadingState";
import { useWallet } from "../context/WalletContext";
import { TESTNET_EXPLORER_TX_BASE } from "../services/algorand";

const CampaignDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { accountAddress, sendPayment, connectWallet, refreshBalance } = useWallet();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [contributing, setContributing] = useState(false);
  const [lastTxId, setLastTxId] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { data } = await api.get(`/campaign/${id}`);
        setCampaign(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to load campaign. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handlePresetAmount = (val) => {
    setAmount(val.toString());
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to contribute.");
      return;
    }
    if (!accountAddress) {
      toast.error("Please connect your Pera Wallet first.");
      await connectWallet();
      return;
    }
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Please enter a valid ALGO amount.");
      return;
    }
    if (!campaign.creatorWallet) {
      toast.error("Creator wallet address is missing for this campaign.");
      return;
    }

    const deadlinePassed =
      campaign.deadline && new Date(campaign.deadline) < new Date();
    if (deadlinePassed) {
      toast.error("This campaign's deadline has passed.");
      return;
    }

    setContributing(true);
    try {
      const txId = await sendPayment({
        to: campaign.creatorWallet,
        amountAlgo: value,
      });

      const { data } = await api.post("/contribution/add", {
        campaignId: id,
        amount: value,
        contributorWallet: accountAddress,
        transactionHash: txId,
      });
      setCampaign(data.campaign);
      setAmount("");
      setLastTxId(txId);
      
      refreshBalance();

      setTimeout(async () => {
        try {
          const { data: updatedData } = await api.get(`/campaign/${id}`);
          setCampaign(updatedData);
        } catch (e) {
          // ignore
        }
      }, 3000);

      toast.success("Contribution confirmed on Algorand Testnet!");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to contribute. Please try again.";
      toast.error(message);
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return <LoadingState message="Connecting to the blockchain..." />;
  }

  if (!campaign) {
    return (
      <div className="py-32 flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-slate-900 border border-white/5">
          <AlertCircle size={32} className="text-slate-500" />
        </div>
        <h2 className="text-xl font-bold">Campaign not found</h2>
        <p className="text-slate-400">The project you're looking for doesn't exist.</p>
        <button onClick={() => window.history.back()} className="btn-secondary mt-2">
          Go Back
        </button>
      </div>
    );
  }

  const progress =
    campaign.goalAmount && campaign.goalAmount > 0
      ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)
      : 0;

  const contributors = campaign.contributors || [];
  const deadlineDate = campaign.deadline ? new Date(campaign.deadline) : null;
  const isExpired = deadlineDate && deadlineDate < new Date();

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header */}
      <div className="relative rounded-[40px] overflow-hidden glass-card p-4 h-[400px] md:h-[500px]">
        <img
          src={campaign.imageURL}
          alt={campaign.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-end p-6 md:p-12 gap-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-[10px] font-bold uppercase tracking-widest text-brand-400">
              {campaign.category || "Student Project"}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-300">
              Algorand Mainnet
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            {campaign.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400">
                <Heart size={16} />
              </div>
              by {campaign.creator?.name ?? "Student Innovator"}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              {isExpired ? "Campaign Closed" : `Ends on ${deadlineDate?.toLocaleDateString()}`}
            </div>
          </div>
        </div>

        <button className="absolute top-8 right-8 h-12 w-12 rounded-2xl glass-nav flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <Share2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Description & Background */}
        <div className="lg:col-span-8 space-y-10">
          <div className="glass-card rounded-[32px] p-8 md:p-10 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <MessageCircle size={20} className="text-brand-400" />
              <h2 className="text-xl font-bold">About the Project</h2>
            </div>
            <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg">
              <p className="whitespace-pre-line">{campaign.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-[32px] p-6 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="font-bold text-white">Trust & Security</h3>
                <p className="text-xs text-slate-400 mt-1 px-4 leading-relaxed">
                  Funds are held in decentralised smart contracts until goal is met.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-[32px] p-6 flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                <TrendingUp size={28} />
              </div>
              <div>
                <h3 className="font-bold text-white">Impact Focused</h3>
                <p className="text-xs text-slate-400 mt-1 px-4 leading-relaxed">
                  100% of proceeds go directly to the student innovator's wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Funding Widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[32px] p-8 border-brand-500/20 sticky top-28 shadow-brand-500/5">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-black text-brand-400 uppercase tracking-[0.2em]">Raised So Far</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{campaign.raisedAmount.toLocaleString()}</span>
                  <span className="text-lg font-bold text-slate-500">ALGO</span>
                </div>
              </div>

              <div className="space-y-4">
                <ProgressBar value={progress} size="lg" label="Overall Progress" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Target size={16} className="text-brand-400 mb-2" />
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Goal</div>
                    <div className="font-mono font-bold text-white text-lg">{campaign.goalAmount.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Users size={16} className="text-brand-400 mb-2" />
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Backers</div>
                    <div className="font-mono font-bold text-white text-lg">{contributors.length}</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <form onSubmit={handleContribute} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-300">Choose an amount</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 10, 25].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handlePresetAmount(val)}
                          className={`py-3 rounded-xl border font-bold text-sm transition-all duration-300 ${
                            amount === val.toString()
                              ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/20"
                              : "bg-white/5 border-white/10 text-slate-400 hover:border-brand-500/30 hover:text-white"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                    <div className="relative group">
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-xl font-mono text-white outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-slate-700"
                        placeholder="Custom Amount"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600 pointer-events-none group-focus-within:text-brand-400 transition-colors">ALGO</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={contributing || isExpired}
                    className="w-full btn-primary h-16 text-lg font-bold group"
                  >
                    {isExpired ? (
                      "Campaign Closed"
                    ) : contributing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Back this project <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {campaign.creatorWallet && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                  <ShieldCheck size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-200/60 leading-relaxed font-medium">
                    Funds will be sent directly to the creator's verified Algorand wallet address.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                Recent Contributions <span className="bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-lg text-[10px]">{contributors.length}</span>
              </h3>
            </div>
            {contributors.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Heart size={24} className="mx-auto text-slate-700" />
                <p className="text-xs text-slate-500">No backers yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {contributors.slice().reverse().map((c) => (
                  <div key={c._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold text-white">
                        {c.contributor?.name?.[0] || "A"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{c.contributor?.name || "Anonymous"}</div>
                        <div className="text-[10px] text-slate-500 font-medium">Verified Backer</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-brand-400">{c.amount} ALGO</div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        {c.contributorWallet?.slice(0, 4)}...{c.contributorWallet?.slice(-4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {lastTxId && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="glass-card rounded-3xl p-6 border-emerald-500/30 shadow-2xl shadow-emerald-500/20 flex items-center gap-6 max-w-xl">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white scale-110 shadow-lg shadow-emerald-500/40">
                <ShieldCheck size={28} />
             </div>
             <div className="flex-1">
                <h4 className="font-black text-white text-lg">Transaction Confirmed!</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">Hash: {lastTxId}</p>
             </div>
             <a
                href={`${TESTNET_EXPLORER_TX_BASE}${lastTxId}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-2 px-6 h-11 text-xs whitespace-nowrap"
              >
                Explorer <ExternalLink size={14} />
              </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;

