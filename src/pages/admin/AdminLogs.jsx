import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const actionStyle = {
  LOGIN: "bg-blue-100 text-blue-700",
  REGISTER: "bg-purple-100 text-purple-700",
  TRANSFER: "bg-cyan-100 text-cyan-700",
  ADD_BALANCE: "bg-green-100 text-green-700",
  WITHDRAWAL_REQUEST: "bg-orange-100 text-orange-700",
  WITHDRAWAL_APPROVED: "bg-green-100 text-green-700",
  WITHDRAWAL_DECLINED: "bg-red-100 text-red-700",
};

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const pageSize = 15;

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/logs?page=${page}&size=${pageSize}`);
      setLogs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError("Could not load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page]);

  const actionTypes = [
    "ALL",
    "LOGIN",
    "REGISTER",
    "TRANSFER",
    "ADD_BALANCE",
    "WITHDRAWAL_REQUEST",
    "WITHDRAWAL_APPROVED",
    "WITHDRAWAL_DECLINED",
  ];

  const filteredLogs =
    actionFilter === "ALL" ? logs : logs.filter((l) => l.action === actionFilter);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Logs</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {actionTypes.map((a) => (
          <button
            key={a}
            onClick={() => setActionFilter(a)}
            className={`pill ${actionFilter === a ? "pill-active" : "pill-inactive"}`}
          >
            {a.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="card p-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading logs...</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">User</th>
                  <th className="py-2">Action</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Details</th>
                  <th className="py-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <p className="font-medium">{log.user?.fullName || "System"}</p>
                      <p className="text-xs text-gray-500">{log.user?.email || "—"}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          actionStyle[log.action] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {log.action?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{log.details}</td>
                    <td className="py-3 text-right text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No activity logs found.</p>
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
          </>
        )}
      </div>
    </div>
  );
}

export default AdminLogs;