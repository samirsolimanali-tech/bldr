'use client';

import React from 'react';
import ProviderSidebar from '../../components/Sidebar';

/* ─── Bldr-assigned options for this provider ─────────────────
   These are READ-ONLY from the provider's perspective.
   Managed only by Bldr Super Admin / Hub admin.
─────────────────────────────────────────────────────────────── */
const OPTIONS = {
  portal: {
    title: 'Portal Configuration',
    items: [
      { label: 'Provider Code', value: 'SH', type: 'text' },
      { label: 'Platform Tier', value: 'Growth', type: 'badge-success' },
      { label: 'Commission Rate', value: '5%', type: 'text' },
      { label: 'Max Payment Links', value: '25 active', type: 'text' },
      { label: 'Max Payment Pages', value: '10 active', type: 'text' },
      { label: 'Custom Domain', value: 'pay.studyhub.io', type: 'link' },
    ],
  },
  payments: {
    title: 'Enabled Payment Methods',
    items: [
      { label: 'Credit / Debit Card', value: 'Enabled', type: 'badge-success' },
      { label: 'Mada', value: 'Enabled', type: 'badge-success' },
      { label: 'Apple Pay', value: 'Enabled', type: 'badge-success' },
      { label: 'STC Pay', value: 'Disabled', type: 'badge-muted' },
      { label: 'Bank Transfer', value: 'Disabled', type: 'badge-muted' },
      { label: 'BNPL (Tamara)', value: 'Disabled', type: 'badge-muted' },
    ],
  },
  gateway: {
    title: 'Payment Gateway Assignment',
    items: [
      { label: 'Primary Gateway', value: 'Tap Payments', type: 'badge-accent' },
      { label: 'Fallback Gateway', value: 'Stripe', type: 'badge-accent' },
      { label: 'API Access', value: 'Read-only (via Bldr)', type: 'text' },
      { label: 'Webhook Endpoint', value: 'hub.bldr.io/webhooks/sh', type: 'code' },
    ],
  },
  payout: {
    title: 'Payout Settings',
    items: [
      { label: 'Payout Schedule', value: 'Bi-monthly (1st & 15th)', type: 'text' },
      { label: 'Hold Period', value: '7 days after transaction', type: 'text' },
      { label: 'Currency', value: 'EGP (Egyptian Pound)', type: 'text' },
    ],
  },
};

function ValueDisplay({ value, type }: { value: string; type: string }) {
  if (type === 'badge-success') return <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: '#ECFDF5', color: '#065F46' }}>{value}</span>;
  if (type === 'badge-muted') return <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>{value}</span>;
  if (type === 'badge-accent') return <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: '#EFF6FF', color: '#1E3A8A' }}>{value}</span>;
  if (type === 'code') return <code style={{ fontSize: 12, background: 'var(--bg-elevated)', padding: '3px 8px', borderRadius: 4, color: 'var(--text-primary)', border: '1px solid var(--border)' }}>{value}</code>;
  if (type === 'link') return <a href={`https://${value}`} target="_blank" style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 500, textDecoration: 'none' }}>{value} ↗</a>;
  return <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>;
}

export default function ProviderOptionsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Bldr Options</h1>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
            Read-only — Managed by Bldr
          </span>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {/* Notice */}
          <div style={{ background: '#EFF6FF', borderRadius: 12, border: '1px solid #BFDBFE', padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>ℹ️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1E3A8A', marginBottom: 2 }}>Configuration managed by Bldr</div>
              <div style={{ fontSize: 13, color: '#3B82F6' }}>These settings are assigned to your account by Bldr. To request changes, contact your account manager.</div>
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {Object.values(OPTIONS).map(section => (
              <div key={section.title} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-canvas)' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{section.title}</h2>
                </div>
                <div style={{ padding: '4px 0' }}>
                  {section.items.map((item, i) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < section.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.label}</span>
                      <ValueDisplay value={item.value} type={item.type} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
