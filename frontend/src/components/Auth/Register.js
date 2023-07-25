import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const recaptchaRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all the required fields.');

      if (!name) nameInputRef.current.focus();
      else if (!email) emailInputRef.current.focus();
      else if (!password) passwordInputRef.current.focus();

      return;
    }

    try {
      if (!recaptchaToken) {
        toast.error('Please complete the reCAPTCHA verification.');
        return;
      }

      // Get user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error(error);
            toast.error('Failed to get geolocation. Please try again.');
          }
        );
      } else {
        toast.error('Geolocation is not supported by your browser.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const registerUser = async () => {
      try {
        // Make the registration API call with geolocation data
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name,
          email,
          password,
          lat: latitude,
          lng: longitude,
        });

        if (response.status === 201) {
          toast.success('Registration successful! You can now login.');
          setName('');
          setEmail('');
          setPassword('');
          setRecaptchaToken('');
          setLatitude(0);
          setLongitude(0);
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          toast.error('An account with this email already exists. Please login instead.');
        } else {
          toast.error('An error occurred. Please try again.');
        }
      }
    };

    if (latitude !== 0 && longitude !== 0) {
      registerUser();
    }
  }, [name, email, password, latitude, longitude]);

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
            sitekey="6Ld8HIYjAAAAALw437G-L_PF1PNrNZH4Qq76MvSU" // Replace with your reCAPTCHA site key
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
