'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('bldr_token') : null;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchListings = async () => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    setLoading(true);
    const res = await fetch(`${API}/listings?includeMine=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setListings(data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    setDeleting(id);
    const token = getToken();
    await fetch(`${API}/listings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchListings();
    setDeleting(null);
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    const token = getToken();
    await fetch(`${API}/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isPublished: !current }),
    });
    await fetchListings();
  };

  return (
    <div className="shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1 className="topbar-title">My Listings</h1>
          <Link href="/listings/new" className="btn btn-primary btn-sm">+ New Listing</Link>
        </header>
        <div className="page-content fade-up">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading…</td></tr>
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <p style={{ marginBottom: '12px', fontSize: '15px', color: 'var(--text-secondary)' }}>
                          No listings yet
                        </p>
                        <Link href="/listings/new" className="btn btn-primary btn-sm">Create your first listing →</Link>
                      </div>
                    </td>
                  </tr>
                ) : listings.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.title}</td>
                    <td>{l.category}</td>
                    <td>${Number(l.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${l.purchaseType === 'REDIRECT' ? 'badge-blue' : 'badge-accent'}`}>
                        {l.purchaseType === 'REDIRECT' ? '↗ Redirect' : '🛒 Native'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(l.id, l.isPublished)}
                        className={`badge ${l.isPublished ? 'badge-green' : 'badge-muted'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        {l.isPublished ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/listings/${l.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="btn btn-danger btn-sm"
                          disabled={deleting === l.id}
                        >
                          {deleting === l.id ? '…' : 'Delete'}
                        </button>
                      </div>
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
