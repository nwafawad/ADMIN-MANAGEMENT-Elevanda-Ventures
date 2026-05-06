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
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden p-4">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-200/50 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-800 shadow-xl shadow-primary-200/50 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Elevanda Ventures</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">Admin Portal - Kigali, Rwanda</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl shadow-2xl shadow-indigo-100/50 rounded-2xl border border-white/50 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500" />

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
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8 font-medium">
          &copy; {new Date().getFullYear()} Elevanda Ventures. All rights reserved.
        </p>
      </div>
    </div>
  );
}
