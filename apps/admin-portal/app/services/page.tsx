'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

interface Service {
  id: string;
  title: string;
  category: string;
  provider: string;
  startingPrice: string;
  duration: string;
  status: 'Active' | 'Draft' | 'Archived';
  ordersCount: number;
  revenue: number;
}

const INITIAL_SERVICES: Service[] = [
  { id: 'srv-1', title: 'Performance Ads & Paid Growth', category: 'Growth', provider: 'GrowthCo MENA', startingPrice: 'EGP 12,000/mo', duration: 'Ongoing', status: 'Active', ordersCount: 28, revenue: 336000 },
  { id: 'srv-2', title: 'Brand Identity & Design System', category: 'Branding', provider: 'Sidekick Studio', startingPrice: 'EGP 18,500', duration: '3-4 Weeks', status: 'Active', ordersCount: 19, revenue: 351500 },
  { id: 'srv-3', title: 'Web & Platform Engineering', category: 'Software', provider: 'TechBridge Labs', startingPrice: 'EGP 35,000', duration: '6-8 Weeks', status: 'Active', ordersCount: 14, revenue: 490000 },
  { id: 'srv-4', title: 'Media & Video Production', category: 'Creative', provider: 'Sidekick Studio', startingPrice: 'EGP 15,000', duration: '2 Weeks', status: 'Active', ordersCount: 22, revenue: 330000 },
  { id: 'srv-5', title: 'EdTech Course Cohort Setup', category: 'EdTech', provider: 'StudyHub Academy', startingPrice: 'EGP 8,500', duration: '2 Weeks', status: 'Active', ordersCount: 35, revenue: 297500 },
  { id: 'srv-6', title: 'Strategic Advisory & Audits', category: 'Strategy', provider: 'Apex Consulting', startingPrice: 'EGP 22,000', duration: '1 Month', status: 'Draft', ordersCount: 3, revenue: 66000 },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Software');
  const [newProvider, setNewProvider] = useState('TechBridge Labs');
  const [newPrice, setNewPrice] = useState('EGP 15,000');

  const categories = ['All', 'Growth', 'Branding', 'Software', 'Creative', 'EdTech', 'Strategy'];

  const filtered = services.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newS: Service = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      category: newCategory,
      provider: newProvider,
      startingPrice: newPrice,
      duration: '4 Weeks',
      status: 'Active',
      ordersCount: 0,
      revenue: 0,
    };
    setServices([newS, ...services]);
    setShowAddModal(false);
    setNewTitle('');
  };

  const toggleStatus = (id: string) => {
    setServices(services.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Active' ? 'Draft' : 'Active' };
      }
      return s;
    }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Services Catalog Management</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Configure service offerings, partner assignments, and pricing</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            + Create Service
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Services', val: services.length },
              { label: 'Active in Storefront', val: services.filter(s => s.status === 'Active').length },
              { label: 'Completed Engagements', val: services.reduce((acc, s) => acc + s.ordersCount, 0) },
              { label: 'Services Volume', val: `EGP ${(services.reduce((acc, s) => acc + s.revenue, 0) / 1000).toFixed(0)}K` },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{kpi.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search service title or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, maxWidth: 360, padding: '9px 14px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid var(--border-strong)',
                    background: categoryFilter === cat ? 'var(--brand)' : 'white',
                    color: categoryFilter === cat ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Service Offering', 'Category', 'Assigned Provider', 'Pricing', 'Total Orders', 'Revenue', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {s.id} · {s.duration}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'var(--bg-canvas)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                        {s.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {s.provider}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.startingPrice}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
                      {s.ordersCount} deals
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--brand)' }}>
                      EGP {s.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: s.status === 'Active' ? '#ECFDF5' : '#FFFBEB',
                        color: s.status === 'Active' ? '#065F46' : '#92400E',
                      }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => toggleStatus(s.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          border: '1px solid var(--border-strong)',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        {s.status === 'Active' ? 'Deactivate' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 500, width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Add New Service Offering</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Service Title</label>
                <input
                  required
                  placeholder="e.g. AI Workflow Automation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14 }}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Provider</label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14 }}
                  >
                    <option value="TechBridge Labs">TechBridge Labs</option>
                    <option value="Sidekick Studio">Sidekick Studio</option>
                    <option value="GrowthCo MENA">GrowthCo MENA</option>
                    <option value="StudyHub Academy">StudyHub Academy</option>
                    <option value="Apex Consulting">Apex Consulting</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Starting Price</label>
                <input
                  placeholder="EGP 15,000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'white', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--brand)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
