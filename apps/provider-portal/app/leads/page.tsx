'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  const fetchLeads = async () => {
    const token = localStorage.getItem('bldr_token');
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const qs = new URLSearchParams({ ...(statusFilter ? { status: statusFilter } : {}) });
    const res = await fetch(`${API}/leads/mine?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setLeads(data.data || []);
    setMeta(data.meta || { total: 0 });
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('bldr_token');
    await fetch(`${API}/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setSelected(null);
    fetchLeads();
  };

  return (
    <div className="shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">Leads</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['', 'NEW', 'CONTACTED', 'CLOSED'].map(s => (
              <button key={s}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(s)}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </header>
        <div className="page-content fade-up">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Service</th><th>Type</th><th>Status</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={8}><div className="empty-state"><div className="empty-state-icon">💬</div><p>No leads yet</p></div></td></tr>
                ) : leads.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</td>
                    <td>{l.email}</td>
                    <td>{l.phone || '—'}</td>
                    <td>{l.listing?.title || '—'}</td>
                    <td>
                      <span className={`badge ${l.engagementType === 'BOOK_CALL' ? 'badge-blue' : 'badge-accent'}`}>
                        {l.engagementType === 'BOOK_CALL' ? '📅 Call' : '💬 Quote'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${l.status === 'NEW' ? 'badge-amber' : l.status === 'CONTACTED' ? 'badge-blue' : 'badge-green'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelected(l)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Lead from {selected.name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { l: 'Name', v: selected.name },
                { l: 'Email', v: selected.email },
                { l: 'Phone', v: selected.phone || '—' },
                { l: 'Service', v: selected.listing?.title },
                { l: 'Type', v: selected.engagementType },
                { l: 'Message', v: selected.message || '—' },
              ].map(row => (
                <div key={row.l} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ minWidth: '80px', color: 'var(--text-muted)', fontSize: '13px' }}>{row.l}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['NEW', 'CONTACTED', 'CLOSED'].map(s => (
                <button key={s}
                  className={`btn btn-sm ${selected.status === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateStatus(selected.id, s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
