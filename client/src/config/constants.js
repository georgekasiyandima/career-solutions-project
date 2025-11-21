// API Configuration
export const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_BASE_URL = BACKEND_URL; // Removed extra /api
export const API_ENDPOINTS = {
  USERS: '/api/users',
  JOBS: '/api/jobs',
  BOOKINGS: '/api/bookings',
  ENQUIRIES: '/api/enquiries',
  SUCCESS_STORIES: '/api/success-stories',
  FEED: '/api/feed',
  TRACK: '/api/track',
  SUBSCRIPTIONS: '/api/subscriptions',
  ADMIN: '/api/admin'
};

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Career Solutions',
  VERSION: '1.0.0',
  DESCRIPTION: 'A modern, full-stack web application for job posting and career solutions',
  AUTHOR: 'George Kasiyandima'
};

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#1976d2',
    SECONDARY_COLOR: '#dc004e',
    SUCCESS_COLOR: '#4caf50',
    WARNING_COLOR: '#ff9800',
    ERROR_COLOR: '#f44336'
  },
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200
  },
  ANIMATION: {
    DURATION: 300,
    EASING: 'ease-in-out'
  }
};

// Form Configuration
export const FORM_CONFIG = {
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[+]?[1-9][\d]{0,15}$/,
    PASSWORD_MIN_LENGTH: 8
  },
  DEBOUNCE_DELAY: 300
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'language'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  ENQUIRY_SENT: 'Enquiry sent successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful!'
};

// Job Categories
export const JOB_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Customer Service',
  'Other'
];

// Job Types
export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance'
];

// Service Types
export const SERVICE_TYPES = [
  'Career Counseling',
  'Resume Review',
  'Interview Preparation',
  'Job Search Strategy',
  'Skills Assessment',
  'Networking Guidance'
];