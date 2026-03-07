import { Link } from "react-router-dom";
import { Clock, Target, Users, ArrowRight } from "lucide-react";
import ProgressBar from "./ProgressBar";

const CampaignCard = ({ campaign }) => {
  const {
    _id,
    title,
    description,
    imageURL,
    goalAmount,
    raisedAmount,
    deadline,
    creator,
  } = campaign;

  const progress =
    goalAmount && goalAmount > 0
      ? Math.min(100, (raisedAmount / goalAmount) * 100)
      : 0;

  const deadlineDate = deadline ? new Date(deadline) : null;
  const isExpired = deadlineDate && deadlineDate < new Date();
  
  const remainingDays = (() => {
    if (!deadlineDate) return 0;
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  return (
    <Link
      to={`/campaign/${_id}`}
      className="group glass-card rounded-[32px] overflow-hidden hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageURL}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isExpired ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
          {isExpired ? "Closed" : "Live"}
        </div>
        <div className="absolute bottom-4 left-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <div className="w-6 h-[1px] bg-brand-500" />
          by {creator?.name ?? "Student Innovator"}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed h-10">
            {description}
          </p>
        </div>

        <div className="mt-auto space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1">
              <span className="text-2xl font-bold text-white">
                {raisedAmount.toLocaleString()}<span className="text-xs text-slate-500 ml-1">ALGO</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {Math.round(progress)}% Funded
              </span>
            </div>
            <ProgressBar value={progress} />
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="p-2 rounded-lg bg-white/5 text-brand-400">
                <Target size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">Goal</span>
                <span className="text-xs font-semibold text-slate-200">{goalAmount.toLocaleString()} <span className="text-[10px] opacity-50">ALGO</span></span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="p-2 rounded-lg bg-white/5 text-amber-400">
                <Clock size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-tighter opacity-50">Ends</span>
                <span className="text-xs font-semibold text-slate-200">
                  {remainingDays}d left
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between group/btn">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Users size={14} className="text-brand-400" />
              <span>{campaign.contributors?.length || 0} Backers</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-brand-400 group-hover/btn:gap-2 transition-all">
              View Details <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;

