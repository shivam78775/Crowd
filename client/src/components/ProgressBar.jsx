const ProgressBar = ({ value, label, size = "md" }) => {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          <span>{label}</span>
          <span className="text-slate-300">{Math.round(safeValue)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-white/5 rounded-full overflow-hidden border border-white/5`}>
        <div
          className={`h-full bg-gradient-to-r from-brand-600 via-brand-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(99,102,241,0.3)]`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

