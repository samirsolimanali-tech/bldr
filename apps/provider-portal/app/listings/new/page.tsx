'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const CATEGORIES = ['Education', 'Media', 'Marketing', 'Consulting', 'Training', 'Technology', 'Finance', 'Health', 'Other'];

export default function NewListingPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '', description: '', price: '', currency: 'USD',
    category: 'Education', tags: '',
    purchaseType: 'NATIVE', engagementType: 'BUY_NOW',
    redirectUrl: '', isFeatured: false, isPublished: true,
  });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('bldr_token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setError('');
    try {
      const token = getToken();
      if (!token) { window.location.href = '/login'; return; }

      const res = await fetch(`${API}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(Array.isArray(err.message) ? err.message.join('; ') : err.message);
      }
      const listing = await res.json();
      setCreatedId(listing.id);

      // Upload media if files selected
      if (fileRef.current?.files?.length) {
        const fd = new FormData();
        Array.from(fileRef.current.files).forEach(f => fd.append('files', f));
        await fetch(`${API}/listings/${listing.id}/media`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }

      setState('success');
      setTimeout(() => router.push('/listings'), 1000);
    } catch (err: any) {
      setState('error');
      setError(err.message);
    }
  };

  const f = (field: string, val: string | boolean) => setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className="shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">New Listing</h1>
          <button onClick={() => router.back()} className="btn btn-secondary btn-sm">← Back</button>
        </header>
        <div className="page-content fade-up" style={{ maxWidth: '720px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Basic info */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Basic information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input id="listing-title" className="form-input" required placeholder="e.g. Full-Stack Web Bootcamp"
                    value={form.title} onChange={e => f('title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea id="listing-description" className="form-input" required rows={5}
                    placeholder="Describe your service in detail…"
                    value={form.description} onChange={e => f('description', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Price *</label>
                    <input id="listing-price" className="form-input" type="number" required min="0" step="0.01"
                      placeholder="0.00" value={form.price} onChange={e => f('price', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select id="listing-currency" className="form-input"
                      value={form.currency} onChange={e => f('currency', e.target.value)}>
                      {['USD', 'EGP', 'SAR', 'AED', 'GBP', 'EUR'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select id="listing-category" className="form-input"
                      value={form.category} onChange={e => f('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input id="listing-tags" className="form-input" placeholder="react, nodejs, webdev"
                      value={form.tags} onChange={e => f('tags', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase & engagement type */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Purchase & engagement</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Purchase type *</label>
                    <select id="listing-purchasetype" className="form-input"
                      value={form.purchaseType} onChange={e => f('purchaseType', e.target.value)}>
                      <option value="NATIVE">🛒 Native (checkout on our site)</option>
                      <option value="REDIRECT">↗ Redirect (send to your store)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Engagement type *</label>
                    <select id="listing-engagementtype" className="form-input"
                      value={form.engagementType} onChange={e => f('engagementType', e.target.value)}>
                      <option value="BUY_NOW">Buy Now (payment)</option>
                      <option value="REQUEST_QUOTE">Request a Quote (lead form)</option>
                      <option value="BOOK_CALL">Book a Call (lead form)</option>
                    </select>
                  </div>

                </div>
                {form.purchaseType === 'REDIRECT' && (
                  <div className="form-group">
                    <label className="form-label">Redirect URL *</label>
                    <input id="listing-redirecturl" className="form-input" type="url" required
                      placeholder="https://your-store.com/product"
                      value={form.redirectUrl} onChange={e => f('redirectUrl', e.target.value)} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      We'll append ?click_id= to this URL for tracking
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Media */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Media (optional)</h2>
              <input id="listing-media" type="file" multiple accept="image/*,video/*" ref={fileRef}
                style={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Max 10 files, 10 MB each. First image is the listing thumbnail.
              </p>
            </div>

            {/* Settings */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Settings</h2>
              <div style={{ display: 'flex', gap: '24px' }}>
                {[
                  { field: 'isPublished', label: '✅ Publish immediately' },
                  { field: 'isFeatured', label: '⭐ Mark as featured' },
                ].map(opt => (
                  <label key={opt.field} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" id={`listing-${opt.field}`}
                      checked={form[opt.field as 'isPublished' | 'isFeatured'] as boolean}
                      onChange={e => f(opt.field, e.target.checked)} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {error && <p style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</p>}
            {state === 'success' && <p style={{ color: 'var(--green)', fontSize: '13px' }}>✅ Listing created! Redirecting…</p>}

            <button id="btn-create-listing" type="submit" className="btn btn-primary btn-lg" disabled={state === 'loading'}>
              {state === 'loading' ? '⏳ Creating…' : '+ Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
