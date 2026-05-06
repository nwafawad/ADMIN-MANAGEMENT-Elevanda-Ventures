import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SearchInput from '../components/ui/SearchInput';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { teacherSchema } from '../schemas/teacherSchema';

export default function Teachers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, teacher: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherSchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['teachers', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      const res = await api.get(`/teachers?${params.toString()}`);
      return res.data.data;
    },
    keepPreviousData: true,
  });

  const { data: classesList } = useQuery({
    queryKey: ['classesList'],
    queryFn: async () => {
      const res = await api.get('/classes?limit=100');
      return res.data.data.classes;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // NOTE: Admin creates teacher, but we MUST send plain password to backend for hashing
      // Actually, per our req, client-app frontend SHA-512 hashes. 
      // We simulate that so the admin backend logic receives the exact same payload shape.
      const { hashPassword } = await import('../utils/hashPassword');
      const hashedPassword = await hashPassword(data.password);
      
      const payload = { ...data, password: hashedPassword };
      if (!payload.classId) delete payload.classId;
      
      const res = await api.post('/teachers', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      queryClient.invalidateQueries(['dashboardStats']);
      toast.success('Teacher created successfully');
      setIsAddModalOpen(false);
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create teacher');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/teachers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      queryClient.invalidateQueries(['dashboardStats']);
      toast.success('Teacher deleted');
      setDeleteDialog({ isOpen: false, teacher: null });
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const columns = [
    {
      key: 'name',
      label: 'Teacher',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      key: 'class',
      label: 'Assigned Class',
      render: (row) => row.classId ? (
        <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
          {row.classId.name}
        </span>
      ) : (
        <span className="text-sm text-gray-400">Unassigned</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Added Date',
      render: (row) => formatDate(row.createdAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDeleteDialog({ isOpen: true, teacher: row })}
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
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-sm text-gray-500">Manage teaching staff and class assignments</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Teacher
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="w-full sm:w-72">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search teacher by name or email" 
          />
        </div>
      </div>

      <Table 
        columns={columns} 
        data={data?.teachers || []} 
        isLoading={isLoading} 
      />

      <Pagination 
        currentPage={page} 
        totalPages={data?.totalPages || 1} 
        onPageChange={setPage} 
      />

      {/* Add Teacher Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); reset(); }} title="Add New Teacher" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Jane Doe"
          />
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="jane@elevanda.com"
          />
          <Input
            label="Initial Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="Min 8 characters"
          />
          <Select
            label="Assign to Class (Optional)"
            {...register('classId')}
            error={errors.classId?.message}
          >
            <option value="">-- No Class Assignment --</option>
            {classesList?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Create Teacher</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${deleteDialog.teacher?.name}? They will be removed from any assigned classes.`}
        confirmLabel="Delete"
        confirmColor="danger"
        onConfirm={() => deleteMutation.mutate(deleteDialog.teacher?.id)}
        onCancel={() => setDeleteDialog({ isOpen: false, teacher: null })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
