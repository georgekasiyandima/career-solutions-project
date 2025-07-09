require("dotenv").config();
const EmailService = require('./utils/emailService');

async function testEmailService() {
  try {
    console.log('Testing Email Service...');
    
    // Test booking confirmation email
    await EmailService.sendBookingConfirmation({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+27123456789',
      service: 'CV Writing',
      date: '2024-06-30',
      time: '10:00 AM'
    });
    
    console.log('Email service test completed successfully!');
  } catch (error) {
    console.error('Email service test failed:', error);
  } finally {
    process.exit(0);
  }
}

testEmailService(); 