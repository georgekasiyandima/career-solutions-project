const express = require('express');
const router = express.Router();
const db = require('../database');
const AnalyticsService = require('../utils/analyticsService');
const { optionalAuth, authenticateToken, authorizeRole } = require('../middleware/auth');

// POST /api/analytics/track
// This endpoint uses optional authentication to link events to a user if they are logged in,
// but still allows tracking for anonymous users.
router.post('/track', optionalAuth, async (req, res) => {
  try {
    const { event_type, event_data, session_id } = req.body;

    // Basic validation
    if (!event_type || !event_data || !session_id) {
      return res.status(400).json({ message: 'event_type, event_data, and session_id are required.' });
    }

    const event = {
      event_type,
      event_data: JSON.stringify(event_data),
      session_id,
      user_id: req.user ? req.user.id : null, // req.user is attached by optionalAuth if logged in
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
    };

    await db('analytics_events').insert(event);

    res.status(201).json({ message: 'Event tracked successfully.' });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ message: 'Failed to track event.' });
  }
});

// GET /api/analytics/summary
// Fetches aggregated analytics data for the dashboard. Protected admin route.
router.get('/summary', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const analytics = await AnalyticsService.getDashboardAnalytics(period);
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics summary.' });
  }
});

// GET /api/analytics/kpis
// Get key performance indicators
router.get('/kpis', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const dateFilter = AnalyticsService.getDateFilter(period);
    
    const [
      totalViews,
      uniqueSessions,
      totalClicks,
      totalBookings,
      totalEnquiries,
      totalUsers,
      conversionRate
    ] = await Promise.all([
      AnalyticsService.getTotalViews(dateFilter),
      AnalyticsService.getUniqueSessions(dateFilter),
      AnalyticsService.getTotalClicks(dateFilter),
      AnalyticsService.getTotalBookings(dateFilter),
      AnalyticsService.getTotalEnquiries(dateFilter),
      AnalyticsService.getTotalUsers(dateFilter),
      AnalyticsService.getConversionRate(dateFilter)
    ]);

    res.status(200).json({
      totalViews,
      uniqueSessions,
      totalClicks,
      totalBookings,
      totalEnquiries,
      totalUsers,
      conversionRate
    });
  } catch (error) {
    console.error('KPIs error:', error);
    res.status(500).json({ message: 'Failed to fetch KPIs.' });
  }
});

// GET /api/analytics/charts
// Get chart data for visualizations
router.get('/charts', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const dateFilter = AnalyticsService.getDateFilter(period);
    
    const [viewsOverTime, bookingsOverTime, enquiriesOverTime] = await Promise.all([
      AnalyticsService.getViewsOverTime(dateFilter),
      AnalyticsService.getBookingsOverTime(dateFilter),
      AnalyticsService.getEnquiriesOverTime(dateFilter)
    ]);

    res.status(200).json({
      viewsOverTime,
      bookingsOverTime,
      enquiriesOverTime
    });
  } catch (error) {
    console.error('Charts error:', error);
    res.status(500).json({ message: 'Failed to fetch chart data.' });
  }
});

// GET /api/analytics/tables
// Get table data for detailed views
router.get('/tables', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const dateFilter = AnalyticsService.getDateFilter(period);
    
    const [topPages, topReferrers, deviceStats, recentEvents] = await Promise.all([
      AnalyticsService.getTopPages(dateFilter),
      AnalyticsService.getTopReferrers(dateFilter),
      AnalyticsService.getDeviceStats(dateFilter),
      AnalyticsService.getRecentEvents(10)
    ]);

    res.status(200).json({
      topPages,
      topReferrers,
      deviceStats,
      recentEvents
    });
  } catch (error) {
    console.error('Tables error:', error);
    res.status(500).json({ message: 'Failed to fetch table data.' });
  }
});

// GET /api/analytics/engagement
// Get user engagement metrics
router.get('/engagement', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const dateFilter = AnalyticsService.getDateFilter(period);
    const engagement = await AnalyticsService.getUserEngagement(dateFilter);
    res.status(200).json(engagement);
  } catch (error) {
    console.error('Engagement error:', error);
    res.status(500).json({ message: 'Failed to fetch engagement metrics.' });
  }
});

// GET /api/analytics/export
// Export analytics data for reporting
router.get('/export', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const format = req.query.format || 'json';
    
    if (format === 'csv') {
      // TODO: Implement CSV export
      res.status(501).json({ message: 'CSV export not yet implemented.' });
      return;
    }
    
    const analytics = await AnalyticsService.getDashboardAnalytics(period);
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Failed to export analytics data.' });
  }
});

module.exports = router;