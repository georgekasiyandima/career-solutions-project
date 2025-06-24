const express = require('express');
const router = express.Router();
const db = require('../database');
const sendEmail = require('../utils/sendEmail');

// POST /api/bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', req.body); // Log incoming request

    const { name, firstName, lastName, email, phone, service_type, date, time, message, details } = req.body;

    // Determine name fields (support both formats)
    const fullName = name || (firstName && lastName ? `${firstName} ${lastName}` : null);
    if (!fullName || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Use service_type directly (remove service as it's no longer needed)
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

    console.log('Booking inserted:', newBooking); // Log the inserted booking

    // Determine if this is a Visa Application booking
    const isVisaApplication = bookingService.toLowerCase().includes('visa applications');

    // Prepare payment details for Visa Applications
    let paymentDetails = '';
    let paymentDetailsHtml = '';
    if (isVisaApplication) {
      paymentDetails = `
Payment Details:
Amount: R1000 (Visa Application Assistance)
Bank: GB JobMarket Bank
Account Number: 1234567890
Branch Code: 123456
Reference: ${fullName} - Visa Application

Please make the payment via EFT or physical deposit. We’ll contact you to confirm your session.
      `;
      paymentDetailsHtml = `
        <h3 style="color: #07363c;">Payment Details:</h3>
        <ul style="color: #333;">
          <li><strong>Amount:</strong> R1000 (Visa Application Assistance)</li>
          <li><strong>Bank:</strong> GB JobMarket Bank</li>
          <li><strong>Account Number:</strong> 1234567890</li>
          <li><strong>Branch Code:</strong> 123456</li>
          <li><strong>Reference:</strong> ${fullName} - Visa Application</li>
        </ul>
        <p style="color: #333;">Please make the payment via EFT or physical deposit. We’ll contact you to confirm your session.</p>
      `;
    }

    // Send confirmation email
    const subject = 'Booking Confirmation - Career Solutions';
    const text = `Dear ${fullName},\n\nThank you for your booking with Career Solutions. Here are your booking details:\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nService: ${bookingService}\nDate: ${date || 'N/A'}\nTime: ${time || 'N/A'}\nMessage: ${message || details || 'N/A'}\n\n${paymentDetails}\nWe look forward to assisting you!\n\nBest regards,\nGB Career Solutions Team`;
    const html = `
      <div style="font-family: 'Poppins', sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <img src="http://localhost:5000/public/assets/Logo.png" alt="Career Solutions Logo" style="width: 150px; height: auto;" />
        </div>
        <h2 style="color: #07363c; text-align: center;">Booking Confirmation</h2>
        <p style="color: #333;">Dear ${fullName},</p>
        <p style="color: #333;">Thank you for your booking with Career Solutions. Here are your booking details:</p>
        <h3 style="color: #07363c;">Booking Details:</h3>
        <ul style="color: #333;">
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
          <li><strong>Service:</strong> ${bookingService}</li>
          <li><strong>Date:</strong> ${date || 'N/A'}</li>
          <li><strong>Time:</strong> ${time || 'N/A'}</li>
          <li><strong>Message:</strong> ${message || details || 'N/A'}</li>
        </ul>
        ${paymentDetailsHtml}
        <p style="color: #333;">We look forward to assisting you!</p>
        <p style="color: #333;">Best regards,<br>GB Career Solutions Team</p>
      </div>
    `;

    await sendEmail(email, subject, text, html);

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