import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: "💸" },
  { to: "/admin/transactions", label: "Transactions", icon: "🔄" },
  { to: "/admin/wallets", label: "Wallets", icon: "👛" },
  { to: "/admin/logs", label: "Activity Logs", icon: "📜" },
];

function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = () => {
      axiosInstance
        .get("/admin/stats")
        .then((res) => setPendingCount(res.data.pendingWithdrawals))
        .catch(() => {});
    };
    fetchPending();
    const interval = setInterval(fetchPending, 20000); // poll every 20s
    return () => clearInterval(interval);
  }, []);

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
<div className="flex min-h-[calc(100vh-64px)]">      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-64"} glass rounded-none border-y-0 border-l-0 transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {!collapsed && <span className="font-bold text-sm tracking-wide">ADMIN PANEL</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white text-sm"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative ${
                isActive(item)
  ? "bg-white/10 text-white border-r-2 border-blue-400 shadow-inner"
  : "text-gray-400 hover:bg-white/10 hover:text-white hover:translate-x-1"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.to === "/admin/withdrawals" && pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-white/10 text-xs text-gray-400">
            CryptoX Admin v1.0
          </div>
        )}
      </aside>

      {/* Main content */}
<main className="flex-1 p-6 overflow-x-auto">        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;