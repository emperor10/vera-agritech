import { useEffect, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import type { NavLink } from '../../types/content';

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
  const { content, getImage } = useContent();
  const nav = content.pages.navigation;
  // The header shows a hand-drawn placeholder mark + wordmark until a real
  // logo is uploaded to the "logo-mark" key in Admin -> Media Library, at
  // which point the uploaded image (already a full icon+wordmark lockup)
  // replaces both — showing the icon/text fallback *and* the uploaded logo
  // side by side would duplicate the brand name.
  const logo = getImage('logo-mark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!nav) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/95 shadow-[0_1px_2px_rgba(6,59,43,0.04)] backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          {logo.url ? (
            <img src={logo.url} alt={logo.altText || 'Vera AgriTech'} className="h-12 w-auto object-contain" />
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-white">
                <svg width="22" height="22" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path
                    d="M32 46c9-2 15-10 15-20 0-3-1-6-2-8-4 6-9 9-15 10-6-1-11-4-15-10-1 2-2 5-2 8 0 10 6 18 15 20z"
                    fill="#2f8f4e"
                  />
                  <path d="M32 46V22" stroke="#c98a2c" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold text-brand-950">
                Vera<span className="text-brand-600">AgriTech</span>
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.primary.map((item: NavLink) => (
            <DesktopNavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to={nav.cta.path} className="btn-primary">
            {nav.cta.label}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-brand-900 lg:hidden"
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
        <div className="border-t border-ink-100 bg-white lg:hidden">
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
            <Link to={nav.cta.path} className="btn-primary mt-2 justify-center">
              {nav.cta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
