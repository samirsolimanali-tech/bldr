'use client';

import React, { useState } from 'react';
import ProviderSidebar from '../../components/Sidebar';

interface PaymentLink {
  id: string;
  label: string;
  amount: number;
  currency: string;
  url: string;
  clicks: number;
  conversions: number;
  grossRev: number;
  status: 'Active' | 'Paused';
  createdAt: string;
}

const INITIAL_LINKS: PaymentLink[] = [
  { id: 'lnk-01', label: 'Full-Stack Engineering Sept Cohort', amount: 4800, currency: 'EGP', url: 'https://pay.bldr.dev/studyhub/fs-sept26', clicks: 1420, conversions: 65, grossRev: 312000, status: 'Active', createdAt: '2026-09-01' },
  { id: 'lnk-02', label: 'Digital Marketing Mastery Fast Track', amount: 1200, currency: 'EGP', url: 'https://pay.bldr.dev/studyhub/marketing-fast', clicks: 890, conversions: 48, grossRev: 57600, status: 'Active', createdAt: '2026-09-10' },
  { id: 'lnk-03', label: 'Brand Strategy & Positioning Guide', amount: 299, currency: 'EGP', url: 'https://pay.bldr.dev/studyhub/brand-book', clicks: 2340, conversions: 180, grossRev: 53820, status: 'Active', createdAt: '2026-08-15' },
  { id: 'lnk-04', label: '1-on-1 Executive Mentorship Pass', amount: 3500, currency: 'EGP', url: 'https://pay.bldr.dev/studyhub/mentor-pass', clicks: 210, conversions: 8, grossRev: 28000, status: 'Paused', createdAt: '2026-09-18' },
];

export default function ProviderPaymentLinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>(INITIAL_LINKS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('1500');

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, status: l.status === 'Active' ? 'Paused' : 'Active' } : l));
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newL: PaymentLink = {
      id: `lnk-${Date.now().toString().slice(-4)}`,
      label: newTitle,
      amount: parseFloat(newAmount) || 1000,
      currency: 'EGP',
      url: `https://pay.bldr.dev/studyhub/${slug}`,
      clicks: 0,
      conversions: 0,
      grossRev: 0,
      status: 'Active',
      createdAt: 'Just now',
    };
    setLinks([newL, ...links]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewAmount('1500');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Payment Links</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Generate direct checkout links to share with students and clients</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            + Create Payment Link
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Active Payment Links', val: links.filter(l => l.status === 'Active').length },
              { label: 'Total Link Clicks', val: links.reduce((s, l) => s + l.clicks, 0).toLocaleString() },
              { label: 'Conversions', val: links.reduce((s, l) => s + l.conversions, 0).toLocaleString() },
              { label: 'Revenue via Links', val: `EGP ${(links.reduce((s, l) => s + l.grossRev, 0) / 1000).toFixed(1)}K` },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{kpi.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {links.map((lnk) => {
              const cvr = lnk.clicks > 0 ? ((lnk.conversions / lnk.clicks) * 100).toFixed(1) : '0.0';
              const isCopied = copiedId === lnk.id;

              return (
                <div key={lnk.id} style={{ background: 'white', borderRadius: 14, border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{
                        padding: '3px 9px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                        background: lnk.status === 'Active' ? '#ECFDF5' : '#F1F5F9',
                        color: lnk.status === 'Active' ? '#065F46' : '#64748B',
                      }}>
                        {lnk.status}
                      </span>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {lnk.currency} {lnk.amount.toLocaleString()}
                      </div>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                      {lnk.label}
                    </h3>

                    {/* URL bar */}
                    <div style={{ background: 'var(--bg-canvas)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                        {lnk.url}
                      </span>
                      <button
                        onClick={() => handleCopy(lnk.id, lnk.url)}
                        style={{
                          background: isCopied ? '#059669' : 'var(--brand)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isCopied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>

                    {/* Performance metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, background: 'var(--bg-canvas)', padding: '10px 12px', borderRadius: 8, textAlign: 'center', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clicks</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{lnk.clicks}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Paid</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>{lnk.conversions}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CVR</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>{cvr}%</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Created {lnk.createdAt}</span>
                    <button
                      onClick={() => handleToggle(lnk.id)}
                      style={{ background: 'none', border: 'none', color: lnk.status === 'Active' ? '#DC2626' : 'var(--brand)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {lnk.status === 'Active' ? 'Pause Link' : 'Activate Link'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 500, width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Create Payment Link</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Offering / Program Title</label>
                <input
                  required
                  placeholder="e.g. Next.js Masterclass"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Amount (EGP)</label>
                  <input
                    required
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Currency</label>
                  <input
                    disabled
                    value="EGP (Egyptian Pound)"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14, background: '#F1F5F9' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Active Payment Methods</label>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                  Automatically accepts Fawry Reference Code, Mobile Wallets, and Cards via bldr Egypt.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'white', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--brand)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Generate Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
