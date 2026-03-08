import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Wallet, 
  Send, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink,
  Apple,
  Play,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";

const Illustration = ({ src, alt }) => (
  <div className="relative group overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 aspect-video mb-6">
    <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-transparent pointer-events-none z-10" />
    <img 
      src={`/${src.split('\\').pop()}`} 
      alt={alt} 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" 
    />
  </div>
);

const StepCard = ({ number, title, children }) => (
  <div className="flex gap-4 items-start py-4 border-b border-white/5 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 font-black italic shrink-0">
      {number}
    </div>
    <div className="space-y-2">
      <h4 className="font-bold text-white text-sm tracking-tight">{title}</h4>
      <div className="text-xs text-slate-500 font-medium leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

const AccordionSection = ({ icon: Icon, title, tag, isOpen, onToggle, children }) => (
  <div className={`glass-card rounded-[32px] overflow-hidden border transition-all duration-500 ${isOpen ? 'border-brand-500/30' : 'border-white/5'}`}>
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-brand-500 text-white shadow-xl shadow-brand-500/20' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'}`}>
          <Icon size={28} />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-1 block">{tag}</span>
          <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{title}</h3>
        </div>
      </div>
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand-400' : ''}`}>
        <ChevronDown size={20} />
      </div>
    </button>
    
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 pb-8 px-8 md:px-12 md:pb-12' : 'max-h-0 opacity-0'}`}>
      <div className="border-t border-white/5 pt-8">
        {children}
      </div>
    </div>
  </div>
);

