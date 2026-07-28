import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import axiosInstance from "../api/axiosInstance";
import BullBearGame from "../components/BullBearGame";
import ParticleBackground from "../components/ParticleBackground";


const levels = [
  { num: "01", title: "Discover Coins", desc: "Browse live markets and find coins that match your strategy.", icon: "🔍" },
  { num: "02", title: "Analyze Market", desc: "Read real-time charts, trends, and 24h moves before you act.", icon: "📈" },
  { num: "03", title: "Buy / Sell", desc: "Execute trades instantly with live pricing and no guesswork.", icon: "⚡" },
  { num: "04", title: "Build Portfolio", desc: "Watch your holdings grow into a diversified crypto portfolio.", icon: "🧩" },
  { num: "05", title: "Track Growth", desc: "Monitor P&L, history, and performance — level up as a trader.", icon: "🏆" },
];

const powerUps = [
  { name: "Asset Vault", subtitle: "Portfolio", desc: "Every coin you hold, tracked with live value and profit/loss.", icon: "🗝️" },
  { name: "Market Radar", subtitle: "Watchlist", desc: "Keep eyes on coins you care about before you're ready to trade.", icon: "📡" },
  { name: "AI Insights", subtitle: "Analytics + Chatbot", desc: "Ask our AI assistant anything — grounded in real live prices.", icon: "🤖" },
  { name: "Secure Vault", subtitle: "Wallet", desc: "Bank-grade wallet with 2FA, transfers, and instant top-ups.", icon: "🛡️" },
];

function LandingPage() {
  const [btc, setBtc] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [mode, setMode] = useState("beginner");
  const [demoValue, setDemoValue] = useState(10000);

  useEffect(() => {
    axiosInstance.get("/coins/bitcoin").then((res) => setBtc(res.data));
    axiosInstance.get("/coins/bitcoin/chart?days=7").then((res) => {
      const formatted = res.data.prices.map(([timestamp, price]) => ({ time: timestamp, price }));
      setChartData(formatted);
    });
  }, []);

  // Simulated growing portfolio value for the demo section
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoValue((prev) => {
        const change = (Math.random() - 0.4) * 150;
        return Math.max(9000, prev + change);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const demoGrowthPercent = (((demoValue - 10000) / 10000) * 100).toFixed(2);

  return (
    <div className="overflow-hidden relative">
      <ParticleBackground />
            <div className="relative z-10">

      {/* ===================== SECTION 1: HERO ===================== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="absolute top-10 left-[5%] w-72 h-72 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-10 right-[8%] w-80 h-80 rounded-full bg-purple-500/20 blur-[100px]" />

        {/* Floating coin icons */}
        <div className="absolute top-24 left-[15%] text-5xl animate-float opacity-70">₿</div>
        <div className="absolute top-40 right-[18%] text-4xl animate-float-slow opacity-60">Ξ</div>
        <div className="absolute bottom-32 left-[22%] text-3xl animate-float opacity-50">◎</div>
        <div className="absolute bottom-20 right-[25%] text-4xl animate-float-slow opacity-60">✕</div>

        <div className="relative max-w-3xl mx-auto text-center animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 backdrop-blur-sm mb-6 text-blue-300">
            ⚡ Real-time markets · AI-powered insights · Bank-grade security
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
            Trade Crypto Like a Pro —{" "}
            <span className="gradient-text">Even as a Beginner</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10">
            Analyze, trade, and grow your portfolio with a powerful yet simple platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-glow px-8 py-3 text-base">
              Start Trading
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base">
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 2: HOW IT WORKS (LEVELS) ===================== */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-2">Level Up Your Trading</h2>
          <p className="text-gray-400">Five levels. One skill: becoming a confident trader.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {levels.map((level, i) => (
            <div
              key={level.num}
              className="card tilt-hover animate-tilt-in text-center"
              style={{ animationDelay: `${i * 0.12}s`, animationFillMode: "both" }}
            >
              <p className="text-xs text-gray-500 font-mono mb-2">LEVEL {level.num}</p>
              <div className="text-3xl mb-3">{level.icon}</div>
              <h3 className="font-semibold text-white mb-1">{level.title}</h3>
              <p className="text-xs text-gray-400">{level.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SECTION 3: INTERACTIVE DEMO ===================== */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">See It In Action</h2>
          <p className="text-gray-400 mb-6">A live look at what your dashboard feels like.</p>

          <div className="inline-flex glass rounded-full p-1">
            <button
              onClick={() => setMode("beginner")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                mode === "beginner" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "text-gray-400"
              }`}
            >
              Beginner Mode
            </button>
            <button
              onClick={() => setMode("pro")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                mode === "pro" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "text-gray-400"
              }`}
            >
              Pro Mode
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto card floating">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {btc && <img src={btc.image} alt="Bitcoin" className="w-8 h-8" />}
              <div>
                <p className="font-semibold text-white text-sm">Bitcoin</p>
                <p className="text-xs text-gray-500 uppercase">BTC/USD</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400 pulse-dot">
                ● LIVE
              </span>
            </div>
            {btc && (
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-lg font-bold text-white">
                    ${btc.currentPrice?.toLocaleString()}
                  </p>
                </div>
                {mode === "pro" && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500">24h High</p>
                      <p className="text-lg font-bold text-white">${btc.high24h?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rank</p>
                      <p className="text-lg font-bold text-white">#{btc.marketCapRank}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="h-40 mb-4">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <YAxis domain={["auto", "auto"]} hide />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600/80 shadow-md shadow-green-600/30 hover:shadow-lg hover:shadow-green-500/40 transition-all">
              Buy BTC
            </button>
            <button className="py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600/80 shadow-md shadow-red-600/30 hover:shadow-lg hover:shadow-red-500/40 transition-all">
              Sell BTC
            </button>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 4: FEATURES AS POWER-UPS ===================== */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-2">Unlock Your Power-Ups</h2>
          <p className="text-gray-400">Every trader needs the right tools equipped.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {powerUps.map((p) => (
            <div key={p.name} className="card tilt-hover">
              <div className="text-4xl mb-3 drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]">
                {p.icon}
              </div>
              <p className="text-xs text-blue-400 font-medium mb-1">{p.subtitle}</p>
              <h3 className="font-semibold text-white mb-2">{p.name}</h3>
              <p className="text-xs text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SECTION 5: PLAY THE MARKET ===================== */}
<section className="px-6 py-24">
  <div className="max-w-md mx-auto text-center mb-10">
    <h2 className="text-3xl font-bold text-white mb-2">Think You Can Read the Market?</h2>
    <p className="text-gray-400 text-sm">
      Play a quick round using real live Bitcoin prices. Build your streak.
    </p>
  </div>

  <div className="max-w-md mx-auto">
    <BullBearGame />
  </div>
</section>

      {/* ===================== SECTION 6: FINAL CTA ===================== */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto card floating text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Crypto Journey?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join CryptoX and get real-time markets, secure wallets, and an AI assistant built for traders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-glow px-8 py-3 text-base">
                Create Account
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3 text-base">
                Explore Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      

      <footer className="text-gray-500 text-sm px-6 py-8 text-center border-t border-white/5">
        <p>© {new Date().getFullYear()} CryptoX. Built as a full-stack portfolio project.</p>
      </footer>
    </div>
    </div>
    
  );
}

export default LandingPage;