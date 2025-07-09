const express = require('express');
const router = express.Router();

// Basic security endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Security endpoint' });
});

module.exports = router;




