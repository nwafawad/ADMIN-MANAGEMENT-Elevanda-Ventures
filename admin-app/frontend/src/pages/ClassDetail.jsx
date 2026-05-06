import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import TimetableGrid from '../components/academics/TimetableGrid';
import { ArrowLeft, School, GraduationCap, Users, CalendarDays, Plus, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { timetableSchema } from '../schemas/academicSchema';

export default function ClassDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isAddTimetableOpen, setIsAddTimetableOpen] = useState(false);

  const { data: classData, isLoading } = useQuery({
    queryKey: ['class', id],
    queryFn: async () => {
      const res = await api.get(`/classes/${id}`);
      return res.data.data;
    }
  });

  const { data: teachersList } = useQuery({
    queryKey: ['teachersList'],
    queryFn: async () => {
      const res = await api.get('/teachers?limit=100');
      return res.data.data.teachers;
    }
  });

  const { data: allStudents } = useQuery({
    queryKey: ['allStudents'],
    queryFn: async () => {
      // Get all students to allow adding to this class
      const res = await api.get('/users?role=student&limit=1000');
      return res.data.data.users.filter(s => s.classId?.id !== id);
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(timetableSchema),
  });

  const assignTeacherMutation = useMutation({
    mutationFn: async (teacherId) => api.patch(`/classes/${id}/assign-teacher`, { teacherId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['class', id]);
      toast.success('Teacher assigned');
    }
  });

  const addStudentMutation = useMutation({
    mutationFn: async (studentId) => api.patch(`/classes/${id}/add-student`, { studentId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['class', id]);
      queryClient.invalidateQueries(['allStudents']);
      toast.success('Student added');
    }
  });

  const removeStudentMutation = useMutation({
    mutationFn: async (studentId) => api.patch(`/classes/${id}/remove-student`, { studentId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['class', id]);
      queryClient.invalidateQueries(['allStudents']);
      toast.success('Student removed');
    }
  });

  const addTimetableMutation = useMutation({
    mutationFn: async (data) => api.post(`/classes/${id}/timetable`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['class', id]);
      toast.success('Timetable slot added');
      setIsAddTimetableOpen(false);
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add slot')
  });

  const deleteTimetableMutation = useMutation({
    mutationFn: async (slotId) => api.delete(`/classes/${id}/timetable/${slotId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['class', id]);
      toast.success('Slot deleted');
    }
  });

  const timetableByDay = useMemo(() => {
    const grouped = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };
    (classData?.timetable || []).forEach((entry) => {
      if (grouped[entry.dayOfWeek]) grouped[entry.dayOfWeek].push(entry);
    });
    return grouped;
  }, [classData?.timetable]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>;
  }

  if (!classData) return <div>Class not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/classes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <School className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Info & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Class Teacher</h3>
              </div>
            </CardHeader>
            <CardBody>
              {classData.teacher ? (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                  <p className="text-sm font-semibold text-gray-900">{classData.teacher.name}</p>
                  <p className="text-xs text-gray-500">{classData.teacher.email}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No teacher assigned.</p>
              )}
              
              <div className="flex gap-2">
                <select 
                  id="teacher-assign"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Select Teacher</option>
                  {teachersList?.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <Button 
                  onClick={() => {
                    const select = document.getElementById('teacher-assign');
                    if(select.value) assignTeacherMutation.mutate(select.value);
                  }}
                  loading={assignTeacherMutation.isPending}
                >
                  Assign
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Students ({classData.studentCount})</h3>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-2">
                <select 
                  id="student-add"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Add Student to Class</option>
                  {allStudents?.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
                <Button 
                  onClick={() => {
                    const select = document.getElementById('student-add');
                    if(select.value) addStudentMutation.mutate(select.value);
                  }}
                  loading={addStudentMutation.isPending}
                >
                  Add
                </Button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {classData.studentIds?.map(student => (
                  <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <Link to={`/users/${student.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-800">
                        {student.name}
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        {student.isDeviceVerified ? (
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <ShieldAlert className="w-3 h-3 text-amber-500" />
                        )}
                        <p className="text-xs text-gray-500">{student.isDeviceVerified ? 'Verified' : 'Pending'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeStudentMutation.mutate(student.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {classData.studentCount === 0 && (
                  <div className="p-6 text-center text-sm text-gray-500">No students enrolled.</div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Col: Timetable */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Class Timetable</h3>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setIsAddTimetableOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Slot
              </Button>
            </CardHeader>
            <CardBody>
              <TimetableGrid
                timetable={timetableByDay}
                onDelete={(slotId) => deleteTimetableMutation.mutate(slotId)}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={isAddTimetableOpen} onClose={() => { setIsAddTimetableOpen(false); reset(); }} title="Add Timetable Slot" size="md">
        <form onSubmit={handleSubmit((d) => addTimetableMutation.mutate(d))} className="space-y-4">
          <Input label="Subject" {...register('subject')} error={errors.subject?.message} placeholder="e.g. Mathematics" />
          <Input label="Teacher Name (Optional)" {...register('teacherName')} error={errors.teacherName?.message} placeholder="e.g. Mr. Smith" />
          <Select label="Day of Week" {...register('dayOfWeek')} error={errors.dayOfWeek?.message}>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time (HH:mm)" type="time" {...register('startTime')} error={errors.startTime?.message} />
            <Input label="End Time (HH:mm)" type="time" {...register('endTime')} error={errors.endTime?.message} />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsAddTimetableOpen(false)}>Cancel</Button>
            <Button type="submit" loading={addTimetableMutation.isPending}>Add Slot</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
