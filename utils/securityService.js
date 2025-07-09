const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class SecurityService {
  constructor() {
    this.failedLoginAttempts = new Map();
    this.suspiciousActivities = [];
    this.securityAlerts = [];
    this.blockedIPs = new Set();
    this.rateLimitCounters = new Map();
  }

  // Track failed login attempts
  trackFailedLogin(ip, email) {
    const key = `${ip}:${email}`;
    const attempts = this.failedLoginAttempts.get(key) || 0;
    this.failedLoginAttempts.set(key, attempts + 1);

    if (attempts + 1 >= 5) {
      this.blockIP(ip, 'Too many failed login attempts');
      this.createSecurityAlert({
        type: 'brute_force_attempt',
        ip,
        email,
        attempts: attempts + 1,
        severity: 'high'
      });
    }

    // Reset after 15 minutes
    setTimeout(() => {
      this.failedLoginAttempts.delete(key);
    }, 15 * 60 * 1000);
  }

  // Track successful login
  trackSuccessfulLogin(ip, email) {
    const key = `${ip}:${email}`;
    this.failedLoginAttempts.delete(key);
  }

  // Block IP address
  blockIP(ip, reason) {
    this.blockedIPs.add(ip);
    console.warn(`[SECURITY] IP ${ip} blocked: ${reason}`);
    
    // Unblock after 1 hour
    setTimeout(() => {
      this.blockedIPs.delete(ip);
    }, 60 * 60 * 1000);
  }

  // Check if IP is blocked
  isIPBlocked(ip) {
    return this.blockedIPs.has(ip);
  }

  // Rate limiting
  checkRateLimit(ip, endpoint, limit = 100, windowMs = 15 * 60 * 1000) {
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    let requests = this.rateLimitCounters.get(key) || [];
    
    // Remove old requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    if (requests.length >= limit) {
      return false;
    }
    
    requests.push(now);
    this.rateLimitCounters.set(key, requests);
    
    return true;
  }

  // Create security alert
  createSecurityAlert(alert) {
    const securityAlert = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...alert
    };

    this.securityAlerts.push(securityAlert);
    
    // Keep only last 1000 alerts
    if (this.securityAlerts.length > 1000) {
      this.securityAlerts = this.securityAlerts.slice(-1000);
    }

    console.warn(`[SECURITY ALERT] ${JSON.stringify(securityAlert)}`);
    
    // In production, this would send notifications
    this.sendSecurityNotification(securityAlert);
  }

  // Send security notification
  sendSecurityNotification(alert) {
    // In production, this would send email/SMS notifications
    if (alert.severity === 'high') {
      console.error(`[CRITICAL] High severity security alert: ${alert.type}`);
    }
  }

  // Track suspicious activity
  trackSuspiciousActivity(activity) {
    this.suspiciousActivities.push({
      ...activity,
      timestamp: new Date().toISOString()
    });

    // Keep only last 500 activities
    if (this.suspiciousActivities.length > 500) {
      this.suspiciousActivities = this.suspiciousActivities.slice(-500);
    }
  }

  // Generate secure token
  generateSecureToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
      issuer: 'career-solutions',
      audience: 'career-solutions-users'
    });
  }

  // Verify token with additional security checks
  verifySecureToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'career-solutions',
        audience: 'career-solutions-users'
      });

      // Check if token is not too old
      const tokenAge = Date.now() - (decoded.iat * 1000);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (tokenAge > maxAge) {
        throw new Error('Token too old');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Generate CSRF token
  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate CSRF token
  validateCSRFToken(token, sessionToken) {
    return token && sessionToken && token === sessionToken;
  }

  // Sanitize input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  }

  // Hash password
  async hashPassword(password) {
    const saltRounds = 12;
    const bcrypt = require('bcryptjs');
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password
  async comparePassword(password, hash) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, hash);
  }

  // Generate secure random string
  generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Encrypt sensitive data
  encryptData(data, key = process.env.ENCRYPTION_KEY) {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      encrypted: encrypted
    };
  }

  // Decrypt sensitive data
  decryptData(encryptedData, key = process.env.ENCRYPTION_KEY) {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  // Get security statistics
  getSecurityStats() {
    return {
      blockedIPs: this.blockedIPs.size,
      failedLoginAttempts: this.failedLoginAttempts.size,
      securityAlerts: this.securityAlerts.length,
      suspiciousActivities: this.suspiciousActivities.length,
      recentAlerts: this.securityAlerts.slice(-10),
      recentSuspiciousActivities: this.suspiciousActivities.slice(-10)
    };
  }

  // Clear old data
  cleanup() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    // Clean up old rate limit counters
    for (const [key, requests] of this.rateLimitCounters.entries()) {
      this.rateLimitCounters.set(key, requests.filter(timestamp => timestamp > oneHourAgo));
    }

    // Clean up old security alerts
    this.securityAlerts = this.securityAlerts.filter(alert => 
      new Date(alert.timestamp).getTime() > oneDayAgo
    );

    // Clean up old suspicious activities
    this.suspiciousActivities = this.suspiciousActivities.filter(activity => 
      new Date(activity.timestamp).getTime() > oneDayAgo
    );
  }
}

// Create singleton instance
const securityService = new SecurityService();

// Cleanup every hour
setInterval(() => {
  securityService.cleanup();
}, 60 * 60 * 1000);

module.exports = securityService; 