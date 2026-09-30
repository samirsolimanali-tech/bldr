'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

/* ─── Mock Data ─────────────────────────────────────────────── */
interface Provider {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Suspended';
  revenue: number;
  products: number;
  services: number;
  enrolled: number;
  joined: string;
  avatar: string;
  color: string;
  paymentMethods: string[];
  description: string;
}

const PROVIDERS: Provider[] = [
  { id: 'p1', name: 'StudyHub Academy', type: 'EdTech', email: 'hello@studyhub.io', phone: '+966 50 111 2233', status: 'Active', revenue: 312000, products: 8, services: 2, enrolled: 1240, joined: '2025-01-12', avatar: 'SH', color: '#0EA5E9', paymentMethods: ['Card', 'Mada', 'Apple Pay'], description: 'Leading EdTech platform offering structured bootcamps and cohort programs.' },
  { id: 'p2', name: 'Sidekick Studio', type: 'Creative & Marketing', email: 'work@sidekick.studio', phone: '+966 55 222 3344', status: 'Active', revenue: 198500, products: 2, services: 12, enrolled: 340, joined: '2025-02-08', avatar: 'SS', color: '#10B981', paymentMethods: ['Card', 'Bank Transfer'], description: 'Full-service creative agency specializing in brand identity and performance marketing.' },
  { id: 'p3', name: 'TechBridge Labs', type: 'Software', email: 'team@techbridge.dev', phone: '+966 54 333 4455', status: 'Active', revenue: 445000, products: 5, services: 8, enrolled: 680, joined: '2025-01-28', avatar: 'TB', color: '#7C3AED', paymentMethods: ['Card', 'Mada', 'Apple Pay', 'Bank Transfer'], description: 'Software development and tech consulting firm focused on scalable SaaS products.' },
  { id: 'p4', name: 'GrowthCo MENA', type: 'Marketing', email: 'info@growthco.mena', phone: '+966 56 444 5566', status: 'Pending', revenue: 0, products: 0, services: 3, enrolled: 0, joined: '2026-09-20', avatar: 'GC', color: '#F59E0B', paymentMethods: [], description: 'Growth marketing agency specializing in MENA market expansion for e-commerce brands.' },
  { id: 'p5', name: 'Apex Consulting', type: 'Strategy', email: 'partners@apexco.sa', phone: '+966 50 555 6677', status: 'Active', revenue: 87200, products: 1, services: 4, enrolled: 120, joined: '2025-03-15', avatar: 'AC', color: '#EF4444', paymentMethods: ['Card', 'Bank Transfer'], description: 'Business strategy and advisory firm serving C-suite executives across the GCC.' },
  { id: 'p6', name: 'EL HESA Institute', type: 'Education', email: 'admin@elhesa.sa', phone: '+966 53 666 7788', status: 'Active', revenue: 203000, products: 12, services: 0, enrolled: 890, joined: '2025-04-02', avatar: 'EH', color: '#D10721', paymentMethods: ['Card', 'Mada', 'STC Pay'], description: 'Academic institution offering professional certifications and executive education programs.' },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, {bg: string; color: string}> = {
    Active:    { bg: '#ECFDF5', color: '#065F46' },
    Pending:   { bg: '#FFFBEB', color: '#92400E' },
    Suspended: { bg: '#FEF2F2', color: '#991B1B' },
  };
  const s = map[status] || map.Active;
  return <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{status}</span>;
}

export default function ProvidersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = PROVIDERS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Providers CRM</h1>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            + Add Provider
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Total Providers', val: PROVIDERS.length },
              { label: 'Active', val: PROVIDERS.filter(p => p.status === 'Active').length },
              { label: 'Pending', val: PROVIDERS.filter(p => p.status === 'Pending').length },
              { label: 'Total Revenue', val: `EGP ${(PROVIDERS.reduce((s, p) => s + p.revenue, 0) / 1000).toFixed(0)}K` },
            ].map((s) => (
              <div key={s.label} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search providers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, maxWidth: 320, padding: '9px 14px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: 'var(--text-primary)' }}
            />
            {['All', 'Active', 'Pending', 'Suspended'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid var(--border-strong)', background: statusFilter === s ? 'var(--brand)' : 'white', color: statusFilter === s ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Provider', 'Type', 'Status', 'Revenue', 'Products', 'Services', 'Enrolled', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>{p.avatar}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{p.type}</td>
                    <td style={{ padding: '14px 16px' }}><StatusPill status={p.status} /></td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      EGP {p.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', textAlign: 'center' }}>{p.products}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', textAlign: 'center' }}>{p.services}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', textAlign: 'center' }}>{p.enrolled.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{p.joined}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/providers/${p.id}`} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', padding: '4px 10px', border: '1px solid var(--brand)', borderRadius: 6 }}>
                          View
                        </Link>
                        <button style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, background: 'none', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Provider Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 540, boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Add New Provider</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Company Name', placeholder: 'e.g. StudyHub Academy' },
                { label: 'Contact Email', placeholder: 'contact@company.com' },
                { label: 'Phone', placeholder: '+966 50 000 0000' },
                { label: 'Business Type', placeholder: 'EdTech, Marketing, Software...' },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{field.label}</label>
                  <input placeholder={field.placeholder} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Description</label>
                <textarea placeholder="Brief description of the provider..." rows={3} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '11px', border: '1px solid var(--border-strong)', borderRadius: 8, background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 8, background: 'var(--brand)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Create Provider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
