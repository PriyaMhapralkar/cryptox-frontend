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

  const [news, setNews] = useState([]);
  const [insight, setInsight] = useState("");
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/coins/${coinId}`).then((res) => setCoin(res.data));
  }, [coinId]);

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

  useEffect(() => {
    if (jwt) {
      axiosInstance.get("/wallet").then((res) => setWalletBalance(res.data.balance));
    }
  }, [jwt]);

  useEffect(() => {
    const loadNewsAndInsight = () => {
      setNewsLoading(true);
      Promise.all([
        axiosInstance.get(`/coins/${coinId}/news`),
        axiosInstance.get(`/coins/${coinId}/insight`),
      ])
        .then(([newsRes, insightRes]) => {
          setNews(newsRes.data);
          setInsight(insightRes.data.insight);
        })
        .finally(() => setNewsLoading(false));
    };

    loadNewsAndInsight();
    const interval = setInterval(loadNewsAndInsight, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, [coinId]);

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
      setWatchlistMessage("Could not add to watchlist.");
    }
  };

  if (!coin) {
    return <p className="text-center py-12 text-gray-400">Loading coin data...</p>;
  }

  const estimatedQuantity =
    amount && coin.currentPrice ? (parseFloat(amount) / coin.currentPrice).toFixed(8) : "0";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <img src={coin.image} alt={coin.name} className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
            <span className="text-gray-500 uppercase text-sm">{coin.symbol}</span>
          </div>
          <button onClick={handleAddToWatchlist} className="ml-auto btn-secondary text-sm">
            + Watchlist
          </button>
        </div>
        {watchlistMessage && <p className="text-sm text-green-400 mb-2">{watchlistMessage}</p>}

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold text-white">
            ${coin.currentPrice?.toLocaleString()}
          </span>
          <span
            className={`text-sm font-medium ${
              coin.priceChangePercentage24h >= 0 ? "text-green-400" : "text-red-400"
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
              className={`pill ${selectedDays === tf.days ? "pill-active" : "pill-inactive"}`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        <div className="card h-80">
          {chartLoading ? (
            <p className="text-center text-gray-400 py-20">Loading chart...</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} minTickGap={30} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,21,53,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Line type="monotone" dataKey="price" stroke="#60a5fa" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Market Cap Rank</span>
            <p className="font-medium text-white">#{coin.marketCapRank}</p>
          </div>
          <div>
            <span className="text-gray-500">Market Cap</span>
            <p className="font-medium text-white">${coin.marketCap?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">24h High</span>
            <p className="font-medium text-white">${coin.high24h?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">24h Low</span>
            <p className="font-medium text-white">${coin.low24h?.toLocaleString()}</p>
          </div>
        </div>

        <div className="card mt-4">
          <h3 className="font-semibold mb-3 text-white">Why is {coin.symbol.toUpperCase()} moving?</h3>
          {newsLoading ? (
            <p className="text-sm text-gray-400">Analyzing recent data...</p>
          ) : (
            <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
          )}
        </div>

        <div className="card mt-4">
          <h3 className="font-semibold mb-3 text-white">Latest News</h3>
          {newsLoading ? (
            <p className="text-sm text-gray-400">Loading news...</p>
          ) : news.length === 0 ? (
            <p className="text-sm text-gray-400">No recent news found for this coin.</p>
          ) : (
            <div className="space-y-3">
              {news.map((item, i) => {
                return (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <p className="text-sm text-gray-100 font-medium mb-1">{item.title}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.source}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="w-80 shrink-0">
        <div className="card floating sticky top-4">
          <h3 className="font-semibold mb-4 text-white">Trade {coin.symbol.toUpperCase()}</h3>

          {!jwt ? (
            <p className="text-sm text-gray-400">Log in to buy or sell.</p>
          ) : (
            <form onSubmit={handleTrade} className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("BUY")}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    orderType === "BUY"
                      ? "bg-green-600 text-white shadow-md shadow-green-600/30"
                      : "bg-white/5 text-gray-300 border border-white/10"
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("SELL")}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    orderType === "SELL"
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "bg-white/5 text-gray-300 border border-white/10"
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
                  className="input-glow"
                />
              </div>

              <p className="text-xs text-gray-400">
                You will {orderType === "BUY" ? "receive" : "sell"} ≈{" "}
                <span className="font-medium text-gray-200">
                  {estimatedQuantity} {coin.symbol.toUpperCase()}
                </span>
              </p>

              {walletBalance !== null && (
                <p className="text-xs text-gray-400">
                  Available balance:{" "}
                  <span className="font-medium text-gray-200">
                    ${walletBalance.toLocaleString()}
                  </span>
                </p>
              )}

              {tradeMessage && <p className="text-xs text-green-400">{tradeMessage}</p>}
              {tradeError && <p className="text-xs text-red-400">{tradeError}</p>}

              <button
                type="submit"
                className={`w-full py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 ${
                  orderType === "BUY"
                    ? "bg-green-600 hover:bg-green-500 shadow-md shadow-green-600/30 hover:shadow-lg hover:shadow-green-500/40"
                    : "bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 hover:shadow-lg hover:shadow-red-500/40"
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