const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// Route for user registration
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the username and email are not already in use
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ error: "Username or email already in use." });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error." });
    }
});

// User login route

  
// Protected route using JWT authentication
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'You have accessed a protected route!' });
});
// User login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        // If there is an error during authentication, call next with the error to handle it
        return next(err);
      }
      if (!user) {
        // If user is not found, return an error response
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // If authentication is successful, generate and return the JWT token
      req.login(user, { session: false }, async (err) => {
        if (err) {
          return next(err);
        }
  
        // Add additional data to the JWT payload, such as email and username
        const tokenPayload = {
          sub: user._id,
          email: user.email,
          username: user.username,
        };
  
        const token = jwt.sign(tokenPayload, process.env.SECRET_KEY); // Replace this with your secret key
        return res.json({ token });
      });
    })(req, res, next);
  });
  
module.exports = router;
