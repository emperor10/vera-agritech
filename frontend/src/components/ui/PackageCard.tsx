import { Link } from 'react-router-dom';
import type { Package } from '../../types/content';

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div
      className={`card flex flex-col ${pkg.popular ? 'ring-2 ring-gold-500' : ''}`}
    >
      {pkg.popular && (
        <span className="badge mb-4 w-fit bg-gold-100 text-gold-700">Most Popular</span>
      )}
      <h3 className="text-xl">{pkg.name}</h3>
      <p className="mt-1 text-sm font-semibold text-brand-700">{pkg.area}</p>
      <p className="mt-3 text-sm text-ink-500">{pkg.bestFor}</p>

      <dl className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">Estimated cost</dt>
          <dd className="font-semibold text-brand-950">{pkg.costRange}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">Expected annual turnover</dt>
          <dd className="font-semibold text-brand-950">{pkg.turnoverRange}</dd>
        </div>
      </dl>

      {pkg.includes?.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm text-ink-700">
          {pkg.includes.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L8.3 11.6l6.3-6.3a1 1 0 0 1 1.4 0Z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link to="/get-started" className="btn-secondary w-full">
          Apply for this package
          <svg className="card-arrow h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h9M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
