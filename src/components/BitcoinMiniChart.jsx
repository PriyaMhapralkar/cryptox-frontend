import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ranges = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
];

function BitcoinMiniChart() {
  const [btc, setBtc] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedDays, setSelectedDays] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/coins/bitcoin").then((res) => setBtc(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/coins/bitcoin/chart?days=${selectedDays}`)
      .then((res) => {
        const formatted = res.data.prices.map(([timestamp, price]) => ({
          time: timestamp,
          price,
        }));
        setChartData(formatted);
      })
      .finally(() => setLoading(false));
  }, [selectedDays]);

  return (
    <Link to="/coin/bitcoin" className="block">
      <div className="card floating hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {btc && <img src={btc.image} alt="Bitcoin" className="w-6 h-6" />}
            <h3 className="font-semibold text-white">Bitcoin</h3>
          </div>
          {btc && (
            <span
              className={`text-xs font-medium ${
                btc.priceChangePercentage24h >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {btc.priceChangePercentage24h?.toFixed(2)}%
            </span>
          )}
        </div>

        {btc && (
          <p className="text-xl font-bold text-white mb-3">
            ${btc.currentPrice?.toLocaleString()}
          </p>
        )}

        <div className="h-24 mb-3">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-500">
              Loading...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={["auto", "auto"]} hide />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={
                    chartData.length > 1 && chartData[chartData.length - 1].price >= chartData[0].price
                      ? "#4ade80"
                      : "#f87171"
                  }
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
          {ranges.map((r) => (
            <button
              key={r.days}
              onClick={(e) => {
                e.preventDefault();
                setSelectedDays(r.days);
              }}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDays === r.days
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default BitcoinMiniChart;