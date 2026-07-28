import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function WithdrawHistory() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/withdrawal/history")
      .then((res) => setWithdrawals(res.data))
      .catch(() => setError("Could not load withdrawal history."))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = {
    PENDING: "bg-yellow-500/15 text-yellow-400",
    SUCCESS: "bg-green-500/15 text-green-400",
    DECLINED: "bg-red-500/15 text-red-400",
  };

  if (loading) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Withdrawal History</h1>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {withdrawals.length === 0 ? (
        <div className="card text-center text-gray-400 py-8">
          No withdrawal requests yet.
        </div>
      ) : (
        <div className="card">
          <table className="w-full text-sm table-glass">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id}>
                  <td className="py-3 text-gray-400">
                    {new Date(w.date).toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-medium text-white">
                    ${w.amount?.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[w.status]}`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WithdrawHistory;