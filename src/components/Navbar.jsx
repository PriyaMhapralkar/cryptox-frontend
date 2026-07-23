import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import axiosInstance from "../api/axiosInstance";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jwt } = useSelector((state) => state.auth);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    if (jwt) {
      axiosInstance
        .get("/users/profile")
        .then((res) => setIsAdmin(res.data.role === "ADMIN"))
        .catch(() => setIsAdmin(false))
        .finally(() => setRoleChecked(true));
    } else {
      setIsAdmin(false);
      setRoleChecked(true);
    }
  }, [jwt]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }
    try {
      const res = await axiosInstance.get(`/coins/search?q=${value}`);
      setResults(res.data.slice(0, 6));
      setShowResults(true);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleSelectCoin = (coinId) => {
    setShowResults(false);
    setQuery("");
    navigate(`/coin/${coinId}`);
  };

  const traderLinks = [
    { to: "/portfolio", label: "Portfolio" },
    { to: "/wallet", label: "Wallet" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/activity", label: "Activity" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="sticky top-0 z-40 glass-dark px-6 py-3 flex items-center justify-between">
      <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm group-hover:scale-105 transition-transform">
          X
        </div>
        <span className="text-lg font-bold text-white">CryptoX</span>
        {isAdmin && (
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">
            ADMIN
          </span>
        )}
      </Link>

      <div className="flex items-center gap-3">
        {/* Only show market search for non-admins — admins don't trade */}
        {!isAdmin && (
          <div className="relative hidden md:block">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onFocus={() => query && setShowResults(true)}
              placeholder="Search coins..."
              className="bg-white/10 border border-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
            />
            {showResults && results.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                {results.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin.coinId)}
                    className="flex items-center gap-2 px-3 py-2.5 hover:bg-white/10 cursor-pointer text-sm transition-colors"
                  >
                    <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                    <span className="font-medium text-white">{coin.name}</span>
                    <span className="text-gray-400 uppercase text-xs">{coin.symbol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {jwt ? (
          <>
            {roleChecked && !isAdmin && (
              <div className="hidden lg:flex items-center gap-1">
                {traderLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {roleChecked && isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-lg text-sm font-medium text-orange-400 hover:bg-orange-500/10 transition-all"
              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary text-sm">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;