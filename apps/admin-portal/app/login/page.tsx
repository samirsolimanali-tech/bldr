'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setError('');
    try {
      const res = await fetch(`${API}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { accessToken } = await res.json();
      localStorage.setItem('bldr_admin_token', accessToken);
      window.location.href = '/dashboard';
    } catch {
      setState('error');
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box fade-up">
        <div className="auth-logo">bldr</div>
        <p style={{ textAlign: 'center', color: 'var(--red)', marginBottom: '32px', fontSize: '13px', fontWeight: 600 }}>
          🔐 Admin Portal
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Admin email</label>
            <input id="admin-email" className="form-input" type="email" required autoFocus
              placeholder="admin@bldr.io" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="admin-password" className="form-input" type="password" required
              placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          {state === 'error' && <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
          <button id="btn-admin-login" type="submit" className="btn btn-primary btn-lg"
            disabled={state === 'loading'}>
            {state === 'loading' ? 'Signing in…' : 'Sign in as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
