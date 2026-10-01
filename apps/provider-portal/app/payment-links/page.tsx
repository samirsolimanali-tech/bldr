'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProviderSidebar from '../../components/Sidebar';
import {
  getPaymentLinks,
  savePaymentLink,
  togglePaymentLinkStatus,
  getVentures,
  ventureChipColors,
  PaymentLink,
} from '../../lib/payment-links-store';

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString('en-EG');
const cvr = (l: PaymentLink) => l.clicks > 0 ? ((l.conversions / l.clicks) * 100).toFixed(1) + '%' : '—';

/* ─── Page ────────────────────────────────────────────────────── */
export default function ProviderPaymentLinksPage() {
  const [links, setLinks]     = useState<PaymentLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [toastMsg, setToastMsg]   = useState('');

  // form
  const [formTitle, setFormTitle]   = useState('');
  const [formAmount, setFormAmount] = useState('1500');
  const [formExpiry, setFormExpiry] = useState('2026-12-31');
  const [formMaxUses, setFormMaxUses] = useState('100');

  // The provider portal is scoped to a single venture — read venture ID from localStorage
  const [ventureId, setVentureId] = useState('studyhub');

  const reload = useCallback(() => {
    // Show only this provider's links
    const vid = (() => { try { return localStorage.getItem('bldr_venture_id') || 'studyhub'; } catch { return 'studyhub'; } })();
    setVentureId(vid);
    setLinks(getPaymentLinks().filter(l => l.ventureId === vid));
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener('bldr:payment-links-updated', reload);
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener('bldr:payment-links-updated', reload);
      window.removeEventListener('storage', reload);
    };
  }, [reload]);

  const toast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;
    const ventures = getVentures();
    const venture  = ventures.find(v => v.id === ventureId) ?? ventures[0];
    const chips    = ventureChipColors(ventureId);
    const slug     = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);

    const link: PaymentLink = {
      id: `lnk-prov-${Date.now()}`,
      ventureId,
      ventureName: venture?.name ?? ventureId,
      ventureCode: venture?.code ?? ventureId.substring(0, 2).toUpperCase(),
      ventureColor: venture?.color ?? '#2E6F5E',
      ...chips,
      desc: formTitle,
      orderRef: `${venture?.code ?? 'XX'}-${Date.now().toString().slice(-4)}`,
      amount: parseFloat(formAmount) || 1000,
      slug: `https://pay.bldr.dev/${ventureId}/${slug}`,
      mode: 'Fixed',
      maxUses: parseInt(formMaxUses) || null,
      usedCount: 0,
      expiry: formExpiry,
      status: 'ACTIVE',
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'provider',
    };

    savePaymentLink(link);
    reload();
    setShowDrawer(false);
    setFormTitle(''); setFormAmount('1500'); setFormMaxUses('100');
    toast('Payment link created — visible in Central Hub monitoring');
  };

  /* KPIs */
  const activeCount = links.filter(l => l.status === 'ACTIVE').length;
  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const totalConv   = links.reduce((s, l) => s + l.conversions, 0);
  const totalRev    = links.reduce((s, l) => s + l.amount * l.conversions, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas, #F8F7F3)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: '#fff', borderBottom: '1px solid var(--border, #E4E1DA)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display,serif)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary,#14171C)', margin: 0 }}>Payment Links</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted,#8A9099)', margin: 0 }}>Direct checkout links — synced with Central Hub in real time</p>
          </div>
          <button onClick={() => setShowDrawer(true)} style={{ background: 'var(--brand,#263C8B)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Create Payment Link
          </button>
        </header>

        <main style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {[
              { label: 'Active Links',    val: activeCount },
              { label: 'Total Clicks',    val: fmt(totalClicks) },
              { label: 'Conversions',     val: fmt(totalConv) },
              { label: 'Revenue via Links', val: `EGP ${(totalRev / 1000).toFixed(1)}K` },
            ].map(k => (
              <div key={k.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border,#E4E1DA)', padding: '18px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.025)' }}>
                <div style={{ fontFamily: 'var(--font-display,serif)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary,#14171C)' }}>{k.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted,#8A9099)', marginTop: 3 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Links Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {links.length === 0 ? (
              <div style={{ gridColumn: '1/-1', padding: 48, background: '#fff', borderRadius: 12, border: '1px solid var(--border,#E4E1DA)', textAlign: 'center', color: '#8A9099' }}>
                No payment links yet. Click <strong>+ Create Payment Link</strong> to generate your first direct checkout URL.
              </div>
            ) : links.map(l => {
              const isCopied = copiedId === l.id;
              const statusBg = l.status === 'ACTIVE' ? '#ECFDF5' : '#F3F4F6';
              const statusFg = l.status === 'ACTIVE' ? '#065F46' : '#4B5563';
              return (
                <div key={l.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border,#E4E1DA)', padding: 22, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                  {/* top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: statusBg, color: statusFg }}>
                      {l.status === 'ACTIVE' ? 'Active' : 'Paused'}
                    </span>
                    <div style={{ fontFamily: 'var(--font-display,serif)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary,#14171C)' }}>
                      EGP {l.amount.toLocaleString()}
                    </div>
                  </div>

                  {/* title */}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary,#14171C)', lineHeight: 1.35 }}>{l.desc}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted,#8A9099)', marginTop: 2 }}>Ref: {l.orderRef}</div>
                  </div>

                  {/* URL bar */}
                  <div style={{ background: 'var(--bg-canvas,#FAF9F5)', borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border,#E4E1DA)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted,#8A9099)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>
                      {l.slug}
                    </span>
                    <button onClick={() => handleCopy(l.id, l.slug)} style={{
                      background: isCopied ? '#059669' : 'var(--brand,#263C8B)', color: '#fff',
                      border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                    }}>
                      {isCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: 'var(--bg-canvas,#FAF9F5)', padding: '10px 12px', borderRadius: 8, textAlign: 'center' }}>
                    {[['Clicks', fmt(l.clicks)], ['Paid', fmt(l.conversions)], ['CVR', cvr(l)]].map(([lb, val]) => (
                      <div key={lb}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted,#8A9099)' }}>{lb}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary,#14171C)' }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border,#E4E1DA)', paddingTop: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted,#8A9099)' }}>
                      {new Date(l.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button onClick={() => handleToggle(l.id)} style={{
                      background: 'none', border: 'none', color: l.status === 'ACTIVE' ? '#DC2626' : 'var(--brand,#263C8B)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>
                      {l.status === 'ACTIVE' ? 'Pause Link' : 'Activate Link'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ── Drawer ── */}
      {showDrawer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Create Payment Link</h2>
                <p style={{ fontSize: 12, color: '#8A9099', margin: '4px 0 0' }}>Visible to Central Hub monitoring immediately after creation</p>
              </div>
              <button onClick={() => setShowDrawer(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8A9099' }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#5B6169' }}>Offering / Program Title</label>
                <input required placeholder="e.g. Next.js Masterclass" value={formTitle} onChange={e => setFormTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8C4BC', borderRadius: 8, fontSize: 14 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#5B6169' }}>Amount (EGP)</label>
                  <input required type="number" min={1} value={formAmount} onChange={e => setFormAmount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8C4BC', borderRadius: 8, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#5B6169' }}>Max Uses <span style={{ color: '#B0B8C1', fontWeight: 400 }}>(0 = unlimited)</span></label>
                  <input type="number" min={0} value={formMaxUses} onChange={e => setFormMaxUses(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8C4BC', borderRadius: 8, fontSize: 14 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#5B6169' }}>Expiry Date</label>
                <input type="date" value={formExpiry} onChange={e => setFormExpiry(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8C4BC', borderRadius: 8, fontSize: 14 }} />
              </div>
              {/* URL Preview */}
              <div style={{ background: '#FAF9F5', borderRadius: 8, padding: 12, border: '1px dashed #C8C4BC' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', marginBottom: 4 }}>Checkout URL</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#263C8B', fontWeight: 600, wordBreak: 'break-all' }}>
                  https://pay.bldr.dev/{ventureId}/{formTitle ? formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20) : 'checkout'}
                </div>
                <div style={{ fontSize: 11, color: '#8A9099', marginTop: 4 }}>Accepts Cards, Mobile Wallets & Fawry</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowDrawer(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #E4E1DA', background: '#fff', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--brand,#263C8B)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Generate Link</button>
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
