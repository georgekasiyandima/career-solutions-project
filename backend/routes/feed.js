const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/feed - Fetch active feed posts
router.get('/', async (req, res) => {
  try {
    const posts = await db('feed_posts')
      .select('*')
      .where({ is_active: true })
      .orderBy('created_at', 'desc');
    res.json(posts);
  } catch (err) {
    console.error('Database error in feed:', err);
    res.status(500).json({ message: 'Error fetching feed posts' });
  }
});

// POST /api/feed - Create a new feed post
router.post('/', async (req, res) => {
  try {
    const { type, content, link, image_url } = req.body;

    if (!type || !content) {
      return res.status(400).json({ message: 'Type and content are required.' });
    }

    const [newPost] = await db('feed_posts')
      .insert({
        type,
        content,
        link: link || null,
        image_url: image_url || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('*');

    res.status(201).json({ message: 'Feed post created successfully.', post: newPost });
  } catch (err) {
    console.error('Database error in feed POST:', err);
    res.status(500).json({ message: 'Error creating feed post' });
  }
});

// PUT /api/feed/:id - Update a feed post (for admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, content, link, image_url, is_active } = req.body;

    // Validation
    if (!type || !content) {
      return res.status(400).json({ message: 'Type and content are required.' });
    }

    // Update in database
    const [updatedPost] = await db('feed_posts')
      .where({ id })
      .update({
        type,
        content,
        link: link || null,
        image_url: image_url || null,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .returning(['id', 'type', 'content', 'link', 'image_url', 'is_active', 'created_at', 'updated_at']);

    if (!updatedPost) {
      return res.status(404).json({ message: 'Feed post not found.' });
    }

    res.json({ 
      message: 'Feed post updated successfully.', 
      post: updatedPost 
    });
  } catch (err) {
    console.error('Database error in feed PUT:', err);
    res.status(500).json({ message: 'An error occurred while updating the feed post. Please try again.' });
  }
});

// DELETE /api/feed/:id - Delete a feed post (for admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await db('feed_posts')
      .where({ id })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Feed post not found.' });
    }

    res.json({ message: 'Feed post deleted successfully.' });
  } catch (err) {
    console.error('Database error in feed DELETE:', err);
    res.status(500).json({ message: 'An error occurred while deleting the feed post. Please try again.' });
  }
});

module.exports = router; 