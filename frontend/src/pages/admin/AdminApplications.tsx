import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  package_interest: string;
  financing_interest: string;
  message: string;
  status: string;
  created_at: string;
}

const STATUSES = ['new', 'reviewing', 'approved', 'declined'];

export default function AdminApplications() {
  const [rows, setRows] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/applications')
      .then(({ data }) => setRows(data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id: number, status: string) {
    await api.patch(`/admin/applications/${id}`, { status });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  async function remove(id: number) {
    if (!confirm('Delete this application permanently?')) return;
    await api.delete(`/admin/applications/${id}`);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Applications</h1>
      <p className="mt-1 text-sm text-ink-500">Expressions of interest submitted through the Get Started form.</p>

      {loading ? (
        <p className="mt-8 text-ink-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-ink-400">No applications yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-ink-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Financing</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-ink-400">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold text-brand-950">{row.name}</td>
                  <td className="px-4 py-3 text-ink-700">
                    <div>{row.email}</div>
                    <div className="text-xs text-ink-400">{row.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{row.location || '—'}</td>
                  <td className="px-4 py-3 text-ink-700">{row.package_interest || '—'}</td>
                  <td className="px-4 py-3 text-ink-700">{row.financing_interest || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
                      className="rounded-lg border border-ink-100 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
