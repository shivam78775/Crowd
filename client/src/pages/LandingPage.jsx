import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] items-center">
      <div className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-slate-900/40 px-3 py-1 text-xs font-medium text-brand-100 shadow-brand-500/30 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live on your campus · Fundify Campus
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Empowering{" "}
          <span className="bg-gradient-to-r from-brand-200 via-white to-brand-300 bg-clip-text text-transparent">
            student innovation
          </span>{" "}
          through transparent funding.
        </h1>
        <p className="text-slate-200 text-sm md:text-base max-w-xl">
          Launch your project, share your story, and rally your campus around
          ideas that matter — from hackathons to social impact initiatives.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={user ? "/campaigns/create" : "/register"}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-400 via-brand-300 to-brand-200 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-500/40 hover:shadow-brand-400/60 transition-all"
          >
            {user ? "Start a campaign" : "Get started"}
          </Link>
          <Link
            to="/campaigns"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-slate-900/40 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/60 transition-colors"
          >
            Browse campaigns
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs text-slate-300 pt-4">
          <div>
            <div className="text-lg font-semibold text-brand-100">0%</div>
            <div className="text-[11px]">Blockchain-free, fully transparent</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-brand-100">Real-time</div>
            <div className="text-[11px]">Funding progress tracking</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-brand-100">Campus</div>
            <div className="text-[11px]">Built for student communities</div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-10 bg-gradient-to-br from-brand-500/40 via-brand-300/10 to-transparent blur-3xl opacity-70" />
        <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl shadow-slate-900/80 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-slate-200">
              Live campaigns snapshot
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-400/40">
              Demo
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3">
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  Solar-Powered Study Pods · ECE
                </span>
                <span className="text-[10px] text-slate-300">78% funded</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[78%] bg-gradient-to-r from-brand-300 via-brand-200 to-brand-100 animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3">
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  Campus Mental Health Helpline
                </span>
                <span className="text-[10px] text-slate-300">42% funded</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[42%] bg-gradient-to-r from-sky-300 via-brand-200 to-brand-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

