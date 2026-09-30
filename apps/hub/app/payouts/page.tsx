'use client';

import React, { useState, useEffect, useMemo } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { resolveVentureObj, matchVenture, VENTURES } from '../../components/HubTopBar';

interface PayoutRecord {
  id: string;
  venture: string;
  amount: number;
  status: 'Settled' | 'Pending';
  method: string;
  date: string;
  ref: string;
  bankName: string;
  iban: string;
  grossAmount: number;
  platformFee: number;
}

const INITIAL_PAYOUTS: PayoutRecord[] = [
  // bldr (Storefront Pilot)
  { id: 'PAY-EG-0442', venture: 'bldr (Storefront Pilot)', amount: 145000, status: 'Settled', method: 'Bank Transfer (CIB)', date: '2026-09-18', ref: 'CIB-ACH-44220', bankName: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0023 4455 6677 8899 99', grossAmount: 161111, platformFee: 16111 },
  { id: 'PAY-EG-0437', venture: 'bldr (Storefront Pilot)', amount: 52000, status: 'Pending', method: 'Bank Transfer (CIB)', date: '2026-09-30', ref: 'Awaiting Initiation', bankName: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0023 4455 6677 8899 99', grossAmount: 57777, platformFee: 5777 },

  // StudyHub
  { id: 'PAY-EG-0441', venture: 'StudyHub', amount: 93600, status: 'Settled', method: 'Bank Transfer (CIB)', date: '2026-09-15', ref: 'CIB-ACH-44219', bankName: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0023 4455 6677 8899 01', grossAmount: 104000, platformFee: 10400 },
  { id: 'PAY-EG-0436', venture: 'StudyHub', amount: 48000, status: 'Pending', method: 'Bank Transfer (CIB)', date: '2026-09-30', ref: 'Awaiting Initiation', bankName: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0023 4455 6677 8899 01', grossAmount: 53333, platformFee: 5333 },

  // Apex Classes
  { id: 'PAY-EG-0440', venture: 'Apex Classes', amount: 133500, status: 'Settled', method: 'Bank Transfer (QNB)', date: '2026-09-15', ref: 'QNB-EG-44218', bankName: 'QNB Alahli Egypt', iban: 'EG12 0037 0019 8877 6655 4433 22', grossAmount: 148333, platformFee: 14833 },
  { id: 'PAY-EG-0435', venture: 'Apex Classes', amount: 28000, status: 'Pending', method: 'Bank Transfer (CIB)', date: '2026-09-30', ref: 'Awaiting Initiation', bankName: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0099 1122 3344 5566 77', grossAmount: 31111, platformFee: 3111 },

  // EL HESA
  { id: 'PAY-EG-0439', venture: 'EL HESA', amount: 60900, status: 'Settled', method: 'Bank Transfer (Banque Misr)', date: '2026-09-01', ref: 'BMR-ACH-43991', bankName: 'Banque Misr', iban: 'EG55 0002 0011 2233 4455 6677 88', grossAmount: 67666, platformFee: 6766 },
  { id: 'PAY-EG-0434', venture: 'EL HESA', amount: 14000, status: 'Pending', method: 'Bank Transfer (Banque Misr)', date: '2026-09-30', ref: 'Awaiting Initiation', bankName: 'Banque Misr', iban: 'EG55 0002 0011 2233 4455 6677 88', grossAmount: 15555, platformFee: 1555 },

  // Career Hub
  { id: 'PAY-EG-0438', venture: 'Career Hub', amount: 59550, status: 'Settled', method: 'InstaPay Corporate', date: '2026-09-01', ref: 'IP-CORP-43990', bankName: 'National Bank of Egypt (NBE)', iban: 'EG09 0001 0044 5566 7788 9900 11', grossAmount: 66166, platformFee: 6616 },
  { id: 'PAY-EG-0433', venture: 'Career Hub', amount: 18500, status: 'Pending', method: 'InstaPay Corporate', date: '2026-09-30', ref: 'Awaiting Initiation', bankName: 'National Bank of Egypt (NBE)', iban: 'EG09 0001 0044 5566 7788 9900 11', grossAmount: 20555, platformFee: 2055 },
];

const BASE_MONTHLY = [
  { month: 'Apr', settled: 280000, pending: 40000 },
  { month: 'May', settled: 360000, pending: 50000 },
  { month: 'Jun', settled: 420000, pending: 67000 },
  { month: 'Jul', settled: 480000, pending: 44000 },
  { month: 'Aug', settled: 540000, pending: 72000 },
  { month: 'Sep', settled: 492550, pending: 160500 },
];

const PROVIDER_BANKS: Record<string, { bank: string; iban: string; pendingBalance: number }> = {
  'bldr (Storefront Pilot)': { bank: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0023 4455 6677 8899 99', pendingBalance: 52000 },
  'StudyHub': { bank: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0023 4455 6677 8899 01', pendingBalance: 48000 },
  'Apex Classes': { bank: 'Commercial International Bank (CIB)', iban: 'EG38 0010 0099 1122 3344 5566 77', pendingBalance: 28000 },
  'EL HESA': { bank: 'Banque Misr', iban: 'EG55 0002 0011 2233 4455 6677 88', pendingBalance: 14000 },
  'Career Hub': { bank: 'National Bank of Egypt (NBE)', iban: 'EG09 0001 0044 5566 7788 9900 11', pendingBalance: 18500 },
};

function StatusBadge({ s }: { s: string }) {
  return <span className={`hub-badge ${s === 'Settled' ? 'success' : 'warning'}`}>{s}</span>;
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [filter, setFilter] = useState('All');
  const [activeVenture, setActiveVenture] = useState<string>('all');
  
  // Modal States
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [receiptPayout, setReceiptPayout] = useState<PayoutRecord | null>(null);
  const [successToast, setSuccessToast] = useState('');

  // Form State for Initiating Payout
  const [modalVenture, setModalVenture] = useState('bldr (Storefront Pilot)');
  const [payoutAmount, setPayoutAmount] = useState('52000');
  const [payoutMethod, setPayoutMethod] = useState('Egyptian Bank Transfer (ACH / CIB)');
  const [transferNotes, setTransferNotes] = useState('September 2026 Student Cohort Net Settlement');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with localStorage & cross-component changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_active_venture');
      if (stored) setActiveVenture(stored);
    } catch (e) {}

    const handleVentureChanged = (e: any) => {
      if (e?.detail) setActiveVenture(e.detail);
    };
    window.addEventListener('bldr:venture-changed', handleVentureChanged);
    return () => window.removeEventListener('bldr:venture-changed', handleVentureChanged);
  }, []);

  const handleVentureChange = (v: string) => {
    setActiveVenture(v);
    try {
      localStorage.setItem('bldr_active_venture', v);
      window.dispatchEvent(new CustomEvent('bldr:venture-changed', { detail: v }));
    } catch (e) {}
  };

  const handleOpenInitiateModal = (initialV?: string) => {
    let target = initialV;
    if (!target) {
      const resolved = resolveVentureObj(activeVenture);
      target = resolved.slug === 'all' ? 'bldr (Storefront Pilot)' : resolved.name;
    }
    const cleanVenture = Object.keys(PROVIDER_BANKS).find(k => matchVenture(k, target)) || 'bldr (Storefront Pilot)';
    setModalVenture(cleanVenture);
    setPayoutAmount((PROVIDER_BANKS[cleanVenture]?.pendingBalance || 25000).toString());
    setShowInitiateModal(true);
  };

  const handleModalVentureChange = (v: string) => {
    setModalVenture(v);
    const balance = PROVIDER_BANKS[v]?.pendingBalance || 25000;
    setPayoutAmount(balance.toString());
  };

  const handlePayNowRow = (p: PayoutRecord) => {
    setModalVenture(p.venture);
    setPayoutAmount(p.amount.toString());
    setShowInitiateModal(true);
  };

  // Filter payouts by active venture & status
  const venturePayouts = useMemo(() => {
    return payouts.filter(p => matchVenture(p.venture, activeVenture));
  }, [payouts, activeVenture]);

  const filtered = useMemo(() => {
    return venturePayouts.filter(p => filter === 'All' || p.status === filter);
  }, [venturePayouts, filter]);

  const totalSettled = useMemo(() => {
    return venturePayouts.filter(p => p.status === 'Settled').reduce((s, p) => s + p.amount, 0);
  }, [venturePayouts]);

  const totalPending = useMemo(() => {
    return venturePayouts.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  }, [venturePayouts]);

  // Scaled monthly trends for selected brand
  const monthlyData = useMemo(() => {
    const isAll = !activeVenture || activeVenture === 'all' || activeVenture === 'All' || activeVenture === 'All ventures';
    if (isAll) return BASE_MONTHLY;
    const baseTotal = 492550 + 160500;
    const currentTotal = totalSettled + totalPending;
    const ratio = Math.max(0.12, Math.min(1.0, currentTotal / (baseTotal || 1)));
    return BASE_MONTHLY.map(m => ({
      month: m.month,
      settled: Math.round(m.settled * ratio),
      pending: Math.round(m.pending * ratio),
    }));
  }, [activeVenture, totalSettled, totalPending]);

  const maxMonthlyVal = useMemo(() => {
    return Math.max(...monthlyData.map(d => d.settled + d.pending), 1000);
  }, [monthlyData]);

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const amountNum = parseFloat(payoutAmount) || 0;
      const gross = Math.round(amountNum / 0.9);
      const fee = gross - amountNum;
      const bankInfo = PROVIDER_BANKS[modalVenture] || { bank: 'Commercial International Bank (CIB)', iban: 'EG38 0010 ...' };
      const newRef = `ACH-EG-${Math.floor(100000 + Math.random() * 900000)}`;

      const newRecord: PayoutRecord = {
        id: `PAY-EG-04${Math.floor(45 + payouts.length)}`,
        venture: modalVenture,
        amount: amountNum,
        status: 'Settled',
        method: payoutMethod,
        date: new Date().toISOString().split('T')[0],
        ref: newRef,
        bankName: bankInfo.bank,
        iban: bankInfo.iban,
        grossAmount: gross,
        platformFee: fee,
      };

      // Update existing pending record if matching, otherwise prepend
      const existingPendingIdx = payouts.findIndex(p => p.venture === modalVenture && p.status === 'Pending');
      if (existingPendingIdx !== -1) {
        const copy = [...payouts];
        copy[existingPendingIdx] = newRecord;
        setPayouts(copy);
      } else {
        setPayouts([newRecord, ...payouts]);
      }

      setIsProcessing(false);
      setShowInitiateModal(false);
      setSuccessToast(`✓ Disbursed EGP ${amountNum.toLocaleString()} to ${modalVenture} successfully via ${newRef}`);
      setTimeout(() => setSuccessToast(''), 4500);
    }, 900);
  };

  const activeVentureObj = resolveVentureObj(activeVenture);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar active="Payouts" />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Payout Settlements"
          crumb="Finance / Payouts"
          activeVenture={activeVenture}
          onVentureChange={handleVentureChange}
          onSelectVenture={handleVentureChange}
        />

        <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#12203C' }}>Provider Payout Settlements</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#FEF3C7', color: '#92400E' }}>
                Egypt Operations (EGP)
              </span>
              {activeVentureObj.slug !== 'all' && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '3px 8px', borderRadius: 6, fontSize: 11.5, color: '#1E40AF', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: activeVentureObj.bg }} />
                  <span>Brand: <strong>{activeVentureObj.name}</strong></span>
                  <button
                    onClick={() => handleVentureChange('all')}
                    style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontWeight: 800, padding: '0 2px', fontSize: 12 }}
                    title="Clear filter & show all brands"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <span style={{ fontSize: 12, color: '#8A94A6' }}>
              Automated reconciliation of student tuition collections, fee retention, and net bank disbursements
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {successToast && (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '6px 12px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                {successToast}
              </span>
            )}
            <button
              onClick={() => handleOpenInitiateModal()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 700,
                padding: '8px 16px',
                fontSize: 12.5,
                background: '#2E6F5E',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                cursor: 'pointer',
              }}
            >
              <span>+ Initiate Payout</span>
            </button>
          </div>
        </div>

        <div className="hub-content" style={{ padding: '16px 24px 24px' }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              {
                label: 'Total Settled to Providers',
                val: `EGP ${(totalSettled / 1000).toFixed(0)}K`,
                cls: 'success',
                sub: activeVentureObj.slug !== 'all' ? `Transferred for ${activeVentureObj.name}` : 'Transferred to Egyptian bank accounts',
              },
              {
                label: 'Pending Disbursement',
                val: `EGP ${(totalPending / 1000).toFixed(0)}K`,
                cls: 'warning',
                sub: 'Available for immediate payout',
              },
              {
                label: 'Settlement Runs',
                val: venturePayouts.length,
                sub: `Total batch transactions ${activeVentureObj.slug !== 'all' ? `(${activeVentureObj.code})` : ''}`,
              },
              {
                label: 'Avg Payout Volume',
                val: `EGP ${venturePayouts.length > 0 ? Math.round((totalSettled + totalPending) / venturePayouts.length / 1000) : 0}K`,
                sub: 'Per provider batch settlement',
              },
            ].map(k => (
              <div key={k.label} className="hub-kpi">
                <div className="hub-kpi-value">{k.val}</div>
                <div className="hub-kpi-label">{k.label}</div>
                {k.sub && <div style={{ fontSize: 11, color: 'var(--hub-text-3)', marginTop: 4 }}>{k.sub}</div>}
              </div>
            ))}
          </div>

          {/* Stacked Bar Chart */}
          <div className="hub-card" style={{ marginBottom: 20 }}>
            <div className="hub-card-header">
              <span className="hub-card-title">
                Monthly Payout Trends in Egypt {activeVentureObj.slug !== 'all' ? `(${activeVentureObj.name})` : '(Settled vs Pending EGP)'}
              </span>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--hub-accent)' }} />
                  <span style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>Settled to Bank (EGP)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#F59E0B' }} />
                  <span style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>Pending Clearing (EGP)</span>
                </div>
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 150 }}>
                {monthlyData.map(d => (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: 10, color: 'var(--hub-text-3)', fontWeight: 600 }}>
                      EGP {((d.settled + d.pending) / 1000).toFixed(0)}K
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: `${(d.pending / maxMonthlyVal) * 120}px`, background: '#F59E0B', minHeight: 4 }} />
                      <div style={{ width: '100%', height: `${(d.settled / maxMonthlyVal) * 120}px`, background: 'var(--hub-accent)', minHeight: 8 }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>{d.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters & Table */}
          <div className="hub-filters" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            {['All', 'Settled', 'Pending'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`hub-btn ${filter === s ? 'hub-btn-primary' : 'hub-btn-secondary'} hub-btn-sm`}>
                {s}
              </button>
            ))}
            <span style={{ fontSize: 13, color: 'var(--hub-text-3)', marginLeft: 'auto' }}>
              {filtered.length} payout record{filtered.length !== 1 ? 's' : ''}
              {activeVentureObj.slug !== 'all' ? ` for ${activeVentureObj.name}` : ''}
            </span>
          </div>

          {/* Payout Records Table */}
          <div className="hub-card">
            <div className="hub-table-wrap">
              <table className="hub-table">
                <thead>
                  <tr>
                    {['Payout ID', 'Provider / Academy', 'Net Disbursed', 'Settlement Rail', 'Status', 'Date', 'Bank Reference', 'Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: '#64748B' }}>
                        No {filter !== 'All' ? filter.toLowerCase() : ''} payout records found for {activeVentureObj.name}.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--hub-text-3)', fontWeight: 700 }}>{p.id}</td>
                        <td style={{ fontWeight: 600, color: 'var(--hub-text)' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: resolveVentureObj(p.venture).bg }} />
                            {p.venture}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: p.status === 'Settled' ? '#059669' : '#D97706' }}>
                          EGP {p.amount.toLocaleString()}
                        </td>
                        <td><span className="hub-badge neutral">{p.method}</span></td>
                        <td><StatusBadge s={p.status} /></td>
                        <td style={{ fontSize: 12, color: 'var(--hub-text-3)' }}>{p.date}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--hub-text-2)' }}>{p.ref}</td>
                        <td>
                          {p.status === 'Pending' && (
                            <button
                              onClick={() => handlePayNowRow(p)}
                              className="hub-btn hub-btn-primary hub-btn-sm"
                              style={{ fontSize: 11, fontWeight: 700 }}
                            >
                              Pay Now →
                            </button>
                          )}
                          {p.status === 'Settled' && (
                            <button
                              onClick={() => setReceiptPayout(p)}
                              className="hub-btn hub-btn-secondary hub-btn-sm"
                              style={{ fontSize: 11, fontWeight: 600 }}
                            >
                              Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL 1: INITIATE PAYOUT MODAL ─── */}
      {showInitiateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 32px', maxWidth: 540, width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#0F172A' }}>
                  Initiate Provider Payout Settlement
                </h2>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Disburse net student tuition earnings directly to the provider's verified Egyptian bank account
                </span>
              </div>
              <button onClick={() => setShowInitiateModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>

            <form onSubmit={handleExecutePayout} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Provider Selection */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Select Provider / Academy:
                </label>
                <select
                  value={modalVenture}
                  onChange={e => handleModalVentureChange(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, fontWeight: 600 }}
                >
                  {Object.keys(PROVIDER_BANKS).map(v => (
                    <option key={v} value={v}>
                      {v} (Pending Available: EGP {PROVIDER_BANKS[v].pendingBalance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Provider Bank & IBAN Preview */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Beneficiary Bank:</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                    {PROVIDER_BANKS[modalVenture]?.bank}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Egyptian IBAN:</span>
                  <span style={{ fontSize: 11.5, fontFamily: 'monospace', fontWeight: 600, color: '#2563EB' }}>
                    {PROVIDER_BANKS[modalVenture]?.iban}
                  </span>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Net Payout Amount (EGP):
                  </label>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={e => setPayoutAmount(e.target.value)}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '2px solid #2563EB', fontSize: 16, fontWeight: 800, color: '#0F172A' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Settlement Rail:
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={e => setPayoutMethod(e.target.value)}
                    style={{ width: '100%', padding: '10px 8px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, fontWeight: 600 }}
                  >
                    <option>Egyptian Bank Transfer (ACH / CIB)</option>
                    <option>InstaPay Corporate Direct</option>
                    <option>QNB Alahli Settlement</option>
                    <option>Banque Misr Swift / ACH</option>
                  </select>
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '12px 16px', fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#065F46' }}>Gross Student Tuition Collections:</span>
                  <span style={{ fontWeight: 700, color: '#065F46' }}>
                    EGP {Math.round((parseFloat(payoutAmount) || 0) / 0.9).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#DC2626' }}>Bldr Platform Fee (10%):</span>
                  <span style={{ fontWeight: 700, color: '#DC2626' }}>
                    - EGP {Math.round(((parseFloat(payoutAmount) || 0) / 0.9) * 0.1).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #A7F3D0', paddingTop: 6 }}>
                  <strong style={{ color: '#065F46', fontSize: 13 }}>Final Net Transfer to Provider:</strong>
                  <strong style={{ color: '#059669', fontSize: 15 }}>
                    EGP {(parseFloat(payoutAmount) || 0).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Transfer Reference Note */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Bank Reference & Audit Description:
                </label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={e => setTransferNotes(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowInitiateModal(false)}
                  style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #CBD5E1', background: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#059669',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
                  }}
                >
                  {isProcessing ? 'Processing Bank ACH...' : `Confirm & Disburse EGP ${(parseFloat(payoutAmount) || 0).toLocaleString()} →`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: OFFICIAL DISBURSEMENT RECEIPT MODAL ─── */}
      {receiptPayout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '32px', maxWidth: 520, width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  ✓
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0F172A' }}>Official Settlement Receipt</h3>
                  <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{receiptPayout.id}</span>
                </div>
              </div>
              <button onClick={() => setReceiptPayout(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Beneficiary Provider</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{receiptPayout.venture}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Receiving Bank</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{receiptPayout.bankName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Provider IBAN</span>
                <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{receiptPayout.iban}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Gross Student Tuition Volume</span>
                <span style={{ fontSize: 13 }}>EGP {receiptPayout.grossAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Bldr Platform Fee Retained (10%)</span>
                <span style={{ fontSize: 13, color: '#DC2626' }}>- EGP {receiptPayout.platformFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #CBD5E1', paddingTop: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Net Amount Settled</span>
                <span style={{ fontSize: 17, fontWeight: 900, color: '#059669' }}>EGP {receiptPayout.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>ACH / Central Bank Clearance Ref</span>
                <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>{receiptPayout.ref}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Disbursement Date</span>
                <span style={{ fontSize: 12 }}>{receiptPayout.date}</span>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => alert(`Receipt PDF for ${receiptPayout.id} printed.`)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #CBD5E1', background: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                Print PDF
              </button>
              <button
                onClick={() => setReceiptPayout(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--brand)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
