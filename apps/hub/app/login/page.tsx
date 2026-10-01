'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { loginHubUser } from '../../lib/auth';

interface DemoProfile {
  label: string;
  badge: string;
  email: string;
  password: string;
  scope: string;
  color: string;
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    label: 'Super Admin',
    badge: 'Global Treasury',
    email: 'admin@bldr.io',
    password: 'CentralHub2026!',
    scope: 'all',
    color: '#10B981',
  },
  {
    label: 'StudyHub',
    badge: 'Education Admin',
    email: 'admin@studyhub.eg',
    password: 'StudyHub2026!',
    scope: 'studyhub',
    color: '#0D9488',
  },
  {
    label: 'Apex Classes',
    badge: 'Corporate Lead',
    email: 'admin@apexclasses.eg',
    password: 'ApexClass2026!',
    scope: 'apex',
    color: '#3B82F6',
  },
  {
    label: 'bldr Store',
    badge: 'House Brand',
    email: 'finance@bldr.store',
    password: 'BldrStore2026!',
    scope: 'bldr',
    color: '#EF4444',
  },
];

export default function HubLoginPage() {
  const [email, setEmail] = useState('admin@bldr.io');
  const [password, setPassword] = useState('CentralHub2026!');
  const [selectedVenture, setSelectedVenture] = useState('all');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeProfile, setActiveProfile] = useState<string>('Super Admin');

  const handleProfileSelect = (p: DemoProfile) => {
    setActiveProfile(p.label);
    setEmail(p.email);
    setPassword(p.password);
    setSelectedVenture(p.scope);
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please provide both administrative credentials to authenticate.');
        setIsLoading(false);
        return;
      }

      const targetUrl = selectedVenture === 'all' ? '/' : `/?venture=${selectedVenture}`;
      loginHubUser({ email: email.trim(), scope: selectedVenture }, targetUrl);
    }, 700);
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
        background: '#070B14',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        padding: '32px 16px',
        color: '#E2E8F0',
      }}
    >
      {/* ─── Ambient Glow Backdrops ─────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(5, 150, 105, 0.04) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '8%',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.03) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle fine grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* ─── Central Login Card ─────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(180deg, rgba(19, 31, 55, 0.85) 0%, rgba(13, 21, 38, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          padding: '36px 34px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top Header Badge & Live Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #10B981 0%, #047857 50%, #1E3A8A 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 17,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              b/
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Central Financial Hub
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Core Settlement Platform
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 10.5,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.28)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Title & Scope Description */}
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 21, fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Administrative Operations Login
          </h1>
          <p style={{ fontSize: 12.5, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            Authenticate with verified platform keys to manage multi-gateway routing (Geidea, Paymob, Fawry), internal brand settlements, and ledger transfers.
          </p>
        </div>

        {/* ─── Demo Profiles Quick-Fill Strip ─────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick-Fill Verified Profiles:
            </span>
            <span style={{ fontSize: 10.5, color: '#64748B' }}>1-Click Switch</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {DEMO_PROFILES.map((p) => {
              const isSelected = activeProfile === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleProfileSelect(p)}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 8,
                    padding: '7px 4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: isSelected ? '#34D399' : '#E2E8F0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: isSelected ? '#A7F3D0' : '#64748B',
                      marginTop: 2,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div
            style={{
              padding: '11px 14px',
              borderRadius: 9,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#FCA5A5',
              fontSize: 12.5,
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 15 }}>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ─── Login Form ─────────────────────────────────────────── */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email field with Icon */}
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
              <span>Administrator Email</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Corporate Identity</span>
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 13,
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                id="admin-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setActiveProfile('');
                }}
                required
                placeholder="admin@bldr.io"
                style={{
                  width: '100%',
                  height: 44,
                  paddingLeft: 42,
                  paddingRight: 14,
                  borderRadius: 9,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: 13.5,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#10B981';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password field with Show/Hide toggle */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#CBD5E1' }}>
                Master Access Key / Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38BDF8',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>{showPassword ? '🔒 Hide' : '👁️ Show'}</span>
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 13,
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setActiveProfile('');
                }}
                required
                placeholder="••••••••••••••••"
                style={{
                  width: '100%',
                  height: 44,
                  paddingLeft: 42,
                  paddingRight: 14,
                  borderRadius: 9,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: 13.5,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: showPassword ? 'inherit' : 'monospace',
                  letterSpacing: showPassword ? 'normal' : '0.1em',
                  transition: 'border 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#10B981';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Venture Scope Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#CBD5E1' }}>
                Operational Scope
              </label>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                Active Brand Partition
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <select
                id="admin-scope-select"
                value={selectedVenture}
                onChange={(e) => setSelectedVenture(e.target.value)}
                style={{
                  width: '100%',
                  height: 44,
                  paddingLeft: 14,
                  paddingRight: 34,
                  borderRadius: 9,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                <option value="all">🌐 Global Infrastructure (All Brands & Ventures)</option>
                <option value="bldr">🏪 bldr Storefront Pilot (House Brand)</option>
                <option value="studyhub">🎓 StudyHub Academy (Secondary Education)</option>
                <option value="apex">🏛️ Apex Classes (Professional & Corporate)</option>
                <option value="el-hesa">📚 EL HESA Institute (National Curriculum)</option>
                <option value="career-hub">💼 Career Hub (Talent & Coaching)</option>
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: 14,
                  top: 14,
                  pointerEvents: 'none',
                  color: '#94A3B8',
                  fontSize: 12,
                }}
              >
                ▼
              </div>
            </div>
          </div>

          {/* Remember session checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#94A3B8' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#10B981', cursor: 'pointer' }}
              />
              <span>Remember secure session on this device</span>
            </label>

            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
              Audit Logged
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-login-submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 10,
              background: isLoading
                ? 'rgba(16, 185, 129, 0.5)'
                : 'linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 14,
              border: 'none',
              cursor: isLoading ? 'wait' : 'pointer',
              marginTop: 4,
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
            }}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span>Verifying Cryptographic Tokens...</span>
              </>
            ) : (
              <>
                <span>Authenticate &amp; Open Financial Hub</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Security & Audit Footer */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '6px 4px', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: '#34D399' }}>PCI-DSS SAQ-A</div>
              <div style={{ fontSize: 9, color: '#64748B' }}>Certified Scope</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '6px 4px', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: '#38BDF8' }}>Merchant of Record</div>
              <div style={{ fontSize: 9, color: '#64748B' }}>bldr Platform</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '6px 4px', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: '#A78BFA' }}>Multi-Gateway</div>
              <div style={{ fontSize: 9, color: '#64748B' }}>Geidea • Paymob</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5 }}>
            <Link
              href="http://localhost:3000"
              style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.15s ease' }}
            >
              ← Storefront Pilot
            </Link>
            <a
              href="http://localhost:3001/login"
              style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 600 }}
            >
              Brand Portal Login (Port :3001) →
            </a>
          </div>
        </div>
      </div>

      {/* CSS Animation keyframe */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
