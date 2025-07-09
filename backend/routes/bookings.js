const express = require('express');
const router = express.Router();
const db = require('../database');
const EmailService = require('../utils/emailService');

// GET /api/booking - Get all bookings (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const bookings = await db('bookings')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', req.body);

    const { name, firstName, lastName, email, phone, service_type, date, time, message, details } = req.body;

    // Determine name fields (support both formats)
    const fullName = name || (firstName && lastName ? `${firstName} ${lastName}` : null);
    if (!fullName || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Use service_type directly
    const bookingService = service_type;
    if (!bookingService) {
      return res.status(400).json({ message: 'Service type is required.' });
    }

    // Insert into database
    const [newBooking] = await db('bookings')
      .insert({
        name: fullName,
        email,
        phone: phone || null,
        service_type: bookingService,
        date: date || null,
        time: time || null,
        message: message || details || null,
        created_at: new Date().toISOString(),
      })
      .returning(['id', 'name', 'email', 'phone', 'service_type', 'date', 'time', 'message']);

    console.log('Booking inserted:', newBooking);

    // Send confirmation email to customer
    await EmailService.sendBookingConfirmation({
      name: fullName,
      email,
      phone: phone || null,
      service: bookingService,
      date: date || null,
      time: time || null
    });

    // Send notification email to admin
    await EmailService.sendAdminBookingNotification({
      name: fullName,
      email,
      phone: phone || null,
      service: bookingService,
      date: date || null,
      time: time || null,
      message: message || details || null
    });

    // Determine if this is a Visa Application booking
    const isVisaApplication = bookingService.toLowerCase().includes('visa applications');

    res.status(201).json({
      message: isVisaApplication
        ? 'Booking successful! Payment details have been sent to your email.'
        : 'Booking submitted successfully.',
      booking: newBooking,
    });
  } catch (err) {
    console.error('Database or email error in bookings:', err.message, err.stack);
    res.status(500).json({ message: 'An error occurred while submitting your booking. Please try again.', error: err.message });
  }
});

module.exports = router;