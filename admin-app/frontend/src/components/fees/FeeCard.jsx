import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';

export default function FeeCard({ balance, isLow }) {
  return (
    <Card className={`relative overflow-hidden ${isLow ? 'pulse-glow border-red-200' : ''}`}>
      <div className={`absolute inset-0 opacity-5 ${isLow ? 'bg-red-500' : 'bg-primary-500'}`} />
      <div className="relative px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Current Balance</p>
            <p className={`text-3xl font-bold mt-1 ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLow ? 'bg-red-100' : 'bg-primary-100'}`}>
            <svg className={`w-6 h-6 ${isLow ? 'text-red-600' : 'text-primary-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        {isLow && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Low balance — please deposit funds
          </div>
        )}
      </div>
    </Card>
  );
}
