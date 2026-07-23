import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { userId, action }
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const loadUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const handleConfirmedAction = async () => {
    const { userId, action } = confirmAction;
    setProcessingId(userId);
    setConfirmAction(null);
    try {
      await axiosInstance.put(`/admin/users/${userId}/${action}`);
      setMessage(`User ${action === "block" ? "blocked" : "unblocked"} successfully.`);
      await loadUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Action failed.");
    } finally {
      setProcessingId(null);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (loading) return <p className="text-gray-500">Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="border rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {message && (
        <p className="text-sm mb-4 px-4 py-2 rounded-md bg-blue-50 text-blue-700">{message}</p>
      )}

      <div className="card p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Status</th>
              <th className="py-2">Role</th>
              <th className="py-2">Joined</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{u.fullName}</td>
                <td className="py-3 text-gray-600">{u.email}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.status === "BLOCKED"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.status === "BLOCKED" ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{u.role}</td>
                <td className="py-3 text-gray-500">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 hover:bg-gray-200"
                    >
                      View
                    </button>
                    {u.role !== "ADMIN" && (
                      u.status === "BLOCKED" ? (
                        <button
                          onClick={() => setConfirmAction({ userId: u.id, action: "unblock" })}
                          disabled={processingId === u.id}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmAction({ userId: u.id, action: "block" })}
                          disabled={processingId === u.id}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Block
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageItems.length === 0 && (
          <p className="text-center text-gray-500 py-8">No users found.</p>
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

      {/* Confirmation modal for block/unblock */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="font-semibold text-gray-900 mb-2">
              Confirm {confirmAction.action === "block" ? "Block" : "Unblock"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to {confirmAction.action} this user? This action can be
              reversed later.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedAction}
                className={`px-4 py-2 rounded-lg text-sm text-white ${
                  confirmAction.action === "block"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View details modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="font-semibold text-gray-900 mb-4">User Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {selectedUser.fullName}</p>
              <p><span className="text-gray-500">Email:</span> {selectedUser.email}</p>
              <p><span className="text-gray-500">Mobile:</span> {selectedUser.mobile || "—"}</p>
              <p><span className="text-gray-500">Role:</span> {selectedUser.role}</p>
              <p><span className="text-gray-500">Status:</span> {selectedUser.status}</p>
              <p><span className="text-gray-500">2FA Enabled:</span> {selectedUser.twoFactorAuthEnabled ? "Yes" : "No"}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;