import React, { useState, useRef } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
//   const navigate = useNavigate(); // Initialize useNavigate
  const recaptchaRef = useRef(null); // Create a ref for the reCAPTCHA component

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Check if name, email, or password is empty
    if (!name || !email || !password) {
      toast.error('Please fill in all the required fields.');
      
      // Focus on the first input field that is empty
      if (!name) nameInputRef.current.focus();
      else if (!email) emailInputRef.current.focus();
      else if (!password) passwordInputRef.current.focus();
      
      return;
    }

    try {
      // Verify reCAPTCHA token before proceeding with registration
      if (!recaptchaToken) {
        toast.error('Please complete the reCAPTCHA verification.');
        return;
      }

      // Make the registration API call
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      // Check the response from the server for success
      if (response.status === 201) {
        // Show toast notification for successful registration
        toast.success('Registration successful! You can now login.');
        // Redirect to login after successful registration
        setName('');
        setEmail('');
        setPassword('');
        setRecaptchaToken('');
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
      }
    } catch (error) {
      console.error(error);
      // Check if the error response indicates an existing user
      if (error.response && error.response.status === 400) {
        toast.error('An account with this email already exists. Please login instead.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const handleRecaptchaChange = (token) => {
    // Callback function to set the recaptchaToken state when reCAPTCHA is solved
    setRecaptchaToken(token);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
            ref={nameInputRef} // Ref for the Name input
          />
        </div>
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
        {/* reCAPTCHA */}
        <div className="mb-3">
          <ReCAPTCHA
            sitekey="6Ld8HIYjAAAAALw437G-L_PF1PNrNZH4Qq76MvSU" // Use the provided reCAPTCHA key
            onChange={handleRecaptchaChange}
            ref={recaptchaRef} // Ref for the reCAPTCHA component
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
