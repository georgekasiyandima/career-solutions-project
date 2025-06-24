const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/success-stories - Fetch active success stories
router.get('/', async (req, res) => {
  try {
    const stories = await db('success_stories')
      .select('id', 'name', 'role', 'company', 'testimonial', 'photo_url', 'hired_date')
      .where({ is_active: true })
      .orderBy('hired_date', 'desc');
    res.status(200).json(stories);
  } catch (err) {
    console.error('Database error in success stories:', err);
    res.status(500).json({ message: 'An error occurred while fetching success stories. Please try again.' });
  }
});

module.exports = router;