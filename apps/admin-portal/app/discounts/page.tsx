'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface Coupon {
  id: string;
  code: string;
  brand: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  usedCount: number;
  maxLimit: number;
  totalSaved: number;
  expiresAt: string;
  status: 'Active' | 'Paused' | 'Expired';
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'STUDY50',
    brand: 'StudyHub',
    type: 'percentage',
    value: 50,
    minOrder: 1500,
    usedCount: 142,
    maxLimit: 300,
    totalSaved: 113600,
    expiresAt: '2026-12-31',
    status: 'Active',
  },
  {
    id: 'c-2',
    code: 'WELCOME10',
    brand: 'All Brands',
    type: 'percentage',
    value: 10,
    minOrder: 500,
    usedCount: 489,
    maxLimit: 1000,
    totalSaved: 73350,
    expiresAt: '2027-01-01',
    status: 'Active',
  },
  {
    id: 'c-3',
    code: 'ELHESA2026',
    brand: 'EL HESA',
    type: 'fixed',
    value: 1500,
    minOrder: 8000,
    usedCount: 28,
    maxLimit: 50,
    totalSaved: 42000,
    expiresAt: '2026-11-15',
    status: 'Active',
  },
  {
    id: 'c-4',
    code: 'APEXFIN',
    brand: 'Apex Classes',
    type: 'fixed',
    value: 400,
    minOrder: 1200,
    usedCount: 65,
    maxLimit: 100,
    totalSaved: 26000,
    expiresAt: '2026-10-30',
    status: 'Active',
  },
  {
    id: 'c-5',
    code: 'SUMMER25',
    brand: 'Career Hub',
    type: 'percentage',
    value: 25,
    minOrder: 1000,
    usedCount: 200,
    maxLimit: 200,
    totalSaved: 50000,
    expiresAt: '2026-08-31',
    status: 'Expired',
  },
];

const BRANDS = ['All Brands', 'bldr', 'StudyHub', 'Apex Classes', 'EL HESA', 'Career Hub'];

