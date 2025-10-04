import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isValidToken } from '../lib/jwt';

export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        const valid = isValidToken(token);
        setHasValidToken(valid);
        
        // If token expired, clear localStorage
        if (!valid) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        setHasValidToken(false);
      }
      
      setIsChecking(false);
    };

    // Execute verification immediately
    checkAuth();

    // Listen to localStorage changes (for real-time updates)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isChecking) {
    return (
    
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!hasValidToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
