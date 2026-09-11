import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const empty = { title: '', slug: '', excerpt: '', content: '', coverImageKey: '', isPublished: 0 };

export default function AdminBlog() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/blog')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function save() {
    if (editingId) await api.put(`/admin/blog/${editingId}`, form);
    else await api.post('/admin/blog', form);
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(item: any) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      coverImageKey: item.cover_image_key,
      isPublished: item.is_published,
    });
  }

  async function remove(id: number) {
    if (!confirm('Delete this article?')) return;
    await api.delete(`/admin/blog/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Blog Posts</h1>
      <p className="mt-1 text-sm text-ink-500">Publish articles to the Insights & Blog page.</p>

      <div className="mt-6 card max-w-2xl">
        <h2 className="text-lg">{editingId ? 'Edit article' : 'Write new article'}</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="form-label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="form-label">URL slug (optional — auto-generated from title)</label>
            <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Excerpt</label>
            <textarea className="input" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Content</label>
            <textarea className="input" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Cover image key</label>
            <input className="input" value={form.coverImageKey} onChange={(e) => setForm({ ...form, coverImageKey: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked ? 1 : 0 })}
            />
            Published (visible on the website)
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="btn-primary">
            {editingId ? 'Save changes' : 'Create article'}
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

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-ink-400">Loading…</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="card flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-brand-950">{item.title}</p>
                <p className="mt-1 text-xs text-ink-400">/resources/{item.slug}</p>
                <span className={`badge mt-2 ${item.is_published ? 'bg-brand-100 text-brand-800' : 'bg-ink-100 text-ink-500'}`}>
                  {item.is_published ? 'Published' : 'Draft'}
                </span>
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
