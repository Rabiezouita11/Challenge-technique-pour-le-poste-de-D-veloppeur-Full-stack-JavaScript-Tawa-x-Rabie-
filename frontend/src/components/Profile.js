import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    useEffect(() => {
        // Function to retrieve user data from the token
        const getUserDataFromToken = () => {
          // Get the token from localStorage or from an API response
          const token = localStorage.getItem('token');
    
          // Decoding the token to get the user data
          // Here, I'm assuming the token is a JSON object containing user data
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const name = tokenData.name;
            const email = tokenData.email;
    
            setUserName(name);
            setUserEmail(email);
          } catch (error) {
            console.error('Error decoding token:', error);
          }
        };
    
        getUserDataFromToken();
      }, []);
    
  return (
    <div className="container rounded bg-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              className="rounded-circle mt-5"
              width="150px"
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Profile Avatar"
            />
            <span className="font-weight-bold">{userName}</span>
            <span className="text-black-50">{userEmail}</span>
            <span> </span>
          </div>
        </div>
        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Profile Settings</h4>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="labels">Name</label>
                <input type="text" className="form-control" placeholder="first name" value={userName} />
              </div>
           
              <div className="col-md-12">
                <label className="labels">email</label>
                <input type="text" className="form-control" value={userEmail} placeholder="email" />
              </div>
            </div>
            {/* Add more form inputs for other profile settings */}
            {/* ... */}
            <div className="mt-5 text-center">
              <button className="btn btn-primary profile-button" type="button">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Profile;
