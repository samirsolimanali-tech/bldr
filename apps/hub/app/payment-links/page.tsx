'use client';

import React, { useState, useEffect, useCallback } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { matchVenture } from '../../components/HubTopBar';
import {
  getPaymentLinks,
  savePaymentLink,
  togglePaymentLinkStatus,
  deletePaymentLink,
  getVentures,
  ventureChipColors,
  PaymentLink,
  VentureRecord,
} from '../../lib/payment-links-store';

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString('en-EG');
const fmtEGP = (n: number) =>
  `EGP ${n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : n >= 1_000 ? (n / 1_000).toFixed(1) + 'K' : n.toFixed(0)}`;
const cvr = (link: PaymentLink) =>
  link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) + '%' : '—';

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  ACTIVE:  { bg: '#ECFDF5', fg: '#065F46' },
  PAUSED:  { bg: '#F3F4F6', fg: '#4B5563' },
  EXPIRED: { bg: '#FEF2F2', fg: '#991B1B' },
  PAID:    { bg: '#EFF6FF', fg: '#1D4ED8' },
};

/* ─── Sub-components ──────────────────────────────────────────── */
function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E4E1DA', padding: '18px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.025)' }}>
      <div style={{ fontFamily: 'var(--font-display,serif)', fontSize: 26, fontWeight: 700, color: '#14171C', lineHeight: 1.15 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#8A9099', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#B0B8C1', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: '#F1F5F9', fg: '#64748B' };
  return (
    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: c.bg, color: c.fg, whiteSpace: 'nowrap' }}>
      {status === 'ACTIVE' ? 'Active' : status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function HubPaymentLinksPage() {
  const [links, setLinks]       = useState<PaymentLink[]>([]);
  const [ventures, setVentures] = useState<VentureRecord[]>([]);
  const [env, setEnv]           = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // Drawer form
  const [formVentureId, setFormVentureId] = useState('studyhub');
  const [formDesc, setFormDesc]   = useState('');
  const [formAmount, setFormAmount] = useState('1500');
  const [formOrderRef, setFormOrderRef] = useState('');
  const [formExpiry, setFormExpiry]   = useState('2026-12-31');
  const [formMaxUses, setFormMaxUses] = useState('100');

  const reload = useCallback(() => {
    setLinks(getPaymentLinks());
    setVentures(getVentures());
  }, []);

  useEffect(() => {
    reload();

    // Sync with provider portal changes (same-tab or cross-tab)
    window.addEventListener('bldr:payment-links-updated', reload);
    window.addEventListener('bldr:ventures-updated', reload);
    window.addEventListener('storage', reload);

    // Venture selector sync
    try {
      const sv = localStorage.getItem('bldr_active_venture');
      if (sv) setSelectedVenture(sv);
    } catch {}
    const onVentureChanged = (e: any) => { if (e?.detail) setSelectedVenture(e.detail); };
    window.addEventListener('bldr:venture-changed', onVentureChanged);

    return () => {
      window.removeEventListener('bldr:payment-links-updated', reload);
      window.removeEventListener('bldr:ventures-updated', reload);
      window.removeEventListener('storage', reload);
      window.removeEventListener('bldr:venture-changed', onVentureChanged);
    };
  }, [reload]);

  /* toast helper */
  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = (id: string) => {
    togglePaymentLinkStatus(id);
    reload();
    toast('Link status updated');
  };

  const handleDelete = (id: string) => {
    deletePaymentLink(id);
    reload();
    toast('Payment link removed');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc) return;
    const venture = ventures.find(v => v.id === formVentureId) ?? ventures[0];
    const chips = ventureChipColors(formVentureId);
    const slug = formDesc.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
    const link: PaymentLink = {
      id: `lnk-${Date.now()}`,
      ventureId: formVentureId,
      ventureName: venture?.name ?? formVentureId,
      ventureCode: venture?.code ?? formVentureId.substring(0, 2).toUpperCase(),
      ventureColor: venture?.color ?? '#263C8B',
      ...chips,
      desc: formDesc,
      orderRef: formOrderRef || `${venture?.code ?? 'XX'}-${Date.now().toString().slice(-4)}`,
      amount: parseFloat(formAmount) || 1000,
      slug: `https://pay.bldr.dev/${formVentureId}/${slug}`,
      mode: 'Fixed',
      maxUses: parseInt(formMaxUses) || null,
      usedCount: 0,
      expiry: formExpiry,
      status: 'ACTIVE',
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'hub',
    };
    savePaymentLink(link);
    reload();
    setDrawerOpen(false);
    setFormDesc(''); setFormAmount('1500'); setFormOrderRef('');
    toast('Payment link created and synced to provider portal');
  };

  /* filtered list */
  const filtered = links.filter(l => {
    const mSearch = search === '' ||
      l.desc.toLowerCase().includes(search.toLowerCase()) ||
      l.orderRef.toLowerCase().includes(search.toLowerCase()) ||
      l.slug.toLowerCase().includes(search.toLowerCase());
    const mVenture = matchVenture(l.ventureName, selectedVenture);
    const mStatus = statusFilter === 'All' || l.status === statusFilter;
    return mSearch && mVenture && mStatus;
  });

  /* KPIs */
  const totalClicks      = filtered.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = filtered.reduce((s, l) => s + l.conversions, 0);
  const totalRevenue     = filtered.reduce((s, l) => s + l.amount * l.conversions, 0);
  const activeCount      = filtered.filter(l => l.status === 'ACTIVE').length;
  const avgCvr           = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) + '%' : '—';

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#FAF9F5', overflow: 'hidden' }}>
      <HubSidebar active="/payment-links" />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Payment Links & Direct Checkout"
          crumb="Payment Links"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Header Row ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display,serif)', fontSize: 20, fontWeight: 700, color: '#14171C', margin: 0 }}>
                Payment Links
              </h1>
              <p style={{ fontSize: 13, color: '#5B6169', margin: '3px 0 0' }}>
                Central monitoring hub — links created by brand portals sync here in real time.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* View toggle */}
              <div style={{ display: 'flex', background: '#fff', border: '1px solid #E4E1DA', borderRadius: 8, padding: 3 }}>
                {(['cards', 'table'] as const).map(m => (
                  <button key={m} onClick={() => setViewMode(m)} style={{
                    padding: '5px 14px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: viewMode === m ? '#263C8B' : 'transparent',
                    color: viewMode === m ? '#fff' : '#5B6169',
                  }}>
                    {m === 'cards' ? 'Cards' : 'Audit Table'}
                  </button>
                ))}
              </div>
              {/* Create */}
              <button onClick={() => setDrawerOpen(true)} style={{
                display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px',
                borderRadius: 8, background: '#263C8B', color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 3px rgba(38,60,139,0.25)',
              }}>
                + Create Link
              </button>
            </div>
          </div>

          {/* ── KPI Strip ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            <KpiCard label="Active Links" value={activeCount} />
            <KpiCard label="Total Clicks" value={fmt(totalClicks)} />
            <KpiCard label="Conversions" value={fmt(totalConversions)} />
            <KpiCard label="Platform Revenue" value={fmtEGP(totalRevenue)} />
            <KpiCard label="Avg. Conversion Rate" value={avgCvr} />
          </div>

          {/* ── Filter Bar ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220, maxWidth: 340, background: '#fff', border: '1px solid #E4E1DA', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 10px', height: 34 }}>
              <span style={{ color: '#B0B8C1', marginRight: 6, fontSize: 13 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search links, titles, refs…"
                style={{ border: 'none', outline: 'none', fontSize: 13, width: '100%', background: 'transparent' }}
              />
            </div>
            {['All', 'ACTIVE', 'PAUSED', 'EXPIRED'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: statusFilter === s ? 700 : 500,
                border: '1px solid', cursor: 'pointer',
                borderColor: statusFilter === s ? '#263C8B' : '#E4E1DA',
                background: statusFilter === s ? '#263C8B' : '#fff',
                color: statusFilter === s ? '#fff' : '#5B6169',
              }}>
                {s === 'All' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
            {selectedVenture !== 'All' && (
              <span style={{ fontSize: 12, color: '#263C8B', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                Venture: {selectedVenture}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#8A9099' }}>
              {filtered.length} link{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── Cards View ── */}
          {viewMode === 'cards' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1/-1', padding: '48px 24px', background: '#fff', borderRadius: 12, textAlign: 'center', color: '#8A9099', border: '1px solid #E4E1DA' }}>
                  No payment links match your filters. Click <strong>+ Create Link</strong> to add one.
                </div>
              ) : filtered.map(l => (
                <div key={l.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E4E1DA', padding: 22, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                  {/* top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StatusPill status={l.status} />
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: l.chipBg, color: l.chipFg }}>
                        {l.ventureName}
                      </span>
                      {l.createdBy === 'provider' && (
                        <span title="Created by brand portal" style={{ fontSize: 10, color: '#8A9099', border: '1px solid #E4E1DA', borderRadius: 4, padding: '1px 5px' }}>via provider</span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display,serif)', fontSize: 18, fontWeight: 700, color: '#14171C' }}>
                      EGP {l.amount.toLocaleString()}
                    </div>
                  </div>

                  {/* title */}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#14171C', lineHeight: 1.35 }}>{l.desc}</div>
                    <div style={{ fontSize: 11, color: '#8A9099', marginTop: 2 }}>Ref: {l.orderRef}</div>
                  </div>

                  {/* url bar */}
                  <div style={{ background: '#FAF9F5', border: '1px solid #E4E1DA', borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#5B6169', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {l.slug}
                    </span>
                    <button onClick={() => handleCopy(l.id, l.slug)} style={{
                      background: copiedId === l.id ? '#10B981' : '#1E3A8A', color: '#fff',
                      border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                    }}>
                      {copiedId === l.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: '#FAF9F5', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    {[['Clicks', fmt(l.clicks), '#14171C'], ['Paid', fmt(l.conversions), '#059669'], ['CVR', cvr(l), '#263C8B']].map(([lbl, val, clr]) => (
                      <div key={lbl}>
                        <div style={{ fontSize: 10, color: '#8A9099', marginBottom: 2 }}>{lbl}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: clr as string }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0EFEA', paddingTop: 10 }}>
                    <span style={{ fontSize: 11, color: '#8A9099' }}>
                      {new Date(l.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button onClick={() => handleToggle(l.id)} style={{
                        background: 'none', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        color: l.status === 'ACTIVE' ? '#B3402F' : '#1F7A4D', padding: 0,
                      }}>
                        {l.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                      </button>
                      <button onClick={() => { if (confirm('Remove this link?')) handleDelete(l.id); }} style={{
                        background: 'none', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#8A9099', padding: 0,
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Table View ── */}
          {viewMode === 'table' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E4E1DA', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#FAF9F5', borderBottom: '1px solid #E4E1DA' }}>
                    {['Product', 'Venture', 'Amount', 'URL', 'Clicks', 'Paid', 'CVR', 'Status', 'Source', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A9099', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: '36px', textAlign: 'center', color: '#8A9099' }}>No links found.</td>
                    </tr>
                  ) : filtered.map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F0EFEA' : 'none' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#14171C', maxWidth: 200 }}>{l.desc}</div>
                        <div style={{ fontSize: 11, color: '#8A9099' }}>{l.orderRef}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: l.chipBg, color: l.chipFg }}>{l.ventureName}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>EGP {l.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#5B6169', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {l.slug.replace('https://', '')}
                          </span>
                          <button onClick={() => handleCopy(l.id, l.slug)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#263C8B', fontWeight: 600, flexShrink: 0 }}>
                            {copiedId === l.id ? '✓' : 'Copy'}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>{fmt(l.clicks)}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#059669' }}>{fmt(l.conversions)}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#263C8B' }}>{cvr(l)}</td>
                      <td style={{ padding: '12px 14px' }}><StatusPill status={l.status} /></td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: 11, color: '#8A9099', background: '#F9FAFB', border: '1px solid #E4E1DA', borderRadius: 4, padding: '2px 6px' }}>
                          {l.createdBy === 'hub' ? 'Hub' : 'Provider'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => handleToggle(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: l.status === 'ACTIVE' ? '#B3402F' : '#1F7A4D' }}>
                            {l.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                          </button>
                          <button onClick={() => { if (confirm('Delete this link?')) handleDelete(l.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#8A9099' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Drawer ── */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(3px)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 460, maxWidth: '90vw', height: '100%', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', padding: 30, overflowY: 'auto', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display,serif)', fontSize: 18, fontWeight: 700, color: '#14171C', margin: 0 }}>Create Payment Link</h2>
                <p style={{ fontSize: 12, color: '#8A9099', margin: '4px 0 0' }}>Synced instantly to the brand's provider portal</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8A9099', marginTop: -2 }}>✕</button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* venture */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Brand / Venture</label>
                <select value={formVentureId} onChange={e => setFormVentureId(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }}>
                  {ventures.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              {/* title */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Product / Course Title</label>
                <input required type="text" placeholder="e.g. Advanced React Masterclass" value={formDesc} onChange={e => setFormDesc(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }} />
              </div>

              {/* amount + ref */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Amount (EGP)</label>
                  <input required type="number" min={1} value={formAmount} onChange={e => setFormAmount(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Order Ref <span style={{ color: '#B0B8C1', fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" placeholder="Auto-generated" value={formOrderRef} onChange={e => setFormOrderRef(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }} />
                </div>
              </div>

              {/* expiry + max uses */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Expiry Date</label>
                  <input type="date" value={formExpiry} onChange={e => setFormExpiry(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Max Uses <span style={{ color: '#B0B8C1', fontWeight: 400 }}>(0 = unlimited)</span></label>
                  <input type="number" min={0} value={formMaxUses} onChange={e => setFormMaxUses(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }} />
                </div>
              </div>

              {/* URL preview */}
              <div style={{ padding: 12, background: '#FAF9F5', borderRadius: 8, border: '1px dashed #C8C4BC' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', marginBottom: 4 }}>Checkout URL Preview</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#263C8B', fontWeight: 600, wordBreak: 'break-all' }}>
                  https://pay.bldr.dev/{formVentureId}/{formDesc ? formDesc.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20) : 'checkout'}
                </div>
                <div style={{ fontSize: 11, color: '#8A9099', marginTop: 4 }}>Accepts Cards, Mobile Wallets & Fawry</div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setDrawerOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #E4E1DA', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#5B6169' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#263C8B', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Generate & Sync</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#1A2B4A', color: '#fff', padding: '10px 22px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 200,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#34D399' }}>✓</span> {toastMsg}
        </div>
      )}
    </div>
  );
}
