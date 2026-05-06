import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { School, Lock, Mail } from 'lucide-react';
import { loginSchema } from '../schemas/loginSchema';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { hashPassword } from '../utils/hashPassword';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody } from '../components/ui/Card';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 1. Double-hash protocol: front-end SHA-512
      const hashedPassword = await hashPassword(data.password);
      
      // 2. Send to backend
      const res = await api.post('/auth/login', {
        email: data.email,
        password: hashedPassword,
      });

      await login(res.data.data);
      toast.success('Welcome back to Admin Portal');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-primary-50 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-800 shadow-xl shadow-primary-200 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Elevanda Admin</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Secure School Management Portal</p>
        </div>

        <Card className="shadow-2xl shadow-indigo-100/50 border-0 ring-1 ring-gray-100 backdrop-blur-xl bg-white/90">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="admin@elevanda.com"
                  {...register('email')}
                  error={errors.email?.message}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                  className="pl-10"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base shadow-lg shadow-primary-200 mt-2"
                loading={isLoading}
              >
                Sign into Portal
              </Button>
            </form>
          </CardBody>
        </Card>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Elevanda Ventures. All rights reserved.
        </p>
      </div>
    </div>
  );
}
