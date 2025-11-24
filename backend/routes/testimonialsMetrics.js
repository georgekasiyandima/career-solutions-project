const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/testimonials-metrics - Get all testimonials with metrics
router.get('/', async (req, res) => {
  try {
    const { status, is_featured, is_approved, limit = 50, offset = 0 } = req.query;
    
    let query = db('testimonials_metrics').select('*');

    if (status) {
      query = query.where('status', status);
    }
    if (is_featured !== undefined) {
      query = query.where('is_featured', is_featured === 'true');
    }
    if (is_approved !== undefined) {
      query = query.where('is_approved', is_approved === 'true');
    }

    const testimonials = await query
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Error fetching testimonials', error: err.message });
  }
});

// GET /api/testimonials-metrics/stats - Get aggregated statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalTestimonials: 0,
      featuredTestimonials: 0,
      approvedTestimonials: 0,
      totalInterviewsGranted: 0,
      totalOffersReceived: 0,
      totalOffersAccepted: 0,
      totalOnboarded: 0,
      interviewSuccessRate: 0,
      offerAcceptanceRate: 0,
      onboardingRate: 0,
      averageDaysToInterview: 0,
      averageDaysToOffer: 0,
      averageDaysToOnboarding: 0,
      topCompanies: [],
      topJobTitles: [],
      topCountries: [],
      serviceTypeBreakdown: {},
    };

    const allTestimonials = await db('testimonials_metrics').select('*');
    
    if (allTestimonials.length > 0) {
      stats.totalTestimonials = allTestimonials.length;
      stats.featuredTestimonials = allTestimonials.filter(t => t.is_featured).length;
      stats.approvedTestimonials = allTestimonials.filter(t => t.is_approved).length;
      
      stats.totalInterviewsGranted = allTestimonials.reduce((sum, t) => sum + (t.interviews_granted || 0), 0);
      stats.totalOffersReceived = allTestimonials.reduce((sum, t) => sum + (t.offers_received || 0), 0);
      stats.totalOffersAccepted = allTestimonials.filter(t => t.offers_accepted > 0).length;
      stats.totalOnboarded = allTestimonials.filter(t => t.onboarded).length;
      
      // Calculate rates
      const withInterviews = allTestimonials.filter(t => t.interviews_granted > 0).length;
      stats.interviewSuccessRate = withInterviews > 0 
        ? ((stats.totalOffersReceived / stats.totalInterviewsGranted) * 100).toFixed(2)
        : 0;
      
      stats.offerAcceptanceRate = stats.totalOffersReceived > 0
        ? ((stats.totalOffersAccepted / stats.totalOffersReceived) * 100).toFixed(2)
        : 0;
      
      stats.onboardingRate = stats.totalOffersAccepted > 0
        ? ((stats.totalOnboarded / stats.totalOffersAccepted) * 100).toFixed(2)
        : 0;
      
      // Calculate averages
      const daysToInterview = allTestimonials
        .filter(t => t.days_to_first_interview)
        .map(t => t.days_to_first_interview);
      stats.averageDaysToInterview = daysToInterview.length > 0
        ? (daysToInterview.reduce((a, b) => a + b, 0) / daysToInterview.length).toFixed(1)
        : 0;
      
      const daysToOffer = allTestimonials
        .filter(t => t.days_to_offer)
        .map(t => t.days_to_offer);
      stats.averageDaysToOffer = daysToOffer.length > 0
        ? (daysToOffer.reduce((a, b) => a + b, 0) / daysToOffer.length).toFixed(1)
        : 0;
      
      const daysToOnboarding = allTestimonials
        .filter(t => t.days_to_onboarding)
        .map(t => t.days_to_onboarding);
      stats.averageDaysToOnboarding = daysToOnboarding.length > 0
        ? (daysToOnboarding.reduce((a, b) => a + b, 0) / daysToOnboarding.length).toFixed(1)
        : 0;
      
      // Top companies
      const companyCounts = {};
      allTestimonials.forEach(t => {
        if (t.company_name) {
          companyCounts[t.company_name] = (companyCounts[t.company_name] || 0) + 1;
        }
      });
      stats.topCompanies = Object.entries(companyCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));
      
      // Top job titles
      const jobTitleCounts = {};
      allTestimonials.forEach(t => {
        if (t.job_title) {
          jobTitleCounts[t.job_title] = (jobTitleCounts[t.job_title] || 0) + 1;
        }
      });
      stats.topJobTitles = Object.entries(jobTitleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([title, count]) => ({ title, count }));
      
      // Top countries
      const countryCounts = {};
      allTestimonials.forEach(t => {
        if (t.job_country) {
          countryCounts[t.job_country] = (countryCounts[t.job_country] || 0) + 1;
        }
      });
      stats.topCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([country, count]) => ({ country, count }));
      
      // Service type breakdown
      const serviceTypeCounts = {};
      allTestimonials.forEach(t => {
        if (t.service_type) {
          serviceTypeCounts[t.service_type] = (serviceTypeCounts[t.service_type] || 0) + 1;
        }
      });
      stats.serviceTypeBreakdown = serviceTypeCounts;
    }

    res.json(stats);
  } catch (err) {
    console.error('Error fetching testimonial stats:', err);
    res.status(500).json({ message: 'Error fetching statistics', error: err.message });
  }
});

