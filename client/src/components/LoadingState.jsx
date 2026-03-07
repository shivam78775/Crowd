import { Rocket } from "lucide-react";

/**
 * Modern Loading Spinner with Rocket icon
 */
const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-brand-400">
           <Rocket size={20} className="animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{message}</p>
    </div>
  );
};

export default LoadingState;
