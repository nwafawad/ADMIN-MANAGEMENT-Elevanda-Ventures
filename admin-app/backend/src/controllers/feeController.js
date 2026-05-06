const asyncHandler = require('../middlewares/asyncHandler');
const feeService = require('../services/feeService');

exports.getTransactions = asyncHandler(async (req, res) => {
  const result = await feeService.getTransactions(req.query);
  res.json({ success: true, data: result });
});

exports.getPending = asyncHandler(async (req, res) => {
  const transactions = await feeService.getPendingTransactions();
  res.json({ success: true, data: transactions });
});

exports.getStats = asyncHandler(async (req, res) => {
  const stats = await feeService.getStats();
  res.json({ success: true, data: stats });
});

exports.approve = asyncHandler(async (req, res) => {
  const result = await feeService.approveTransaction(req.params.id, req.admin._id);
  res.json({ success: true, data: result });
});

exports.reject = asyncHandler(async (req, res) => {
  const result = await feeService.rejectTransaction(req.params.id, req.admin._id);
  res.json({ success: true, data: result });
});
