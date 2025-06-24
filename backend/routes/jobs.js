const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/jobs - Fetch all active jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await db('jobs')
      .select('id', 'title', 'company', 'location', 'description', 'job_type', 'category', 'created_at')
      .where({ is_active: true })
      .orderBy('created_at', 'desc');
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Database error in jobs:', err);
    res.status(500).json({ message: 'An error occurred while fetching jobs. Please try again.' });
  }
});

// GET /api/jobs/:id - Fetch a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await db('jobs')
      .select('id', 'title', 'company', 'location', 'description', 'job_type', 'category', 'created_at')
      .where({ id, is_active: true })
      .first();
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error('Database error in job details:', err);
    res.status(500).json({ message: 'An error occurred while fetching job details. Please try again.' });
  }
});

module.exports = router;