import axios from 'axios';
import {API_BASE_URL, API_ENDPOINTS} from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  data?: any;
}

export const notificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    const params = {page, limit};
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS, {params});
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await api.put(API_ENDPOINTS.MARK_READ.replace(':id', id.toString()));
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put(API_ENDPOINTS.MARK_ALL_READ);
    return response.data;
  },

  deleteNotification: async (id: number) => {
    const response = await api.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS}/unread-count`);
    return response.data;
  },

  updateNotificationSettings: async (settings: any) => {
    const response = await api.put(`${API_ENDPOINTS.NOTIFICATIONS}/settings`, settings);
    return response.data;
  },

  getNotificationSettings: async () => {
    const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS}/settings`);
    return response.data;
  },
}; 