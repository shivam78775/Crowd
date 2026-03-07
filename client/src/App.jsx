import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CampaignListPage from "./pages/CampaignListPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import DashboardPage from "./pages/DashboardPage";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/campaigns" element={<CampaignListPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route
                path="/campaigns/create"
                element={
                  <PrivateRoute>
                    <CreateCampaignPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
