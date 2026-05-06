import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { hashPassword } from '../../utils/hashPassword';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required').max(100, 'Name cannot exceed 100 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['student', 'parent'], { required_error: 'Please select a role' }),
    deviceId: z.string().min(1, 'Device ID is required'),
    childEmail: z.string().email('Please enter a valid child email').optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterForm({ onSubmit, isLoading }) {
  const [deviceIdAuto] = useState(() => {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;
    const generated = `DEV-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem('deviceId', generated);
    return generated;
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      deviceId: deviceIdAuto,
      childEmail: '',
    },
  });

  const watchRole = watch('role');

  const onFormSubmit = async (data) => {
    const hashedPassword = await hashPassword(data.password);
    const payload = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      deviceId: data.deviceId,
    };
    if (data.role === 'parent' && data.childEmail) {
      payload.childId = data.childEmail;
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        id="register-name"
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        id="register-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="register-password"
          label="Password"
          type="password"
          placeholder="Min 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          id="register-confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      {/* Role select */}
      <div className="space-y-1">
        <label htmlFor="register-role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="register-role"
          className={`
            w-full rounded-lg border px-3 py-2.5 text-sm bg-white transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${errors.role
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
            }
          `}
          {...register('role')}
        >
          <option value="">Select a role</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>
        {errors.role && (
          <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>
        )}
      </div>

      <Input
        id="register-device-id"
        label="Device ID"
        placeholder="Auto-detected"
        error={errors.deviceId?.message}
        {...register('deviceId')}
      />

      {/* Child Email (parent only) */}
      {watchRole === 'parent' && (
        <div className="animate-fade-in">
          <Input
            id="register-child-email"
            label="Child's Email (Student account)"
            type="email"
            placeholder="child@example.com"
            error={errors.childEmail?.message}
            {...register('childEmail')}
          />
          <p className="mt-1 text-xs text-gray-500">
            The student must register first before linking as a parent.
          </p>
        </div>
      )}

      <Button type="submit" loading={isLoading} className="w-full" size="lg">
        Create Account
      </Button>
    </form>
  );
}
