'use client';

import React, { useState } from 'react';
import {
  HubSidebar,
  HubTopBar,
  KpiCard,
  StatusBadge,
  VentureChip,
  Modal,
  formatEGP,
} from '@bldr/ui';

// ─── Initial Mock Data per PRD v1.0 & Mockups ─────────────────────────────────

interface VentureItem {
  id: string;
  code: string;
  name: string;
  chipBg: string;
  chipFg: string;
  activity: string;
  orderPrefix: string;
  defaultGateway: 'GEIDEA' | 'FAWRY';
  webhookUrl: string;
  status: 'ACTIVE' | 'SUSPENDED';
  gross: string;
  fees: string;
  vat: string;
  refunds: string;
  net: string;
  txns: number;
  sr: string;
}

const INITIAL_VENTURES: VentureItem[] = [
  {
    id: 'v-1',
    code: 'SH',
    name: 'StudyHub',
    chipBg: '#E6EFEB',
    chipFg: '#2E6F5E',
    activity: 'EdTech / Tutor OS',
    orderPrefix: 'SH-',
    defaultGateway: 'GEIDEA',
    webhookUrl: 'https://studyhub.internal/api/webhooks/payment',
    status: 'ACTIVE',
    gross: '2,140,000.00',
    fees: '53,500.00',
    vat: '7,490.00',
    refunds: '12,000.00',
    net: '2,067,010.00',
    txns: 1540,
    sr: '95.4%',
  },
  {
    id: 'v-2',
    code: 'AC',
    name: 'Apex Classes',
    chipBg: '#E8EEF7',
    chipFg: '#2C5F9E',
    activity: 'Academic Cohorts',
    orderPrefix: 'AC-',
    defaultGateway: 'GEIDEA',
    webhookUrl: 'https://apexclasses.internal/hooks/payments',
    status: 'ACTIVE',
    gross: '1,280,500.00',
    fees: '32,012.50',
    vat: '4,481.75',
    refunds: '9,500.00',
    net: '1,234,505.75',
    txns: 780,
    sr: '93.8%',
  },
  {
    id: 'v-3',
    code: 'EH',
    name: 'EL HESA',
    chipBg: '#FBF3E0',
    chipFg: '#B8860B',
    activity: 'Gamified Learning',
    orderPrefix: 'EH-',
    defaultGateway: 'FAWRY',
    webhookUrl: 'https://elhesa.internal/pay-webhook',
    status: 'ACTIVE',
    gross: '492,000.00',
    fees: '12,300.00',
    vat: '1,722.00',
    refunds: '3,500.00',
    net: '474,478.00',
    txns: 390,
    sr: '92.1%',
  },
  {
    id: 'v-4',
    code: 'CH',
    name: 'Career Hub',
    chipBg: '#F0EAF7',
    chipFg: '#7A4CA0',
    activity: 'Workshops & Training',
    orderPrefix: 'CH-',
    defaultGateway: 'GEIDEA',
    webhookUrl: 'https://careerhub.internal/events/paid',
    status: 'ACTIVE',
    gross: '270,000.00',
    fees: '6,750.00',
    vat: '945.00',
    refunds: '2,000.00',
    net: '260,305.00',
    txns: 137,
    sr: '96.2%',
  },
];

interface LinkItem {
  slug: string;
  code: string;
  venture: string;
  chipBg: string;
  chipFg: string;
  desc: string;
  order: string;
  amount: string;
  mode: 'Fixed' | 'Open';
  uses: string;
  expiry: string;
  status: string;
}

