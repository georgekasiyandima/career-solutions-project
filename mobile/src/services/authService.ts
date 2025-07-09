import axios from 'axios';
import {API_BASE_URL, API_ENDPOINTS} from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        clearStoredAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const getStoredToken = (): string | null => {
  // This would be implemented with AsyncStorage in a real app
  return null;
};

const clearStoredAuth = () => {
  // This would clear stored auth data
};

const refreshToken = async (): Promise<string> => {
  const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
  return response.data.token;
};

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, {email, password});
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put(API_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, {email});
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
    return response.data;
  },
}; 