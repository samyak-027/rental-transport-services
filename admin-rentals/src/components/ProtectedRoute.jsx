import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5007/api/admin/check-auth', {
          withCredentials: true
        });
        console.log(response.data);
        if (!response.data.isAuthenticated) {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        navigate('/login', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  return children;
}