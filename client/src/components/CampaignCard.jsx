import { Link } from "react-router-dom";
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

  const remainingDays = (() => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  return (
    <Link
      to={`/campaigns/${_id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-slate-900/70 hover:shadow-brand-500/40 transition-all hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageURL}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 text-xs text-slate-100">
          by {creator?.name ?? "Student Innovator"}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
        <p className="text-xs text-slate-300 line-clamp-3 flex-1">
          {description}
        </p>
        <div className="space-y-2">
          <ProgressBar value={progress} />
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>
              Raised{" "}
              <span className="font-semibold text-brand-200">
                ₹{raisedAmount.toLocaleString()}
              </span>{" "}
              of ₹{goalAmount.toLocaleString()}
            </span>
            <span>{remainingDays} days left</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;

