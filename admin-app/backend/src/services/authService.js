const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { toUserDto } = require('../dtos/userDto');

/**
 * Server-side salt+hash — matches client app's backend hashing.
 */
const hashPassword = (preHashedPassword) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha512').update(preHashedPassword + salt).digest('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify a pre-hashed password against a stored salt:hash pair.
 */
const verifyPassword = (preHashedPassword, storedHash) => {
  const [salt, hash] = storedHash.split(':');
  const computedHash = crypto.createHash('sha512').update(preHashedPassword + salt).digest('hex');
  return computedHash === hash;
};

/**
 * Generate a JWT token.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Admin login — only users with role 'admin' can log in here.
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email, role: 'admin' });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = verifyPassword(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  const userDto = toUserDto(user);

  return { token, user: userDto };
};

/**
 * Get current authenticated admin user.
 */
const getMe = (admin) => {
  return toUserDto(admin);
};

module.exports = { login, getMe, hashPassword, verifyPassword };
