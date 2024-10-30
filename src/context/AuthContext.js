import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for user information
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status

  // Effect to check local storage for a token and update authentication state
  useEffect(() => {
    const token = localStorage.getItem('auth_token'); // Check for token in localStorage
    if (token) {
      setIsAuthenticated(true); // User is authenticated if token exists
      // Optionally, you can decode the token to get user data here
      // const userData = decodeToken(token); // Decode if you have a function to decode
      // setUser(userData);
    }
  }, []);

  // Login function to authenticate the user and set user data
  const login = (userData, token) => {
    localStorage.setItem('auth_token', token); // Store token in localStorage
    setUser(userData); // Set user data (could be an object with user info)
    setIsAuthenticated(true); // Mark as authenticated
  };

  // Logout function to clear user data
  const logout = () => {
    localStorage.removeItem('auth_token'); // Remove token from localStorage
    setUser(null); // Clear user data
    setIsAuthenticated(false); // Mark as not authenticated
  };

  // Provide the context values
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
