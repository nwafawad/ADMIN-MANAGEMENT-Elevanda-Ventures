const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5002,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/client_school_db',
  JWT_SECRET: process.env.JWT_SECRET || 'your_admin_jwt_secret_here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  ADMIN_ORIGIN: process.env.ADMIN_ORIGIN || 'http://localhost:5174',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || 'admin@elevanda.com',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345',
  LOW_FEE_THRESHOLD: parseInt(process.env.LOW_FEE_THRESHOLD, 10) || 5000,
  AUTH_LIMIT_MAX: parseInt(process.env.AUTH_LIMIT_MAX, 10) || 10,
};
