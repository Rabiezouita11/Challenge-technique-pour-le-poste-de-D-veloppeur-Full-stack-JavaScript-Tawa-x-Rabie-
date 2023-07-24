import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Create refs for the input elements
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if email and password are empty
    if (!email || !password) {
      toast.error('Please fill in all the required fields.');

      // Focus on the first empty required input field
      if (!email) emailInputRef.current.focus();
      else if (!password) passwordInputRef.current.focus();

      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Save token and user name in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      
      // Set loggedIn to true after successful login
      setLoggedIn(true);

      // Redirect to dashboard after successful login
      navigate('/dashboard'); // Use useNavigate to redirect to the dashboard

      // Show toast notification for successful login
      toast.success('Login successful! Welcome back.');

    } catch (error) {
      console.error(error);
      // Show toast notification for login failure
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef} // Ref for the Email input
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordInputRef} // Ref for the Password input
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
