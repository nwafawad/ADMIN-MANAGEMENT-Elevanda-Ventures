import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card, { CardHeader, CardBody } from '../ui/Card';

export default function AttendanceChart({ summary, rate }) {
  const total = summary?.total || 0;
  const present = summary?.present || 0;
  const absent = summary?.absent || 0;
  const late = summary?.late || 0;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : rate || 0;

  const data = [
    { name: 'Present', value: present, color: '#10b981' },
    { name: 'Absent', value: absent, color: '#f59e0b' },
    { name: 'Late', value: late, color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Attendance Overview</h3>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center p-6">
        {total === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">No attendance records yet.</div>
        ) : (
          <>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-900">{attendanceRate}%</span>
                <span className="text-xs text-gray-500">Present</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
