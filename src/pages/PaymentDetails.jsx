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

  if (loading) return <p className="text-center py-12 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Account Holder Name</label>
            <input
              type="text"
              name="accountHolderName"
              value={form.accountHolderName || ""}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber || ""}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">IFSC Code</label>
            <input
              type="text"
              name="ifsc"
              value={form.ifsc || ""}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={form.bankName || ""}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentDetails;