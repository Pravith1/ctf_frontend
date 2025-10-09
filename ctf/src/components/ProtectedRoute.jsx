import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { checkIsAdmin } from '../api.js';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  // Verify admin status from backend ONLY when adminOnly route
  useEffect(() => {
    if (adminOnly && isAuthenticated()) {
      setAdminCheckLoading(true);
      const verifyAdmin = async () => {
        try {
          const response = await checkIsAdmin();
          // Backend returns: { flag: true } or { flag: false }
          setIsAdminVerified(response.flag === true);
        } catch (error) {
          console.error('Admin verification failed:', error);
          // Don't clear cookies - just treat as non-admin
          setIsAdminVerified(false);
        } finally {
          setAdminCheckLoading(false);
        }
      };
      verifyAdmin();
    }
  }, [adminOnly, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading || adminCheckLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0f0f0f',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            animation: 'spin 1s linear infinite' 
          }}>
            🔒
          </div>
          <p>{adminCheckLoading ? 'Verifying admin access...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // Check if route requires admin access
  if (adminOnly && !isAdminVerified) {
    // Redirect non-admin users to challenges page (keep cookies intact)
    return <Navigate to="/challenge" replace />;
  }

  // User is authenticated (and admin if required), render the protected content
  return children;
}
