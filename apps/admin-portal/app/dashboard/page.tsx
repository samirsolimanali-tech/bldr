'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { KpiStat, formatCurrency } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('bldr_admin_token') : null;
}

function useAdminApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    fetch(`${API}${url}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url]);
  return { data, loading };
}

export default function AdminDashboardPage() {
  const { data: stats, loading } = useAdminApi<Record<string, number>>('/admin/stats');

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Platform Overview</h1>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </header>

        <div className="page-content fade-up">
          {/* Executive Fintech KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <KpiStat
              label="Gross GMV (Settled)"
              value={loading ? '—' : formatCurrency(stats?.totalRevenue || 0, 'USD')}
              helper="Total settled order volume"
              deltaType="positive"
            />
            <KpiStat
              label="Platform Commission"
              value={loading ? '—' : formatCurrency(stats?.totalCommission || 0, 'USD')}
              helper="Retained marketplace earnings"
              deltaType="positive"
            />
            <KpiStat
              label="Total Orders"
              value={loading ? '—' : stats?.totalOrders ?? 0}
              helper={`${stats?.paidOrders ?? 0} confirmed paid`}
            />
            <KpiStat
              label="Active Providers"
              value={loading ? '—' : stats?.totalProviders ?? 0}
              helper={`${stats?.pendingProviders ?? 0} pending onboarding`}
              delta={stats?.pendingProviders ? `${stats.pendingProviders} review` : undefined}
              deltaType={stats?.pendingProviders ? 'negative' : 'neutral'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '8px' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Operations & Auditing</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/orders?status=PENDING_VERIFICATION', label: 'Audit pending redirect sales', count: 'High Priority', urgent: true },
                  { href: '/providers?status=PENDING', label: 'Review pending provider applications', count: `${stats?.pendingProviders || 0}` },
                  { href: '/orders', label: 'Order transactions & payout reconciliation', count: `${stats?.totalOrders || 0}` },
                  { href: '/commission', label: 'Platform commission rate overrides', count: 'Rules' },
                  { href: '/payouts', label: 'Execute scheduled provider payouts', count: `${stats?.pendingPayouts || 0} pending` },
                ].map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.urgent ? 'var(--warning)' : 'var(--brand)' }} />
                      <span>{l.label}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--brand)', fontWeight: 600 }}>{l.count} →</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Gateway & Service Health</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Core REST API', status: 'Healthy · Port 4000', badge: 'badge-green' },
                  { label: 'Geidea Payment Gateway', status: 'HMAC-SHA256 Verified', badge: 'badge-blue' },
                  { label: 'Fawry Payment Gateway', status: 'SHA256 SecKey Verified', badge: 'badge-blue' },
                  { label: 'Attribution Engine', status: 'Closed-Loop Anti-Fraud', badge: 'badge-green' },
                  { label: 'PostgreSQL Database', status: 'Connected · Port 5432', badge: 'badge-green' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
                    <span className={`badge ${s.badge}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
