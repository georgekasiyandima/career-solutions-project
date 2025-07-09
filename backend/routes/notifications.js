const express = require('express');
const router = express.Router();
const NotificationService = require('../utils/notificationService');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/notifications - Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit, offset, unread_only } = req.query;
    const options = {
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      unread_only: unread_only === 'true'
    };

    const notifications = await NotificationService.getUserNotifications(req.user.id, options);
    const stats = await NotificationService.getNotificationStats(req.user.id);

    res.json({
      notifications,
      stats
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to fetch unread count.' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await NotificationService.markAsRead(id, req.user.id);
    
    if (result > 0) {
      res.json({ message: 'Notification marked as read.' });
    } else {
      res.status(404).json({ message: 'Notification not found.' });
    }
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read.' });
  }
});

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read.', count: result });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read.' });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await NotificationService.deleteNotification(id, req.user.id);
    
    if (result > 0) {
      res.json({ message: 'Notification deleted.' });
    } else {
      res.status(404).json({ message: 'Notification not found.' });
    }
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification.' });
  }
});

// POST /api/notifications/system - Create system notification (admin only)
router.post('/system', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { title, message, data } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required.' });
    }

    const result = await NotificationService.createSystemNotification({
      title,
      message,
      data
    });

    res.status(201).json({
      message: 'System notification created.',
      count: result.count
    });
  } catch (error) {
    console.error('Create system notification error:', error);
    res.status(500).json({ message: 'Failed to create system notification.' });
  }
});

// POST /api/notifications/role - Create role-based notification (admin only)
router.post('/role', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { title, message, roles, data } = req.body;
    
    if (!title || !message || !roles || !Array.isArray(roles)) {
      return res.status(400).json({ message: 'Title, message, and roles array are required.' });
    }

    const result = await NotificationService.createRoleNotification({
      title,
      message,
      roles,
      data
    });

    res.status(201).json({
      message: 'Role-based notification created.',
      count: result.count
    });
  } catch (error) {
    console.error('Create role notification error:', error);
    res.status(500).json({ message: 'Failed to create role-based notification.' });
  }
});

// GET /api/notifications/templates - Get notification templates (admin only)
router.get('/templates', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const templates = NotificationService.getNotificationTemplates();
    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Failed to fetch notification templates.' });
  }
});

// POST /api/notifications/cleanup - Clean up old notifications (admin only)
router.post('/cleanup', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { days_old = 90 } = req.body;
    const result = await NotificationService.cleanupOldNotifications(days_old);
    
    res.json({
      message: 'Old notifications cleaned up.',
      deleted: result.deleted
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: 'Failed to cleanup old notifications.' });
  }
});

module.exports = router; 