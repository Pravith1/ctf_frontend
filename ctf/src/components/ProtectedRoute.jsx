import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { checkIsAdmin } from '../api.js';

// Minimal ProtectedRoute: when adminOnly is true, call /admin/isAdmin once and allow access only
// if the backend returns { flag: true }. Otherwise redirect to /challenge. Authentication is
// still based on AuthContext's user presence.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Only check when route is adminOnly and user is authenticated
    if (adminOnly && isAuthenticated() && !adminChecked) {
      setIsCheckingAdmin(true);
      checkIsAdmin()
        .then((res) => {
          if (!mounted) return;
          setIsAdmin(res.flag === true);
          setAdminChecked(true);
        })
        .catch((err) => {
          if (!mounted) return;
          console.error('Admin check failed:', err.response?.data || err.message);
          setIsAdmin(false);
          setAdminChecked(true);
        })
        .finally(() => {
          if (mounted) setIsCheckingAdmin(false);
        });
    }

    return () => { mounted = false; };
  }, [adminOnly, isAuthenticated, adminChecked]);

  // Show initial loading
  if (isLoading) return <div style={{minHeight: '100vh'}}>Loading...</div>;

  // If not authenticated, send to login
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  // If admin route, wait for check
  if (adminOnly) {
    if (isCheckingAdmin) return <div style={{minHeight: '100vh'}}>Verifying admin access...</div>;
    if (!adminChecked) return <div style={{minHeight: '100vh'}}>Verifying admin access...</div>;
    if (!isAdmin) return <Navigate to="/challenge" replace />;
  }

  return children;
}
