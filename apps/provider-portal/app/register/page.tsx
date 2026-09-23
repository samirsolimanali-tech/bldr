'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { tokens } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    orgName: '',
    orgSlug: '',
    tagline: '',
    website: '',
  });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleOrgName = (val: string) => {
    setForm((f) => ({ ...f, orgName: val, orgSlug: autoSlug(val) }));
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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
      }

      const { accessToken } = await res.json();
      localStorage.setItem('bldr_token', accessToken);
      setState('success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } catch (err: any) {
      setState('error');
      setError(err.message || 'Failed to create provider account');
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
        padding: '40px 16px',
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

      {/* Main Registration Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
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
          {/* Header */}
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
                background: 'rgba(44, 95, 158, 0.1)',
                border: '1px solid rgba(44, 95, 158, 0.25)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#2C5F9E',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2C5F9E',
                  boxShadow: '0 0 6px #2C5F9E',
                }}
              />
              Provider Hub
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
              Apply as a Provider
            </h1>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: '13px',
                color: '#5A6A80',
                lineHeight: 1.45,
              }}
            >
              Join the ecosystem to offer your services, courses & workshops.
            </p>
          </div>

          {state === 'success' ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>🎉</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#12203C', margin: '0 0 8px' }}>Account Created!</h2>
              <p style={{ color: '#5A6A80', fontSize: '14px' }}>Redirecting to your provider dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '5px' }}>
                    First Name
                  </label>
                  <input
                    required
                    placeholder="Alex"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: '1px solid #D3DAE4',
                      background: '#FAFBFD',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '5px' }}>
                    Last Name
                  </label>
                  <input
                    required
                    placeholder="Rivera"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: '1px solid #D3DAE4',
                      background: '#FAFBFD',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '5px' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid #D3DAE4',
                    background: '#FAFBFD',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '5px' }}>
                  Password (min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid #D3DAE4',
                    background: '#FAFBFD',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ height: '1px', background: '#E3E8EF', margin: '4px 0' }} />

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '5px' }}>
                  Organisation / Brand Name
                </label>
                <input
                  required
                  placeholder="Apex Tutoring Academy"
                  value={form.orgName}
                  onChange={(e) => handleOrgName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid #D3DAE4',
                    background: '#FAFBFD',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '5px' }}>
                  Public Slug
                </label>
                <input
                  required
                  placeholder="apex-tutoring"
                  value={form.orgSlug}
                  onChange={(e) => setForm((f) => ({ ...f, orgSlug: autoSlug(e.target.value) }))}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid #D3DAE4',
                    background: '#FAFBFD',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#8A94A6', marginTop: '4px', display: 'block' }}>
                  bldr.io/providers/{form.orgSlug || 'your-slug'}
                </span>
              </div>

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
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  marginTop: '8px',
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
              >
                {state === 'loading' ? 'Creating Account...' : 'Create Provider Account →'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '13px', color: '#5A6A80' }}>
              Already registered?{' '}
            </span>
            <Link
              href="/login"
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#2C5F9E',
                textDecoration: 'none',
              }}
            >
              Sign In →
            </Link>
          </div>
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
            bldr Provider Onboarding
          </span>
        </div>
      </div>
    </div>
  );
}
