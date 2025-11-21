const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /api/analytics/business - Track business events
router.post('/business', async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      serviceCategory,
      clientEmail,
      countryOfOrigin,
      enquiryType,
      conversionStage,
      revenue,
      source,
      targetRole,
      targetIndustry,
      targetCountry,
      demographics,
    } = req.body;

    // Insert analytics event
    const [analytics] = await db('business_analytics')
      .insert({
        service_id: serviceId || null,
        service_name: serviceName || null,
        service_category: serviceCategory || null,
        client_email: clientEmail || null,
        country_of_origin: countryOfOrigin || null,
        enquiry_type: enquiryType || null,
        conversion_stage: conversionStage || null,
        converted: conversionStage === 'payment' || conversionStage === 'completion',
        revenue: revenue ? parseFloat(revenue) : null,
        source: source || 'website',
        target_role: targetRole || null,
        target_industry: targetIndustry || null,
        target_country: targetCountry || null,
        demographics: demographics ? JSON.stringify(demographics) : null,
        event_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .returning('*');

    res.status(201).json({
      message: 'Analytics event tracked successfully',
      analytics: analytics,
    });
  } catch (err) {
    console.error('Error tracking analytics:', err);
    res.status(500).json({
      message: 'Error tracking analytics event',
      error: err.message,
    });
  }
});

// GET /api/analytics/business - Get business analytics
router.get('/business', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      serviceCategory,
      countryOfOrigin,
      conversionStage,
      groupBy = 'day',
    } = req.query;

    let query = db('business_analytics').select('*');

    if (startDate) {
      query = query.where('event_date', '>=', startDate);
    }
    if (endDate) {
      query = query.where('event_date', '<=', endDate);
    }
    if (serviceCategory) {
      query = query.where('service_category', serviceCategory);
    }
    if (countryOfOrigin) {
      query = query.where('country_of_origin', countryOfOrigin);
    }
    if (conversionStage) {
      query = query.where('conversion_stage', conversionStage);
    }

    const analytics = await query.orderBy('event_date', 'desc');

    // Parse JSON fields
    analytics.forEach(item => {
      if (item.demographics) {
        try {
          item.demographics = JSON.parse(item.demographics);
        } catch (e) {
          item.demographics = null;
        }
      }
    });

    // Calculate summary statistics
    const summary = {
      totalEnquiries: analytics.filter(a => a.enquiry_type === 'initial_enquiry').length,
      totalServiceSelections: analytics.filter(a => a.enquiry_type === 'service_selected').length,
      totalPayments: analytics.filter(a => a.enquiry_type === 'payment_made').length,
      totalCompletions: analytics.filter(a => a.enquiry_type === 'service_completed').length,
      totalRevenue: analytics.reduce((sum, a) => sum + (parseFloat(a.revenue) || 0), 0),
      conversionRate: analytics.length > 0
        ? ((analytics.filter(a => a.converted).length / analytics.length) * 100).toFixed(2)
        : 0,
      topServices: getTopServices(analytics),
      topCountries: getTopCountries(analytics),
      topSources: getTopSources(analytics),
    };

    res.json({
      analytics,
      summary,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({
      message: 'Error fetching analytics',
      error: err.message,
    });
  }
});

// Helper functions
function getTopServices(analytics) {
  const serviceCounts = {};
  analytics.forEach(item => {
    if (item.service_name) {
      serviceCounts[item.service_name] = (serviceCounts[item.service_name] || 0) + 1;
    }
  });
  return Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function getTopCountries(analytics) {
  const countryCounts = {};
  analytics.forEach(item => {
    if (item.country_of_origin) {
      countryCounts[item.country_of_origin] = (countryCounts[item.country_of_origin] || 0) + 1;
    }
  });
  return Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));
}

function getTopSources(analytics) {
  const sourceCounts = {};
  analytics.forEach(item => {
    if (item.source) {
      sourceCounts[item.source] = (sourceCounts[item.source] || 0) + 1;
    }
  });
  return Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({ source, count }));
}

module.exports = router;

