import { Search } from "lucide-react";

/**
 * Premium Empty State component
 */
const EmptyState = ({ 
  icon: Icon = Search, 
  title = "Nothing found", 
  message = "We couldn't find what you're looking for.",
  children 
}) => {
  return (
    <div className="py-20 text-center space-y-6 glass-card rounded-[40px] border-dashed border-white/10 max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mx-auto shadow-inner">
         <Icon size={40} className="text-slate-700" />
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
          {message}
        </p>
      </div>
      {children && (
        <div className="pt-4 flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
