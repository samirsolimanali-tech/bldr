'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

/* ─── Mock Analytics Data ───────────────────────────────────── */
const MONTHLY = [
  { month: 'Apr', revenue: 68000, orders: 312, newProviders: 2 },
  { month: 'May', revenue: 87000, orders: 401, newProviders: 1 },
  { month: 'Jun', revenue: 102000, orders: 487, newProviders: 1 },
  { month: 'Jul', revenue: 115000, orders: 520, newProviders: 2 },
  { month: 'Aug', revenue: 138000, orders: 634, newProviders: 1 },
  { month: 'Sep', revenue: 156000, orders: 712, newProviders: 3 },
];
const MAX_REV = Math.max(...MONTHLY.map(d => d.revenue));
const MAX_ORD = Math.max(...MONTHLY.map(d => d.orders));

const BY_CATEGORY = [
  { label: 'Software & Tech', revenue: 445000, share: 35, color: '#1E3A8A' },
  { label: 'EdTech Products', revenue: 312000, share: 25, color: '#0EA5E9' },
  { label: 'Marketing & Ads', revenue: 198500, share: 16, color: '#D10721' },
  { label: 'Education Institute', revenue: 203000, share: 16, color: '#7C3AED' },
  { label: 'Strategy & Advisory', revenue: 87200, share: 7, color: '#F59E0B' },
  { label: 'Creative & Brand', revenue: 12300, share: 1, color: '#10B981' },
];
const TOTAL_REV = BY_CATEGORY.reduce((s, c) => s + c.revenue, 0);

const TOP_PRODUCTS = [
  { name: 'Full-Stack Web Bootcamp', provider: 'TechBridge Labs', sales: 87, revenue: 417600 },
  { name: 'Digital Marketing Mastery', provider: 'Sidekick Studio', sales: 134, revenue: 160800 },
  { name: 'Advanced React Workshop', provider: 'StudyHub Academy', sales: 65, revenue: 78000 },
  { name: 'Brand Identity System', provider: 'Sidekick Studio', sales: 18, revenue: 450000 },
  { name: 'Executive MBA Program', provider: 'EL HESA Institute', sales: 42, revenue: 336000 },
];

