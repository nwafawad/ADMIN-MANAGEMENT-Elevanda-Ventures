import StatCard from '../ui/StatCard';
import { Users, GraduationCap, Users2, School, TrendingUp, TrendingDown, Clock, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Row 1 */}
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        icon={<Users />}
        color="blue"
      />
      <StatCard
        title="Total Teachers"
        value={stats.totalTeachers}
        icon={<GraduationCap />}
        color="purple"
      />
      <StatCard
        title="Total Parents"
        value={stats.totalParents}
        icon={<Users2 />}
        color="green"
      />
      <StatCard
        title="Total Classes"
        value={stats.totalClasses}
        icon={<School />}
        color="orange"
      />

      {/* Row 2 */}
      <StatCard
        title="Total Deposited"
        value={formatCurrency(stats.totalFeeCollected)}
        icon={<TrendingUp />}
        color="emerald"
      />
      <StatCard
        title="Pending Fees"
        value={stats.pendingTransactions}
        icon={<Clock />}
        color={stats.pendingTransactions > 0 ? "amber" : "gray"}
      />
      <StatCard
        title="Attendance Rate"
        value={`${stats.attendanceRate}%`}
        icon={<TrendingUp />}
        color="indigo"
      />
      <StatCard
        title="Unverified Devices"
        value={stats.unverifiedDevices}
        icon={<ShieldAlert />}
        color={stats.unverifiedDevices > 0 ? "red" : "gray"}
      />
    </div>
  );
}
