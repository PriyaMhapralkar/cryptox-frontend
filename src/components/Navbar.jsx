import { useState } from "react";
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
      setResults(res.data.slice(0, 6)); // limit dropdown length
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

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white relative">
      <Link to="/" className="text-xl font-bold text-blue-600">
        CryptoX
      </Link>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            onFocus={() => query && setShowResults(true)}
            placeholder="Search coins..."
            className="border rounded-md px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-50 max-h-72 overflow-y-auto">
              {results.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin.coinId)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-gray-400 uppercase text-xs">{coin.symbol}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {jwt ? (
          <>
            <Link to="/portfolio" className="text-sm hover:text-blue-600">Portfolio</Link>
            <Link to="/wallet" className="text-sm hover:text-blue-600">Wallet</Link>
            <Link to="/watchlist" className="text-sm hover:text-blue-600">Watchlist</Link>
            <Link to="/activity" className="text-sm hover:text-blue-600">Activity</Link>
            <Link to="/profile" className="text-sm hover:text-blue-600">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;