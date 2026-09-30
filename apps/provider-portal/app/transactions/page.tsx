'use client';

import React, { useState } from 'react';
import ProviderSidebar from '../../components/Sidebar';

interface Transaction {
  id: string;
  student: string;
  email: string;
  product: string;
  amount: number;
  currency: string;
  netPayout: number;
  gatewayFee: number;
  method: string;
  gateway: string;
  status: 'Completed' | 'Pending' | 'Refunded';
  date: string;
  ref: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 'TXN-8821', student: 'أحمد حسن (Ahmed Hassan)', email: 'ahmed.hassan@gmail.com', product: 'Full-Stack Bootcamp Sept Cohort', amount: 4800, currency: 'EGP', netPayout: 4320, gatewayFee: 120, method: 'كود فوري (Fawry Ref Code)', gateway: 'Fawry Pay', status: 'Completed', date: '2026-09-26 14:32', ref: 'FAW-788-99212' },
  { id: 'TXN-8819', student: 'سارة محمود (Sara Mahmoud)', email: 'sara.mahmoud@gmail.com', product: 'React & Next.js Pro Workshop', amount: 1850, currency: 'EGP', netPayout: 1665, gatewayFee: 46.25, method: 'فودافون كاش (Vodafone Cash)', gateway: 'Paymob', status: 'Completed', date: '2026-09-26 11:15', ref: 'MOB-WAL-99180' },
  { id: 'TXN-8815', student: 'عمر فاروق (Omar Farouk)', email: 'omar.farouk@yahoo.com', product: 'Executive MBA Registration', amount: 8500, currency: 'EGP', netPayout: 7650, gatewayFee: 212.5, method: 'بطاقة ميزة (Meeza Card)', gateway: 'Geidea', status: 'Completed', date: '2026-09-25 18:40', ref: 'GEI-MEEZA-99154' },
  { id: 'TXN-8810', student: 'نورا الشاذلي (Nora El-Shazly)', email: 'nora.shazly@gmail.com', product: 'UI/UX Design Masterclass', amount: 2200, currency: 'EGP', netPayout: 1980, gatewayFee: 55, method: 'إنستاباي (InstaPay)', gateway: 'Paymob', status: 'Completed', date: '2026-09-25 09:20', ref: 'PAY-IP-99112' },
  { id: 'TXN-8798', student: 'خالد إبراهيم (Khaled Ibrahim)', email: 'khaled.ibrahim@outlook.com', product: 'Full-Stack Bootcamp Sept Cohort', amount: 4800, currency: 'EGP', netPayout: 0, gatewayFee: 0, method: 'كود فوري (Fawry Ref Code)', gateway: 'Fawry Pay', status: 'Refunded', date: '2026-09-24 16:05', ref: 'FAW-REF-8798-CANCEL' },
  { id: 'TXN-8785', student: 'ريم الألفي (Reem El-Alfy)', email: 'reem.alfy@gmail.com', product: 'Python & Data Science Diploma', amount: 3500, currency: 'EGP', netPayout: 3150, gatewayFee: 87.5, method: 'أورنج كاش (Orange Money)', gateway: 'Paymob', status: 'Pending', date: '2026-09-24 13:50', ref: 'MOB-WAL-98850' },
  { id: 'TXN-8770', student: 'طارق نور (Tarek Nour)', email: 'tarek.nour@cibeg.com', product: 'Corporate Tech Leadership', amount: 6500, currency: 'EGP', netPayout: 5850, gatewayFee: 162.5, method: 'تحويل بنكي (CIB Egypt)', gateway: 'Geidea', status: 'Completed', date: '2026-09-23 10:11', ref: 'CIB-REF-77019' },
];

export default function ProviderTransactionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filtered = TRANSACTIONS.filter(t => {
    const matchSearch = t.student.toLowerCase().includes(search.toLowerCase()) ||
                        t.email.toLowerCase().includes(search.toLowerCase()) ||
                        t.id.toLowerCase().includes(search.toLowerCase()) ||
                        t.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalGross = TRANSACTIONS.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
  const totalNet = TRANSACTIONS.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.netPayout, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Transactions & Student Collections
              </h1>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#FEF3C7', color: '#92400E' }}>
                Egypt Operations (EGP)
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              Real-time payment records from Fawry, Mobile Wallets (Vodafone/Orange/WE), and Bank Cards
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => alert('Exporting Egyptian transactions CSV...')}
              style={{ background: 'white', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              Export CSV
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Completed Volume', val: `EGP ${totalGross.toLocaleString()}`, sub: 'Gross paid by Egyptian students' },
              { label: 'Net Provider Payout', val: `EGP ${totalNet.toLocaleString()}`, sub: 'After 10% Bldr fee' },
              { label: 'Total Transactions', val: TRANSACTIONS.length, sub: 'All rails (Fawry/Wallets/Cards)' },
              { label: 'Refund Rate', val: `${((TRANSACTIONS.filter(t => t.status === 'Refunded').length / TRANSACTIONS.length) * 100).toFixed(1)}%`, sub: '1 refund processed' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{kpi.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{kpi.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search by student, email, product, or TXN-ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, maxWidth: 380, padding: '9px 14px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}
            />
            {['All', 'Completed', 'Pending', 'Refunded'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid var(--border-strong)',
                  background: statusFilter === status ? 'var(--brand)' : 'white',
                  color: statusFilter === status ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Transaction ID', 'Student / Customer', 'Product / Offering', 'Amount', 'Net Payout', 'Method', 'Gateway', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, idx) => (
                  <tr key={t.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: 'var(--brand)' }}>
                      {t.id}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{t.student}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {t.product}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                      EGP {t.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#059669' }}>
                      EGP {t.netPayout.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: '#F1F5F9', color: '#334155' }}>
                        {t.method}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8' }}>
                        {t.gateway}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: t.status === 'Completed' ? '#ECFDF5' : t.status === 'Refunded' ? '#FEF2F2' : '#FFFBEB',
                        color: t.status === 'Completed' ? '#065F46' : t.status === 'Refunded' ? '#991B1B' : '#92400E',
                      }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                      {t.date}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => setSelectedTxn(t)}
                        style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid var(--border-strong)', background: 'white', color: 'var(--brand)', cursor: 'pointer' }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTxn && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 520, width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Transaction Details</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selectedTxn.id}</span>
              </div>
              <button onClick={() => setSelectedTxn(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Customer</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedTxn.student} ({selectedTxn.email})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Product</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedTxn.product}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Gross Paid</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>EGP {selectedTxn.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Bldr Platform Fee (10%)</span>
                <span style={{ fontSize: 13, color: '#DC2626' }}>- EGP {(selectedTxn.amount * 0.1).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Net Payout to Provider</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#059669' }}>EGP {selectedTxn.netPayout.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Payment Method</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedTxn.method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Payment Gateway</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)' }}>{selectedTxn.gateway}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Gateway Reference</span>
                <span style={{ fontSize: 13, fontFamily: 'monospace' }}>{selectedTxn.ref}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Timestamp</span>
                <span style={{ fontSize: 13 }}>{selectedTxn.date}</span>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => alert(`Egyptian receipt downloaded for ${selectedTxn.id}`)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                Print / Save Receipt
              </button>
              <button
                onClick={() => setSelectedTxn(null)}
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
