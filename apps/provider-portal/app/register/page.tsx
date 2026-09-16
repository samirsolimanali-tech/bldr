'use client';

import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    orgName: '', orgSlug: '', tagline: '', website: '',
  });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleOrgName = (val: string) => {
    setForm(f => ({ ...f, orgName: val, orgSlug: autoSlug(val) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setError('');
    try {
      const res = await fetch(`${API}/auth/provider/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }
      const { accessToken } = await res.json();
      localStorage.setItem('bldr_token', accessToken);
      setState('success');
      setTimeout(() => { window.location.href = '/onboarding'; }, 800);
    } catch (err: any) {
      setState('error');
      setError(err.message);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '40px 24px' }}>
      <div className="auth-box fade-up" style={{ maxWidth: '500px' }}>
        <div className="auth-logo">bldr</div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
          Apply as a Provider
        </p>

        {state === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>Account created!</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Redirecting to onboarding…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">First name</label>
                <input id="reg-firstname" className="form-input" required placeholder="Alex"
                  value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input id="reg-lastname" className="form-input" required placeholder="Rivera"
                  value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input id="reg-email" className="form-input" type="email" required placeholder="you@company.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password (min 8 chars)</label>
              <input id="reg-password" className="form-input" type="password" required minLength={8}
                placeholder="••••••••" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="divider" />
            <div className="form-group">
              <label className="form-label">Organisation name</label>
              <input id="reg-orgname" className="form-input" required placeholder="My Agency Ltd"
                value={form.orgName} onChange={e => handleOrgName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (your public URL)</label>
              <input id="reg-slug" className="form-input" required placeholder="my-agency"
                value={form.orgSlug}
                onChange={e => setForm(f => ({ ...f, orgSlug: autoSlug(e.target.value) }))} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                bldr.io/providers/{form.orgSlug || 'your-slug'}
              </span>
            </div>
            <div className="form-group">
              <label className="form-label">Tagline (optional)</label>
              <input id="reg-tagline" className="form-input" placeholder="Short catchy description"
                value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Website (optional)</label>
              <input id="reg-website" className="form-input" type="url" placeholder="https://yoursite.com"
                value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
            </div>
            {state === 'error' && (
              <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>
            )}
            <button id="btn-register" type="submit" className="btn btn-primary btn-lg"
              disabled={state === 'loading'}>
              {state === 'loading' ? 'Creating account…' : 'Create Provider Account →'}
            </button>
          </form>
        )}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent-400)' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
