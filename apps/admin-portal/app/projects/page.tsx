'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

interface ProjectListing {
  id: string;
  title: string;
  brand: string;
  ventureId: string;
  client: string;
  category: 'Engineering' | 'Design System' | 'Venture Build' | 'Academy Platform';
  saleMode: 'DIRECT' | 'REDIRECT';
  redirectUrl?: string;
  price: number;
  aggregatedOnBldr: boolean;
  isSpotlight: boolean;
  status: 'Published' | 'Draft';
  deliverablesCount: number;
  created: string;
}

const INITIAL_PROJECTS: ProjectListing[] = [
  {
    id: 'prj-101',
    title: 'EdTech Scalable LMS Architecture',
    brand: 'bldr',
    ventureId: 'bldr',
    client: 'StudyHub Academy',
    category: 'Academy Platform',
    saleMode: 'DIRECT',
    price: 35000,
    aggregatedOnBldr: true,
    isSpotlight: true,
    status: 'Published',
    deliverablesCount: 8,
    created: '2026-08-14',
  },
  {
    id: 'prj-102',
    title: 'Fintech Dual-Rail Gateway Integration',
    brand: 'bldr',
    ventureId: 'bldr',
    client: 'Apex Classes',
    category: 'Engineering',
    saleMode: 'DIRECT',
    price: 48000,
    aggregatedOnBldr: true,
    isSpotlight: true,
    status: 'Published',
    deliverablesCount: 12,
    created: '2026-08-20',
  },
  {
    id: 'prj-103',
    title: 'Medical Education Portal & Student App',
    brand: 'EL HESA',
    ventureId: 'venture_elhesa',
    client: 'EL HESA Institute',
    category: 'Venture Build',
    saleMode: 'REDIRECT',
    redirectUrl: 'https://elhesa.org/case-studies/medical-portal',
    price: 0,
    aggregatedOnBldr: true,
    isSpotlight: false,
    status: 'Published',
    deliverablesCount: 6,
    created: '2026-09-02',
  },
  {
    id: 'prj-104',
    title: 'Corporate Upskilling Design System',
    brand: 'Career Hub',
    ventureId: 'venture_careerhub',
    client: 'Cairo Corporate Network',
    category: 'Design System',
    saleMode: 'REDIRECT',
    redirectUrl: 'https://careerhub.eg/work/corporate-design-system',
    price: 0,
    aggregatedOnBldr: false,
    isSpotlight: false,
    status: 'Draft',
    deliverablesCount: 5,
    created: '2026-09-12',
  },
];

const BRANDS = ['All Brands', 'bldr', 'StudyHub', 'EL HESA', 'Apex Classes', 'Career Hub'];
const SALE_MODES = ['All Modes', 'DIRECT', 'REDIRECT'];

