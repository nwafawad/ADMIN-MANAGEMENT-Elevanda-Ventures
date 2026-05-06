import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';
import { BookOpen, UserCheck, CalendarDays, Search, Users } from 'lucide-react';
import { gradeSchema, attendanceSchema } from '../schemas/academicSchema';
import Badge from '../components/ui/Badge';
import { computeGrade, gradeColorMap } from '../utils/gradeCompute';

export default function Academics() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('grades'); // 'grades' or 'attendance'
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Modals
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isBulkAttendanceOpen, setIsBulkAttendanceOpen] = useState(false);

  // Forms
  const { register: regGrade, handleSubmit: handleGradeSubmit, reset: resetGrade, watch: watchGrade, formState: { errors: gradeErrors } } = useForm({
    resolver: zodResolver(gradeSchema),
  });
    const watchedScore = watchGrade('score');
    const computedGrade = Number.isFinite(watchedScore) ? computeGrade(watchedScore) : null;

  
  const { register: regAtt, handleSubmit: handleAttSubmit, reset: resetAtt, formState: { errors: attErrors } } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0] }
  });

  // Queries
  const { data: classesList } = useQuery({
    queryKey: ['classesList'],
    queryFn: async () => {
      const res = await api.get('/classes?limit=100');
      return res.data.data.classes;
    }
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', selectedClassId, search],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: 100 });
      if (selectedClassId) params.append('classId', selectedClassId);
      if (search) params.append('search', search);
      const res = await api.get(`/academics/students?${params.toString()}`);
      return res.data.data;
    }
  });

  // Mutations
  const gradeMutation = useMutation({
    mutationFn: async (data) => api.patch(`/academics/grades/${selectedStudent.id}`, { ...data, classId: selectedStudent.classId?.id }),
    onSuccess: () => {
      toast.success('Grade recorded successfully');
      setIsGradeModalOpen(false);
      resetGrade();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to record grade')
  });

  const attendanceMutation = useMutation({
    mutationFn: async (data) => api.patch(`/academics/attendance/${selectedStudent.id}`, { ...data, classId: selectedStudent.classId?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboardStats']);
      toast.success('Attendance recorded successfully');
      setIsAttendanceModalOpen(false);
      resetAtt();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to record attendance')
  });

  const bulkAttendanceMutation = useMutation({
    mutationFn: async (data) => api.post('/academics/attendance/bulk', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboardStats']);
      toast.success('Bulk attendance recorded successfully');
      setIsBulkAttendanceOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to record bulk attendance')
  });

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    const date = e.target.date.value;
    const records = [];
    students.forEach(s => {
      const status = e.target[`status-${s.id}`].value;
      records.push({ studentId: s.id, status });
    });
    bulkAttendanceMutation.mutate({ classId: selectedClassId, date, records });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Management</h1>
          <p className="text-sm text-gray-500">Record grades and track student attendance</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <Select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-gray-50"
            >
              <option value="">All Classes</option>
              {classesList?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div className="w-full sm:w-2/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search student by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 bg-gray-50 outline-none"
            />
          </div>
        </CardBody>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('grades')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'grades' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4 inline-block mr-2" />
              Grades Entry
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'attendance' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserCheck className="w-4 h-4 inline-block mr-2" />
              Attendance
            </button>
          </div>
          
          {activeTab === 'attendance' && selectedClassId && (
            <Button size="sm" onClick={() => setIsBulkAttendanceOpen(true)}>
              Mark Class Attendance
            </Button>
          )}
        </CardHeader>
        
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading students...</div>
          ) : students?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">No students found</h3>
              <p className="text-xs text-gray-500 mt-1">Try selecting a different class or clear your search.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {students?.map(student => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">
                      {student.classId?.name || 'Unassigned'} • {student.email}
                    </p>
                  </div>
                  <div>
                    {activeTab === 'grades' ? (
                      <Button size="sm" variant="secondary" onClick={() => { setSelectedStudent(student); setIsGradeModalOpen(true); }}>
                        Record Grade
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => { setSelectedStudent(student); setIsAttendanceModalOpen(true); }}>
                        Mark Attendance
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Grade Modal */}
      <Modal isOpen={isGradeModalOpen} onClose={() => { setIsGradeModalOpen(false); resetGrade(); }} title={`Record Grade: ${selectedStudent?.name}`} size="md">
        <form onSubmit={handleGradeSubmit((d) => gradeMutation.mutate(d))} className="space-y-4">
          <Input label="Subject" {...regGrade('subject')} error={gradeErrors.subject?.message} placeholder="e.g. Mathematics" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Score (0-100)" type="number" {...regGrade('score', { valueAsNumber: true })} error={gradeErrors.score?.message} />
            <Input label="Term/Semester" {...regGrade('term')} error={gradeErrors.term?.message} placeholder="e.g. Term 1" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Letter Grade</p>
              <p className="text-xs text-gray-400">A &gt;= 80, B &gt;= 70, C &gt;= 60, D &gt;= 50</p>
            </div>
            <Badge color={computedGrade ? gradeColorMap[computedGrade] : 'gray'}>
              {computedGrade || 'N/A'}
            </Badge>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsGradeModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={gradeMutation.isPending}>Save Grade</Button>
          </div>
        </form>
      </Modal>

      {/* Individual Attendance Modal */}
      <Modal isOpen={isAttendanceModalOpen} onClose={() => { setIsAttendanceModalOpen(false); resetAtt(); }} title={`Mark Attendance: ${selectedStudent?.name}`} size="md">
        <form onSubmit={handleAttSubmit((d) => attendanceMutation.mutate(d))} className="space-y-4">
          <Input label="Date" type="date" {...regAtt('date')} error={attErrors.date?.message} />
          <Select label="Status" {...regAtt('status')} error={attErrors.status?.message}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </Select>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsAttendanceModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={attendanceMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Attendance Modal */}
      <Modal isOpen={isBulkAttendanceOpen} onClose={() => setIsBulkAttendanceOpen(false)} title={`Bulk Attendance: ${classesList?.find(c=>c.id===selectedClassId)?.name}`} size="2xl">
        <form onSubmit={handleBulkSubmit} className="space-y-6">
          <div className="w-1/3">
            <Input label="Date" type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg max-h-[50vh] overflow-y-auto">
            {students?.map(student => (
              <div key={student.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-900">{student.name}</span>
                <div className="flex gap-4">
                  {['present', 'absent', 'late'].map(status => (
                    <label key={status} className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`status-${student.id}`} 
                        value={status} 
                        defaultChecked={status === 'present'}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsBulkAttendanceOpen(false)}>Cancel</Button>
            <Button type="submit" loading={bulkAttendanceMutation.isPending}>Save All Records</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
