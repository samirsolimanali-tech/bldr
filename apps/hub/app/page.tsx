'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import HubSidebar from '../components/HubSidebar';
import HubTopBar from '../components/HubTopBar';

// ─── Static Master Data & Baselines ──────────────────────────────────────────

interface VentureBaseline {
  code: string;
  name: string;
  chipBg: string;
  chipFg: string;
  gross: number;
  fees: number;
  vat: number;
  refunds: number;
  txns: number;
  sr: number; // percentage
  unmatched: number;
  pendingPayouts: number;
  rails: {
    name: string;
    code: string;
    share: number;
    feeRate: number;
    sr: number;
  }[];
}

const VENTURE_BASELINES: VentureBaseline[] = [
  {
    code: 'BLDR',
    name: 'bldr (Storefront Pilot)',
    chipBg: '#FEE2E2',
    chipFg: '#D10721',
    gross: 150000,
    fees: 3750,
    vat: 525,
    refunds: 0,
    txns: 48,
    sr: 98.2,
    unmatched: 0,
    pendingPayouts: 142500,
    rails: [
      { name: 'Cards (Geidea)', code: 'cards', share: 0.65, feeRate: 0.025, sr: 98.5 },
      { name: 'Mobile Wallets (Geidea)', code: 'wallets', share: 0.25, feeRate: 0.020, sr: 97.8 },
      { name: 'Kiosk (Fawry)', code: 'kiosk', share: 0.10, feeRate: 0.025, sr: 98.0 },
    ],
  },
  {
    code: 'SH',
    name: 'StudyHub',
    chipBg: '#E6EFEB',
    chipFg: '#2E6F5E',
    gross: 2410000,
    fees: 60250,
    vat: 8435,
    refunds: 18500,
    txns: 1642,
    sr: 95.1,
    unmatched: 22500,
    pendingPayouts: 85000,
    rails: [
      { name: 'Cards (Visa / MC)', code: 'cards', share: 0.65, feeRate: 0.026, sr: 96.4 },
      { name: 'Mobile Wallets', code: 'wallets', share: 0.23, feeRate: 0.020, sr: 93.8 },
      { name: 'Kiosk / Fawry Pay', code: 'kiosk', share: 0.12, feeRate: 0.025, sr: 91.2 },
    ],
  },
  {
    code: 'AC',
    name: 'Apex Classes',
    chipBg: '#E8EEF7',
    chipFg: '#2C5F9E',
    gross: 986500,
    fees: 24662.5,
    vat: 3452.75,
    refunds: 6000,
    txns: 704,
    sr: 93.8,
    unmatched: 11250,
    pendingPayouts: 38000,
    rails: [
      { name: 'Cards (Visa / MC)', code: 'cards', share: 0.72, feeRate: 0.026, sr: 95.0 },
      { name: 'Mobile Wallets', code: 'wallets', share: 0.20, feeRate: 0.020, sr: 92.1 },
      { name: 'Kiosk / Fawry Pay', code: 'kiosk', share: 0.08, feeRate: 0.025, sr: 89.5 },
    ],
  },
  {
    code: 'EH',
    name: 'EL HESA',
    chipBg: '#FBF3E0',
    chipFg: '#B8860B',
    gross: 512000,
    fees: 12800,
    vat: 1792,
    refunds: 2500,
    txns: 371,
    sr: 92.4,
    unmatched: 5500,
    pendingPayouts: 19000,
    rails: [
      { name: 'Mobile Wallets', code: 'wallets', share: 0.46, feeRate: 0.020, sr: 93.2 },
      { name: 'Kiosk / Fawry Pay', code: 'kiosk', share: 0.36, feeRate: 0.025, sr: 90.6 },
      { name: 'Cards (Visa / MC)', code: 'cards', share: 0.18, feeRate: 0.026, sr: 94.8 },
    ],
  },
  {
    code: 'CH',
    name: 'Career Hub',
    chipBg: '#F0EAF7',
    chipFg: '#7A4CA0',
    gross: 274000,
    fees: 6850,
    vat: 959,
    refunds: 0,
    txns: 130,
    sr: 96.9,
    unmatched: 2000,
    pendingPayouts: 6000,
    rails: [
      { name: 'Cards (Visa / MC)', code: 'cards', share: 0.88, feeRate: 0.026, sr: 97.5 },
      { name: 'Mobile Wallets', code: 'wallets', share: 0.12, feeRate: 0.020, sr: 94.0 },
    ],
  },
];

