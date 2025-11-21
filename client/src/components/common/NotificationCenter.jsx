import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import websocketService from '../../services/websocketService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const dropdownRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    initializeWebSocket();
    
    // Set up polling for new notifications (fallback)
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchUnreadCount();
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isConnected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initializeWebSocket = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await websocketService.connect(token);
      setIsConnected(true);
      
      // Subscribe to notifications
      websocketService.subscribe('notification', handleWebSocketNotification);
      
      // Request notifications
      websocketService.requestNotifications(10);
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      setIsConnected(false);
    }
  }, []);

  const handleWebSocketNotification = (data) => {
    if (Array.isArray(data)) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } else {
      // Single notification
      setNotifications(prev => [data, ...prev]);
      if (!data.is_read) {
        setUnreadCount(prev => prev + 1);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/notifications?limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'system':
        return <FaInfoCircle className="text-blue-400" />;
      case 'booking':
        return <FaCheck className="text-green-400" />;
      case 'enquiry':
        return <FaEnvelope className="text-yellow-400" />;
      case 'job':
        return <FaExclamationTriangle className="text-purple-400" />;
      default:
        return <FaBell className="text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'system':
        return 'blue';
      case 'booking':
        return 'green';
      case 'enquiry':
        return 'yellow';
      case 'job':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white transition-colors duration-200"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
        {/* Connection status indicator */}
        <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-400' : 'bg-gray-400'
        }`} />
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-poppins font-semibold">Notifications</h3>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                <span className="text-white/50 text-xs">
                  {isConnected ? 'Live' : 'Polling'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-white/70 hover:text-white text-xs transition-colors duration-200"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="text-white/60 font-poppins">Loading...</div>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-white/10 hover:bg-white/5 transition-all duration-200 ${
                      !notification.is_read ? 'bg-white/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-${getNotificationColor(notification.type)}-500/20 border border-${getNotificationColor(notification.type)}-500/30`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-poppins text-sm font-medium ${
                              !notification.is_read ? 'text-white' : 'text-white/80'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-white/60 font-poppins text-xs mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-white/40 font-poppins text-xs mt-2">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.is_read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-white/60 hover:text-white transition-colors duration-200"
                                title="Mark as read"
                              >
                                <FaCheck className="text-xs" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-white/60 hover:text-red-400 transition-colors duration-200"
                              title="Delete"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FaBell className="text-white/40 text-2xl mx-auto mb-2" />
                  <p className="text-white/60 font-poppins text-sm">No notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-white/20">
                <button
                  onClick={() => {
                    window.location.href = '/admin/notifications';
                  }}
                  className="w-full text-center text-white/70 hover:text-white font-poppins text-sm transition-colors duration-200"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
