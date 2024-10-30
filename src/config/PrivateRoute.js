import React from 'react';
import { Navigate } from 'react-router-dom';

// This is the function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');  // Retrieve token from localStorage
  return token ? true : false;
};

const PrivateRoute = ({ children }) => {
  // Check if the user is authenticated
  if (!isAuthenticated()) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children components (the protected page)
  return children;
};

export default PrivateRoute;
