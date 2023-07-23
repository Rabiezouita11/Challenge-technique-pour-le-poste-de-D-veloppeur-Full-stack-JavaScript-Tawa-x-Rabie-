const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const { isAuthenticated } = require('../Middleware/auth'); // Import the authentication middleware

// Route to create a new article
router.post('/articles', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log(req.user);
    const author = req.user._id; // Assuming you have implemented user authentication
    const article = new Article({ title, content, author });
    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the article' });
  }
});

// Rest of the routes remain the same
// ...

module.exports = router;
