import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axiosInstance";

function StatCard({ title, value, icon, accent }) {
  return (
    <div className="card card-hover floating p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-400">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsRes, timelineRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/stats/transactions-timeline"),
      ]);
      setStats(statsRes.data);
      setTimeline(timelineRes.data);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-gray-400">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" accent="text-blue-400" />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon="🔄"
          accent="text-purple-400"
        />
        <StatCard
          title="Total System Balance"
          value={`$${stats.totalSystemBalance?.toLocaleString()}`}
          icon="💰"
          accent="text-green-400"
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon="⏳"
          accent="text-orange-400"
        />
      </div>

      <div className="card">
        <h2 className="font-semibold text-white mb-4">Transactions Over Time</h2>
        <div className="h-64">
          {timeline.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">No transaction data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,21,53,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;