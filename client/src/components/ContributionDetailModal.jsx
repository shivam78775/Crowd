import React, { useEffect, useState } from "react";
import { X, Copy, Check, ExternalLink, ShieldCheck, Wallet, Calendar, Hash } from "lucide-react";

const ContributionDetailModal = ({ isOpen, onClose, contribution }) => {
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !contribution) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const shortenedHash = (hash) => `${hash?.slice(0, 10)}...${hash?.slice(-10)}`;
  const shortenedWallet = (address) => `${address?.slice(0, 8)}...${address?.slice(-8)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg glass-card rounded-[40px] border-brand-500/20 shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        {/* Header Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Transaction Details</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified on Algorand Testnet</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Project Info */}
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Supporting Project</span>
              <div className="text-lg font-bold text-white line-clamp-1">{contribution.campaignId?.title || "Project Support"}</div>
            </div>

            {/* Amount & Date Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400" /> Amount
                </div>
                <div className="text-2xl font-black text-white italic">{contribution.amount} <span className="text-xs not-italic text-slate-500 ml-1">ALGO</span></div>
              </div>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Calendar size={12} className="text-amber-400" /> Date
                </div>
                <div className="text-sm font-bold text-slate-200">
                  {new Date(contribution.contributedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* ID & Address Section */}
            <div className="space-y-4">
              {/* Transaction ID */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transaction ID (TXID)</label>
                <div className="group relative flex items-center">
                  <div className="flex-1 bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 font-mono text-xs text-brand-400 break-all pr-14 leading-relaxed">
                    {contribution.status === 'refunded' ? `REFUND: ${contribution.refundTxId}` : shortenedHash(contribution.transactionHash)}
                  </div>
                  <button 
                    onClick={() => handleCopy(contribution.status === 'refunded' ? contribution.refundTxId : contribution.transactionHash, 'txid')}
                    className="absolute right-3 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors group-hover:bg-brand-500/20 group-hover:text-brand-400"
                  >
                    {copiedField === 'txid' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sending Wallet</label>
                <div className="group relative flex items-center">
                   <div className="flex-1 bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 font-mono text-xs text-slate-300 break-all pr-14 leading-relaxed">
                    {shortenedWallet(contribution.contributorWallet)}
                  </div>
                  <button 
                    onClick={() => handleCopy(contribution.contributorWallet, 'wallet')}
                    className="absolute right-3 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors group-hover:bg-brand-500/20 group-hover:text-brand-400"
                  >
                    {copiedField === 'wallet' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-6 border-t border-white/5">
            <a 
              href={`https://testnet.algoexplorer.io/tx/${contribution.transactionHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-brand-600 text-white font-black text-xs uppercase tracking-widest hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20 group"
            >
              View on Explorer <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionDetailModal;
