'use client';

import React, { useState } from 'react';
import { tokens } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: 'admin@bldr.io', password: 'Admin@bldr2024!' });
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const fillDemo = () => {
    setForm({ email: 'admin@bldr.io', password: 'Admin@bldr2024!' });
    setError('');
  };

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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'radial-gradient(ellipse at 50% 10%, #1A2942 0%, #12203C 50%, #0A1222 100%)',
        fontFamily: tokens.fonts.ui,
        color: '#12203C',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ambient gradient glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(46, 111, 94, 0.22) 0%, rgba(209, 7, 33, 0.08) 50%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(44, 95, 158, 0.18) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 24px 60px -12px rgba(10, 18, 34, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        {/* Top Brand Accent Line */}
        <div
          style={{
            height: '4px',
            width: '100%',
            background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`,
          }}
        />

        <div style={{ padding: '36px 32px 32px' }}>
          {/* Brand & Badge Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                fontFamily: tokens.fonts.display,
                fontSize: '28px',
                fontWeight: 700,
                color: '#12203C',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'baseline',
                marginBottom: '10px',
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

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(46, 111, 94, 0.1)',
                border: '1px solid rgba(46, 111, 94, 0.25)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#2E6F5E',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2E6F5E',
                  boxShadow: '0 0 6px #2E6F5E',
                }}
              />
              Central Payment Hub
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 800,
                color: '#12203C',
                letterSpacing: '-0.02em',
              }}
            >
              Sign In to Console
            </h1>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: '13px',
                color: '#5A6A80',
                lineHeight: 1.45,
              }}
            >
              Venture management, transactions ledger & reconciliation.
            </p>
          </div>

          {/* Quick Demo Pre-fill Pill */}
          <div
            style={{
              background: '#F5F7FA',
              border: '1px solid #E3E8EF',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '22px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Default Demo Credentials
              </span>
              <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11.5px', color: '#1B2A4A', fontWeight: 500 }}>
                admin@bldr.io
              </span>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              style={{
                background: '#FFFFFF',
                border: '1px solid #D3DAE4',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#2E6F5E',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Use Demo
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1B2A4A',
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                Administrator Email
              </label>
              <div style={{ position: 'relative' }}>
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
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    border: '1px solid #D3DAE4',
                    background: '#FAFBFD',
                    fontSize: '13.5px',
                    color: '#12203C',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2E6F5E';
                    e.target.style.background = '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(46, 111, 94, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D3DAE4';
                    e.target.style.background = '#FAFBFD';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <label
                  htmlFor="admin-password"
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#1B2A4A',
                    letterSpacing: '-0.01em',
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
                    fontSize: '11px',
                    color: '#5A6A80',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    border: '1px solid #D3DAE4',
                    background: '#FAFBFD',
                    fontSize: '13.5px',
                    color: '#12203C',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2E6F5E';
                    e.target.style.background = '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(46, 111, 94, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D3DAE4';
                    e.target.style.background = '#FAFBFD';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {state === 'error' && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#FBEBE9',
                  border: '1px solid rgba(192, 57, 43, 0.25)',
                  color: '#C0392B',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-admin-login"
              type="submit"
              disabled={state === 'loading'}
              style={{
                marginTop: '6px',
                height: '44px',
                width: '100%',
                borderRadius: '8px',
                background: state === 'loading' ? '#1B2A4A' : '#12203C',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(18, 32, 60, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (state !== 'loading') e.currentTarget.style.background = '#1A2E56';
              }}
              onMouseLeave={(e) => {
                if (state !== 'loading') e.currentTarget.style.background = '#12203C';
              }}
            >
              {state === 'loading' ? (
                <>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#FFFFFF',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Super Admin</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security / System Footer */}
        <div
          style={{
            background: '#F8FAFC',
            borderTop: '1px solid #E3E8EF',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#8A94A6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12px' }}>🔒</span>
            <span>256-Bit TLS Secured</span>
          </div>
          <span style={{ fontFamily: tokens.fonts.mono, fontSize: '10.5px', color: '#5A6A80' }}>
            Sandbox v1.0
          </span>
        </div>
      </div>

      {/* Global CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
