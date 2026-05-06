const User = require('../models/User');
const Class = require('../models/Class');
const FeeTransaction = require('../models/FeeTransaction');
const FeeBalance = require('../models/FeeBalance');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const { toUserDto } = require('../dtos/userDto');

/**
 * Get paginated users with optional filters.
 */
const getUsers = async ({ page = 1, limit = 15, role, search, isDeviceVerified }) => {
  const query = {};

  if (role) query.role = role;
  if (isDeviceVerified !== undefined) {
    query.isDeviceVerified = isDeviceVerified === 'true' || isDeviceVerified === true;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query)
      .populate('classId', 'name')
      .populate('childId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  return {
    users: users.map(toUserDto),
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get all users with unverified devices (no pagination).
 */
const getPendingVerification = async () => {
  const users = await User.find({ isDeviceVerified: false, role: { $ne: 'admin' } })
    .sort({ createdAt: -1 });
  return users.map(toUserDto);
};

/**
 * Get a single user by ID with populated refs.
 */
const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate('classId', 'name')
    .populate('childId', 'name email');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return toUserDto(user);
};

/**
 * Verify or unverify a user's device.
 */
const verifyDevice = async (id, verified) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.isDeviceVerified = verified;
  await user.save();

  return toUserDto(user);
};

/**
 * Assign a class to a user (student).
 */
const assignClass = async (userId, classId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const classDoc = await Class.findById(classId);
  if (!classDoc) {
    const error = new Error('Class not found');
    error.statusCode = 404;
    throw error;
  }

  // Remove from old class if assigned
  if (user.classId) {
    await Class.findByIdAndUpdate(user.classId, {
      $pull: { studentIds: user._id },
    });
  }

  user.classId = classId;
  await user.save();

  // Add to new class studentIds if not already present
  if (!classDoc.studentIds.includes(user._id)) {
    classDoc.studentIds.addToSet(user._id);
    await classDoc.save();
  }

  const updated = await User.findById(userId).populate('classId', 'name').populate('childId', 'name email');
  return toUserDto(updated);
};

/**
 * Link a child (student) to a parent user.
 */
const linkChild = async (parentId, childEmail) => {
  const parent = await User.findById(parentId);
  if (!parent) {
    const error = new Error('Parent not found');
    error.statusCode = 404;
    throw error;
  }

  const child = await User.findOne({ email: childEmail.toLowerCase(), role: 'student' });
  if (!child) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  parent.childId = child._id;
  await parent.save();

  const updated = await User.findById(parentId).populate('classId', 'name').populate('childId', 'name email');
  return toUserDto(updated);
};

/**
 * Update a user's role.
 */
const updateRole = async (userId, role, adminId) => {
  if (userId === adminId.toString()) {
    const error = new Error('Cannot change your own role');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.role = role;
  await user.save();

  return toUserDto(user);
};

/**
 * Delete a user and clean up all related data.
 */
const deleteUser = async (userId, adminId) => {
  if (userId === adminId.toString()) {
    const error = new Error('Cannot delete your own admin account');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Remove from class studentIds
  await Class.updateMany(
    { studentIds: user._id },
    { $pull: { studentIds: user._id } }
  );

  // Unset teacherId if user was a teacher
  if (user.role === 'teacher') {
    await Class.updateMany(
      { teacherId: user._id },
      { $unset: { teacherId: '' } }
    );
  }

  // Delete related data
  await Promise.all([
    FeeTransaction.deleteMany({ userId: user._id }),
    FeeBalance.deleteMany({ userId: user._id }),
    Grade.deleteMany({ studentId: user._id }),
    Attendance.deleteMany({ studentId: user._id }),
  ]);

  await User.findByIdAndDelete(userId);

  return { success: true, message: 'User deleted successfully' };
};

module.exports = {
  getUsers,
  getPendingVerification,
  getUserById,
  verifyDevice,
  assignClass,
  linkChild,
  updateRole,
  deleteUser,
};
