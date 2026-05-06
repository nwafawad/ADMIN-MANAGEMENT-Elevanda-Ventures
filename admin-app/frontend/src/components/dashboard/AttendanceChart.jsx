import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card, { CardHeader, CardBody } from '../ui/Card';

export default function AttendanceChart({ rate }) {
  const present = rate;
  const absentOrLate = 100 - rate;

  const data = [
    { name: 'Present', value: present, color: '#10b981' }, // emerald-500
    { name: 'Absent/Late', value: absentOrLate, color: '#f43f5e' }, // rose-500
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Attendance Overview</h3>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center p-6">
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-900">{rate}%</span>
            <span className="text-xs text-gray-500">Present</span>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-gray-600 font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
