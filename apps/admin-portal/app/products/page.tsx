'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

interface Product {
  id: string;
  title: string;
  brand: string;
  ventureId: string;
  originBrand: string;
  isFirstParty: boolean;
  aggregatedOnBldrStore: boolean;
  featuredOnBldr: boolean;
  saleMode: 'DIRECT' | 'REDIRECT';
  redirectUrl?: string;
  provider: string;
  type: string;
  price: number;
  status: 'Published' | 'Draft';
  enrolled: number;
  created: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'pr3',
    title: 'Brand Strategy & Positioning Guide',
    brand: 'bldr',
    ventureId: 'bldr',
    originBrand: 'bldr Direct',
    isFirstParty: true,
    aggregatedOnBldrStore: true,
    featuredOnBldr: true,
    saleMode: 'DIRECT',
    provider: 'Sidekick Studio',
    type: 'Book',
    price: 299,
    status: 'Published',
    enrolled: 820,
    created: '2025-04-10',
  },
  {
    id: 'pr8',
    title: 'bldr Venture Builder Masterclass',
    brand: 'bldr',
    ventureId: 'bldr',
    originBrand: 'bldr Direct',
    isFirstParty: true,
    aggregatedOnBldrStore: true,
    featuredOnBldr: true,
    saleMode: 'DIRECT',
    provider: 'bldr Team',
    type: 'Course',
    price: 5000,
    status: 'Published',
    enrolled: 215,
    created: '2025-06-01',
  },
  {
    id: 'pr1',
    title: 'Full-Stack Web Engineering Bootcamp',
    brand: 'StudyHub',
    ventureId: 'venture_studyhub',
    originBrand: 'StudyHub Academy',
    isFirstParty: false,
    aggregatedOnBldrStore: true,
    featuredOnBldr: true,
    saleMode: 'DIRECT',
    provider: 'TechBridge Labs',
    type: 'Course',
    price: 4800,
    status: 'Published',
    enrolled: 87,
    created: '2025-02-01',
  },
  {
    id: 'pr4',
    title: 'Advanced React & TypeScript Cohort',
    brand: 'StudyHub',
    ventureId: 'venture_studyhub',
    originBrand: 'StudyHub Academy',
    isFirstParty: false,
    aggregatedOnBldrStore: true,
    featuredOnBldr: false,
    saleMode: 'DIRECT',
    provider: 'StudyHub Academy',
    type: 'Course',
    price: 3200,
    status: 'Published',
    enrolled: 65,
    created: '2025-05-01',
  },
  {
    id: 'pr5',
    title: 'Executive MBA Program (12 months)',
    brand: 'EL HESA',
    ventureId: 'venture_elhesa',
    originBrand: 'EL HESA Institute',
    isFirstParty: false,
    aggregatedOnBldrStore: true,
    featuredOnBldr: false,
    saleMode: 'REDIRECT',
    redirectUrl: 'https://elhesa.org/mba-admissions',
    provider: 'EL HESA Institute',
    type: 'Course',
    price: 32000,
    status: 'Published',
    enrolled: 42,
    created: '2025-05-20',
  },
  {
    id: 'pr6',
    title: 'Financial Modelling Assessment',
    brand: 'Apex Classes',
    ventureId: 'venture_apex',
    originBrand: 'Apex Classes',
    isFirstParty: false,
    aggregatedOnBldrStore: false,
    featuredOnBldr: false,
    saleMode: 'DIRECT',
    provider: 'Apex Consulting',
    type: 'Assessment',
    price: 450,
    status: 'Draft',
    enrolled: 0,
    created: '2026-09-18',
  },
  {
    id: 'pr2',
    title: 'Digital Marketing Mastery Workshop',
    brand: 'Career Hub',
    ventureId: 'venture_careerhub',
    originBrand: 'Career Hub',
    isFirstParty: false,
    aggregatedOnBldrStore: true,
    featuredOnBldr: false,
    saleMode: 'REDIRECT',
    redirectUrl: 'https://careerhub.eg/courses/digital-marketing',
    provider: 'Sidekick Studio',
    type: 'Workshop',
    price: 1200,
    status: 'Published',
    enrolled: 134,
    created: '2025-03-14',
  },
  {
    id: 'pr7',
    title: 'UX Research Methods Workshop',
    brand: 'Career Hub',
    ventureId: 'venture_careerhub',
    originBrand: 'Career Hub',
    isFirstParty: false,
    aggregatedOnBldrStore: false,
    featuredOnBldr: false,
    saleMode: 'DIRECT',
    provider: 'TechBridge Labs',
    type: 'Workshop',
    price: 850,
    status: 'Published',
    enrolled: 112,
    created: '2025-06-15',
  },
];

