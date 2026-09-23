'use client';

import React, { useState } from 'react';
import { tokens } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: 'admin@bldr.io', password: 'Admin@bldr2024!' });
  const [showPassword, setShowPassword] = useState(false);
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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Invalid administrator credentials');
      }

      const { accessToken } = await res.json();
      localStorage.setItem('bldr_admin_token', accessToken);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setState('error');
      setError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: '#12203C',
        fontFamily: tokens.fonts.ui,
        color: '#12203C',
      }}
    >
      {/* Clean, Elevated Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '40px 36px 36px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: tokens.fonts.display,
              fontSize: '32px',
              fontWeight: 700,
              color: '#12203C',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'baseline',
              marginBottom: '8px',
            }}
          >
            bldr
            <span
              style={{
                background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              .
            </span>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 600,
              color: '#5A6A80',
              letterSpacing: '-0.01em',
            }}
          >
            Admin Console
          </h1>
        </div>

        {/* Essential Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1B2A4A',
                marginBottom: '6px',
              }}
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoFocus
              placeholder="admin@bldr.io"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1px solid #D3DAE4',
                background: '#FAFBFD',
                fontSize: '14px',
                color: '#12203C',
                outline: 'none',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#12203C';
                e.target.style.background = '#FFFFFF';
                e.target.style.boxShadow = '0 0 0 3px rgba(18, 32, 60, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D3DAE4';
                e.target.style.background = '#FAFBFD';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <label
                htmlFor="admin-password"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1B2A4A',
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  color: '#5A6A80',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1px solid #D3DAE4',
                background: '#FAFBFD',
                fontSize: '14px',
                color: '#12203C',
                outline: 'none',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#12203C';
                e.target.style.background = '#FFFFFF';
                e.target.style.boxShadow = '0 0 0 3px rgba(18, 32, 60, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D3DAE4';
                e.target.style.background = '#FAFBFD';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {state === 'error' && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#FBEBE9',
                border: '1px solid rgba(192, 57, 43, 0.25)',
                color: '#C0392B',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            id="btn-admin-login"
            type="submit"
            disabled={state === 'loading'}
            style={{
              marginTop: '4px',
              height: '46px',
              width: '100%',
              borderRadius: '8px',
              background: '#12203C',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              cursor: state === 'loading' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (state !== 'loading') e.currentTarget.style.background = '#1D305A';
            }}
            onMouseLeave={(e) => {
              if (state !== 'loading') e.currentTarget.style.background = '#12203C';
            }}
          >
            {state === 'loading' ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
