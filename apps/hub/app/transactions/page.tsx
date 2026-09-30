'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { matchVenture } from '../../components/HubTopBar';

export interface TransactionItem {
  id: string;
  venture: string;
  student: string;
  email: string;
  product: string;
  amount: number;
  method: string;
  gateway: string;
  status: string;
  date: string;
  ref: string;
  type?: string;
  codeRedeemed?: string;
  sourceChannel?: string;
}

const TRANSACTIONS: TransactionItem[] = [
  { id: 'txn_01J8F4KQ2M', venture: 'StudyHub', student: 'Ahmed Ali', email: 'ahmed@example.com', product: 'Math Course — Term 1', amount: 750, method: 'Card (Visa •••• 4242)', gateway: 'PSP-A (Hosted)', status: 'Completed', date: '2026-09-14 14:32', ref: 'SH-COURSE-4581' },
  { id: 'txn_01J8EX1TD5', venture: 'StudyHub', student: 'Sarah Mansour', email: 'sarah.m@gmail.com', product: 'Physics Bundle — Term 1', amount: 900, method: 'Mobile Wallet (Vodafone)', gateway: 'PSP-A (Hosted)', status: 'Pending', date: '2026-09-12 23:58', ref: 'SH-COURSE-4402' },
  { id: 'txn_01J8F4KP9X', venture: 'Apex Classes', student: 'Khaled Omar', email: 'khaled.omar@gmail.com', product: 'CFA Level 1 FastTrack', amount: 6500, method: 'Card (Mastercard •••• 1182)', gateway: 'PSP-A (Hosted)', status: 'Completed', date: '2026-09-14 11:20', ref: 'AC-CFA-8812' },
  { id: 'txn_01J8E09A1B', venture: 'EL HESA', student: 'Nader Tarek', email: 'nader@elhesa.eg', product: 'Arabic Masterclass', amount: 450, method: 'Fawry Pay', gateway: 'PSP-B', status: 'Completed', date: '2026-09-11 16:05', ref: 'EH-ARAB-0091' },
  { id: 'txn_01J8D58M7Q', venture: 'Career Hub', student: 'Laila Mostafa', email: 'laila.m@yahoo.com', product: 'Executive Resume Review', amount: 1200, method: 'Meeza Card •••• 8821', gateway: 'PSP-A (Hosted)', status: 'Completed', date: '2026-09-10 09:44', ref: 'CH-RESUME-1049' },
];

function StatusBadge({ s }: { s: string }) {
  const m: Record<string, string> = { Completed: 'success', Pending: 'warning', Refunded: 'danger', Failed: 'danger' };
  return <span className={`hub-badge ${m[s] || 'neutral'}`}>{s}</span>;
}

