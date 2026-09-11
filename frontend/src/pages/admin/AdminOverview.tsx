import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminOverview() {
  const [counts, setCounts] = useState({ leads: 0, newLeads: 0, applications: 0, newApplications: 0, missingImages: 0, totalImages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/leads'),
      api.get('/admin/applications'),
      api.get('/admin/images'),
    ])
      .then(([leadsRes, appsRes, imagesRes]) => {
        setCounts({
          leads: leadsRes.data.length,
          newLeads: leadsRes.data.filter((l: any) => l.status === 'new').length,
          applications: appsRes.data.length,
          newApplications: appsRes.data.filter((a: any) => a.status === 'new').length,
          missingImages: imagesRes.data.filter((i: any) => !i.url).length,
          totalImages: imagesRes.data.length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'New Leads', value: counts.newLeads, sub: `${counts.leads} total`, to: '/admin/leads' },
    { label: 'New Applications', value: counts.newApplications, sub: `${counts.applications} total`, to: '/admin/applications' },
    { label: 'Images Still Needed', value: counts.missingImages, sub: `of ${counts.totalImages} registered`, to: '/admin/media' },
  ];

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">A quick overview of what needs your attention.</p>

      {loading ? (
        <p className="mt-8 text-ink-400">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} to={card.to} className="card block">
              <p className="form-label text-ink-500">{card.label}</p>
              <p className="stat-figure mt-2 text-4xl">{card.value}</p>
              <p className="mt-1 text-xs text-ink-400">{card.sub}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
        <h2 className="text-lg text-brand-900">Getting started</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-brand-800">
          <li>Visit <strong>Media Library</strong> to upload real photos for every placeholder image on the site.</li>
          <li>Use <strong>Page Content</strong> to edit hero text, descriptions and section copy for each page.</li>
          <li>Keep <strong>Packages</strong>, <strong>Crops</strong>, <strong>FAQs</strong> and <strong>Testimonials</strong> up to date as your business grows.</li>
          <li>Check the <strong>Leads Inbox</strong> and <strong>Applications</strong> regularly and update their status as you follow up.</li>
          <li>The <strong>Calculator</strong> page stays in "coming soon" mode until Vera AgriTech supplies validated production, pricing and financing assumptions — this is intentional (see the phase 1 product rules).</li>
        </ul>
      </div>
    </div>
  );
}
