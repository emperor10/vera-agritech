import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, apiErrorMessage } from '../../lib/api';

export default function AdminContentEditor() {
  const { page } = useParams();
  const [raw, setRaw] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!page) return;
    setLoading(true);
    setMessage(null);
    api
      .get(`/content/${page}`)
      .then(({ data }) => setRaw(JSON.stringify(data.value, null, 2)))
      .catch((err) => setMessage({ type: 'error', text: apiErrorMessage(err) }))
      .finally(() => setLoading(false));
  }, [page]);

  async function handleSave() {
    setMessage(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setMessage({ type: 'error', text: 'This is not valid JSON. Please fix the syntax before saving.' });
      return;
    }
    setSaving(true);
    try {
      await api.put(`/content/admin/${page}`, { value: parsed });
      setMessage({ type: 'success', text: 'Saved. Changes are now live on the website.' });
    } catch (err) {
      setMessage({ type: 'error', text: apiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl capitalize text-brand-950">{page?.replace(/([A-Z])/g, ' $1')} — Page Content</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-500">
        This edits the raw content for this page as structured data (JSON). Every heading, paragraph and list on the
        page is a field below — edit the text between the quotation marks and keep the surrounding punctuation
        (commas, brackets and quotes) intact.
      </p>

      {loading ? (
        <p className="mt-8 text-ink-400">Loading content…</p>
      ) : (
        <div className="mt-6">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            spellCheck={false}
            rows={28}
            className="w-full rounded-2xl border border-ink-100 bg-brand-950 p-4 font-mono text-xs text-brand-100 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-brand-700' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
