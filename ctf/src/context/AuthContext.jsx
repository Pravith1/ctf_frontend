import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Set admin status from user field (fallback until backend endpoint is ready)
        setIsAdminUser(userData.field === 'admin');
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Check admin status from backend (optional - only if endpoint exists)
  const checkAdminStatus = async () => {
    try {
      const response = await api.checkAdmin();
      // Backend returns: { isAdmin: true/false }
      setIsAdminUser(response.isAdmin === true);
    } catch (error) {
      // If endpoint doesn't exist (404), fall back to field check
      console.log('Admin endpoint not available, using field check');
      setIsAdminUser(user?.field === 'admin');
    }
  };

  // Signup function - matches backend: { email, team_name, password, year }
  const signup = async (signupData) => {
    try {
      const response = await api.signup(signupData);
      
      // Backend returns: { user: { email, team_name, year, field } }
      // Cookie is set automatically by backend
      const userData = {
        email: response.user.email,
        team_name: response.user.team_name,
        year: response.user.year,
        field: response.user.field
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Set admin status based on field
      setIsAdminUser(userData.field === 'admin');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, message };
    }
  };

  // Login function - matches backend: { team_name, password }
  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      
      // Backend returns: { user: { email, team_name, year, field } }
      // Cookie is set automatically by backend
      const userData = {
        email: response.user.email,
        team_name: response.user.team_name,
        year: response.user.year,
        field: response.user.field
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Check admin status from backend
      await checkAdminStatus();
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('user');
      setUser(null);
      setIsAdminUser(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      localStorage.removeItem('user');
      setUser(null);
      setIsAdminUser(false);
      return { success: false, message: error.message };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return isAdminUser === true;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    isLoading,
    signup,
    login,
    logout,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
