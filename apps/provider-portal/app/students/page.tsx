'use client';

import React, { useState } from 'react';
import ProviderSidebar from '../../components/Sidebar';

const STUDENTS = [
  { id: 's01', name: 'Ahmed Al-Rashid', email: 'ahmed@email.com', phone: '+966 55 001 0001', product: 'Full-Stack Bootcamp', amount: 4800, source: 'Mada', gateway: 'Tap Payments', date: '2026-09-26', txnId: 'TXN-8821', refund: 'None', status: 'Enrolled' },
  { id: 's02', name: 'Sara Mohammed', email: 'sara@email.com', phone: '+966 55 002 0002', product: 'Full-Stack Bootcamp', amount: 4800, source: 'Card', gateway: 'Tap Payments', date: '2026-09-26', txnId: 'TXN-8820', refund: 'None', status: 'Enrolled' },
  { id: 's03', name: 'Omar Khalid', email: 'omar@email.com', phone: '+966 55 003 0003', product: 'Advanced React Cohort', amount: 3200, source: 'Apple Pay', gateway: 'Stripe', date: '2026-09-25', txnId: 'TXN-8819', refund: 'None', status: 'Enrolled' },
  { id: 's04', name: 'Fatima Nasser', email: 'fatima@email.com', phone: '+966 55 004 0004', product: 'Full-Stack Bootcamp', amount: 4800, source: 'Mada', gateway: 'Tap Payments', date: '2026-09-25', txnId: 'TXN-8818', refund: 'None', status: 'Enrolled' },
  { id: 's05', name: 'Khalid Ibrahim', email: 'khalid@email.com', phone: '+966 55 005 0005', product: 'Full-Stack Bootcamp', amount: 4800, source: 'Mada', gateway: 'Tap Payments', date: '2026-09-24', txnId: 'TXN-8817', refund: 'Full Refund', status: 'Refunded' },
  { id: 's06', name: 'Youssef Al-Amin', email: 'youssef@email.com', phone: '+966 55 006 0006', product: 'Advanced React Cohort', amount: 3200, source: 'Card', gateway: 'Stripe', date: '2026-09-23', txnId: 'TXN-8810', refund: 'None', status: 'Enrolled' },
  { id: 's07', name: 'Mona Al-Sayed', email: 'mona@email.com', phone: '+966 55 007 0007', product: 'Full-Stack Bootcamp', amount: 4800, source: 'STC Pay', gateway: 'Tap Payments', date: '2026-09-22', txnId: 'TXN-8808', refund: 'None', status: 'Enrolled' },
];

function RefundBadge({ r }: { r: string }) {
  if (r === 'None') return <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: 'var(--success-bg)', color: 'var(--success)' }}>None</span>;
  return <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: 'var(--danger-bg)', color: 'var(--danger)' }}>{r}</span>;
}

export default function ProviderStudentsPage() {
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('All');
  const [selected, setSelected] = useState<typeof STUDENTS[0] | null>(null);

  const products = ['All', ...Array.from(new Set(STUDENTS.map(s => s.product)))];

  const filtered = STUDENTS.filter(s => {
    const ms = search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const ps = productFilter === 'All' || s.product === productFilter;
    return ms && ps;
  });

  const net = filtered.filter(s => s.refund === 'None').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Paid Users</h1>
          <button style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit' }}>
            ↓ Export CSV
          </button>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Students', val: STUDENTS.length },
              { label: 'Enrolled', val: STUDENTS.filter(s => s.status === 'Enrolled').length },
              { label: 'Refunded', val: STUDENTS.filter(s => s.refund !== 'None').length },
              { label: 'Net Revenue', val: `EGP ${STUDENTS.filter(s => s.refund === 'None').reduce((sum, s) => sum + s.amount, 0).toLocaleString()}` },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, maxWidth: 280, padding: '8px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
            />
            <select
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', color: 'var(--text-primary)' }}
            >
              {products.map(p => <option key={p}>{p}</option>)}
            </select>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {filtered.length} students · EGP {net.toLocaleString()}
            </span>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Product', 'Amount', 'Payment Source', 'Gateway', 'Date', 'Refund', 'Detail'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.email}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.product}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>EGP {s.amount.toLocaleString()}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 500, background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{s.source}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{s.gateway}</td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{s.date}</td>
                    <td style={{ padding: '13px 16px' }}><RefundBadge r={s.refund} /></td>
                    <td style={{ padding: '13px 16px' }}>
                      <button
                        onClick={() => setSelected(s)}
                        style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, background: 'none', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Student Detail</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            {[
              ['Name', selected.name],
              ['Email', selected.email],
              ['Phone', selected.phone],
              ['Product', selected.product],
              ['Amount Paid', `EGP ${selected.amount.toLocaleString()}`],
              ['Payment Source', selected.source],
              ['Gateway', selected.gateway],
              ['Transaction ID', selected.txnId],
              ['Date', selected.date],
              ['Refund', selected.refund],
            ].map(([label, value], i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 9 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
