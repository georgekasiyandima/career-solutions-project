// Server Configuration
const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost'
};

// Database Configuration
const DATABASE_CONFIG = {
  CLIENT: 'sqlite3',
  USE_NULL_AS_DEFAULT: true,
  MIGRATIONS: {
    DIRECTORY: './migrations'
  },
  SEEDS: {
    DIRECTORY: './seeds'
  }
};

// Authentication Configuration
const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  BCRYPT_ROUNDS: 12,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
};

// Email Configuration
const EMAIL_CONFIG = {
  HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  PORT: process.env.EMAIL_PORT || 587,
  USER: process.env.EMAIL_USER,
  PASS: process.env.EMAIL_PASS,
  FROM: process.env.EMAIL_FROM || 'noreply@careersolutions.com',
  SECURE: process.env.NODE_ENV === 'production'
};

// CORS Configuration
const CORS_CONFIG = {
  ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CREDENTIALS: true,
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization']
};

// Rate Limiting Configuration
const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
  MESSAGE: 'Too many requests from this IP, please try again later.'
};

// File Upload Configuration
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  UPLOAD_PATH: './uploads'
};

// Validation Rules
const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/
  }
};

// API Response Messages
const API_MESSAGES = {
  SUCCESS: {
    USER_REGISTERED: 'User registered successfully',
    USER_LOGGED_IN: 'Login successful',
    USER_LOGGED_OUT: 'Logout successful',
    JOB_CREATED: 'Job created successfully',
    JOB_UPDATED: 'Job updated successfully',
    JOB_DELETED: 'Job deleted successfully',
    BOOKING_CREATED: 'Booking created successfully',
    ENQUIRY_SENT: 'Enquiry sent successfully',
    STORY_CREATED: 'Success story created successfully',
    POST_CREATED: 'Feed post created successfully'
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid username or password',
    USER_NOT_FOUND: 'User not found',
    JOB_NOT_FOUND: 'Job not found',
    UNAUTHORIZED: 'Unauthorized access',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database error',
    EMAIL_ERROR: 'Email sending failed'
  }
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  SERVER_CONFIG,
  DATABASE_CONFIG,
  AUTH_CONFIG,
  EMAIL_CONFIG,
  CORS_CONFIG,
  RATE_LIMIT_CONFIG,
  UPLOAD_CONFIG,
  VALIDATION_RULES,
  API_MESSAGES,
  HTTP_STATUS
}; 