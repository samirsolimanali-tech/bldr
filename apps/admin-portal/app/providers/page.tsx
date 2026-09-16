'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() { return localStorage.getItem('bldr_admin_token'); }

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchProviders = async () => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const qs = new URLSearchParams({ ...(statusFilter ? { status: statusFilter } : {}) });
    const res = await fetch(`${API}/admin/providers?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProviders(data.data || []);
    setMeta(data.meta || { total: 0 });
    setLoading(false);
  };

  useEffect(() => { fetchProviders(); }, [statusFilter]);

  const action = async (id: string, endpoint: string, body?: object) => {
    setActionLoading(id + endpoint);
    const token = getToken();
    await fetch(`${API}/admin/providers/${id}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    setActionLoading(null);
    setRejectModal(null);
    setRejectReason('');
    fetchProviders();
  };

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Provider Management</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map(s => (
              <button key={s}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(s)}>
                {s || 'All'} {s === 'PENDING' && <span className="badge badge-amber" style={{ marginLeft: '4px', fontSize: '10px' }}>!</span>}
              </button>
            ))}
          </div>
        </header>
        <div className="page-content fade-up">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Provider</th><th>Slug</th><th>Listings</th><th>Orders</th>
                  <th>House Brand</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
                ) : providers.length === 0 ? (
                  <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">🏢</div><p>No providers found</p></div></td></tr>
                ) : providers.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)' }}>{p.slug}</td>
                    <td>{p._count?.listings ?? 0}</td>
                    <td>{p._count?.orders ?? 0}</td>
                    <td>{p.isHouseBrand ? <span className="badge badge-accent">✦ Yes</span> : '—'}</td>
                    <td>
                      <span className={`badge ${
                        p.status === 'APPROVED' ? 'badge-green' :
                        p.status === 'PENDING' ? 'badge-amber' :
                        p.status === 'REJECTED' ? 'badge-red' : 'badge-muted'
                      }`}>{p.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {p.status === 'PENDING' && !p.isHouseBrand && (
                          <>
                            <button className="btn btn-sm badge-green"
                              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--green)', borderRadius: '6px' }}
                              disabled={!!actionLoading}
                              onClick={() => action(p.id, 'approve')}>
                              {actionLoading === p.id + 'approve' ? '…' : '✅ Approve'}
                            </button>
                            <button className="btn btn-sm"
                              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', borderRadius: '6px' }}
                              onClick={() => setRejectModal({ id: p.id, name: p.name })}>
                              ❌ Reject
                            </button>
                          </>
                        )}
                        {p.status === 'APPROVED' && !p.isHouseBrand && (
                          <button className="btn btn-sm btn-danger"
                            disabled={!!actionLoading}
                            onClick={() => action(p.id, 'suspend')}>
                            {actionLoading === p.id + 'suspend' ? '…' : '⏸ Suspend'}
                          </button>
                        )}
                        {(p.status === 'REJECTED' || p.status === 'SUSPENDED') && !p.isHouseBrand && (
                          <button className="btn btn-sm btn-secondary"
                            disabled={!!actionLoading}
                            onClick={() => action(p.id, 'approve')}>
                            ↩ Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Reject "{rejectModal.name}"</h2>
              <button className="modal-close" onClick={() => setRejectModal(null)}>✕</button>
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Reason (optional)</label>
              <textarea className="form-input" rows={3} placeholder="Explain why this application is being rejected…"
                value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-danger btn-lg" style={{ flex: 1 }}
                onClick={() => action(rejectModal.id, 'reject', { reason: rejectReason })}>
                Confirm Rejection
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setRejectModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
