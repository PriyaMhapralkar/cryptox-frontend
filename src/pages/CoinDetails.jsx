import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";

const timeframes = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
];

function CoinDetails() {
  const { coinId } = useParams();
  const { jwt } = useSelector((state) => state.auth);

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedDays, setSelectedDays] = useState(1);
  const [chartLoading, setChartLoading] = useState(true);

  const [orderType, setOrderType] = useState("BUY");
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [tradeMessage, setTradeMessage] = useState("");
  const [tradeError, setTradeError] = useState("");
  const [watchlistMessage, setWatchlistMessage] = useState("");

  // Fetch coin details
  useEffect(() => {
    axiosInstance.get(`/coins/${coinId}`).then((res) => setCoin(res.data));
  }, [coinId]);

  // Fetch chart data whenever timeframe changes
  useEffect(() => {
    setChartLoading(true);
    axiosInstance
      .get(`/coins/${coinId}/chart?days=${selectedDays}`)
      .then((res) => {
        const formatted = res.data.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            ...(selectedDays === 1 && { hour: "2-digit", minute: "2-digit" }),
          }),
          price,
        }));
        setChartData(formatted);
      })
      .finally(() => setChartLoading(false));
  }, [coinId, selectedDays]);

  // Fetch wallet balance if logged in
  useEffect(() => {
    if (jwt) {
      axiosInstance.get("/wallet").then((res) => setWalletBalance(res.data.balance));
    }
  }, [jwt]);

  const handleTrade = async (e) => {
    e.preventDefault();
    setTradeMessage("");
    setTradeError("");
    try {
      const res = await axiosInstance.post("/orders/pay", {
        coinId,
        orderType,
        amount: parseFloat(amount),
      });
      setTradeMessage(
        `${orderType === "BUY" ? "Bought" : "Sold"} ${res.data.orderItem.quantity} ${coin.symbol.toUpperCase()} successfully.`
      );
      setAmount("");
      // Refresh wallet balance after trade
      const walletRes = await axiosInstance.get("/wallet");
      setWalletBalance(walletRes.data.balance);
    } catch (err) {
  const backendMessage =
    err.response?.data?.message ||
    (typeof err.response?.data === "string" ? err.response.data : null) ||
    "Trade failed. Please try again.";

  setTradeError(backendMessage);
}
  };

  const handleAddToWatchlist = async () => {
    setWatchlistMessage("");
    try {
      await axiosInstance.post(`/watchlist/add/${coinId}`);
      setWatchlistMessage("Added to watchlist!");
    } catch (err) {
  setWatchlistMessage(err.response?.data?.message || "Could not add to watchlist.");
}
  };

  if (!coin) {
    return <p className="text-center py-12 text-gray-500">Loading coin data...</p>;
  }

  const estimatedQuantity =
    amount && coin.currentPrice ? (parseFloat(amount) / coin.currentPrice).toFixed(8) : "0";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      {/* Left: coin info + chart */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <img src={coin.image} alt={coin.name} className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">{coin.name}</h1>
            <span className="text-gray-400 uppercase text-sm">{coin.symbol}</span>
          </div>
          <button
            onClick={handleAddToWatchlist}
            className="ml-auto text-sm bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200"
          >
            + Watchlist
          </button>
        </div>
        {watchlistMessage && <p className="text-sm text-green-600 mb-2">{watchlistMessage}</p>}

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold">${coin.currentPrice?.toLocaleString()}</span>
          <span
            className={`text-sm font-medium ${
              coin.priceChangePercentage24h >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {coin.priceChangePercentage24h?.toFixed(2)}% (24h)
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          {timeframes.map((tf) => (
            <button
              key={tf.days}
              onClick={() => setSelectedDays(tf.days)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedDays === tf.days
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 h-80">
          {chartLoading ? (
            <p className="text-center text-gray-500 py-20">Loading chart...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" tick={{ fontSize: 11 }} minTickGap={30} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                  width={70}
                />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Market Cap Rank</span>
            <p className="font-medium">#{coin.marketCapRank}</p>
          </div>
          <div>
            <span className="text-gray-500">Market Cap</span>
            <p className="font-medium">${coin.marketCap?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">24h High</span>
            <p className="font-medium">${coin.high24h?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">24h Low</span>
            <p className="font-medium">${coin.low24h?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Right: trade panel */}
      <div className="w-80 shrink-0">
        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
          <h3 className="font-semibold mb-4">Trade {coin.symbol.toUpperCase()}</h3>

          {!jwt ? (
            <p className="text-sm text-gray-500">Log in to buy or sell.</p>
          ) : (
            <form onSubmit={handleTrade} className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("BUY")}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium ${
                    orderType === "BUY"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("SELL")}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium ${
                    orderType === "SELL"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Sell
                </button>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Amount to spend (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <p className="text-xs text-gray-500">
                You will {orderType === "BUY" ? "receive" : "sell"} ≈{" "}
                <span className="font-medium text-gray-700">
                  {estimatedQuantity} {coin.symbol.toUpperCase()}
                </span>
              </p>

              {walletBalance !== null && (
                <p className="text-xs text-gray-500">
                  Available balance: <span className="font-medium">${walletBalance.toLocaleString()}</span>
                </p>
              )}

              {tradeMessage && <p className="text-xs text-green-600">{tradeMessage}</p>}
              {tradeError && <p className="text-xs text-red-600">{tradeError}</p>}

              <button
                type="submit"
                className={`w-full py-2 rounded-md text-sm font-medium text-white ${
                  orderType === "BUY" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {orderType === "BUY" ? "Buy" : "Sell"} {coin.symbol.toUpperCase()}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoinDetails;