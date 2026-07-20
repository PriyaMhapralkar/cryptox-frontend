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
    PENDING: "bg-yellow-100 text-yellow-700",
    SUCCESS: "bg-green-100 text-green-700",
    DECLINED: "bg-red-100 text-red-700",
  };

  if (loading) return <p className="text-center py-12 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
        
      <h1 className="text-2xl font-bold mb-4">Withdrawal History</h1>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {withdrawals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          No withdrawal requests yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Date</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} className="border-b">
                  <td className="py-3 text-gray-600">
                    {new Date(w.date).toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-medium">
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