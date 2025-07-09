const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const securityService = require('../utils/securityService');
const { 
  apiLimiter, 
  validateInput, 
  commonValidations,
  auditLog,
  securityMonitoring 
} = require('../middleware/security');

// Apply security middleware to all routes
router.use(auditLog);
router.use(securityMonitoring);
router.use(apiLimiter);

// Get security statistics (admin only)
router.get('/stats', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const stats = securityService.getSecurityStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching security stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security statistics'
    });
  }
});

// Get recent security alerts (admin only)
router.get('/alerts', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { limit = 50, severity } = req.query;
    let alerts = securityService.securityAlerts;

    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }

    alerts = alerts.slice(-parseInt(limit));

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching security alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security alerts'
    });
  }
});

// Get suspicious activities (admin only)
router.get('/suspicious', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const activities = securityService.suspiciousActivities.slice(-parseInt(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching suspicious activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suspicious activities'
    });
  }
});

// Get blocked IPs (admin only)
router.get('/blocked-ips', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const blockedIPs = Array.from(securityService.blockedIPs);

    res.json({
      success: true,
      data: blockedIPs
    });
  } catch (error) {
    console.error('Error fetching blocked IPs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blocked IPs'
    });
  }
});

// Unblock IP (admin only)
router.post('/unblock-ip', 
  authenticateToken, 
  authorizeRole(['admin']),
  [commonValidations.ip],
  validateInput,
  async (req, res) => {
    try {
      const { ip } = req.body;
      
      if (securityService.blockedIPs.has(ip)) {
        securityService.blockedIPs.delete(ip);
        
        securityService.createSecurityAlert({
          type: 'ip_unblocked',
          ip,
          unblockedBy: req.user.id,
          severity: 'medium'
        });

        res.json({
          success: true,
          message: `IP ${ip} has been unblocked`
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'IP is not blocked'
        });
      }
    } catch (error) {
      console.error('Error unblocking IP:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to unblock IP'
      });
    }
  }
);

// Block IP manually (admin only)
router.post('/block-ip', 
  authenticateToken, 
  authorizeRole(['admin']),
  [commonValidations.ip],
  validateInput,
  async (req, res) => {
    try {
      const { ip, reason = 'Manual block' } = req.body;
      
      securityService.blockIP(ip, reason);
      
      securityService.createSecurityAlert({
        type: 'ip_manually_blocked',
        ip,
        reason,
        blockedBy: req.user.id,
        severity: 'medium'
      });

      res.json({
        success: true,
        message: `IP ${ip} has been blocked`
      });
    } catch (error) {
      console.error('Error blocking IP:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to block IP'
      });
    }
  }
);

// Get failed login attempts (admin only)
router.get('/failed-logins', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const failedLogins = Array.from(securityService.failedLoginAttempts.entries()).map(([key, attempts]) => {
      const [ip, email] = key.split(':');
      return { ip, email, attempts };
    });

    res.json({
      success: true,
      data: failedLogins
    });
  } catch (error) {
    console.error('Error fetching failed logins:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch failed login attempts'
    });
  }
});

// Clear failed login attempts (admin only)
router.post('/clear-failed-logins', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { ip, email } = req.body;
    
    if (ip && email) {
      const key = `${ip}:${email}`;
      securityService.failedLoginAttempts.delete(key);
    } else {
      securityService.failedLoginAttempts.clear();
    }

    res.json({
      success: true,
      message: 'Failed login attempts cleared'
    });
  } catch (error) {
    console.error('Error clearing failed logins:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear failed login attempts'
    });
  }
});

// Generate CSRF token
router.get('/csrf-token', authenticateToken, (req, res) => {
  try {
    const csrfToken = securityService.generateCSRFToken();
    
    // Store in session
    if (req.session) {
      req.session.csrfToken = csrfToken;
    }

    res.json({
      success: true,
      data: { csrfToken }
    });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate CSRF token'
    });
  }
});

// Validate password strength
router.post('/validate-password', (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    const isValid = securityService.validatePassword(password);
    const feedback = [];

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      feedback.push('Password must contain at least one number');
    }
    if (!/[@$!%*?&]/.test(password)) {
      feedback.push('Password must contain at least one special character (@$!%*?&)');
    }

    res.json({
      success: true,
      data: {
        isValid,
        feedback
      }
    });
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate password'
    });
  }
});

// Security health check
router.get('/health', (req, res) => {
  try {
    const health = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      blockedIPs: securityService.blockedIPs.size,
      failedLoginAttempts: securityService.failedLoginAttempts.size,
      securityAlerts: securityService.securityAlerts.length,
      suspiciousActivities: securityService.suspiciousActivities.length
    };

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Error in security health check:', error);
    res.status(500).json({
      success: false,
      error: 'Security health check failed'
    });
  }
});

// Export security logs (admin only)
router.get('/export-logs', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { type = 'all', format = 'json' } = req.query;
    
    let logs = [];
    
    switch (type) {
      case 'alerts':
        logs = securityService.securityAlerts;
        break;
      case 'suspicious':
        logs = securityService.suspiciousActivities;
        break;
      case 'failed-logins':
        logs = Array.from(securityService.failedLoginAttempts.entries()).map(([key, attempts]) => {
          const [ip, email] = key.split(':');
          return { ip, email, attempts, timestamp: new Date().toISOString() };
        });
        break;
      default:
        logs = {
          alerts: securityService.securityAlerts,
          suspicious: securityService.suspiciousActivities,
          failedLogins: Array.from(securityService.failedLoginAttempts.entries()),
          blockedIPs: Array.from(securityService.blockedIPs)
        };
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(logs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=security-logs-${type}-${Date.now()}.csv`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: logs
      });
    }
  } catch (error) {
    console.error('Error exporting security logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export security logs'
    });
  }
});

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

module.exports = router; 