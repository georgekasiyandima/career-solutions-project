// Email templates for Career Solutions

const getHeaderTemplate = () => `
  <div style="font-family: 'Poppins', sans-serif; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
    <div style="text-align: center; padding: 20px 0; background-color: #07363c;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Career Solutions</h1>
      <p style="color: #ccc; margin: 5px 0 0 0;">Your Career Success Partner</p>
    </div>
`;

const getFooterTemplate = () => `
    <div style="text-align: center; padding: 20px; background-color: #07363c; color: white;">
      <p style="margin: 0;">© 2024 Career Solutions. All rights reserved.</p>
      <p style="margin: 5px 0 0 0; font-size: 12px;">
        Contact us: info@careersolutions.com | +27 123 456 789
      </p>
    </div>
  </div>
`;

// Welcome email template
const getWelcomeEmailTemplate = (firstName) => `
  ${getHeaderTemplate()}
    <div style="padding: 30px; background-color: white;">
      <h2 style="color: #07363c; text-align: center;">Welcome to Career Solutions!</h2>
      <p style="color: #333;">Dear ${firstName},</p>
      <p style="color: #333;">Welcome to Career Solutions! We're excited to have you on board and look forward to helping you achieve your career goals.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #07363c; margin-top: 0;">What we offer:</h3>
        <ul style="color: #333;">
          <li>Professional CV writing and optimization</li>
          <li>Interview preparation and coaching</li>
          <li>Career guidance and counseling</li>
          <li>Job search assistance</li>
          <li>Visa application support</li>
        </ul>
      </div>
      
      <p style="color: #333;">Ready to get started? Visit our website or contact us to schedule your first session.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'https://careersolutions.com'}" style="background-color: #07363c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Our Website</a>
      </div>
      
      <p style="color: #333;">Best regards,<br>The Career Solutions Team</p>
    </div>
  ${getFooterTemplate()}
`;

// Booking confirmation template
const getBookingConfirmationTemplate = (bookingData) => `
  ${getHeaderTemplate()}
    <div style="padding: 30px; background-color: white;">
      <h2 style="color: #07363c; text-align: center;">Booking Confirmation</h2>
      <p style="color: #333;">Dear ${bookingData.name},</p>
      <p style="color: #333;">Thank you for your booking with Career Solutions. Here are your booking details:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #07363c; margin-top: 0;">Booking Details:</h3>
        <table style="width: 100%; color: #333;">
          <tr><td><strong>Name:</strong></td><td>${bookingData.name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${bookingData.email}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${bookingData.phone || 'N/A'}</td></tr>
          <tr><td><strong>Service:</strong></td><td>${bookingData.service}</td></tr>
          <tr><td><strong>Date:</strong></td><td>${bookingData.date || 'To be scheduled'}</td></tr>
          <tr><td><strong>Time:</strong></td><td>${bookingData.time || 'To be scheduled'}</td></tr>
        </table>
      </div>
      
      <p style="color: #333;">We'll contact you soon to confirm your session details.</p>
      
      <p style="color: #333;">Best regards,<br>The Career Solutions Team</p>
    </div>
  ${getFooterTemplate()}
`;

// Enquiry confirmation template
const getEnquiryConfirmationTemplate = (enquiryData) => `
  ${getHeaderTemplate()}
    <div style="padding: 30px; background-color: white;">
      <h2 style="color: #07363c; text-align: center;">Enquiry Received</h2>
      <p style="color: #333;">Dear ${enquiryData.firstName},</p>
      <p style="color: #333;">Thank you for reaching out to Career Solutions. We have received your enquiry and will get back to you within 24 hours.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #07363c; margin-top: 0;">Your Enquiry Details:</h3>
        <table style="width: 100%; color: #333;">
          <tr><td><strong>Name:</strong></td><td>${enquiryData.firstName} ${enquiryData.lastName}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${enquiryData.email}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${enquiryData.phone}</td></tr>
          <tr><td><strong>Message:</strong></td><td>${enquiryData.message}</td></tr>
        </table>
      </div>
      
      <p style="color: #333;">Our team will review your enquiry and provide you with the best possible assistance.</p>
      
      <p style="color: #333;">Best regards,<br>The Career Solutions Team</p>
    </div>
  ${getFooterTemplate()}
`;

// Admin notification template
const getAdminNotificationTemplate = (notificationData) => `
  ${getHeaderTemplate()}
    <div style="padding: 30px; background-color: white;">
      <h2 style="color: #07363c; text-align: center;">Admin Notification</h2>
      <p style="color: #333;">Hello Admin,</p>
      <p style="color: #333;">${notificationData.message}</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #07363c; margin-top: 0;">Details:</h3>
        <div style="color: #333;">${notificationData.details}</div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'https://careersolutions.com'}/admin" style="background-color: #07363c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Admin Panel</a>
      </div>
      
      <p style="color: #333;">Best regards,<br>Career Solutions System</p>
    </div>
  ${getFooterTemplate()}
`;

// Password reset template
const getPasswordResetTemplate = (resetLink) => `
  ${getHeaderTemplate()}
    <div style="padding: 30px; background-color: white;">
      <h2 style="color: #07363c; text-align: center;">Password Reset Request</h2>
      <p style="color: #333;">Hello,</p>
      <p style="color: #333;">You have requested to reset your password for your Career Solutions account.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #07363c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      
      <p style="color: #333;">If you didn't request this password reset, please ignore this email.</p>
      <p style="color: #333;">This link will expire in 1 hour for security reasons.</p>
      
      <p style="color: #333;">Best regards,<br>The Career Solutions Team</p>
    </div>
  ${getFooterTemplate()}
`;

module.exports = {
  getWelcomeEmailTemplate,
  getBookingConfirmationTemplate,
  getEnquiryConfirmationTemplate,
  getAdminNotificationTemplate,
  getPasswordResetTemplate
}; 