export default function TransactionsPage() {
  const [txnList, setTxnList] = useState<TransactionItem[]>(TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [selected, setSelected] = useState<TransactionItem | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_hub_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTxnList([...parsed, ...TRANSACTIONS]);
        }
      }
    } catch (e) {}

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

  const methods = ['All', 'Card', 'Mobile Wallet', 'Fawry Pay', 'Meeza', 'Activation Code'];

  const filtered = txnList.filter(t => {
    const ms = search === '' || t.student.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()) || t.venture.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase()) || (t.codeRedeemed && t.codeRedeemed.toLowerCase().includes(search.toLowerCase()));
    const ss = statusFilter === 'All' || t.status === statusFilter;
    const mf = methodFilter === 'All' || (methodFilter === 'Activation Code' ? (t.method.includes('Activation Code') || t.type === 'CODE_REDEMPTION') : t.method.includes(methodFilter));
    const matchesVenture = matchVenture(t.venture, selectedVenture);
    return ms && ss && mf && matchesVenture;
  });

  const total = filtered.reduce((s, t) => t.status !== 'Refunded' && t.status !== 'Failed' ? s + (t.amount || 0) : s, 0);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Transactions"
          crumb="Transactions"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />


        <div className="hub-content">
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Transactions', val: txnList.length },
              { label: 'Completed', val: txnList.filter(t => t.status === 'Completed').length },
              { label: 'Code Redemptions', val: txnList.filter(t => t.type === 'CODE_REDEMPTION' || t.method?.includes('Activation Code')).length },
              { label: 'Pending Payout', val: txnList.filter(t => t.status === 'Pending').length },
              { label: 'Settlement Revenue', val: `EGP ${txnList.filter(t => t.status === 'Completed').reduce((s, t) => s + (t.amount || 0), 0).toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="hub-kpi">
                <div className="hub-kpi-value">{s.val}</div>
                <div className="hub-kpi-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="hub-filters" style={{ marginBottom: 16 }}>
            <input
              className="hub-input"
              style={{ maxWidth: 260 }}
              placeholder="Search by ID, student, venture..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="hub-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {['All', 'Completed', 'Pending', 'Refunded', 'Failed'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="hub-select" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              {methods.map(m => <option key={m}>{m}</option>)}
            </select>
            <span style={{ fontSize: 13, color: 'var(--hub-text-3)', marginLeft: 'auto' }}>
              {filtered.length} results · EGP {total.toLocaleString()}
            </span>
          </div>

          {/* Table */}
          <div className="hub-card">
            <div className="hub-table-wrap">
              <table className="hub-table">
                <thead>
                  <tr>
                    {['ID', 'Venture', 'Student', 'Product', 'Amount', 'Method', 'Gateway', 'Status', 'Date', 'Detail'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--hub-text-3)' }}>{t.id}</td>
                      <td style={{ fontWeight: 500 }}>{t.venture}</td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{t.student}</div>
                        <div style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>{t.email}</div>
                      </td>
                      <td style={{ color: 'var(--hub-text-2)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.product}</td>
                      <td style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {t.type === 'CODE_REDEMPTION' || t.amount === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#059669' }}>EGP 0.00</span>
                            <span style={{ fontSize: 9.5, fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '1px 4px', borderRadius: 3, width: 'fit-content' }}>
                              CODE REDEEMED
                            </span>
                          </div>
                        ) : (
                          `EGP ${t.amount.toLocaleString()}`
                        )}
                      </td>
                      <td><span className="hub-badge neutral">{t.method}</span></td>
                      <td><span className="hub-badge accent">{t.gateway}</span></td>
                      <td><StatusBadge s={t.status} /></td>
                      <td style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>{t.date}</td>
                      <td>
                        <Link
                          href={`/transactions/${t.id}`}
                          className="hub-btn hub-btn-secondary hub-btn-sm"
                          style={{ textDecoration: 'none' }}
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="hub-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="hub-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 className="hub-modal-title" style={{ marginBottom: 0 }}>Transaction Detail</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--hub-text-3)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                ['Transaction ID', selected.id],
                ['Reference', selected.ref],
                ['Venture', selected.venture],
                ['Student Name', selected.student],
                ['Student Email', selected.email],
                ['Product', selected.product],
                ['Amount', selected.type === 'CODE_REDEMPTION' || selected.amount === 0 ? 'EGP 0.00 (Code Redemption)' : `EGP ${selected.amount.toLocaleString()}`],
                ['Payment Method', selected.method],
                ['Gateway', selected.gateway],
                ...((selected as any).codeRedeemed ? [['Redeemed Code', (selected as any).codeRedeemed], ['Channel Source', (selected as any).sourceChannel || 'CENTER']] : []),
                ['Status', selected.status],
                ['Date', selected.date],
              ].map(([label, value], i, arr) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--hub-border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--hub-text-3)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--hub-text)' }}>{value}</span>
                </div>
              ))}
            </div>
            {selected.status === 'Completed' && (
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="hub-btn hub-btn-secondary" style={{ flex: 1 }}>↓ Download Receipt</button>
                <button className="hub-btn" style={{ flex: 1, background: '#FEF2F2', color: '#991B1B', border: 'none' }}>↩ Issue Refund</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
