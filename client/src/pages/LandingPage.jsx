import { Link } from "react-router-dom";
import { 
  Rocket, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ChevronRight, 
  Star,
  Users,
  Target
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-20">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-brand-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              Empowering Student Innovation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
              Launch Your <br />
              <span className="text-gradient">Ideas To Orbit</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
              The first decentralized crowdfunding platform built exclusively for campus innovators.
              Turn your vision into reality with transparent, instant funding on Algorand.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-300">
              <Link to={user ? "/campaigns/create" : "/register"} className="btn-primary h-14 px-8 text-lg font-bold group">
                {user ? "Start Campaign" : "Join Now"}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/campaigns" className="btn-outline h-14 px-8 text-lg font-bold">
                Explore Projects
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-white/5 animate-in fade-in duration-1000 delay-500">
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transparent</div>
              </div>
              <div className="w-[1px] h-10 bg-white/5" />
              <div>
                <div className="text-2xl font-black text-white">SECURE</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart Contract</div>
              </div>
              <div className="w-[1px] h-10 bg-white/5" />
              <div>
                <div className="text-2xl font-black text-white">INSTANT</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payouts</div>
              </div>
            </div>
          </div>

          <div className="relative group animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 to-emerald-500/20 rounded-[48px] blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative glass-card rounded-[48px] p-8 border-white/10 shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Rocket size={400} />
               </div>
               
               <div className="space-y-8 relative z-10">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                       <Star size={24} fill="currentColor" fillOpacity={0.2} />
                     </div>
                     <div>
                       <div className="font-bold text-white uppercase tracking-wider text-xs">Featured Project</div>
                       <div className="text-slate-400 text-[10px] font-medium tracking-widest">Algorand Hackathon Winner</div>
                     </div>
                   </div>
                   <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-tighter">
                     Trending
                   </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white leading-tight">Solar-Powered <br /> Campus Smart Hubs</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Building the future of sustainable campus infrastructure, one hub at a time.
                    </p>
                 </div>

                 <div className="space-y-3">
                   <div className="flex justify-between items-end">
                     <div>
                       <div className="text-3xl font-black text-white italic">8,420 <span className="text-sm text-slate-500 not-italic ml-1">ALGO</span></div>
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Raised of 12,000 Goal</div>
                     </div>
                     <div className="text-right">
                       <div className="text-brand-400 font-bold">70%</div>
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Progress</div>
                     </div>
                   </div>
                   <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                     <div className="h-full bg-brand-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-[shimmer_2s_infinite]" style={{ width: '70%', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                   </div>
                 </div>

                 <div className="flex items-center justify-between pt-4">
                   <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className={`w-10 h-10 rounded-xl border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold`}>
                         {String.fromCharCode(64 + i)}
                       </div>
                     ))}
                     <div className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white">
                       +42
                     </div>
                   </div>
                   <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                     <Users size={16} className="text-brand-400" /> 148 Backers
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="glass-card rounded-[32px] p-8 space-y-4 hover:border-white/20 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">Peer Trust</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every campaign is verified by our campus ambassadors to ensure real impact and student safety.
          </p>
        </div>
        <div className="glass-card rounded-[32px] p-8 space-y-4 hover:border-white/20 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">Instant Settlements</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            No 30-day waits. Funds move instantly between peers on the Algorand blockchain.
          </p>
        </div>
        <div className="glass-card rounded-[32px] p-8 space-y-4 hover:border-white/20 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">Zero Platform Fees</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our mission is to help you succeed. We don't take a cut of your hard-earned funding.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative rounded-[48px] overflow-hidden bg-brand-600 p-12 md:p-20 text-center space-y-8 shadow-2xl shadow-brand-600/20">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-700 to-indigo-500" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Ready to launch your project?</h2>
          <p className="text-lg text-brand-100 font-medium opacity-80">
            Join hundreds of student creators already building the future on Fundify.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to={user ? "/campaigns/create" : "/register"} className="h-14 px-10 rounded-2xl bg-white text-brand-700 font-black text-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              Start Your Journey <Target size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

