const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

/**
 * Middleware to verify JWT from httpOnly cookie.
 * Attaches decoded user to req.admin.
 */
const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
      errors: [],
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash -__v');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
        errors: [],
      });
    }

    req.admin = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      errors: [],
    });
  }
};

module.exports = authMiddleware;
