import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../redux/auth/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create your CryptoX account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {typeof error === "string" ? error : "Registration failed. Please try again."}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "loading" ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;