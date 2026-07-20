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


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/coin/:coinId" element={<CoinDetails />} />

        {/* Protected routes */}
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
        <Route path="/payment-details" element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>} />
        <Route path="/withdraw-history" element={<ProtectedRoute><WithdrawHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
            <ChatWidget />

    </div>
  );
}

export default App;