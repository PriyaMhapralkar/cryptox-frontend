import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Portfolio() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [historyByCoin, setHistoryByCoin] = useState({});

  const loadAssets = async () => {
    try {
      const res = await axiosInstance.get("/assets");
      setAssets(res.data);
    } catch (err) {
      setError("Could not load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const toggleHistory = async (asset) => {
    if (expandedId === asset.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(asset.id);

    if (!historyByCoin[asset.coin.coinId]) {
      try {
        const res = await axiosInstance.get("/orders/user");
        const filtered = res.data.filter(
          (order) => order.orderItem?.coin?.coinId === asset.coin.coinId
        );
        setHistoryByCoin((prev) => ({ ...prev, [asset.coin.coinId]: filtered }));
      } catch (err) {
        setHistoryByCoin((prev) => ({ ...prev, [asset.coin.coinId]: [] }));
      }
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-500">Loading portfolio...</p>;

  const totalValue = assets.reduce(
    (sum, a) => sum + a.quantity * a.coin.currentPrice,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <p className="text-gray-500 text-sm">Total Portfolio Value</p>
        <p className="text-4xl font-bold mt-1">
          ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {assets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          You don't own any crypto yet. Buy your first coin from the Home page.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Coin</th>
                <th className="py-2 text-right">Quantity</th>
                <th className="py-2 text-right">Avg Buy Price</th>
                <th className="py-2 text-right">Current Price</th>
                <th className="py-2 text-right">P&L</th>
                <th className="py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const currentValue = asset.quantity * asset.coin.currentPrice;
                const costBasis = asset.quantity * asset.buyPrice;
                const pnl = currentValue - costBasis;
                const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

                return (
                  <>
                    <tr key={asset.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <Link
                          to={`/coin/${asset.coin.coinId}`}
                          className="flex items-center gap-2"
                        >
                          <img src={asset.coin.image} alt={asset.coin.name} className="w-6 h-6" />
                          <span className="font-medium">{asset.coin.name}</span>
                          <span className="text-gray-400 uppercase text-xs">
                            {asset.coin.symbol}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 text-right">{asset.quantity}</td>
                      <td className="py-3 text-right">${asset.buyPrice.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        ${asset.coin.currentPrice.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 text-right font-medium ${
                          pnl >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}
                        ${pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })} (
                        {pnlPercent.toFixed(2)}%)
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => toggleHistory(asset)}
                          className="text-blue-600 text-xs font-medium hover:underline"
                        >
                          {expandedId === asset.id ? "Hide history" : "View history"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === asset.id && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 px-4 py-3">
                          {!historyByCoin[asset.coin.coinId] ? (
                            <p className="text-xs text-gray-500">Loading history...</p>
                          ) : historyByCoin[asset.coin.coinId].length === 0 ? (
                            <p className="text-xs text-gray-500">No order history found.</p>
                          ) : (
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-left text-gray-500">
                                  <th className="py-1">Date</th>
                                  <th className="py-1">Type</th>
                                  <th className="py-1 text-right">Quantity</th>
                                  <th className="py-1 text-right">Amount (USD)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {historyByCoin[asset.coin.coinId].map((order) => (
                                  <tr key={order.id}>
                                    <td className="py-1">
                                      {new Date(order.timestamp).toLocaleString()}
                                    </td>
                                    <td className="py-1">
                                      <span
                                        className={`px-2 py-0.5 rounded-full font-medium ${
                                          order.orderType === "BUY"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {order.orderType}
                                      </span>
                                    </td>
                                    <td className="py-1 text-right">
                                      {order.orderItem?.quantity}
                                    </td>
                                    <td className="py-1 text-right">${order.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Portfolio;