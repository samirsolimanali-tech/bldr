'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { matchVenture } from '../../components/HubTopBar';

interface PaymentLinkItem {
  id: string;
  slug: string;
  code: string;
  venture: string;
  chipBg: string;
  chipFg: string;
  desc: string;
  order: string;
  amount: string;
  rawAmount: number;
  amtColor: string;
  mode: 'Fixed' | 'Caller-supplied';
  uses: string;
  expiry: string;
  expColor: string;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'PAID';
  stFg: string;
  stBg: string;
  clicks: number;
  conversions: number;
  cvr: string;
  createdAt: string;
}

const INITIAL_LINKS: PaymentLinkItem[] = [
  {
    id: 'l1',
    slug: 'https://pay.bldr.dev/studyhub/fs-sept26',
    code: 'SH',
    venture: 'StudyHub',
    chipBg: '#E0F2FE',
    chipFg: '#0369A1',
    desc: 'Full-Stack Engineering Sept Cohort',
    order: 'SH-FS-SEPT26',
    amount: 'EGP 4,800',
    rawAmount: 4800,
    amtColor: '#12203C',
    mode: 'Fixed',
    uses: '65 / 100',
    expiry: '20 Oct 2026',
    expColor: '#5A6A80',
    status: 'ACTIVE',
    stFg: '#065F46',
    stBg: '#ECFDF5',
    clicks: 1420,
    conversions: 65,
    cvr: '4.6%',
    createdAt: '2026-09-01',
  },
  {
    id: 'l2',
    slug: 'https://pay.bldr.dev/studyhub/marketing-fast',
    code: 'SH',
    venture: 'StudyHub',
    chipBg: '#E0F2FE',
    chipFg: '#0369A1',
    desc: 'Digital Marketing Mastery Fast Track',
    order: 'SH-MKT-0910',
    amount: 'EGP 1,200',
    rawAmount: 1200,
    amtColor: '#12203C',
    mode: 'Fixed',
    uses: '48 / 150',
    expiry: '14 Oct 2026',
    expColor: '#5A6A80',
    status: 'ACTIVE',
    stFg: '#065F46',
    stBg: '#ECFDF5',
    clicks: 890,
    conversions: 48,
    cvr: '5.4%',
    createdAt: '2026-09-10',
  },
  {
    id: 'l3',
    slug: 'https://pay.bldr.dev/bldr/brand-book',
    code: 'BLDR',
    venture: 'bldr (Storefront Pilot)',
    chipBg: '#EFF6FF',
    chipFg: '#1E3A8A',
    desc: 'Brand Strategy & Positioning Guide',
    order: 'BLDR-BOOK-0815',
    amount: 'EGP 299',
    rawAmount: 299,
    amtColor: '#12203C',
    mode: 'Fixed',
    uses: '180 / ∞',
    expiry: '31 Dec 2026',
    expColor: '#5A6A80',
    status: 'ACTIVE',
    stFg: '#065F46',
    stBg: '#ECFDF5',
    clicks: 2340,
    conversions: 180,
    cvr: '7.7%',
    createdAt: '2026-08-15',
  },
  {
    id: 'l4',
    slug: 'https://pay.bldr.dev/bldr/mentor-pass',
    code: 'BLDR',
    venture: 'bldr (Storefront Pilot)',
    chipBg: '#EFF6FF',
    chipFg: '#1E3A8A',
    desc: '1-on-1 Executive Mentorship Pass',
    order: 'BLDR-MENTOR-0918',
    amount: 'EGP 3,500',
    rawAmount: 3500,
    amtColor: '#12203C',
    mode: 'Fixed',
    uses: '8 / 10',
    expiry: '30 Sep 2026',
    expColor: '#5A6A80',
    status: 'PAUSED',
    stFg: '#4B5563',
    stBg: '#F3F4F6',
    clicks: 210,
    conversions: 8,
    cvr: '3.8%',
    createdAt: '2026-09-18',
  },
  {
    id: 'l5',
    slug: 'https://pay.bldr.dev/el-hesa/mba-2026',
    code: 'EH',
    venture: 'EL HESA',
    chipBg: '#ECFDF5',
    chipFg: '#047857',
    desc: 'Executive MBA Registration',
    order: 'EH-MBA-0905',
    amount: 'EGP 8,500',
    rawAmount: 8500,
    amtColor: '#12203C',
    mode: 'Fixed',
    uses: '42 / 50',
    expiry: '15 Nov 2026',
    expColor: '#5A6A80',
    status: 'ACTIVE',
    stFg: '#065F46',
    stBg: '#ECFDF5',
    clicks: 640,
    conversions: 42,
    cvr: '6.5%',
    createdAt: '2026-09-05',
  },
  {
    id: 'l6',
    slug: 'https://pay.bldr.dev/apex/cfa-fasttrack',
    code: 'AC',
    venture: 'Apex Classes',
    chipBg: '#FEF3C7',
    chipFg: '#B45309',
    desc: 'CFA Level 1 FastTrack Batch',
    order: 'AC-CFA-0914',
    amount: 'EGP 6,500',
    rawAmount: 6500,
    amtColor: '#12203C',
    mode: 'Fixed',
    uses: '28 / 40',
    expiry: '30 Oct 2026',
    expColor: '#5A6A80',
    status: 'ACTIVE',
    stFg: '#065F46',
    stBg: '#ECFDF5',
    clicks: 512,
    conversions: 28,
    cvr: '5.5%',
    createdAt: '2026-09-14',
  },
];

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<PaymentLinkItem[]>(INITIAL_LINKS);
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Drawer Form state
  const [formVenture, setFormVenture] = useState('StudyHub');
  const [formOrderRef, setFormOrderRef] = useState('');
  const [formAmount, setFormAmount] = useState('1500');
  const [formDesc, setFormDesc] = useState('');
  const [formExpiry, setFormExpiry] = useState('2026-12-31');

  useEffect(() => {
    try {
      const storedVenture = localStorage.getItem('bldr_active_venture');
      if (storedVenture) setSelectedVenture(storedVenture);
    } catch (e) {}

    const handleVentureChanged = (e: any) => {
      if (e?.detail) setSelectedVenture(e.detail);
    };
    window.addEventListener('bldr:venture-changed', handleVentureChanged);
    return () => window.removeEventListener('bldr:venture-changed', handleVentureChanged);
  }, []);

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    setLinks(prev =>
      prev.map(l => {
        if (l.id !== id) return l;
        const nextStatus = l.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return {
          ...l,
          status: nextStatus,
          stFg: nextStatus === 'ACTIVE' ? '#065F46' : '#4B5563',
          stBg: nextStatus === 'ACTIVE' ? '#ECFDF5' : '#F3F4F6',
        };
      })
    );
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc) return;

    const numAmount = parseFloat(formAmount) || 1000;
    const slugKey = formDesc.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 18);
    const ventureSlug = formVenture.toLowerCase().includes('study')
      ? 'studyhub'
      : formVenture.toLowerCase().includes('bldr')
      ? 'bldr'
      : formVenture.toLowerCase().includes('apex')
      ? 'apex'
      : formVenture.toLowerCase().includes('hesa')
      ? 'el-hesa'
      : 'venture';

    const newLink: PaymentLinkItem = {
      id: `l-${Date.now()}`,
      slug: `https://pay.bldr.dev/${ventureSlug}/${slugKey}`,
      code: formVenture.substring(0, 2).toUpperCase(),
      venture: formVenture,
      chipBg: '#E0F2FE',
      chipFg: '#0369A1',
      desc: formDesc,
      order: formOrderRef || `${formVenture.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      amount: `EGP ${numAmount.toLocaleString()}`,
      rawAmount: numAmount,
      amtColor: '#12203C',
      mode: 'Fixed',
      uses: '0 / 100',
      expiry: formExpiry,
      expColor: '#5A6A80',
      status: 'ACTIVE',
      stFg: '#065F46',
      stBg: '#ECFDF5',
      clicks: 0,
      conversions: 0,
      cvr: '0.0%',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setLinks([newLink, ...links]);
    setDrawerOpen(false);
    setFormDesc('');
    setFormAmount('1500');
    setFormOrderRef('');
  };

  const filteredLinks = links.filter(l => {
    const matchesSearch =
      l.slug.toLowerCase().includes(search.toLowerCase()) ||
      l.order.toLowerCase().includes(search.toLowerCase()) ||
      l.desc.toLowerCase().includes(search.toLowerCase());
    const matchesVenture = matchVenture(l.venture, selectedVenture);
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'ACTIVE' && l.status === 'ACTIVE') ||
      (statusFilter === 'PAUSED' && l.status === 'PAUSED');
    return matchesSearch && matchesVenture && matchesStatus;
  });

  const totalClicks = filteredLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const totalConversions = filteredLinks.reduce((sum, l) => sum + (l.conversions || 0), 0);
  const totalRevenue = filteredLinks.reduce((sum, l) => sum + (l.rawAmount * (l.conversions || 0)), 0);
  const activeCount = filteredLinks.filter(l => l.status === 'ACTIVE').length;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#FAF9F5', overflow: 'hidden', position: 'relative' }}>
      <HubSidebar active="/payment-links" />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Payment Links & Direct Checkout Setup"
          crumb="Payment Links"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 20, fontWeight: 700, color: '#14171C', margin: 0 }}>
                Payment Links
              </h1>
              <p style={{ fontSize: 13, color: '#5B6169', margin: '4px 0 0 0' }}>
                Generate direct checkout links to share with students and clients via WhatsApp, SMS, or campaigns.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* View Switcher */}
              <div style={{ display: 'flex', background: '#FFFFFF', border: '1px solid #E4E1DA', borderRadius: 8, padding: 3 }}>
                <button
                  onClick={() => setViewMode('cards')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: viewMode === 'cards' ? '#263C8B' : 'transparent',
                    color: viewMode === 'cards' ? '#FFFFFF' : '#5B6169',
                  }}
                >
                  Cards Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: viewMode === 'table' ? '#263C8B' : 'transparent',
                    color: viewMode === 'table' ? '#FFFFFF' : '#5B6169',
                  }}
                >
                  Audit Table
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 38,
                  padding: '0 16px',
                  borderRadius: 8,
                  background: '#263C8B',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(38,60,139,0.25)',
                }}
              >
                <span>+</span>
                <span>Create Payment Link</span>
              </button>
            </div>
          </div>

          {/* Summary KPIs Banner (Matches Provider Screenshot) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E4E1DA', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: 28, fontWeight: 700, color: '#14171C', marginBottom: 4 }}>
                {activeCount}
              </div>
              <div style={{ fontSize: 13, color: '#8A9099' }}>Active Payment Links</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E4E1DA', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: 28, fontWeight: 700, color: '#14171C', marginBottom: 4 }}>
                {totalClicks.toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: '#8A9099' }}>Total Link Clicks</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E4E1DA', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: 28, fontWeight: 700, color: '#14171C', marginBottom: 4 }}>
                {totalConversions.toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: '#8A9099' }}>Conversions</div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E4E1DA', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: 28, fontWeight: 700, color: '#14171C', marginBottom: 4 }}>
                EGP {(totalRevenue / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: 13, color: '#8A9099' }}>Revenue via Links</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260, maxWidth: 360, background: '#FFFFFF', border: '1px solid #E4E1DA', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', height: 36 }}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search link, course title, or slug…"
                style={{ border: 'none', outline: 'none', fontSize: 13, width: '100%', background: 'transparent' }}
              />
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'ACTIVE', 'PAUSED'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: statusFilter === s ? 700 : 500,
                    border: '1px solid',
                    borderColor: statusFilter === s ? '#263C8B' : '#E4E1DA',
                    background: statusFilter === s ? '#263C8B' : '#FFFFFF',
                    color: statusFilter === s ? '#FFFFFF' : '#5B6169',
                    cursor: 'pointer',
                  }}
                >
                  {s === 'All' ? 'All Status' : s === 'ACTIVE' ? 'Active' : 'Paused'}
                </button>
              ))}
            </div>

            {selectedVenture !== 'All' && (
              <span style={{ fontSize: 12, color: '#263C8B', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                Filtering by: {selectedVenture}
              </span>
            )}
          </div>

          {/* VIEW 1: Cards Grid (Exact Layout from User Screenshot) */}
          {viewMode === 'cards' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
              {filteredLinks.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '48px', background: '#FFFFFF', borderRadius: 12, textAlign: 'center', color: '#8A9099', border: '1px solid #E4E1DA' }}>
                  No payment links found for this brand venture. Click "+ Create Payment Link" above to generate one.
                </div>
              ) : (
                filteredLinks.map(l => (
                  <div
                    key={l.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 14,
                      border: '1px solid #E4E1DA',
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Top Row: Status Pill, Brand Tag, Price */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: l.status === 'ACTIVE' ? '#ECFDF5' : '#F3F4F6',
                            color: l.status === 'ACTIVE' ? '#065F46' : '#6B7280',
                          }}
                        >
                          {l.status === 'ACTIVE' ? 'Active' : 'Paused'}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            background: l.chipBg,
                            color: l.chipFg,
                          }}
                        >
                          {l.venture}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: 20, fontWeight: 700, color: '#14171C' }}>
                        {l.amount}
                      </div>
                    </div>

                    {/* Product Title */}
                    <div>
                      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#14171C', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                        {l.desc}
                      </h2>
                      <div style={{ fontSize: 11, color: '#8A9099' }}>Ref: {l.order}</div>
                    </div>

                    {/* Copyable Link Box */}
                    <div
                      style={{
                        background: '#FAF9F5',
                        border: '1px solid #E4E1DA',
                        borderRadius: 8,
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: '#5B6169',
                          fontFamily: 'monospace',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {l.slug}
                      </span>
                      <button
                        onClick={() => copyToClipboard(l.id, l.slug)}
                        style={{
                          background: copiedId === l.id ? '#10B981' : '#1E3A8A',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 6,
                          padding: '5px 12px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {copiedId === l.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    {/* Funnel Metrics Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        background: '#FAF9F5',
                        padding: '12px 14px',
                        borderRadius: 8,
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, color: '#8A9099', marginBottom: 2 }}>Clicks</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#14171C' }}>{l.clicks.toLocaleString()}</div>
                      </div>
                      <div style={{ borderLeft: '1px solid #E4E1DA', borderRight: '1px solid #E4E1DA' }}>
                        <div style={{ fontSize: 11, color: '#8A9099', marginBottom: 2 }}>Paid</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#14171C' }}>{l.conversions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#8A9099', marginBottom: 2 }}>CVR</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#059669' }}>{l.cvr}</div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0EFEA', paddingTop: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#8A9099' }}>Created {l.createdAt}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <a
                          href="http://localhost:3000/checkout"
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 12, color: '#263C8B', fontWeight: 600, textDecoration: 'none' }}
                        >
                          Test Checkout ↗
                        </a>
                        <button
                          onClick={() => handleToggleStatus(l.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 600,
                            color: l.status === 'ACTIVE' ? '#B3402F' : '#1F7A4D',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          {l.status === 'ACTIVE' ? 'Pause Link' : 'Activate Link'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VIEW 2: Audit Table View */}
          {viewMode === 'table' && (
            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E4E1DA', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#FAF9F5', borderBottom: '1px solid #E4E1DA' }}>
                    {['Product / Description', 'Brand Venture', 'Amount', 'Checkout URL', 'Clicks', 'Paid', 'CVR', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A9099' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: i < filteredLinks.length - 1 ? '1px solid #E4E1DA' : 'none' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#14171C' }}>{l.desc}</div>
                        <div style={{ fontSize: 11, color: '#8A9099' }}>{l.order}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: l.chipBg, color: l.chipFg }}>
                          {l.venture}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#14171C' }}>
                        {l.amount}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#5B6169' }}>{l.slug.slice(0, 28)}…</span>
                          <button
                            onClick={() => copyToClipboard(l.id, l.slug)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#263C8B', fontWeight: 600 }}
                          >
                            {copiedId === l.id ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{l.clicks.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{l.conversions.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#059669' }}>{l.cvr}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: l.stBg, color: l.stFg }}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => handleToggleStatus(l.id)}
                          style={{ background: 'none', border: 'none', color: '#263C8B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          {l.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Drawer: Create Payment Link */}
      {drawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: 480,
              maxWidth: '90vw',
              height: '100%',
              background: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              padding: 32,
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 18, fontWeight: 700, color: '#14171C', margin: 0 }}>
                  Create Direct Payment Link
                </h2>
                <p style={{ fontSize: 12, color: '#8A9099', margin: '4px 0 0 0' }}>
                  Generates an instant checkout URL with brand theme & payment routing
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8A9099' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 6 }}>
                  Brand / Venture
                </label>
                <select
                  value={formVenture}
                  onChange={e => setFormVenture(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }}
                >
                  <option value="StudyHub">StudyHub (EdTech)</option>
                  <option value="bldr (Storefront Pilot)">bldr Store (1st Party)</option>
                  <option value="EL HESA">EL HESA Academy</option>
                  <option value="Apex Classes">Apex Classes</option>
                  <option value="Career Hub">Career Hub</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 6 }}>
                  Product or Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass in Brand Strategy"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 6 }}>
                    Amount (EGP)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 6 }}>
                    Order Reference
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formOrderRef}
                    onChange={e => setFormOrderRef(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5B6169', marginBottom: 6 }}>
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formExpiry}
                  onChange={e => setFormExpiry(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13 }}
                />
              </div>

              {/* Preview Box */}
              <div style={{ padding: 14, background: '#FAF9F5', borderRadius: 8, border: '1px dashed #C8C4BC', marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', marginBottom: 4 }}>
                  Link URL Preview
                </div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#263C8B', fontWeight: 600 }}>
                  https://pay.bldr.dev/{formVenture.toLowerCase().slice(0, 4)}/{formDesc ? formDesc.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 16) : 'checkout-pass'}
                </div>
                <div style={{ fontSize: 11, color: '#5B6169', marginTop: 4 }}>
                  Includes Card (Visa/Mastercard/Meeza), Mobile Wallets & Fawry Pay
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #E4E1DA', background: '#FFFFFF', fontSize: 13, cursor: 'pointer', color: '#5B6169' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#263C8B', color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
