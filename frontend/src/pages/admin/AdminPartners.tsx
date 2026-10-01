import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const empty = { name: '', imageKey: '', websiteUrl: '', sortOrder: 0, isPublished: 1 };

export default function AdminPartners() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/partners')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function save() {
    if (editingId) await api.put(`/admin/partners/${editingId}`, form);
    else await api.post('/admin/partners', form);
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(item: any) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      imageKey: item.image_key || '',
      websiteUrl: item.website_url || '',
      sortOrder: item.sort_order,
      isPublished: item.is_published,
    });
  }

  async function remove(id: number) {
    if (!confirm('Delete this partner?')) return;
    await api.delete(`/admin/partners/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Partners</h1>
      <p className="mt-1 text-sm text-ink-500">
        Manage the partner/brand logos shown in the "Our Partners" section on the homepage, right after the hero.
      </p>

      <div className="mt-6 card max-w-xl">
        <h2 className="text-lg">{editingId ? 'Edit partner' : 'Add new partner'}</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="form-label">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. IFAD"
            />
          </div>
          <div>
            <label className="form-label">Website URL (optional)</label>
            <input
              className="input"
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-ink-400">If set, the logo links out to this site in a new tab.</p>
          </div>
          <div>
            <label className="form-label">Logo image key</label>
            <input
              className="input"
              value={form.imageKey}
              onChange={(e) => setForm({ ...form, imageKey: e.target.value })}
              placeholder="e.g. partner-ifad"
            />
            <p className="mt-1 text-xs text-ink-400">Upload the matching logo under Media Library using this same key.</p>
          </div>
          <div>
            <label className="form-label">Sort order</label>
            <input
              type="number"
              className="input"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked ? 1 : 0 })}
            />
            Published (visible on the homepage)
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="btn-primary">
            {editingId ? 'Save changes' : 'Add partner'}
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="text-ink-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-ink-400">No partners added yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="card">
              <p className="font-semibold text-brand-950">{item.name}</p>
              <p className="mt-1 text-xs text-ink-400">
                {item.website_url || 'No website link'}
                {!item.is_published && ' · Unpublished'}
              </p>
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