const TYPES = ['All Types', 'Course', 'Workshop', 'Book', 'Event', 'Assessment'];
const BRANDS = ['All Brands', 'bldr', 'StudyHub', 'Apex Classes', 'EL HESA', 'Career Hub'];

const BRAND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'bldr': { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE' },
  'StudyHub': { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
  'Apex Classes': { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  'EL HESA': { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  'Career Hub': { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
};

function StatusPill({ status }: { status: string }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: status === 'Published' ? '#ECFDF5' : '#FFFBEB', color: status === 'Published' ? '#065F46' : '#92400E' }}>
      {status}
    </span>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [brandFilter, setBrandFilter] = useState('All Brands');
  const [saleModeFilter, setSaleModeFilter] = useState<'All' | 'DIRECT' | 'REDIRECT'>('All');
  const [sourceFilter, setSourceFilter] = useState<'All' | '1stParty' | 'PartnerAggregated'>('All');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    brand: 'bldr',
    ventureId: 'bldr',
    provider: '',
    type: 'Course',
    price: '',
    status: 'Published',
    saleMode: 'DIRECT' as 'DIRECT' | 'REDIRECT',
    redirectUrl: '',
    aggregatedOnBldrStore: true,
  });

  const ventureMap: Record<string, string> = {
    'bldr': 'bldr',
    'StudyHub': 'venture_studyhub',
    'Apex Classes': 'venture_apex',
    'EL HESA': 'venture_elhesa',
    'Career Hub': 'venture_careerhub',
  };

  const handleBrandChange = (brand: string) => {
    setNewProduct(prev => ({
      ...prev,
      brand,
      ventureId: ventureMap[brand] || 'bldr',
    }));
  };

  const filtered = products.filter(p => {
    const matchType = typeFilter === 'All Types' || p.type === typeFilter;
    const matchBrand = brandFilter === 'All Brands' || p.brand === brandFilter;
    const matchSaleMode = saleModeFilter === 'All' || p.saleMode === saleModeFilter;
    const matchSource =
      sourceFilter === 'All'
        ? true
        : sourceFilter === '1stParty'
        ? p.isFirstParty
        : !p.isFirstParty;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.provider.toLowerCase().includes(search.toLowerCase()) ||
      p.ventureId.toLowerCase().includes(search.toLowerCase());
    return matchType && matchBrand && matchSaleMode && matchSource && matchSearch;
  });

  const handleAdd = () => {
    if (!newProduct.title) return;
    const isFirstParty = newProduct.brand === 'bldr';
    setProducts(prev => [
      {
        id: `pr${Date.now()}`,
        title: newProduct.title,
        brand: newProduct.brand,
        ventureId: newProduct.ventureId,
        originBrand: isFirstParty ? 'bldr Direct' : `${newProduct.brand} Academy`,
        isFirstParty,
        aggregatedOnBldrStore: newProduct.aggregatedOnBldrStore,
        featuredOnBldr: false,
        saleMode: newProduct.saleMode,
        redirectUrl: newProduct.saleMode === 'REDIRECT' ? newProduct.redirectUrl : undefined,
        provider: newProduct.provider || (isFirstParty ? 'bldr Team' : 'Unassigned Provider'),
        type: newProduct.type,
        price: Number(newProduct.price) || 0,
        status: newProduct.status as 'Published' | 'Draft',
        enrolled: 0,
        created: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);
    setShowAdd(false);
    setNewProduct({
      title: '',
      brand: 'bldr',
      ventureId: 'bldr',
      provider: '',
      type: 'Course',
      price: '',
      status: 'Published',
      saleMode: 'DIRECT',
      redirectUrl: '',
      aggregatedOnBldrStore: true,
    });
  };

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p));
  };

  const toggleSaleMode = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextMode = p.saleMode === 'DIRECT' ? 'REDIRECT' : 'DIRECT';
      return {
        ...p,
        saleMode: nextMode,
        redirectUrl: nextMode === 'REDIRECT' && !p.redirectUrl ? `https://${p.brand.toLowerCase().replace(/\s+/g, '')}.com/course/${p.id}` : p.redirectUrl,
      };
    }));
  };

  const toggleAggregated = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, aggregatedOnBldrStore: !p.aggregatedOnBldrStore } : p));
  };

  const toggleFeatured = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, featuredOnBldr: !p.featuredOnBldr } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const aggregatedCount = products.filter(p => p.aggregatedOnBldrStore).length;
  const firstPartyCount = products.filter(p => p.isFirstParty).length;
  const partnerCount = products.filter(p => !p.isFirstParty).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Catalog & Aggregated Marketplace
            </h1>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            + Add Listing / Course
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* Aggregator Authority & RBAC Isolation Notice */}
          <div
            style={{
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontSize: 13, color: '#0369A1', lineHeight: 1.5 }}>
              <strong>bldr Store Catalog Aggregator:</strong> The bldr store admin can curate both first-party listings and cross-brand courses originating from partner ventures (e.g. StudyHub, EL HESA, Apex Classes) to feature on the central marketplace surface.
            </div>
            <div style={{ fontSize: 12, color: '#0284C7' }}>
              <strong>Strict RBAC Isolation (ADR-001):</strong> Catalog visibility is strictly content-level. Partner brands' financial statements, settlement balances, and gateway credentials remain protected and isolated inside the Central Payment Hub.
            </div>
          </div>

          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Catalog Listings', val: products.length, sub: `${firstPartyCount} 1st-party • ${partnerCount} partner` },
              { label: 'Live on bldr Storefront', val: aggregatedCount, sub: 'Showcased to marketplace students' },
              { label: 'Spotlight Featured', val: products.filter(p => p.featuredOnBldr).length, sub: 'Featured on bldr homepage banner' },
              { label: 'Total Enrolled Learners', val: products.reduce((s, p) => s + p.enrolled, 0).toLocaleString(), sub: 'Across all listed programs' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
              <input
                type="text"
                placeholder="Search course title or provider..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px', outline: 'none', fontSize: 13, fontFamily: 'inherit' }}
              />
            </div>

            {/* Source Segment */}
            <div style={{ display: 'flex', background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
              {[
                { id: 'All', label: 'All Listings' },
                { id: '1stParty', label: '1st-Party (bldr)' },
                { id: 'PartnerAggregated', label: 'Aggregated Partner' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSourceFilter(s.id as any)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: sourceFilter === s.id ? 700 : 500,
                    background: sourceFilter === s.id ? 'var(--brand)' : 'transparent',
                    color: sourceFilter === s.id ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Sale Mode Filter */}
            <div style={{ display: 'flex', background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
              {(['All', 'DIRECT', 'REDIRECT'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSaleModeFilter(mode)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 11.5,
                    fontWeight: saleModeFilter === mode ? 700 : 500,
                    background: saleModeFilter === mode ? '#0F172A' : 'transparent',
                    color: saleModeFilter === mode ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {mode === 'All' ? 'All Modes' : mode}
                </button>
              ))}
            </div>

            {/* Brand Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: 4 }}>
                Brand:
              </span>
              {BRANDS.map(b => (
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

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'white', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}
            >
              {TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Course / Product Listing', 'Origin Brand & Venture', 'Type', 'Retail Price', 'Sale Mode & Routing', 'bldr Store Showcase', 'Featured', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const brandStyle = BRAND_COLORS[p.brand] || BRAND_COLORS['bldr'];
                  return (
                    <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      {/* Product Title */}
                      <td style={{ padding: '14px 16px', maxWidth: 280 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          Instructor: {p.provider} • {p.enrolled} Enrolled
                        </div>
                      </td>

                      {/* Brand & Origin */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: brandStyle.bg, color: brandStyle.text, border: `1px solid ${brandStyle.border}` }}>
                            {p.brand}
                          </span>
                          {p.isFirstParty ? (
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#1E3A8A', background: '#DBEAFE', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                              1st Party
                            </span>
                          ) : (
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#0369A1', background: '#E0F2FE', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                              Aggregated
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          venture_id: {p.ventureId}
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '14px 16px', fontSize: 12 }}>
                        <span style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: 9999, fontWeight: 500 }}>{p.type}</span>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                        EGP {p.price.toLocaleString()}
                      </td>

                      {/* Sale Mode & Routing */}
                      <td style={{ padding: '14px 16px' }}>
                        {p.saleMode === 'DIRECT' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 10, fontWeight: 800, background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: 4 }}>
                                DIRECT
                              </span>
                              <button
                                onClick={() => toggleSaleMode(p.id)}
                                style={{ fontSize: 10, color: '#64748B', background: 'none', border: '1px solid #CBD5E1', borderRadius: 4, padding: '1px 5px', cursor: 'pointer' }}
                              >
                                Switch
                              </button>
                            </div>
                            <span style={{ fontSize: 10.5, color: '#64748B' }}>
                              Settles to {p.ventureId}
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 10, fontWeight: 800, background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: 4 }}>
                                REDIRECT
                              </span>
                              <button
                                onClick={() => toggleSaleMode(p.id)}
                                style={{ fontSize: 10, color: '#64748B', background: 'none', border: '1px solid #CBD5E1', borderRadius: 4, padding: '1px 5px', cursor: 'pointer' }}
                              >
                                Switch
                              </button>
                            </div>
                            <span style={{ fontSize: 10.5, color: '#64748B', maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.redirectUrl || 'External site'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* bldr Store Aggregated Showcase Toggle */}
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => toggleAggregated(p.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            border: '1px solid',
                            borderColor: p.aggregatedOnBldrStore ? '#A7F3D0' : '#E5E7EB',
                            background: p.aggregatedOnBldrStore ? '#ECFDF5' : '#F9FAFB',
                            color: p.aggregatedOnBldrStore ? '#065F46' : '#6B7280',
                            cursor: 'pointer',
                          }}
                        >
                          {p.aggregatedOnBldrStore ? 'Live on bldr' : 'Partner Only'}
                        </button>
                      </td>

                      {/* Featured on Hero */}
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => toggleFeatured(p.id)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: p.featuredOnBldr ? '#FDE68A' : '#E5E7EB',
                            background: p.featuredOnBldr ? '#FEF3C7' : 'transparent',
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 600,
                            color: p.featuredOnBldr ? '#B45309' : '#9CA3AF',
                          }}
                        >
                          {p.featuredOnBldr ? 'Spotlight' : 'Standard'}
                        </button>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}><StatusPill status={p.status} /></td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button onClick={() => toggleStatus(p.id)} style={{ fontSize: 11, color: p.status === 'Published' ? '#92400E' : '#065F46', fontWeight: 600, background: 'none', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {p.status === 'Published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button onClick={() => deleteProduct(p.id)} style={{ fontSize: 11, color: '#991B1B', fontWeight: 600, background: 'none', border: '1px solid #FCA5A5', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Add Listing / Course</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Listing Title</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced System Architecture"
                  value={newProduct.title}
                  onChange={e => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Brand / Venture</label>
                  <select
                    value={newProduct.brand}
                    onChange={e => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                  >
                    {BRANDS.filter(b => b !== 'All Brands').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Provider / Instructor</label>
                  <input
                    type="text"
                    placeholder="e.g. TechBridge Labs"
                    value={newProduct.provider}
                    onChange={e => setNewProduct(prev => ({ ...prev, provider: e.target.value }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Price (EGP)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProduct.price}
                    onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Type</label>
                  <select value={newProduct.type} onChange={e => setNewProduct(prev => ({ ...prev, type: e.target.value }))} style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}>
                    {['Course', 'Workshop', 'Book', 'Event', 'Assessment'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Sale Mode */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Sale Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setNewProduct(prev => ({ ...prev, saleMode: 'DIRECT' }))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: newProduct.saleMode === 'DIRECT' ? '2px solid var(--brand)' : '1px solid var(--border-strong)',
                      background: newProduct.saleMode === 'DIRECT' ? 'rgba(38,60,139,0.06)' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>DIRECT</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Checkout via bldr Hub (Routes to {newProduct.ventureId})
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewProduct(prev => ({ ...prev, saleMode: 'REDIRECT' }))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: newProduct.saleMode === 'REDIRECT' ? '2px solid var(--brand)' : '1px solid var(--border-strong)',
                      background: newProduct.saleMode === 'REDIRECT' ? 'rgba(38,60,139,0.06)' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>REDIRECT</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Redirect student to brand URL
                    </div>
                  </button>
                </div>
              </div>

              {/* Redirect URL input if REDIRECT */}
              {newProduct.saleMode === 'REDIRECT' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>External Brand Redirect URL</label>
                  <input
                    type="url"
                    placeholder="https://brand.com/course/sample"
                    value={newProduct.redirectUrl}
                    onChange={e => setNewProduct(prev => ({ ...prev, redirectUrl: e.target.value }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="aggCheck"
                  checked={newProduct.aggregatedOnBldrStore}
                  onChange={e => setNewProduct(prev => ({ ...prev, aggregatedOnBldrStore: e.target.checked }))}
                />
                <label htmlFor="aggCheck" style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>
                  Showcase on bldr Marketplace Storefront (Aggregator)
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 11, border: '1px solid var(--border-strong)', borderRadius: 8, background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={handleAdd} style={{ flex: 1, padding: 11, border: 'none', borderRadius: 8, background: 'var(--brand)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Add Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
