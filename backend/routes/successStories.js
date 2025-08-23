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

// GET /api/success-stories/stats - Fetch key statistics
router.get('/stats', async (req, res) => {
  try {
    // In a real application, these would be calculated dynamically.
    const stats = [
      {
        label: "Successfully Hired",
        value: 150,
        icon: "Person",
        description: "Dream jobs secured",
        trend: "+23% this year",
      },
      {
        label: "Interviews Conducted",
        value: 300,
        icon: "Work",
        description: "Professional interviews",
        trend: "+45% success rate",
      },
      {
        label: "Visa Approvals",
        value: 200,
        icon: "FlightTakeoff",
        description: "Overseas opportunities",
        trend: "98% approval rate",
      },
      {
        label: "Applications Submitted",
        value: 500,
        suffix: "+",
        icon: "Send",
        description: "Strategic applications",
        trend: "+67% response rate",
      },
    ];
    res.status(200).json(stats);
  } catch (err) {
    console.error('Database error in stats:', err);
    res.status(500).json({ message: 'An error occurred while fetching stats. Please try again.' });
  }
});

// GET /api/success-stories/timeline - Fetch the success timeline
router.get('/timeline', async (req, res) => {
  try {
    const timelineData = [
      {
        title: "Career Assessment",
        description: "Comprehensive skills and experience evaluation",
        icon: "Psychology",
        duration: "1-2 days",
      },
      {
        title: "Strategy Development",
        description: "Personalized job search and application strategy",
        icon: "School",
        duration: "3-5 days",
      },
      {
        title: "Application Process",
        description: "Targeted applications with optimized materials",
        icon: "BusinessCenter",
        duration: "1-2 weeks",
      },
      {
        title: "Interview Preparation",
        description: "Mock interviews and confidence building",
        icon: "Celebration",
        duration: "1 week",
      },
      {
        title: "Job Offer & Relocation",
        description: "Negotiation support and relocation assistance",
        icon: "RocketLaunch",
        duration: "2-4 weeks",
      },
    ];
    res.status(200).json(timelineData);
  } catch (err) {
    console.error('Database error in timeline:', err);
    res.status(500).json({ message: 'An error occurred while fetching timeline data. Please try again.' });
  }
});

module.exports = router;