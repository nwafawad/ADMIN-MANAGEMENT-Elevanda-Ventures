import { z } from 'zod';

export const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  teacherId: z.string().optional(),
});
