import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
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
import { Plus, Trash2, Eye, School } from 'lucide-react';
import { classSchema } from '../schemas/classSchema';

export default function Classes() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, classData: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classSchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['classes', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      const res = await api.get(`/classes?${params.toString()}`);
      return res.data.data;
    },
    keepPreviousData: true,
  });

  const { data: teachersList } = useQuery({
    queryKey: ['teachersList'],
    queryFn: async () => {
      const res = await api.get('/teachers?limit=100');
      return res.data.data.teachers;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data };
      if (!payload.teacherId) delete payload.teacherId;
      const res = await api.post('/classes', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
      queryClient.invalidateQueries(['dashboardStats']);
      toast.success('Class created successfully');
      setIsAddModalOpen(false);
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create class');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
      queryClient.invalidateQueries(['dashboardStats']);
      toast.success('Class deleted');
      setDeleteDialog({ isOpen: false, classData: null });
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const columns = [
    {
      key: 'name',
      label: 'Class Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <School className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-900">{row.name}</span>
        </div>
      )
    },
    {
      key: 'teacher',
      label: 'Assigned Teacher',
      render: (row) => row.teacher ? (
        <div>
          <p className="font-medium text-gray-900">{row.teacher.name}</p>
        </div>
      ) : (
        <span className="text-sm text-gray-400">Unassigned</span>
      )
    },
    {
      key: 'students',
      label: 'Students',
      render: (row) => (
        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-100">
          {row.studentCount}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      render: (row) => formatDate(row.createdAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/classes/${row.id}`} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
            <Eye className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setDeleteDialog({ isOpen: true, classData: row })}
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
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500">Manage classrooms, students, and schedules</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Class
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="w-full sm:w-72">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search class name" 
          />
        </div>
      </div>

      <Table 
        columns={columns} 
        data={data?.classes || []} 
        isLoading={isLoading} 
      />

      <Pagination 
        currentPage={page} 
        totalPages={data?.totalPages || 1} 
        onPageChange={setPage} 
      />

      {/* Create Class Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); reset(); }} title="Create New Class" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Class Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g. Grade 10 A"
          />
          <Select
            label="Assign Teacher (Optional)"
            {...register('teacherId')}
            error={errors.teacherId?.message}
          >
            <option value="">-- No Teacher Assigned --</option>
            {teachersList?.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.classId ? `Currently in ${t.classId.name}` : 'Unassigned'})</option>
            ))}
          </Select>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Create Class</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Class"
        message={`Are you sure you want to delete ${deleteDialog.classData?.name}? This will remove all timetable entries and unassign all students and teachers.`}
        confirmLabel="Delete"
        confirmColor="danger"
        onConfirm={() => deleteMutation.mutate(deleteDialog.classData?.id)}
        onCancel={() => setDeleteDialog({ isOpen: false, classData: null })}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
