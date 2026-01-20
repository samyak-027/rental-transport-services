import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from "../../services/api.js";

export const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const navigate = useNavigate();

  // Debounced email validation
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && formData.email.includes('@')) {
        setEmailChecking(true);
        setEmailError('');
        
        try {
          const response = await api.checkEmailAvailability(formData.email);
          if (response.available) {
            setEmailValid(true);
            setEmailError('');
          } else {
            setEmailValid(false);
            setEmailError('Email is already registered. Please use a different email or try logging in.');
          }
        } catch (err) {
          console.error('Email check error:', err);
          setEmailError('Unable to verify email availability');
        } finally {
          setEmailChecking(false);
        }
      } else {
        setEmailValid(false);
        setEmailError('');
      }
    };

    const timeoutId = setTimeout(checkEmail, 500); // Debounce for 500ms
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailValid) {
      setError('Please use a valid and available email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await api.register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      
      if (response.success) {
        navigate('/verify-email', { 
          state: { 
            email: formData.email, 
            userId: response.userId
          } 
        });
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message;
      
      if (errorMessage === 'Email already registered') {
        setError('Email already registered. Please use a different email or try logging in.');
      } else {
        setError(errorMessage || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
            {error.includes('try logging in') && (
              <div className="mt-2">
                <Link to="/login" className="text-primary underline font-medium">
                  Go to login
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input 
              type="text" 
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <input 
                type="email" 
                className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                  emailError ? 'border-red-500' : emailValid ? 'border-green-500' : ''
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  setError('');
                }}
                required 
              />
              {emailChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1">
                {emailError}
                {emailError.includes('try logging in') && (
                  <Link to="/login" className="text-primary underline ml-1">Login here</Link>
                )}
              </p>
            )}
            {emailValid && !emailChecking && (
              <p className="text-green-500 text-xs mt-1">✓ Email is available</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              minLength={6}
              required 
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input 
              type="password" 
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''
              }`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !emailValid || emailChecking}
            className="w-full bg-primary hover:bg-sky-600 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};