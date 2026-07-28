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
  const [needsPaymentDetails, setNeedsPaymentDetails] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    loadWalletData();
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
      const orderRes = await axiosInstance.post("/payment/razorpay/create-order", {
        amount: parsedAmount,
      });
      const order =
        typeof orderRes.data === "string" ? JSON.parse(orderRes.data) : orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
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
            showResult(
              err.response?.data?.message || "Payment verification failed.",
              true
            );
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
      await axiosInstance.put("/wallet/transfer", {
        toUserEmail: transferEmail,
        amount: parsedAmount,
        purpose: "Wallet transfer",
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
        "Withdrawal request failed.";

      if (backendMessage.toLowerCase().includes("bank details")) {
        setNeedsPaymentDetails(true);
      } else {
        showResult(backendMessage, true);
      }
    }
  };

  if (loading) return <p className="text-center py-12 text-gray-400">Loading wallet...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex gap-4 text-sm">
        <Link to="/payment-details" className="text-blue-400 hover:underline">
          Manage Payment Details
        </Link>
        <Link to="/withdraw-history" className="text-blue-400 hover:underline">
          Withdrawal History
        </Link>
      </div>

      <div className="card floating">
        <p className="text-gray-400 text-sm">Wallet Balance</p>
        <p className="text-4xl font-bold mt-1 text-white">
          ${wallet?.balance?.toLocaleString()}
        </p>
      </div>

      {needsPaymentDetails && (
        <div className="text-sm bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>You need to add your bank details before requesting a withdrawal.</span>
          <Link to="/payment-details" className="ml-4 shrink-0 btn-glow text-xs py-1.5 px-3">
            Add Payment Details
          </Link>
        </div>
      )}

      {message && (
        <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-3 text-white">Add Balance</h3>
          <form onSubmit={handleAddBalanceViaRazorpay} className="space-y-2">
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount (₹)"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              required
              className="input-glow"
            />
            <button type="submit" className="w-full btn-glow text-sm">
              Pay with Razorpay
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3 text-white">Transfer to Wallet</h3>
          <form onSubmit={handleTransfer} className="space-y-2">
            <input
              type="email"
              placeholder="Recipient email"
              value={transferEmail}
              onChange={(e) => setTransferEmail(e.target.value)}
              required
              className="input-glow"
            />
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              required
              className="input-glow"
            />
            <button type="submit" className="w-full btn-secondary text-sm">
              Transfer
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3 text-white">Withdraw to Bank</h3>
          <form onSubmit={handleWithdraw} className="space-y-2">
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              required
              className="input-glow"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-600/30 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300"
            >
              Request Withdrawal
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3 text-white">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-400">No transactions yet.</p>
        ) : (
          <table className="w-full text-sm table-glass">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Purpose</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="py-2 text-gray-400">
                    {new Date(txn.date).toLocaleString()}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        ["DEPOSIT", "TRANSFER_IN", "SELL"].includes(txn.type)
                          ? "bg-green-500/15 text-green-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">{txn.purpose}</td>
                  <td className="py-2 text-right font-medium text-white">
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