'use client';

import React from 'react';
import ProviderSidebar from '../../components/Sidebar';

const PAYOUTS = [
  { id: 'PAY-0441', amount: 93600, status: 'Settled', method: 'Bank Transfer', date: '2026-09-15', ref: 'BANK-REF-44219', note: 'September mid-month settlement' },
  { id: 'PAY-0438', amount: 48000, status: 'Pending', method: 'Bank Transfer', date: '2026-09-30', ref: '—', note: 'End of month settlement' },
  { id: 'PAY-0435', amount: 60000, status: 'Settled', method: 'Bank Transfer', date: '2026-09-01', ref: 'BANK-REF-43910', note: 'August final settlement' },
  { id: 'PAY-0430', amount: 55000, status: 'Settled', method: 'Bank Transfer', date: '2026-08-15', ref: 'BANK-REF-43210', note: 'August mid-month settlement' },
];

const totalSettled = PAYOUTS.filter(p => p.status === 'Settled').reduce((s, p) => s + p.amount, 0);
const totalPending = PAYOUTS.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

export default function ProviderPayoutsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Payouts</h1>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Settled', val: `EGP ${totalSettled.toLocaleString()}`, color: 'var(--success)', bg: 'var(--success-bg)' },
              { label: 'Pending', val: `EGP ${totalPending.toLocaleString()}`, color: 'var(--warning)', bg: 'var(--warning-bg)' },
              { label: 'Payout Method', val: 'Bank Transfer (CIB)', color: 'var(--brand)', bg: '#EFF6FF' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Payout Method Info */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Payout Method</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Managed by Bldr Egypt</span>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { label: 'Method', val: 'Egyptian Bank Transfer (ACH)' },
                { label: 'IBAN', val: 'EG38 0010 0023 •••• •••• 4492 (CIB)' },
                { label: 'Account Name', val: 'StudyHub Egypt LLC' },
                { label: 'Schedule', val: 'Bi-monthly (1st & 15th)' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f.val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              Note: To update your payout method or Egyptian IBAN, please contact your Bldr account manager.
            </div>
          </div>

          {/* Payout History */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Payout History (EGP)</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Payout ID', 'Amount', 'Status', 'Method', 'Date', 'Reference', 'Note'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYOUTS.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < PAYOUTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{p.id}</td>
                    <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>EGP {p.amount.toLocaleString()}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: p.status === 'Settled' ? 'var(--success-bg)' : 'var(--warning-bg)', color: p.status === 'Settled' ? 'var(--success)' : 'var(--warning)' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.method}</td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{p.date}</td>
                    <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{p.ref}</td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
