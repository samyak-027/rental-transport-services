import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavigationHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      const token = document.cookie.split('; ').find((row) => row.startsWith('adminToken='));
      if (!token && location.pathname !== '/login') {
        navigate('/login', { replace: true });
        alert('Please login first');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [navigate, location]);

  return null;
}