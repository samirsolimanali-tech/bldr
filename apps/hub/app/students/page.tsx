'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

const STUDENTS = [
  { id: 'stu-001', name: 'أحمد حسن (Ahmed Hassan)', email: 'ahmed.hassan@gmail.com', venture: 'StudyHub Egypt', product: 'Full-Stack Engineering Bootcamp', amount: 4800, method: 'Fawry Ref Code', gateway: 'Fawry Pay', date: '2026-09-26', refund: 'None' },
  { id: 'stu-002', name: 'سارة محمود (Sara Mahmoud)', email: 'sara.mahmoud@gmail.com', venture: 'TechBridge Cairo', product: 'React & Next.js Workshop', amount: 1850, method: 'Vodafone Cash', gateway: 'Paymob', date: '2026-09-26', refund: 'None' },
  { id: 'stu-003', name: 'عمر فاروق (Omar Farouk)', email: 'omar.farouk@yahoo.com', venture: 'EL HESA Academy', product: 'Executive MBA Registration', amount: 8500, method: 'Visa Card', gateway: 'Geidea', date: '2026-09-25', refund: 'None' },
  { id: 'stu-004', name: 'فاطمة السيد (Fatima El-Sayed)', email: 'fatima.elsayed@gmail.com', venture: 'Apex Alexandria', product: 'UI/UX Design Masterclass', amount: 2200, method: 'Vodafone Cash', gateway: 'Paymob', date: '2026-09-25', refund: 'None' },
  { id: 'stu-005', name: 'خالد إبراهيم (Khaled Ibrahim)', email: 'khaled.ibrahim@outlook.com', venture: 'StudyHub Egypt', product: 'Full-Stack Engineering Bootcamp', amount: 4800, method: 'Fawry Ref Code', gateway: 'Fawry Pay', date: '2026-09-24', refund: 'Full Refund' },
  { id: 'stu-006', name: 'نورا الشاذلي (Nora El-Shazly)', email: 'nora.shazly@gmail.com', venture: 'Sidekick Studio Egypt', product: 'Brand Design Playbook', amount: 450, method: 'Orange Money', gateway: 'Paymob', date: '2026-09-24', refund: 'None' },
  { id: 'stu-007', name: 'ماجد عبد الرحمن (Majed Abdelrahman)', email: 'majed.abdel@gmail.com', venture: 'TechBridge Cairo', product: 'Advanced Node.js & Docker', amount: 1650, method: 'Etisalat Cash', gateway: 'Fawry Pay', date: '2026-09-23', refund: 'None' },
  { id: 'stu-008', name: 'مريم خليل (Mariam Khalil)', email: 'mariam.khalil@gmail.com', venture: 'EL HESA Academy', product: 'Executive MBA Registration', amount: 8500, method: 'Bank Transfer (CIB)', gateway: 'Geidea', date: '2026-09-22', refund: 'Partial Refund' },
  { id: 'stu-009', name: 'يوسف الأمين (Youssef El-Amin)', email: 'youssef.amin@gmail.com', venture: 'StudyHub Egypt', product: 'Python & Data Science Diploma', amount: 3500, method: 'WE Pay', gateway: 'Paymob', date: '2026-09-22', refund: 'None' },
  { id: 'stu-010', name: 'منى السيد (Mona El-Sayed)', email: 'mona.sayed@gmail.com', venture: 'EL HESA Academy', product: 'Digital Marketing & Growth', amount: 2800, method: 'Mastercard', gateway: 'Geidea', date: '2026-09-21', refund: 'None' },
];

function RefundBadge({ r }: { r: string }) {
  if (r === 'None') return <span className="hub-badge success">None</span>;
  if (r === 'Full Refund') return <span className="hub-badge danger">Full Refund</span>;
  return <span className="hub-badge warning">{r}</span>;
}

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [ventureFilter, setVentureFilter] = useState('All');
  const [refundFilter, setRefundFilter] = useState('All');
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');

  const ventures = ['All', ...Array.from(new Set(STUDENTS.map(s => s.venture)))];

  const filtered = STUDENTS.filter(s => {
    const ms = search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || s.product.toLowerCase().includes(search.toLowerCase());
    const vs = ventureFilter === 'All' || s.venture === ventureFilter;
    const rs = refundFilter === 'All' || (refundFilter === 'Has Refund' ? s.refund !== 'None' : s.refund === 'None');
    return ms && vs && rs;
  });

  const totalRev = filtered.filter(s => s.refund === 'None').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Student Tracking"
          crumb="Students & Customers"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={ventureFilter}
          onSelectVenture={setVentureFilter}
        />

        <div className="hub-content">
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Students', val: STUDENTS.length },
              { label: 'No Refunds', val: STUDENTS.filter(s => s.refund === 'None').length },
              { label: 'Refunded', val: STUDENTS.filter(s => s.refund !== 'None').length },
              { label: 'Net Revenue', val: `EGP ${STUDENTS.filter(s => s.refund === 'None').reduce((sum, s) => sum + s.amount, 0).toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="hub-kpi">
                <div className="hub-kpi-value">{s.val}</div>
                <div className="hub-kpi-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="hub-filters">
            <input
              className="hub-input"
              style={{ maxWidth: 260 }}
              placeholder="Search by name, email, product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="hub-select" value={ventureFilter} onChange={e => setVentureFilter(e.target.value)}>
              {ventures.map(v => <option key={v}>{v}</option>)}
            </select>
            <select className="hub-select" value={refundFilter} onChange={e => setRefundFilter(e.target.value)}>
              {['All', 'No Refund', 'Has Refund'].map(r => <option key={r}>{r}</option>)}
            </select>
            <span style={{ fontSize: 13, color: 'var(--hub-text-3)', marginLeft: 'auto' }}>
              {filtered.length} students · EGP {totalRev.toLocaleString()}
            </span>
          </div>

          {/* Table */}
          <div className="hub-card">
            <div className="hub-table-wrap">
              <table className="hub-table">
                <thead>
                  <tr>
                    {['Student', 'Venture', 'Product', 'Amount', 'Source', 'Gateway', 'Date', 'Refund', 'Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>{s.email}</div>
                      </td>
                      <td style={{ color: 'var(--hub-text-2)', fontWeight: 500 }}>{s.venture}</td>
                      <td style={{ color: 'var(--hub-text-2)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.product}</td>
                      <td style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>EGP {s.amount.toLocaleString()}</td>
                      <td><span className="hub-badge neutral">{s.method}</span></td>
                      <td><span className="hub-badge accent">{s.gateway}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--hub-text-3)' }}>{s.date}</td>
                      <td><RefundBadge r={s.refund} /></td>
                      <td>
                        {s.refund === 'None' && (
                          <button className="hub-btn hub-btn-sm" style={{ background: '#FEF2F2', color: '#991B1B', border: 'none', fontSize: 11 }}>
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
