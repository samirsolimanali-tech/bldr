'use client';

import React, { useState, useEffect, useMemo } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { resolveVentureObj, matchVenture, VENTURES } from '../../components/HubTopBar';

interface SettlementRecord {
  id: string;
  batchId: string;
  venture: string;
  ventureCode: string;
  period: string;
  grossAmount: number;
  gatewayFee: number;
  platformFee: number;
  vatAmount: number;
  reserveAmount: number;
  netSettlement: number;
  status: 'Settled' | 'Pending Settlement';
  transferRef: string;
  debitAccount: string;
  creditAccount: string;
  settledAt?: string;
  createdAt: string;
}

const INITIAL_SETTLEMENTS: SettlementRecord[] = [
  {
    id: 'STL-EG-0442',
    batchId: 'BATCH-2026-W37',
    venture: 'bldr (Storefront Pilot)',
    ventureCode: 'BLDR',
    period: '2026-09-08 to 2026-09-14',
    grossAmount: 161111,
    gatewayFee: 4028,
    platformFee: 8055,
    vatAmount: 1128,
    reserveAmount: 8055,
    netSettlement: 139845,
    status: 'Settled',
    transferRef: 'TR-INT-44220',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'BLDR Incubator Treasury (Operating)',
    settledAt: '2026-09-18',
    createdAt: '2026-09-15',
  },
  {
    id: 'STL-EG-0437',
    batchId: 'BATCH-2026-W39',
    venture: 'bldr (Storefront Pilot)',
    ventureCode: 'BLDR',
    period: '2026-09-22 to 2026-09-28',
    grossAmount: 57777,
    gatewayFee: 1444,
    platformFee: 2889,
    vatAmount: 404,
    reserveAmount: 2889,
    netSettlement: 50151,
    status: 'Pending Settlement',
    transferRef: 'TR-PEND-43701',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'BLDR Incubator Treasury (Operating)',
    createdAt: '2026-09-29',
  },
  {
    id: 'STL-EG-0441',
    batchId: 'BATCH-2026-W37',
    venture: 'StudyHub',
    ventureCode: 'SH',
    period: '2026-09-08 to 2026-09-14',
    grossAmount: 104000,
    gatewayFee: 2600,
    platformFee: 5200,
    vatAmount: 728,
    reserveAmount: 5200,
    netSettlement: 90272,
    status: 'Settled',
    transferRef: 'TR-INT-44219',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'StudyHub Brand Ledger (Internal)',
    settledAt: '2026-09-15',
    createdAt: '2026-09-15',
  },
  {
    id: 'STL-EG-0436',
    batchId: 'BATCH-2026-W39',
    venture: 'StudyHub',
    ventureCode: 'SH',
    period: '2026-09-22 to 2026-09-28',
    grossAmount: 53333,
    gatewayFee: 1333,
    platformFee: 2667,
    vatAmount: 373,
    reserveAmount: 2667,
    netSettlement: 46293,
    status: 'Pending Settlement',
    transferRef: 'TR-PEND-43601',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'StudyHub Brand Ledger (Internal)',
    createdAt: '2026-09-29',
  },
  {
    id: 'STL-EG-0440',
    batchId: 'BATCH-2026-W37',
    venture: 'Apex Classes',
    ventureCode: 'AC',
    period: '2026-09-08 to 2026-09-14',
    grossAmount: 148333,
    gatewayFee: 3708,
    platformFee: 7417,
    vatAmount: 1038,
    reserveAmount: 7417,
    netSettlement: 128753,
    status: 'Settled',
    transferRef: 'TR-INT-44218',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'Apex Classes Brand Ledger (Internal)',
    settledAt: '2026-09-15',
    createdAt: '2026-09-15',
  },
  {
    id: 'STL-EG-0435',
    batchId: 'BATCH-2026-W39',
    venture: 'Apex Classes',
    ventureCode: 'AC',
    period: '2026-09-22 to 2026-09-28',
    grossAmount: 31111,
    gatewayFee: 778,
    platformFee: 1556,
    vatAmount: 218,
    reserveAmount: 1556,
    netSettlement: 27003,
    status: 'Pending Settlement',
    transferRef: 'TR-PEND-43501',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'Apex Classes Brand Ledger (Internal)',
    createdAt: '2026-09-29',
  },
  {
    id: 'STL-EG-0439',
    batchId: 'BATCH-2026-W35',
    venture: 'EL HESA',
    ventureCode: 'EH',
    period: '2026-08-25 to 2026-08-31',
    grossAmount: 67666,
    gatewayFee: 1692,
    platformFee: 3383,
    vatAmount: 474,
    reserveAmount: 3383,
    netSettlement: 58734,
    status: 'Settled',
    transferRef: 'TR-INT-43991',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'EL HESA Brand Ledger (Internal)',
    settledAt: '2026-09-01',
    createdAt: '2026-09-01',
  },
  {
    id: 'STL-EG-0438',
    batchId: 'BATCH-2026-W35',
    venture: 'Career Hub',
    ventureCode: 'CH',
    period: '2026-08-25 to 2026-08-31',
    grossAmount: 66166,
    gatewayFee: 1654,
    platformFee: 3308,
    vatAmount: 463,
    reserveAmount: 3308,
    netSettlement: 57433,
    status: 'Settled',
    transferRef: 'TR-INT-43990',
    debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
    creditAccount: 'Career Hub Brand Ledger (Internal)',
    settledAt: '2026-09-01',
    createdAt: '2026-09-01',
  },
];

