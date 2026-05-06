/**
 * Middleware to restrict access to admin users only.
 * Must be used after authMiddleware.
 */
const adminOnly = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.',
      errors: [],
    });
  }
  next();
};

module.exports = adminOnly;
