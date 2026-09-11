import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_published: number;
}

const empty = { question: '', answer: '', sort_order: 0, is_published: 1 };

export default function AdminFaqs() {
  const [items, setItems] = useState<Faq[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/faqs')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function save() {
    if (editingId) {
      await api.put(`/admin/faqs/${editingId}`, form);
    } else {
      await api.post('/admin/faqs', form);
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(item: Faq) {
    setEditingId(item.id);
    setForm(item);
  }

  async function remove(id: number) {
    if (!confirm('Delete this FAQ?')) return;
    await api.delete(`/admin/faqs/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">FAQs</h1>
      <p className="mt-1 text-sm text-ink-500">Manage the questions and answers shown on the FAQs page.</p>

      <div className="mt-6 card max-w-2xl">
        <h2 className="text-lg">{editingId ? 'Edit FAQ' : 'Add new FAQ'}</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="form-label">Question</label>
            <input className="input" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Answer</label>
            <textarea className="input" rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="form-label">Order</label>
              <input
                type="number"
                className="input w-24"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked ? 1 : 0 })}
              />
              Published
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="btn-primary">
              {editingId ? 'Save changes' : 'Add FAQ'}
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
      </div>

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-ink-400">Loading…</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="card flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-brand-950">{item.question}</p>
                <p className="mt-1 text-sm text-ink-500">{item.answer}</p>
                {!item.is_published && <span className="badge mt-2 bg-ink-100 text-ink-500">Unpublished</span>}
              </div>
              <div className="flex shrink-0 gap-3 text-sm font-semibold">
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
