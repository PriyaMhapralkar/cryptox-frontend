import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

function AdminWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    axiosInstance
      .get("/admin/wallets")
      .then((res) => setWallets(res.data))
      .catch(() => setError("Could not load wallets."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = wallets
    .filter((w) => {
      const q = search.toLowerCase();
      return (
        w.user?.fullName?.toLowerCase().includes(q) ||
        w.user?.email?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.balance - a.balance);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  if (loading) return <p className="text-gray-500">Loading wallets...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallet Monitoring</h1>
        <input
          type="text"
          placeholder="Search by user name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="border rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="card p-5 mb-6 inline-block">
        <p className="text-sm text-gray-500">Total System Balance</p>
        <p className="text-2xl font-bold text-green-600">
          ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>

      <div className="card p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">User</th>
              <th className="py-2">Email</th>
              <th className="py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((w) => (
              <tr key={w.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{w.user?.fullName || "—"}</td>
                <td className="py-3 text-gray-600">{w.user?.email || "—"}</td>
                <td className="py-3 text-right font-semibold">
                  ${w.balance?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageItems.length === 0 && (
          <p className="text-center text-gray-500 py-8">No wallets found.</p>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 px-2">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page + 1 >= totalPages}
              className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminWallets;