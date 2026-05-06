const asyncHandler = require('../middlewares/asyncHandler');
const dashboardService = require('../services/dashboardService');

exports.getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  res.json({ success: true, data: stats });
});
