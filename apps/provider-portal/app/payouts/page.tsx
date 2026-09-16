'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bldr_token');
    if (!token) { window.location.href = '/login'; return; }
    fetch(`${API}/payouts/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setPayouts(d.data || []); setLoading(false); });
  }, []);

  const totalPending = payouts.filter(p => p.status === 'PENDING').reduce((s, p) => s + Number(p.netAmount), 0);
  const totalPaid = payouts.filter(p => p.status === 'PAID').reduce((s, p) => s + Number(p.netAmount), 0);

  return (
    <div className="shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Payout Ledger</h1>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Read-only — contact admin for payouts</span>
        </header>
        <div className="page-content fade-up">
          <div className="stats-grid" style={{ marginBottom: '32px' }}>
            <div className="stat-card">
              <div className="stat-card-label">Pending payout</div>
              <div className="stat-card-value" style={{ color: 'var(--amber)' }}>${totalPending.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Total paid out</div>
              <div className="stat-card-value" style={{ color: 'var(--green)' }}>${totalPaid.toFixed(2)}</div>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Period</th><th>Gross</th><th>Commission</th><th>Net</th><th>Status</th><th>Paid At</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
                ) : payouts.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">💰</div><p>No payout records yet</p></div></td></tr>
                ) : payouts.map(p => (
                  <tr key={p.id}>
                    <td>{new Date(p.periodStart).toLocaleDateString()} – {new Date(p.periodEnd).toLocaleDateString()}</td>
                    <td>${Number(p.grossAmount).toFixed(2)}</td>
                    <td style={{ color: 'var(--red)' }}>-${Number(p.commissionAmount).toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--green)' }}>${Number(p.netAmount).toFixed(2)}</td>
                    <td><span className={`badge ${p.status === 'PAID' ? 'badge-green' : 'badge-amber'}`}>{p.status}</span></td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
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
