import type { ReactNode } from 'react';

export function PageHero({
  eyebrow,
  heading,
  body,
  children,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-brand-950 to-brand-800 py-16 text-white sm:py-20">
      <div className="container-page">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow text-gold-300">{eyebrow}</p>}
          <h1 className="mt-2 text-4xl sm:text-5xl text-white">{heading}</h1>
          {body && <p className="mt-5 text-lg text-brand-100">{body}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
