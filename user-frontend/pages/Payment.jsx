import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/store.jsx";
import * as api from "../services/api.js";
import { AlertCircle, CheckCircle, X, CreditCard } from "lucide-react";

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your payment was successful. A confirmation email has been sent to your registered email address.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-sky-600 font-semibold"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export const Payment = () => {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { amount, bookingData } = location.state || {};

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Validate expiry date
  const validateExpiry = (value) => {
    if (!value || value.length < 5) return false;
    const [month, year] = value.split("/");
    const expMonth = parseInt(month, 10);
    const expYear = parseInt("20" + year, 10);
    
    if (expMonth < 1 || expMonth > 12) return false;
    
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  };

  // Handle card number change
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
      setErrors(prev => ({ ...prev, cardNumber: "" }));
    }
  };

  // Handle expiry change
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/[^0-9/]/g, "");
    if (value.length <= 5) {
      setExpiry(formatExpiry(value.replace("/", "")));
      setErrors(prev => ({ ...prev, expiry: "" }));
    }
  };

  // Handle CVV change
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 3) {
      setCvv(value);
      setErrors(prev => ({ ...prev, cvv: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!cardHolder.trim()) {
      newErrors.cardHolder = "Card holder name is required";
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!validateExpiry(expiry)) {
      newErrors.expiry = "Invalid or expired date";
    }

    if (cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate booking data
  if (!bookingData) {
    return (
      <div className="p-10 text-center">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg inline-block">
          <AlertCircle className="inline mr-2" />
          Invalid booking request.
        </div>
        <div className="mt-4">
          <button onClick={() => navigate("/")} className="text-primary underline">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    return (
      <div className="p-10 text-center">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg inline-block">
          <AlertCircle className="inline mr-2" />
          Invalid payment amount. Please start your booking again.
        </div>
        <div className="mt-4">
          <button onClick={() => navigate("/")} className="text-primary underline">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!bookingData.from || !bookingData.to) {
    return (
      <div className="p-10 text-center">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg inline-block">
          <AlertCircle className="inline mr-2" />
          Missing pickup/drop-off locations. Please start your booking again.
        </div>
        <div className="mt-4">
          <button onClick={() => navigate("/")} className="text-primary underline">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await api.createBooking({
        vehicleId: bookingData.vehicleId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        from: bookingData.from,
        to: bookingData.to,
      });

      dispatch({ type: "CLEAR_BOOKING" });
      setShowSuccess(true);
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Secure Payment</h2>
            <p className="text-slate-500 text-sm">Enter your card details</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg mb-6 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">From:</span>
            <span className="font-medium text-right max-w-[200px] truncate">{bookingData.from}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">To:</span>
            <span className="font-medium text-right max-w-[200px] truncate">{bookingData.to}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Dates:</span>
            <span className="font-medium">{bookingData.startDate} - {bookingData.endDate}</span>
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="font-semibold">Amount to Pay:</span>
            <span className="font-bold text-primary text-lg">₹{amount.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          {/* Card Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Holder Name
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => {
                setCardHolder(e.target.value);
                setErrors(prev => ({ ...prev, cardHolder: "" }));
              }}
              placeholder="JOHN DOE"
              className={`w-full border px-3 py-2 rounded uppercase ${
                errors.cardHolder ? "border-red-500" : ""
              }`}
            />
            {errors.cardHolder && (
              <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full border px-3 py-2 rounded font-mono ${
                errors.cardNumber ? "border-red-500" : ""
              }`}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className={`w-full border px-3 py-2 rounded text-center font-mono ${
                  errors.expiry ? "border-red-500" : ""
                }`}
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="•••"
                maxLength={3}
                className={`w-full border px-3 py-2 rounded text-center font-mono ${
                  errors.cvv ? "border-red-500" : ""
                }`}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-sky-600 disabled:opacity-50 font-semibold mt-6"
          >
            {loading ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
    </div>
  );
};

export default Payment;
