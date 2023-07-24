// backend/routes/articleRoutes.js
const express = require('express');
const Article = require('../Models/Article');

const router = express.Router();

// Create a new article
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.userData.userId; // Retrieve the user ID from the authenticated user's token

    // Create a new article
    const article = new Article({
      title,
      content,
      author, // Assign the user ID as the author of the article
    });

    await article.save();
    return res.status(201).json(article);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Retrieve a specific article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    return res.status(200).json(article);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing article
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json(updatedArticle);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete an article
router.delete('/:id', async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json(deletedArticle);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
