const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NotificationService = require('./notificationService');

class UserService {
  // Get users with advanced filtering and pagination
  static async getUsers(filters = {}, options = {}) {
    const {
      role,
      is_active,
      email_verified,
      search,
      created_after,
      created_before
    } = filters;
    
    const {
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      include_stats = false
    } = options;
    
    let query = db('users').select('*');
    
    // Apply filters
    if (role) {
      query = query.where('role', role);
    }
    
    if (is_active !== undefined) {
      query = query.where('is_active', is_active);
    }
    
    if (email_verified !== undefined) {
      query = query.where('email_verified', email_verified);
    }
    
    if (search) {
      query = query.where(function() {
        this.where('username', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('first_name', 'like', `%${search}%`)
          .orWhere('last_name', 'like', `%${search}%`);
      });
    }
    
    if (created_after) {
      query = query.where('created_at', '>=', created_after);
    }
    
    if (created_before) {
      query = query.where('created_at', '<=', created_before);
    }
    
    // Apply sorting
    query = query.orderBy(sortBy, sortOrder);
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    const users = await query;
    
    // Include user statistics if requested
    if (include_stats) {
      for (let user of users) {
        user.stats = await this.getUserStats(user.id);
      }
    }
    
    return users;
  }

  // Create user with validation
  static async createUser(userData, createdBy = null) {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role = 'user',
      is_active = true,
      email_verified = false,
      avatar_url,
      phone,
      bio
    } = userData;
    
    // Validation
    if (!username || !email || !password || !first_name || !last_name) {
      throw new Error('Username, email, password, first name, and last name are required.');
    }
    
    if (username.length < 3 || username.length > 30) {
      throw new Error('Username must be between 3 and 30 characters.');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    
    // Check if user already exists
    const existingUser = await db('users')
      .where({ username })
      .orWhere({ email })
      .first();
    
    if (existingUser) {
      throw new Error('Username or email already exists.');
    }
    
    // Hash the password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const user = {
      username,
      email,
      password_hash,
      first_name,
      last_name,
      role,
      is_active,
      email_verified,
      avatar_url,
      phone,
      bio,
      created_by: createdBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const [newUser] = await db('users')
      .insert(user)
      .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'email_verified', 'created_at']);
    
    // Send welcome notification
    await NotificationService.createFromTemplate(newUser.id, 'welcome_user');
    
    return newUser;
  }

  // Update user with validation
  static async updateUser(id, userData, updatedBy = null) {
    const user = await db('users').where({ id }).first();
    if (!user) {
      throw new Error('User not found.');
    }
    
    const {
      username,
      email,
      first_name,
      last_name,
      role,
      is_active,
      email_verified,
      avatar_url,
      phone,
      bio
    } = userData;
    
    // Validation
    if (username && (username.length < 3 || username.length > 30)) {
      throw new Error('Username must be between 3 and 30 characters.');
    }
    
    // Check if username/email already exists (excluding current user)
    if (username || email) {
      const existingUser = await db('users')
        .where(function() {
          if (username) this.orWhere({ username });
          if (email) this.orWhere({ email });
        })
        .whereNot({ id })
        .first();
      
      if (existingUser) {
        throw new Error('Username or email already exists.');
      }
    }
    
    const updateData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
      ...(role && { role }),
      ...(is_active !== undefined && { is_active }),
      ...(email_verified !== undefined && { email_verified }),
      ...(avatar_url !== undefined && { avatar_url }),
      ...(phone !== undefined && { phone }),
      ...(bio !== undefined && { bio }),
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    };
    
    const [updatedUser] = await db('users')
      .where({ id })
      .update(updateData)
      .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'email_verified', 'updated_at']);
    
    return updatedUser;
  }

  // Delete user with cleanup
  static async deleteUser(id, deletedBy = null) {
    const user = await db('users').where({ id }).first();
    if (!user) {
      throw new Error('User not found.');
    }
    
    // Prevent deletion of admin users
    if (user.role === 'admin') {
      throw new Error('Cannot delete admin users.');
    }
    
    // Soft delete by deactivating the user
    const [deletedUser] = await db('users')
      .where({ id })
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy,
        updated_at: new Date().toISOString()
      })
      .returning(['id', 'username', 'email', 'role']);
    
    return deletedUser;
  }

  // Authenticate user
  static async authenticateUser(username, password) {
    const user = await db('users')
      .where({ username })
      .orWhere({ email: username })
      .first();
    
    if (!user) {
      throw new Error('Invalid username or password.');
    }
    
    if (!user.is_active) {
      throw new Error('Account is deactivated.');
    }
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid username or password.');
    }
    
    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login: new Date().toISOString() });
    
    return user;
  }

  // Generate JWT token
  static generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });
  }

  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      throw new Error('User not found.');
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('Current password is incorrect.');
    }
    
    // Hash new password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await db('users')
      .where({ id: userId })
      .update({
        password_hash,
        updated_at: new Date().toISOString()
      });
    
    return true;
  }

  // Reset password (admin function)
  static async resetPassword(userId, newPassword, resetBy = null) {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      throw new Error('User not found.');
    }
    
    // Hash new password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await db('users')
      .where({ id: userId })
      .update({
        password_hash,
        updated_at: new Date().toISOString()
      });
    
    // Send password reset notification
    await NotificationService.createFromTemplate(userId, 'password_reset');
    
    return true;
  }

  // Get user statistics
  static async getUserStats(userId) {
    const [bookings, enquiries, content, lastActivity] = await Promise.all([
      db('bookings').where('user_id', userId).count('id as count').first(),
      db('enquiries').where('user_id', userId).count('id as count').first(),
      db('content').where('author_id', userId).count('id as count').first(),
      db('users').where('id', userId).select('last_login').first()
    ]);
    
    return {
      totalBookings: parseInt(bookings.count),
      totalEnquiries: parseInt(enquiries.count),
      totalContent: parseInt(content.count),
      lastActivity: lastActivity.last_login
    };
  }

  // Get user roles
  static async getUserRoles() {
    const roles = await db('users')
      .distinct('role')
      .select('role')
      .whereNotNull('role');
    
    return roles.map(r => r.role);
  }

  // Bulk operations
  static async bulkUpdateUsers(userIds, updateData, updatedBy = null) {
    const updateDataWithMeta = {
      ...updateData,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    };
    
    const result = await db('users')
      .whereIn('id', userIds)
      .update(updateDataWithMeta);
    
    return result;
  }

  // Get user activity log
  static async getUserActivity(userId, limit = 50) {
    // This would require an activity log table
    // For now, return basic user info
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'last_login', 'created_at')
      .first();
    
    return user;
  }

  // Verify email
  static async verifyEmail(userId) {
    const result = await db('users')
      .where({ id: userId })
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    return result > 0;
  }

  // Get user permissions
  static getUserPermissions(role) {
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_content', 'view_analytics', 'manage_system'],
      manager: ['read', 'write', 'manage_content', 'view_analytics'],
      editor: ['read', 'write'],
      user: ['read']
    };
    
    return permissions[role] || ['read'];
  }

  // Check if user has permission
  static hasPermission(userRole, requiredPermission) {
    const permissions = this.getUserPermissions(userRole);
    return permissions.includes(requiredPermission);
  }
}

module.exports = UserService; 