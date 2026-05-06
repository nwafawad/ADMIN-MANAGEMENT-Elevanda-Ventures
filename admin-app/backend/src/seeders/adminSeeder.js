const crypto = require('crypto');
const User = require('../models/User');
const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } = require('../config/env');

/**
 * Simulate client-side SHA-512 hash (what the browser does before sending).
 */
const clientSideHash = (plainPassword) => {
  return crypto.createHash('sha512').update(plainPassword).digest('hex');
};

/**
 * Server-side salt+hash (what the backend does with the received pre-hash).
 */
const serverSideHash = (preHashedPassword) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha512').update(preHashedPassword + salt).digest('hex');
  return `${salt}:${hash}`;
};

/**
 * Seeds the default admin account if none exists.
 * Uses the double-hash protocol: client SHA-512 → server salt+SHA-512.
 */
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('ℹ️  Admin account already exists. Skipping seed.');
      return;
    }

    // Double-hash: simulate client-side SHA-512, then server-side salt+hash
    const clientHash = clientSideHash(DEFAULT_ADMIN_PASSWORD);
    const passwordHash = serverSideHash(clientHash);

    await User.create({
      name: 'Super Admin',
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash,
      role: 'admin',
      deviceId: 'admin-device-001',
      isDeviceVerified: true,
    });

    console.log(`✅ Default admin account created: ${DEFAULT_ADMIN_EMAIL}`);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;
