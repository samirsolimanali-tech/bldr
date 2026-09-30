'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

/* ─── Mock Data ─────────────────────────────────────────────── */
const KPI_CARDS = [
  { label: 'Total Revenue', value: 'EGP 1.24M', change: '+18.4%', up: true, icon: '▲', color: '#1E3A8A', bg: '#EFF6FF' },
  { label: 'Active Providers', value: '24', change: '+3 this month', up: true, icon: '⊞', color: '#065F46', bg: '#ECFDF5' },
  { label: 'Products & Services', value: '87', change: '+12 new', up: true, icon: '◈', color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Enrolled Students', value: '3,420', change: '+8.2%', up: true, icon: '◎', color: '#D10721', bg: '#FEF2F2' },
];

const RECENT_PROVIDERS = [
  { id: 'p1', name: 'StudyHub Academy', type: 'EdTech', status: 'Active', revenue: 'EGP 312,000', joined: '2025-01-12', avatar: 'SH', color: '#0EA5E9' },
  { id: 'p2', name: 'Sidekick Studio', type: 'Creative & Marketing', status: 'Active', revenue: 'EGP 198,500', joined: '2025-02-08', avatar: 'SS', color: '#10B981' },
  { id: 'p3', name: 'TechBridge Labs', type: 'Software', status: 'Active', revenue: 'EGP 445,000', joined: '2025-01-28', avatar: 'TB', color: '#7C3AED' },
  { id: 'p4', name: 'GrowthCo MENA', type: 'Marketing', status: 'Pending', revenue: 'EGP 0', joined: '2026-09-20', avatar: 'GC', color: '#F59E0B' },
  { id: 'p5', name: 'Apex Consulting', type: 'Strategy', status: 'Active', revenue: 'EGP 87,200', joined: '2025-03-15', avatar: 'AC', color: '#EF4444' },
];

const RECENT_ACTIVITY = [
  { text: 'New provider application: GrowthCo MENA', time: '2 hours ago', type: 'new' },
  { text: 'Product published: "Advanced React Bootcamp"', time: '4 hours ago', type: 'publish' },
  { text: 'Provider TechBridge Labs reached EGP 445K revenue', time: '1 day ago', type: 'milestone' },
  { text: 'Service updated: "Brand Identity System"', time: '1 day ago', type: 'update' },
  { text: 'New service submission from Sidekick Studio', time: '2 days ago', type: 'new' },
];

const MONTHLY_DATA = [
  { month: 'Apr', revenue: 68000, providers: 18 },
  { month: 'May', revenue: 87000, providers: 19 },
  { month: 'Jun', revenue: 102000, providers: 20 },
  { month: 'Jul', revenue: 115000, providers: 21 },
  { month: 'Aug', revenue: 138000, providers: 22 },
  { month: 'Sep', revenue: 156000, providers: 24 },
];

const MAX_REV = Math.max(...MONTHLY_DATA.map(d => d.revenue));

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    Active:  { bg: '#ECFDF5', color: '#065F46' },
    Pending: { bg: '#FFFBEB', color: '#92400E' },
    Suspended: { bg: '#FEF2F2', color: '#991B1B' },
  };
  const s = styles[status] || styles.Active;
  return (
    <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function ActivityDot({ type }: { type: string }) {
  const colors: Record<string, string> = { new: '#3B82F6', publish: '#10B981', milestone: '#F59E0B', update: '#7C3AED' };
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[type] || '#6B7280', display: 'inline-block', flexShrink: 0 }} />;
}

/* ─── Admin Dashboard ───────────────────────────────────────── */
export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Platform Overview
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sep 2026</span>
            <Link href="/providers/new" className="btn btn-primary btn-sm" style={{ background: 'var(--brand)', color: 'white', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}>
              + Add Provider
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            {KPI_CARDS.map((kpi) => (
              <div key={kpi.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {kpi.icon}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: kpi.up ? '#065F46' : '#991B1B', background: kpi.up ? '#ECFDF5' : '#FEF2F2', padding: '2px 8px', borderRadius: 9999 }}>
                    {kpi.change}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Content Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
            {/* Revenue Chart */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Revenue</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140, paddingBottom: 8 }}>
                {MONTHLY_DATA.map((d) => (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      EGP {(d.revenue / 1000).toFixed(0)}K
                    </div>
                    <div
                      style={{
                        width: '100%',
                        background: 'linear-gradient(180deg, var(--brand) 0%, #3B5FC0 100%)',
                        borderRadius: '6px 6px 0 0',
                        height: `${(d.revenue / MAX_REV) * 110}px`,
                        transition: 'height 0.4s ease',
                        minHeight: 8,
                      }}
                    />
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{d.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                Recent Activity
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <ActivityDot type={a.type} />
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 2 }}>{a.text}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Quick Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Products & Courses', val: '42 Live', icon: '◈', link: '/products' },
              { label: 'Students CRM', val: '3,420 Enrolled', icon: '▣', link: '/students' },
              { label: 'Discounts & Coupons', val: '5 Active', icon: '◇', link: '/discounts' },
              { label: 'Orders & Audit', val: '1,890 Orders', icon: '≡', link: '/orders' },
            ].map((item) => (
              <Link key={item.label} href={item.link} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: 24, color: 'var(--brand)' }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{item.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Providers */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                Providers
              </h2>
              <Link href="/providers" style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-canvas)' }}>
                    {['Provider', 'Type', 'Status', 'Revenue', 'Joined', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_PROVIDERS.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: i < RECENT_PROVIDERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {p.avatar}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{p.type}</td>
                      <td style={{ padding: '14px 16px' }}><StatusPill status={p.status} /></td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{p.revenue}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{p.joined}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link href={`/providers/${p.id}`} style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>View →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
