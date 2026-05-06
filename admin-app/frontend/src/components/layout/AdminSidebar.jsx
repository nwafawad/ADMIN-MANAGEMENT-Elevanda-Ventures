import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, GraduationCap, School, BookOpen } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Fees', path: '/fees', icon: CreditCard },
  { label: 'Teachers', path: '/teachers', icon: GraduationCap },
  { label: 'Classes', path: '/classes', icon: School },
  { label: 'Academics', path: '/academics', icon: BookOpen },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-indigo-900 border-r border-indigo-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-900/50">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider">ELEVANDA</h1>
            <p className="text-xs text-indigo-300">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-900/50 text-white shadow-inner'
                    : 'text-indigo-200 hover:bg-indigo-900/30 hover:text-white'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive ? 'bg-primary-500 text-white shadow-sm' : 'bg-indigo-900/50 text-indigo-300 group-hover:text-white group-hover:bg-primary-500/50'}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
