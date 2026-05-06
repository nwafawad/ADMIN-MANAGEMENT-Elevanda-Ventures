import Card, { CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';

export default function RecentActivityFeed({ transactions, registrations }) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Transactions */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Fee Transactions</h4>
              <Link to="/fees" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all</Link>
            </div>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-400">No recent transactions</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.userId?.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <Badge color={tx.status === 'pending' ? 'amber' : tx.status === 'approved' ? 'emerald' : 'red'} className="mt-1 scale-90 origin-right">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Registrations */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">New Registrations</h4>
              <Link to="/users" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all</Link>
            </div>
            <div className="space-y-4">
              {registrations.length === 0 ? (
                <p className="text-sm text-gray-400">No recent registrations</p>
              ) : (
                registrations.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Badge color={user.isDeviceVerified ? 'emerald' : 'amber'} pulse={!user.isDeviceVerified}>
                      {user.isDeviceVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </CardBody>
    </Card>
  );
}
