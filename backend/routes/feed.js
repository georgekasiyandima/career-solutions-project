const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/feed - Fetch active feed posts
router.get('/', async (req, res) => {
  try {
    const posts = await db('feed_posts')
      .select('id', 'type', 'content', 'link', 'created_at')
      .where({ is_active: true })
      .orderBy('created_at', 'desc');
    res.status(200).json(posts);
  } catch (err) {
    console.error('Database error in feed:', err);
    res.status(500).json({ message: 'An error occurred while fetching feed posts. Please try again.' });
  }
});

module.exports = router;