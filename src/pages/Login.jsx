import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../redux/auth/authSlice";
import axiosInstance from "../api/axiosInstance";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, twoFactorRequired, jwt } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result) && result.payload.jwt) {
      navigate("/");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("jwt", res.data.jwt);
      navigate("/");
      window.location.reload(); // ensures Redux picks up the new token cleanly
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log in to CryptoX</h1>

        {!twoFactorRequired ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-right">
  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
    Forgot password?
  </Link>
</div>


            {error && (
              <p className="text-red-600 text-sm">
                {typeof error === "string" ? error : "Login failed. Check your credentials."}
              </p>
            )}
            

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {status === "loading" ? "Logging in..." : "Log in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600">
              A one-time code was sent to your email. Enter it below to complete login.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {otpError && <p className="text-red-600 text-sm">{otpError}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;