const INITIAL_LINKS: LinkItem[] = [
  { slug: 'sh-8k2m9q', code: 'SH', venture: 'StudyHub', chipBg: '#E6EFEB', chipFg: '#2E6F5E', desc: 'Math Course — Term 1', order: 'SH-COURSE-4581', amount: 'EGP 750.00', mode: 'Fixed', uses: '1 / 1', expiry: '—', status: 'PAID' },
  { slug: 'sh-4r7t1a', code: 'SH', venture: 'StudyHub', chipBg: '#E6EFEB', chipFg: '#2E6F5E', desc: 'Physics Bundle', order: 'SH-BUNDLE-0212', amount: 'EGP 1,200.00', mode: 'Fixed', uses: '0 / 1', expiry: '20 Sep 2026', status: 'ACTIVE' },
  { slug: 'ac-9w3e5z', code: 'AC', venture: 'Apex Classes', chipBg: '#E8EEF7', chipFg: '#2C5F9E', desc: 'Grade 12 Revision', order: 'AC-REV-1188', amount: 'EGP 2,400.00', mode: 'Fixed', uses: '3 / 5', expiry: '30 Sep 2026', status: 'ACTIVE' },
  { slug: 'eh-2n6b8v', code: 'EH', venture: 'EL HESA', chipBg: '#FBF3E0', chipFg: '#B8860B', desc: 'Consultation fee', order: 'EH-CONS-0455', amount: 'Open', mode: 'Open', uses: '0 / 1', expiry: '18 Sep 2026', status: 'ACTIVE' },
  { slug: 'ch-5t8o2p', code: 'CH', venture: 'Career Hub', chipBg: '#F0EAF7', chipFg: '#7A4CA0', desc: 'CV Workshop — Oct cohort', order: 'CH-WS-0031', amount: 'EGP 350.00', mode: 'Fixed', uses: '12 / 20', expiry: '01 Oct 2026', status: 'ACTIVE' },
];

interface TxnItem {
  id: string;
  order: string;
  ventureCode: string;
  ventureName: string;
  chipBg: string;
  chipFg: string;
  customer: string;
  amount: string;
  net: string;
  method: string;
  gateway: string;
  date: string;
  status: string;
}

