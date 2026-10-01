'use client';

import React, { useState, useEffect } from 'react';
import ProviderSidebar from '../../components/Sidebar';

interface SettlementStatement {
  id: string;
  batchId: string;
  period: string;
  grossAmount: number;
  gatewayFee: number;
  platformFee: number;
  vatAmount: number;
  reserveHeld: number;
  netSettled: number;
  status: 'Settled' | 'Pending Settlement';
  date: string;
  transferRef: string;
  note: string;
}

const STATEMENTS: SettlementStatement[] = [
  {
    id: 'STL-0441',
    batchId: 'BATCH-2026-W37',
    period: '2026-09-08 to 2026-09-14',
    grossAmount: 104000,
    gatewayFee: 2600,
    platformFee: 5200,
    vatAmount: 728,
    reserveHeld: 5200,
    netSettled: 90272,
    status: 'Settled',
    date: '2026-09-15',
    transferRef: 'TR-INT-44219',
    note: 'Weekly inter-brand settlement batch',
  },
  {
    id: 'STL-0436',
    batchId: 'BATCH-2026-W39',
    period: '2026-09-22 to 2026-09-28',
    grossAmount: 53333,
    gatewayFee: 1333,
    platformFee: 2667,
    vatAmount: 373,
    reserveHeld: 2667,
    netSettled: 46293,
    status: 'Pending Settlement',
    date: '2026-09-30',
    transferRef: 'TR-PEND-43601',
    note: 'Awaiting Hub weekly settlement authorization',
  },
  {
    id: 'STL-0430',
    batchId: 'BATCH-2026-W34',
    period: '2026-08-18 to 2026-08-24',
    grossAmount: 68000,
    gatewayFee: 1700,
    platformFee: 3400,
    vatAmount: 476,
    reserveHeld: 3400,
    netSettled: 59024,
    status: 'Settled',
    date: '2026-08-25',
    transferRef: 'TR-INT-43210',
    note: 'August second-half settlement batch',
  },
];

const totalSettled = STATEMENTS.filter(p => p.status === 'Settled').reduce((s, p) => s + p.netSettled, 0);
const totalPending = STATEMENTS.filter(p => p.status === 'Pending Settlement').reduce((s, p) => s + p.netSettled, 0);
const totalGross = STATEMENTS.reduce((s, p) => s + p.grossAmount, 0);

export default function ProviderSettlementsPage() {
  const [brandName, setBrandName] = useState('Apex Academy');
  const [selectedStatement, setSelectedStatement] = useState<SettlementStatement | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem('bldr_venture_name');
      if (v) setBrandName(v);
    } catch (e) {}
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Settlement Statements
            </h1>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Internal Brand Ledger: <strong style={{ color: 'var(--text-primary)' }}>{brandName}</strong>
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Gross Collected', val: `EGP ${totalGross.toLocaleString()}`, color: 'var(--text-primary)', bg: '#FFF' },
              { label: 'Total Net Settled', val: `EGP ${totalSettled.toLocaleString()}`, color: 'var(--success)', bg: 'var(--success-bg)' },
              { label: 'Pending Settlement', val: `EGP ${totalPending.toLocaleString()}`, color: 'var(--warning)', bg: 'var(--warning-bg)' },
              { label: 'Reserve Retained (5%)', val: `EGP ${(totalSettled * 0.05).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'var(--brand)', bg: '#EFF6FF' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Settlement Terms Notice */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Settlement Governance
              </h2>
              <span style={{ fontSize: 11, background: '#F1F5F9', padding: '3px 8px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>
                Internal Ledger Protocol
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              bldr acts as the sole merchant of record for all brand transactions. Net balances are credited to your brand operating ledger on a weekly settlement cycle, net of gateway fees, platform fees, and a 5% rolling dispute reserve. This portal provides read-only accounting statements.
            </p>
          </div>

          {/* Statement Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Statement History (EGP)
              </h2>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Read-Only Settlement Statements
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Statement ID', 'Period', 'Gross Volume', 'Deductions', 'Net Settled', 'Status', 'Internal Transfer Ref', 'Statement'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: h.includes('Volume') || h.includes('Deductions') || h.includes('Net') ? 'right' : 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STATEMENTS.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < STATEMENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{s.id}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.batchId}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--text-secondary)' }}>{s.period}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>EGP {s.grossAmount.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12.5, color: '#EF4444' }}>
                      -EGP {(s.gatewayFee + s.platformFee + s.vatAmount + s.reserveHeld).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: '#16A34A' }}>
                      EGP {s.netSettled.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11.5, fontWeight: 600, background: s.status === 'Settled' ? 'var(--success-bg)' : 'var(--warning-bg)', color: s.status === 'Settled' ? 'var(--success)' : 'var(--warning)' }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 11.5, color: 'var(--text-muted)' }}>{s.transferRef}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => setSelectedStatement(s)}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid var(--border)',
                          borderRadius: 6,
                          padding: '5px 10px',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: 'var(--text-primary)',
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal for Statement View */}
      {selectedStatement && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: 12, width: 500, padding: 28, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Settlement Statement Details</h2>
                <div style={{ fontSize: 12, color: '#64748B' }}>Statement {selectedStatement.id} • {selectedStatement.batchId}</div>
              </div>
              <button onClick={() => setSelectedStatement(null)} style={{ background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8' }}>✕</button>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 12.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Period</span>
                <span style={{ fontWeight: 600 }}>{selectedStatement.period}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Settlement Date</span>
                <span style={{ fontWeight: 600 }}>{selectedStatement.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Internal Transfer Ref</span>
                <span style={{ fontFamily: 'monospace' }}>{selectedStatement.transferRef}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 12, marginBottom: 20, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Gross Collections</span>
                <span style={{ fontWeight: 600 }}>EGP {selectedStatement.grossAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#EF4444' }}>
                <span>Gateway Processing Fee</span>
                <span>-EGP {selectedStatement.gatewayFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#EF4444' }}>
                <span>bldr Platform Fee</span>
                <span>-EGP {selectedStatement.platformFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#EF4444' }}>
                <span>VAT on Platform Fee</span>
                <span>-EGP {selectedStatement.vatAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#64748B' }}>
                <span>Rolling Reserve (5% Hold)</span>
                <span>-EGP {selectedStatement.reserveHeld.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '2px solid #0F172A', fontWeight: 700, fontSize: 15, color: '#16A34A' }}>
                <span>Net Settled Amount</span>
                <span>EGP {selectedStatement.netSettled.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setSelectedStatement(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={() => alert('Statement downloaded as CSV.')}
                style={{ background: '#0F172A', color: '#FFF', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
