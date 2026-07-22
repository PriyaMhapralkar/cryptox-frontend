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
    PENDING: "bg-yellow-100 text-yellow-700",
    SUCCESS: "bg-green-100 text-green-700",
    DECLINED: "bg-red-100 text-red-700",
  };

  if (loading) return <p className="text-center py-12 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-12 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Withdrawal Requests</h1>

      {message && (
        <p className="text-sm mb-4 px-4 py-2 rounded-md bg-blue-50 text-blue-700">{message}</p>
      )}

      {withdrawals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          No withdrawal requests found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
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
                <tr key={w.id} className="border-b">
                  <td className="py-3 text-gray-500">#{w.id}</td>
                  <td className="py-3">
                    <p className="font-medium">{w.user?.fullName}</p>
                    <p className="text-xs text-gray-500">{w.user?.email}</p>
                  </td>
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
                  <td className="py-3 text-right">
                    {w.status === "PENDING" ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleDecision(w.id, true)}
                          disabled={processingId === w.id}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(w.id, false)}
                          disabled={processingId === w.id}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Processed</span>
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