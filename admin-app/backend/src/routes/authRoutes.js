const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, adminOnly, authController.getMe);

module.exports = router;
