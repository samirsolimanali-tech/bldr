'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { formatCurrency, SimulationBanner } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const getToken = () => localStorage.getItem('bldr_admin_token');

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSim, setIsSim] = useState(true);

  useEffect(() => {
    fetch(`${API}/config`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setIsSim(d.paymentSimulationMode); })
      .catch(() => {});
  }, []);

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const qs = new URLSearchParams({ ...(statusFilter ? { status: statusFilter } : {}) });
    try {
      const res = await fetch(`${API}/orders?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(data.data || []);
      setMeta(data.meta || { total: 0 });
    } catch {
      // handle fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleApproveRedirect = async (orderId: string) => {
    const token = getToken();
    if (!token) return;

    setActionLoadingId(orderId);
    setFeedback(null);

    try {
      const res = await fetch(`${API}/orders/${orderId}/approve-redirect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to approve redirect sale');
      }

      setFeedback({
        type: 'success',
        message: `Order #${orderId.slice(-8).toUpperCase()} approved! Order status is now PAID and provider payout ledger has been credited.`,
      });
      fetchOrders();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to approve order',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        {isSim && <SimulationBanner message="Simulation mode active — no real payments are being processed" />}
        <header className="topbar">
          <h1 className="topbar-title">Order Audit & Settlements</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: '', label: 'All Orders' },
              { id: 'PENDING_VERIFICATION', label: '🔍 Pending Verification' },
              { id: 'PAID', label: 'Paid' },
              { id: 'PENDING', label: 'Pending' },
              { id: 'FAILED', label: 'Failed' },
            ].map(s => (
              <button
                key={s.id}
                className={`btn btn-sm ${statusFilter === s.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </header>

        <div className="page-content fade-up">
          {feedback && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: 500,
                background: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
                border: `1px solid ${feedback.type === 'success' ? '#C2E4D2' : '#F8CCC5'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{feedback.message}</span>
              <button
                onClick={() => setFeedback(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {meta.total} registered order{meta.total !== 1 ? 's' : ''}
            </p>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Anti-fraud safeguard: External redirect sales require explicit admin approval before payout credit.
            </span>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Source</th>
                  <th>Provider</th>
                  <th>Customer</th>
                  <th>Gross</th>
                  <th>Commission</th>
                  <th>Net Provider</th>
                  <th>Gateway</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading records…</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={10}><div className="empty-state"><div className="empty-state-icon">📋</div><p>No orders found</p></div></td></tr>
                ) : orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      #{o.id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <span className={`badge ${o.source === 'REDIRECT' ? 'badge-accent' : 'badge-blue'}`}>
                        {o.source === 'REDIRECT' ? '↗ Redirect' : '🛒 Native'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{o.provider?.name || '—'}</td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{o.customerEmail}</td>
                    <td className="tabular-nums" style={{ fontWeight: 600 }}>
                      {formatCurrency(o.amount, o.currency || 'USD')}
                    </td>
                    <td className="tabular-nums" style={{ color: 'var(--brand)', fontSize: '13px' }}>
                      {formatCurrency(o.commissionAmount || 0, o.currency || 'USD')}
                    </td>
                    <td className="tabular-nums" style={{ fontWeight: 700, color: 'var(--success)' }}>
                      {formatCurrency(o.netAmount || 0, o.currency || 'USD')}
                    </td>
                    <td>
                      <span className="badge badge-muted" style={{ fontSize: '10px' }}>{o.gatewayUsed}</span>
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
                    <td>
                      {o.status === 'PENDING_VERIFICATION' ? (
                        <button
                          id={`btn-approve-${o.id}`}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                          disabled={actionLoadingId === o.id}
                          onClick={() => handleApproveRedirect(o.id)}
                        >
                          {actionLoadingId === o.id ? 'Approving…' : '✓ Approve & Credit'}
                        </button>
                      ) : o.status === 'PAID' ? (
                        <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>✓ Settled</span>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
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
