import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addAmount, setAddAmount] = useState("");
  const [transferEmail, setTransferEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [needsPaymentDetails, setNeedsPaymentDetails] = useState(false);

  const loadWalletData = async () => {
    try {
      const [walletRes, txnRes] = await Promise.all([
        axiosInstance.get("/wallet"),
        axiosInstance.get("/wallet/transactions"),
      ]);
      setWallet(walletRes.data);
      setTransactions(txnRes.data);
    } catch (err) {
      setError("Could not load wallet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const init = async () => {
    await loadWalletData();
  };

  init();
}, []);

  const showResult = (msg, isError = false) => {
    setMessage(isError ? "" : msg);
    setError(isError ? msg : "");
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 5000);
  };

  const handleAddBalanceViaRazorpay = async (e) => {
  e.preventDefault();
  const parsedAmount = parseFloat(addAmount);
  if (!addAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
    showResult("Please enter a valid amount greater than zero.", true);
    return;
  }
   try {
    // ✅ YOU WERE MISSING THIS API CALL
    const orderRes = await axiosInstance.post("/payment/razorpay/order", {
      amount: parsedAmount,
    });

const order =
  typeof orderRes.data === "string"
    ? JSON.parse(orderRes.data)
    : orderRes.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,// your test Key ID
        amount: order.amount,
        currency: order.currency,
        name: "CryptoX",
        description: "Add funds to wallet",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axiosInstance.post("/payment/razorpay/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            showResult("Payment verified! Wallet credited.");
            setAddAmount("");
            loadWalletData();
          } catch (err) {
  const backendMessage =
    err.response?.data?.message ||
    (typeof err.response?.data === "string" ? err.response.data : null) ||
    err.message ||
    "Payment verification failed.";

  showResult(backendMessage, true);
}
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showResult(err.response?.data?.message || "Could not start payment.", true);
    }
  };

 const handleTransfer = async (e) => {
  e.preventDefault();
  const parsedAmount = parseFloat(transferAmount);
  if (!transferAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
    showResult("Please enter a valid amount greater than zero.", true);
    return;
  }
  if (!transferEmail.trim()) {
    showResult("Please enter a recipient email.", true);
    return;
  }
   try {
    // ✅ MISSING API CALL (IMPORTANT)
    await axiosInstance.post("/transfer", {
      email: transferEmail,
      amount: parsedAmount,
    });
      showResult("Transfer successful!");
      setTransferEmail("");
      setTransferAmount("");
      loadWalletData();
    } catch (err) {
      showResult(err.response?.data?.message || "Transfer failed.", true);
    }
  };

const handleWithdraw = async (e) => {
  e.preventDefault();

  setNeedsPaymentDetails(false);

  const parsedAmount = parseFloat(withdrawAmount);

  // ✅ FRONTEND VALIDATION
  if (!withdrawAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
    showResult("Please enter a valid amount greater than zero.", true);
    return;
  }

  try {
    await axiosInstance.post("/withdrawal", { amount: parsedAmount });

    showResult("Withdrawal requested! Pending admin approval.");
    setWithdrawAmount("");
    loadWalletData();

  } catch (err) {
    const backendMessage =
      err.response?.data?.message ||
      (typeof err.response?.data === "string" ? err.response.data : null) ||
      err.message ||
      "Withdrawal request failed.";

    if (
      backendMessage.toLowerCase().includes("bank") ||
      backendMessage.toLowerCase().includes("payment")
    ) {
      setNeedsPaymentDetails(true);
    } else {
      showResult(backendMessage, true);
    }
  }
};

  if (loading) return <p className="text-center py-12 text-gray-500">Loading wallet...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-4 text-sm">
  <Link to="/payment-details" className="text-blue-600 hover:underline">Manage Payment Details</Link>
  <Link to="/withdraw-history" className="text-blue-600 hover:underline">Withdrawal History</Link>
</div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-500 text-sm">Wallet Balance</p>
        <p className="text-4xl font-bold mt-1">${wallet?.balance?.toLocaleString()}</p>
      </div>

      {needsPaymentDetails && (
  <div className="text-sm bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md flex items-center justify-between">
    <span>You need to add your bank details before requesting a withdrawal.</span>

    <Link
      to="/payment-details"
      className="ml-4 shrink-0 bg-yellow-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-yellow-700"
    >
      Add Payment Details
    </Link>
  </div>
)}

      {message && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-md">{message}</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add balance */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold mb-3">Add Balance</h3>
          <form onSubmit={handleAddBalanceViaRazorpay} className="space-y-2">
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount (₹)"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700"
            >
              Pay with Razorpay
            </button>
          </form>
        </div>

        {/* Transfer */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold mb-3">Transfer to Wallet</h3>
          <form onSubmit={handleTransfer} className="space-y-2">
            <input
              type="email"
              placeholder="Recipient email"
              value={transferEmail}
              onChange={(e) => setTransferEmail(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-gray-800 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-900"
            >
              Transfer
            </button>
          </form>
        </div>

        {/* Withdraw */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold mb-3">Withdraw to Bank</h3>
          <form onSubmit={handleWithdraw} className="space-y-2">
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-orange-600 text-white rounded-md py-2 text-sm font-medium hover:bg-orange-700"
            >
              Request Withdrawal
            </button>
          </form>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold mb-3">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Purpose</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b">
                  <td className="py-2 text-gray-500">
                    {new Date(txn.date).toLocaleString()}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        ["DEPOSIT", "TRANSFER_IN", "SELL"].includes(txn.type)
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">{txn.purpose}</td>
                  <td className="py-2 text-right font-medium">
                    ${txn.amount?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        )}
      </div>
    </div>
  );
}

export default Wallet;