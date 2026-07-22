import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import axiosInstance from "../api/axiosInstance";

function LandingPage() {
  const [btc, setBtc] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axiosInstance.get("/coins/bitcoin").then((res) => setBtc(res.data));
    axiosInstance.get("/coins/bitcoin/chart?days=7").then((res) => {
      const formatted = res.data.prices.map(([timestamp, price]) => ({
        time: timestamp,
        price,
      }));
      setChartData(formatted);
    });
  }, []);

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white px-6 py-28 md:py-36">
        {/* Floating background elements */}
        <div className="absolute top-16 left-[8%] w-16 h-16 rounded-full bg-orange-400/20 blur-xl animate-float" />
        <div className="absolute top-40 right-[12%] w-24 h-24 rounded-full bg-blue-400/20 blur-2xl animate-float-slow" />
        <div className="absolute bottom-24 left-[20%] w-20 h-20 rounded-full bg-purple-400/20 blur-2xl animate-float" />
        <div className="absolute bottom-10 right-[25%] w-12 h-12 rounded-full bg-green-400/20 blur-xl animate-float-slow" />

        <div className="relative max-w-4xl mx-auto text-center animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            🚀 Real-time market data · Secure trading · AI-powered insights
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Trade Crypto with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Buy, sell, and manage your crypto portfolio with real-time prices, bank-grade
            security, and an AI assistant that actually knows the market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg shadow-blue-600/30 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-semibold backdrop-blur-sm transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE CHART SECTION */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Bitcoin Price</h2>
            <p className="text-gray-500">Real-time data, updated continuously from the market.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {btc && <img src={btc.image} alt="Bitcoin" className="w-10 h-10" />}
                <div>
                  <p className="font-semibold text-gray-900">Bitcoin</p>
                  <p className="text-xs text-gray-400 uppercase">BTC/USD</p>
                </div>
              </div>

              {btc && (
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-400">Current Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${btc.currentPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">24h Change</p>
                    <p
                      className={`text-xl font-bold ${
                        btc.priceChangePercentage24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {btc.priceChangePercentage24h?.toFixed(2)}%
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-400">Market Cap</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${(btc.marketCap / 1e9).toFixed(1)}B
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-56">
              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <YAxis domain={["auto", "auto"]} hide />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1200}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO / DASHBOARD PREVIEW SECTION */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Everything you need, in one place
          </h2>
          <p className="text-gray-500">
            Portfolio tracking, wallet management, and instant trading — all in a clean dashboard.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-3xl blur-2xl opacity-60" />

          <div className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-6 md:p-8 hover:scale-[1.01] transition-transform duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Wallet Balance</p>
                <p className="text-2xl font-bold text-gray-900">$12,480.32</p>
                <p className="text-xs text-green-600 mt-1">+2.4% today</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">$8,921.10</p>
                <p className="text-xs text-green-600 mt-1">+5.1% this week</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Active Watchlist</p>
                <p className="text-2xl font-bold text-gray-900">6 Coins</p>
                <p className="text-xs text-gray-400 mt-1">BTC, ETH, SOL...</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {["Bitcoin", "Ethereum", "Solana"].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                >
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                  <span className="text-xs text-green-600 font-medium">▲</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-blue-700 to-purple-800 text-white px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start your crypto journey today
        </h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Join CryptoX and get access to real-time markets, secure wallets, and an AI assistant
          built for traders.
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Login / Register
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-gray-400 text-sm px-6 py-8 text-center">
        <p>© {new Date().getFullYear()} CryptoX. Built as a full-stack portfolio project.</p>
      </footer>
    </div>
  );
}

export default LandingPage;