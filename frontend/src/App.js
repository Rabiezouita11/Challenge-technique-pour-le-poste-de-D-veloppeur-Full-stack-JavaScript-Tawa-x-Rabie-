import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Auth/login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
// import jwtDecode from 'jwt-decode'; // Import the jwt-decode library
import React from 'react';

import ArticleList from './components/ArticleList';
import Profile from './components/Profile'; // Import the Profile component

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function App() {
  // Check for the user token in local storage during initial rendering
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      if (token ) {
        // const decodedToken = jwtDecode(token);
        setLoggedIn(true);
        setUserName(name);
        // setUserEmail(decodedToken.email);


      }
    };

    checkLoginStatus();
    
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const exp = tokenData.exp; // Expiration time in Unix timestamp format (seconds since epoch)
          if (Date.now() >= exp * 1000) {
            // Token has expired, remove it from localStorage and set logged in to false
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            setLoggedIn(false);
            
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    checkTokenExpiration();



    // Check if user is already logged in and get the user's name from local storage

  }, []);

  const handleLogout = () => {
    // Logic to handle user logout, e.g., clearing token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('isToastShown');
    setLoggedIn(false);
  };

  return (
    <div>
      {/* Your existing navigation bar */}
      <Navbar bg="light" expand="lg">
        <div className="container">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {loggedIn && <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>}
              {loggedIn && <Nav.Link as={Link} to="/">Articles</Nav.Link>}
            </Nav>
            {loggedIn ? (
              <NavDropdown title={userName} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav>
                <Nav.Link as={Link} to="/login" >Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </div>
      </Navbar>

      {/* Your existing Routes code */}
      <Routes>
        {/* Public routes accessible to all users */}
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes accessible only to authenticated users */}
        {loggedIn ? (
          <>
            <Route path="/" element={<ArticleList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
