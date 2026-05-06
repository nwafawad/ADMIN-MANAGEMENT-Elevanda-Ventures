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
    <div className="space-y-8 animate-fade-in relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Welcome back to the Admin Dashboard</p>
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary-700 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 shadow-sm flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          Live updating
        </div>
      </div>

      <StatsGrid stats={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <FeeChart data={data} />
          <RecentActivityFeed transactions={data.recentTransactions} registrations={data.recentRegistrations} />
        </div>
        <div className="space-y-8">
          <AttendanceChart rate={data.attendanceRate} />
          <UnverifiedDevicesList />
        </div>
      </div>
    </div>
  );
}