// Baseline 30 daily bar patterns (scaled dynamically)
const BASE_DAILY_POINTS = [
  { day: '16 Aug', paidRatio: 0.85, baseAmount: 132000 },
  { day: '17 Aug', paidRatio: 0.90, baseAmount: 118000 },
  { day: '18 Aug', paidRatio: 0.94, baseAmount: 145000 },
  { day: '19 Aug', paidRatio: 0.88, baseAmount: 124000 },
  { day: '20 Aug', paidRatio: 0.96, baseAmount: 162000 },
  { day: '21 Aug', paidRatio: 0.91, baseAmount: 98000 },
  { day: '22 Aug', paidRatio: 0.89, baseAmount: 76000 },
  { day: '23 Aug', paidRatio: 0.95, baseAmount: 139000 },
  { day: '24 Aug', paidRatio: 0.93, baseAmount: 153000 },
  { day: '25 Aug', paidRatio: 0.92, baseAmount: 129000 },
  { day: '26 Aug', paidRatio: 0.96, baseAmount: 178000 },
  { day: '27 Aug', paidRatio: 0.94, baseAmount: 141000 },
  { day: '28 Aug', paidRatio: 0.90, baseAmount: 119000 },
  { day: '29 Aug', paidRatio: 0.88, baseAmount: 92000 },
  { day: '30 Aug', paidRatio: 0.95, baseAmount: 148000 },
  { day: '31 Aug', paidRatio: 0.96, baseAmount: 169000 },
  { day: '01 Sep', paidRatio: 0.94, baseAmount: 134000 },
  { day: '02 Sep', paidRatio: 0.91, baseAmount: 112000 },
  { day: '03 Sep', paidRatio: 0.97, baseAmount: 185000 },
  { day: '04 Sep', paidRatio: 0.93, baseAmount: 147000 },
  { day: '05 Sep', paidRatio: 0.92, baseAmount: 122000 },
  { day: '06 Sep', paidRatio: 0.95, baseAmount: 166000 },
  { day: '07 Sep', paidRatio: 0.93, baseAmount: 138000 },
  { day: '08 Sep', paidRatio: 0.89, baseAmount: 96000 },
  { day: '09 Sep', paidRatio: 0.95, baseAmount: 157000 },
  { day: '10 Sep', paidRatio: 0.96, baseAmount: 182000 },
  { day: '11 Sep', paidRatio: 0.92, baseAmount: 128000 },
  { day: '12 Sep', paidRatio: 0.94, baseAmount: 151000 },
  { day: '13 Sep', paidRatio: 0.96, baseAmount: 174000 },
  { day: '14 Sep', paidRatio: 0.95, baseAmount: 168000 },
];

