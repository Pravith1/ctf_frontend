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
      const response = await api.checkIsAdmin();
      // Backend returns: { flag: true/false }
      setIsAdminUser(response.flag === true);
    } catch (error) {
      // If endpoint doesn't exist (404), fall back to field check
      console.log('Admin endpoint not available, using field check');
      setIsAdminUser(user?.field === 'admin');
    }
  };

  // Signup function - matches backend: { email, team_name, password, year, difficulty }
  const signup = async (signupData) => {
    try {
      console.log('📝 Attempting signup...');
      const response = await api.signup(signupData);
      console.log('✅ Signup response:', response);
      
      // Backend returns: { user: { email, team_name, year, difficulty, field } }
      // Cookie is set automatically by backend
      const userData = {
        email: response.user.email,
        team_name: response.user.team_name,
        year: response.user.year,
        difficulty: response.user.difficulty,
        field: response.user.field
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Set admin status based on field
      setIsAdminUser(userData.field === 'admin');
      
      console.log('✅ User signed up successfully:', userData);
      console.log('🍪 Cookie should be set by backend');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Signup error:', error);
      console.error('Response data:', error.response?.data);
      // Extract backend error message from response
      const message = error.response?.data?.message || error.response?.data?.error || 'Signup failed. Please try again.';
      return { success: false, message };
    }
  };

  // Login function - matches backend: { team_name, password }
  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await api.login(credentials);
      console.log('✅ Login response:', response);
      
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
      
      console.log('✅ User logged in successfully:', userData);
      console.log('🍪 Cookie should be set by backend');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Response data:', error.response?.data);
      // Extract backend error message from response
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('🚪 Attempting logout...');
      await api.logout();
      console.log('✅ Logout API call successful');
      localStorage.removeItem('user');
      setUser(null);
      setIsAdminUser(false);
      console.log('✅ User logged out, localStorage cleared');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if API call fails, clear local state
      localStorage.removeItem('user');
      setUser(null);
      setIsAdminUser(false);
      console.log('⚠️ Forced logout - cleared local state despite API error');
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
