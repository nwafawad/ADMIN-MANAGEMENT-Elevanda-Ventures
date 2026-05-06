import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import { gradeColorMap } from '../utils/gradeCompute';
import { ArrowLeft, School, ShieldCheck, ShieldAlert, GraduationCap, Users } from 'lucide-react';

export default function UserDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [linkEmail, setLinkEmail] = useState('');

  // 1. Fetch User Data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data.data;
    }
  });

  // 2. Fetch Classes for dropdown
  const { data: classesData } = useQuery({
    queryKey: ['classesList'],
    queryFn: async () => {
      const res = await api.get('/classes?limit=100');
      return res.data.data.classes;
    },
    enabled: user?.role === 'student',
  });

  // 3. Fetch specific data based on role
  const { data: fees } = useQuery({
    queryKey: ['fees', id],
    queryFn: async () => {
      const res = await api.get(`/fees?userId=${id}`);
      return res.data.data;
    },
    enabled: !!user && (user.role === 'student' || user.role === 'parent'),
  });

  const { data: grades } = useQuery({
    queryKey: ['grades', id],
    queryFn: async () => {
      const res = await api.get(`/academics/grades/${id}`);
      return res.data.data;
    },
    enabled: user?.role === 'student',
  });

  const { data: attendance } = useQuery({
    queryKey: ['attendance', id],
    queryFn: async () => {
      const res = await api.get(`/academics/attendance/${id}`);
      return res.data.data;
    },
    enabled: user?.role === 'student',
  });

  // Mutations
  const verifyMutation = useMutation({
    mutationFn: async (verified) => api.patch(`/users/${id}/verify-device`, { verified }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', id]);
      toast.success('Device status updated');
    }
  });

  const assignClassMutation = useMutation({
    mutationFn: async (classId) => api.patch(`/users/${id}/assign-class`, { classId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', id]);
      toast.success('Class assigned successfully');
    }
  });

  const linkChildMutation = useMutation({
    mutationFn: async () => api.patch(`/users/${id}/link-child`, { childEmail: linkEmail }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', id]);
      setLinkEmail('');
      toast.success('Child linked successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to link child')
  });

  if (userLoading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>;
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/users" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <Badge color={
                    user.role === 'student' ? 'blue' : 
                    user.role === 'parent' ? 'purple' : 
                    user.role === 'teacher' ? 'green' : 'red'
                  } className="capitalize mt-1">
                    {user.role}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-sm text-gray-900 mt-1">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Joined</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(user.createdAt, true)}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Device Status</p>
                  <div className="flex items-center justify-between">
                    {user.isDeviceVerified ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                        <ShieldCheck className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-medium">
                        <ShieldAlert className="w-4 h-4" /> Pending
                      </span>
                    )}
                    <Button 
                      size="sm" 
                      variant={user.isDeviceVerified ? "secondary" : "primary"}
                      onClick={() => verifyMutation.mutate(!user.isDeviceVerified)}
                      loading={verifyMutation.isPending}
                    >
                      {user.isDeviceVerified ? 'Revoke' : 'Verify'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <School className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Class Assignment</h3>
                </div>
              </CardHeader>
              <CardBody>
                {user.classId ? (
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                      {user.classId.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No class assigned currently.</p>
                )}
                
                <div className="flex gap-2">
                  <select 
                    id="class-assign"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Class</option>
                    {classesData?.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <Button 
                    onClick={() => {
                      const select = document.getElementById('class-assign');
                      if(select.value) assignClassMutation.mutate(select.value);
                    }}
                    loading={assignClassMutation.isPending}
                  >
                    Assign
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {user.role === 'parent' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Linked Student</h3>
                </div>
              </CardHeader>
              <CardBody>
                {user.childId ? (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                    <p className="text-sm font-semibold text-gray-900">{user.childId.name}</p>
                    <p className="text-xs text-gray-500">{user.childId.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No child linked yet.</p>
                )}
                
                <div className="space-y-3">
                  <Input 
                    placeholder="Student Email Address" 
                    value={linkEmail} 
                    onChange={e => setLinkEmail(e.target.value)} 
                  />
                  <Button 
                    className="w-full" 
                    onClick={() => linkChildMutation.mutate()}
                    disabled={!linkEmail}
                    loading={linkChildMutation.isPending}
                  >
                    Link Student
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: Tabular Data */}
        <div className="lg:col-span-2 space-y-6">
          
          {(user.role === 'student' || user.role === 'parent') && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Recent Fee Transactions</h3>
              </CardHeader>
              <CardBody className="p-0">
                {fees?.transactions?.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {fees.transactions.slice(0, 5).map(tx => (
                      <div key={tx.id} className="p-4 flex items-center justify-between">
                        <div>
                          <Badge color={tx.type === 'deposit' ? 'emerald' : 'red'}>
                            {tx.type.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-2">{formatDate(tx.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(tx.amount)}</p>
                          <Badge color={tx.status === 'approved' ? 'emerald' : tx.status === 'pending' ? 'amber' : 'red'} className="mt-1">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-gray-500">No transactions recorded.</div>
                )}
              </CardBody>
            </Card>
          )}

          {user.role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Recent Grades</h3>
                </CardHeader>
                <CardBody className="p-0">
                  {grades?.length > 0 ? (
                    <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                      {grades.slice(0, 5).map(g => (
                        <div key={g.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{g.subject}</p>
                            <p className="text-xs text-gray-500">{g.term}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-700">{g.score}%</span>
                            <Badge color={gradeColorMap[g.grade]}>{g.grade}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-500">No grades recorded.</div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Attendance Summary</h3>
                </CardHeader>
                <CardBody>
                  {attendance?.summary ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Rate</span>
                        <span className={`text-lg font-bold ${attendance.summary.attendanceRate > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {attendance.summary.attendanceRate}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 border border-gray-100 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Present</p>
                          <p className="font-bold text-emerald-600">{attendance.summary.present}</p>
                        </div>
                        <div className="p-2 border border-gray-100 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Absent</p>
                          <p className="font-bold text-red-600">{attendance.summary.absent}</p>
                        </div>
                        <div className="p-2 border border-gray-100 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Late</p>
                          <p className="font-bold text-amber-600">{attendance.summary.late}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No attendance data.</div>
                  )}
                </CardBody>
              </Card>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
