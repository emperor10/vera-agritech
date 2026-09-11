import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, apiErrorMessage } from '../../lib/api';
import { useContent } from '../../context/ContentContext';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(6, 'Please enter a valid phone number.'),
  location: z.string().optional(),
  packageInterest: z.string().optional(),
  financingInterest: z.string().optional(),
  message: z.string().max(4000).optional(),
  company_website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export function ApplyForm() {
  const { content } = useContent();
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
      const { data } = await api.post('/applications', values);
      setServerMessage(data.message);
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
        <p className="font-semibold">Application received</p>
        <p className="mt-1 text-sm">{serverMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website2">Company website</label>
        <input id="company_website2" tabIndex={-1} autoComplete="off" {...register('company_website')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="a-name" className="form-label">
            Full name
          </label>
          <input id="a-name" className="input" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="a-email" className="form-label">
            Email address
          </label>
          <input id="a-email" type="email" className="input" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="a-phone" className="form-label">
            Phone / WhatsApp
          </label>
          <input id="a-phone" className="input" {...register('phone')} />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="a-location" className="form-label">
            City / location
          </label>
          <input id="a-location" className="input" {...register('location')} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="a-package" className="form-label">
            Package of interest
          </label>
          <select id="a-package" className="input" {...register('packageInterest')}>
            <option value="">Not sure yet</option>
            {content.packages.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.area})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="a-financing" className="form-label">
            Financing interest
          </label>
          <select id="a-financing" className="input" {...register('financingInterest')}>
            <option value="">Not sure yet</option>
            <option value="Full upfront payment">Full upfront payment</option>
            <option value="Pay-As-You-Grow financing">Pay-As-You-Grow financing</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="a-message" className="form-label">
          Tell us a bit more (optional)
        </label>
        <textarea id="a-message" rows={4} className="input" {...register('message')} />
      </div>

      {status === 'error' && <p className="text-sm text-red-600">{serverMessage}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? 'Submitting…' : 'Submit application'}
      </button>
      <p className="text-xs text-ink-500">
        Submitting this form does not commit you to anything. A member of the Vera AgriTech team will contact you to
        discuss next steps.
      </p>
    </form>
  );
}
