import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from react-bootstrap
import ConfirmationModal from '../utils/ConfirmationModal'; // Import the ConfirmationModal component
import { useNavigate } from 'react-router-dom';

const Profile = ({ handleLogout , onUpdateUserName   }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false); // State to manage the Delete Account modal
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to retrieve user data from the token
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


        const { name, email } = response.data; // Assuming the response contains 'name' and 'email'
        setUserName(name);
        setUserEmail(email);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch user profile data. Please try again.');
      }
    };

    fetchUserProfileData();
  }, []);

  // Function to handle updating the profile
  // ... (previous code)
  const handleNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };
  // Function to handle updating the profile
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.userId;

      const response = await axios.put(
        'http://localhost:5000/api/auth/profile', // Adjust the API endpoint as needed
        { userId, name: userName, email: userEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdateUserName(userName);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile. Please try again.');
    }
  };
  // ... (remaining code)


  // Function to handle changing the password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;

    try {
      const token = localStorage.getItem('token');
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.userId; // Retrieve userId from the decoded token

      const response = await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { userId, currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setShowChangePasswordModal(false); // Close the modal after changing the password
    } catch (error) {
      console.error(error);
      toast.error('Failed to change password. Please try again.');
    }
  };


  // Function to handle deleting the account
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.userId; // Retrieve userId from the decoded token

      const response = await axios.delete(
        'http://localhost:5000/api/auth/delete-account', // Adjust the API endpoint as needed
        {
          data: { userId }, // Pass the userId in the request body
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.clear();
      handleLogout(false);
      navigate('/login');

      toast.success(response.data.message);

    } catch (error) {
      console.error(error);
      toast.error('Failed to delete account. Please try again.');
    }
  };
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="first name"
                  value={userName}
                  onChange={handleNameChange} // Add onChange handler to update the name state
                />
              </div>

              <div className="col-md-12">
                <label className="labels">Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={userEmail}
                  placeholder="email"
                  onChange={handleEmailChange} // Add onChange handler to update the email state
                />
              </div>
            </div>
            <div className="mt-5 text-center d-flex justify-content-between">
              <button className="btn btn-primary profile-button" type="button" onClick={handleUpdateProfile}>
                Save Profile
              </button>
              <button className="btn btn-danger profile-button mx-2" type="button" onClick={() => setShowChangePasswordModal(true)}>
                Change Password
              </button>
              <button className="btn btn-danger profile-button" type="button" onClick={() => setShowDeleteAccountModal(true)}>
                Delete Account
              </button>
            </div>

          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />


      {/* Add ToastContainer to show toast notifications */}


      {/* Change Password Modal */}
      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
        <form onSubmit={handleChangePassword}>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input type="password" className="form-control" id="currentPassword" required />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input type="password" className="form-control" id="newPassword" required />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowChangePasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Password
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <ConfirmationModal
        show={showDeleteAccountModal}
        onHide={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
        message="Are you sure you want to delete your account?"
      />
    </div>
  );
};

export default Profile;