function StatusPill({ status }: { status: 'Published' | 'Draft' }) {
  const isPub = status === 'Published';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        color: isPub ? '#065F46' : '#92400E',
        background: isPub ? '#ECFDF5' : '#FEF3C7',
        padding: '3px 9px',
        borderRadius: 9999,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isPub ? '#10B981' : '#F59E0B' }} />
      {status}
    </span>
  );
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectListing[]>(INITIAL_PROJECTS);
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedMode, setSelectedMode] = useState('All Modes');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState<{
    title: string;
    brand: string;
    ventureId: string;
    client: string;
    category: 'Engineering' | 'Design System' | 'Venture Build' | 'Academy Platform';
    saleMode: 'DIRECT' | 'REDIRECT';
    redirectUrl: string;
    price: number;
    aggregatedOnBldr: boolean;
  }>({
    title: '',
    brand: 'bldr',
    ventureId: 'bldr',
    client: '',
    category: 'Venture Build',
    saleMode: 'DIRECT',
    redirectUrl: '',
    price: 0,
    aggregatedOnBldr: true,
  });

  const filtered = projects.filter((p) => {
    const matchesBrand = selectedBrand === 'All Brands' || p.brand === selectedBrand;
    const matchesMode = selectedMode === 'All Modes' || p.saleMode === selectedMode;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.ventureId.toLowerCase().includes(search.toLowerCase());
    return matchesBrand && matchesMode && matchesSearch;
  });

  const handleBrandChange = (brand: string) => {
    const ventureMap: Record<string, string> = {
      bldr: 'bldr',
      StudyHub: 'venture_studyhub',
      'EL HESA': 'venture_elhesa',
      'Apex Classes': 'venture_apex',
      'Career Hub': 'venture_careerhub',
    };
    setNewProject((prev) => ({
      ...prev,
      brand,
      ventureId: ventureMap[brand] || 'bldr',
    }));
  };

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;

    const createdItem: ProjectListing = {
      id: `prj-${Date.now().toString().slice(-4)}`,
      title: newProject.title,
      brand: newProject.brand,
      ventureId: newProject.ventureId,
      client: newProject.client || 'Internal Portfolio',
      category: newProject.category,
      saleMode: newProject.saleMode,
      redirectUrl: newProject.saleMode === 'REDIRECT' ? newProject.redirectUrl : undefined,
      price: Number(newProject.price) || 0,
      aggregatedOnBldr: newProject.aggregatedOnBldr,
      isSpotlight: false,
      status: 'Published',
      deliverablesCount: 1,
      created: new Date().toISOString().split('T')[0],
    };

    setProjects([createdItem, ...projects]);
    setShowAdd(false);
    setNewProject({
      title: '',
      brand: 'bldr',
      ventureId: 'bldr',
      client: '',
      category: 'Venture Build',
      saleMode: 'DIRECT',
      redirectUrl: '',
      price: 0,
      aggregatedOnBldr: true,
    });
  };

  const toggleAggregated = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, aggregatedOnBldr: !p.aggregatedOnBldr } : p))
    );
  };

  const toggleSpotlight = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSpotlight: !p.isSpotlight } : p))
    );
  };

  const toggleStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />

      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
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
              Projects & Case Studies Catalog
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {filtered.length} of {projects.length} Projects
            </span>
            <button
              onClick={() => setShowAdd(true)}
              style={{
                background: 'var(--brand)',
                color: 'white',
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + Add Project
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 32 }}>
          {/* Authority & Routing Architecture Banner */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 24,
              fontSize: 13,
              color: '#334155',
              lineHeight: 1.5,
            }}
          >
            <strong>Project Catalog & Sale Mode Routing:</strong> Every project can either sell directly via the Central Payment Hub (using the listing's own <code>venture_id</code> for deposit/engagement checkout) or redirect out to the brand's external portfolio site.
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Projects', val: projects.length, sub: 'Across all internal brands' },
              { label: 'Direct Sell Projects', val: projects.filter(p => p.saleMode === 'DIRECT').length, sub: 'Checkout via venture_id' },
              { label: 'External Redirects', val: projects.filter(p => p.saleMode === 'REDIRECT').length, sub: 'Redirects to brand site' },
              { label: 'Showcase on bldr', val: projects.filter(p => p.aggregatedOnBldr).length, sub: 'Live on bldr management' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'white', borderRadius: 10, border: '1px solid var(--border)', padding: '16px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search projects, clients, or ventures..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 14px',
                border: '1px solid var(--border-strong)',
                borderRadius: 8,
                fontSize: 13,
                width: 280,
                outline: 'none',
                background: 'white',
              }}
            />

            <div style={{ display: 'flex', gap: 6 }}>
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: selectedBrand === b ? 'var(--brand)' : 'var(--border-strong)',
                    background: selectedBrand === b ? 'rgba(38,60,139,0.08)' : 'white',
                    color: selectedBrand === b ? 'var(--brand)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              {SALE_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: selectedMode === m ? '#0F172A' : 'var(--border)',
                    background: selectedMode === m ? '#0F172A' : 'white',
                    color: selectedMode === m ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)' }}>
                  {['Project / Initiative', 'Owning Brand & Venture', 'Category', 'Sale Mode & Routing', 'Commercial Terms', 'bldr Showcase', 'Spotlight', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-muted)',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {/* Project Title */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Client: {p.client}</div>
                    </td>

                    {/* Brand & Venture */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#1E293B', padding: '2px 8px', borderRadius: 4 }}>
                        {p.brand}
                      </span>
                      <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 3, fontFamily: 'monospace' }}>
                        {p.ventureId}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      {p.category}
                    </td>

                    {/* Sale Mode & Routing */}
                    <td style={{ padding: '14px 16px' }}>
                      {p.saleMode === 'DIRECT' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: 4, width: 'fit-content' }}>
                            DIRECT CHECKOUT
                          </span>
                          <span style={{ fontSize: 10.5, color: '#64748B' }}>
                            Settles to {p.ventureId}
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: 4, width: 'fit-content' }}>
                            EXTERNAL REDIRECT
                          </span>
                          <span style={{ fontSize: 10.5, color: '#64748B', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.redirectUrl || 'External site'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Price / Retainer */}
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {p.price > 0 ? `EGP ${p.price.toLocaleString()}` : 'Informational'}
                    </td>

                    {/* bldr Showcase Toggle */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => toggleAggregated(p.id)}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          border: 'none',
                          background: p.aggregatedOnBldr ? '#E8EEF7' : '#F1F5F9',
                          color: p.aggregatedOnBldr ? '#263C8B' : '#64748B',
                        }}
                      >
                        {p.aggregatedOnBldr ? 'Live on bldr' : 'Unlisted'}
                      </button>
                    </td>

                    {/* Spotlight */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => toggleSpotlight(p.id)}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          border: 'none',
                          background: p.isSpotlight ? '#FEF3C7' : '#F1F5F9',
                          color: p.isSpotlight ? '#92400E' : '#64748B',
                        }}
                      >
                        {p.isSpotlight ? 'Spotlight' : 'Standard'}
                      </button>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <StatusPill status={p.status} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => toggleStatus(p.id)}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: 6,
                            background: 'none',
                            border: '1px solid var(--border-strong)',
                            cursor: 'pointer',
                            color: p.status === 'Published' ? '#92400E' : '#065F46',
                          }}
                        >
                          {p.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: 6,
                            background: 'none',
                            border: '1px solid #FCA5A5',
                            color: '#991B1B',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
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

      {/* Add Project Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 540, boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: 0 }}>Add Project Listing</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Scalable Multi-Brand LMS Engine"
                  value={newProject.title}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Brand / Venture</label>
                  <select
                    value={newProject.brand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  >
                    {BRANDS.filter((b) => b !== 'All Brands').map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Client / Beneficiary</label>
                  <input
                    type="text"
                    placeholder="e.g. StudyHub Egypt"
                    value={newProject.client}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, client: e.target.value }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, category: e.target.value as any }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  >
                    {['Engineering', 'Design System', 'Venture Build', 'Academy Platform'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Price / Retainer (EGP)</label>
                  <input
                    type="number"
                    placeholder="0 if informational"
                    value={newProject.price || ''}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Sale Mode Selector */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Sale Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setNewProject((prev) => ({ ...prev, saleMode: 'DIRECT' }))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: newProject.saleMode === 'DIRECT' ? '2px solid var(--brand)' : '1px solid var(--border-strong)',
                      background: newProject.saleMode === 'DIRECT' ? 'rgba(38,60,139,0.06)' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>DIRECT</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      Sell on bldr Hub (Routes to {newProject.ventureId})
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewProject((prev) => ({ ...prev, saleMode: 'REDIRECT' }))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: newProject.saleMode === 'REDIRECT' ? '2px solid var(--brand)' : '1px solid var(--border-strong)',
                      background: newProject.saleMode === 'REDIRECT' ? 'rgba(38,60,139,0.06)' : 'white',
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
              {newProject.saleMode === 'REDIRECT' && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>External Brand Redirect URL</label>
                  <input
                    type="url"
                    placeholder="https://brand.com/projects/example"
                    value={newProject.redirectUrl}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, redirectUrl: e.target.value }))}
                    style={{ width: '100%', padding: '9px 13px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="aggCheckPrj"
                  checked={newProject.aggregatedOnBldr}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, aggregatedOnBldr: e.target.checked }))}
                />
                <label htmlFor="aggCheckPrj" style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>
                  Showcase on bldr Management Storefront
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                style={{ flex: 1, padding: 11, border: '1px solid var(--border-strong)', borderRadius: 8, background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProject}
                style={{ flex: 1, padding: 11, border: 'none', borderRadius: 8, background: 'var(--brand)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
