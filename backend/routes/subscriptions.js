const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', async (req, res) => {
  console.log('Received subscription request:', req.body);
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    const existingSubscription = await db('subscriptions').where({ email }).first();
    if (existingSubscription) {
      return res.status(400).json({ message: 'You are already subscribed!' });
    }

    await db('subscriptions').insert({
      email,
      created_at: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Thank you for subscribing to our newsletter!' });
  } catch (err) {
    console.error('Database error in subscriptions:', err);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

module.exports = router;