const BASE_MONTHLY = [
  { month: 'Apr', settled: 280000, pending: 40000 },
  { month: 'May', settled: 360000, pending: 50000 },
  { month: 'Jun', settled: 420000, pending: 67000 },
  { month: 'Jul', settled: 480000, pending: 44000 },
  { month: 'Aug', settled: 540000, pending: 72000 },
  { month: 'Sep', settled: 492550, pending: 160500 },
];

function StatusBadge({ s }: { s: string }) {
  return (
    <span
      style={{
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: s === 'Settled' ? '#DCFCE7' : '#FEF3C7',
        color: s === 'Settled' ? '#166534' : '#92400E',
      }}
    >
      {s}
    </span>
  );
}

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<SettlementRecord[]>(INITIAL_SETTLEMENTS);
  const [filter, setFilter] = useState('All');
  const [activeVenture, setActiveVenture] = useState<string>('all');

  // Modal States
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<SettlementRecord | null>(null);
  const [successToast, setSuccessToast] = useState('');

  // Form State for Initiating Settlement Batch
  const [modalVenture, setModalVenture] = useState('bldr (Storefront Pilot)');
  const [settlementAmount, setSettlementAmount] = useState('50151');
  const [transferNotes, setTransferNotes] = useState('Weekly inter-brand transfer authorization per ledger rules');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_active_venture');
      if (stored) setActiveVenture(stored);
    } catch {}

    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('bldr_active_venture');
        if (stored) setActiveVenture(stored);
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredSettlements = useMemo(() => {
    return settlements.filter((s) => {
      const matchStatus =
        filter === 'All'
          ? true
          : filter === 'Settled'
          ? s.status === 'Settled'
          : s.status === 'Pending Settlement';

      const matchV = matchVenture(s.venture, activeVenture);
      return matchStatus && matchV;
    });
  }, [settlements, filter, activeVenture]);

  const activeVentureObj = resolveVentureObj(activeVenture);

  const totalSettled = filteredSettlements
    .filter((s) => s.status === 'Settled')
    .reduce((sum, s) => sum + s.netSettlement, 0);

  const totalPending = filteredSettlements
    .filter((s) => s.status === 'Pending Settlement')
    .reduce((sum, s) => sum + s.netSettlement, 0);

  const handleInitiateSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newRef = `TR-INT-${Math.floor(10000 + Math.random() * 90000)}`;
      const newBatch = `BATCH-2026-W${Math.floor(39 + Math.random() * 5)}`;
      const amt = parseFloat(settlementAmount) || 0;

      const newRecord: SettlementRecord = {
        id: `STL-EG-0${Math.floor(450 + Math.random() * 100)}`,
        batchId: newBatch,
        venture: modalVenture,
        ventureCode: modalVenture.includes('Apex') ? 'AC' : modalVenture.includes('Study') ? 'SH' : 'BLDR',
        period: '2026-09-22 to 2026-09-28',
        grossAmount: Math.round(amt * 1.15),
        gatewayFee: Math.round(amt * 0.025),
        platformFee: Math.round(amt * 0.05),
        vatAmount: Math.round(amt * 0.007),
        reserveAmount: Math.round(amt * 0.05),
        netSettlement: amt,
        status: 'Settled',
        transferRef: newRef,
        debitAccount: 'BLDR Merchant Holding Pool (Acquiring)',
        creditAccount: `${modalVenture} Brand Ledger (Internal)`,
        settledAt: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
      };

      setSettlements((prev) => [newRecord, ...prev]);
      setIsProcessing(false);
      setShowInitiateModal(false);
      setSelectedStatement(newRecord);
      setSuccessToast(`Internal settlement transfer ${newRef} authorized and posted to brand ledger.`);
      setTimeout(() => setSuccessToast(''), 4500);
    }, 900);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <HubSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HubTopBar />

        <div style={{ padding: '28px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Brand Settlements
              </h1>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                Internal settlement statements and inter-entity journal transfer records for bldr-owned brands.
                {activeVenture !== 'all' && (
                  <span style={{ fontWeight: 600, color: '#0EA5E9', marginLeft: 6 }}>
                    • Scoped to: {activeVentureObj.label}
                  </span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowInitiateModal(true)}
                style={{
                  background: '#0F172A',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '9px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Authorize Settlement Batch
              </button>
            </div>
          </div>

          {/* Success Toast */}
          {successToast && (
            <div
              style={{
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '12px 16px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              ✓ {successToast}
            </div>
          )}

          {/* Metrics Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px' }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>TOTAL NET SETTLED</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginTop: 6 }}>
                EGP {totalSettled.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>Completed inter-brand ledger transfers</div>
            </div>

            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px' }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>PENDING SETTLEMENT</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#D97706', marginTop: 6 }}>
                EGP {totalPending.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Awaiting weekly batch sign-off</div>
            </div>

            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px' }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>SETTLEMENT CADENCE</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginTop: 6 }}>
                Weekly Batch (Fridays)
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Automatic roll-up from transaction ledger</div>
            </div>

            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px 20px' }}>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>ROLLING RESERVE (5%)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#6366F1', marginTop: 6 }}>
                EGP {(totalSettled * 0.05).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Internal chargeback & refund buffer</div>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
            {/* Filter Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Settled', 'Pending Settlement'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      background: filter === f ? '#0F172A' : '#F1F5F9',
                      color: filter === f ? '#FFF' : '#475569',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 12, color: '#64748B' }}>
                Showing <strong>{filteredSettlements.length}</strong> settlement records
              </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Statement ID / Batch</th>
                  <th style={{ padding: '12px 16px' }}>Brand</th>
                  <th style={{ padding: '12px 16px' }}>Period</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Gross Volume</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Fees & Reserve</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Net Settled</th>
                  <th style={{ padding: '12px 16px' }}>Internal Transfer Ref</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettlements.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{s.id}</div>
                      <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{s.batchId}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{s.venture}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: 12 }}>{s.period}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                      EGP {s.grossAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: '#EF4444', fontSize: 12 }}>
                      -EGP {(s.gatewayFee + s.platformFee + s.vatAmount + s.reserveAmount).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>
                      EGP {s.netSettlement.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>
                        {s.transferRef}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge s={s.status} />
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedStatement(s)}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          borderRadius: 4,
                          padding: '5px 10px',
                          fontSize: 12,
                          color: '#0F172A',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        View Statement
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Statement Modal */}
      {selectedStatement && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#FFF',
              borderRadius: 8,
              width: 540,
              padding: 28,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0F172A' }}>
                  Brand Settlement Statement
                </h2>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Ref: {selectedStatement.id} • Batch: {selectedStatement.batchId}
                </div>
              </div>
              <button
                onClick={() => setSelectedStatement(null)}
                style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Brand</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{selectedStatement.venture}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Statement Period</span>
                <span style={{ fontSize: 12, color: '#0F172A' }}>{selectedStatement.period}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Transfer Status</span>
                <StatusBadge s={selectedStatement.status} />
              </div>
            </div>

            {/* Financial Breakdown */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 14, marginBottom: 20, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#475569' }}>Gross Collections</span>
                <span style={{ fontWeight: 600 }}>EGP {selectedStatement.grossAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#DC2626' }}>
                <span>Gateway Processing Fee</span>
                <span>-EGP {selectedStatement.gatewayFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#DC2626' }}>
                <span>bldr Platform Fee</span>
                <span>-EGP {selectedStatement.platformFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#DC2626' }}>
                <span>VAT on Platform Fee</span>
                <span>-EGP {selectedStatement.vatAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#475569' }}>
                <span>Rolling Reserve (5% Hold)</span>
                <span>-EGP {selectedStatement.reserveAmount.toLocaleString()}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTop: '2px solid #0F172A',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#16A34A',
                }}
              >
                <span>Net Brand Ledger Transfer</span>
                <span>EGP {selectedStatement.netSettlement.toLocaleString()}</span>
              </div>
            </div>

            {/* Ledger Routing */}
            <div style={{ background: '#F1F5F9', borderRadius: 6, padding: 12, marginBottom: 24, fontSize: 11 }}>
              <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>LEDGER JOURNAL ENTRY</div>
              <div style={{ color: '#64748B' }}>Debit: {selectedStatement.debitAccount}</div>
              <div style={{ color: '#64748B' }}>Credit: {selectedStatement.creditAccount}</div>
              <div style={{ color: '#64748B', marginTop: 4 }}>Internal Ref: {selectedStatement.transferRef}</div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedStatement(null)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: 6,
                  padding: '9px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Statement exported as PDF.');
                }}
                style={{
                  background: '#0F172A',
                  border: 'none',
                  borderRadius: 6,
                  padding: '9px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#FFF',
                }}
              >
                Download Statement PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authorize Settlement Batch Modal */}
      {showInitiateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#FFF',
              borderRadius: 8,
              width: 500,
              padding: 28,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0F172A' }}>
                Authorize Internal Settlement
              </h2>
              <button
                onClick={() => setShowInitiateModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInitiateSettlement}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Brand (Venture)
                </label>
                <select
                  value={modalVenture}
                  onChange={(e) => setModalVenture(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                  }}
                >
                  <option>bldr (Storefront Pilot)</option>
                  <option>StudyHub</option>
                  <option>Apex Classes</option>
                  <option>EL HESA</option>
                  <option>Career Hub</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Net Transfer Amount (EGP)
                </label>
                <input
                  type="number"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Transfer Journal Notes
                </label>
                <textarea
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowInitiateModal(false)}
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    borderRadius: 6,
                    padding: '9px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    background: '#0F172A',
                    border: 'none',
                    borderRadius: 6,
                    padding: '9px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#FFF',
                  }}
                >
                  {isProcessing ? 'Posting Transfer...' : 'Authorize & Post Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
