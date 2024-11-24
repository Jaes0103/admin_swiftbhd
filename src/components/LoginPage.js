import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/LoginPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Icon } from '@mui/material';
import logo from '../assets/images/bantay_hayop_logo.png';
import { useAuth } from '../context/AuthContext';
import LazyImage from './LazyImages';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [resetSuccess, setResetSuccess] = useState(false); 
  const navigate = useNavigate();

  // Login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/login`, { email, password });
      const { token, authId, userData } = response.data; 
      login(userData, token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/password-reset-request-admin`, { email });
      setResetMessage('Password reset link has been sent to your email.');
      setResetSuccess(true); 
      setError(''); 
    } catch (error) {
      console.error('Forgot password error:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Failed to send password reset link');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="Body-container">
      <div className="login-container">
        <LazyImage src={logo} alt="Logo" className="logo" width={150} height={50} /> {/* Set dimensions */}
        <h2 className="login-title">{forgotPasswordMode ? 'Forgot Password' : 'Log In'}</h2>
        <h3 className="login-title">Welcome Back 👋</h3>

        {error && <p className="error-message">{error}</p>}
        {resetMessage && <p className="success-message">{resetMessage}</p>}

        {forgotPasswordMode ? (
          <form onSubmit={handleForgotPassword} className="login-form">
            <label className="input-label" htmlFor="email">Enter your email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              disabled={loading} 
            />
            <button
              type="submit"
              className="login-button"
              disabled={loading || resetSuccess} 
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i> 
              ) : resetSuccess ? (
                'Email Sent!'
              ) : (
                'Send Reset Link'
              )}
            </button>
            <span className="forgot-password" onClick={() => setForgotPasswordMode(false)}>
              Back to Login
            </span>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              disabled={loading} 
            />
            <label className="input-label" htmlFor="password">Password</label>
            <div className="password-container">
              <input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                disabled={loading} 
              />
              <Icon
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="password-toggle"
              >
                <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
              </Icon>
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={loading} 
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Log In'} 
            </button>
            <span className="forgot-password" onClick={() => setForgotPasswordMode(true)}>
              Forgot Password?
            </span>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;