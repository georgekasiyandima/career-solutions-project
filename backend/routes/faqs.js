const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/faqs - Fetch all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await db('faqs').select('id', 'question', 'answer').orderBy('id', 'asc');
    res.json(faqs);
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
});

module.exports = router; 