'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface Student {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  brand: string;
  enrolledCourses: string[];
  totalSpent: number;
  lastPaymentMethod: string;
  gateway: string;
  joinedDate: string;
  status: 'Active' | 'Revoked' | 'Suspended';
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-101',
    name: 'Ahmed Hassan',
    nameAr: 'أحمد حسن',
    email: 'ahmed.hassan@gmail.com',
    phone: '+20 100 234 5678',
    brand: 'StudyHub',
    enrolledCourses: ['Full-Stack Engineering Bootcamp', 'TypeScript Pro'],
    totalSpent: 6200,
    lastPaymentMethod: 'Vodafone Cash',
    gateway: 'Paymob',
    joinedDate: '2026-09-12',
    status: 'Active',
  },
  {
    id: 'stu-102',
    name: 'Sara Mahmoud',
    nameAr: 'سارة محمود',
    email: 'sara.mahmoud@gmail.com',
    phone: '+20 111 876 5432',
    brand: 'EL HESA',
    enrolledCourses: ['Executive MBA Program (12 months)'],
    totalSpent: 32000,
    lastPaymentMethod: 'Meeza Card',
    gateway: 'Geidea',
    joinedDate: '2026-08-20',
    status: 'Active',
  },
  {
    id: 'stu-103',
    name: 'Omar Farouk',
    nameAr: 'عمر فاروق',
    email: 'omar.farouk@yahoo.com',
    phone: '+20 122 345 6789',
    brand: 'Apex Classes',
    enrolledCourses: ['Financial Modelling & Valuation', 'Corporate Finance'],
    totalSpent: 3850,
    lastPaymentMethod: 'InstaPay Direct',
    gateway: 'Paymob',
    joinedDate: '2026-09-01',
    status: 'Active',
  },
  {
    id: 'stu-104',
    name: 'Fatima El-Sayed',
    nameAr: 'فاطمة السيد',
    email: 'fatima.elsayed@gmail.com',
    phone: '+20 155 987 6543',
    brand: 'Career Hub',
    enrolledCourses: ['UI/UX Product Design Masterclass'],
    totalSpent: 2200,
    lastPaymentMethod: 'Fawry Ref Code',
    gateway: 'Fawry Pay',
    joinedDate: '2026-09-18',
    status: 'Active',
  },
  {
    id: 'stu-105',
    name: 'Khaled Ibrahim',
    nameAr: 'خالد إبراهيم',
    email: 'khaled.ibrahim@outlook.com',
    phone: '+20 102 443 2211',
    brand: 'StudyHub',
    enrolledCourses: ['Advanced React & Next.js Cohort'],
    totalSpent: 3200,
    lastPaymentMethod: 'Etisalat Cash',
    gateway: 'Paymob',
    joinedDate: '2026-07-15',
    status: 'Revoked',
  },
  {
    id: 'stu-106',
    name: 'Mariam Khalil',
    nameAr: 'مريم خليل',
    email: 'mariam.khalil@gmail.com',
    phone: '+20 114 990 1234',
    brand: 'EL HESA',
    enrolledCourses: ['Digital Marketing & Growth Systems'],
    totalSpent: 2800,
    lastPaymentMethod: 'Orange Money',
    gateway: 'Paymob',
    joinedDate: '2026-09-22',
    status: 'Active',
  },
  {
    id: 'stu-107',
    name: 'Youssef El-Amin',
    nameAr: 'يوسف الأمين',
    email: 'youssef.amin@gmail.com',
    phone: '+20 109 555 8899',
    brand: 'bldr',
    enrolledCourses: ['bldr Venture Builder Masterclass'],
    totalSpent: 5000,
    lastPaymentMethod: 'CIB Bank Card',
    gateway: 'Paymob',
    joinedDate: '2026-09-25',
    status: 'Active',
  },
];

const BRANDS = ['All Brands', 'StudyHub', 'EL HESA', 'Apex Classes', 'Career Hub', 'bldr'];

