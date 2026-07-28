import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins, fetchCoinCount, setCategory, setPage } from "../redux/coin/coinSlice";
import CoinTable from "../components/CoinTable";
import axiosInstance from "../api/axiosInstance";
import BitcoinMiniChart from "../components/BitcoinMiniChart";

const tabs = [
  { label: "All", value: "all" },
  { label: "Top 50", value: "top50" },
  { label: "Top Gainers", value: "gainers" },
  { label: "Top Losers", value: "losers" },
];

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coins, status, category, page, pageSize, totalCoins } = useSelector(
    (state) => state.coin
  );

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    dispatch(fetchCoins({ category, page, size: pageSize }));
  }, [dispatch, category, page, pageSize]);

  useEffect(() => {
    if (category === "all") {
      dispatch(fetchCoinCount());
    }
  }, [dispatch, category]);

  const totalPages = Math.ceil(totalCoins / pageSize);

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch(setPage(newPage));
    }
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => dispatch(setCategory(tab.value))}
                className={`pill ${category === tab.value ? "pill-active" : "pill-inactive"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onFocus={() => query && setShowResults(true)}
              placeholder="Search coins..."
              className="input-glow w-56"
            />
            {showResults && results.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                {results.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin.coinId)}
                    className="flex items-center gap-2 px-3 py-2.5 hover:bg-white/10 cursor-pointer text-sm transition-colors border-b border-white/5 last:border-b-0"
                  >
                    <img src={coin.image} alt={coin.name} className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-white truncate">{coin.name}</span>
                    <span className="text-gray-500 uppercase text-xs shrink-0">{coin.symbol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          {status === "loading" ? (
            <p className="text-center text-gray-400 py-8">Loading coins...</p>
          ) : (
            <CoinTable coins={coins} />
          )}
        </div>

        {category === "all" && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-300 px-2">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="w-72 shrink-0">
        <BitcoinMiniChart />
      </div>
    </div>
  );
}

export default Home;