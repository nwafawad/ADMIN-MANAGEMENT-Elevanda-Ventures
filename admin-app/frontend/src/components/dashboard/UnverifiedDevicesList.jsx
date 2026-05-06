import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import Card, { CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function UnverifiedDevicesList() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['pendingVerifications'],
    queryFn: async () => {
      const res = await api.get('/users/pending-verification');
      return res.data.data;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/users/${id}/verify-device`, { verified: true });
      return res.data;
    },
    onSuccess: (_, id) => {
      toast.success('Device verified successfully');
      queryClient.invalidateQueries({ queryKey: ['pendingVerifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  if (isLoading) return null;

  return (
    <Card className={users?.length > 0 ? "ring-1 ring-amber-200" : ""}>
      <CardHeader className={`flex justify-between items-center ${users?.length > 0 ? "bg-amber-50" : ""}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className={users?.length > 0 ? "text-amber-600 w-5 h-5" : "text-emerald-500 w-5 h-5"} />
          <h3 className="font-semibold text-gray-900">Device Verifications</h3>
        </div>
        {users?.length > 0 && (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
            {users.length} Pending
          </span>
        )}
      </CardHeader>
      <CardBody className="p-0">
        {!users || users.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            All user devices are verified.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="text-xs py-1 px-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => verifyMutation.mutate(user.id)}
                  loading={verifyMutation.isPending && verifyMutation.variables === user.id}
                >
                  Quick Verify
                </Button>
              </div>
            ))}
            {users.length > 5 && (
              <div className="p-3 bg-gray-50 text-center">
                <Link to="/users?isDeviceVerified=false" className="text-sm text-primary-600 font-medium inline-flex items-center gap-1 hover:text-primary-700">
                  View {users.length - 5} more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
