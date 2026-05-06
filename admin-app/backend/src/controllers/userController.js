const asyncHandler = require('../middlewares/asyncHandler');
const userService = require('../services/userService');

exports.getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);
  res.json({ success: true, data: result });
});

exports.getPendingVerification = asyncHandler(async (req, res) => {
  const users = await userService.getPendingVerification();
  res.json({ success: true, data: users });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

exports.verifyDevice = asyncHandler(async (req, res) => {
  const user = await userService.verifyDevice(req.params.id, req.body.verified);
  res.json({ success: true, data: user });
});

exports.assignClass = asyncHandler(async (req, res) => {
  const user = await userService.assignClass(req.params.id, req.body.classId);
  res.json({ success: true, data: user });
});

exports.linkChild = asyncHandler(async (req, res) => {
  const user = await userService.linkChild(req.params.id, req.body.childEmail);
  res.json({ success: true, data: user });
});

exports.updateRole = asyncHandler(async (req, res) => {
  const user = await userService.updateRole(req.params.id, req.body.role, req.admin._id);
  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id, req.admin._id);
  res.json(result);
});
