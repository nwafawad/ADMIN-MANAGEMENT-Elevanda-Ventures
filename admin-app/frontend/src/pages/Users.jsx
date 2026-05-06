import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import SearchInput from '../components/ui/SearchInput';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { Eye, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Users() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, user: null });

  const fetchUsers = async () => {
    const params = new URLSearchParams({ page, limit: 15 });
    if (search) params.append('search', search);
    if (roleFilter) params.append('role', roleFilter);
    if (verificationFilter) params.append('isDeviceVerified', verificationFilter === 'verified' ? 'true' : 'false');
    
    const res = await api.get(`/users?${params.toString()}`);
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search, roleFilter, verificationFilter],
    queryFn: fetchUsers,
    keepPreviousData: true,
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, verified }) => {
      await api.patch(`/users/${id}/verify-device`, { verified });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Device status updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
      setDeleteDialog({ isOpen: false, user: null });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      setDeleteDialog({ isOpen: false, user: null });
    }
  });

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => {
        const colors = { student: 'blue', parent: 'purple', teacher: 'green', admin: 'red' };
        return <Badge color={colors[row.role]} className="capitalize">{row.role}</Badge>;
      }
    },
    {
      key: 'device',
      label: 'Device Status',
      render: (row) => (
        <button 
          onClick={() => verifyMutation.mutate({ id: row.id, verified: !row.isDeviceVerified })}
          disabled={verifyMutation.isPending}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
            row.isDeviceVerified 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 group' 
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
          }`}
        >
          {row.isDeviceVerified ? (
            <><ShieldCheck className="w-3.5 h-3.5 group-hover:hidden" /><span className="group-hover:hidden">Verified</span><span className="hidden group-hover:inline">Revoke</span></>
          ) : (
            <><ShieldAlert className="w-3.5 h-3.5" />Verify Now</>
          )}
        </button>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) => formatDate(row.createdAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/users/${row.id}`} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
            <Eye className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setDeleteDialog({ isOpen: true, user: row })}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage students, parents, and staff</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search by name or email" 
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
          value={verificationFilter}
          onChange={(e) => { setVerificationFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="verified">Verified Devices</option>
          <option value="pending">Pending Devices</option>
        </select>
      </div>

      <Table 
        columns={columns} 
        data={data?.users?.map(u => ({...u, isRowHighlighted: !u.isDeviceVerified})) || []} 
        isLoading={isLoading} 
      />

      <Pagination 
        currentPage={page} 
        totalPages={data?.totalPages || 1} 
        onPageChange={setPage} 
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteDialog.user?.name}? This action cannot be undone and will remove all associated data (grades, attendance, fees).`}
        confirmLabel="Delete User"
        confirmColor="danger"
        onConfirm={() => deleteMutation.mutate(deleteDialog.user?.id)}
        onCancel={() => setDeleteDialog({ isOpen: false, user: null })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
