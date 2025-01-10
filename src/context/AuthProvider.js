import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user data
    const [token, setToken] = useState(null); // Stores authentication token

    // Function to handle login
    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token); // Save token in localStorage
        localStorage.setItem('user', JSON.stringify(userData)); // Save user in localStorage
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); // Clear token from localStorage
        localStorage.removeItem('user'); // Clear user data from localStorage
    };

    // Rehydrate authentication state on app reload
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
