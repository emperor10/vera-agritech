import { Fragment, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface ProductOrder {
  id: number;
  reference_no: string;
  product_id: number | null;
  product_name: string;
  product_category: string;
  unit_price: string;
  unit: string;
  quantity: string;
  full_name: string;
  phone: string;
  email: string;
  delivery_location: string;
  notes: string;
  status: string;
  created_at: string;
}

const STATUSES = ['new', 'contacted', 'confirmed', 'fulfilled', 'cancelled'];

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Customer contacted',
  confirmed: 'Confirmed',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

export default function AdminProductOrders() {
  const [rows, setRows] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    api
      .get('/admin/product-orders')
      .then(({ data }) => setRows(data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id: number, status: string) {
    await api.patch(`/admin/product-orders/${id}`, { status });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  async function remove(id: number) {
    if (!confirm('Delete this order permanently?')) return;
    await api.delete(`/admin/product-orders/${id}`);
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Product Orders</h1>
      <p className="mt-1 text-sm text-ink-500">
        Order requests placed from the Products page. Contact the customer to confirm availability, pricing and delivery,
        then update the status here.
      </p>

      {loading ? (
        <p className="mt-8 text-ink-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-ink-400">No product orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-ink-100/60 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
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
                      <div className="font-semibold text-brand-950">{row.product_name}</div>
                      <div className="text-xs text-ink-400">
                        {row.unit_price ? `${row.unit_price}${row.unit ? ` / ${row.unit}` : ''}` : 'No price listed'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-700">{row.quantity}</td>
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
                          <Detail label="Delivery location" value={row.delivery_location || '—'} />
                          <Detail label="Category" value={row.product_category || '—'} />
                          <Detail label="Notes" value={row.notes || '—'} />
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
