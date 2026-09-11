import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
  source_page: string;
  status: string;
  created_at: string;
}

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/leads')
      .then(({ data }) => setLeads(data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id: number, status: string) {
    await api.patch(`/admin/leads/${id}`, { status });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  async function remove(id: number) {
    if (!confirm('Delete this lead permanently?')) return;
    await api.delete(`/admin/leads/${id}`);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Leads Inbox</h1>
      <p className="mt-1 text-sm text-ink-500">Enquiries submitted through the Contact form and newsletter sign-up.</p>

      {loading ? (
        <p className="mt-8 text-ink-400">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="mt-8 text-ink-400">No leads yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ink-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3 text-ink-400">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold text-brand-950">{lead.name}</td>
                  <td className="px-4 py-3 text-ink-700">
                    <div>{lead.email}</div>
                    <div className="text-xs text-ink-400">{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{lead.interest || '—'}</td>
                  <td className="max-w-xs px-4 py-3 text-ink-500">{lead.message || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
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
                    <button onClick={() => remove(lead.id)} className="text-xs font-semibold text-red-600 hover:underline">
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
