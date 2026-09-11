import { useEffect, useRef, useState } from 'react';
import { api, apiErrorMessage } from '../../lib/api';

interface ImageRow {
  id: number;
  key: string;
  url: string | null;
  alt_text: string;
  original_name: string | null;
  updated_at: string;
}

export default function AdminMedia() {
  const [items, setItems] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [newKey, setNewKey] = useState('');
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function load() {
    setLoading(true);
    api
      .get('/admin/images')
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleUpload(key: string, file: File) {
    setUploadingKey(key);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      await api.post('/admin/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      load();
    } catch (err) {
      setMessage(apiErrorMessage(err));
    } finally {
      setUploadingKey(null);
    }
  }

  async function updateAlt(key: string, altText: string) {
    await api.put(`/admin/images/${key}`, { altText });
  }

  async function removeKey(item: ImageRow) {
    if (!confirm(`Delete the "${item.key}" image key? This removes it from the Media Library and, if a photo is uploaded, deletes that file too. Any page still using this key will show the empty placeholder again instead of breaking.`)) {
      return;
    }
    // A key just registered locally (via "Register key") but never uploaded
    // to yet has no row in the database at all — nothing to call the API
    // for, just drop it from the list.
    if (item.id < 0) {
      setItems((prev) => prev.filter((i) => i.key !== item.key));
      return;
    }
    setMessage('');
    try {
      await api.delete(`/admin/images/${item.key}`);
      load();
    } catch (err) {
      setMessage(apiErrorMessage(err));
    }
  }

  function addKey() {
    const key = newKey.trim();
    if (!key) return;
    setItems((prev) => [...prev, { id: -Date.now(), key, url: null, alt_text: '', original_name: null, updated_at: '' }]);
    setNewKey('');
  }

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Media Library</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-500">
        Every placeholder image on the website has a unique key. Upload a photo against a key to replace the
        placeholder everywhere it's used on the site.
      </p>

      <div className="mt-6 flex max-w-xl gap-3">
        <input
          className="input mt-0"
          placeholder="Register a new image key, e.g. team-photo-1"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <button onClick={addKey} className="btn-secondary shrink-0">
          Register key
        </button>
      </div>

      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}

      {loading ? (
        <p className="mt-8 text-ink-400">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.key} className="card">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink-100">
                {item.url ? (
                  <img src={item.url} alt={item.alt_text} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink-400">No image yet</div>
                )}
              </div>
              <p className="mt-3 truncate font-mono text-xs text-ink-400">{item.key}</p>
              <input
                className="input"
                defaultValue={item.alt_text}
                placeholder="Alt text (for accessibility & SEO)"
                onBlur={(e) => updateAlt(item.key, e.target.value)}
              />
              <input
                ref={(el) => {
                  fileInputs.current[item.key] = el;
                }}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(item.key, file);
                }}
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => fileInputs.current[item.key]?.click()}
                  disabled={uploadingKey === item.key}
                  className="btn-secondary flex-1"
                >
                  {uploadingKey === item.key ? 'Uploading…' : item.url ? 'Replace image' : 'Upload image'}
                </button>
                <button
                  onClick={() => removeKey(item)}
                  disabled={uploadingKey === item.key}
                  title="Delete this image key"
                  aria-label={`Delete the ${item.key} image key`}
                  className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-transparent px-3 text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.7 12.1a2 2 0 0 1-2 1.9H9.7a2 2 0 0 1-2-1.9L7 7h10Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
