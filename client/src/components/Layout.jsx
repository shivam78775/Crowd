import { Link, useLocation, useNavigate } from "react-router-dom";
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-900 via-slate-950 to-brand-800 text-white">
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-brand-400 to-brand-200 shadow-lg shadow-brand-500/40 flex items-center justify-center text-xl font-black">
              F
            </div>
            <div>
              <div className="font-semibold tracking-tight">
                Fundify Campus
              </div>
              <div className="text-xs text-slate-300">
                Empowering Student Innovation
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/campaigns"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Explore
            </Link>
            {user && (
              <>
                <Link
                  to="/campaigns/create"
                  className="text-slate-200 hover:text-white transition-colors"
                >
                  Create
                </Link>
                <Link
                  to="/dashboard"
                  className="text-slate-200 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
            {!user && !isAuthPage && (
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-brand-400 to-brand-200 px-4 py-1.5 text-sm font-medium text-slate-950 shadow-md shadow-brand-500/40 hover:shadow-brand-400/60 transition-shadow"
              >
                Sign in
              </Link>
            )}
            {user && (
              <div className="flex items-center gap-2 text-xs text-slate-200">
                {accountAddress ? (
                  <>
                    <span className="hidden md:inline-flex rounded-full bg-slate-900/70 px-2 py-1 border border-white/10">
                      <span className="text-[10px] text-slate-400 mr-1">
                        Wallet
                      </span>
                      <span className="font-mono">
                        {accountAddress.slice(0, 6)}...
                        {accountAddress.slice(-4)}
                      </span>
                    </span>
                    <span className="hidden md:inline text-brand-100">
                      {balance != null ? `${balance.toFixed(2)} ALGO` : "--"}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className="rounded-full border border-white/20 px-2 py-1 text-[11px] text-slate-100 hover:bg-white/10 transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={connecting}
                    className="rounded-full border border-brand-300/70 bg-slate-900/70 px-3 py-1 text-[11px] font-medium text-brand-100 hover:bg-slate-800/80 transition-colors disabled:opacity-60"
                  >
                    {connecting ? "Connecting..." : "Connect Pera Wallet"}
                  </button>
                )}
              </div>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
      <footer className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Fundify Campus · Built for student
        innovation.
      </footer>
    </div>
  );
};

export default Layout;

