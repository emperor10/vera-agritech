import { useEffect, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import type { NavLink } from '../../types/content';

const GET_STARTED_OPTIONS = [
  {
    label: 'Become an Outgrower',
    description: 'Have suitable land? Partner with Vera to establish a commercial production unit on your farm.',
    path: '/outgrower',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21c6-1.5 9-6 9-12 0-1.8-.3-3.2-.7-4.3-2.4 3.6-5.4 5.4-9 6-3.6-.6-6.6-2.4-9-6C1.9 5.8 1.6 7.2 1.6 9c0 6 3 10.5 9 12z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Financing & Investment',
    description: 'Explore opportunities to participate in financing climate-smart agricultural production.',
    path: '/contact',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v10M9.5 9.3c0-1.3 1.1-2.1 2.5-2.1s2.5.8 2.5 2c0 2.2-5 1.6-5 3.8 0 1.2 1.1 2 2.5 2s2.5-.8 2.5-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Business Partnership',
    description: 'Partner with Vera on technology, distribution, infrastructure, offtake or strategic initiatives.',
    path: '/contact',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 19c0-2.8 2.2-5 5-5s5 2.2 5 5M11 19c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Talk to Vera',
    description: 'Have a question? Reach the Vera AgriTech team directly.',
    path: '/contact',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 4h3l1.5 4.5-2 1.5c.9 2.3 2.7 4.1 5 5l1.5-2L18 14v3c0 1.1-.9 2-2 2C9.4 19 5 14.6 5 8c0-1.1.9-2 2-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function GetStartedMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden xl:block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="btn-primary whitespace-nowrap" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Get Started
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 w-80 rounded-2xl border border-ink-100 bg-white p-2 shadow-soft">
          <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-400">How can we help?</p>
          {GET_STARTED_OPTIONS.map((opt) => (
            <Link
              key={opt.label}
              to={opt.path}
              className="mt-1 flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-50"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                {opt.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink-900">{opt.label}</span>
                <span className="block text-xs text-ink-500">{opt.description}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopNavItem({ item }: { item: NavLink }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <RouterNavLink to={item.path!} className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
        {item.label}
      </RouterNavLink>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className={`nav-link flex items-center gap-1 ${open ? 'is-active' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {item.label}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 w-72 rounded-2xl border border-ink-100 bg-white p-2 shadow-soft">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path!}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-800"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { content } = useContent();
  const nav = content.pages.navigation;
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!nav) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/95 shadow-[0_1px_2px_rgba(6,59,43,0.04)] backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* Brand lockup (icon + wordmark), trimmed and optimised for the header:
            no built-in whitespace padding and without the tagline / pillar
            row, which are illegible at header size. It ships with the site
            (public/brand) so it is always crisp and correctly sized. The full
            desktop nav (8 items + Get Started) needs ~1200px, so it only shows
            from xl; below that the hamburger menu is used and the logo can
            breathe. */}
        <Link to="/" aria-label="Vera AgriTech — home" className="flex shrink-0 items-center">
          <img
            src="/brand/vera-logo-lockup.png"
            alt="Vera AgriTech"
            width={1118}
            height={192}
            decoding="async"
            fetchPriority="high"
            className="h-9 w-auto min-[380px]:h-11 sm:h-14 xl:h-12 2xl:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {nav.primary.map((item: NavLink) => (
            <DesktopNavItem key={item.label} item={item} />
          ))}
        </nav>

        <GetStartedMenu />

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-brand-900 xl:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white xl:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {nav.primary.map((item: NavLink) =>
              item.children ? (
                <details key={item.label} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700">
                    {item.label}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-open:rotate-180">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <div className="ml-2 flex flex-col gap-1 border-l border-ink-100 pl-3">
                    {item.children.map((child) => (
                      <Link key={child.path} to={child.path!} className="rounded-xl px-3 py-2 text-sm text-ink-700 hover:bg-brand-50">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={item.path} to={item.path!} className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50">
                  {item.label}
                </Link>
              )
            )}
            <details className="group mt-2">
              <summary className="btn-primary w-full cursor-pointer list-none justify-center">
                Get Started
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-open:rotate-180" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="mt-2 flex flex-col gap-1 rounded-xl border border-ink-100 p-2">
                {GET_STARTED_OPTIONS.map((opt) => (
                  <Link key={opt.label} to={opt.path} className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50">
                    {opt.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      )}
    </header>
  );
}
