import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
const Dashboard = () => {
  const [userName, setUserName] = useState(''); // Declare userName using useState hook
  const [userLocation, setUserLocation] = useState(null); // Store the user's location data

  useEffect(() => {
    // Check if the toast has already been shown
   

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

        const { name } = response.data; // Assuming the response contains 'name'
        setUserName(name);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch user profile data. Please try again.');
      }
    };

    // If the toast has not been shown yet, show it and set the flag in localStorage


    // Fetch the user's location data
    fetchUserProfileData();
    getUserLocation();
  }, []); // Empty dependency array means this effect runs only once on component mount
  useEffect(() => {
    const isToastShown = localStorage.getItem('isToastShown');
    // When the userName state is updated, show the toast
    if (!isToastShown&&userName) {
      toast.success(`Welcome to your dashboard, ${userName}!`, {
        autoClose: 3000, // Close the toast after 3 seconds
      });

      localStorage.setItem('isToastShown', true);
    }
  }, [userName]);
  const getUserLocation = () => {
    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
          toast.error('Failed to get geolocation. Please try again.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div>
    <ToastContainer position="top-center" autoClose={3000} />
    <div style={{ textAlign: 'center', marginTop: '30px' }} className="dashboard-header">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Welcome to your Dashboard, {userName}!</h2>
        <p style={{ fontSize: '18px', color: '#888' }}>Your current location:</p>
      </div>
    {userLocation && (
              <div style={{ marginTop: '20px', borderRadius: '10px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }} className="map-container">

      <MapContainer
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={13}
      style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={[userLocation.latitude, userLocation.longitude]}>
          <Popup>You are here!</Popup>
        </Marker>
      </MapContainer>
            </div>
    )}
  </div>
);
};

export default Dashboard;
