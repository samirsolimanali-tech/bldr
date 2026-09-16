'use client';

import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setError('');
    try {
      const res = await fetch(`${API}/auth/provider/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Invalid credentials');
      }
      const { accessToken } = await res.json();
      localStorage.setItem('bldr_token', accessToken);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setState('error');
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box fade-up">
        <div className="auth-logo">bldr</div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
          Provider Portal
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input id="login-email" className="form-input" type="email" required autoFocus
              placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="login-password" className="form-input" type="password" required
              placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          {state === 'error' && (
            <p style={{ color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</p>
          )}
          <button id="btn-login" type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '4px' }}
            disabled={state === 'loading'}>
            {state === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--accent-400)' }}>Apply as provider →</Link>
        </p>
      </div>
    </div>
  );
}
