import type { Testimonial } from '../../types/content';
import { PlaceholderImage } from './PlaceholderImage';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card flex h-full flex-col">
      <svg className="h-8 w-8 text-gold-400" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8Zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8Z" />
      </svg>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">"{testimonial.quote}"</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <PlaceholderImage
          imageKey={testimonial.imageKey}
          alt={testimonial.name}
          ratio="aspect-square"
          rounded="rounded-full"
          className="h-11 w-11 shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-brand-950">{testimonial.name}</p>
          <p className="text-xs text-ink-500">{testimonial.location}</p>
        </div>
      </figcaption>
    </figure>
  );
}
