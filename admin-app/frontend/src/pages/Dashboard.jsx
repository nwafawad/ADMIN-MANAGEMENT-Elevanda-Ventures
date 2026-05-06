import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import StatsGrid from '../components/dashboard/StatsGrid';
import FeeChart from '../components/dashboard/FeeChart';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import UnverifiedDevicesList from '../components/dashboard/UnverifiedDevicesList';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
    refetchInterval: 60000, // refresh every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        Failed to load dashboard data. Please refresh.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <div className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live updating
        </div>
      </div>

      <StatsGrid stats={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FeeChart data={data} />
          <RecentActivityFeed transactions={data.recentTransactions} registrations={data.recentRegistrations} />
        </div>
        <div className="space-y-6">
          <AttendanceChart rate={data.attendanceRate} />
          <UnverifiedDevicesList />
        </div>
      </div>
    </div>
  );
}
