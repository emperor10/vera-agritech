import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { apiErrorMessage } from '../../lib/api';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (admin) return <Navigate to="/admin" replace />;

  async function onSubmit(values: FormValues) {
    setError('');
    try {
      await login(values.email, values.password);
      navigate('/admin');
    } catch (err) {
      setError(apiErrorMessage(err, 'Invalid email or password.'));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-white">
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path
                d="M32 46c9-2 15-10 15-20 0-3-1-6-2-8-4 6-9 9-15 10-6-1-11-4-15-10-1 2-2 5-2 8 0 10 6 18 15 20z"
                fill="#2f8f4e"
              />
            </svg>
          </span>
          <span className="font-display text-lg font-bold text-brand-950">Vera AgriTech Admin</span>
        </div>
        <h1 className="mt-6 text-2xl">Sign in</h1>
        <p className="mt-1 text-sm text-ink-500">Manage site content, media, leads and applications.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input id="email" type="email" className="input" {...register('email')} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input id="password" type="password" className="input" {...register('password')} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
