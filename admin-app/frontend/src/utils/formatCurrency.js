export const formatCurrency = (amount) => {
  if (amount == null) return 'RWF 0';
  const num = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `RWF ${num}`;
};
