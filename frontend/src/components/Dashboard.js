import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Dashboard = () => {
  const [userName, setUserName] = useState(''); // Declare userName using useState hook

  useEffect(() => {
    // Check if the toast has already been shown
    const isToastShown = localStorage.getItem('isToastShown');

    const fetchUserProfileData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          'http://localhost:5000/api/auth/profile', // Adjust the API endpoint as needed
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

   
        const { name } = response.data; // Assuming the response contains 'name' and 'email'
        setUserName(name);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch user profile data. Please try again.');
      }
    };

    // If the toast has not been shown yet, show it and set the flag in localStorage
    if (!isToastShown) {
      toast.success(`Welcome to your dashboard, ${userName}!`, {
        autoClose: 3000, // Close the toast after 3 seconds
      });

      localStorage.setItem('isToastShown', true);
    }
    fetchUserProfileData();
  }, [userName]); // Empty dependency array means this effect runs only once on component mount

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard, {userName}!</p>
    </div>
  );
};

export default Dashboard;
