const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Protect routes - Authentication middleware
 * Verifies JWT token and attaches user to request
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Alternative: Check if token exists in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const [users] = await db.query(
        `SELECT user_id, email, username, full_name, role, profile_image, 
                is_active, is_verified 
         FROM users 
         WHERE user_id = ?`,
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
      }

      const user = users[0];

      // Check if user account is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Invalid or expired token.'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * Usage: authorize('admin', 'author')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

/**
 * Check if user is verified
 */
exports.isVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this resource'
    });
  }

  next();
};

/**
 * Optional auth - doesn't fail if no token
 * Useful for routes that work differently for logged-in users
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const [users] = await db.query(
        `SELECT user_id, email, username, full_name, role, profile_image, 
                is_active, is_verified 
         FROM users 
         WHERE user_id = ?`,
        [decoded.id]
      );

      if (users.length > 0 && users[0].is_active) {
        req.user = users[0];
      }
    } catch (error) {
      // Token is invalid, but that's okay for optional auth
      console.log('Optional auth: Invalid token');
    }

    next();
  } catch (error) {
    next(error);
  }
};
