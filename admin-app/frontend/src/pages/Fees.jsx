import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import SearchInput from '../components/ui/SearchInput';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Fees() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionDialog, setActionDialog] = useState({ isOpen: false, type: '', tx: null });

  // Add userId lookup if search is email
  const fetchFees = async () => {
    let userId;
    if (search && search.includes('@')) {
      const usersRes = await api.get(`/users?search=${search}&limit=1`);
      if (usersRes.data.data.users.length > 0) {
        userId = usersRes.data.data.users[0].id;
      }
    }

    const params = new URLSearchParams({ page, limit: 15 });
    if (typeFilter) params.append('type', typeFilter);
    if (statusFilter) params.append('status', statusFilter);
    if (userId) params.append('userId', userId);
    
    const res = await api.get(`/fees?${params.toString()}`);
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fees', page, search, typeFilter, statusFilter],
    queryFn: fetchFees,
    keepPreviousData: true,
  });

  const { data: stats } = useQuery({
    queryKey: ['feeStats'],
    queryFn: async () => {
      const res = await api.get('/fees/stats');
      return res.data.data;
    }
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      await api.patch(`/fees/${id}/${action}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['fees']);
      queryClient.invalidateQueries(['feeStats']);
      queryClient.invalidateQueries(['dashboardStats']);
      toast.success(`Transaction ${variables.action}d successfully`);
      setActionDialog({ isOpen: false, type: '', tx: null });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Action failed');
      setActionDialog({ isOpen: false, type: '', tx: null });
    }
  });

  const handleAction = () => {
    actionMutation.mutate({ id: actionDialog.tx.id, action: actionDialog.type });
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.userId?.name}</p>
          <p className="text-xs text-gray-500">{row.userId?.email}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge color={row.type === 'deposit' ? 'emerald' : 'red'} className="uppercase">
          {row.type}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => (
        <span className="font-semibold text-gray-900">{formatCurrency(row.amount)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge color={row.status === 'pending' ? 'amber' : row.status === 'approved' ? 'emerald' : 'red'}>
          {row.status}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => formatDate(row.createdAt, true)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        if (row.status !== 'pending') {
          return <span className="text-xs text-gray-400">Processed by {row.processedBy?.name || 'Admin'}</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActionDialog({ isOpen: true, type: 'approve', tx: row })}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Approve"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActionDialog({ isOpen: true, type: 'reject', tx: row })}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Reject"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-sm text-gray-500">Approve and track all financial transactions</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search user email" 
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Table 
        columns={columns} 
        data={data?.transactions || []} 
        isLoading={isLoading} 
      />

      <Pagination 
        currentPage={page} 
        totalPages={data?.totalPages || 1} 
        onPageChange={setPage} 
      />

      <ConfirmDialog
        isOpen={actionDialog.isOpen}
        title={`${actionDialog.type === 'approve' ? 'Approve' : 'Reject'} Transaction`}
        message={`Are you sure you want to ${actionDialog.type} this ${actionDialog.tx?.type} of ${formatCurrency(actionDialog.tx?.amount || 0)} for ${actionDialog.tx?.userId?.name}?`}
        confirmLabel={actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={actionDialog.type === 'approve' ? 'success' : 'danger'}
        onConfirm={handleAction}
        onCancel={() => setActionDialog({ isOpen: false, type: '', tx: null })}
        loading={actionMutation.isPending}
      />
    </div>
  );
}