const HowToPage = () => {
  const [openSection, setOpenSection] = useState(0);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? -1 : index);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="space-y-4 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-400 font-black text-[10px] uppercase tracking-widest transition-colors group mb-4"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Base
        </Link>
        <div className="flex items-center justify-center gap-3">
          <HelpCircle size={32} className="text-brand-400" />
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">Mission Briefing</h1>
        </div>
        <p className="text-slate-400 font-medium max-w-xl mx-auto">
          New to the frontier? Here's everything you need to know about launching and supporting innovation on Fundify Campus.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Wallet setup */}
        <AccordionSection 
          icon={Smartphone}
          title="Download Pera Wallet"
          tag="Step 01"
          isOpen={openSection === 0}
          onToggle={() => toggleSection(0)}
        >
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Fundify runs on the Algorand blockchain. To interact, you need a secure wallet. We recommend **Pera Wallet**—it's fast, mobile-friendly, and secure.
              </p>
              
              <div className="space-y-3">
                <a 
                  href="https://perawallet.app/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:border-brand-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                      <Apple size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">App Store</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">For iOS Users</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-600 group-hover:text-brand-400" />
                </a>
                
                <a 
                  href="https://perawallet.app/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-white/5 hover:border-brand-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                      <Play size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Google Play</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">For Android Users</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-600 group-hover:text-brand-400" />
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
               <Illustration src="pera_wallet_setup_guide_1772945806010.png" alt="Pera Wallet Setup Illustration" />
               <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-4">
                  <div className="flex gap-3">
                     <Lock size={16} className="text-amber-400 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-amber-200/60 font-medium leading-relaxed uppercase tracking-wide">
                        <span className="text-amber-400 font-bold italic">PRO TIP:</span> Write down your 25-word recovery phrase on paper and store it safely. Never screenshot it or store it digitally!
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </AccordionSection>

        {/* Section 2: Connection */}
        <AccordionSection 
          icon={Wallet}
          title="Connect to Fundify"
          tag="Step 02"
          isOpen={openSection === 1}
          onToggle={() => toggleSection(1)}
        >
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-1">
                {["Find the 'Connect Wallet' button in the navigation bar.", "Select 'Pera Wallet' from the connection modal.", "Scan the QR code with your Pera mobile app.", "Confirm the connection request on your phone."].map((step, i) => (
                  <StepCard key={i} number={i + 1} title={`Instruction ${i + 1}`}>
                    {step}
                  </StepCard>
                ))}
              </div>
            </div>
            <div className="space-y-4">
               <div className="aspect-video rounded-[32px] bg-slate-950 border border-white/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-brand-500/5 blur-3xl" />
                  <div className="relative z-10 flex flex-col items-center gap-6">
                     <div className="w-20 h-20 rounded-3xl bg-brand-500 shadow-2xl shadow-brand-500/30 flex items-center justify-center text-white">
                        <Wallet size={40} />
                     </div>
                     <button className="btn-primary py-3 px-8 text-sm h-12">
                        Connect Wallet
                     </button>
                  </div>
               </div>
               <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest italic">Visual Representation of the Connect Process</p>
            </div>
          </div>
        </AccordionSection>

        {/* Section 3: Contributing */}
        <AccordionSection 
          icon={Send}
          title="Back Your First Project"
          tag="Step 03"
          isOpen={openSection === 2}
          onToggle={() => toggleSection(2)}
        >
          <div className="grid md:grid-cols-2 gap-12">
             <div className="space-y-8">
                <Illustration src="blockchain_contribution_guide_1772945821595.png" alt="Send Algos Illustration" />
                <div className="space-y-4">
                   <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                         <Info size={16} />
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         Min. Network Fee: <span className="text-white">0.001 ALGO</span>
                      </div>
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                      Transactions on Algorand are near-instant and cost less than a penny. Ensure you have a small amount of extra ALGO in your wallet to cover this fee.
                   </p>
                </div>
             </div>
             <div className="space-y-6">
                <h4 className="text-sm font-black text-white italic uppercase tracking-widest">Contribution Workflow</h4>
                <div className="space-y-4">
                  {[
                    { t: "Navigate to Exploration", d: "Browse active projects in the 'Explore' tab." },
                    { t: "Input your Support", d: "Click into a project and enter the amount of ALGO you wish to send." },
                    { t: "The Handshake", d: "A transaction request will pop up on your Pera Wallet on your phone." },
                    { t: "Final Launch", d: "Accept the request. Within 4 seconds, your support will be recorded on the blockchain!" }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                       <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                       <div className="space-y-1">
                          <div className="text-xs font-black text-white uppercase tracking-tight">{step.t}</div>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{step.d}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6">
                   <Link to="/campaigns" className="btn-primary w-full h-14 flex items-center justify-center gap-3 text-sm font-bold">
                      Explore Projects <ArrowRight size={18} />
                   </Link>
                </div>
             </div>
          </div>
        </AccordionSection>

        {/* Section 4: Safety */}
        <AccordionSection 
          icon={ShieldCheck}
          title="Safety & Security"
          tag="Best Practices"
          isOpen={openSection === 3}
          onToggle={() => toggleSection(3)}
        >
          <div className="grid md:grid-cols-2 gap-10">
             <div className="space-y-6">
                <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8 space-y-4">
                   <h4 className="text-lg font-black text-red-400 italic tracking-tight uppercase">Critical Warnings</h4>
                   <ul className="space-y-4">
                      <li className="flex gap-3 text-xs text-slate-400 font-medium leading-relaxed">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                         Always double-check the **Wallet Address** before confirming heavy transactions.
                      </li>
                      <li className="flex gap-3 text-xs text-slate-400 font-medium leading-relaxed">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                         Fundify support will **NEVER** ask for your 25-word Recovery Phrase.
                      </li>
                      <li className="flex gap-3 text-xs text-slate-400 font-medium leading-relaxed">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                         Only connect your wallet to official links (like **fundify.app**).
                      </li>
                   </ul>
                </div>
             </div>
             <div className="space-y-8 flex flex-col justify-center items-center text-center">
                <Illustration src="web3_security_shield_v2_1772945842852.png" alt="Security Shield Illustration" />
                <div className="space-y-2">
                   <h4 className="text-sm font-bold text-white tracking-tight">Your keys, your campus.</h4>
                   <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                      Web3 is about ownership. By following these safety tips, you ensure your contributions reach their target securely.
                   </p>
                </div>
             </div>
          </div>
        </AccordionSection>
      </div>

      {/* Final CTA */}
      <section className="relative rounded-[48px] overflow-hidden glass-card border-brand-500/10 p-12 text-center">
        <div className="absolute inset-0 bg-brand-500/5 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto text-brand-400 mb-6 border border-white/5">
            <Rocket size={32} />
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Ready for Lift-off?</h2>
          <p className="text-slate-400 font-medium max-w-lg mx-auto mb-8">
            You're now fully briefed on using Fundify Campus. All systems are green for your first blockchain contribution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/campaigns" className="btn-primary h-14 px-10 text-lg font-bold w-full sm:w-auto">
               Explore Now
            </Link>
            <Link to="/campaigns/create" className="h-14 px-10 rounded-2xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-bold flex items-center justify-center w-full sm:w-auto">
               Launch Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToPage;
