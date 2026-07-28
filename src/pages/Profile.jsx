import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      setError("Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleToggle2FA = async () => {
    setToggling(true);
    setMessage("");
    setError("");
    try {
      const endpoint = user.twoFactorAuthEnabled ? "/users/disable-2fa" : "/users/enable-2fa";
      await axiosInstance.post(endpoint);
      setMessage(
        user.twoFactorAuthEnabled
          ? "Two-factor authentication disabled."
          : "Two-factor authentication enabled. You'll receive an OTP by email next time you log in."
      );
      await loadProfile();
    } catch (err) {
      setError("Could not update two-factor authentication setting.");
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-400">Loading profile...</p>;
  if (!user) return <p className="text-center py-12 text-red-400">{error}</p>;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Profile</h1>

      <div className="card space-y-4">
        <div>
          <p className="text-xs text-gray-500">Full Name</p>
          <p className="font-medium text-white">{user.fullName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Email</p>
          <p className="font-medium text-white">{user.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Mobile</p>
          <p className="font-medium text-white">{user.mobile}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Account Status</p>
          <p className="font-medium text-white">{user.status}</p>
        </div>

        <hr className="border-white/10" />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Two-Factor Authentication</p>
            <p className="text-xs text-gray-400">
              {user.twoFactorAuthEnabled
                ? "Enabled — you'll receive an OTP by email on login."
                : "Disabled — you'll log in directly without an OTP."}
            </p>
          </div>
          <button
            onClick={handleToggle2FA}
            disabled={toggling}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 ${
              user.twoFactorAuthEnabled
                ? "bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30"
                : "bg-green-600 hover:bg-green-500 shadow-md shadow-green-600/30"
            }`}
          >
            {toggling ? "Updating..." : user.twoFactorAuthEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}

export default Profile;