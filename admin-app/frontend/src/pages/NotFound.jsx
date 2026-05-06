import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mt-4 tracking-tight">Page Not Found</h2>
      <p className="text-gray-500 mt-2 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved. Check the URL or return to the dashboard.
      </p>
      <Link to="/dashboard">
        <Button className="flex items-center gap-2">
          <Home className="w-4 h-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
