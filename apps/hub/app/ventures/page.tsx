'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { matchVenture } from '../../components/HubTopBar';

/* ─── Base Ventures ─────────────────────────────────────────── */
const BASE_VENTURES = [
  { id: 'bldr', name: 'bldr (Storefront Pilot)', code: 'BLDR', color: '#D10721', type: 'Platform & Storefront (Pilot)', owner: 'bldr Admin', email: 'ops@bldr.dev', revenue: 150000, students: 48, links: 4, status: 'Active', gateway: 'Geidea + Fawry', joined: '2026-09-01' },
  { id: 'studyhub', name: 'StudyHub Academy', code: 'SH', color: '#2E6F5E', type: 'EdTech', owner: 'Ahmed Khalil', email: 'ahmed@studyhub.eg', revenue: 1420500, students: 1240, links: 8, status: 'Active', gateway: 'PSP-A (Hosted)', joined: '2025-01-12' },
  { id: 'apex', name: 'Apex Classes', code: 'AC', color: '#1B2A4A', type: 'Professional Training', owner: 'Omar Hassan', email: 'omar@apexclasses.eg', revenue: 980000, students: 680, links: 12, status: 'Active', gateway: 'PSP-A (Hosted)', joined: '2025-01-28' },
  { id: 'el-hesa', name: 'EL HESA Institute', code: 'EH', color: '#B8860B', type: 'Secondary Education', owner: 'Fatima Al-Nasser', email: 'admin@elhesa.eg', revenue: 840000, students: 890, links: 6, status: 'Active', gateway: 'PSP-B', joined: '2025-04-02' },
  { id: 'career-hub', name: 'Career Hub', code: 'CH', color: '#7A4CA0', type: 'Career Development', owner: 'Sara Ibrahim', email: 'work@careerhub.eg', revenue: 795798, students: 340, links: 5, status: 'Active', gateway: 'PSP-A (Hosted)', joined: '2025-02-08' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { Active: 'success', Pending: 'warning', Suspended: 'danger' };
  return <span className={`hub-badge ${map[status] || 'neutral'}`}>{status}</span>;
}

export default function VenturesPage() {
  const [ventures, setVentures] = useState(BASE_VENTURES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState(1);
  const [successToast, setSuccessToast] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    owner: '',
    email: '',
    type: 'EdTech Academy',
    gateway: 'Geidea Egypt',
    color: '#2E6F5E',
    customDomain: '',
    description: '',
    feePct: '3.00',
  });

  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All ventures');

  // Load custom ventures from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_custom_ventures');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Avoid duplicate IDs
          const existingIds = new Set(BASE_VENTURES.map(v => v.id));
          const uniqueCustom = parsed.filter((v: any) => !existingIds.has(v.id));
          setVentures([...BASE_VENTURES, ...uniqueCustom]);
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

  const filtered = ventures.filter(v => {
    const m = v.name.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase());
    const s = statusFilter === 'All' || v.status === statusFilter;
    const matchesVenture = matchVenture(v.name, selectedVenture);
    return m && s && matchesVenture;
  });

  const totalRev = ventures.reduce((s, v) => s + v.revenue, 0);
  const totalStudents = ventures.reduce((s, v) => s + v.students, 0);

  const handleCreateVenture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-venture';
    const initials = form.name
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase() || 'NV';

    const newVenture = {
      id: slug,
      name: form.name.trim(),
      code: initials,
      color: form.color || '#2E6F5E',
      type: form.type || 'Digital Academy',
      owner: form.owner || 'Admin',
      email: form.email || `contact@${slug}.eg`,
      revenue: 0,
      students: 0,
      links: 1,
      status: 'Active',
      gateway: form.gateway,
      joined: new Date().toISOString().split('T')[0],
    };

    // Save custom venture registry for /ventures/[id]
    const customRegistryItem = {
      id: slug,
      code: slug,
      topBarId: initials,
      displayName: form.name.trim(),
      legalName: `${form.name.trim()} LLC`,
      activityType: form.type || 'Digital Academy',
      language: 'en',
      description: form.description || `Platform and checkout services for ${form.name.trim()}`,
      primaryColor: form.color,
      secondaryColor: '#12203C',
      integrationMode: 'BOLT_ON',
      cardWalletGateway: form.gateway.toLowerCase().includes('paymob') ? 'paymob' : 'geidea',
      fawryEnabled: true,
      platformFeeModel: 'PERCENTAGE',
      platformFeePct: form.feePct || '3.00',
      platformFeeFlat: '0',
      vatOnFeesEnabled: false,
      vatRate: '0.00',
      reservePct: '5.00',
      reserveReleaseDays: '14',
      payoutCadence: 'weekly',
      payoutMinThreshold: '50000',
      apiKeyTest: `sk_test_${slug}_2026`,
      webhookSecret: `whsec_test_${slug}_sec`,
      apiKeyLive: `sk_live_${slug}_2026`,
      returnUrl: `https://${form.customDomain || slug + '.eg'}/checkout/success`,
      cancelUrl: `https://${form.customDomain || slug + '.eg'}/checkout/cancel`,
      webhookUrl: `https://api.${form.customDomain || slug + '.eg'}/webhooks/bldr`,
      supportEmail: form.email || `support@${slug}.eg`,
      domains: [
        { host: form.customDomain || `${slug}.eg`, state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' }
      ],
    };

    const updatedVentures = [...ventures, newVenture];
    setVentures(updatedVentures);

    try {
      // Persist list of custom ventures
      const customOnly = updatedVentures.filter(v => !BASE_VENTURES.some(b => b.id === v.id));
      localStorage.setItem('bldr_custom_ventures', JSON.stringify(customOnly));

      // Persist detailed registry config
      const existingRegistry = JSON.parse(localStorage.getItem('bldr_custom_registry') || '{}');
      existingRegistry[slug] = customRegistryItem;
      localStorage.setItem('bldr_custom_registry', JSON.stringify(existingRegistry));

      // Broadcast event so HubTopBar updates its dropdown immediately
      window.dispatchEvent(new CustomEvent('bldr:custom-ventures-updated', { detail: newVenture }));
    } catch (err) {}

    setShowAdd(false);
    setStep(1);
    setForm({ name: '', owner: '', email: '', type: 'EdTech Academy', gateway: 'Geidea Egypt', color: '#2E6F5E', customDomain: '', description: '', feePct: '3.00' });
    setSuccessToast(`✓ Successfully created brand "${form.name}"! Click "View →" to configure API keys and payment gateways.`);
    setTimeout(() => setSuccessToast(''), 6000);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar active="Ventures" />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Ventures"
          crumb="Ventures"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div className="hub-content" style={{ padding: '24px 28px' }}>
          {/* Action Header Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1B2A4A', margin: 0 }}>Ventures & Brand Portfolios</h2>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#E6EFEB', color: '#2E6F5E' }}>
                  Multi-Tenant
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: '#64748B', margin: '4px 0 0' }}>
                Create and manage isolated brand accounts, custom logos, payment routing, and provider settlement terms.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {successToast && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '6px 12px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                  {successToast}
                </span>
              )}
              <button
                onClick={() => {
                  setStep(1);
                  setShowAdd(true);
                }}
                className="hub-btn hub-btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  fontWeight: 800,
                  fontSize: 13,
                  borderRadius: 8,
                  background: '#2E6F5E',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(46,111,94,0.25)',
                }}
              >
                <span>+ Add New Venture / Brand</span>
              </button>
            </div>
          </div>

          {/* Summary Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Ventures', val: ventures.length, icon: '⊞' },
              { label: 'Active', val: ventures.filter(v => v.status === 'Active').length, icon: '●' },
              { label: 'Total Revenue', val: `EGP ${(totalRev / 1000).toFixed(0)}K`, icon: '▲' },
              { label: 'Total Students', val: totalStudents.toLocaleString(), icon: '◎' },
            ].map(s => (
              <div key={s.label} className="hub-kpi">
                <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                <div className="hub-kpi-value">{s.val}</div>
                <div className="hub-kpi-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="hub-filters" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              className="hub-input"
              style={{ maxWidth: 280 }}
              placeholder="Search ventures by name or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {['All', 'Active', 'Pending', 'Suspended'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`hub-btn ${statusFilter === s ? 'hub-btn-primary' : 'hub-btn-secondary'} hub-btn-sm`}>
                {s}
              </button>
            ))}
            <span style={{ fontSize: 13, color: 'var(--hub-text-3)', marginLeft: 'auto' }}>
              Showing {filtered.length} of {ventures.length} ventures
            </span>
          </div>

          {/* Table */}
          <div className="hub-card">
            <div className="hub-table-wrap">
              <table className="hub-table">
                <thead>
                  <tr>
                    {['Venture / Brand', 'Type', 'Owner', 'Revenue', 'Students', 'Links', 'Gateway', 'Status', 'Joined', 'Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '36px 16px', color: '#64748B' }}>
                        No ventures found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(v => (
                      <tr key={v.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                              {v.code}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#1B2A4A' }}>{v.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>{v.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--hub-text-2)', fontSize: 12.5 }}>{v.type}</td>
                        <td style={{ color: 'var(--hub-text-2)', fontSize: 12.5 }}>{v.owner}</td>
                        <td style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#059669' }}>
                          EGP {v.revenue.toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'center', fontSize: 12.5 }}>{v.students.toLocaleString()}</td>
                        <td style={{ textAlign: 'center', fontSize: 12.5 }}>{v.links}</td>
                        <td><span className="hub-badge accent">{v.gateway}</span></td>
                        <td><StatusBadge status={v.status} /></td>
                        <td style={{ color: 'var(--hub-text-3)', fontSize: 12 }}>{v.joined}</td>
                        <td>
                          <Link href={`/ventures/${v.id}`} className="hub-btn hub-btn-secondary hub-btn-sm" style={{ textDecoration: 'none', fontWeight: 700 }}>
                            Configure →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Venture Multi-Step Modal */}
      {showAdd && (
        <div className="hub-modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="hub-modal" style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 32px', maxWidth: 540, width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: 4, borderRadius: 999, background: step >= s ? '#2E6F5E' : '#E2E8F0', transition: 'all 0.2s' }} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#1B2A4A' }}>
                  {step === 1 && 'Step 1: Brand & Business Details'}
                  {step === 2 && 'Step 2: Brand Identity & Domain'}
                  {step === 3 && 'Step 3: Gateway & Fee Terms'}
                </h2>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  {step === 1 && 'Register identity and merchant contact information'}
                  {step === 2 && 'Customize colors, code abbreviation, and custom checkout domain'}
                  {step === 3 && 'Configure Egyptian payment gateway rails and platform fee'}
                </span>
              </div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>

            <form onSubmit={step === 3 ? handleCreateVenture : (e) => { e.preventDefault(); setStep(s => s + 1); }}>
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Venture / Brand Name *</label>
                    <input
                      className="hub-input"
                      required
                      placeholder="e.g. Future Skills Academy"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Owner / Primary Contact Name *</label>
                    <input
                      className="hub-input"
                      required
                      placeholder="e.g. Mostafa Samir"
                      value={form.owner}
                      onChange={e => setForm(p => ({ ...p, owner: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Contact Email *</label>
                    <input
                      className="hub-input"
                      type="email"
                      required
                      placeholder="contact@futureskills.eg"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Business Activity Type</label>
                    <select
                      className="hub-select"
                      style={{ width: '100%', padding: '10px 12px' }}
                      value={form.type}
                      onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    >
                      <option>EdTech Academy</option>
                      <option>Professional Training</option>
                      <option>Higher Education Cohort</option>
                      <option>Digital Goods & Content</option>
                      <option>E-Commerce Storefront</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Brand Primary Color</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="color"
                        value={form.color}
                        onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                        style={{ width: 44, height: 38, border: '1px solid #CBD5E1', borderRadius: 8, cursor: 'pointer', padding: 2 }}
                      />
                      <input
                        className="hub-input"
                        value={form.color}
                        onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                        placeholder="#2E6F5E"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Custom Checkout Domain (optional)</label>
                    <input
                      className="hub-input"
                      placeholder="pay.futureskills.eg"
                      value={form.customDomain}
                      onChange={e => setForm(p => ({ ...p, customDomain: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Brand Overview / Description</label>
                    <textarea
                      className="hub-input"
                      rows={2}
                      placeholder="Specialized corporate tech courses and cohort certifications in Egypt."
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  {/* Live Visual Brand Preview */}
                  <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Brand Hub Badge Preview
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: form.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                        {form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'NV'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1E293B', fontSize: 14 }}>{form.name || 'Brand Name'}</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>{form.customDomain || `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'brand'}.eg`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>Primary Payment Gateway</label>
                    <select
                      className="hub-select"
                      style={{ width: '100%', padding: '10px 12px' }}
                      value={form.gateway}
                      onChange={e => setForm(p => ({ ...p, gateway: e.target.value }))}
                    >
                      <option>Geidea Egypt (Card & Wallet)</option>
                      <option>Paymob Egypt (Accept)</option>
                      <option>Fawry Pay Corporate</option>
                      <option>Multi-Gateway Smart Route</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#334155' }}>
                      Bldr Platform Retention Fee (% of gross tuition):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="hub-input"
                      value={form.feePct}
                      onChange={e => setForm(p => ({ ...p, feePct: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: '12px 14px', fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Default Settlement Policy:</div>
                    <div style={{ color: '#047857' }}>
                      Weekly internal ledger settlement credited to the brand's operating balance after deducting the {form.feePct}% platform fee and 5% rolling reserve.
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {step > 1 && (
                  <button
                    type="button"
                    className="hub-btn hub-btn-secondary"
                    onClick={() => setStep(s => s - 1)}
                    style={{ flex: 1, padding: '10px 0', fontWeight: 700 }}
                  >
                    ← Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    className="hub-btn hub-btn-primary"
                    onClick={() => {
                      if (step === 1 && !form.name.trim()) return alert('Please enter a venture name');
                      setStep(s => s + 1);
                    }}
                    style={{ flex: 1, padding: '10px 0', fontWeight: 800, background: '#2E6F5E', color: 'white', borderRadius: 8 }}
                  >
                    Next: Brand Setup →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="hub-btn hub-btn-primary"
                    style={{ flex: 1, padding: '10px 0', fontWeight: 800, background: '#059669', color: 'white', borderRadius: 8 }}
                  >
                    Create & Register Brand ✓
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
