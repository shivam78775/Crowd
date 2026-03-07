import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";
import { useWallet } from "../context/WalletContext";
import { TESTNET_EXPLORER_TX_BASE } from "../services/algorand";

const CampaignDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { accountAddress, sendPayment, connectWallet } = useWallet();
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
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-200">
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="py-16 text-center text-sm text-slate-300">
        Campaign not found.
      </div>
    );
  }

  const progress =
    campaign.goalAmount && campaign.goalAmount > 0
      ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)
      : 0;

  const contributors = campaign.contributors || [];
  const deadlinePassed =
    campaign.deadline && new Date(campaign.deadline) < new Date();

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-900/80">
          <div className="h-64 w-full overflow-hidden">
            <img
              src={campaign.imageURL}
              alt={campaign.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>by {campaign.creator?.name ?? "Student Innovator"}</span>
              <span>
                Deadline:{" "}
                {campaign.deadline
                  ? new Date(campaign.deadline).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <h1 className="text-xl font-semibold">{campaign.title}</h1>
            <p className="text-sm text-slate-200 whitespace-pre-line">
              {campaign.description}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-900/80">
          <div className="mb-3 text-xs font-medium text-slate-300">
            Funding progress
          </div>
          <ProgressBar value={progress} />
          <div className="mt-3 flex items-center justify-between text-xs text-slate-200">
            <div>
              <div className="font-semibold text-brand-100">
                ₹{campaign.raisedAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-300">Raised so far</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                ₹{campaign.goalAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-300">Funding goal</div>
            </div>
          </div>
          {campaign.creatorWallet && (
            <div className="mt-3 text-[11px] text-slate-400">
              Funds are sent directly to creator wallet:{" "}
              <span className="font-mono">
                {campaign.creatorWallet.slice(0, 6)}...
                {campaign.creatorWallet.slice(-4)}
              </span>{" "}
              on Algorand Testnet.
            </div>
          )}
        </div>
        <form
          onSubmit={handleContribute}
          className="rounded-3xl border border-brand-400/40 bg-slate-950/80 p-5 shadow-xl shadow-brand-500/40 space-y-3"
        >
          <div className="text-sm font-semibold">
            Support this campaign
          </div>
          <p className="text-xs text-slate-300">
            Your contribution is sent as a direct ALGO payment on Algorand
            Testnet via Pera Wallet. No escrow, no private keys stored.
          </p>
          <div className="space-y-1">
            <label className="text-xs text-slate-200">Amount (ALGO)</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
              placeholder="Enter amount"
            />
          </div>
          <button
            type="submit"
            disabled={contributing || deadlinePassed}
            className="w-full rounded-full bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-brand-500/40 hover:shadow-brand-400/60 transition-all disabled:opacity-60"
          >
            {deadlinePassed
              ? "Campaign closed"
              : contributing
              ? "Processing on Testnet..."
              : "Contribute with Pera Wallet"}
          </button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-900/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Contributors</div>
            <div className="text-xs text-slate-300">
              {contributors.length}{" "}
              {contributors.length === 1 ? "supporter" : "supporters"}
            </div>
          </div>
          {contributors.length === 0 ? (
            <p className="text-xs text-slate-300">
              No contributions yet. Be the first to support this idea.
            </p>
          ) : (
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {contributors.map((c) => (
                <li
                  key={c._id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2"
                >
                  <span className="font-medium text-slate-100">
                    {c.contributor?.name ?? "Anonymous Student"}
                  </span>
                  <span className="text-brand-100 font-semibold">
                    {c.amount.toLocaleString()} ALGO
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lastTxId && (
          <div className="rounded-3xl border border-brand-400/50 bg-slate-950/80 p-5 shadow-xl shadow-brand-500/40 space-y-3">
            <div className="text-sm font-semibold text-brand-50">
              Contribution successful on Algorand Testnet
            </div>
            <div className="text-[11px] text-slate-200 break-all">
              Transaction hash:{" "}
              <span className="font-mono">{lastTxId}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={`${TESTNET_EXPLORER_TX_BASE}${lastTxId}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-brand-300 px-3 py-1 font-medium text-slate-950 hover:bg-brand-200 transition-colors"
              >
                View on AlgoExplorer
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(lastTxId);
                  toast.success("Transaction hash copied");
                }}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-100 hover:bg-white/10 transition-colors"
              >
                Copy hash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailPage;

