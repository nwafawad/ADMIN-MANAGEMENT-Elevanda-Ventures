const asyncHandler = require('../middlewares/asyncHandler');
const authService = require('../services/authService');

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login({ email, password });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ success: true, data: user });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  res.json({ success: true, message: 'Logged out' });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = authService.getMe(req.admin);
  res.json({ success: true, data: user });
});
