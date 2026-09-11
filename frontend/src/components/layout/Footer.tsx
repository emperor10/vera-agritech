import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';

const solutionsLinks = [
  { label: 'Screen House Engineering', path: '/solutions/greenhouses' },
  { label: 'Hydroponics Kits', path: '/solutions/greenhouses' },
  { label: 'Produce Sales / Offtake', path: '/solutions/market-access' },
  { label: 'Academy Training', path: '/training-support' },
  { label: 'Agribusiness Consulting', path: '/consulting' },
];

const companyLinks = [
  { label: 'About Our Vision', path: '/about' },
  { label: 'The Vera Model', path: '/the-vera-model' },
  { label: 'Case Studies', path: '/projects' },
  { label: 'Business Model Canvas', path: '/business-model' },
  { label: 'Investors & Partners', path: '/investors' },
  { label: 'Insights & Blog', path: '/resources' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy' },
];

export function Footer() {
  const { content } = useContent();
  const s = content.settings;

  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-lg font-bold text-white">
            Vera<span className="text-gold-400">AgriTech</span>
          </Link>
          <p className="mt-4 text-sm text-brand-200">{s.footerTagline}</p>
          <div className="mt-5 flex gap-3">
            {[
              { href: s.social?.facebook, label: 'Facebook' },
              { href: s.social?.instagram, label: 'Instagram' },
              { href: s.social?.twitter, label: 'X (Twitter)' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <span className="text-xs font-semibold">{social.label[0]}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Solutions</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {solutionsLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="text-brand-200 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.path} className="text-brand-200 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-200">
            <li>{s.address}</li>
            <li>
              <a href={`mailto:${s.email}`} className="hover:text-white">
                {s.email}
              </a>
            </li>
            <li>
              <a href={`tel:${s.phone?.replace(/\s/g, '')}`} className="hover:text-white">
                {s.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {s.copyrightYear} {s.companyName} All rights reserved.
          </p>
          <p>
            Founder: {s.founder} · Ibadan, Oyo State, Nigeria ·{' '}
            <Link to="/admin/login" className="underline decoration-dotted hover:text-white">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