const BRAND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'All Brands': { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
  'bldr': { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE' },
  'StudyHub': { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
  'Apex Classes': { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  'EL HESA': { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  'Career Hub': { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
};

export default function DiscountsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newBrand, setNewBrand] = useState('All Brands');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('');
  const [newMaxLimit, setNewMaxLimit] = useState('100');
  const [newExpiresAt, setNewExpiresAt] = useState('2026-12-31');

  const filteredCoupons = coupons.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchBrand = selectedBrand === 'All Brands' || c.brand === selectedBrand;
    const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
    return matchSearch && matchBrand && matchStatus;
  });

  const totalRedemptions = coupons.reduce((s, c) => s + c.usedCount, 0);
  const totalVolumeSaved = coupons.reduce((s, c) => s + c.totalSaved, 0);
  const activeCouponsCount = coupons.filter((c) => c.status === 'Active').length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const handleToggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status === 'Expired') return c;
        return {
          ...c,
          status: c.status === 'Active' ? 'Paused' : 'Active',
        };
      })
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newValue) return;

    const created: Coupon = {
      id: `c-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      brand: newBrand,
      type: newType,
      value: Number(newValue),
      minOrder: Number(newMinOrder) || 0,
      usedCount: 0,
      maxLimit: Number(newMaxLimit) || 100,
      totalSaved: 0,
      expiresAt: newExpiresAt,
      status: 'Active',
    };

    setCoupons([created, ...coupons]);
    setShowModal(false);
    setNewCode('');
    setNewValue('');
    setNewMinOrder('');
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
              Discounts & Promo Coupons
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
            + Create Coupon
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Active Coupons</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeCouponsCount}
              </div>
              <div style={{ fontSize: 11, color: '#059669', marginTop: 4, fontWeight: 600 }}>● Across all brand stores</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Total Redemptions</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)' }}>
                {totalRedemptions.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Completed checkouts with discount</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Total Discount Granted</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#2563EB' }}>
                EGP {totalVolumeSaved.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Funded by merchant / brand budget</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Checkout Conversion Boost</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#059669' }}>
                +28.4%
              </div>
              <div style={{ fontSize: 11, color: '#059669', marginTop: 4, fontWeight: 600 }}>▲ Higher cart completion rate</div>
            </div>
          </div>

          {/* Controls Bar */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
              <input
                type="text"
                placeholder="Search promo code (e.g. STUDY50)..."
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
                  onClick={() => setSelectedBrand(b)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: selectedBrand === b ? 700 : 500,
                    border: '1px solid',
                    borderColor: selectedBrand === b ? 'var(--brand)' : 'var(--border)',
                    background: selectedBrand === b ? 'var(--brand)' : '#FFFFFF',
                    color: selectedBrand === b ? '#FFFFFF' : 'var(--text-secondary)',
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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
              <option value="Paused">Paused</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Promo Code', 'Brand Restriction', 'Discount Value', 'Min Order', 'Redemptions / Limit', 'Total Saved', 'Expiry', 'Status', 'Actions'].map((h) => (
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
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                      No discount coupons found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((c, i) => {
                    const brandStyle = BRAND_COLORS[c.brand] || BRAND_COLORS['All Brands'];
                    const usagePct = Math.min(100, Math.round((c.usedCount / c.maxLimit) * 100));

                    return (
                      <tr
                        key={c.id}
                        style={{
                          borderBottom: i < filteredCoupons.length - 1 ? '1px solid var(--border)' : 'none',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {/* Code */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                fontSize: 13,
                                background: '#F8FAFC',
                                border: '1px dashed #94A3B8',
                                padding: '4px 8px',
                                borderRadius: 6,
                                color: 'var(--text-primary)',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {c.code}
                            </span>
                            <button
                              onClick={() => handleCopy(c.code)}
                              style={{
                                border: '1px solid var(--border)',
                                background: '#FFFFFF',
                                borderRadius: 4,
                                padding: '2px 7px',
                                cursor: 'pointer',
                                fontSize: 11,
                                fontWeight: 600,
                                color: copiedCode === c.code ? '#059669' : 'var(--text-secondary)',
                              }}
                            >
                              {copiedCode === c.code ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </td>

                        {/* Brand */}
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: 9999,
                              fontSize: 11,
                              fontWeight: 700,
                              background: brandStyle.bg,
                              color: brandStyle.text,
                              border: `1px solid ${brandStyle.border}`,
                            }}
                          >
                            {c.brand}
                          </span>
                        </td>

                        {/* Value */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                            {c.type === 'percentage' ? `${c.value}% OFF` : `EGP ${c.value} OFF`}
                          </span>
                        </td>

                        {/* Min Order */}
                        <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {c.minOrder > 0 ? `EGP ${c.minOrder.toLocaleString()}` : 'None'}
                        </td>

                        {/* Redemptions */}
                        <td style={{ padding: '14px 16px', minWidth: 160 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                            <span>{c.usedCount} used</span>
                            <span>{c.maxLimit} max</span>
                          </div>
                          <div style={{ height: 6, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${usagePct}%`,
                                background: usagePct >= 90 ? '#EF4444' : 'var(--brand)',
                                borderRadius: 9999,
                              }}
                            />
                          </div>
                        </td>

                        {/* Total Saved */}
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#2563EB', fontVariantNumeric: 'tabular-nums' }}>
                          EGP {c.totalSaved.toLocaleString()}
                        </td>

                        {/* Expiry */}
                        <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                          {c.expiresAt}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              background:
                                c.status === 'Active'
                                  ? '#ECFDF5'
                                  : c.status === 'Paused'
                                  ? '#FFFBEB'
                                  : '#FEF2F2',
                              color:
                                c.status === 'Active'
                                  ? '#065F46'
                                  : c.status === 'Paused'
                                  ? '#B45309'
                                  : '#991B1B',
                            }}
                          >
                            {c.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleToggleStatus(c.id)}
                            disabled={c.status === 'Expired'}
                            style={{
                              border: '1px solid var(--border)',
                              background: '#FFFFFF',
                              borderRadius: 6,
                              padding: '4px 8px',
                              fontSize: 11,
                              fontWeight: 600,
                              color: c.status === 'Active' ? '#B45309' : '#059669',
                              cursor: c.status === 'Expired' ? 'not-allowed' : 'pointer',
                              opacity: c.status === 'Expired' ? 0.4 : 1,
                            }}
                          >
                            {c.status === 'Active' ? 'Pause' : 'Activate'}
                          </button>
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

      {/* Modal: Create Coupon */}
      {showModal && (
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
                Create New Promo Coupon
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-strong)',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Brand Scope
                  </label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  >
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Discount Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed EGP Amount</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    {newType === 'percentage' ? 'Percentage (e.g. 20)' : 'Amount in EGP (e.g. 500)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={newType === 'percentage' ? 100 : 50000}
                    placeholder={newType === 'percentage' ? '20' : '500'}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Min Order Value (EGP)
                  </label>
                  <input
                    type="number"
                    placeholder="0 (No minimum)"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Max Usage Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newMaxLimit}
                    onChange={(e) => setNewMaxLimit(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpiresAt}
                    onChange={(e) => setNewExpiresAt(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div style={{ marginTop: 8, padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px dashed #CBD5E1' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                  Customer Live Preview
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--brand)' }}>
                      {newCode || 'PROMOCODE'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 8 }}>
                      • {newValue ? (newType === 'percentage' ? `${newValue}% off` : `EGP ${newValue} off`) : 'Discount'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Applies to: {newBrand}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
