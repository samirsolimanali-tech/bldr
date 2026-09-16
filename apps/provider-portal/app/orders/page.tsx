'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Modal, formatCurrency, SimulationBanner } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isSim, setIsSim] = useState(true);

  // Report sale modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    clickId: '',
    amount: '',
    customerEmail: '',
    customerName: '',
    orderRef: '',
    currency: 'USD',
  });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  const fetch_ = async () => {
    const token = localStorage.getItem('bldr_token');
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), ...(statusFilter ? { status: statusFilter } : {}) });
    const res = await fetch(`${API}/orders/mine?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setOrders(data.data || []);
    setMeta(data.meta || { total: 0 });
    setLoading(false);
  };

  useEffect(() => {
    fetch(`${API}/config`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setIsSim(d.paymentSimulationMode); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetch_(); }, [page, statusFilter]);

  const handleReportSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitting(true);
    setReportError('');
    setReportSuccess('');

    try {
      const token = localStorage.getItem('bldr_token');
      if (!token) throw new Error('You must be logged in to report a sale');

      const res = await fetch(`${API}/orders/report-sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clickId: reportForm.clickId.trim(),
          amount: parseFloat(reportForm.amount),
          customerEmail: reportForm.customerEmail.trim() || undefined,
          customerName: reportForm.customerName.trim() || undefined,
          orderRef: reportForm.orderRef.trim() || undefined,
          currency: reportForm.currency,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to report redirect sale');
      }

      const result = await res.json();
      setReportSuccess(`Sale reported successfully! Order #${result.orderId.slice(-8).toUpperCase()} is now PENDING VERIFICATION.`);
      setReportForm({
        clickId: '',
        amount: '',
        customerEmail: '',
        customerName: '',
        orderRef: '',
        currency: 'USD',
      });
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess('');
        fetch_();
      }, 1500);
    } catch (err: any) {
      setReportError(err.message || 'Failed to report redirect sale');
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="shell">
      <Sidebar />
      <div className="main-content">
        {isSim && <SimulationBanner message="Simulation mode active — no real payments are being processed" />}
        <header className="topbar">
          <h1 className="topbar-title">Financial Ledger & Orders</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              id="btn-open-report-sale"
              className="btn btn-accent btn-sm"
              onClick={() => setIsReportModalOpen(true)}
            >
              + Report Redirect Sale
            </button>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['', 'PENDING_VERIFICATION', 'PAID', 'PENDING', 'FAILED'].map(s => (
                <button
                  key={s}
                  className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                >
                  {s === 'PENDING_VERIFICATION' ? 'Verification' : s || 'All Orders'}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="page-content fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {meta.total} recorded order{meta.total !== 1 ? 's' : ''}
            </p>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Redirect sales remain in Pending Verification until verified by admin.
            </span>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Source</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Gross</th>
                  <th>Commission</th>
                  <th>Net Receivable</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading orders…</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={9}><div className="empty-state"><div className="empty-state-icon">📋</div><p>No orders matching filter</p></div></td></tr>
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
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.listing?.title || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{o.customerEmail}</td>
                    <td className="tabular-nums" style={{ fontWeight: 600 }}>
                      {formatCurrency(o.amount, o.currency || 'USD')}
                    </td>
                    <td className="tabular-nums" style={{ color: 'var(--danger)', fontSize: '13px' }}>
                      -{formatCurrency(o.commissionAmount || 0, o.currency || 'USD')}
                    </td>
                    <td className="tabular-nums" style={{ fontWeight: 700, color: 'var(--success)' }}>
                      {formatCurrency(o.netAmount || 0, o.currency || 'USD')}
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Sale Modal */}
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title="Report External Redirect Sale"
        >
          <form onSubmit={handleReportSale} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Report a sale completed on your external storefront. The sale will be logged in <strong>Pending Verification</strong> and audited by admin before payout balance is credited.
            </p>

            <div className="form-group">
              <label className="form-label">Tracking Click ID *</label>
              <input
                id="report-click-id"
                className="form-input"
                type="text"
                required
                placeholder="e.g. 7f9a12c8-4b2a-4321..."
                value={reportForm.clickId}
                onChange={e => setReportForm(f => ({ ...f, clickId: e.target.value }))}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                This is the ?click_id parameter passed to your store when the customer visited.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Total Amount Paid *</label>
                <input
                  id="report-amount"
                  className="form-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={reportForm.amount}
                  onChange={e => setReportForm(f => ({ ...f, amount: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  id="report-currency"
                  className="form-input"
                  value={reportForm.currency}
                  onChange={e => setReportForm(f => ({ ...f, currency: e.target.value }))}
                >
                  {['USD', 'EGP', 'SAR', 'AED', 'GBP', 'EUR'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Email</label>
              <input
                id="report-email"
                className="form-input"
                type="email"
                placeholder="customer@example.com"
                value={reportForm.customerEmail}
                onChange={e => setReportForm(f => ({ ...f, customerEmail: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">External Order Ref / Invoice #</label>
              <input
                id="report-order-ref"
                className="form-input"
                type="text"
                placeholder="INV-2026-001"
                value={reportForm.orderRef}
                onChange={e => setReportForm(f => ({ ...f, orderRef: e.target.value }))}
              />
            </div>

            {reportError && (
              <p style={{ color: 'var(--danger)', fontSize: '13px', background: 'var(--danger-bg)', padding: '8px 12px', borderRadius: '4px' }}>
                {reportError}
              </p>
            )}

            {reportSuccess && (
              <p style={{ color: 'var(--success)', fontSize: '13px', background: 'var(--success-bg)', padding: '8px 12px', borderRadius: '4px' }}>
                {reportSuccess}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsReportModalOpen(false)}
                disabled={reportSubmitting}
              >
                Cancel
              </button>
              <button
                id="btn-submit-report-sale"
                type="submit"
                className="btn btn-primary"
                disabled={reportSubmitting}
              >
                {reportSubmitting ? 'Submitting…' : 'Submit for Verification'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
