import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const empty = { title: '', summary: '', statsText: '', imageKey: '', sortOrder: 0, isPublished: 1 };

function parseStats(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':');
      return { label: label.trim(), value: rest.join(':').trim() };
    });
}

export default function AdminCaseStudies() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/case-studies')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function save() {
    const payload = { ...form, stats: parseStats(form.statsText) };
    if (editingId) await api.put(`/admin/case-studies/${editingId}`, payload);
    else await api.post('/admin/case-studies', payload);
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(item: any) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      summary: item.summary,
      statsText: (item.stats || []).map((s: any) => `${s.label}: ${s.value}`).join('\n'),
      imageKey: item.image_key,
      sortOrder: item.sort_order,
      isPublished: item.is_published,
    });
  }

  async function remove(id: number) {
    if (!confirm('Delete this case study?')) return;
    await api.delete(`/admin/case-studies/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Case Studies</h1>
      <p className="mt-1 text-sm text-ink-500">Manage the featured projects shown on the Projects page.</p>

      <div className="mt-6 card max-w-2xl">
        <h2 className="text-lg">{editingId ? 'Edit case study' : 'Add new case study'}</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="form-label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Summary</label>
            <textarea className="input" rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Stats (one "Label: Value" per line)</label>
            <textarea
              className="input font-mono text-xs"
              rows={5}
              value={form.statsText}
              onChange={(e) => setForm({ ...form, statsText: e.target.value })}
              placeholder={'CapEx: ₦12,500,000\nAnnual Yield: 18.5 tonnes'}
            />
          </div>
          <div>
            <label className="form-label">Image key</label>
            <input className="input" value={form.imageKey} onChange={(e) => setForm({ ...form, imageKey: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="btn-primary">
            {editingId ? 'Save changes' : 'Add case study'}
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {loading ? (
          <p className="text-ink-400">Loading…</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="card">
              <p className="font-semibold text-brand-950">{item.title}</p>
              <p className="mt-1 text-sm text-ink-500">{item.summary}</p>
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
