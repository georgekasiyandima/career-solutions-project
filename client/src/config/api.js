import axios from 'axios';
import { API_BASE_URL } from './constants';

// Store the access token in memory
let accessToken = '';

export const setAccessToken = (token) => {
  accessToken = token;
};

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Network error
      return Promise.reject(new Error('Network error. Please check your connection or try again later.'));
    }
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await apiService.refreshToken();
        setAccessToken(refreshResponse.data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    setAccessToken(response.data.accessToken);
    return response.data;
  },
  register: (userData) => api.post('/api/auth/register', userData),
  logout: async () => {
    await api.post('/api/auth/logout');
    setAccessToken('');
  },
  refreshToken: () => api.post('/api/auth/refresh'),
  getMe: () => api.get('/api/auth/me'),

  // Jobs
  getJobs: (params) => api.get('/api/jobs', { params }),
  getJob: (id) => api.get(`/api/jobs/${id}`),
  createJob: (jobData) => api.post('/api/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/api/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/api/jobs/${id}`),

  // Bookings
  getBookings: () => api.get('/api/booking'),
  createBooking: (bookingData) => api.post('/api/booking', bookingData),
  updateBooking: (id, bookingData) => api.put(`/api/booking/${id}`, bookingData),
  deleteBooking: (id) => api.delete(`/api/booking/${id}`),

  // Enquiries
  getEnquiries: () => api.get('/api/enquiry'),
  createEnquiry: (enquiryData) => api.post('/api/enquiry', enquiryData),
  updateEnquiry: (id, enquiryData) => api.put(`/api/enquiry/${id}`, enquiryData),
  deleteEnquiry: (id) => api.delete(`/api/enquiry/${id}`),

  // Success Stories
  getSuccessStories: () => api.get('/api/success-stories'),
  createSuccessStory: (storyData) => api.post('/api/success-stories', storyData),
  updateSuccessStory: (id, storyData) => api.put(`/api/success-stories/${id}`, storyData),
  deleteSuccessStory: (id) => api.delete(`/api/success-stories/${id}`),

  // Feed
  getFeedPosts: () => api.get('/api/feed'),
  createFeedPost: (postData) => api.post('/api/feed', postData),
  updateFeedPost: (id, postData) => api.put(`/api/feed/${id}`, postData),
  deleteFeedPost: (id) => api.delete(`/api/feed/${id}`),

  // Tracking
  trackEvent: (eventData) => api.post('/api/track', eventData),

  // Subscriptions
  subscribe: (subscriptionData) => api.post('/api/subscriptions', subscriptionData),
  unsubscribe: (email) => api.delete(`/api/subscriptions/${email}`),

  // Service Orders
  createServiceOrder: (orderData) => api.post('/api/service-orders', orderData),
  getServiceOrder: (orderId) => api.get(`/api/service-orders/${orderId}`),
  updatePaymentStatus: (orderId, paymentData) => api.patch(`/api/service-orders/${orderId}/payment`, paymentData),
  getServiceOrders: (params) => api.get('/api/service-orders', { params }),

  // Analytics
  trackBusinessEvent: (eventData) => api.post('/api/analytics/business', eventData),
  getBusinessAnalytics: (params) => api.get('/api/analytics/business', { params }),

  // Admin
  getAdminStats: () => api.get('/api/admin/stats'),
  getAdminUsers: () => api.get('/api/admin/users'),
  updateUserRole: (id, role) => api.put(`/api/admin/users/${id}/role`, { role }),
  getAdminDashboard: () => api.get('/api/admin/dashboard'),
};

export default api;