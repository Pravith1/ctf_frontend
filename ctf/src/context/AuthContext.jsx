import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    console.log('🔄 AuthContext initializing...');
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('💾 Stored user:', storedUser);
    console.log('🔑 Stored token:', storedToken ? 'Present' : 'Missing');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Set admin status from user field (fallback until backend endpoint is ready)
        setIsAdminUser(userData.field === 'admin');
        console.log('✅ User restored from localStorage:', userData);
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('⚠️ No user in localStorage');
    }
    setIsLoading(false);
  }, []);

  // Check admin status from backend
  const checkAdminStatus = async () => {
    try {
      const response = await api.checkIsAdmin();
      console.log('🔐 Admin check response:', response);
      // Backend returns: { flag: true/false }
      const isAdmin = response.flag === true;
      setIsAdminUser(isAdmin);
      console.log('✅ Admin status:', isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('❌ Admin check failed:', error.response?.data);
      // Fallback to field check from user data
      const isAdmin = user?.field === 'admin';
      setIsAdminUser(isAdmin);
      console.log('⚠️ Using fallback admin check from user field:', isAdmin);
      return isAdmin;
    }
  };

  // Signup function - matches backend: { email, team_name, password, year, difficulty }
  const signup = async (signupData) => {
    try {
      console.log('📝 Attempting signup...');
      const response = await api.signup(signupData);
      
      // Backend returns: { user: { email, team_name, year, difficulty, field }, token }
      const userData = {
        email: response.user.email,
        team_name: response.user.team_name,
        year: response.user.year,
        difficulty: response.user.difficulty,
        field: response.user.field
      };
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Set admin status based on field
      setIsAdminUser(userData.field === 'admin');
      
      console.log('✅ User signed up successfully');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Signup error:', error.response?.data);
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
      
      // Backend returns: { user: { email, team_name, year, difficulty, field }, token }
      const userData = {
        email: response.user.email,
        team_name: response.user.team_name,
        year: response.user.year,
        difficulty: response.user.difficulty,
        field: response.user.field
      };
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Check admin status from backend
      await checkAdminStatus();
      
      console.log('✅ User logged in successfully');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data);
      // Extract backend error message from response
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await api.logout();
      
      // Clear token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAdminUser(false);
      
      console.log('✅ Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error.response?.data);
      
      // Even if API call fails, clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAdminUser(false);
      
      console.log('⚠️ Forced local logout');
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
