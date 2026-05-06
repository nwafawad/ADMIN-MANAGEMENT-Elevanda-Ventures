import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { hashPassword } from '../../utils/hashPassword';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  deviceId: z.string().min(1, 'Device ID is required'),
});

export default function LoginForm({ onSubmit, isLoading }) {
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      deviceId: deviceIdAuto,
    },
  });

  const onFormSubmit = async (data) => {
    const hashedPassword = await hashPassword(data.password);
    await onSubmit({ ...data, password: hashedPassword });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <Input
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="login-password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        id="login-device-id"
        label="Device ID"
        placeholder="Auto-detected device ID"
        error={errors.deviceId?.message}
        {...register('deviceId')}
      />
      <Button type="submit" loading={isLoading} className="w-full" size="lg">
        Sign In
      </Button>
    </form>
  );
}
