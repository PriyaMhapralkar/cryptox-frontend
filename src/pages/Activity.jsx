import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function Activity() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/trading-history")
      .then((res) => setHistory(res.data))
      .catch(() => setError("Could not load trading history."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-12 text-gray-400">Loading activity...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Trading Activity</h1>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {history.length === 0 ? (
        <div className="card text-center text-gray-400 py-8">
          No trading activity yet. Buy or sell a coin to see it here.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm table-glass min-w-[900px]">
            <thead>
              <tr>
                <th className="py-2">Date & Time</th>
                <th className="py-2">Trading Pair</th>
                <th className="py-2">Order Type</th>
                <th className="py-2 text-right">Quantity</th>
                <th className="py-2 text-right">Buy Price</th>
                <th className="py-2 text-right">Sell Price</th>
                <th className="py-2 text-right">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-3 text-gray-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <img src={entry.coin.image} alt={entry.coin.name} className="w-5 h-5" />
                      <span className="font-medium text-white">
                        {entry.coin.symbol.toUpperCase()}/USD
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        entry.orderType === "BUY"
                          ? "bg-green-500/15 text-green-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {entry.orderType}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-200">{entry.quantity}</td>
                  <td className="py-3 text-right text-gray-200">
                    {entry.buyingPrice ? `$${entry.buyingPrice.toLocaleString()}` : "—"}
                  </td>
                  <td className="py-3 text-right text-gray-200">
                    {entry.sellingPrice ? `$${entry.sellingPrice.toLocaleString()}` : "—"}
                  </td>
                  <td
                    className={`py-3 text-right font-medium ${
                      entry.profitLoss >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {entry.orderType === "SELL"
                      ? `${entry.profitLoss >= 0 ? "+" : ""}$${entry.profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                      : "—"}
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

export default Activity;