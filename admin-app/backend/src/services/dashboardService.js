const User = require('../models/User');
const Class = require('../models/Class');
const FeeTransaction = require('../models/FeeTransaction');
const Attendance = require('../models/Attendance');
const { toDashboardDto } = require('../dtos/dashboardDto');
const { toFeeDto } = require('../dtos/feeDto');
const { toUserDto } = require('../dtos/userDto');

const getStats = async () => {
  const [
    totalStudents, totalTeachers, totalParents, totalClasses,
    depositAgg, withdrawAgg, pendingTransactions, unverifiedDevices,
    totalAttendance, presentCount, absentCount, lateCount,
    recentTxns, recentUsers,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'teacher' }),
    User.countDocuments({ role: 'parent' }),
    Class.countDocuments(),
    FeeTransaction.aggregate([{ $match: { type: 'deposit', status: 'approved' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    FeeTransaction.aggregate([{ $match: { type: 'withdraw', status: 'approved' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    FeeTransaction.countDocuments({ status: 'pending' }),
    User.countDocuments({ isDeviceVerified: false, role: { $ne: 'admin' } }),
    Attendance.countDocuments(),
    Attendance.countDocuments({ status: 'present' }),
    Attendance.countDocuments({ status: 'absent' }),
    Attendance.countDocuments({ status: 'late' }),
    FeeTransaction.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(5),
    User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).limit(5),
  ]);

  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  return toDashboardDto({
    totalStudents, totalTeachers, totalParents, totalClasses,
    totalFeeCollected: depositAgg[0]?.total || 0,
    totalFeeWithdrawn: withdrawAgg[0]?.total || 0,
    pendingTransactions, unverifiedDevices, attendanceRate,
    attendanceSummary: {
      total: totalAttendance,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      attendanceRate,
    },
    recentTransactions: recentTxns.map(toFeeDto),
    recentRegistrations: recentUsers.map(toUserDto),
  });
};

module.exports = { getStats };
