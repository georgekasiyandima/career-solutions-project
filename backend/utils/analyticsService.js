const db = require('../database');

class AnalyticsService {
  // Get comprehensive dashboard analytics
  static async getDashboardAnalytics(period = '30d') {
    try {
      const dateFilter = this.getDateFilter(period);
      
      const [
        totalViews,
        uniqueSessions,
        totalClicks,
        totalBookings,
        totalEnquiries,
        totalUsers,
        conversionRate,
        topPages,
        topReferrers,
        deviceStats,
        viewsOverTime,
        bookingsOverTime,
        enquiriesOverTime,
        recentEvents
      ] = await Promise.all([
        this.getTotalViews(dateFilter),
        this.getUniqueSessions(dateFilter),
        this.getTotalClicks(dateFilter),
        this.getTotalBookings(dateFilter),
        this.getTotalEnquiries(dateFilter),
        this.getTotalUsers(dateFilter),
        this.getConversionRate(dateFilter),
        this.getTopPages(dateFilter),
        this.getTopReferrers(dateFilter),
        this.getDeviceStats(dateFilter),
        this.getViewsOverTime(dateFilter),
        this.getBookingsOverTime(dateFilter),
        this.getEnquiriesOverTime(dateFilter),
        this.getRecentEvents(10)
      ]);

      return {
        kpis: {
          totalViews,
          uniqueSessions,
          totalClicks,
          totalBookings,
          totalEnquiries,
          totalUsers,
          conversionRate
        },
        charts: {
          viewsOverTime,
          bookingsOverTime,
          enquiriesOverTime
        },
        tables: {
          topPages,
          topReferrers,
          deviceStats,
          recentEvents
        }
      };
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      throw error;
    }
  }

  // Get date filter based on period
  static getDateFilter(period) {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return startDate.toISOString();
  }

  // Get total page views
  static async getTotalViews(dateFilter) {
    const result = await db('analytics_events')
      .where('event_type', 'page_view')
      .andWhere('created_at', '>=', dateFilter)
      .count('id as count')
      .first();
    return parseInt(result.count);
  }

  // Get unique sessions
  static async getUniqueSessions(dateFilter) {
    const result = await db('analytics_events')
      .where('created_at', '>=', dateFilter)
      .distinct('session_id')
      .count('session_id as count')
      .first();
    return parseInt(result.count);
  }

  // Get total CTA clicks
  static async getTotalClicks(dateFilter) {
    const result = await db('analytics_events')
      .where('event_type', 'cta_click')
      .andWhere('created_at', '>=', dateFilter)
      .count('id as count')
      .first();
    return parseInt(result.count);
  }

  // Get total bookings
  static async getTotalBookings(dateFilter) {
    const result = await db('bookings')
      .where('created_at', '>=', dateFilter)
      .count('id as count')
      .first();
    return parseInt(result.count);
  }

  // Get total enquiries
  static async getTotalEnquiries(dateFilter) {
    const result = await db('enquiries')
      .where('created_at', '>=', dateFilter)
      .count('id as count')
      .first();
    return parseInt(result.count);
  }

  // Get total users
  static async getTotalUsers(dateFilter) {
    const result = await db('users')
      .where('created_at', '>=', dateFilter)
      .count('id as count')
      .first();
    return parseInt(result.count);
  }

  // Get conversion rate (bookings + enquiries / total views)
  static async getConversionRate(dateFilter) {
    const [totalViews, totalBookings, totalEnquiries] = await Promise.all([
      this.getTotalViews(dateFilter),
      this.getTotalBookings(dateFilter),
      this.getTotalEnquiries(dateFilter)
    ]);
    
    const totalConversions = totalBookings + totalEnquiries;
    return totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(2) : 0;
  }

  // Get top pages
  static async getTopPages(dateFilter, limit = 10) {
    return await db('analytics_events')
      .select(db.raw("json_extract(event_data, '$.path') as path"))
      .count('id as views')
      .where('event_type', 'page_view')
      .andWhere('created_at', '>=', dateFilter)
      .groupBy('path')
      .orderBy('views', 'desc')
      .limit(limit);
  }

  // Get top referrers
  static async getTopReferrers(dateFilter, limit = 10) {
    return await db('analytics_events')
      .select(db.raw("json_extract(event_data, '$.referrer') as referrer"))
      .count('id as visits')
      .where('event_type', 'page_view')
      .andWhere('created_at', '>=', dateFilter)
      .andWhere(db.raw("json_extract(event_data, '$.referrer')"), '!=', '')
      .groupBy('referrer')
      .orderBy('visits', 'desc')
      .limit(limit);
  }

  // Get device statistics
  static async getDeviceStats(dateFilter) {
    const results = await db('analytics_events')
      .select(db.raw("json_extract(event_data, '$.device') as device"))
      .count('id as count')
      .where('event_type', 'page_view')
      .andWhere('created_at', '>=', dateFilter)
      .groupBy('device')
      .orderBy('count', 'desc');

    return results.map(result => ({
      device: result.device || 'Unknown',
      count: parseInt(result.count)
    }));
  }

  // Get views over time
  static async getViewsOverTime(dateFilter) {
    return await db('analytics_events')
      .select(db.raw("strftime('%Y-%m-%d', created_at) as date"), db.raw('count(id) as views'))
      .where('event_type', 'page_view')
      .andWhere('created_at', '>=', dateFilter)
      .groupBy('date')
      .orderBy('date', 'asc');
  }

  // Get bookings over time
  static async getBookingsOverTime(dateFilter) {
    return await db('bookings')
      .select(db.raw("strftime('%Y-%m-%d', created_at) as date"), db.raw('count(id) as bookings'))
      .where('created_at', '>=', dateFilter)
      .groupBy('date')
      .orderBy('date', 'asc');
  }

  // Get enquiries over time
  static async getEnquiriesOverTime(dateFilter) {
    return await db('enquiries')
      .select(db.raw("strftime('%Y-%m-%d', created_at) as date"), db.raw('count(id) as enquiries'))
      .where('created_at', '>=', dateFilter)
      .groupBy('date')
      .orderBy('date', 'asc');
  }

  // Get recent events
  static async getRecentEvents(limit = 10) {
    return await db('analytics_events')
      .select('event_type', 'event_data', 'created_at', 'session_id')
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  // Get user engagement metrics
  static async getUserEngagement(dateFilter) {
    const [avgSessionDuration, bounceRate, pagesPerSession] = await Promise.all([
      this.getAverageSessionDuration(dateFilter),
      this.getBounceRate(dateFilter),
      this.getPagesPerSession(dateFilter)
    ]);

    return {
      avgSessionDuration,
      bounceRate,
      pagesPerSession
    };
  }

  // Get average session duration
  static async getAverageSessionDuration(dateFilter) {
    // This would require more complex session tracking
    // For now, return a placeholder
    return '00:02:30';
  }

  // Get bounce rate
  static async getBounceRate(dateFilter) {
    // This would require more complex session tracking
    // For now, return a placeholder
    return '45.2%';
  }

  // Get pages per session
  static async getPagesPerSession(dateFilter) {
    // This would require more complex session tracking
    // For now, return a placeholder
    return 2.8;
  }
}

module.exports = AnalyticsService; 