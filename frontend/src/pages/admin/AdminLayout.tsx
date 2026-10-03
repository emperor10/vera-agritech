import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CONTENT_PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'theVeraModel', label: 'The Vera Model' },
  { key: 'greenhouses', label: 'Greenhouses' },
  { key: 'howItWorks', label: 'How It Works' },
  { key: 'cropsProduction', label: 'Crops & Production' },
  { key: 'financing', label: 'Financing' },
  { key: 'marketAccess', label: 'Market Access' },
  { key: 'trainingSupport', label: 'Training & Support' },
  { key: 'consulting', label: 'Consulting' },
  { key: 'aboutVera', label: 'About Vera' },
  { key: 'projects', label: 'Projects' },
  { key: 'investors', label: 'Investors' },
  { key: 'scaleUp', label: 'Scale-Up Strategy' },
  { key: 'privacy', label: 'Privacy (dates)' },
  { key: 'navigation', label: 'Navigation Menu' },
];

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-800 text-white' : 'text-brand-100 hover:bg-white/10'}`;

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-ink-100/40">
      <aside className="hidden w-72 shrink-0 flex-col bg-brand-950 p-5 text-white lg:flex">
        <div className="flex items-center gap-2 px-2">
          <span className="font-display text-base font-bold">Vera AgriTech</span>
        </div>
        <p className="mt-1 px-2 text-xs text-brand-300">Admin Panel</p>

        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          <NavLink to="/admin" end className={navItemClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/leads" className={navItemClass}>
            Leads Inbox
          </NavLink>
          <NavLink to="/admin/applications" className={navItemClass}>
            Applications
          </NavLink>
          <NavLink to="/admin/outgrower-applications" className={navItemClass}>
            Outgrower Applications
          </NavLink>

          <p className="px-3 pt-4 text-[11px] font-semibold uppercase tracking-wide text-brand-400">Collections</p>
          <NavLink to="/admin/faqs" className={navItemClass}>
            FAQs
          </NavLink>
          <NavLink to="/admin/packages" className={navItemClass}>
            Packages
          </NavLink>
          <NavLink to="/admin/crops" className={navItemClass}>
            Crops
          </NavLink>
          <NavLink to="/admin/products" className={navItemClass}>
            Products
          </NavLink>
          <NavLink to="/admin/partners" className={navItemClass}>
            Partners
          </NavLink>
          <NavLink to="/admin/testimonials" className={navItemClass}>
            Testimonials
          </NavLink>
          <NavLink to="/admin/case-studies" className={navItemClass}>
            Case Studies
          </NavLink>
          <NavLink to="/admin/blog" className={navItemClass}>
            Blog Posts
          </NavLink>
          <NavLink to="/admin/media" className={navItemClass}>
            Media Library
          </NavLink>

          <p className="px-3 pt-4 text-[11px] font-semibold uppercase tracking-wide text-brand-400">Page Content</p>
          {CONTENT_PAGES.map((p) => (
            <NavLink key={p.key} to={`/admin/content/${p.key}`} className={navItemClass}>
              {p.label}
            </NavLink>
          ))}

          <p className="px-3 pt-4 text-[11px] font-semibold uppercase tracking-wide text-brand-400">Settings</p>
          <NavLink to="/admin/settings" className={navItemClass}>
            Site Settings
          </NavLink>
        </nav>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="px-2 text-sm text-white">{admin?.name}</p>
          <p className="truncate px-2 text-xs text-brand-300">{admin?.email}</p>
          <button onClick={logout} className="btn-secondary mt-3 w-full !bg-white/10 !text-white !ring-white/20">
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-4 lg:hidden">
          <span className="font-display font-bold text-brand-950">Vera AgriTech Admin</span>
          <button onClick={logout} className="text-sm font-semibold text-brand-700">
            Log out
          </button>
        </header>
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
