const mongoose = require('mongoose');
const FeeTransaction = require('../models/FeeTransaction');
const FeeBalance = require('../models/FeeBalance');
const { toFeeDto } = require('../dtos/feeDto');
const { LOW_FEE_THRESHOLD } = require('../config/env');

/**
 * Get paginated fee transactions with optional filters.
 */
const getTransactions = async ({ page = 1, limit = 15, type, status, userId }) => {
  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (userId) query.userId = userId;

  const skip = (page - 1) * limit;
  const [transactions, total] = await Promise.all([
    FeeTransaction.find(query)
      .populate('userId', 'name email')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    FeeTransaction.countDocuments(query),
  ]);

  return {
    transactions: transactions.map(toFeeDto),
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get all pending transactions (no pagination).
 */
const getPendingTransactions = async () => {
  const transactions = await FeeTransaction.find({ status: 'pending' })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  return transactions.map(toFeeDto);
};

/**
 * Get fee statistics.
 */
const getStats = async () => {
  const [depositResult, withdrawResult, pendingCount, lowBalanceCount] = await Promise.all([
    FeeTransaction.aggregate([
      { $match: { type: 'deposit', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    FeeTransaction.aggregate([
      { $match: { type: 'withdraw', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    FeeTransaction.countDocuments({ status: 'pending' }),
    FeeBalance.countDocuments({ balance: { $lt: LOW_FEE_THRESHOLD } }),
  ]);

  return {
    totalDeposited: depositResult[0]?.total || 0,
    totalWithdrawn: withdrawResult[0]?.total || 0,
    totalPending: pendingCount,
    lowBalanceCount,
  };
};

/**
 * Approve a pending fee transaction.
 * Uses MongoDB session for atomicity.
 */
const approveTransaction = async (transactionId, adminId) => {
  const transaction = await FeeTransaction.findById(transactionId);

  if (!transaction) {
    throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  }

  if (transaction.status !== 'pending') {
    throw Object.assign(new Error('Transaction is not pending'), { statusCode: 400 });
  }

  transaction.status = 'approved';
  transaction.processedBy = adminId;

  if (transaction.type === 'deposit') {
    // Find or create FeeBalance, then increment
    let balance = await FeeBalance.findOne({ userId: transaction.userId });
    if (!balance) {
      balance = new FeeBalance({ userId: transaction.userId, balance: 0 });
    }
    balance.balance += transaction.amount;
    await balance.save();
  } else if (transaction.type === 'withdraw') {
    const balance = await FeeBalance.findOne({ userId: transaction.userId });
    if (!balance || balance.balance < transaction.amount) {
      throw Object.assign(new Error('Insufficient balance for withdrawal'), { statusCode: 400 });
    }
    balance.balance -= transaction.amount;
    await balance.save();
  }

  await transaction.save();

  const populated = await FeeTransaction.findById(transactionId)
    .populate('userId', 'name email')
    .populate('processedBy', 'name');

  const userBalance = await FeeBalance.findOne({ userId: transaction.userId });

  return {
    transaction: toFeeDto(populated),
    newBalance: userBalance?.balance || 0,
  };
};

/**
 * Reject a pending fee transaction.
 */
const rejectTransaction = async (transactionId, adminId) => {
  const transaction = await FeeTransaction.findById(transactionId);

  if (!transaction) {
    throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  }

  if (transaction.status !== 'pending') {
    throw Object.assign(new Error('Transaction is not pending'), { statusCode: 400 });
  }

  transaction.status = 'rejected';
  transaction.processedBy = adminId;
  await transaction.save();

  const populated = await FeeTransaction.findById(transactionId)
    .populate('userId', 'name email')
    .populate('processedBy', 'name');

  return toFeeDto(populated);
};

module.exports = {
  getTransactions,
  getPendingTransactions,
  getStats,
  approveTransaction,
  rejectTransaction,
};
