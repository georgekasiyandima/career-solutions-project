const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await db('success_stories')
      .select('id', 'name', 'role', 'company', 'testimonial as quote', 'photo_url as avatar')
      .where('is_featured', true)
      .orderBy('created_at', 'desc')
      .limit(6);
    
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

module.exports = router; 