export default function HubExecutiveOverview() {
  // ─── Filter States ──────────────────────────────────────────────────────────
  const [activeVenture, setActiveVenture] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'QTD' | 'Custom'>('30d');
  const [customStart, setCustomStart] = useState('2026-08-01');
  const [customEnd, setCustomEnd] = useState('2026-09-14');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedGateway, setSelectedGateway] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');

  // Interactive drop-down popover controls
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showGatewayDropdown, setShowGatewayDropdown] = useState(false);
  const [showVentureDropdown, setShowVentureDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Table search & sort
  const [tableSearch, setTableSearch] = useState('');
  const [sortBy, setSortBy] = useState<'gross' | 'net' | 'txns' | 'sr'>('net');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Chart hover state
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // ─── Multipliers & Dynamic Calculations ─────────────────────────────────────

  // Time Range Factor
  const { timeMultiplier, dateSpanLabel, daysCount } = useMemo(() => {
    switch (timeRange) {
      case '7d':
        return {
          timeMultiplier: 7 / 30,
          dateSpanLabel: '08 Sep – 14 Sep 2026 · Africa/Cairo (UTC+3)',
          daysCount: 7,
        };
      case 'QTD':
        return {
          timeMultiplier: 76 / 30,
          dateSpanLabel: '01 Jul – 14 Sep 2026 · Africa/Cairo (UTC+3)',
          daysCount: 76,
        };
      case 'Custom': {
        const start = new Date(customStart);
        const end = new Date(customEnd);
        const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        return {
          timeMultiplier: diffDays / 30,
          dateSpanLabel: `${fmt(start)} – ${fmt(end)} · Africa/Cairo (UTC+3)`,
          daysCount: diffDays,
        };
      }
      case '30d':
      default:
        return {
          timeMultiplier: 1.0,
          dateSpanLabel: '16 Aug – 14 Sep 2026 · Africa/Cairo (UTC+3)',
          daysCount: 30,
        };
    }
  }, [timeRange, customStart, customEnd]);

  // Method Factor & SR adjustments
  const methodFactors: Record<string, { share: number; srDelta: number; label: string }> = {
    all: { share: 1.0, srDelta: 0, label: 'All Methods' },
    cards: { share: 0.68, srDelta: 1.8, label: 'Cards (Visa & MC)' },
    wallets: { share: 0.22, srDelta: -1.2, label: 'Mobile Wallets' },
    kiosk: { share: 0.10, srDelta: -3.5, label: 'Kiosk / Fawry Pay' },
  };

  // Gateway Factor
  const gatewayFactors: Record<string, { share: number; label: string }> = {
    all: { share: 1.0, label: 'All Gateways' },
    paymob: { share: 0.68, label: 'Paymob (Accept)' },
    fawry: { share: 0.17, label: 'FawryPay' },
    cib: { share: 0.09, label: 'CIB Merchant' },
    kashier: { share: 0.04, label: 'Kashier' },
    stripe: { share: 0.02, label: 'Stripe Int.' },
  };

  // Environment Factor (Sandbox shows simulated test staging numbers)
  const envMultiplier = env === 'Sandbox' ? 0.08 : 1.0;

  // Active combined multiplier
  const activeMethodFactor = methodFactors[selectedMethod] || methodFactors.all;
  const activeGatewayFactor = gatewayFactors[selectedGateway] || gatewayFactors.all;
  const combinedMultiplier = timeMultiplier * activeMethodFactor.share * activeGatewayFactor.share * envMultiplier;

  // ─── Filtered Venture Ledger Rows ───────────────────────────────────────────
  const computedVentures = useMemo(() => {
    return VENTURE_BASELINES.map(v => {
      const gross = Math.round(v.gross * combinedMultiplier);
      const fees = Math.round(v.fees * combinedMultiplier * 100) / 100;
      const vat = Math.round(v.vat * combinedMultiplier * 100) / 100;
      const refunds = Math.round(v.refunds * combinedMultiplier);
      const net = Math.round((gross - fees - vat - refunds) * 100) / 100;
      const txns = Math.max(1, Math.round(v.txns * combinedMultiplier));
      const sr = Math.min(99.9, Math.max(80.0, v.sr + activeMethodFactor.srDelta));

      return {
        ...v,
        gross,
        fees,
        vat,
        refunds,
        net,
        txns,
        sr,
        srColor: sr >= 94.0 ? '#2E6F5E' : sr >= 91.0 ? '#B8860B' : '#C0392B',
      };
    });
  }, [combinedMultiplier, activeMethodFactor]);

  // Selected Venture filtering for ledger table
  const filteredVentures = useMemo(() => {
    let list = computedVentures;
    if (activeVenture !== 'all') {
      list = list.filter(v => v.code === activeVenture);
    }
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [computedVentures, activeVenture, tableSearch, sortBy, sortOrder]);

  // Consolidated Aggregates
  const consolidated = useMemo(() => {
    const list = activeVenture === 'all'
      ? computedVentures
      : computedVentures.filter(v => v.code === activeVenture);

    const gross = list.reduce((sum, v) => sum + v.gross, 0);
    const fees = list.reduce((sum, v) => sum + v.fees, 0);
    const vat = list.reduce((sum, v) => sum + v.vat, 0);
    const refunds = list.reduce((sum, v) => sum + v.refunds, 0);
    const net = gross - fees - vat - refunds;
    const txns = list.reduce((sum, v) => sum + v.txns, 0);
    const weightedSr = txns > 0
      ? list.reduce((sum, v) => sum + (v.sr * v.txns), 0) / txns
      : 94.2;
    const unmatched = Math.round(list.reduce((sum, v) => sum + v.unmatched, 0) * combinedMultiplier);
    const pendingPayouts = Math.round(list.reduce((sum, v) => sum + v.pendingPayouts, 0) * combinedMultiplier);

    return {
      gross,
      fees,
      vat,
      refunds,
      net,
      txns,
      sr: Math.round(weightedSr * 10) / 10,
      unmatched,
      pendingPayouts,
    };
  }, [computedVentures, activeVenture, combinedMultiplier]);

  // ─── Status Breakdown Dynamically Computed ─────────────────────────────────
  const statusBreakdown = useMemo(() => {
    const totalTxns = consolidated.txns;
    const sr = consolidated.sr / 100;
    const paidCount = Math.round(totalTxns * sr);
    const failRate = 1 - sr;
    const failedCount = Math.round(totalTxns * (failRate * 0.58));
    const pendingCount = Math.round(totalTxns * (failRate * 0.25));
    const expiredCount = Math.round(totalTxns * (failRate * 0.11));
    const partRef = Math.max(1, Math.round(totalTxns * 0.002));
    const fullRef = Math.max(1, Math.round(totalTxns * 0.001));
    const needsRev = Math.max(1, Math.round(totalTxns * 0.001));

    const makePct = (cnt: number) => ((cnt / totalTxns) * 100).toFixed(1) + '%';

    return [
      { id: 'paid', label: 'Paid', count: paidCount.toLocaleString(), pct: makePct(paidCount), w: makePct(paidCount), color: '#2E6F5E' },
      { id: 'failed', label: 'Failed', count: failedCount.toLocaleString(), pct: makePct(failedCount), w: `${Math.max(4, Math.min(100, (failedCount / totalTxns) * 100 * 4))}%`, color: '#C0392B' },
      { id: 'pending', label: 'Pending', count: pendingCount.toLocaleString(), pct: makePct(pendingCount), w: `${Math.max(3, Math.min(100, (pendingCount / totalTxns) * 100 * 4))}%`, color: '#B8860B' },
      { id: 'expired', label: 'Expired', count: expiredCount.toLocaleString(), pct: makePct(expiredCount), w: `${Math.max(2, Math.min(100, (expiredCount / totalTxns) * 100 * 4))}%`, color: '#8A94A6' },
      { id: 'partially_refunded', label: 'Partially refunded', count: partRef.toLocaleString(), pct: makePct(partRef), w: '1.2%', color: '#2C5F9E' },
      { id: 'refunded', label: 'Refunded', count: fullRef.toLocaleString(), pct: makePct(fullRef), w: '0.8%', color: '#2C5F9E' },
      { id: 'needs_review', label: 'Needs review', count: needsRev.toLocaleString(), pct: makePct(needsRev), w: '0.8%', color: '#7A4CA0' },
    ];
  }, [consolidated.txns, consolidated.sr]);

  // ─── Dynamic Bar Chart Points ──────────────────────────────────────────────
  const chartBars = useMemo(() => {
    // Determine number of bars
    const count = timeRange === '7d' ? 7 : timeRange === 'QTD' ? 12 : Math.min(30, daysCount);
    const sourcePoints = BASE_DAILY_POINTS.slice(BASE_DAILY_POINTS.length - count);

    const maxBarVolume = Math.max(...sourcePoints.map(p => p.baseAmount * combinedMultiplier));

    return sourcePoints.map((p, idx) => {
      const vol = p.baseAmount * combinedMultiplier;
      const sr = Math.min(0.99, Math.max(0.80, (consolidated.sr / 100) + (p.paidRatio - 0.93)));
      const paidVol = vol * sr;
      const failVol = vol * (1 - sr);

      // Pixel heights (max container height ~140px)
      const totalBarPx = Math.max(16, Math.min(136, Math.round((vol / (maxBarVolume || 1)) * 136)));
      const paidPx = Math.max(8, Math.round(totalBarPx * sr));
      const failPx = Math.max(2, Math.round(totalBarPx * (1 - sr)));

      const dayLabel = timeRange === '7d'
        ? ['8 Sep', '9 Sep', '10 Sep', '11 Sep', '12 Sep', '13 Sep', '14 Sep'][idx] || p.day
        : timeRange === 'QTD'
        ? `W${26 + idx}`
        : p.day;

      return {
        label: dayLabel,
        paidPx,
        failPx,
        paidVol: Math.round(paidVol),
        failVol: Math.round(failVol),
        totalVol: Math.round(vol),
        sr: Math.round(sr * 1000) / 10,
      };
    });
  }, [timeRange, daysCount, combinedMultiplier, consolidated.sr]);

  // ─── Export CSV Handler ────────────────────────────────────────────────────
  const handleExportCsv = () => {
    const rows = [
      ['BLDR Central Payment Hub - Executive Financial Overview'],
      ['Exported At', new Date().toISOString()],
      ['Time Range', timeRange, dateSpanLabel],
      ['Venture', activeVenture === 'all' ? 'All Ventures (Consolidated)' : activeVenture],
      ['Payment Method', activeMethodFactor.label],
      ['Gateway', activeGatewayFactor.label],
      ['Environment', env],
      [],
      ['KPI SUMMARY METRICS'],
      ['Gross Collection (EGP)', consolidated.gross.toFixed(2)],
      ['PSP Fees (EGP)', consolidated.fees.toFixed(2)],
      ['VAT (EGP)', consolidated.vat.toFixed(2)],
      ['Refunds (EGP)', consolidated.refunds.toFixed(2)],
      ['Net Revenue (EGP)', consolidated.net.toFixed(2)],
      ['Transactions Count', consolidated.txns],
      ['Success Rate', `${consolidated.sr.toFixed(1)}%`],
      ['Unmatched Settlement (EGP)', consolidated.unmatched.toFixed(2)],
      ['Pending Disbursements (EGP)', consolidated.pendingPayouts.toFixed(2)],
      [],
      ['VENTURE LEDGER BREAKDOWN'],
      ['Venture Code', 'Venture Name', 'Gross (EGP)', 'PSP Fees (EGP)', 'VAT (EGP)', 'Refunds (EGP)', 'Net Revenue (EGP)', 'Txns', 'Success Rate'],
      ...filteredVentures.map(v => [
        v.code,
        `"${v.name}"`,
        v.gross.toFixed(2),
        v.fees.toFixed(2),
        v.vat.toFixed(2),
        v.refunds.toFixed(2),
        v.net.toFixed(2),
        v.txns,
        `${v.sr.toFixed(1)}%`,
      ]),
      [
        'CONSOLIDATED',
        'Consolidated Total',
        consolidated.gross.toFixed(2),
        consolidated.fees.toFixed(2),
        consolidated.vat.toFixed(2),
        consolidated.refunds.toFixed(2),
        consolidated.net.toFixed(2),
        consolidated.txns,
        `${consolidated.sr.toFixed(1)}%`,
      ],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BLDR_Overview_${activeVenture}_${timeRange}_${env}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if any filter is non-default
  const hasActiveFilters = activeVenture !== 'all' || timeRange !== '30d' || selectedMethod !== 'all' || selectedGateway !== 'all' || selectedStatus !== 'all' || env !== 'Production';

  const resetAllFilters = () => {
    setActiveVenture('all');
    setTimeRange('30d');
    setSelectedMethod('all');
    setSelectedGateway('all');
    setSelectedStatus('all');
    setShowCustomPicker(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FA', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* ─── Standardized Sidebar ───────────────────────────── */}
      <HubSidebar active="Overview" />

      {/* ─── Main Content Canvas ────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <HubTopBar
          title="Executive Overview"
          activeVenture={activeVenture}
          onVentureChange={setActiveVenture}
          env={env}
          onEnvChange={setEnv}
        />

        {/* Sandbox Notice Banner when Sandbox is active */}
        {env === 'Sandbox' && (
          <div
            style={{
              background: '#FFF8E6',
              borderBottom: '1px solid #FFE4A0',
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#8A5D00',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#B8860B', color: '#FFF', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>SANDBOX TEST MODE</span>
              <span>Showing test simulation data across sandbox gateway endpoints. No real funds or settlements are impacted.</span>
            </div>
            <button
              type="button"
              onClick={() => setEnv('Production')}
              style={{
                background: '#FFFFFF',
                border: '1px solid #D4A320',
                borderRadius: 5,
                padding: '3px 9px',
                fontSize: 11,
                fontWeight: 700,
                color: '#8A5D00',
                cursor: 'pointer',
              }}
            >
              Switch to Production
            </button>
          </div>
        )}

        <main style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* ─── Enterprise Analytical Filter Toolbar ───────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #E3E8EF',
              borderRadius: 10,
              padding: '12px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Time Range Selector */}
              <div style={{ display: 'flex', padding: 3, background: '#E7EBF1', borderRadius: 8, gap: 2 }}>
                {(['7d', '30d', 'QTD', 'Custom'] as const).map(t => {
                  const isActive = timeRange === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTimeRange(t);
                        if (t === 'Custom') setShowCustomPicker(true);
                        else setShowCustomPicker(false);
                      }}
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        background: isActive ? '#FFFFFF' : 'transparent',
                        color: isActive ? '#1B2A4A' : '#8A94A6',
                        boxShadow: isActive ? '0 1px 2px rgba(27,42,74,0.10)' : 'none',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Date Span Label with Click-to-Edit */}
              <button
                type="button"
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                title="Click to adjust custom date range"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: showCustomPicker ? '#E8EEF7' : 'transparent',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  color: showCustomPicker ? '#2C5F9E' : '#6B7A90',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="3" width="12" height="11" rx="2" />
                  <path d="M2 7h12M5 1.5v3M11 1.5v3" />
                </svg>
                <span>{dateSpanLabel}</span>
              </button>

              <div style={{ flex: 1 }} />

              {/* Venture Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowVentureDropdown(!showVentureDropdown);
                    setShowMethodDropdown(false);
                    setShowGatewayDropdown(false);
                    setShowStatusDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    height: 32,
                    padding: '0 11px',
                    border: '1px solid #E3E8EF',
                    borderRadius: 7,
                    background: activeVenture !== 'all' ? '#F0F6F4' : '#FFFFFF',
                    borderColor: activeVenture !== 'all' ? '#A3CFBE' : '#E3E8EF',
                    cursor: 'pointer',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: activeVenture !== 'all' ? '#2E6F5E' : '#5A6A80',
                  }}
                >
                  <span style={{ color: '#8A94A6' }}>Venture:</span>
                  <span style={{ fontWeight: 700 }}>
                    {activeVenture === 'all'
                      ? 'All'
                      : VENTURE_BASELINES.find(v => v.code === activeVenture)?.name || activeVenture}
                  </span>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2.2 4l2.8 2.8L7.8 4" />
                  </svg>
                </button>

                {showVentureDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 36,
                      background: '#FFFFFF',
                      border: '1px solid #D3DAE4',
                      borderRadius: 8,
                      boxShadow: '0 10px 24px rgba(18,32,60,0.12)',
                      width: 220,
                      zIndex: 60,
                      padding: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Filter by Venture
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVenture('all');
                        setShowVentureDropdown(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        background: activeVenture === 'all' ? '#F5F7FA' : 'transparent',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#1B2A4A',
                      }}
                    >
                      <span>All ventures (Consolidated)</span>
                      {activeVenture === 'all' && <span style={{ color: '#2E6F5E', fontWeight: 800 }}>✓</span>}
                    </button>
                    {VENTURE_BASELINES.map(v => (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => {
                          setActiveVenture(v.code);
                          setShowVentureDropdown(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '7px 10px',
                          background: activeVenture === v.code ? '#F5F7FA' : 'transparent',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#1B2A4A',
                        }}
                      >
                        <span style={{ width: 20, height: 20, borderRadius: 4, background: v.chipBg, color: v.chipFg, fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {v.code}
                        </span>
                        <span style={{ flex: 1 }}>{v.name}</span>
                        {activeVenture === v.code && <span style={{ color: '#2E6F5E', fontWeight: 800 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowMethodDropdown(!showMethodDropdown);
                    setShowVentureDropdown(false);
                    setShowGatewayDropdown(false);
                    setShowStatusDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    height: 32,
                    padding: '0 11px',
                    border: '1px solid #E3E8EF',
                    borderRadius: 7,
                    background: selectedMethod !== 'all' ? '#F0F6F4' : '#FFFFFF',
                    borderColor: selectedMethod !== 'all' ? '#A3CFBE' : '#E3E8EF',
                    cursor: 'pointer',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: selectedMethod !== 'all' ? '#2E6F5E' : '#5A6A80',
                  }}
                >
                  <span style={{ color: '#8A94A6' }}>Method:</span>
                  <span style={{ fontWeight: 700 }}>{activeMethodFactor.label}</span>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2.2 4l2.8 2.8L7.8 4" />
                  </svg>
                </button>

                {showMethodDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 36,
                      background: '#FFFFFF',
                      border: '1px solid #D3DAE4',
                      borderRadius: 8,
                      boxShadow: '0 10px 24px rgba(18,32,60,0.12)',
                      width: 220,
                      zIndex: 60,
                      padding: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Filter by Payment Method
                    </div>
                    {Object.entries(methodFactors).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedMethod(key);
                          setShowMethodDropdown(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          background: selectedMethod === key ? '#F5F7FA' : 'transparent',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#1B2A4A',
                        }}
                      >
                        <span>{item.label}</span>
                        {selectedMethod === key && <span style={{ color: '#2E6F5E', fontWeight: 800 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Gateway / PSP Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowGatewayDropdown(!showGatewayDropdown);
                    setShowVentureDropdown(false);
                    setShowMethodDropdown(false);
                    setShowStatusDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    height: 32,
                    padding: '0 11px',
                    border: '1px solid #E3E8EF',
                    borderRadius: 7,
                    background: selectedGateway !== 'all' ? '#F0F6F4' : '#FFFFFF',
                    borderColor: selectedGateway !== 'all' ? '#A3CFBE' : '#E3E8EF',
                    cursor: 'pointer',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: selectedGateway !== 'all' ? '#2E6F5E' : '#5A6A80',
                  }}
                >
                  <span style={{ color: '#8A94A6' }}>PSP:</span>
                  <span style={{ fontWeight: 700 }}>{activeGatewayFactor.label}</span>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2.2 4l2.8 2.8L7.8 4" />
                  </svg>
                </button>

                {showGatewayDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 36,
                      background: '#FFFFFF',
                      border: '1px solid #D3DAE4',
                      borderRadius: 8,
                      boxShadow: '0 10px 24px rgba(18,32,60,0.12)',
                      width: 200,
                      zIndex: 60,
                      padding: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Filter by Provider / PSP
                    </div>
                    {Object.entries(gatewayFactors).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedGateway(key);
                          setShowGatewayDropdown(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          background: selectedGateway === key ? '#F5F7FA' : 'transparent',
                          borderRadius: 6,
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#1B2A4A',
                        }}
                      >
                        <span>{item.label}</span>
                        {selectedGateway === key && <span style={{ color: '#2E6F5E', fontWeight: 800 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export CSV Button (Real Functional Download) */}
              <button
                type="button"
                onClick={handleExportCsv}
                title="Download CSV report of current filtered view"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  height: 32,
                  padding: '0 12px',
                  border: '1px solid #E3E8EF',
                  borderRadius: 7,
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s ease',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#5A6A80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2.6v7.6M5 7.4L8 10.4l3-3M3 12.6h10" />
                </svg>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1B2A4A' }}>
                  Export CSV
                </span>
              </button>
            </div>

            {/* Custom Date Range Popover Strip */}
            {showCustomPicker && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: '#F9FAFC',
                  borderRadius: 7,
                  border: '1px solid #E3E8EF',
                  fontSize: 12,
                }}
              >
                <span style={{ fontWeight: 700, color: '#1B2A4A' }}>Custom Date Range:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label htmlFor="custom-from" style={{ color: '#8A94A6', fontWeight: 600 }}>From:</label>
                  <input
                    id="custom-from"
                    type="date"
                    value={customStart}
                    onChange={e => {
                      setCustomStart(e.target.value);
                      setTimeRange('Custom');
                    }}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11.5,
                      padding: '4px 8px',
                      border: '1px solid #D3DAE4',
                      borderRadius: 6,
                      background: '#FFFFFF',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label htmlFor="custom-to" style={{ color: '#8A94A6', fontWeight: 600 }}>To:</label>
                  <input
                    id="custom-to"
                    type="date"
                    value={customEnd}
                    onChange={e => {
                      setCustomEnd(e.target.value);
                      setTimeRange('Custom');
                    }}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11.5,
                      padding: '4px 8px',
                      border: '1px solid #D3DAE4',
                      borderRadius: 6,
                      background: '#FFFFFF',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }} />
                <button
                  type="button"
                  onClick={() => setShowCustomPicker(false)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 5,
                    border: 'none',
                    background: '#2E6F5E',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Apply Range
                </button>
              </div>
            )}

            {/* Active Filter Chips Bar (appears when non-default filters are active) */}
            {hasActiveFilters && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid #F0F3F7' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Active Filters:
                </span>

                {activeVenture !== 'all' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: '#E6EFEB',
                      color: '#2E6F5E',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Venture: {VENTURE_BASELINES.find(v => v.code === activeVenture)?.name}
                    <button
                      type="button"
                      onClick={() => setActiveVenture('all')}
                      style={{ border: 'none', background: 'transparent', color: '#2E6F5E', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                )}

                {timeRange !== '30d' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: '#E8EEF7',
                      color: '#2C5F9E',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Range: {timeRange}
                    <button
                      type="button"
                      onClick={() => setTimeRange('30d')}
                      style={{ border: 'none', background: 'transparent', color: '#2C5F9E', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedMethod !== 'all' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: '#F0EAF7',
                      color: '#7A4CA0',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Method: {activeMethodFactor.label}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('all')}
                      style={{ border: 'none', background: 'transparent', color: '#7A4CA0', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedGateway !== 'all' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: '#FBF3E0',
                      color: '#B8860B',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    PSP: {activeGatewayFactor.label}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('all')}
                      style={{ border: 'none', background: 'transparent', color: '#B8860B', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedStatus !== 'all' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: '#FEECEB',
                      color: '#C0392B',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Status: {selectedStatus}
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('all')}
                      style={{ border: 'none', background: 'transparent', color: '#C0392B', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                )}

                <div style={{ flex: 1 }} />

                <button
                  type="button"
                  onClick={resetAllFilters}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#C0392B',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* ─── Standard Financial & Treasury KPI Cards (Dynamically Responsive) ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
            {[
              {
                label: 'Gross collection',
                value: `EGP ${consolidated.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                delta: timeRange === '7d' ? '+14.2% vs prev 7d' : '+12.4% vs prev 30d',
                deltaColor: '#2E6F5E',
              },
              {
                label: 'Net revenue',
                value: `EGP ${consolidated.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                delta: '+11.8% vs prev period',
                deltaColor: '#2E6F5E',
              },
              {
                label: 'Transactions',
                value: consolidated.txns.toLocaleString('en-US'),
                delta: `+${Math.round(consolidated.txns * 0.08)} vs prev`,
                deltaColor: '#2E6F5E',
              },
              {
                label: 'Success rate',
                value: `${consolidated.sr.toFixed(1)}%`,
                delta: consolidated.sr >= 94.0 ? '+0.4pp vs benchmark' : '−0.6pp vs prev 30d',
                deltaColor: consolidated.sr >= 94.0 ? '#2E6F5E' : '#C0392B',
              },
              {
                label: 'Unmatched',
                value: `EGP ${consolidated.unmatched.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                delta: `${Math.max(1, Math.round(consolidated.unmatched / 4500))} items need review`,
                deltaColor: '#B8860B',
                href: '/reconciliation?status=unmatched',
              },
              {
                label: 'Pending Payouts',
                value: `EGP ${consolidated.pendingPayouts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                delta: `${Math.max(1, Math.round(consolidated.pendingPayouts / 37000))} pending runs`,
                deltaColor: '#B8860B',
                href: '/payouts',
              },
            ].map(k => {
              const card = (
                <div
                  key={k.label}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3E8EF',
                    borderRadius: 10,
                    padding: '14px 15px 15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    cursor: k.href ? 'pointer' : 'default',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A94A6' }}>
                    {k.label}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18.5, fontWeight: 600, color: '#12203C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {k.value}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: k.deltaColor }}>
                    {k.delta}
                  </span>
                </div>
              );

              return k.href ? (
                <Link key={k.label} href={k.href} style={{ textDecoration: 'none' }}>
                  {card}
                </Link>
              ) : (
                <React.Fragment key={k.label}>{card}</React.Fragment>
              );
            })}
          </div>

          {/* ─── Quick Operations & Portals Shortcut Strip ─────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', padding: '2px 0' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              Quick Portals:
            </span>
            {[
              { label: 'Payment Pages Builder', href: '/payment-pages', icon: '◈' },
              { label: 'Payout Settlements', href: '/payouts', icon: '⊛' },
              { label: 'Student Tracking CRM', href: '/students', icon: '◎' },
              { label: 'Payment Rails Matrix', href: '/payment-methods', icon: '⊞' },
              { label: 'Gateways Sync', href: '/apis', icon: '☍' },
            ].map(qa => (
              <Link
                key={qa.label}
                href={qa.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: '#FFFFFF',
                  border: '1px solid #E3E8EF',
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#1B2A4A',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <span style={{ color: '#2E6F5E', fontWeight: 800 }}>{qa.icon}</span>
                <span>{qa.label}</span>
                <span style={{ color: '#8A94A6', fontSize: 10 }}>→</span>
              </Link>
            ))}
          </div>

          {/* ─── Daily Stacked Collection Chart & Status Progress ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 372px', gap: 16 }}>
            {/* Left: Gross Collection Daily Stacked Bar Chart */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 18px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                  Gross collection
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#8A94A6' }}>
                  {timeRange === '7d' ? 'daily (last 7 days)' : timeRange === 'QTD' ? 'weekly (quarter-to-date)' : 'daily, ' + (activeVenture === 'all' ? 'all ventures' : activeVenture)}
                </span>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: '#2E6F5E' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#5A6A80' }}>Paid</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: '#E0E5EC' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#5A6A80' }}>Failed / expired</span>
                </div>
              </div>

              {/* Stacked Bars Container with Interactive Tooltips */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 168, borderBottom: '1px solid #E3E8EF', paddingBottom: 0 }}>
                  {chartBars.map((b, idx) => {
                    const isHovered = hoveredBarIndex === idx;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          gap: 2,
                          height: '100%',
                          cursor: 'pointer',
                          opacity: hoveredBarIndex !== null && !isHovered ? 0.6 : 1.0,
                          transition: 'opacity 0.15s ease',
                        }}
                      >
                        <div
                          style={{
                            height: `${b.failPx}px`,
                            background: isHovered ? '#C0392B' : '#E0E5EC',
                            borderRadius: '2px 2px 0 0',
                            transition: 'background 0.15s ease',
                          }}
                        />
                        <div
                          style={{
                            height: `${b.paidPx}px`,
                            background: isHovered ? '#1E5244' : '#2E6F5E',
                            borderRadius: '0 0 2px 2px',
                            transition: 'background 0.15s ease',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Floating tooltip when a bar is hovered */}
                {hoveredBarIndex !== null && chartBars[hoveredBarIndex] && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#12203C',
                      color: '#FFFFFF',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{chartBars[hoveredBarIndex].label}</span>
                    <span style={{ color: '#74D4BA' }}>
                      Paid: EGP {chartBars[hoveredBarIndex].paidVol.toLocaleString()}
                    </span>
                    <span style={{ color: '#FFA8A0' }}>
                      Failed: EGP {chartBars[hoveredBarIndex].failVol.toLocaleString()}
                    </span>
                    <span style={{ color: '#CAD5E2', fontFamily: "'IBM Plex Mono', monospace" }}>
                      Success: {chartBars[hoveredBarIndex].sr}%
                    </span>
                  </div>
                )}
              </div>

              {/* Time axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8A94A6' }}>
                  {chartBars[0]?.label || 'Start'}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8A94A6' }}>
                  {chartBars[Math.floor(chartBars.length / 2)]?.label || 'Mid'}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8A94A6' }}>
                  {chartBars[chartBars.length - 1]?.label || 'End'}
                </span>
              </div>
            </div>

            {/* Right: Transactions by Status (Interactive Filtering on Click) */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                  Transactions by status
                </span>
                {selectedStatus !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('all')}
                    style={{ fontSize: 10.5, color: '#C0392B', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Clear status filter
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {statusBreakdown.map(s => {
                  const isSelected = selectedStatus === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStatus(isSelected ? 'all' : s.id)}
                      title={`Click to filter by ${s.label}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: 6,
                        background: isSelected ? '#F0F3F7' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flex: 'none' }} />
                        <span style={{ fontSize: 11.5, fontWeight: isSelected ? 800 : 600, color: '#1B2A4A', flex: 1 }}>
                          {s.label}
                        </span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 600, color: '#12203C' }}>
                          {s.count}
                        </span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#8A94A6', width: 42, textAlign: 'right' }}>
                          {s.pct}
                        </span>
                      </div>
                      <div style={{ height: 4, background: '#EEF1F5', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: s.w, height: '100%', background: s.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Net Revenue by Venture Ledger Table ─────────────── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #E3E8EF', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em', marginRight: 8 }}>
                  Net revenue by venture
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#8A94A6' }}>
                  gross − PSP fees − VAT − refunds
                </span>
              </div>

              <div style={{ flex: 1 }} />

              {/* Table search filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F7FA', border: '1px solid #E3E8EF', borderRadius: 6, padding: '3px 8px' }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#8A94A6" strokeWidth="1.8">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter ventures..."
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: 11,
                    outline: 'none',
                    width: 110,
                  }}
                />
                {tableSearch && (
                  <button
                    type="button"
                    onClick={() => setTableSearch('')}
                    style={{ border: 'none', background: 'transparent', color: '#8A94A6', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                )}
              </div>

              <Link href="/ventures" style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', textDecoration: 'none' }}>
                All Ventures ({VENTURE_BASELINES.length}) →
              </Link>
            </div>

            {/* Table Header Row with Interactive Column Sorting */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px repeat(5, minmax(0, 1fr)) 92px 96px',
                padding: '0 18px',
                height: 34,
                alignItems: 'center',
                background: '#FAFBFD',
                borderBottom: '1px solid #E3E8EF',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Venture
              </span>

              <button
                type="button"
                onClick={() => {
                  if (sortBy === 'gross') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('gross'); setSortOrder('desc'); }
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'right' }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: sortBy === 'gross' ? '#1B2A4A' : '#8A94A6' }}>
                  Gross {sortBy === 'gross' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </span>
              </button>

              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>
                PSP fees
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>
                VAT
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>
                Refunds
              </span>

              <button
                type="button"
                onClick={() => {
                  if (sortBy === 'net') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('net'); setSortOrder('desc'); }
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'right' }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: sortBy === 'net' ? '#1B2A4A' : '#8A94A6' }}>
                  Net revenue {sortBy === 'net' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (sortBy === 'txns') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('txns'); setSortOrder('desc'); }
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'right' }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: sortBy === 'txns' ? '#1B2A4A' : '#8A94A6' }}>
                  Txns {sortBy === 'txns' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (sortBy === 'sr') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  else { setSortBy('sr'); setSortOrder('desc'); }
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'right' }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: sortBy === 'sr' ? '#1B2A4A' : '#8A94A6' }}>
                  Success {sortBy === 'sr' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </span>
              </button>
            </div>

            {/* Venture Rows */}
            {filteredVentures.map(v => (
              <div
                key={v.code}
                onClick={() => setActiveVenture(activeVenture === v.code ? 'all' : v.code)}
                title={`Click to toggle view filter for ${v.name}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px repeat(5, minmax(0, 1fr)) 92px 96px',
                  padding: '0 18px',
                  height: 46,
                  alignItems: 'center',
                  borderBottom: '1px solid #F0F3F7',
                  cursor: 'pointer',
                  background: activeVenture === v.code ? '#F6FAF8' : 'transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: v.chipBg,
                      color: v.chipFg,
                      fontSize: 9.5,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {v.code}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', letterSpacing: '-0.01em' }}>
                      {v.name}
                    </span>
                    {activeVenture === v.code && (
                      <span style={{ fontSize: 9.5, color: '#2E6F5E', fontWeight: 700 }}>Active Filter</span>
                    )}
                  </div>
                </div>

                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#12203C', textAlign: 'right' }}>
                  {v.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#5A6A80', textAlign: 'right' }}>
                  {v.fees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#5A6A80', textAlign: 'right' }}>
                  {v.vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#5A6A80', textAlign: 'right' }}>
                  {v.refunds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 600, color: '#12203C', textAlign: 'right' }}>
                  {v.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#5A6A80', textAlign: 'right' }}>
                  {v.txns.toLocaleString('en-US')}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: v.srColor, textAlign: 'right' }}>
                  {v.sr.toFixed(1)}%
                </span>
              </div>
            ))}

            {/* Special Single-Venture Payment Rails Breakdown (Appears when 1 venture is selected) */}
            {activeVenture !== 'all' && computedVentures.find(v => v.code === activeVenture) && (
              <div style={{ background: '#F8FAF9', padding: '12px 18px', borderBottom: '1px solid #E3E8EF' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Rails Breakdown for {computedVentures.find(v => v.code === activeVenture)?.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {computedVentures.find(v => v.code === activeVenture)?.rails.map(r => {
                    const railVol = (computedVentures.find(v => v.code === activeVenture)?.gross || 0) * r.share;
                    return (
                      <div key={r.code} style={{ background: '#FFFFFF', border: '1px solid #D6E4DE', borderRadius: 6, padding: '8px 10px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1B2A4A' }}>{r.name}</div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, color: '#2E6F5E', margin: '4px 0' }}>
                          EGP {Math.round(railVol).toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8A94A6' }}>
                          <span>Share: {Math.round(r.share * 100)}%</span>
                          <span>Success: {r.sr}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Consolidated Summary Row (Always dynamically calculated to match filtered view) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px repeat(5, minmax(0, 1fr)) 92px 96px',
                padding: '0 18px',
                height: 46,
                alignItems: 'center',
                background: '#FAFBFD',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.01em' }}>
                {activeVenture === 'all' ? 'Consolidated Total' : `Filtered Total (${activeVenture})`}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#12203C', textAlign: 'right' }}>
                {consolidated.gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#5A6A80', textAlign: 'right' }}>
                {consolidated.fees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#5A6A80', textAlign: 'right' }}>
                {consolidated.vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#5A6A80', textAlign: 'right' }}>
                {consolidated.refunds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, color: '#12203C', textAlign: 'right' }}>
                {consolidated.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#5A6A80', textAlign: 'right' }}>
                {consolidated.txns.toLocaleString('en-US')}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600, color: '#2E6F5E', textAlign: 'right' }}>
                {consolidated.sr.toFixed(1)}%
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
