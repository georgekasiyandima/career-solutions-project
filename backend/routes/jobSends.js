const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/job-sends - Fetch job send logs with optional filters and pagination
router.get('/', async (req, res) => {
  const { client_id, job_id, channel, date, limit = 20, offset = 0 } = req.query;
  try {
    let baseQuery = db('job_sends')
      .join('jobs', 'job_sends.job_id', 'jobs.id')
      .join('clients', 'job_sends.client_id', 'clients.id')
      .select(
        'job_sends.id',
        'job_sends.sent_at',
        'job_sends.channel',
        'jobs.title as job_title',
        'jobs.id as job_id',
        'clients.name as client_name',
        'clients.email',
        'clients.phone',
        'clients.id as client_id'
      );

    if (client_id) baseQuery = baseQuery.where('clients.id', client_id);
    if (job_id) baseQuery = baseQuery.where('jobs.id', job_id);
    if (channel) baseQuery = baseQuery.where('job_sends.channel', channel);
    if (date) baseQuery = baseQuery.whereRaw('date(job_sends.sent_at) = ?', [date]);

    // Clone for count
    const countQuery = baseQuery.clone().clearSelect().count({ total: 'job_sends.id' }).first();
    const total = (await countQuery).total;

    // Pagination
    const logs = await baseQuery.orderBy('job_sends.sent_at', 'desc').limit(limit).offset(offset);
    res.json({ logs, total: Number(total) });
  } catch (err) {
    console.error('Error fetching job send logs:', err);
    res.status(500).json({ message: 'Error fetching job send logs.' });
  }
});

// GET /api/job-sends/stats - Get job send statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalSends] = await db('job_sends').count('* as count');
    const [todaySends] = await db('job_sends')
      .whereRaw('date(sent_at) = date(?)', [new Date()])
      .count('* as count');
    
    const channelStats = await db('job_sends')
      .select('channel')
      .count('* as count')
      .groupBy('channel');

    const recentSends = await db('job_sends')
      .join('jobs', 'job_sends.job_id', 'jobs.id')
      .join('clients', 'job_sends.client_id', 'clients.id')
      .select(
        'job_sends.sent_at',
        'jobs.title as job_title',
        'clients.name as client_name',
        'job_sends.channel'
      )
      .orderBy('job_sends.sent_at', 'desc')
      .limit(10);

    res.json({
      totalSends: totalSends.count,
      todaySends: todaySends.count,
      channelStats,
      recentSends
    });
  } catch (err) {
    console.error('Error fetching job send stats:', err);
    res.status(500).json({ message: 'Error fetching job send statistics.' });
  }
});

module.exports = router;