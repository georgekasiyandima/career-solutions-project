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

// Order confirmation template
const getOrderConfirmationTemplate = (orderData) => `
  ${getHeaderTemplate()}
    <div style="padding: 30px; background-color: white;">
      <h2 style="color: #0B444A; text-align: center;">Order Confirmation</h2>
      <p style="color: #333;">Dear ${orderData.clientName},</p>
      <p style="color: #333;">Thank you for choosing Career Solutions! We have received your order and are ready to proceed.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0B444A; margin-top: 0;">Order Details:</h3>
        <table style="width: 100%; color: #333;">
          <tr><td><strong>Order Number:</strong></td><td>${orderData.orderNumber}</td></tr>
          <tr><td><strong>Service:</strong></td><td>${orderData.serviceName}</td></tr>
          <tr><td><strong>Amount:</strong></td><td>R${orderData.amount}</td></tr>
          <tr><td><strong>Status:</strong></td><td>Pending Payment</td></tr>
        </table>
      </div>
      
      <p style="color: #333;">To complete your order, please proceed with payment. You will receive payment instructions shortly.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment?orderNumber=${orderData.orderNumber}" style="background-color: #0B444A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Payment</a>
      </div>
      
      <p style="color: #333;">Best regards,<br>The Career Solutions Team</p>
    </div>
  ${getFooterTemplate()}
`;

// Payment confirmation template
const getPaymentConfirmationTemplate = (paymentData) => {
  let serviceInstructions = '';
  
  if (paymentData.serviceData) {
    if (paymentData.serviceName.includes('Resume')) {
      serviceInstructions = `
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0B444A;">
          <h3 style="color: #0B444A; margin-top: 0;">Next Steps for Your Resume Service:</h3>
          <ol style="color: #333;">
            <li>Please send us your current resume (if you have one) or your work history</li>
            <li>Share your career goals and target positions</li>
            <li>We will create your professional resume within 3-5 business days</li>
            <li>You'll receive your resume for review and can request up to 3 revisions</li>
          </ol>
        </div>
      `;
    } else if (paymentData.serviceName.includes('Visa')) {
      serviceInstructions = `
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0B444A;">
          <h3 style="color: #0B444A; margin-top: 0;">Next Steps for Your Visa Application:</h3>
          <ol style="color: #333;">
            <li>Our team will review your visa application details</li>
            <li>We will contact you within 24 hours to discuss your specific requirements</li>
            <li>You'll receive a checklist of required documents</li>
            <li>We'll guide you through each step of the application process</li>
          </ol>
        </div>
      `;
    } else if (paymentData.serviceName.includes('Cover Letter')) {
      serviceInstructions = `
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0B444A;">
          <h3 style="color: #0B444A; margin-top: 0;">Next Steps for Your Cover Letter:</h3>
          <ol style="color: #333;">
            <li>Please send us your resume and the job description</li>
            <li>We will create a tailored cover letter within 2-3 business days</li>
            <li>You'll receive your cover letter for review</li>
            <li>You can request up to 2 revisions to perfect it</li>
          </ol>
        </div>
      `;
    }
  }

  return `
    ${getHeaderTemplate()}
      <div style="padding: 30px; background-color: white;">
        <h2 style="color: #0B444A; text-align: center;">Payment Confirmed!</h2>
        <p style="color: #333;">Dear ${paymentData.clientName},</p>
        <p style="color: #333;">Thank you for your payment! Your order has been confirmed and we're ready to begin working on your service.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0B444A; margin-top: 0;">Order Details:</h3>
          <table style="width: 100%; color: #333;">
            <tr><td><strong>Order Number:</strong></td><td>${paymentData.orderNumber}</td></tr>
            <tr><td><strong>Service:</strong></td><td>${paymentData.serviceName}</td></tr>
            <tr><td><strong>Amount Paid:</strong></td><td>R${paymentData.amount}</td></tr>
            <tr><td><strong>Payment Status:</strong></td><td>Confirmed</td></tr>
          </table>
        </div>
        
        ${serviceInstructions}
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #0B444A; margin-top: 0;">Important Information:</h3>
          <p style="color: #333; margin: 0;">Our team will contact you within 24 hours to begin your service. Please check your email regularly for updates.</p>
        </div>
        
        <p style="color: #333;">If you have any questions, please don't hesitate to contact us via WhatsApp: +27 74 999 8812</p>
        
        <p style="color: #333;">Best regards,<br>The Career Solutions Team</p>
      </div>
    ${getFooterTemplate()}
  `;
};

module.exports = {
  getWelcomeEmailTemplate,
  getBookingConfirmationTemplate,
  getEnquiryConfirmationTemplate,
  getAdminNotificationTemplate,
  getPasswordResetTemplate,
  getOrderConfirmationTemplate,
  getPaymentConfirmationTemplate
}; 