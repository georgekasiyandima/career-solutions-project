const express = require('express');
const router = express.Router();
const db = require('../database');
const sendEmail = require('../utils/sendEmail');

// GET /api/enquiry - Get all enquiries (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const enquiries = await db('enquiries')
      .select('*')
      .orderBy('created_at', 'desc');
    
    res.json(enquiries);
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({ message: 'Error fetching enquiries' });
  }
});

// POST /api/enquiry - Create a new enquiry
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Log the received data for debugging
    console.log('Received enquiry data:', req.body);

    // Detailed validation
    const errors = {};
    if (!firstName || firstName.trim() === '') errors.firstName = 'First name is required';
    if (!lastName || lastName.trim() === '') errors.lastName = 'Last name is required';
    if (!email || email.trim() === '') errors.email = 'Email is required';
    if (!phone || phone.trim() === '') errors.phone = 'Phone number is required';
    if (!message || message.trim() === '') errors.message = 'Message is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'All fields are required.', errors });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Insert into database
    const [newEnquiry] = await db('enquiries')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        message,
        created_at: new Date().toISOString(),
      })
      .returning(['id', 'first_name', 'last_name', 'email', 'phone', 'message']);

    // Send confirmation email
    const subject = 'Thank You for Your Enquiry - Career Solutions';
    const text = `Dear ${firstName},\n\nThank you for reaching out to Career Solutions. We have received your enquiry and will get back to you soon.\n\nDetails:\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\n\nBest regards,\nGB Career Solutions Team`;
    const html = `
      <div style="font-family: 'Poppins', sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px 0;">
          <img src="http://localhost:5000/public/assets/Logo.png" alt="Career Solutions Logo" style="width: 150px; height: auto;" />
        </div>
        <h2 style="color: #07363c; text-align: center;">Thank You for Your Enquiry</h2>
        <p style="color: #333;">Dear ${firstName},</p>
        <p style="color: #333;">Thank you for reaching out to Career Solutions. We have received your enquiry and will get back to you soon.</p>
        <h3 style="color: #07363c;">Your Details:</h3>
        <ul style="color: #333;">
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
        <p style="color: #333;">Best regards,<br>Career Solutions Team</p>
      </div>
    `;

    await sendEmail(email, subject, text, html);

    res.status(201).json({ message: 'Enquiry submitted successfully.', enquiry: newEnquiry });
  } catch (err) {
    console.error('Database or email error in enquiries:', err);
    res.status(500).json({ message: 'An error occurred while submitting your enquiry. Please try again.' });
  }
});

module.exports = router;