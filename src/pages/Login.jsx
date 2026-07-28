import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../redux/auth/authSlice";
import axiosInstance from "../api/axiosInstance";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, twoFactorRequired } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result) && result.payload.jwt) {
        navigate("/");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setVerifyingOtp(true);
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("jwt", res.data.jwt);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md card floating">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Log in to CryptoX</h1>

        {!twoFactorRequired ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loggingIn}
                className="input-glow disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loggingIn}
                className="input-glow disabled:opacity-60"
              />
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-red-400 text-sm">
                {typeof error === "string" ? error : "Login failed. Check your credentials."}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full btn-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loggingIn && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loggingIn ? "Logging in..." : "Log in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-400">
              A one-time code was sent to your email. Enter it below to complete login.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={verifyingOtp}
                className="input-glow disabled:opacity-60"
              />
            </div>

            {otpError && <p className="text-red-400 text-sm">{otpError}</p>}

            <button
              type="submit"
              disabled={verifyingOtp}
              className="w-full btn-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifyingOtp && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-4 text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;