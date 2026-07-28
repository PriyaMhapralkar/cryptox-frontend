import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const typeStyle = {
  DEPOSIT: "bg-green-500/15 text-green-400",
  WITHDRAWAL: "bg-orange-500/15 text-orange-400",
  TRANSFER_IN: "bg-blue-500/15 text-blue-400",
  TRANSFER_OUT: "bg-blue-500/15 text-blue-400",
  BUY: "bg-purple-500/15 text-purple-400",
  SELL: "bg-pink-500/15 text-pink-400",
};

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    axiosInstance
      .get("/admin/transactions")
      .then((res) => setTransactions(res.data))
      .catch(() => setError("Could not load transactions."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions
    .filter((t) => (filterType === "ALL" ? true : t.type === filterType))
    .filter((t) => {
      const email = t.wallet?.user?.email?.toLowerCase() || "";
      const name = t.wallet?.user?.fullName?.toLowerCase() || "";
      const q = search.toLowerCase();
      return email.includes(q) || name.includes(q);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const types = ["ALL", "DEPOSIT", "WITHDRAWAL", "TRANSFER_IN", "TRANSFER_OUT", "BUY", "SELL"];

  if (loading) return <p className="text-gray-500">Loading transactions...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
  <h1 className="text-2xl font-bold text-white">Transactions</h1>
  <input
    type="text"
    placeholder="Search by user name or email..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(0);
    }}
    className="input-glow w-72"
  />
</div>

<div className="flex gap-2 mb-4 flex-wrap">
  {types.map((t) => (
    <button
      key={t}
      onClick={() => {
        setFilterType(t);
        setPage(0);
      }}
      className={`pill ${filterType === t ? "pill-active" : "pill-inactive"}`}
    >
      {t.replace("_", " ")}
    </button>
  ))}
</div>

<div className="card">
  <table className="w-full text-sm table-glass">
    <thead>
      <tr>
        <th className="py-2">Date</th>
        <th className="py-2">User</th>
        <th className="py-2">Type</th>
        <th className="py-2">Purpose</th>
        <th className="py-2 text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      {pageItems.map((t) => (
        <tr key={t.id}>
          <td className="py-3 text-gray-400">{new Date(t.date).toLocaleString()}</td>
          <td className="py-3">
            <p className="font-medium text-white">{t.wallet?.user?.fullName || "—"}</p>
            <p className="text-xs text-gray-500">{t.wallet?.user?.email || "—"}</p>
          </td>
          <td className="py-3">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                typeStyle[t.type] || "bg-gray-500/15 text-gray-300"
              }`}
            >
              {t.type?.replace("_", " ")}
            </span>
          </td>
          <td className="py-3 text-gray-400">{t.purpose}</td>
          <td className="py-3 text-right font-medium text-white">
            ${t.amount?.toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>


        {pageItems.length === 0 && (
          <p className="text-center text-gray-500 py-8">No transactions found.</p>
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

export default AdminTransactions;