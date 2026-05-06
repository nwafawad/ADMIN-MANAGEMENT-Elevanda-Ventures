/**
 * Transforms a FeeTransaction document into a DTO.
 */
const toFeeDto = (transaction) => {
  if (!transaction) return null;

  const dto = {
    id: transaction._id,
    userId: transaction.userId,
    type: transaction.type,
    amount: transaction.amount,
    status: transaction.status,
    description: transaction.description,
    processedBy: transaction.processedBy || null,
    createdAt: transaction.createdAt,
  };

  // If userId is populated
  if (transaction.userId && typeof transaction.userId === 'object' && transaction.userId.name) {
    dto.userId = {
      id: transaction.userId._id,
      name: transaction.userId.name,
      email: transaction.userId.email,
    };
  }

  // If processedBy is populated
  if (transaction.processedBy && typeof transaction.processedBy === 'object' && transaction.processedBy.name) {
    dto.processedBy = {
      id: transaction.processedBy._id,
      name: transaction.processedBy.name,
    };
  }

  return dto;
};

/**
 * Transforms a FeeBalance document into a DTO.
 */
const toBalanceDto = (balance, threshold) => {
  if (!balance) return null;
  return {
    balance: balance.balance,
    isLow: balance.balance < threshold,
    updatedAt: balance.updatedAt,
  };
};

module.exports = { toFeeDto, toBalanceDto };
