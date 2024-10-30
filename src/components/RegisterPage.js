import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/RegisterPage.css'; // Assuming you have corresponding styles
import logo from '../assets/images/bantay_hayop_logo.jpg';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Make POST request to register endpoint
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/register`, {
        email,
        password,
      });

      // Handle success response
      if (response.status === 201) {
        setSuccess('Account created! Please verify your email.');
        // Optionally navigate to login after a few seconds
        setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      if (error.response) {
        // Use error messages returned from the backend
        setError(error.response.data.message || 'Failed to register. Please try again.');
      } else {
        setError('Failed to register. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <img src={logo} alt="Logo" className="logo" />
      <h2 className="register-title">Register</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleRegister} className="register-form">
        <label className="input-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />

        <label className="input-label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />

        <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
          required
        />

        <button type="submit" className="register-button">Register</button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
};

export default RegisterPage;