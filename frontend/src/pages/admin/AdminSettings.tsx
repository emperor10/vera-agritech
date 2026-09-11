import { useEffect, useState } from 'react';
import { api, apiErrorMessage } from '../../lib/api';

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setSaving(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: apiErrorMessage(err, 'Could not change password.') });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 card max-w-2xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-brand-950">Change password</h2>
        <p className="mt-1 text-sm text-ink-500">
          Update the password for the admin account you're currently logged in as.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="form-label">Current password</label>
          <input
            type="password"
            autoComplete="current-password"
            className="input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">New password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="form-label">Confirm new password</label>
            <input
              type="password"
              autoComplete="new-password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Changing…' : 'Change password'}
          </button>
          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-brand-700' : 'text-red-600'}`}>{message.text}</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default function AdminSettings() {
  const [form, setForm] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(({ data }) => setForm(data));
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/admin/settings', form);
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch (err) {
      setMessage({ type: 'error', text: apiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <p className="text-ink-400">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl text-brand-950">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-500">Contact details and social links used across the site.</p>

      <div className="mt-6 card max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Company name</label>
            <input className="input" value={form.companyName || ''} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Founder name</label>
            <input className="input" value={form.founder || ''} onChange={(e) => setForm({ ...form, founder: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="form-label">Address</label>
          <input className="input" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Email</label>
            <input className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Phone (displayed)</label>
            <input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">WhatsApp number (digits only, e.g. 2348035217807)</label>
            <input className="input" value={form.whatsapp || ''} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Default WhatsApp message</label>
            <input className="input" value={form.whatsappMessage || ''} onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="form-label">Facebook URL</label>
            <input
              className="input"
              value={form.social?.facebook || ''}
              onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })}
            />
          </div>
          <div>
            <label className="form-label">Instagram URL</label>
            <input
              className="input"
              value={form.social?.instagram || ''}
              onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })}
            />
          </div>
          <div>
            <label className="form-label">X / Twitter URL</label>
            <input
              className="input"
              value={form.social?.twitter || ''}
              onChange={(e) => setForm({ ...form, social: { ...form.social, twitter: e.target.value } })}
            />
          </div>
        </div>
        <div>
          <label className="form-label">Footer tagline</label>
          <textarea
            className="input"
            rows={2}
            value={form.footerTagline || ''}
            onChange={(e) => setForm({ ...form, footerTagline: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-brand-700' : 'text-red-600'}`}>{message.text}</p>
          )}
        </div>
      </div>

      <ChangePasswordCard />
    </div>
  );
}
