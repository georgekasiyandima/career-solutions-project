const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /api/track - Log a tracking event
router.post('/', async (req, res) => {
  try {
    const { event_type, event_data } = req.body;
    const user_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!event_type) {
      return res.status(400).json({ message: 'Event type is required.' });
    }

    await db('tracking_events').insert({
      event_type,
      event_data: event_data ? JSON.stringify(event_data) : null,
      user_ip,
      created_at: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Event tracked successfully.' });
  } catch (err) {
    console.error('Database error in track:', err);
    res.status(500).json({ message: 'An error occurred while tracking the event.' });
  }
});

module.exports = router;