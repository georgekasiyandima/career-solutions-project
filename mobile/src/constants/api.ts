export const API_BASE_URL = 'http://192.168.1.3:5000/api';
export const WS_BASE_URL = 'ws://192.168.1.3:5000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  
  // Jobs
  JOBS: '/jobs',
  JOB_DETAILS: '/jobs/:id',
  APPLY_JOB: '/jobs/:id/apply',
  SAVE_JOB: '/jobs/:id/save',
  
  // Bookings
  BOOKINGS: '/bookings',
  CREATE_BOOKING: '/bookings',
  BOOKING_DETAILS: '/bookings/:id',
  CANCEL_BOOKING: '/bookings/:id/cancel',
  
  // Enquiries
  ENQUIRIES: '/enquiries',
  CREATE_ENQUIRY: '/enquiries',
  ENQUIRY_DETAILS: '/enquiries/:id',
  
  // Content
  CONTENT: '/content',
  FEED: '/feed',
  SUCCESS_STORIES: '/success-stories',
  INTERVIEW_RESOURCES: '/interview-resources',
  
  // Search
  SEARCH: '/search',
  SEARCH_JOBS: '/search/jobs',
  SEARCH_CONTENT: '/search/content',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: '/notifications/:id/read',
  MARK_ALL_READ: '/notifications/read-all',
  
  // Analytics
  ANALYTICS: '/analytics',
  USER_ANALYTICS: '/analytics/user',
  
  // Uploads
  UPLOAD: '/uploads',
  UPLOAD_IMAGE: '/uploads/image',
  UPLOAD_DOCUMENT: '/uploads/document',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
}; 