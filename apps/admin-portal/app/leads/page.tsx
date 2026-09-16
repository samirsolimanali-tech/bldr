'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const getToken = () => localStorage.getItem('bldr_admin_token');

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchLeads = async () => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const qs = new URLSearchParams({ ...(statusFilter ? { status: statusFilter } : {}) });
    const res = await fetch(`${API}/leads?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setLeads(data.data || []);
    setMeta(data.meta || { total: 0 });
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [statusFilter]);

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">All Leads</h1>
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
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{meta.total} total leads</p>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Provider</th><th>Service</th><th>Type</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">💬</div><p>No leads found</p></div></td></tr>
                ) : leads.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</td>
                    <td style={{ fontSize: '13px' }}>{l.email}</td>
                    <td>{l.provider?.name || '—'}</td>
                    <td>{l.listing?.title || '—'}</td>
                    <td><span className={`badge ${l.engagementType === 'BOOK_CALL' ? 'badge-blue' : 'badge-accent'}`}>{l.engagementType === 'BOOK_CALL' ? '📅 Call' : '💬 Quote'}</span></td>
                    <td><span className={`badge ${l.status === 'NEW' ? 'badge-amber' : l.status === 'CONTACTED' ? 'badge-blue' : 'badge-green'}`}>{l.status}</span></td>
                    <td>{new Date(l.createdAt).toLocaleDateString()}</td>
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