const BRAND_PERFORMANCE = [
  {
    brand: 'bldr Store',
    tag: '1st-Party Direct',
    isFirstParty: true,
    model: '100% Retained',
    grossGmv: 380000,
    gatewayFees: 10450,
    netPlatformEarnings: 369550,
    providerPayout: 0, // 1st party retains all
    orders: 820,
    color: '#1E3A8A',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    brand: 'StudyHub Academy',
    tag: 'Licensed Academy',
    isFirstParty: false,
    model: '15% Commission',
    grossGmv: 312000,
    gatewayFees: 8580,
    netPlatformEarnings: 46800,
    providerPayout: 256620,
    orders: 450,
    color: '#0369A1',
    bg: '#E0F2FE',
    border: '#BAE6FD',
  },
  {
    brand: 'EL HESA Institute',
    tag: 'Higher Ed Partner',
    isFirstParty: false,
    model: '12% Commission',
    grossGmv: 336000,
    gatewayFees: 9240,
    netPlatformEarnings: 40320,
    providerPayout: 286440,
    orders: 42,
    color: '#047857',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    brand: 'Apex Classes',
    tag: 'Professional Series',
    isFirstParty: false,
    model: '15% Commission',
    grossGmv: 87200,
    gatewayFees: 2398,
    netPlatformEarnings: 13080,
    providerPayout: 71722,
    orders: 88,
    color: '#B45309',
    bg: '#FEF3C7',
    border: '#FDE68A',
  },
  {
    brand: 'Career Hub',
    tag: 'Upskilling Partner',
    isFirstParty: false,
    model: '20% Commission',
    grossGmv: 124800,
    gatewayFees: 3432,
    netPlatformEarnings: 24960,
    providerPayout: 96408,
    orders: 142,
    color: '#6D28D9',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
];

export default function AnalyticsPage() {
  const [tab, setTab] = useState<'revenue' | 'orders'>('revenue');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Analytics & Financial P&L</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="http://localhost:3003"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#0284C7',
                background: '#F0F9FF',
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #BAE6FD',
                textDecoration: 'none',
              }}
            >
              Audit in Payment Hub (:3003) &rarr;
            </a>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-canvas)', padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
              Last 6 months — Apr → Sep 2026
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>

          {/* Top KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Platform GMV', val: `EGP ${(TOTAL_REV / 1000000).toFixed(2)}M`, sub: '+18.4% vs last period', up: true },
              { label: 'bldr Direct Brand GMV', val: 'EGP 380,000', sub: '100% margin retained', up: true },
              { label: 'Platform Net Commission', val: 'EGP 125,160', sub: '+15.2% take-rate margin', up: true },
              { label: 'Escrow Payouts Settled', val: 'EGP 711,190', sub: 'Disbursed to academies', up: true },
            ].map(k => (
              <div key={k.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>{k.val}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: k.up ? '#065F46' : '#991B1B' }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Brand Performance & Financial Tracking Matrix */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Brand Financial Tracking & P&L Breakdown
                </h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Consolidated tracking of 1st-party direct sales (bldr Store) versus 3rd-party academy revenue share.
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: 9999 }}>
                ● Real-Time Ledger Synchronized
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Brand / Venture', 'Revenue Model', 'Gross Sales (GMV)', 'Gateway Cost (~2.75%)', 'bldr Net Earnings', 'Provider Payout', 'Orders', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BRAND_PERFORMANCE.map((b, i) => (
                  <tr
                    key={b.brand}
                    style={{
                      borderBottom: i < BRAND_PERFORMANCE.length - 1 ? '1px solid var(--border)' : 'none',
                      background: b.isFirstParty ? '#F8FAFC' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 12,
                            fontWeight: 700,
                            background: b.bg,
                            color: b.color,
                            border: `1px solid ${b.border}`,
                          }}
                        >
                          {b.brand}
                        </span>
                        {b.isFirstParty && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#1E3A8A', background: '#DBEAFE', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                            1st Party Store
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {b.model}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      EGP {b.grossGmv.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      - EGP {b.gatewayFees.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#047857', fontVariantNumeric: 'tabular-nums' }}>
                      EGP {b.netPlatformEarnings.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: b.isFirstParty ? 'var(--text-muted)' : '#0284C7', fontVariantNumeric: 'tabular-nums' }}>
                      {b.isFirstParty ? 'N/A (Direct)' : `EGP ${b.providerPayout.toLocaleString()}`}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {b.orders.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <a
                        href={b.isFirstParty ? "http://localhost:3003/ventures/bldr" : "http://localhost:3003/transactions"}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        Inspect →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Bar Chart */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {tab === 'revenue' ? 'Monthly Revenue (Gross)' : 'Monthly Orders'}
                </h2>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['revenue', 'orders'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid var(--border-strong)', background: tab === t ? 'var(--brand)' : 'white', color: tab === t ? 'white' : 'var(--text-secondary)', cursor: 'pointer' }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
                {MONTHLY.map(d => {
                  const val = tab === 'revenue' ? d.revenue : d.orders;
                  const max = tab === 'revenue' ? MAX_REV : MAX_ORD;
                  return (
                    <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
                        {tab === 'revenue' ? `EGP ${(val as number / 1000).toFixed(0)}K` : val}
                      </div>
                      <div style={{ width: '100%', background: 'linear-gradient(180deg, var(--brand) 0%, #3B5FC0 100%)', borderRadius: '5px 5px 0 0', height: `${((val as number) / max) * 120}px`, minHeight: 8, transition: 'height 0.4s ease' }} />
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{d.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue by Category */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                Revenue by Category
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {BY_CATEGORY.map(cat => (
                  <div key={cat.label}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{cat.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{cat.share}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 999 }}>
                      <div style={{ height: '100%', width: `${cat.share}%`, background: cat.color, borderRadius: 999, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                Top Performing Products & Services
              </h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['#', 'Name', 'Provider', 'Sales', 'Revenue', 'Bar'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={p.name} style={{ borderBottom: i < TOP_PRODUCTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>#{i + 1}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{p.provider}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{p.sales} sales</td>
                    <td style={{ padding: '14px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      EGP {p.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', minWidth: 120 }}>
                      <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 999, width: 100 }}>
                        <div style={{ height: '100%', width: `${(p.revenue / 450000) * 100}%`, background: 'linear-gradient(90deg, var(--brand), var(--accent))', borderRadius: 999 }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
