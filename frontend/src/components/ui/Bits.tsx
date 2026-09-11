import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  heading,
  body,
  center = false,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 text-3xl sm:text-4xl">{heading}</h2>
      {body && <p className="mt-4 text-lg text-ink-500">{body}</p>}
    </div>
  );
}

export function StatCard({
  value,
  label,
  icon,
  variant = 'dark',
}: {
  value: string;
  label: string;
  icon?: ReactNode;
  /** 'dark' (default): white text on a translucent dark hero background —
   *  see TrainingSupport. 'light': dark text for the Home floating stats
   *  bar, which sits on a light-green card instead of a dark hero. */
  variant?: 'dark' | 'light';
}) {
  const isLight = variant === 'light';
  return (
    <div
      className={
        isLight
          ? 'flex flex-col items-center gap-2 text-center'
          : 'rounded-2xl bg-white/10 px-4 py-6 text-center backdrop-blur-sm ring-1 ring-white/15'
      }
    >
      {icon && (
        <span
          className={
            isLight
              ? 'flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700'
              : 'flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white'
          }
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <p className={`stat-figure text-3xl sm:text-4xl ${isLight ? 'text-brand-950' : 'text-white'}`}>{value}</p>
      <p className={`text-sm ${isLight ? 'text-ink-500' : 'mt-1 text-brand-100'}`}>{label}</p>
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}

export function StepNumberList({ items }: { items: { title: string; description: string }[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.title} className="card relative">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white">
            {i + 1}
          </span>
          <h3 className="mt-4 text-lg">{item.title}</h3>
          <p className="mt-2 text-sm text-ink-500">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

export function CtaBanner({
  heading,
  body,
  ctaLabel,
  ctaPath,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaPath: string;
}) {
  return (
    <div className="section-py bg-brand-950">
      <div className="container-page">
        <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-950 px-6 py-14 text-center ring-1 ring-brand-700 sm:px-16">
          <h2 className="text-3xl text-white sm:text-4xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">{body}</p>
          <div className="mt-8">
            <Link to={ctaPath} className="btn-primary">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
