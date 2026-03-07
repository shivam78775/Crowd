import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/user/dashboard");
        setData(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to load dashboard. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-200">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-16 text-center text-sm text-slate-300">
        Unable to load dashboard.
      </div>
    );
  }

  const myCampaigns = data.myCampaigns || [];
  const myContributions = data.myContributions || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">
          Welcome back, {user?.name || data.user.name}
        </h2>
        <p className="text-xs text-slate-300">
          Track your campaigns and contributions in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 text-xs">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <div className="text-slate-300 mb-1">My campaigns</div>
          <div className="text-2xl font-semibold text-brand-100">
            {myCampaigns.length}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <div className="text-slate-300 mb-1">My contributions</div>
          <div className="text-2xl font-semibold text-brand-100">
            {myContributions.length}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <div className="text-slate-300 mb-1">Total raised across my campaigns</div>
          <div className="text-2xl font-semibold text-brand-100">
            ₹
            {myCampaigns
              .reduce((sum, c) => sum + (c.raisedAmount || 0), 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">My campaigns</h3>
          </div>
          {myCampaigns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-4 text-xs text-slate-300">
              You haven&apos;t created any campaigns yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {myCampaigns.map((c) => {
                const progress =
                  c.goalAmount && c.goalAmount > 0
                    ? Math.min(100, (c.raisedAmount / c.goalAmount) * 100)
                    : 0;
                return (
                  <div
                    key={c._id}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 space-y-2"
                  >
                    <div className="font-medium text-slate-100 line-clamp-1">
                      {c.title}
                    </div>
                    <ProgressBar value={progress} />
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>
                        ₹{c.raisedAmount.toLocaleString()} / ₹
                        {c.goalAmount.toLocaleString()}
                      </span>
                      <span>
                        Deadline:{" "}
                        {c.deadline
                          ? new Date(c.deadline).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">My contributions</h3>
          </div>
          {myContributions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-4 text-xs text-slate-300">
              You haven&apos;t backed any campaigns yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {myContributions.map((c) => (
                <div
                  key={c._id}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-medium text-slate-100 line-clamp-1">
                      {c.campaignId?.title ?? "Campaign"}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {c.contributedAt
                        ? new Date(c.contributedAt).toLocaleDateString()
                        : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-brand-100">
                      ₹{c.amount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-300">Contributed</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

