import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/store.jsx';

export const ProtectedRoute = ({ children }) => {
  const { state } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated from localStorage and state
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // Not authenticated, redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [navigate, location.pathname]);

  // Also check state changes
  useEffect(() => {
    if (!isChecking && !state.auth.isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login', { replace: true });
      }
    }
  }, [state.auth.isAuthenticated, isChecking, navigate]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;