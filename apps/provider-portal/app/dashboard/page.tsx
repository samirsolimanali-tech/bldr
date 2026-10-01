'use client';

import React from 'react';
import Link from 'next/link';
import ProviderSidebar from '../../components/Sidebar';
import { PayoutIcon, CalendarIcon, UsersIcon, TrendUpIcon } from '../../components/Icons';

/* ─── Mock Data ─────────────────────────────────────────────── */
const STUDYHUB_KPIS = [
  { label: 'Total Revenue',     value: 'EGP 312,000', change: '+14.2%', up: true,  Icon: TrendUpIcon,  bg: '#EFF6FF', color: '#1E3A8A' },
  { label: 'This Month',        value: 'EGP 48,000',  change: '+8.1%',  up: true,  Icon: CalendarIcon, bg: '#ECFDF5', color: '#065F46' },
  { label: 'Pending Payout',    value: 'EGP 28,400',  change: 'Due Sep 30', up: false, Icon: PayoutIcon, bg: '#FFFBEB', color: '#92400E' },
  { label: 'Enrolled Students', value: '1,240',       change: '+82 this month', up: true, Icon: UsersIcon, bg: '#F5F3FF', color: '#5B21B6' },
];

const BLDR_KPIS = [
  { label: 'Total Revenue',     value: 'EGP 580,000', change: '+18.5%', up: true,  Icon: TrendUpIcon,  bg: '#EFF6FF', color: '#1E3A8A' },
  { label: 'This Month',        value: 'EGP 82,500',  change: '+11.4%', up: true,  Icon: CalendarIcon, bg: '#ECFDF5', color: '#065F46' },
  { label: 'Pending Payout',    value: 'EGP 42,000',  change: 'Due Sep 30', up: false, Icon: PayoutIcon, bg: '#FFFBEB', color: '#92400E' },
  { label: 'Paid Customers',    value: '840',         change: '+64 this month', up: true, Icon: UsersIcon, bg: '#F5F3FF', color: '#5B21B6' },
];

const MONTHLY = [180, 230, 280, 340, 390, 480];
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const MAX_VAL = Math.max(...MONTHLY);

const STUDYHUB_STUDENTS = [
  { name: 'أحمد حسن (Ahmed Hassan)', email: 'ahmed@email.com', product: 'Full-Stack Bootcamp', amount: 4800, source: 'Fawry Code', date: '2026-09-26' },
  { name: 'سارة محمود (Sara Mahmoud)',   email: 'sara@email.com',  product: 'Full-Stack Bootcamp', amount: 4800, source: 'Vodafone Cash', date: '2026-09-26' },
  { name: 'عمر فاروق (Omar Farouk)',     email: 'omar@email.com',  product: 'Advanced React Cohort', amount: 3200, source: 'Card (Visa)', date: '2026-09-25' },
  { name: 'فاطمة السيد (Fatima El-Sayed)', email: 'fatima@email.com', product: 'Full-Stack Bootcamp', amount: 4800, source: 'Mobile Wallet', date: '2026-09-25' },
  { name: 'يوسف الأمين (Youssef El-Amin)', email: 'youssef@email.com', product: 'Advanced React Cohort', amount: 3200, source: 'Orange Money', date: '2026-09-24' },
];

const BLDR_CUSTOMERS = [
  { name: 'طارق محمود (Tarek Mahmoud)', email: 'tarek@edtech.eg', product: 'Education Solutions (Enterprise)', amount: 25000, source: 'Card (Geidea)', date: '2026-09-26' },
  { name: 'نور الدين (Nour El-Din)',     email: 'nour@alphamedia.com', product: 'Media Production Sprint', amount: 15000, source: 'Card (Geidea)', date: '2026-09-26' },
  { name: 'كريم زكي (Karim Zaki)',       email: 'karim@zaki.eg', product: 'Business Consulting Retainer', amount: 12000, source: 'Card (Geidea)', date: '2026-09-25' },
  { name: 'منى سليمان (Mona Soliman)',   email: 'mona@learnpro.io', product: 'Tutor Marketing Package', amount: 6500, source: 'Mobile Wallet', date: '2026-09-24' },
  { name: 'حازم شريف (Hazem Sherif)',   email: 'hazem@growth.eg', product: 'Corporate Training Workshop', amount: 18000, source: 'Fawry Code', date: '2026-09-23' },
];

export default function ProviderDashboard() {
  const [isBldr, setIsBldr] = React.useState(false);

  React.useEffect(() => {
    try {
      const email = localStorage.getItem('bldr_provider_email') || '';
      const vId = localStorage.getItem('bldr_venture_id') || '';
      if (email.includes('bldr') || vId === 'bldr') {
        setIsBldr(true);
      }
    } catch (e) {}
  }, []);

  const kpis = isBldr ? BLDR_KPIS : STUDYHUB_KPIS;
  const recentItems = isBldr ? BLDR_CUSTOMERS : STUDYHUB_STUDENTS;
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />

      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Financial Overview
          </h1>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
            Sep 2026
          </span>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {kpis.map(k => (
              <div key={k.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <k.Icon size={18} color={k.color} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
                  {k.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{k.label}</div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 9999, background: k.up ? 'var(--success-bg)' : 'var(--warning-bg)', color: k.up ? 'var(--success)' : 'var(--warning)' }}>
                  {k.change}
                </span>
              </div>
            ))}
          </div>

          {/* Chart + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 24 }}>
            {/* Revenue Chart */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Revenue Trend</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Apr – Sep 2026</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 130 }}>
                {MONTHLY.map((val, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{(val / 10).toFixed(0)}K</div>
                    <div style={{ width: '100%', background: 'linear-gradient(180deg, var(--brand) 0%, #3B5FC0 100%)', borderRadius: '5px 5px 0 0', height: `${(val / MAX_VAL) * 100}px`, minHeight: 6 }} />
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{MONTHS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Create Payment Link', href: '/payment-links', color: 'var(--brand)', bg: '#EFF6FF' },
                  { label: 'Master Checkout Studio', href: '/payment-pages', color: '#065F46', bg: '#ECFDF5' },
                  { label: 'View Settlements', href: '/payouts', color: '#92400E', bg: '#FFFBEB' },
                  { label: 'View Paid Users', href: '/students', color: '#5B21B6', bg: '#F5F3FF' },
                ].map((a) => (
                  <Link key={a.label} href={a.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 8, background: a.bg, textDecoration: 'none', border: `1px solid ${a.color}20`, transition: 'opacity 0.2s' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{a.label}</span>
                    <span style={{ fontSize: 13, color: a.color, fontWeight: 600 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Paid Users */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                {isBldr ? 'Recent Orders & Clients' : 'Recent Paid Users'}
              </h2>
              <Link href="/students" style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Customer / Client', 'Service / Plan', 'Amount', 'Source', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentItems.map((s, i) => (
                  <tr key={i} style={{ borderBottom: i < recentItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.email}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.product}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>EGP {s.amount.toLocaleString()}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{s.source}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{s.date}</td>
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
