import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';

const empty = {
  category: 'vegetable',
  name: '',
  description: '',
  price: '',
  unit: 'kg',
  specsText: '',
  imageKey: '',
  sortOrder: 0,
  isPublished: 1,
};

export default function AdminProducts() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'vegetable' | 'equipment'>('all');

  function load() {
    setLoading(true);
    api
      .get('/admin/products')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  // Vegetables are always sold by weight — default the unit to kg whenever
  // that category is selected, but leave it editable for the rare case
  // where a vegetable is sold by a different unit (e.g. a bunch/crate).
  function setCategory(category: string) {
    setForm((f: any) => ({ ...f, category, unit: category === 'vegetable' && !editingId ? 'kg' : f.unit }));
  }

  async function save() {
    const payload = {
      ...form,
      specs: form.specsText.split('\n').map((s: string) => s.trim()).filter(Boolean),
    };
    if (editingId) await api.put(`/admin/products/${editingId}`, payload);
    else await api.post('/admin/products', payload);
    setForm(empty);
    setEditingId(null);
    load();
  }

  function edit(item: any) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      name: item.name,
      description: item.description || '',
      price: item.price || '',
      unit: item.unit || 'kg',
      specsText: (item.specs || []).join('\n'),
      imageKey: item.image_key || '',
      sortOrder: item.sort_order,
      isPublished: item.is_published,
    });
  }

  async function remove(id: number) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/admin/products/${id}`);
    load();
  }

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Products</h1>
      <p className="mt-1 text-sm text-ink-500">
        Manage the vegetables and screen house equipment shown on the public Products page. Vegetables are priced by
        weight in kilograms (kg) by default.
      </p>

      <div className="mt-6 card max-w-2xl">
        <h2 className="text-lg">{editingId ? 'Edit product' : 'Add new product'}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="form-label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setCategory(e.target.value)}>
              <option value="vegetable">Vegetable</option>
              <option value="equipment">Screen House Equipment</option>
            </select>
          </div>
          <div>
            <label className="form-label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Price</label>
            <input
              className="input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Leave blank for &quot;Contact for pricing&quot;"
            />
          </div>
          <div>
            <label className="form-label">Unit</label>
            <input
              className="input"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              placeholder="e.g. kg, unit, screen house"
            />
            {form.category === 'vegetable' && (
              <p className="mt-1 text-xs text-ink-400">Vegetables are sold by weight — this is usually "kg".</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Specs / highlights (one per line)</label>
            <textarea
              className="input"
              rows={3}
              value={form.specsText}
              onChange={(e) => setForm({ ...form, specsText: e.target.value })}
              placeholder={
                form.category === 'vegetable'
                  ? 'e.g. Grown pesticide-free\nHarvested to order'
                  : 'e.g. UV-stabilised netting\nIncludes installation'
              }
            />
          </div>
          <div>
            <label className="form-label">Image key</label>
            <input
              className="input"
              value={form.imageKey}
              onChange={(e) => setForm({ ...form, imageKey: e.target.value })}
              placeholder="e.g. product-tomato"
            />
            <p className="mt-1 text-xs text-ink-400">Upload the matching photo under Media Library using this same key.</p>
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
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={!!form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked ? 1 : 0 })}
            />
            Published (visible on the public Products page)
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={save} className="btn-primary">
            {editingId ? 'Save changes' : 'Add product'}
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

      <div className="mt-8 flex gap-1 rounded-full border border-ink-100 bg-white p-1 w-fit">
        {(['all', 'vegetable', 'equipment'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              filter === key ? 'bg-brand-900 text-white' : 'text-ink-700 hover:bg-brand-50'
            }`}
          >
            {key === 'all' ? 'All' : key === 'vegetable' ? 'Vegetables' : 'Equipment'}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-ink-400">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="text-ink-400">No products in this category yet.</p>
        ) : (
          visible.map((item) => (
            <div key={item.id} className="card">
              <span className="badge">{item.category === 'vegetable' ? 'Vegetable' : 'Equipment'}</span>
              <p className="mt-3 font-semibold text-brand-950">{item.name}</p>
              <p className="mt-1 text-xs text-ink-400">
                {item.price ? `${item.price} / ${item.unit}` : 'No price set'}
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
