import Card from './Card';

const colorStyles = {
  blue: 'border-t-blue-500 text-blue-600 bg-blue-50',
  purple: 'border-t-purple-500 text-purple-600 bg-purple-50',
  green: 'border-t-emerald-500 text-emerald-600 bg-emerald-50',
  orange: 'border-t-orange-500 text-orange-600 bg-orange-50',
  emerald: 'border-t-emerald-500 text-emerald-600 bg-emerald-50',
  amber: 'border-t-amber-500 text-amber-600 bg-amber-50',
  red: 'border-t-red-500 text-red-600 bg-red-50',
  indigo: 'border-t-indigo-500 text-indigo-600 bg-indigo-50',
};

export default function StatCard({ title, value, icon, color = 'blue' }) {
  const styles = colorStyles[color];
  const borderTopColor = styles.split(' ')[0];
  const iconTextColor = styles.split(' ')[1];
  const iconBgColor = styles.split(' ')[2];

  return (
    <Card className={`border-t-4 ${borderTopColor} hover:-translate-y-1 transition-transform duration-300`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${iconBgColor}`}>
            <div className={`w-6 h-6 ${iconTextColor}`}>{icon}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
