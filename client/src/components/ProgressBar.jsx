const ProgressBar = ({ value }) => {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div
        className="h-full bg-gradient-to-r from-brand-300 via-brand-200 to-brand-100 transition-all duration-700"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

export default ProgressBar;

