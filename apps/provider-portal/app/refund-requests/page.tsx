'use client';

import React, { useState, useEffect } from 'react';
import ProviderSidebar from '../../components/Sidebar';

interface RefundRequest {
  id: string;
  txnId: string;
  studentName: string;
  studentEmail: string;
  product: string;
  amount: number;
  reason: string;
  status: 'PENDING_HUB_REVIEW' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  hubNotes?: string;
}

const INITIAL_REQUESTS: RefundRequest[] = [
  {
    id: 'REF-REQ-0112',
    txnId: 'TXN-8815',
    studentName: 'عمر فاروق (Omar Farouk)',
    studentEmail: 'omar.farouk@yahoo.com',
    product: 'Executive MBA Registration',
    amount: 8500,
    reason: 'Student withdrew before term start date per brand policy.',
    status: 'PENDING_HUB_REVIEW',
    requestedAt: '2026-09-27 14:10',
    hubNotes: 'Awaiting Hub finance sign-off on gateway charge reversal.',
  },
  {
    id: 'REF-REQ-0098',
    txnId: 'TXN-8798',
    studentName: 'خالد إبراهيم (Khaled Ibrahim)',
    studentEmail: 'khaled.ibrahim@outlook.com',
    product: 'Full-Stack Bootcamp Sept Cohort',
    amount: 4800,
    reason: 'Duplicate payment on Fawry kiosk ref code.',
    status: 'APPROVED',
    requestedAt: '2026-09-24 16:00',
    hubNotes: 'Approved by Hub Admin. Reversal ledger entry posted.',
  },
];

export default function RefundRequestsPage() {
  const [requests, setRequests] = useState<RefundRequest[]>(INITIAL_REQUESTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    txnId: '',
    studentName: '',
    studentEmail: '',
    product: '',
    amount: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const newReq: RefundRequest = {
        id: `REF-REQ-0${Math.floor(120 + Math.random() * 80)}`,
        txnId: form.txnId,
        studentName: form.studentName,
        studentEmail: form.studentEmail,
        product: form.product,
        amount: parseFloat(form.amount) || 0,
        reason: form.reason,
        status: 'PENDING_HUB_REVIEW',
        requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        hubNotes: 'Queued for Hub finance team audit.',
      };

      setRequests([newReq, ...requests]);
      setSubmitting(false);
      setShowModal(false);
      setForm({ txnId: '', studentName: '', studentEmail: '', product: '', amount: '', reason: '' });
      setSuccessToast(`Refund request ${newReq.id} submitted to Central Hub.`);
      setTimeout(() => setSuccessToast(''), 4000);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Refund Requests
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#0F172A',
              color: '#FFF',
              border: 'none',
              borderRadius: 6,
              padding: '8px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Request Refund
          </button>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {/* Governance Notice */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '14px 18px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.5 }}>
              <strong>Merchant of Record Protocol:</strong> As the sole merchant of record, bldr holds financial responsibility for gateway chargebacks and reversals. Brand operators can raise refund requests with justification; the Central Hub finance desk audits and executes the reversal against the brand's settlement ledger.
            </div>
          </div>

          {successToast && (
            <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '12px 16px', borderRadius: 6, fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
              ✓ {successToast}
            </div>
          )}

          {/* Requests Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Submitted Refund Inquiries
              </h2>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Request ID', 'Txn ID', 'Student', 'Offering', 'Amount', 'Reason', 'Requested At', 'Hub Status'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Amount' ? 'right' : 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < requests.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700 }}>{r.id}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{r.txnId}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{r.studentName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.studentEmail}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{r.product}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                      -EGP {r.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: 220, fontSize: 12, color: 'var(--text-secondary)' }}>
                      {r.reason}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{r.requestedAt}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            r.status === 'APPROVED' ? '#DCFCE7' : r.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7',
                          color:
                            r.status === 'APPROVED' ? '#166534' : r.status === 'REJECTED' ? '#991B1B' : '#92400E',
                        }}
                      >
                        {r.status === 'PENDING_HUB_REVIEW' ? 'Pending Hub Review' : r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: 10, width: 480, padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Raise Refund Request</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94A3B8' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Transaction Reference ID</label>
                <input
                  required
                  placeholder="e.g. TXN-8821"
                  value={form.txnId}
                  onChange={(e) => setForm({ ...form, txnId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Student Name</label>
                <input
                  required
                  placeholder="e.g. Ahmed Kamal"
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Student Email</label>
                <input
                  type="email"
                  required
                  placeholder="ahmed@example.com"
                  value={form.studentEmail}
                  onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Offering / Product</label>
                  <input
                    required
                    placeholder="Course or Workshop"
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Refund Amount (EGP)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2200"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Reason for Refund</label>
                <textarea
                  required
                  rows={3}
                  placeholder="State the student's reason and compliance with brand withdrawal terms..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#0F172A', color: '#FFF', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                >
                  {submitting ? 'Submitting...' : 'Submit to Hub Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
