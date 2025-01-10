import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('auth_token'); 
    if (token) {
      setIsAuthenticated(true); 
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('auth_token', token);
    setUser(userData); 
    setIsAuthenticated(true); 
  };

  const logout = () => {
    localStorage.removeItem('auth_token'); 
    setUser(null);
    setIsAuthenticated(false); 
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
