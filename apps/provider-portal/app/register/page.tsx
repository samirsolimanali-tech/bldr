'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterLeadCapturePage() {
  const [form, setForm] = useState({
    contactName: '',
    workEmail: '',
    brandName: '',
    website: '',
    category: 'EdTech / Digital Academy',
    annualProjectedVolume: 'EGP 1M - 5M',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Store lead locally for Hub /leads integration
      try {
        const existing = JSON.parse(localStorage.getItem('bldr_brand_inquiries') || '[]');
        existing.push({
          id: `LEAD-${Date.now()}`,
          ...form,
          submittedAt: new Date().toISOString(),
          status: 'NEW',
        });
        localStorage.setItem('bldr_brand_inquiries', JSON.stringify(existing));
      } catch {}
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          padding: '32px 36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: '#0F172A',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            b/
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>bldr Management</span>
        </div>

        {submitted ? (
          <div>
            <div
              style={{
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                borderRadius: 8,
                padding: '20px',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#166534', margin: '0 0 6px' }}>
                Partnership Inquiry Received
              </h2>
              <p style={{ fontSize: 13, color: '#15803D', margin: 0, lineHeight: 1.5 }}>
                Brand onboarding is admin-governed. Our venture management team will review your details and contact you within 24 hours.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link
                href="/login"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#0EA5E9',
                  textDecoration: 'none',
                }}
              >
                Already have provisioned brand credentials? Sign in &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
              Brand Partnership &amp; Incubation
            </h1>
            <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px', lineHeight: 1.5 }}>
              Brand onboarding is admin-only. bldr acts as the sole merchant of record for all portfolio ventures. Submit an inquiry below or sign in if already provisioned.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  placeholder="e.g. Karim Mansour"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={form.workEmail}
                  onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
                  placeholder="name@company.com"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Brand / Academy Name
                </label>
                <input
                  type="text"
                  required
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="e.g. Apex Coding Academy"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 5 }}>
                  Estimated Annual Online Volume
                </label>
                <select
                  value={form.annualProjectedVolume}
                  onChange={(e) => setForm({ ...form, annualProjectedVolume: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                >
                  <option>EGP 500K - 1M</option>
                  <option>EGP 1M - 5M</option>
                  <option>EGP 5M - 20M</option>
                  <option>EGP 20M+</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 8,
                }}
              >
                {loading ? 'Submitting Inquiry...' : 'Submit Partnership Inquiry'}
              </button>
            </form>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
              <Link
                href="/login"
                style={{ fontSize: 12.5, color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}
              >
                Existing Brand Operator? Sign in at portal.bldrmanagement.com &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
