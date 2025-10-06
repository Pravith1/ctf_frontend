import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function - will be called from LoginPage
  const login = async (credentials) => {
    try {
      const dummyResponse = {
        success: true,
        token: 'dummy-jwt-token-' + Date.now(),
        user: {
          id: 1,
          username: credentials.username,
          email: credentials.email || `${credentials.username}@example.com`,
          isAdmin: credentials.username === 'admin', // Set to true if username is 'admin'
          country: 'IN',
          points: 0
        }
      };

      if (dummyResponse.success) {
        // Store token
        localStorage.setItem('token', dummyResponse.token);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(dummyResponse.user));
        
        // Update state
        setUser(dummyResponse.user);
        
        return { success: true, user: dummyResponse.user };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    isLoading,
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
