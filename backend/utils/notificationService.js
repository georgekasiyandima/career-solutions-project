const db = require('../database');
const EmailService = require('./emailService');

class NotificationService {
  // Create a new notification
  static async createNotification(data) {
    try {
      const notification = {
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: JSON.stringify(data.data || {}),
        is_read: false,
        created_at: new Date().toISOString()
      };

      const [id] = await db('notifications').insert(notification);
      
      // Send real-time notification if user is online
      this.sendRealTimeNotification(data.user_id, notification);
      
      // Send email notification if configured
      if (data.send_email) {
        await this.sendEmailNotification(data.user_id, notification);
      }

      return { id, ...notification };
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Get notifications for a user
  static async getUserNotifications(userId, options = {}) {
    const { limit = 20, offset = 0, unread_only = false } = options;
    
    let query = db('notifications')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
    
    if (unread_only) {
      query = query.where('is_read', false);
    }
    
    return await query.limit(limit).offset(offset);
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    return await db('notifications')
      .where({ id: notificationId, user_id: userId })
      .update({ is_read: true, read_at: new Date().toISOString() });
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    return await db('notifications')
      .where({ user_id: userId, is_read: false })
      .update({ is_read: true, read_at: new Date().toISOString() });
  }

  // Delete a notification
  static async deleteNotification(notificationId, userId) {
    return await db('notifications')
      .where({ id: notificationId, user_id: userId })
      .del();
  }

  // Get unread count for a user
  static async getUnreadCount(userId) {
    const result = await db('notifications')
      .where({ user_id: userId, is_read: false })
      .count('id as count')
      .first();
    
    return parseInt(result.count);
  }

  // Send real-time notification (WebSocket)
  static sendRealTimeNotification(userId, notification) {
    // This would integrate with WebSocket server
    // For now, we'll use a placeholder
    console.log(`Real-time notification sent to user ${userId}:`, notification.title);
  }

  // Send email notification
  static async sendEmailNotification(userId, notification) {
    try {
      const user = await db('users').where('id', userId).first();
      if (!user || !user.email) return;

      const emailData = {
        to: user.email,
        subject: notification.title,
        template: 'notification',
        data: {
          userName: user.name,
          notificationTitle: notification.title,
          notificationMessage: notification.message,
          notificationType: notification.type,
          notificationDate: new Date(notification.created_at).toLocaleDateString()
        }
      };

      await EmailService.sendEmail(emailData);
    } catch (error) {
      console.error('Email notification error:', error);
    }
  }

  // Create system notification for all users
  static async createSystemNotification(data) {
    try {
      const users = await db('users').select('id');
      
      const notifications = users.map(user => ({
        user_id: user.id,
        type: 'system',
        title: data.title,
        message: data.message,
        data: JSON.stringify(data.data || {}),
        is_read: false,
        created_at: new Date().toISOString()
      }));

      await db('notifications').insert(notifications);
      
      // Send real-time notifications to all online users
      users.forEach(user => {
        this.sendRealTimeNotification(user.id, {
          type: 'system',
          title: data.title,
          message: data.message
        });
      });

      return { count: users.length };
    } catch (error) {
      console.error('System notification error:', error);
      throw error;
    }
  }

  // Create notification for specific user roles
  static async createRoleNotification(data) {
    try {
      const users = await db('users')
        .whereIn('role', data.roles)
        .select('id');
      
      const notifications = users.map(user => ({
        user_id: user.id,
        type: 'role',
        title: data.title,
        message: data.message,
        data: JSON.stringify(data.data || {}),
        is_read: false,
        created_at: new Date().toISOString()
      }));

      await db('notifications').insert(notifications);
      
      return { count: users.length };
    } catch (error) {
      console.error('Role notification error:', error);
      throw error;
    }
  }

  // Notification templates
  static getNotificationTemplates() {
    return {
      booking_confirmed: {
        title: 'Booking Confirmed',
        message: 'Your booking has been confirmed. We will contact you soon with details.',
        type: 'booking'
      },
      booking_cancelled: {
        title: 'Booking Cancelled',
        message: 'Your booking has been cancelled. Please contact us for rescheduling.',
        type: 'booking'
      },
      enquiry_received: {
        title: 'Enquiry Received',
        message: 'We have received your enquiry and will respond within 24 hours.',
        type: 'enquiry'
      },
      new_job_posted: {
        title: 'New Job Posted',
        message: 'A new job matching your profile has been posted.',
        type: 'job'
      },
      system_maintenance: {
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 2-4 AM.',
        type: 'system'
      }
    };
  }

  // Create notification from template
  static async createFromTemplate(userId, templateKey, customData = {}) {
    const templates = this.getNotificationTemplates();
    const template = templates[templateKey];
    
    if (!template) {
      throw new Error(`Notification template '${templateKey}' not found`);
    }

    const notificationData = {
      user_id: userId,
      title: template.title,
      message: template.message,
      type: template.type,
      data: customData,
      send_email: true
    };

    return await this.createNotification(notificationData);
  }

  // Get notification statistics
  static async getNotificationStats(userId) {
    const [total, unread, read] = await Promise.all([
      db('notifications').where('user_id', userId).count('id as count').first(),
      db('notifications').where({ user_id: userId, is_read: false }).count('id as count').first(),
      db('notifications').where({ user_id: userId, is_read: true }).count('id as count').first()
    ]);

    return {
      total: parseInt(total.count),
      unread: parseInt(unread.count),
      read: parseInt(read.count)
    };
  }

  // Clean up old notifications
  static async cleanupOldNotifications(daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await db('notifications')
      .where('created_at', '<', cutoffDate.toISOString())
      .where('is_read', true)
      .del();

    return { deleted: result };
  }
}

module.exports = NotificationService; 