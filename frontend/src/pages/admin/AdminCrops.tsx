import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const empty = { name: '', note: '', imageKey: '', sortOrder: 0, isPublished: 1 };

export default function AdminCrops() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/crops')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function save() {
    if (editingId) await api.put(`/admin/crops/${editingId}`, form);
    else await api.post('/admin/crops', form);
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(item: any) {
    setEditingId(item.id);
    setForm({ name: item.name, note: item.note, imageKey: item.image_key, sortOrder: item.sort_order, isPublished: item.is_published });
  }

  async function remove(id: number) {
    if (!confirm('Delete this crop?')) return;
    await api.delete(`/admin/crops/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Crops</h1>
      <p className="mt-1 text-sm text-ink-500">Manage the crop portfolio shown on the Crops & Production page.</p>

      <div className="mt-6 card max-w-xl">
        <h2 className="text-lg">{editingId ? 'Edit crop' : 'Add new crop'}</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="form-label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Note</label>
            <input className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Image key</label>
            <input
              className="input"
              value={form.imageKey}
              onChange={(e) => setForm({ ...form, imageKey: e.target.value })}
              placeholder="e.g. crop-bell-pepper"
            />
            <p className="mt-1 text-xs text-ink-400">Upload the matching photo under Media Library using this same key.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="btn-primary">
            {editingId ? 'Save changes' : 'Add crop'}
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
        ) : (
          items.map((item) => (
            <div key={item.id} className="card">
              <p className="font-semibold text-brand-950">{item.name}</p>
              <p className="mt-1 text-xs text-ink-400">{item.note}</p>
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
