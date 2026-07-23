import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoinDetails from "./pages/CoinDetails";
import Wallet from "./pages/Wallet";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import Activity from "./pages/Activity";
import PaymentDetails from "./pages/PaymentDetails";
import WithdrawHistory from "./pages/WithdrawHistory";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from "./components/ChatWidget";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import ForgotPassword from "./pages/ForgotPassword";
import { useSelector } from "react-redux";
import LandingPage from "./pages/LandingPage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";
import { Navigate } from "react-router-dom";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminWallets from "./pages/admin/AdminWallets";
import AdminLogs from "./pages/admin/AdminLogs";








function App() {
  const { jwt } = useSelector((state) => state.auth);
   const [isAdmin, setIsAdmin] = useState(null);
    useEffect(() => {
    if (jwt) {
      axiosInstance
        .get("/users/profile")
        .then((res) => setIsAdmin(res.data.role === "ADMIN"))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [jwt]);

  return (
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route
          path="/"
          element={
            !jwt ? (
              <LandingPage />
            ) : isAdmin === null ? (
              <p className="text-center py-12 text-gray-500">Loading...</p>
            ) : isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Home />
            )
          }
        />        
        <Route path="/coin/:coinId" element={<CoinDetails />} />

        {/* Protected routes */}
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
        <Route path="/payment-details" element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>} />
        <Route path="/withdraw-history" element={<ProtectedRoute><WithdrawHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="wallets" element={<AdminWallets />} />
          <Route path="logs" element={<AdminLogs />} />

        </Route>
        
      </Routes>
            <ChatWidget />

    </div>
  );
}

export default App;