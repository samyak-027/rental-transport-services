import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as api from "../../services/api.js";

export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.resetPassword({ email, otp, newPassword });
      
      if (response.success) {
        alert('Password reset successfully! Please login with your new password.');
        navigate('/login');
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Invalid OTP or failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Invalid Request. Please start from Forgot Password.</p>
          <button 
            onClick={() => navigate('/forgot-password')} 
            className="text-primary underline mt-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Set New Password</h2>
        <p className="text-slate-500 text-center mb-6 text-sm">
          Enter the OTP sent to <strong>{email}</strong>
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">OTP Code</label>
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP"
              className="mt-1 w-full px-4 py-2 border rounded-lg tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">New Password</label>
            <input 
              type="password" 
              className="mt-1 w-full px-4 py-2 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
            <input 
              type="password" 
              className="mt-1 w-full px-4 py-2 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-sky-600 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-slate-500 hover:text-primary"
          >
            Didn't receive OTP? Try again
          </button>
        </div>
      </div>
    </div>
  );
};
