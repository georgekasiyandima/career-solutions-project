import api from '../config/api';

// Fetch notifications for the current user
export const fetchNotifications = async (options = {}) => {
  const params = {};
  if (options.limit) params.limit = options.limit;
  if (options.offset) params.offset = options.offset;
  if (options.unread_only) params.unread_only = options.unread_only;
  const res = await api.get('/api/notifications', { params });
  // The backend returns { notifications, stats }
  return res.data;
};

// Mark a single notification as read
export const markNotificationRead = async (id) => {
  await api.put(`/api/notifications/${id}/read`);
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
  await api.put('/api/notifications/mark-all-read');
};

// Get unread notification count
export const fetchUnreadCount = async () => {
  const res = await api.get('/api/notifications/unread-count');
  return res.data.count;
};

// Delete a notification
export const deleteNotification = async (id) => {
  await api.delete(`/api/notifications/${id}`);
}; 