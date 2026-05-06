/**
 * Transforms dashboard statistics into a DTO.
 */
const toDashboardDto = (stats) => {
  if (!stats) return null;
  return {
    totalStudents: stats.totalStudents || 0,
    totalTeachers: stats.totalTeachers || 0,
    totalParents: stats.totalParents || 0,
    totalClasses: stats.totalClasses || 0,
    totalFeeCollected: stats.totalFeeCollected || 0,
    totalFeeWithdrawn: stats.totalFeeWithdrawn || 0,
    pendingTransactions: stats.pendingTransactions || 0,
    unverifiedDevices: stats.unverifiedDevices || 0,
    attendanceRate: stats.attendanceRate || 0,
    recentTransactions: stats.recentTransactions || [],
    recentRegistrations: stats.recentRegistrations || [],
  };
};

module.exports = { toDashboardDto };
