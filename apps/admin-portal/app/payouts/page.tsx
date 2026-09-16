'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const getToken = () => localStorage.getItem('bldr_admin_token');

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<any | null>(null);
  const [note, setNote] = useState('');

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

  const markPaid = async (id: string, n: string) => {
    setMarkingId(id);
    const token = getToken();
    await fetch(`${API}/payouts/${id}/mark-paid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ note: n }),
    });
    setMarkingId(null);
    setNoteModal(null);
    setNote('');
    fetchPayouts();
  };

  const totalPending = payouts.filter(p => p.status === 'PENDING').reduce((s, p) => s + Number(p.netAmount), 0);

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Payout Management</h1>
          <span style={{ fontSize: '13px', color: 'var(--amber)', fontWeight: 600 }}>
            Pending: ${totalPending.toFixed(2)}
          </span>
        </header>
        <div className="page-content fade-up">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Provider</th><th>Period</th><th>Gross</th><th>Commission</th><th>Net</th><th>Status</th><th>Paid At</th><th>Note</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
                ) : payouts.length === 0 ? (
                  <tr><td colSpan={9}><div className="empty-state"><div className="empty-state-icon">💰</div><p>No payouts yet</p></div></td></tr>
                ) : payouts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.provider?.name || '—'}</td>
                    <td style={{ fontSize: '12px' }}>{new Date(p.periodStart).toLocaleDateString()} – {new Date(p.periodEnd).toLocaleDateString()}</td>
                    <td>${Number(p.grossAmount).toFixed(2)}</td>
                    <td style={{ color: 'var(--red)' }}>-${Number(p.commissionAmount).toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--green)' }}>${Number(p.netAmount).toFixed(2)}</td>
                    <td><span className={`badge ${p.status === 'PAID' ? 'badge-green' : 'badge-amber'}`}>{p.status}</span></td>
                    <td>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.note || '—'}</td>
                    <td>
                      {p.status === 'PENDING' && (
                        <button className="btn btn-sm"
                          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--green)', borderRadius: '6px' }}
                          disabled={markingId === p.id}
                          onClick={() => setNoteModal(p)}>
                          {markingId === p.id ? '…' : '✅ Mark Paid'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mark paid modal */}
      {noteModal && (
        <div className="modal-overlay" onClick={() => setNoteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Mark Payout Paid</h2>
              <button className="modal-close" onClick={() => setNoteModal(null)}>✕</button>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Marking <strong>{noteModal.provider?.name}</strong> net <strong>${Number(noteModal.netAmount).toFixed(2)}</strong> as paid. This is irreversible.
            </p>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Note (optional — e.g. bank ref)</label>
              <input className="form-input" placeholder="Bank transfer ref #123…"
                value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1, background: 'var(--green)' }}
                disabled={markingId === noteModal.id}
                onClick={() => markPaid(noteModal.id, note)}>
                {markingId === noteModal.id ? 'Saving…' : '✅ Confirm Payment'}
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setNoteModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
