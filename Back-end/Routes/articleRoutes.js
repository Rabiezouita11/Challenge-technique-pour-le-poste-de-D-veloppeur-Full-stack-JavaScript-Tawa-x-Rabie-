const express = require('express');
const router = express.Router();
const Article = require('../Models/article');

// Route to create a new article
router.post('/articles', async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = new Article({ title, content });
    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the article' });
  }
});

// Route to get all articles
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
});

// Route to get a specific article by ID
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the article' });
  }
});

// Route to update an article by ID
router.put('/articles/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the article' });
  }
});

// Route to delete an article by ID
router.delete('/articles/:id', async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the article' });
  }
});

module.exports = router;
