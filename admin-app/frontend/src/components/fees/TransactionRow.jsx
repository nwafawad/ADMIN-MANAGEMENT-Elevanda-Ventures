import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';

const statusColors = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};

const typeColors = {
  deposit: 'blue',
  withdraw: 'orange',
};

export default function TransactionRow({ transaction }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDateTime(transaction.createdAt)}
      </td>
      <td className="px-4 py-3">
        <Badge color={typeColors[transaction.type]}>
          {transaction.type === 'deposit' ? '↑ Deposit' : '↓ Withdraw'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
        {formatCurrency(transaction.amount)}
      </td>
      <td className="px-4 py-3">
        <Badge color={statusColors[transaction.status]}>
          {transaction.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 max-w-48 truncate">
        {transaction.description || '—'}
      </td>
    </tr>
  );
}
