import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  // Get the user's name from local storage
  const userName = localStorage.getItem('name');

  useEffect(() => {
    // Check if the toast has already been shown
    const isToastShown = localStorage.getItem('isToastShown');

    // If the toast has not been shown yet, show it and set the flag in localStorage
    if (!isToastShown) {
      toast.success(`Welcome to your dashboard, ${userName}!`, {
        autoClose: 3000, // Close the toast after 3 seconds
      });

      localStorage.setItem('isToastShown', true);
    }
  }, [userName]);

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard, {userName}!</p>
    </div>
  );
};

export default Dashboard;