const INITIAL_TXNS: TxnItem[] = [
  { id: 'txn_01J8F4KQ2M', order: 'SH-COURSE-4581', ventureCode: 'SH', ventureName: 'StudyHub', chipBg: '#E6EFEB', chipFg: '#2E6F5E', customer: 'ahmed.k@example.com', amount: 'EGP 750.00', net: 'EGP 728.62', method: 'Card (Visa)', gateway: 'Geidea', date: '14 Sep 2026 · 14:32', status: 'PAID' },
  { id: 'txn_01J8F3NP9B', order: 'AC-REV-1188', ventureCode: 'AC', ventureName: 'Apex Classes', chipBg: '#E8EEF7', chipFg: '#2C5F9E', customer: 'nour.m@example.com', amount: 'EGP 2,400.00', net: 'EGP 2,334.00', method: 'Card (Mastercard)', gateway: 'Geidea', date: '14 Sep 2026 · 13:18', status: 'PAID' },
  { id: 'txn_01J8F2KL7A', order: 'EH-ASMT-0177', ventureCode: 'EH', ventureName: 'EL HESA', chipBg: '#FBF3E0', chipFg: '#B8860B', customer: 'youssef.h@example.com', amount: 'EGP 600.00', net: 'EGP 583.50', method: 'Kiosk (Fawry)', gateway: 'Fawry', date: '14 Sep 2026 · 11:45', status: 'PAID' },
  { id: 'txn_01J8F1MN4C', order: 'SH-SUB-0907', ventureCode: 'SH', ventureName: 'StudyHub', chipBg: '#E6EFEB', chipFg: '#2E6F5E', customer: 'mariam.s@example.com', amount: 'EGP 4,500.00', net: 'EGP 4,376.25', method: 'Mobile Wallet (Vodafone)', gateway: 'Geidea', date: '14 Sep 2026 · 09:20', status: 'PAID' },
  { id: 'txn_01J8E9XX1Z', order: 'CH-WS-0031', ventureCode: 'CH', ventureName: 'Career Hub', chipBg: '#F0EAF7', chipFg: '#7A4CA0', customer: 'tarek.b@example.com', amount: 'EGP 350.00', net: 'EGP 340.38', method: 'Card (Meeza)', gateway: 'Geidea', date: '13 Sep 2026 · 18:05', status: 'PAID' },
  { id: 'txn_01J8E8QQ9P', order: 'AC-ENR-0620', ventureCode: 'AC', ventureName: 'Apex Classes', chipBg: '#E8EEF7', chipFg: '#2C5F9E', customer: 'karim.w@example.com', amount: 'EGP 1,800.00', net: '—', method: 'Card', gateway: 'Geidea', date: '13 Sep 2026 · 15:40', status: 'FAILED' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Ventures' | 'Payment Links' | 'Transactions'>('Overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'QTD'>('30d');
  
  // Data state
  const [ventures, setVentures] = useState<VentureItem[]>(INITIAL_VENTURES);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [txns, setTxns] = useState<TxnItem[]>(INITIAL_TXNS);
  const [selectedTxn, setSelectedTxn] = useState<TxnItem | null>(null);

  // Modal controls
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isVentureModalOpen, setIsVentureModalOpen] = useState(false);

  // New Link Form
  const [newLinkVenture, setNewLinkVenture] = useState('SH');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  const [newLinkAmount, setNewLinkAmount] = useState('');
  const [newLinkOrder, setNewLinkOrder] = useState('');

  // New Venture Form
  const [newVName, setNewVName] = useState('');
  const [newVCode, setNewVCode] = useState('');
  const [newVPrefix, setNewVPrefix] = useState('');
  const [newVGateway, setNewVGateway] = useState<'GEIDEA' | 'FAWRY'>('GEIDEA');
  const [newVWebhook, setNewVWebhook] = useState('');

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const v = ventures.find((x) => x.code === newLinkVenture) || ventures[0];
    const slug = `${v.code.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
    const created: LinkItem = {
      slug,
      code: v.code,
      venture: v.name,
      chipBg: v.chipBg,
      chipFg: v.chipFg,
      desc: newLinkDesc || 'General Payment',
      order: newLinkOrder || `${v.orderPrefix}${Math.floor(1000 + Math.random() * 9000)}`,
      amount: newLinkAmount ? `EGP ${parseFloat(newLinkAmount).toFixed(2)}` : 'Open',
      mode: newLinkAmount ? 'Fixed' : 'Open',
      uses: '0 / 1',
      expiry: '30 Sep 2026',
      status: 'ACTIVE',
    };
    setLinks([created, ...links]);
    setIsLinkModalOpen(false);
    setNewLinkDesc('');
    setNewLinkAmount('');
    setNewLinkOrder('');
  };

  const handleCreateVenture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVName || !newVCode) return;
    const created: VentureItem = {
      id: `v-${Date.now()}`,
      code: newVCode.toUpperCase(),
      name: newVName,
      chipBg: '#E8EEF7',
      chipFg: '#2C5F9E',
      activity: 'Digital Venture',
      orderPrefix: newVPrefix || `${newVCode.toUpperCase()}-`,
      defaultGateway: newVGateway,
      webhookUrl: newVWebhook || 'https://venture.internal/webhook',
      status: 'ACTIVE',
      gross: '0.00',
      fees: '0.00',
      vat: '0.00',
      refunds: '0.00',
      net: '0.00',
      txns: 0,
      sr: '100%',
    };
    setVentures([...ventures, created]);
    setIsVentureModalOpen(false);
    setNewVName('');
    setNewVCode('');
    setNewVPrefix('');
    setNewVWebhook('');
  };

  return (
    <div className="hub-shell">
      {/* ─── 240px Navigation Sidebar ────────────────────────────── */}
      <HubSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        badges={{ 'Payment Links': links.filter(l => l.status === 'ACTIVE').length }}
      />

      {/* ─── Main Content Canvas ─────────────────────────────────── */}
      <div className="hub-main">
        <HubTopBar
          title={
            activeTab === 'Overview' ? 'Executive Overview' :
            activeTab === 'Ventures' ? 'Venture & Brand Management' :
            activeTab === 'Payment Links' ? 'Payment Links Generator' : 'Transactions & Order Ledger'
          }
          crumb={`Central Payment Hub / ${activeTab}`}
          env="Sandbox"
          actionLabel={
            activeTab === 'Payment Links' ? '+ Create Payment Link' :
            activeTab === 'Ventures' ? '+ Add Venture Profile' : undefined
          }
          onActionClick={() => {
            if (activeTab === 'Payment Links') setIsLinkModalOpen(true);
            if (activeTab === 'Ventures') setIsVentureModalOpen(true);
          }}
        />

        <div className="hub-content">
          {/* ══════════════════════════════════════════════════════════
              SECTION 1a: EXECUTIVE OVERVIEW
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'Overview' && (
            <>
              {/* Controls bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', padding: 3, background: '#E7EBF1', borderRadius: 8, gap: 2 }}>
                  {(['7d', '30d', 'QTD'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeRange(t)}
                      style={{
                        border: 'none',
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: 6,
                        background: timeRange === t ? '#FFFFFF' : 'transparent',
                        color: timeRange === t ? '#1B2A4A' : '#8A94A6',
                        boxShadow: timeRange === t ? '0 1px 2px rgba(27,42,74,0.1)' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A94A6' }}>
                  16 Aug – 14 Sep 2026 · Africa/Cairo (UTC+3)
                </span>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => setActiveTab('Payment Links')}
                  className="hub-btn hub-btn-primary"
                >
                  + Generate Payment Link
                </button>
              </div>

              {/* 5 KPI Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 14 }}>
                <KpiCard label="Gross Volume" value="EGP 4,182,500.00" delta="+14.2% vs prior period" deltaColor="#2E6F5E" />
                <KpiCard label="Net Collected" value="EGP 4,036,298.75" delta="+13.8% vs prior period" deltaColor="#2E6F5E" />
                <KpiCard label="PSP Fees" value="EGP 104,562.50" delta="2.50% blended rate" deltaColor="#5A6A80" />
                <KpiCard label="Active Links" value={links.filter(l => l.status === 'ACTIVE').length.toString()} delta="4 expiring this week" deltaColor="#B8860B" />
                <KpiCard label="Refund Rate" value="0.65%" delta="-0.12% vs prior period" deltaColor="#2E6F5E" />
              </div>

              {/* Chart and Status Distribution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 16 }}>
                {/* 30-Day Bar Simulation */}
                <div className="hub-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Gross Collection</span>
                    <span style={{ fontSize: 11, color: '#8A94A6' }}>daily volume, all active ventures</span>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A6A80' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: '#2E6F5E' }} />
                      <span>Settled</span>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: '#D3DAE4', marginLeft: 8 }} />
                      <span>Failed / Expired</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, borderBottom: '1px solid #E3E8EF', paddingBottom: 0 }}>
                    {[
                      32, 44, 38, 55, 62, 48, 58, 70, 64, 52,
                      68, 76, 82, 74, 60, 69, 78, 85, 91, 75,
                      68, 80, 88, 84, 72, 79, 86, 92, 88, 94,
                    ].map((h, i) => {
                      const failedH = Math.round(Math.max(4, h * 0.12));
                      return (
                        <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
                          <div style={{ height: `${failedH}%`, background: '#D3DAE4', borderRadius: '2px 2px 0 0' }} />
                          <div style={{ height: `${h}%`, background: '#2E6F5E', borderRadius: '0 0 2px 2px' }} />
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 10.5, color: '#8A94A6' }}>
                    <span>16 Aug</span>
                    <span>30 Aug</span>
                    <span>14 Sep</span>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="hub-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Transactions by Status</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'PAID (Settled)', count: '2,682', pct: '94.2%', w: '94.2%', color: '#2E6F5E' },
                      { label: 'PENDING', count: '80', pct: '2.8%', w: '2.8%', color: '#2C5F9E' },
                      { label: 'FAILED', count: '48', pct: '1.7%', w: '1.7%', color: '#C0392B' },
                      { label: 'REFUNDED', count: '20', pct: '0.7%', w: '0.7%', color: '#B8860B' },
                      { label: 'EXPIRED', count: '17', pct: '0.6%', w: '0.6%', color: '#8A94A6' },
                    ].map((s) => (
                      <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
                          <span style={{ flex: 1, fontWeight: 600, color: '#1B2A4A' }}>{s.label}</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.count}</span>
                          <span style={{ fontFamily: 'monospace', color: '#8A94A6', width: 44, textAlign: 'right' }}>{s.pct}</span>
                        </div>
                        <div style={{ height: 4, background: '#EEF1F5', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: s.w, height: '100%', background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Net Revenue by Venture Table */}
              <div className="hub-table-wrapper">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Net Revenue by Venture</span>
                  <span style={{ fontSize: 11, color: '#8A94A6' }}>gross − PSP fees − VAT − refunds</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => setActiveTab('Ventures')} style={{ background: 'none', border: 'none', color: '#2E6F5E', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>
                    Manage Ventures →
                  </button>
                </div>
                <div className="hub-table-header" style={{ display: 'grid', gridTemplateColumns: '220px repeat(5, minmax(0, 1fr)) 80px 80px' }}>
                  <span>Venture</span>
                  <span style={{ textAlign: 'right' }}>Gross (EGP)</span>
                  <span style={{ textAlign: 'right' }}>PSP Fees</span>
                  <span style={{ textAlign: 'right' }}>VAT</span>
                  <span style={{ textAlign: 'right' }}>Refunds</span>
                  <span style={{ textAlign: 'right' }}>Net Revenue</span>
                  <span style={{ textAlign: 'right' }}>Txns</span>
                  <span style={{ textAlign: 'right' }}>Success</span>
                </div>
                {ventures.map((v) => (
                  <div key={v.id} className="hub-table-row" style={{ display: 'grid', gridTemplateColumns: '220px repeat(5, minmax(0, 1fr)) 80px 80px' }}>
                    <VentureChip code={v.code} name={v.name} chipBg={v.chipBg} chipFg={v.chipFg} />
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 600 }}>{v.gross}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', color: '#5A6A80' }}>{v.fees}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', color: '#5A6A80' }}>{v.vat}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', color: '#5A6A80' }}>{v.refunds}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 700, color: '#12203C' }}>{v.net}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', color: '#5A6A80' }}>{v.txns}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 700, color: '#2E6F5E' }}>{v.sr}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════
              SECTION 1b: VENTURE & BRAND MANAGEMENT
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'Ventures' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1B2A4A' }}>Registered Ventures &amp; Brands</h2>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#5A6A80' }}>
                    Every venture shares the central bldr legal entity and payment hub adapter layer.
                  </p>
                </div>
                <button onClick={() => setIsVentureModalOpen(true)} className="hub-btn hub-btn-primary">
                  + Add New Venture
                </button>
              </div>

              <div className="hub-table-wrapper">
                <div className="hub-table-header" style={{ display: 'grid', gridTemplateColumns: '220px 160px 120px 140px 1fr 100px' }}>
                  <span>Venture</span>
                  <span>Activity</span>
                  <span>Order Prefix</span>
                  <span>Gateway Adapter</span>
                  <span>Webhook Endpoint</span>
                  <span>Status</span>
                </div>
                {ventures.map((v) => (
                  <div key={v.id} className="hub-table-row" style={{ display: 'grid', gridTemplateColumns: '220px 160px 120px 140px 1fr 100px' }}>
                    <VentureChip code={v.code} name={v.name} chipBg={v.chipBg} chipFg={v.chipFg} />
                    <span style={{ fontSize: 12.5, color: '#5A6A80' }}>{v.activity}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{v.orderPrefix}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: v.defaultGateway === 'GEIDEA' ? '#2E6F5E' : '#B8860B' }}>
                      {v.defaultGateway}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#5A6A80', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.webhookUrl}
                    </span>
                    <StatusBadge status={v.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              SECTION 1c: PAYMENT LINKS GENERATOR
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'Payment Links' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1B2A4A' }}>Central Payment Links</h2>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#5A6A80' }}>
                    Hosted on central domain <code style={{ fontFamily: 'monospace', background: '#FFFFFF', padding: '1px 5px', borderRadius: 4 }}>pay.bldr.com/l/...</code> with dynamic venture branding.
                  </p>
                </div>
                <button onClick={() => setIsLinkModalOpen(true)} className="hub-btn hub-btn-primary">
                  + Create Payment Link
                </button>
              </div>

              <div className="hub-table-wrapper">
                <div className="hub-table-header" style={{ display: 'grid', gridTemplateColumns: '200px 180px 1fr 120px 110px 100px 90px 100px' }}>
                  <span>Link URL</span>
                  <span>Venture</span>
                  <span>Description</span>
                  <span style={{ textAlign: 'right' }}>Amount</span>
                  <span style={{ textAlign: 'center' }}>Uses</span>
                  <span>Expires</span>
                  <span>Status</span>
                  <span style={{ textAlign: 'right' }}>Action</span>
                </div>
                {links.map((l) => (
                  <div key={l.slug} className="hub-table-row" style={{ display: 'grid', gridTemplateColumns: '200px 180px 1fr 120px 110px 100px 90px 100px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#2C5F9E', fontWeight: 600 }}>
                      pay.bldr.com/l/{l.slug}
                    </span>
                    <VentureChip code={l.code} name={l.venture} chipBg={l.chipBg} chipFg={l.chipFg} />
                    <span style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.desc}
                    </span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 700 }}>{l.amount}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'center', fontSize: 11.5, color: '#5A6A80' }}>{l.uses}</span>
                    <span style={{ fontSize: 11.5, color: '#8A94A6' }}>{l.expiry}</span>
                    <StatusBadge status={l.status} />
                    <div style={{ textAlign: 'right' }}>
                      <a
                        href={`http://localhost:3000/pay/${l.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#2E6F5E',
                          padding: '4px 8px',
                          borderRadius: 4,
                          background: '#E6EFEB',
                          textDecoration: 'none',
                        }}
                      >
                        Open ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              SECTION 1d: TRANSACTIONS & ORDER LEDGER
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'Transactions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1B2A4A' }}>Transactions Stream &amp; Ledger</h2>
                  <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#5A6A80' }}>
                    Immutable append-only ledger entries verified through HMAC signed webhooks.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="hub-btn hub-btn-secondary">Export Ledger CSV</button>
                </div>
              </div>

              <div className="hub-table-wrapper">
                <div className="hub-table-header" style={{ display: 'grid', gridTemplateColumns: '130px 150px 180px 1fr 110px 140px 140px 90px' }}>
                  <span>Order Ref</span>
                  <span>Txn ID</span>
                  <span>Venture</span>
                  <span>Customer Email</span>
                  <span style={{ textAlign: 'right' }}>Amount</span>
                  <span>Method</span>
                  <span>Date &amp; Time</span>
                  <span>Status</span>
                </div>
                {txns.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTxn(t)}
                    className="hub-table-row"
                    style={{ display: 'grid', gridTemplateColumns: '130px 150px 180px 1fr 110px 140px 140px 90px' }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12 }}>{t.order}</span>
                    <span style={{ fontFamily: 'monospace', color: '#5A6A80', fontSize: 11.5 }}>{t.id}</span>
                    <VentureChip code={t.ventureCode} name={t.ventureName} chipBg={t.chipBg} chipFg={t.chipFg} />
                    <span style={{ fontSize: 12.5, color: '#1B2A4A' }}>{t.customer}</span>
                    <span style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 700 }}>{t.amount}</span>
                    <span style={{ fontSize: 12, color: '#5A6A80' }}>{t.method}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A94A6' }}>{t.date}</span>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Slide-over Transaction Inspector (Section 1d) ──────── */}
      {selectedTxn && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: 'rgba(18, 32, 60, 0.35)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedTxn(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 580,
              height: '100%',
              background: '#FFFFFF',
              boxShadow: '-10px 0 30px rgba(18,32,60,0.15)',
              padding: 28,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A94A6' }}>{selectedTxn.id}</span>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#12203C' }}>{selectedTxn.order}</h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8A94A6' }}
              >
                ✕
              </button>
            </div>

            {/* Status & Amount Strip */}
            <div style={{ display: 'flex', gap: 16, background: '#F5F7FA', padding: 16, borderRadius: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Status</span>
                <StatusBadge status={selectedTxn.status} />
              </div>
              <div style={{ width: 1, background: '#E3E8EF' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Gross Paid</span>
                <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#12203C' }}>{selectedTxn.amount}</span>
              </div>
              <div style={{ width: 1, background: '#E3E8EF' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Net Settled</span>
                <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#2E6F5E' }}>{selectedTxn.net}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="hub-btn hub-btn-secondary" style={{ flex: 1 }} onClick={() => alert('Venture Webhook Dispatched (Simulated)!')}>
                Resend Venture Webhook
              </button>
              <button className="hub-btn hub-btn-dark" onClick={() => alert('Refund workflow initialized (Requires Requester ≠ Approver per PRD §8.8).')}>
                Request Refund
              </button>
            </div>

            {/* Event Trail (Mockup 1d) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Event Trail (Append-Only)</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderLeft: '2px solid #E7EBF1', paddingLeft: 14 }}>
                {[
                  { time: '14:32:08', title: 'Payment Intent created', actor: 'Venture API' },
                  { time: '14:32:10', title: 'Hosted Checkout session generated', actor: 'Provider Adapter (Geidea)' },
                  { time: '14:32:15', title: 'Customer authorized card payment', actor: 'End Customer' },
                  { time: '14:32:16', title: 'PSP Webhook received & HMAC verified', actor: 'Payment Hub' },
                  { time: '14:32:17', title: 'Venture notified via signed webhook', actor: 'Webhook Worker' },
                ].map((ev, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace', color: '#8A94A6' }}>
                      <span>{ev.time}</span>
                      <span>{ev.actor}</span>
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#12203C' }}>{ev.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Immutable Ledger Entries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Immutable Ledger Postings</span>
              <div style={{ border: '1px solid #E3E8EF', borderRadius: 8, overflow: 'hidden', fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px', padding: '8px 12px', background: '#FAFBFD', fontWeight: 700, color: '#8A94A6', fontSize: 10, textTransform: 'uppercase' }}>
                  <span>Entry</span>
                  <span style={{ textAlign: 'right' }}>Amount</span>
                  <span style={{ textAlign: 'center' }}>Type</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px', padding: '8px 12px', borderBottom: '1px solid #F0F3F7' }}>
                  <span>Gross customer charge</span>
                  <span style={{ fontFamily: 'monospace', textAlign: 'right' }}>750.00</span>
                  <span style={{ textAlign: 'center', color: '#2E6F5E', fontWeight: 700 }}>CR</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px', padding: '8px 12px', borderBottom: '1px solid #F0F3F7' }}>
                  <span>PSP interchange &amp; gateway fee</span>
                  <span style={{ fontFamily: 'monospace', textAlign: 'right' }}>18.75</span>
                  <span style={{ textAlign: 'center', color: '#C0392B', fontWeight: 700 }}>DR</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px', padding: '8px 12px', borderBottom: '1px solid #F0F3F7' }}>
                  <span>VAT on gateway fees (14%)</span>
                  <span style={{ fontFamily: 'monospace', textAlign: 'right' }}>2.63</span>
                  <span style={{ textAlign: 'center', color: '#C0392B', fontWeight: 700 }}>DR</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 60px', padding: '8px 12px', background: '#FAFBFD', fontWeight: 700 }}>
                  <span>Net settled to bldr account</span>
                  <span style={{ fontFamily: 'monospace', textAlign: 'right', color: '#2E6F5E' }}>728.62</span>
                  <span style={{ textAlign: 'center' }}>—</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Create Payment Link (Section 1c) ─────────────── */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Generate Central Payment Link">
        <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Venture</label>
            <select
              value={newLinkVenture}
              onChange={(e) => setNewLinkVenture(e.target.value)}
              style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
            >
              {ventures.map((v) => (
                <option key={v.code} value={v.code}>{v.name} ({v.code})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Description / Item</label>
            <input
              type="text"
              required
              placeholder="e.g. Physics Revision Cohort"
              value={newLinkDesc}
              onChange={(e) => setNewLinkDesc(e.target.value)}
              style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Fixed Amount (EGP)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Leave blank for open amount"
                value={newLinkAmount}
                onChange={(e) => setNewLinkAmount(e.target.value)}
                style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Order Reference</label>
              <input
                type="text"
                placeholder="Auto-generated if blank"
                value={newLinkOrder}
                onChange={(e) => setNewLinkOrder(e.target.value)}
                style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
            <button type="button" onClick={() => setIsLinkModalOpen(false)} className="hub-btn hub-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="hub-btn hub-btn-primary">
              Generate Link
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── Modal: Add Venture Profile (Section 1b) ──────────────── */}
      <Modal isOpen={isVentureModalOpen} onClose={() => setIsVentureModalOpen(false)} title="Register Venture Profile">
        <form onSubmit={handleCreateVenture} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Venture Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Classes"
                value={newVName}
                onChange={(e) => setNewVName(e.target.value)}
                style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Code (2-4 chars)</label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="AC"
                value={newVCode}
                onChange={(e) => setNewVCode(e.target.value)}
                style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13, textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Order Prefix</label>
              <input
                type="text"
                placeholder="e.g. AC-"
                value={newVPrefix}
                onChange={(e) => setNewVPrefix(e.target.value)}
                style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Default Gateway</label>
              <select
                value={newVGateway}
                onChange={(e) => setNewVGateway(e.target.value as 'GEIDEA' | 'FAWRY')}
                style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
              >
                <option value="GEIDEA">Geidea (Cards &amp; Wallets)</option>
                <option value="FAWRY">Fawry (Cash &amp; Reference)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Webhook URL</label>
            <input
              type="url"
              placeholder="https://venture.internal/api/webhooks"
              value={newVWebhook}
              onChange={(e) => setNewVWebhook(e.target.value)}
              style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 10px', fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
            <button type="button" onClick={() => setIsVentureModalOpen(false)} className="hub-btn hub-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="hub-btn hub-btn-primary">
              Register Venture
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
