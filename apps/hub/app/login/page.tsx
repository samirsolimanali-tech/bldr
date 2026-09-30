'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HubLoginPage() {
  const [email, setEmail] = useState('admin@bldr.io');
  const [password, setPassword] = useState('CentralHub2026!');
  const [selectedVenture, setSelectedVenture] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      if (!email || !password) {
        setErrorMessage('Please provide both administrative email and password.');
        setIsLoading(false);
        return;
      }
      
      // Store financial session token
      if (typeof window !== 'undefined') {
        localStorage.setItem('bldr_hub_session', JSON.stringify({
          email,
          scope: selectedVenture,
          authenticatedAt: new Date().toISOString(),
        }));
        window.location.href = selectedVenture === 'all' ? '/' : `/?venture=${selectedVenture}`;
      }
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B132B',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        padding: '24px 16px',
        color: '#E2E8F0',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#16223C',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          padding: '36px 32px',
          position: 'relative',
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: 'linear-gradient(135deg, #2E6F5E 0%, #1E3A8A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 16,
                color: '#FFFFFF',
              }}
            >
              H/
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                Central Financial Hub
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Single Sign-On
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 4,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            Port :3003
          </span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 26 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Financial Operations Login
          </h1>
          <p style={{ fontSize: 12.5, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            Authenticate with verified administrative credentials to manage multi-gateway routing, escrow settlements, and payout reconciliation.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: '#451A1A',
              border: '1px solid #7F1D1D',
              color: '#FCA5A5',
              fontSize: 12,
              marginBottom: 18,
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email field */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>
              Administrator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 8,
                background: '#0F172A',
                border: '1px solid #334155',
                color: '#FFFFFF',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38BDF8',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 8,
                background: '#0F172A',
                border: '1px solid #334155',
                color: '#FFFFFF',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Venture Scope Selector */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>
              Target Brand Scope
            </label>
            <select
              value={selectedVenture}
              onChange={(e) => setSelectedVenture(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: '#0F172A',
                border: '1px solid #334155',
                color: '#FFFFFF',
                fontSize: 12.5,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="all">Global Infrastructure (All Brands & Ventures)</option>
              <option value="bldr">bldr Store (Internal Venture)</option>
              <option value="venture_1">Academy Alpha</option>
              <option value="venture_2">Design Systems Lab</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: 8,
              background: isLoading ? '#1E3A8A' : '#2E6F5E',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 13.5,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: 6,
              transition: 'background 0.15s ease',
            }}
          >
            {isLoading ? 'Verifying Credentials...' : 'Authenticate & Open Financial Hub →'}
          </button>
        </form>

        {/* Security & Audit Footer */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#64748B' }}>
            <span>TLS 1.3 / 256-Bit Encrypted</span>
            <a
              href="http://localhost:3002/dashboard"
              style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 600 }}
            >
              ← Return to Store Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
