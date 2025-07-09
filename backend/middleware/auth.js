const jwt = require('jsonwebtoken');

/**
 * Middleware to require a valid JWT token.
 * Attaches the decoded user to req.user if valid.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

/**
 * Middleware to optionally authenticate a user.
 * If a valid JWT is present, attaches user to req.user.
 * If not, continues without error.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    // Always call next, even if token is invalid
    next();
  });
}

/**
 * Middleware to require a specific user role.
 * Usage: authorizeRole(['admin', 'manager'])
 */
function authorizeRole(roles = []) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  optionalAuth,
  authorizeRole,
};