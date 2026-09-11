import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, apiErrorMessage } from '../../lib/api';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().max(4000).optional(),
  company_website: z.string().max(0).optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

export function ContactForm({ sourcePage = 'contact' }: { sourcePage?: string }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setStatus('idle');
    try {
      const { data } = await api.post('/leads', { ...values, sourcePage });
      setServerMessage(data.message || 'Thank you — we will be in touch shortly.');
      setStatus('success');
      reset();
    } catch (err) {
      setServerMessage(apiErrorMessage(err));
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-brand-800" role="status">
        <p className="font-semibold">Message sent</p>
        <p className="mt-1 text-sm">{serverMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Honeypot — hidden from real users, catches simple bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" tabIndex={-1} autoComplete="off" {...register('company_website')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="form-label">
            Full name
          </label>
          <input id="name" className="input" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input id="email" type="email" className="input" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="form-label">
            Phone / WhatsApp
          </label>
          <input id="phone" className="input" {...register('phone')} />
        </div>
        <div>
          <label htmlFor="interest" className="form-label">
            What are you interested in?
          </label>
          <select id="interest" className="input" {...register('interest')}>
            <option value="">Select an option</option>
            <option value="Screen house / greenhouse package">Screen house / greenhouse package</option>
            <option value="Training & Academy">Training & Academy</option>
            <option value="Agribusiness consulting">Agribusiness consulting</option>
            <option value="Investment / partnership">Investment / partnership</option>
            <option value="General enquiry">General enquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea id="message" rows={4} className="input" {...register('message')} />
      </div>

      {status === 'error' && <p className="text-sm text-red-600">{serverMessage}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
