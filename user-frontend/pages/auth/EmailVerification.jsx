import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as api from "../../services/api.js";

export const EmailVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const userId = location.state?.userId;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !userId) {
      setError("Session lost. Please sign up again.");
      setTimeout(() => navigate('/signup'), 2000);
      return;
    }

    try {
      setLoading(true);
      const response = await api.verifyEmail({ userId, otp });
      if (response.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    
    if (!userId) {
      setError("Session lost. Please sign up again.");
      setTimeout(() => navigate('/signup'), 2000);
      return;
    }

    try {
      setResending(true);
      const response = await api.resendOTP({ userId });
      if (response.success) {
        setSuccess('OTP resent successfully! Check your email.');
      } else {
        setError(response.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (!email || !userId) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No email provided.</p>
          <a href="/signup" className="text-primary underline">Go to Signup</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
        <p className="text-slate-500 mb-6">
          Enter the 6-digit code sent to <br/>
          <strong>{email}</strong>
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleVerify} className="space-y-6">
          <input 
            type="text" 
            placeholder="000000"
            maxLength={6}
            className="w-full text-center text-2xl tracking-widest px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required 
          />
          <button 
            type="submit" 
            disabled={loading || otp.length !== 6}
            className="w-full bg-primary hover:bg-sky-600 text-white font-bold py-2.5 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        
        <button
          onClick={handleResendOTP}
          disabled={resending}
          className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg disabled:opacity-50"
        >
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>
        
        <p className="mt-4 text-xs text-slate-400">
          Didn't receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
};