// POST /api/testimonials-metrics - Create new testimonial with metrics
router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientCountry,
      serviceType,
      serviceId,
      interviewsGranted,
      offersReceived,
      offersAccepted,
      onboarded,
      onboardingDate,
      jobTitle,
      companyName,
      jobLocation,
      jobCountry,
      salaryOffered,
      currency,
      serviceCompletedDate,
      firstInterviewDate,
      offerReceivedDate,
      startDate,
      testimonial,
      rating,
      isFeatured,
      photoUrl,
    } = req.body;

    // Calculate days
    let daysToFirstInterview = null;
    let daysToOffer = null;
    let daysToOnboarding = null;
    
    if (serviceCompletedDate && firstInterviewDate) {
      const serviceDate = new Date(serviceCompletedDate);
      const interviewDate = new Date(firstInterviewDate);
      daysToFirstInterview = Math.ceil((interviewDate - serviceDate) / (1000 * 60 * 60 * 24));
    }
    
    if (firstInterviewDate && offerReceivedDate) {
      const interviewDate = new Date(firstInterviewDate);
      const offerDate = new Date(offerReceivedDate);
      daysToOffer = Math.ceil((offerDate - interviewDate) / (1000 * 60 * 60 * 24));
    }
    
    if (offerReceivedDate && onboardingDate) {
      const offerDate = new Date(offerReceivedDate);
      const onboardDate = new Date(onboardingDate);
      daysToOnboarding = Math.ceil((onboardDate - offerDate) / (1000 * 60 * 60 * 24));
    }
    
    // Calculate success score (weighted metric)
    let successScore = 0;
    if (interviewsGranted > 0) successScore += 20;
    if (offersReceived > 0) successScore += 30;
    if (offersAccepted > 0) successScore += 30;
    if (onboarded) successScore += 20;
    if (rating) successScore += rating * 2; // Up to 10 points for rating

    const [newTestimonial] = await db('testimonials_metrics')
      .insert({
        client_name: clientName,
        client_email: clientEmail || null,
        client_phone: clientPhone || null,
        client_country: clientCountry || null,
        service_type: serviceType || null,
        service_id: serviceId || null,
        interviews_granted: interviewsGranted || 0,
        offers_received: offersReceived || 0,
        offers_accepted: offersAccepted || 0,
        onboarded: onboarded || false,
        onboarding_date: onboardingDate || null,
        job_title: jobTitle || null,
        company_name: companyName || null,
        job_location: jobLocation || null,
        job_country: jobCountry || null,
        salary_offered: salaryOffered ? parseFloat(salaryOffered) : null,
        currency: currency || 'ZAR',
        service_completed_date: serviceCompletedDate || null,
        first_interview_date: firstInterviewDate || null,
        offer_received_date: offerReceivedDate || null,
        start_date: startDate || null,
        testimonial: testimonial || null,
        rating: rating || null,
        is_featured: isFeatured || false,
        is_approved: false, // Requires admin approval
        photo_url: photoUrl || null,
        days_to_first_interview: daysToFirstInterview,
        days_to_offer: daysToOffer,
        days_to_onboarding: daysToOnboarding,
        success_score: successScore,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returning('*');

    res.status(201).json({
      message: 'Testimonial created successfully',
      testimonial: newTestimonial,
    });
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ message: 'Error creating testimonial', error: err.message });
  }
});

// PUT /api/testimonials-metrics/:id - Update testimonial
router.put('/:id', authenticateToken, authorizeRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    // Recalculate days and success score if relevant dates changed
    if (updateData.service_completed_date || updateData.first_interview_date || 
        updateData.offer_received_date || updateData.onboarding_date) {
      const existing = await db('testimonials_metrics').where({ id }).first();
      const serviceDate = new Date(updateData.service_completed_date || existing.service_completed_date);
      const interviewDate = new Date(updateData.first_interview_date || existing.first_interview_date);
      const offerDate = new Date(updateData.offer_received_date || existing.offer_received_date);
      const onboardDate = new Date(updateData.onboarding_date || existing.onboarding_date);

      if (serviceDate && interviewDate) {
        updateData.days_to_first_interview = Math.ceil((interviewDate - serviceDate) / (1000 * 60 * 60 * 24));
      }
      if (interviewDate && offerDate) {
        updateData.days_to_offer = Math.ceil((offerDate - interviewDate) / (1000 * 60 * 60 * 24));
      }
      if (offerDate && onboardDate) {
        updateData.days_to_onboarding = Math.ceil((onboardDate - offerDate) / (1000 * 60 * 60 * 24));
      }
    }

    const [updated] = await db('testimonials_metrics')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!updated) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({
      message: 'Testimonial updated successfully',
      testimonial: updated,
    });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ message: 'Error updating testimonial', error: err.message });
  }
});

// DELETE /api/testimonials-metrics/:id - Delete testimonial
router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db('testimonials_metrics')
      .where({ id })
      .delete();

    if (!deleted) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ message: 'Error deleting testimonial', error: err.message });
  }
});

module.exports = router;

