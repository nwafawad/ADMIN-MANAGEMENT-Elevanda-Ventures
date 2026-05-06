import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card, { CardHeader, CardBody } from '../ui/Card';

export default function FeeChart({ data }) {
  // Mock monthly breakdown since we only have aggregated totals from the endpoint.
  // In a real app, the backend would return a month-by-month array.
  // We'll simulate 6 months for visual purposes.
  const chartData = [
    { name: 'Oct', deposits: Math.floor(data.totalFeeCollected * 0.1), withdrawals: Math.floor(data.totalFeeWithdrawn * 0.1) },
    { name: 'Nov', deposits: Math.floor(data.totalFeeCollected * 0.15), withdrawals: Math.floor(data.totalFeeWithdrawn * 0.12) },
    { name: 'Dec', deposits: Math.floor(data.totalFeeCollected * 0.12), withdrawals: Math.floor(data.totalFeeWithdrawn * 0.15) },
    { name: 'Jan', deposits: Math.floor(data.totalFeeCollected * 0.2), withdrawals: Math.floor(data.totalFeeWithdrawn * 0.18) },
    { name: 'Feb', deposits: Math.floor(data.totalFeeCollected * 0.18), withdrawals: Math.floor(data.totalFeeWithdrawn * 0.2) },
    { name: 'Mar', deposits: Math.floor(data.totalFeeCollected * 0.25), withdrawals: Math.floor(data.totalFeeWithdrawn * 0.25) },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Fee Cashflow (6 Months)</h3>
      </CardHeader>
      <CardBody>
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `RWF ${value >= 1000 ? (value / 1000) + 'k' : value}`}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(value)}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Bar dataKey="deposits" name="Deposits" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="withdrawals" name="Withdrawals" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
