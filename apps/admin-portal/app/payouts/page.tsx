'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const getToken = () => localStorage.getItem('bldr_admin_token');

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPayouts = async () => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const res = await fetch(`${API}/payouts`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setPayouts(data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPayouts(); }, []);

  const totalPending = payouts.filter(p => p.status === 'PENDING').reduce((s, p) => s + Number(p.netAmount), 0);

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Internal Brand Settlements (Central Hub Redirect)</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Multi-brand internal transfer records and ledger statements are audited and authorized via the Central Payment Hub.
            </p>
          </div>
          <a
            href="http://localhost:3003/payouts"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#059669',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>Open Hub Settlements (:3003)</span>
            <span>&rarr;</span>
          </a>
        </header>
        <div className="page-content fade-up">
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, color: '#065F46', fontWeight: 600 }}>
              Unified Settlement Infrastructure: Inter-entity transfers between the bldr merchant holding pool and brand ledgers are audited exclusively via the Central Payment Hub.
            </div>
            <a href="http://localhost:3003/payouts" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: '#047857', textDecoration: 'underline' }}>
              Go to Hub Settlements &rarr;
            </a>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Brand</th><th>Period</th><th>Gross</th><th>Platform Fee</th><th>Net Settled</th><th>Status</th><th>Settled At</th><th>Transfer Ref</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
                ) : payouts.length === 0 ? (
                  <tr><td colSpan={9}><div className="empty-state"><p>No settlement records yet</p></div></td></tr>
                ) : payouts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.provider?.name || '—'}</td>
                    <td style={{ fontSize: '12px' }}>{new Date(p.periodStart).toLocaleDateString()} – {new Date(p.periodEnd).toLocaleDateString()}</td>
                    <td>EGP {Number(p.grossAmount).toFixed(2)}</td>
                    <td style={{ color: 'var(--red)' }}>-EGP {Number(p.commissionAmount).toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--green)' }}>EGP {Number(p.netAmount).toFixed(2)}</td>
                    <td><span className={`badge ${p.status === 'PAID' ? 'badge-green' : 'badge-amber'}`}>{p.status === 'PAID' ? 'Settled' : 'Pending'}</span></td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
