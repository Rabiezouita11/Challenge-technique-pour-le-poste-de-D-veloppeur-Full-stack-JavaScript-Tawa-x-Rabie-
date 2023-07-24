
// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./Middleware/authMiddleware');
const authRoutes = require('./Routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to database:', err);
});


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Protect the article routes with the authMiddleware
app.use('/api/articles', authMiddleware, articleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
