import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const empty = {
  name: '',
  area: '',
  bestFor: '',
  costRange: '',
  turnoverRange: '',
  includesText: '',
  popular: false,
  sortOrder: 0,
  isPublished: 1,
};

export default function AdminPackages() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/packages')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function save() {
    const payload = { ...form, includes: form.includesText.split('\n').map((s: string) => s.trim()).filter(Boolean) };
    if (editingId) {
      await api.put(`/admin/packages/${editingId}`, payload);
    } else {
      await api.post('/admin/packages', payload);
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(item: any) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      area: item.area,
      bestFor: item.best_for,
      costRange: item.cost_range,
      turnoverRange: item.turnover_range,
      includesText: (item.includes || []).join('\n'),
      popular: !!item.popular,
      sortOrder: item.sort_order,
      isPublished: item.is_published,
    });
  }

  async function remove(id: number) {
    if (!confirm('Delete this package?')) return;
    await api.delete(`/admin/packages/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Screen House Packages</h1>
      <p className="mt-1 text-sm text-ink-500">Manage the packages shown on the Greenhouses and Business Model pages.</p>

      <div className="mt-6 card max-w-2xl">
        <h2 className="text-lg">{editingId ? 'Edit package' : 'Add new package'}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="form-label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Area</label>
            <input className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Best for</label>
            <input className="input" value={form.bestFor} onChange={(e) => setForm({ ...form, bestFor: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Cost range</label>
            <input className="input" value={form.costRange} onChange={(e) => setForm({ ...form, costRange: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Turnover range</label>
            <input className="input" value={form.turnoverRange} onChange={(e) => setForm({ ...form, turnoverRange: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Includes (one per line)</label>
            <textarea className="input" rows={4} value={form.includesText} onChange={(e) => setForm({ ...form, includesText: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
            Mark as "Most Popular"
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="btn-primary">
            {editingId ? 'Save changes' : 'Add package'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-ink-400">Loading…</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="card">
              <p className="font-semibold text-brand-950">{item.name}</p>
              <p className="text-sm text-ink-500">{item.area}</p>
              <p className="mt-2 text-xs text-ink-400">{item.cost_range}</p>
              <div className="mt-4 flex gap-3 text-sm font-semibold">
                <button onClick={() => edit(item)} className="text-brand-700 hover:underline">
                  Edit
                </button>
                <button onClick={() => remove(item.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
