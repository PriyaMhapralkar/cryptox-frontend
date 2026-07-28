import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState("");

 const loadWithdrawals = async () => {
  try {
    const res = await axiosInstance.get("/admin/withdrawal");
    setWithdrawals(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    setError(
      err.response?.status === 403
        ? "Access denied: admin only."
        : "Could not load withdrawals."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleDecision = async (id, approve) => {
    setProcessingId(id);
    setMessage("");
    try {
      await axiosInstance.put(`/admin/withdrawal/${id}/proceed?approve=${approve}`);
      setMessage(`Withdrawal #${id} ${approve ? "approved" : "declined"} successfully.`);
      await loadWithdrawals();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not process this withdrawal.");
    } finally {
      setProcessingId(null);
    }
  };

 const statusStyle = {
  PENDING: "bg-yellow-500/15 text-yellow-400",
  SUCCESS: "bg-green-500/15 text-green-400",
  DECLINED: "bg-red-500/15 text-red-400",
};

  if (loading) return <p className="text-center py-12 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-4">Admin: Withdrawal Requests</h1>

{message && (
  <p className="text-sm mb-4 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
    {message}
  </p>
)}

{withdrawals.length === 0 ? (
  <div className="card text-center text-gray-400 py-8">
    No withdrawal requests found.
  </div>
) : (
  <div className="card">
    <table className="w-full text-sm table-glass">
      <thead>
        <tr>
          <th className="py-2">ID</th>
          <th className="py-2">User</th>
          <th className="py-2">Date</th>
          <th className="py-2 text-right">Amount</th>
          <th className="py-2 text-right">Status</th>
          <th className="py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {withdrawals.map((w) => (
          <tr key={w.id}>
            <td className="py-3 text-gray-500">#{w.id}</td>
            <td className="py-3">
              <p className="font-medium text-white">{w.user?.fullName}</p>
              <p className="text-xs text-gray-500">{w.user?.email}</p>
            </td>
            <td className="py-3 text-gray-400">{new Date(w.date).toLocaleString()}</td>
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
            <td className="py-3 text-right">
              {w.status === "PENDING" ? (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleDecision(w.id, true)}
                    disabled={processingId === w.id}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-green-600 hover:bg-green-500 shadow-md shadow-green-600/30 disabled:opacity-50 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(w.id, false)}
                    disabled={processingId === w.id}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 disabled:opacity-50 transition-all"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-500">Processed</span>
              )}
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

export default AdminWithdrawals;