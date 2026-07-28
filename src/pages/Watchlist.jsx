import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Watchlist() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWatchlist = async () => {
    try {
      const res = await axiosInstance.get("/watchlist");
      setCoins(res.data.coins || []);
    } catch (err) {
      setError("Could not load watchlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleRemove = async (coinId) => {
    try {
      await axiosInstance.delete(`/watchlist/remove/${coinId}`);
      setCoins((prev) => prev.filter((c) => c.coinId !== coinId));
    } catch (err) {
      setError("Could not remove coin.");
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-400">Loading watchlist...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Watchlist</h1>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {coins.length === 0 ? (
        <div className="card text-center text-gray-400 py-8">
          Your watchlist is empty. Add coins from the Home page or a coin's detail page.
        </div>
      ) : (
        <div className="card">
          <table className="w-full text-sm table-glass">
            <thead>
              <tr>
                <th className="py-2">Coin</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">24h %</th>
                <th className="py-2 text-right">Market Cap</th>
                <th className="py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id}>
                  <td className="py-3">
                    <Link to={`/coin/${coin.coinId}`} className="flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <span className="font-medium text-white">{coin.name}</span>
                      <span className="text-gray-500 uppercase text-xs">{coin.symbol}</span>
                    </Link>
                  </td>
                  <td className="py-3 text-right text-gray-200">
                    ${coin.currentPrice?.toLocaleString()}
                  </td>
                  <td
                    className={`py-3 text-right font-medium ${
                      coin.priceChangePercentage24h >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {coin.priceChangePercentage24h?.toFixed(2)}%
                  </td>
                  <td className="py-3 text-right text-gray-200">
                    ${coin.marketCap?.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleRemove(coin.coinId)}
                      className="text-red-400 text-xs font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Watchlist;