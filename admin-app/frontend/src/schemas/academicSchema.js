import { z } from 'zod';

export const gradeSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  score: z.number().min(0).max(100, 'Score must be between 0 and 100'),
  term: z.string().min(1, 'Term is required'),
});

export const attendanceSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['present', 'absent', 'late'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
});

export const timetableSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  teacherName: z.string().optional(),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm'),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm'),
}).refine((data) => data.startTime < data.endTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});
