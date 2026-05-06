import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Menu, LogOut, Bell } from 'lucide-react';

export default function AdminNavbar({ onMenuToggle }) {
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Left: hamburger (mobile) */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-600"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Search or Title (optional) */}
        <div className="flex-1 lg:flex-none" />

        {/* Right: user info + logout */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-900 leading-tight">{admin?.name}</p>
              <p className="text-xs font-medium text-primary-600 uppercase tracking-wider">{admin?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 ml-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all cursor-pointer group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
