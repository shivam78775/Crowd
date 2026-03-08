import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Rocket, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Wallet, 
  Compass,
  User as UserIcon,
  HelpCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { accountAddress, balance, connectWallet, disconnectWallet, connecting } =
    useWallet();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    disconnectWallet();
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/campaigns", label: "Explore", icon: Compass },
    { to: "/how-to", label: "Help", icon: HelpCircle },
    ...(user ? [
      { to: "/campaigns/create", label: "Create", icon: PlusCircle },
      { to: "/profile", label: "Profile", icon: UserIcon },
    ] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="glow-mesh" />
      
      <header className="sticky top-0 z-50 glass-nav">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 shadow-xl shadow-brand-500/20 flex items-center justify-center text-white scale-100 group-hover:scale-105 transition-transform duration-300">
              <Rocket size={24} fill="currentColor" fillOpacity={0.2} />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl tracking-tight text-white">
                Fundify <span className="text-brand-400">Campus</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Student Innovation Launchpad
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 md:gap-6">
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              {!user && !isAuthPage && (
                <Link to="/login" className="btn-primary py-2 px-5 text-sm h-10">
                  <UserIcon size={18} />
                  Sign in
                </Link>
              )}

              {user && (
                <div className="flex items-center gap-3">
                  {accountAddress ? (
                    <div className="flex items-center gap-2">
                      <div className="hidden lg:flex flex-col items-end text-right">
                        <span className="text-[10px] items-center gap-1 font-bold text-slate-500 flex uppercase tracking-tighter">
                          <Wallet size={10} /> Connected
                        </span>
                        <div className="text-sm font-mono font-medium text-brand-300">
                          {balance != null ? `${balance.toFixed(2)} ALGO` : "--- ALGO"}
                        </div>
                      </div>
                      <button
                        onClick={disconnectWallet}
                        className="h-10 px-4 glass-card rounded-xl text-sm font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all flex items-center gap-2"
                      >
                        <span className="hidden sm:inline font-mono">
                          {accountAddress.slice(0, 4)}...{accountAddress.slice(-4)}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={connectWallet}
                      disabled={connecting}
                      className="btn-primary py-2 px-5 text-sm h-10"
                    >
                      <Wallet size={18} />
                      {connecting ? "Connecting..." : "Connect Wallet"}
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-7xl px-4 md:px-6 py-10 relative z-10">
        {children}
      </main>

      <footer className="glass-nav py-12 mt-auto border-t border-white/5 relative z-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-60">
            <Rocket size={20} className="text-brand-400" />
            <span className="text-sm font-semibold tracking-tight">Fundify Campus</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} · Empowering Student Innovation on Algorand
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms</a>
            <Link to="/how-to" className="text-xs text-slate-500 hover:text-white transition-colors">How-to Guide</Link>
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

