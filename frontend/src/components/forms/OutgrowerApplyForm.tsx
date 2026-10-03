import { useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, apiErrorMessage } from '../../lib/api';

const LAND_STATUS_OPTIONS = [
  { value: 'owner', label: 'Owner' },
  { value: 'leaseholder', label: 'Leaseholder' },
  { value: 'community', label: 'Family / community land' },
  { value: 'other', label: 'Other' },
];

const INTEREST_OPTIONS = [
  { value: 'outgrower_production', label: 'Outgrower production' },
  { value: 'screenhouse_production', label: 'Screenhouse production' },
  { value: 'irrigated_vegetable_production', label: 'Irrigated vegetable production' },
  { value: 'other', label: 'Other' },
];

const CONTACT_OPTIONS = [
  { value: 'phone', label: 'Phone call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
];

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  phone: z.string().min(6, 'Please enter a valid phone number.'),
  email: z.union([z.literal(''), z.string().email('Please enter a valid email address.')]).optional(),
  state: z.string().min(2, 'Please enter your state.'),
  lga: z.string().min(2, 'Please enter your LGA.'),
  preferredContact: z.string().optional(),
  farmLocation: z.string().min(2, 'Please enter your farm location.'),
  farmSize: z.string().min(1, 'Please enter your farm size.'),
  productionArea: z.string().min(1, 'Please enter the available production area.'),
  landStatus: z.string().min(1, 'Please select your land status.'),
  currentFarmingActivity: z.string().max(500).optional(),
  farmingExperience: z.string().max(500).optional(),
  preferredCrop: z.string().max(200).optional(),
  irrigationAvailable: z.boolean().optional(),
  existingInfrastructure: z.string().max(500).optional(),
  interests: z.array(z.string()).min(1, 'Please select at least one area of interest.'),
  message: z.string().max(4000).optional(),
  company_website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: FieldPath<FormValues>[][] = [
  ['fullName', 'phone', 'email', 'state', 'lga', 'preferredContact'],
  ['farmLocation', 'farmSize', 'productionArea', 'landStatus'],
  ['currentFarmingActivity', 'farmingExperience', 'preferredCrop', 'irrigationAvailable', 'existingInfrastructure'],
  ['interests', 'message'],
  [],
];

const STEP_TITLES = [
  'Personal information',
  'Farm information',
  'Production information',
  'Partnership interest',
  'Review & submit',
];

export function OutgrowerApplyForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { interests: [], irrigationAvailable: false, preferredContact: 'phone' },
  });

  const values = watch();
  const isLastStep = step === STEP_FIELDS.length - 1;

  async function next() {
    const fields = STEP_FIELDS[step];
    const ok = fields.length === 0 ? true : await trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, STEP_FIELDS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: FormValues) {
    setStatus('idle');
    try {
      const { data: res } = await api.post('/outgrower/applications', data);
      setServerMessage(res.message);
      setReferenceNo(res.referenceNo);
      setStatus('success');
      reset();
      setStep(0);
    } catch (err) {
      setServerMessage(apiErrorMessage(err));
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center text-brand-800" role="status">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Application received</p>
        <p className="mt-3 text-2xl font-bold text-brand-950">{referenceNo}</p>
        <p className="mx-auto mt-3 max-w-md text-sm">{serverMessage}</p>
        <p className="mt-4 text-xs text-brand-700">
          Participation is subject to land assessment, technical evaluation and execution of a mutually agreed
          partnership arrangement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="og-company_website">Company website</label>
        <input id="og-company_website" tabIndex={-1} autoComplete="off" {...register('company_website')} />
      </div>

      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {STEP_TITLES.map((title, i) => (
          <li
            key={title}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
              i === step
                ? 'bg-brand-900 text-white'
                : i < step
                  ? 'bg-brand-100 text-brand-800'
                  : 'bg-ink-100/60 text-ink-400'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
              {i < step ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{title}</span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="og-fullName" className="form-label">
                Full name
              </label>
              <input id="og-fullName" className="input" {...register('fullName')} />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
            </div>
            <div>
              <label htmlFor="og-phone" className="form-label">
                Phone number
              </label>
              <input id="og-phone" className="input" {...register('phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="og-email" className="form-label">
                Email address (optional)
              </label>
              <input id="og-email" type="email" className="input" {...register('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="og-contact" className="form-label">
                Preferred contact method
              </label>
              <select id="og-contact" className="input" {...register('preferredContact')}>
                {CONTACT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="og-state" className="form-label">
                State
              </label>
              <input id="og-state" className="input" {...register('state')} />
              {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
            </div>
            <div>
              <label htmlFor="og-lga" className="form-label">
                LGA
              </label>
              <input id="og-lga" className="input" {...register('lga')} />
              {errors.lga && <p className="mt-1 text-xs text-red-600">{errors.lga.message}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="og-farmLocation" className="form-label">
              Farm location
            </label>
            <input
              id="og-farmLocation"
              className="input"
              placeholder="e.g. Iwo Road, Ibadan, Oyo State"
              {...register('farmLocation')}
            />
            {errors.farmLocation && <p className="mt-1 text-xs text-red-600">{errors.farmLocation.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="og-farmSize" className="form-label">
                Farm size
              </label>
              <input id="og-farmSize" className="input" placeholder="e.g. 3 hectares" {...register('farmSize')} />
              {errors.farmSize && <p className="mt-1 text-xs text-red-600">{errors.farmSize.message}</p>}
            </div>
            <div>
              <label htmlFor="og-productionArea" className="form-label">
                Available production area
              </label>
              <input
                id="og-productionArea"
                className="input"
                placeholder="e.g. 1.5 hectares"
                {...register('productionArea')}
              />
              {errors.productionArea && <p className="mt-1 text-xs text-red-600">{errors.productionArea.message}</p>}
            </div>
          </div>
          <div>
            <p className="form-label">Land status</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {LAND_STATUS_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2.5 text-sm text-ink-700 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                >
                  <input type="radio" value={o.value} className="h-4 w-4 accent-brand-700" {...register('landStatus')} />
                  {o.label}
                </label>
              ))}
            </div>
            {errors.landStatus && <p className="mt-1 text-xs text-red-600">{errors.landStatus.message}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="og-activity" className="form-label">
              Current farming activity (optional)
            </label>
            <input id="og-activity" className="input" {...register('currentFarmingActivity')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="og-experience" className="form-label">
                Previous farming experience (optional)
              </label>
              <input id="og-experience" className="input" {...register('farmingExperience')} />
            </div>
            <div>
              <label htmlFor="og-crop" className="form-label">
                Preferred crop (optional)
              </label>
              <input id="og-crop" className="input" {...register('preferredCrop')} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-brand-950">
            <input type="checkbox" className="h-4 w-4 accent-brand-700" {...register('irrigationAvailable')} />
            Irrigation is already available on this farm
          </label>
          <div>
            <label htmlFor="og-infra" className="form-label">
              Existing infrastructure (optional)
            </label>
            <textarea id="og-infra" rows={3} className="input" {...register('existingInfrastructure')} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <p className="form-label">What are you interested in?</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {INTEREST_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2.5 text-sm text-ink-700 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                >
                  <input type="checkbox" value={o.value} className="h-4 w-4 accent-brand-700" {...register('interests')} />
                  {o.label}
                </label>
              ))}
            </div>
            {errors.interests && <p className="mt-1 text-xs text-red-600">{errors.interests.message as string}</p>}
          </div>
          <div>
            <label htmlFor="og-message" className="form-label">
              Anything else you'd like us to know? (optional)
            </label>
            <textarea id="og-message" rows={4} className="input" {...register('message')} />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3 rounded-2xl border border-ink-100 bg-ink-100/20 p-5 text-sm">
          <p className="font-semibold text-brand-950">Your application is ready for submission.</p>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <ReviewItem label="Full name" value={values.fullName} />
            <ReviewItem label="Phone" value={values.phone} />
            <ReviewItem label="Email" value={values.email || '—'} />
            <ReviewItem label="State / LGA" value={`${values.state || '—'} / ${values.lga || '—'}`} />
            <ReviewItem label="Farm location" value={values.farmLocation} />
            <ReviewItem label="Farm size" value={values.farmSize} />
            <ReviewItem label="Production area" value={values.productionArea} />
            <ReviewItem
              label="Land status"
              value={LAND_STATUS_OPTIONS.find((o) => o.value === values.landStatus)?.label || '—'}
            />
            <ReviewItem label="Preferred crop" value={values.preferredCrop || '—'} />
            <ReviewItem
              label="Interested in"
              value={
                (values.interests || [])
                  .map((v) => INTEREST_OPTIONS.find((o) => o.value === v)?.label || v)
                  .join(', ') || '—'
              }
            />
          </dl>
          <p className="text-xs text-ink-500">
            Document and site-photo upload will be requested by our team after initial review — you don't need to
            attach anything now.
          </p>
        </div>
      )}

      {status === 'error' && <p className="text-sm text-red-600">{serverMessage}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 0 ? (
          <button type="button" onClick={back} className="btn-secondary">
            Back
          </button>
        ) : (
          <span />
        )}
        {isLastStep ? (
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Submitting…' : 'Submit Outgrower Application'}
          </button>
        ) : (
          <button type="button" onClick={next} className="btn-primary">
            Continue
          </button>
        )}
      </div>

      <p className="text-xs text-ink-500">
        Submitting this application does not commit you to anything. Participation is subject to land assessment,
        technical evaluation and execution of a mutually agreed partnership arrangement.
      </p>
    </form>
  );
}

function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-ink-800">{value || '—'}</dd>
    </div>
  );
}
