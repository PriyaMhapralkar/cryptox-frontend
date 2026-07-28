import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function PaymentDetails() {
  const [form, setForm] = useState({
    accountNumber: "",
    accountHolderName: "",
    ifsc: "",
    bankName: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/payment-details")
      .then((res) => setForm(res.data))
      .catch(() => {
        // No details yet — that's fine, form just stays empty
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axiosInstance.post("/payment-details", form);
      setMessage("Payment details saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save payment details.");
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Payment Details</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={form.accountHolderName || ""}
              onChange={handleChange}
              required
              className="input-glow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber || ""}
              onChange={handleChange}
              required
              className="input-glow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">IFSC Code</label>
            <input
              type="text"
              name="ifsc"
              value={form.ifsc || ""}
              onChange={handleChange}
              required
              className="input-glow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={form.bankName || ""}
              onChange={handleChange}
              required
              className="input-glow"
            />
          </div>

          {message && <p className="text-sm text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="w-full btn-glow text-sm">
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentDetails;