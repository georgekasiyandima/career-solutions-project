const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Career Solutions API',
      version: '1.0.0',
      description: 'Comprehensive API for Career Solutions platform with job management, user administration, analytics, and security features.',
      contact: {
        name: 'Career Solutions Support',
        email: 'support@careersolutions.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.careersolutions.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'admin' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Software Engineer' },
            company: { type: 'string', example: 'Tech Corp' },
            location: { type: 'string', example: 'New York, NY' },
            description: { type: 'string', example: 'We are looking for a skilled software engineer...' },
            requirements: { type: 'string', example: '5+ years experience, React, Node.js' },
            salary_range: { type: 'string', example: '$80,000 - $120,000' },
            status: { type: 'string', enum: ['active', 'inactive', 'filled'], example: 'active' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            service: { type: 'string', example: 'Resume Review' },
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            time: { type: 'string', example: '14:00' },
            message: { type: 'string', example: 'I need help with my resume' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'], example: 'pending' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Enquiry: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Bob Johnson' },
            email: { type: 'string', format: 'email', example: 'bob@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            subject: { type: 'string', example: 'Career Advice' },
            message: { type: 'string', example: 'I need career guidance' },
            status: { type: 'string', enum: ['new', 'in_progress', 'resolved'], example: 'new' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Analytics: {
          type: 'object',
          properties: {
            totalViews: { type: 'integer', example: 15000 },
            uniqueSessions: { type: 'integer', example: 8500 },
            totalClicks: { type: 'integer', example: 3200 },
            conversionRate: { type: 'number', format: 'float', example: 8.5 },
            topPages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  page: { type: 'string', example: '/jobs' },
                  views: { type: 'integer', example: 5000 }
                }
              }
            }
          }
        },
        SecurityAlert: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            type: { type: 'string', example: 'brute_force_attempt' },
            ip: { type: 'string', example: '192.168.1.1' },
            severity: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Jobs', description: 'Job posting and management' },
      { name: 'Bookings', description: 'Service booking management' },
      { name: 'Enquiries', description: 'Customer enquiry management' },
      { name: 'Analytics', description: 'Analytics and reporting' },
      { name: 'Users', description: 'User management' },
      { name: 'Content', description: 'Content management system' },
      { name: 'Security', description: 'Security monitoring and management' },
      { name: 'Feed', description: 'Social feed management' },
      { name: 'Success Stories', description: 'Success stories management' },
      { name: 'Search', description: 'Search functionality' },
      { name: 'Notifications', description: 'Notification system' },
      { name: 'Uploads', description: 'File upload management' }
    ]
  },
  apis: [
    './routes/*.js',
    './middleware/*.js',
    './utils/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 