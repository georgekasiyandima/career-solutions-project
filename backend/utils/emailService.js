const sendEmail = require('./sendEmail');
const emailTemplates = require('./emailTemplates');

class EmailService {
  // Send welcome email to new users
  static async sendWelcomeEmail(userData) {
    try {
      const { firstName, email } = userData;
      const subject = 'Welcome to Career Solutions!';
      const html = emailTemplates.getWelcomeEmailTemplate(firstName);
      const text = `Welcome to Career Solutions, ${firstName}! We're excited to have you on board.`;
      
      await sendEmail(email, subject, text, html);
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  // Send booking confirmation email
  static async sendBookingConfirmation(bookingData) {
    try {
      const { name, email, service, date, time, phone } = bookingData;
      const subject = 'Booking Confirmation - Career Solutions';
      const html = emailTemplates.getBookingConfirmationTemplate({
        name,
        email,
        service,
        date,
        time,
        phone
      });
      const text = `Thank you for your booking, ${name}. We'll contact you soon to confirm your session.`;
      
      await sendEmail(email, subject, text, html);
      console.log(`Booking confirmation sent to ${email}`);
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      throw error;
    }
  }

  // Send enquiry confirmation email
  static async sendEnquiryConfirmation(enquiryData) {
    try {
      const { firstName, lastName, email, phone, message } = enquiryData;
      const subject = 'Enquiry Received - Career Solutions';
      const html = emailTemplates.getEnquiryConfirmationTemplate({
        firstName,
        lastName,
        email,
        phone,
        message
      });
      const text = `Thank you for your enquiry, ${firstName}. We'll get back to you within 24 hours.`;
      
      await sendEmail(email, subject, text, html);
      console.log(`Enquiry confirmation sent to ${email}`);
    } catch (error) {
      console.error('Error sending enquiry confirmation:', error);
      throw error;
    }
  }

  // Send admin notification for new bookings
  static async sendAdminBookingNotification(bookingData) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@careersolutions.com';
      const subject = 'New Booking Received - Career Solutions';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #07363c;">New Booking Received</h2>
          <p>A new booking has been submitted through the website.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone || 'N/A'}</p>
            <p><strong>Service:</strong> ${bookingData.service}</p>
            <p><strong>Date:</strong> ${bookingData.date || 'To be scheduled'}</p>
            <p><strong>Time:</strong> ${bookingData.time || 'To be scheduled'}</p>
          </div>
          
          <p>Please review and respond to this booking request.</p>
        </div>
      `;
      const text = `New booking from ${bookingData.name} (${bookingData.email}) for ${bookingData.service}`;
      
      await sendEmail(adminEmail, subject, text, html);
      console.log(`Admin notification sent for booking from ${bookingData.email}`);
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  }

  // Send admin notification for new enquiries
  static async sendAdminEnquiryNotification(enquiryData) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@careersolutions.com';
      const subject = 'New Enquiry Received - Career Solutions';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #07363c;">New Enquiry Received</h2>
          <p>A new enquiry has been submitted through the website.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Enquiry Details:</h3>
            <p><strong>Name:</strong> ${enquiryData.firstName} ${enquiryData.lastName}</p>
            <p><strong>Email:</strong> ${enquiryData.email}</p>
            <p><strong>Phone:</strong> ${enquiryData.phone}</p>
            <p><strong>Message:</strong> ${enquiryData.message}</p>
          </div>
          
          <p>Please review and respond to this enquiry.</p>
        </div>
      `;
      const text = `New enquiry from ${enquiryData.firstName} ${enquiryData.lastName} (${enquiryData.email})`;
      
      await sendEmail(adminEmail, subject, text, html);
      console.log(`Admin notification sent for enquiry from ${enquiryData.email}`);
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't throw error for admin notifications to avoid breaking user flow
    }
  }

  // Send reminder emails for upcoming appointments
  static async sendAppointmentReminder(appointmentData) {
    try {
      const { name, email, service, date, time } = appointmentData;
      const subject = 'Appointment Reminder - Career Solutions';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #07363c;">Appointment Reminder</h2>
          <p>Dear ${name},</p>
          <p>This is a friendly reminder about your upcoming appointment with Career Solutions.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Appointment Details:</h3>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
          </div>
          
          <p>Please ensure you're prepared for your session. If you need to reschedule, please contact us as soon as possible.</p>
          
          <p>Best regards,<br>The Career Solutions Team</p>
        </div>
      `;
      const text = `Reminder: Your ${service} appointment is scheduled for ${date} at ${time}`;
      
      await sendEmail(email, subject, text, html);
      console.log(`Appointment reminder sent to ${email}`);
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
      throw error;
    }
  }

  // Send follow-up email after appointment
  static async sendFollowUpEmail(appointmentData) {
    try {
      const { name, email, service } = appointmentData;
      const subject = 'Follow-up - Career Solutions';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #07363c;">Thank You for Your Session</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your recent ${service} session with Career Solutions. We hope you found it valuable and informative.</p>
          
          <p>We'd love to hear your feedback about your experience. Your input helps us improve our services.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://careersolutions.com'}/feedback" style="background-color: #07363c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Share Your Feedback</a>
          </div>
          
          <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The Career Solutions Team</p>
        </div>
      `;
      const text = `Thank you for your recent ${service} session. We'd love to hear your feedback!`;
      
      await sendEmail(email, subject, text, html);
      console.log(`Follow-up email sent to ${email}`);
    } catch (error) {
      console.error('Error sending follow-up email:', error);
      throw error;
    }
  }
}

module.exports = EmailService; 