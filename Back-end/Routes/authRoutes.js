// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');

// User registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, lat, lng } = req.body;
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      lng, // Make sure the lat and lng values are being passed correctly here
      lat,
    });

    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token with the user's ID and name
    const token = jwt.sign({ userId: user._id, name: user.name  , email: user.email}, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token, name: user.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});



router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Get the user ID from req.userData
    const userId = req.userData.userId;

    // Find the user in the database based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile data in the response
    return res.status(200).json({ name: user.name, email: user.email   , lat: user.lat, lng: user.lng});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { userId } = req.body;
    const { name, email } = req.body; // You can include other profile fields here

    // Update the user in the database
    await User.findByIdAndUpdate(userId, { name, email });

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Hash the new password before updating it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete user account
router.delete('/delete-account', async (req, res) => {
  try {
    const { userId } = req.body;

    // Find and delete the user in the database
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;