const BRAND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'bldr': { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE' },
  'StudyHub': { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
  'Apex Classes': { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  'EL HESA': { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  'Career Hub': { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
};

export default function StudentsCRMPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All Brands');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Manual Enroll Modal
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentBrand, setNewStudentBrand] = useState('StudyHub');
  const [newStudentCourse, setNewStudentCourse] = useState('Full-Stack Engineering Bootcamp');
  const [newStudentAmount, setNewStudentAmount] = useState('4800');

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.nameAr.includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
    const matchBrand = brandFilter === 'All Brands' || s.brand === brandFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchBrand && matchStatus;
  });

  const totalRevenue = students.reduce((sum, s) => sum + s.totalSpent, 0);
  const activeCount = students.filter((s) => s.status === 'Active').length;

  const toggleAccess = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'Active' ? 'Revoked' : 'Active';
        return { ...s, status: nextStatus };
      })
    );
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    const newEntry: Student = {
      id: `stu-${Date.now()}`,
      name: newStudentName,
      nameAr: newStudentName,
      email: newStudentEmail,
      phone: newStudentPhone || '+20 100 000 0000',
      brand: newStudentBrand,
      enrolledCourses: [newStudentCourse],
      totalSpent: Number(newStudentAmount) || 0,
      lastPaymentMethod: 'Manual Admin Grant',
      gateway: 'Direct Bypass',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };

    setStudents([newEntry, ...students]);
    setShowEnrollModal(false);
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'white',
            borderBottom: '1px solid var(--border)',
            padding: '0 32px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Students CRM — Multi-Brand Directory
            </h1>
          </div>
          <button
            onClick={() => setShowEnrollModal(true)}
            style={{
              background: 'var(--brand)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            + Manual Student Access
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Total Enrolled Students</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)' }}>
                3,420
              </div>
              <div style={{ fontSize: 11, color: '#059669', marginTop: 4, fontWeight: 600 }}>● Across all brand ventures</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Active Learners Right Now</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#047857' }}>
                {activeCount} active in view
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>98.2% healthy completion status</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Total Student LTV</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#1E3A8A' }}>
                EGP {totalRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Consolidated across all gateways</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Egyptian Mobile Verified</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#D97706' }}>
                99.4%
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Vodafone, Orange, Etisalat & WE</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              border: '1px solid var(--border)',
              padding: '16px 20px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 280 }}>
              <input
                type="text"
                placeholder="Search by student name, phone (010...), or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '7px 12px',
                  outline: 'none',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Brand Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: 4 }}>
                Brand:
              </span>
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(b)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: brandFilter === b ? 700 : 500,
                    border: '1px solid',
                    borderColor: brandFilter === b ? 'var(--brand)' : 'var(--border)',
                    background: brandFilter === b ? 'var(--brand)' : '#FFFFFF',
                    color: brandFilter === b ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'white',
                fontSize: 12,
                color: 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Student Profile', 'Egyptian Mobile', 'Brand & Enrolled Program', 'Total Paid', 'Payment Method', 'Joined', 'Access Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, i) => {
                    const brandStyle = BRAND_COLORS[s.brand] || BRAND_COLORS['bldr'];

                    return (
                      <tr
                        key={s.id}
                        style={{
                          borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {/* Student Profile */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                background: brandStyle.bg,
                                color: brandStyle.text,
                                border: `1px solid ${brandStyle.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 13,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {s.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                                {s.name}
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6, fontWeight: 400 }}>
                                  ({s.nameAr})
                                </span>
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Mobile Phone */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>
                              {s.phone}
                            </span>
                            <a
                              href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#059669',
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                padding: '2px 6px',
                                borderRadius: 4,
                                textDecoration: 'none',
                              }}
                            >
                              WhatsApp
                            </a>
                          </div>
                        </td>

                        {/* Brand & Courses */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 9999,
                                fontSize: 10,
                                fontWeight: 700,
                                background: brandStyle.bg,
                                color: brandStyle.text,
                                border: `1px solid ${brandStyle.border}`,
                              }}
                            >
                              {s.brand}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {s.enrolledCourses.join(', ')}
                          </div>
                        </td>

                        {/* Total Paid */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                            EGP {s.totalSpent.toLocaleString()}
                          </span>
                        </td>

                        {/* Payment Method */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {s.lastPaymentMethod}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            via {s.gateway}
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                          {s.joinedDate}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              background: s.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                              color: s.status === 'Active' ? '#065F46' : '#991B1B',
                            }}
                          >
                            {s.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                              onClick={() => toggleAccess(s.id)}
                              style={{
                                border: '1px solid var(--border)',
                                background: '#FFFFFF',
                                borderRadius: 6,
                                padding: '4px 8px',
                                fontSize: 11,
                                fontWeight: 600,
                                color: s.status === 'Active' ? '#B45309' : '#059669',
                                cursor: 'pointer',
                              }}
                            >
                              {s.status === 'Active' ? 'Revoke' : 'Restore'}
                            </button>
                            <button
                              onClick={() => setSelectedStudent(s)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: 12,
                                fontWeight: 600,
                                color: 'var(--brand)',
                                cursor: 'pointer',
                              }}
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal: Enroll Student */}
      {showEnrollModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              width: 520,
              maxWidth: '92vw',
              padding: 28,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                Manual Student Enrollment & Override
              </h2>
              <button
                onClick={() => setShowEnrollModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnroll} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mostafa Ali"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mostafa@example.com"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Egyptian Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+20 100 123 4567"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Brand / Venture
                  </label>
                  <select
                    value={newStudentBrand}
                    onChange={(e) => setNewStudentBrand(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  >
                    {BRANDS.filter((b) => b !== 'All Brands').map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Tuition / Fee (EGP)
                  </label>
                  <input
                    type="number"
                    value={newStudentAmount}
                    onChange={(e) => setNewStudentAmount(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Program / Course
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Engineering Bootcamp"
                  value={newStudentCourse}
                  onChange={(e) => setNewStudentCourse(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: '#FFFFFF',
                    fontSize: 13,
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--brand)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer / Modal: Student Details */}
      {selectedStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              width: 560,
              maxWidth: '92vw',
              padding: 28,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedStudent.name}
                </h2>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {selectedStudent.nameAr} • ID: {selectedStudent.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#F8FAFC', padding: 14, borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Mobile Phone</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{selectedStudent.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Email</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{selectedStudent.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Brand Venture</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{selectedStudent.brand}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Enrollment Date</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{selectedStudent.joinedDate}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>
                  Enrolled Programs & Courses
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedStudent.enrolledCourses.map((c, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600 }}>{c}</span>
                      <span style={{ fontSize: 11, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>Active License</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ border: '1px solid var(--border)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Amount Paid</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand)', marginTop: 2 }}>
                    EGP {selectedStudent.totalSpent.toLocaleString()}
                  </div>
                </div>
                <div style={{ border: '1px solid var(--border)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Payment Channel</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                    {selectedStudent.lastPaymentMethod}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>via {selectedStudent.gateway}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--brand)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
