'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { KpiStat, formatCurrency } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('bldr_token');
    if (!token) { window.location.href = '/login'; return; }
    fetch(`${API}${url}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url]);
  return { data, loading };
}

export default function DashboardPage() {
  const { data: orders, loading: oLoading } = useApi<{ data: any[]; meta: { total: number } }>('/orders/mine?page=1');
  const { data: leads, loading: lLoading } = useApi<{ data: any[]; meta: { total: number } }>('/leads/mine?page=1');
  const { data: payouts } = useApi<{ data: any[] }>('/payouts/mine?page=1');

  const totalRevenue = orders?.data?.filter(o => o.status === 'PAID').reduce((s: number, o: any) => s + Number(o.netAmount || 0), 0) || 0;
  const pendingOrders = orders?.data?.filter(o => o.status === 'PENDING' || o.status === 'PENDING_VERIFICATION').length || 0;
  const newLeads = leads?.data?.filter((l: any) => l.status === 'NEW').length || 0;

  return (
    <div className="shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Dashboard</h1>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </header>
        <div className="page-content fade-up">
          {/* KPI Summary Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <KpiStat
              label="Net Settled Revenue"
              value={oLoading ? '—' : formatCurrency(totalRevenue, 'USD')}
              helper="Paid orders net of platform commission"
              deltaType="positive"
            />
            <KpiStat
              label="Total Orders"
              value={oLoading ? '—' : orders?.meta?.total ?? 0}
              helper={`${pendingOrders} awaiting verification/settlement`}
            />
            <KpiStat
              label="Inbound Leads"
              value={lLoading ? '—' : leads?.meta?.total ?? 0}
              helper={`${newLeads} new proposals pending`}
              delta={newLeads > 0 ? `+${newLeads} new` : undefined}
              deltaType={newLeads > 0 ? 'positive' : 'neutral'}
            />
            <KpiStat
              label="Payout Disbursements"
              value={payouts?.data?.length ?? 0}
              helper="Settled ledger transfers"
            />
          </div>

          {/* Recent orders */}
          <div className="section-header">
            <h2 className="section-title">Recent Transactions</h2>
            <a href="/orders" className="btn btn-secondary btn-sm">View all orders →</a>
          </div>
          <div className="table-wrap" style={{ marginBottom: '32px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Source</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Gross</th>
                  <th>Net Payable</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {oLoading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Loading records…</td></tr>
                ) : (orders?.data || []).slice(0, 5).map((o: any) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      #{o.id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <span className={`badge ${o.source === 'REDIRECT' ? 'badge-muted' : 'badge-green'}`}>
                        {o.source === 'REDIRECT' ? 'External Redirect' : 'Native Escrow'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{o.listing?.title || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{o.customerEmail}</td>
                    <td className="tabular-nums" style={{ fontWeight: 600 }}>{formatCurrency(o.amount, o.currency || 'USD')}</td>
                    <td className="tabular-nums" style={{ fontWeight: 600, color: 'var(--success)' }}>
                      {formatCurrency(o.netAmount, o.currency || 'USD')}
                    </td>
                    <td>
                      <span className={`badge ${
                        o.status === 'PAID'
                          ? 'badge-green'
                          : o.status === 'PENDING_VERIFICATION'
                          ? 'badge-amber'
                          : o.status === 'FAILED'
                          ? 'badge-red'
                          : 'badge-muted'
                      }`}>
                        {o.status === 'PENDING_VERIFICATION' ? 'Pending Verification' : o.status}
                      </span>
                    </td>
                    <td className="tabular-nums" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!oLoading && (orders?.data || []).length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent leads */}
          <div className="section-header">
            <h2 className="section-title">Client Inquiries</h2>
            <a href="/leads" className="btn btn-secondary btn-sm">Manage all leads →</a>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Contact Name</th><th>Email</th><th>Target Service</th><th>Engagement</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {lLoading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Loading leads…</td></tr>
                ) : (leads?.data || []).slice(0, 5).map((l: any) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{l.email}</td>
                    <td>{l.listing?.title || '—'}</td>
                    <td>
                      <span className={`badge ${l.engagementType === 'BOOK_CALL' ? 'badge-blue' : 'badge-muted'}`}>
                        {l.engagementType === 'BOOK_CALL' ? 'Discovery Call' : 'RFP Proposal'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${l.status === 'NEW' ? 'badge-amber' : l.status === 'CONTACTED' ? 'badge-blue' : 'badge-green'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="tabular-nums" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!lLoading && (leads?.data || []).length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No leads submitted yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
