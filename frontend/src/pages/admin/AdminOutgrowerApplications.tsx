import { Fragment, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface OutgrowerApplication {
  id: number;
  reference_no: string;
  full_name: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  preferred_contact: string;
  farm_location: string;
  farm_size: string;
  production_area: string;
  land_status: string;
  current_farming_activity: string;
  farming_experience: string;
  preferred_crop: string;
  irrigation_available: number;
  existing_infrastructure: string;
  interests_json: string;
  message: string;
  status: string;
  created_at: string;
}

// Mirrors the programme's own stated pipeline (see the /outgrower page's
// "How It Works" section) rather than the generic new/reviewing/approved
// used by the simpler Applications inbox.
const STATUSES = [
  'new',
  'farm_assessment',
  'technical_commercial_evaluation',
  'partnership_discussion',
  'agreement_documentation',
  'deployed',
  'declined',
];

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  farm_assessment: 'Farm & Land Assessment',
  technical_commercial_evaluation: 'Technical & Commercial Evaluation',
  partnership_discussion: 'Partnership Discussion',
  agreement_documentation: 'Agreement & Documentation',
  deployed: 'Deployment & Production',
  declined: 'Declined',
};

function parseInterests(json: string): string[] {
  try {
    const parsed = JSON.parse(json || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AdminOutgrowerApplications() {
  const [rows, setRows] = useState<OutgrowerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    api
      .get('/admin/outgrower-applications')
      .then(({ data }) => setRows(data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id: number, status: string) {
    await api.patch(`/admin/outgrower-applications/${id}`, { status });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  async function remove(id: number) {
    if (!confirm('Delete this outgrower application permanently?')) return;
    await api.delete(`/admin/outgrower-applications/${id}`);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Outgrower Applications</h1>
      <p className="mt-1 text-sm text-ink-500">
        Applications submitted through the Vera Outgrower Partnership Programme form on /outgrower.
      </p>

      {loading ? (
        <p className="mt-8 text-ink-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-ink-400">No outgrower applications yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-ink-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Farm location</th>
                <th className="px-4 py-3">Land status</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-brand-800">{row.reference_no || '—'}</td>
                    <td className="px-4 py-3 text-ink-400">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                        className="text-left font-semibold text-brand-950 hover:underline"
                      >
                        {row.full_name}
                      </button>
                      <div className="text-xs text-ink-400">
                        {row.phone}
                        {row.email ? ` · ${row.email}` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-700">{row.farm_location || '—'}</td>
                    <td className="px-4 py-3 text-ink-700">{row.land_status || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        className="rounded-lg border border-ink-100 px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s] || s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(row.id)} className="text-xs font-semibold text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedId === row.id && (
                    <tr>
                      <td colSpan={7} className="bg-ink-100/20 px-4 py-4">
                        <dl className="grid gap-x-8 gap-y-3 text-xs sm:grid-cols-3">
                          <Detail label="State / LGA" value={`${row.state || '—'} / ${row.lga || '—'}`} />
                          <Detail label="Preferred contact" value={row.preferred_contact || '—'} />
                          <Detail label="Farm size" value={row.farm_size || '—'} />
                          <Detail label="Production area" value={row.production_area || '—'} />
                          <Detail label="Current farming activity" value={row.current_farming_activity || '—'} />
                          <Detail label="Farming experience" value={row.farming_experience || '—'} />
                          <Detail label="Preferred crop" value={row.preferred_crop || '—'} />
                          <Detail label="Irrigation available" value={row.irrigation_available ? 'Yes' : 'No'} />
                          <Detail label="Existing infrastructure" value={row.existing_infrastructure || '—'} />
                          <Detail label="Interested in" value={parseInterests(row.interests_json).join(', ') || '—'} />
                          <Detail label="Message" value={row.message || '—'} />
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-ink-700">{value}</dd>
    </div>
  );
}
