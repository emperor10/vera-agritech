import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, apiErrorMessage } from '../../lib/api';
import { useContent } from '../../context/ContentContext';
import { PlaceholderImage } from '../ui/PlaceholderImage';
import type { Product } from '../../types/content';

const schema = z.object({
  quantity: z
    .string()
    .trim()
    .min(1, 'Please enter the quantity you need.')
    .refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, 'Enter a quantity greater than zero.'),
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  phone: z.string().trim().min(6, 'Please enter a valid phone number.'),
  email: z.union([z.literal(''), z.string().email('Please enter a valid email address.')]).optional(),
  deliveryLocation: z.string().trim().min(2, 'Please tell us where to deliver.'),
  notes: z.string().max(2000).optional(),
  company_website: z.string().max(0).optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

/**
 * Product detail + order request dialog, opened by clicking a product card on
 * /products. Orders are *requests* (no online payment): the team confirms
 * price, availability and delivery with the customer, and follows each one
 * up from Admin → Product Orders. A WhatsApp shortcut is offered as well when
 * a WhatsApp number is configured in Admin → Settings.
 */
export function ProductOrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { content } = useContent();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Dialog behaviour: Esc closes, page scroll is locked while open, focus
  // moves into the dialog and returns to the card that opened it on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  async function onSubmit(values: FormValues) {
    setStatus('idle');
    try {
      const { data } = await api.post('/product-orders', {
        productId: product.id,
        quantity: `${values.quantity}${product.unit ? ` ${product.unit}` : ''}`,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || '',
        deliveryLocation: values.deliveryLocation,
        notes: values.notes || '',
        company_website: values.company_website || '',
      });
      setReferenceNo(data.referenceNo || '');
      setServerMessage(data.message || 'Thank you — your order request has been received.');
      setStatus('success');
    } catch (err) {
      setServerMessage(apiErrorMessage(err));
      setStatus('error');
    }
  }

  const whatsapp = content.settings?.whatsapp;
  const priceText = product.price
    ? `${product.price}${product.unit ? ` / ${product.unit}` : ''}`
    : 'Contact for pricing';
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        `Hello Vera AgriTech, I would like to order: ${product.name}${product.price ? ` (${priceText})` : ''}.`
      )}`
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-order-title"
        className="relative flex max-h-[100dvh] w-full max-w-3xl outline-none flex-col overflow-hidden rounded-t-2xl bg-white shadow-soft sm:max-h-[90vh] sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card transition-colors hover:bg-brand-50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid overflow-y-auto md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Product details */}
          <div className="bg-brand-50/60 p-5 sm:p-6">
            <PlaceholderImage imageKey={product.imageKey} alt={product.name} ratio="aspect-[4/3]" rounded="rounded-xl" />
            <h2 id="product-order-title" className="mt-4 text-xl">
              {product.name}
            </h2>
            <p className="stat-figure mt-1 text-lg">{priceText}</p>
            {product.description && <p className="mt-3 text-sm text-ink-500">{product.description}</p>}
            {product.specs?.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {product.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2 text-sm text-ink-700">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {spec}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Order form / confirmation */}
          <div className="p-5 sm:p-6">
            {status === 'success' ? (
              <div role="status" className="rounded-2xl border border-brand-200 bg-brand-50 p-5 text-brand-800">
                <p className="text-lg font-semibold text-brand-950">Order request received</p>
                {referenceNo && (
                  <p className="mt-3 text-sm">
                    Your reference number
                    <span className="mt-1 block font-mono text-lg font-bold tracking-wide text-brand-900">{referenceNo}</span>
                  </p>
                )}
                <p className="mt-3 text-sm">{serverMessage}</p>
                <button type="button" onClick={onClose} className="btn-primary mt-5">
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="pr-10 text-lg">Order this product</h3>
                <p className="mt-1 text-sm text-ink-500">
                  Send an order request and our team will confirm availability, final pricing and delivery with you. No
                  payment is taken online.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
                  {/* Honeypot — hidden from real users, catches simple bots */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="po_company_website">Company website</label>
                    <input id="po_company_website" tabIndex={-1} autoComplete="off" {...register('company_website')} />
                  </div>

                  <div>
                    <label htmlFor="po_quantity" className="form-label">
                      Quantity{product.unit ? ` (${product.unit})` : ''}
                    </label>
                    <input
                      id="po_quantity"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      className="input"
                      placeholder="e.g. 10"
                      {...register('quantity')}
                    />
                    {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="po_name" className="form-label">
                        Full name
                      </label>
                      <input id="po_name" autoComplete="name" className="input" {...register('fullName')} />
                      {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="po_phone" className="form-label">
                        Phone / WhatsApp
                      </label>
                      <input id="po_phone" type="tel" autoComplete="tel" className="input" {...register('phone')} />
                      {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="po_email" className="form-label">
                      Email <span className="font-normal text-ink-400">(optional)</span>
                    </label>
                    <input id="po_email" type="email" autoComplete="email" className="input" {...register('email')} />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="po_location" className="form-label">
                      Delivery location
                    </label>
                    <input
                      id="po_location"
                      autoComplete="street-address"
                      className="input"
                      placeholder="Town / area and state"
                      {...register('deliveryLocation')}
                    />
                    {errors.deliveryLocation && <p className="mt-1 text-xs text-red-600">{errors.deliveryLocation.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="po_notes" className="form-label">
                      Notes <span className="font-normal text-ink-400">(optional)</span>
                    </label>
                    <textarea id="po_notes" rows={3} className="input" {...register('notes')} />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-600" role="alert">
                      {serverMessage}
                    </p>
                  )}

                  <div className="flex flex-col gap-3">
                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                      {isSubmitting ? 'Sending…' : 'Place order request'}
                    </button>
                    {whatsappUrl && (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full">
                        Order on WhatsApp
                      </a>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
