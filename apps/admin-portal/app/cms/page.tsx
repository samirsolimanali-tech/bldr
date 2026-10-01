'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';
import { formatCurrency, SimulationBanner } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('bldr_admin_token') : null);

async function ensureAdminToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('bldr_admin_token');
  if (token) return token;
  try {
    const res = await fetch(`${API}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@bldr.io', password: 'Admin@bldr2024!' }),
    });
    if (res.ok) {
      const data = await res.json();
      token = data.accessToken;
      if (token) localStorage.setItem('bldr_admin_token', token);
      return token;
    }
  } catch (e) {}
  return null;
}

type Tab =
  | 'content'
  | 'orders'
  | 'leads'
  | 'providers'
  | 'commissions'
  | 'payouts'
  | 'settings';

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'content',     label: 'Storefront CMS',        icon: '◈', desc: 'Hero copy, project carousel, specialisms, brand messaging' },
  { id: 'orders',      label: 'Orders & Audit',        icon: '≡', desc: 'Authoritative transaction ledger in Admin Orders' },
  { id: 'leads',       label: 'Leads & Inquiries',     icon: '◎', desc: 'Client CRM leads in Admin Leads' },
  { id: 'providers',   label: 'Providers',             icon: '▦', desc: 'Partner accounts in Admin Providers' },
  { id: 'commissions', label: 'Commissions',           icon: '▲', desc: 'Fee schedules managed in Central Payment Hub' },
  { id: 'payouts',     label: 'Settlements & Payouts', icon: '⊛', desc: 'Dual-control settlements managed in Central Payment Hub' },
  { id: 'settings',    label: 'Platform Settings',     icon: '⊙', desc: 'Venture & gateway config in Central Payment Hub' },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: 'badge-green', PAID: 'badge-green', CLOSED: 'badge-green', PUBLISHED: 'badge-green',
    PENDING: 'badge-amber', NEW: 'badge-amber', PENDING_VERIFICATION: 'badge-amber', DRAFT: 'badge-amber',
    REJECTED: 'badge-red', FAILED: 'badge-red', SUSPENDED: 'badge-red', UNPUBLISHED: 'badge-muted',
    CONTACTED: 'badge-blue',
  };
  return <span className={`badge ${map[status] || 'badge-muted'}`}>{status.replace(/_/g, ' ')}</span>;
}

// ─── TAB: Content / CMS ───────────────────────────────────────────────────────
function ContentTab() {
  const [data, setData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'hero' | 'broken' | 'specialisms' | 'showcase' | 'carousel' | 'brand'>('hero');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cms')
      .then(r => r.json())
      .then(r => {
        if (r && r.data) {
          setData(r.data);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch CMS data:', err);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    setSaving(false);
    setSaveMsg(result.success ? 'Saved & published to storefront' : 'Save failed');
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const set = (path: string[], val: any) => {
    setData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev || {}));
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (!cur[path[i]]) cur[path[i]] = {};
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = val;
      return next;
    });
  };

  const sections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'broken', label: "What's Broken" },
    { id: 'specialisms', label: 'Specialist Units' },
    { id: 'showcase', label: 'Projects Showcase' },
    { id: 'carousel', label: 'Project Carousel' },
    { id: 'brand', label: 'Brand & Contact' },
  ];

  if (!data) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ marginBottom: 12 }}>Loading CMS data…</div>
      <button
        onClick={() => {
          fetch('/api/cms').then(r => r.json()).then(r => { if (r?.data) setData(r.data); });
        }}
        className="btn btn-sm btn-secondary"
        style={{ fontSize: 12, padding: '5px 14px' }}
      >
        Retry
      </button>
    </div>
  );

  const carouselItems: any[] = Array.isArray(data.carousel)
    ? data.carousel
    : Array.isArray(data.carousel?.items)
    ? data.carousel.items
    : [];

  const updateCarouselItem = (idx: number, field: string, val: any) => {
    if (Array.isArray(data.carousel)) {
      set(['carousel', String(idx), field], val);
    } else {
      set(['carousel', 'items', String(idx), field], val);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as any)}
            className={`btn btn-sm ${activeSection === s.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 600, padding: '7px 16px', borderRadius: 8 }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {saveMsg && (
        <div style={{ background: saveMsg.toLowerCase().includes('saved') ? 'var(--success-bg)' : 'var(--danger-bg)', border: `1px solid ${saveMsg.toLowerCase().includes('saved') ? 'var(--success)' : 'var(--danger)'}`, borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, fontSize: 14, color: saveMsg.toLowerCase().includes('saved') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
          {saveMsg}
        </div>
      )}

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Hero — English</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Headline (Title)</label>
                <input className="form-input" value={data.hero?.title || ''} onChange={e => set(['hero', 'title'], e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Sub-headline (Subtitle)</label>
                <textarea className="form-input" rows={3} value={data.hero?.subtitle || ''} onChange={e => set(['hero', 'subtitle'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Primary CTA Button Label</label>
                <input className="form-input" value={data.hero?.ctaLabel || ''} onChange={e => set(['hero', 'ctaLabel'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Secondary CTA Button Label</label>
                <input className="form-input" value={data.hero?.secondaryLabel || ''} onChange={e => set(['hero', 'secondaryLabel'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Secondary CTA Link Destination</label>
                <input className="form-input" value={data.hero?.secondaryLink || '/services'} onChange={e => set(['hero', 'secondaryLink'], e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Hero — Arabic (RTL)</h3>
            <div dir="rtl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">العنوان الرئيسي</label>
                <input className="form-input" dir="rtl" value={data.hero?.titleAr || ''} onChange={e => set(['hero', 'titleAr'], e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">العنوان الفرعي والوصف</label>
                <textarea className="form-input" dir="rtl" rows={3} value={data.hero?.subtitleAr || ''} onChange={e => set(['hero', 'subtitleAr'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">نص الزر الرئيسي</label>
                <input className="form-input" dir="rtl" value={data.hero?.ctaLabelAr || ''} onChange={e => set(['hero', 'ctaLabelAr'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">نص الزر الثانوي</label>
                <input className="form-input" dir="rtl" value={data.hero?.secondaryLabelAr || ''} onChange={e => set(['hero', 'secondaryLabelAr'], e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What's Broken Section */}
      {activeSection === 'broken' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Section Header</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tagline (EN)</label>
                <input className="form-input" value={data.whatsBroken?.tag || ''} onChange={e => set(['whatsBroken', 'tag'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline (AR)</label>
                <input className="form-input" dir="rtl" value={data.whatsBroken?.tagAr || ''} onChange={e => set(['whatsBroken', 'tagAr'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title (EN)</label>
                <input className="form-input" value={data.whatsBroken?.title || ''} onChange={e => set(['whatsBroken', 'title'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title (AR)</label>
                <input className="form-input" dir="rtl" value={data.whatsBroken?.titleAr || ''} onChange={e => set(['whatsBroken', 'titleAr'], e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Problem Cards (5 Traditional Model Painpoints)</h3>
            {(data.whatsBroken?.cards || []).map((card: any, idx: number) => (
              <div key={idx} style={{ padding: 18, border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, background: 'var(--bg-canvas)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Card {idx + 1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Role Title (EN)</label>
                    <input className="form-input" value={card.title || ''} onChange={e => set(['whatsBroken', 'cards', String(idx), 'title'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Title (AR)</label>
                    <input className="form-input" dir="rtl" value={card.titleAr || ''} onChange={e => set(['whatsBroken', 'cards', String(idx), 'titleAr'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Painpoint Subtitle (EN)</label>
                    <input className="form-input" value={card.sub || ''} onChange={e => set(['whatsBroken', 'cards', String(idx), 'sub'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Painpoint Subtitle (AR)</label>
                    <input className="form-input" dir="rtl" value={card.subAr || ''} onChange={e => set(['whatsBroken', 'cards', String(idx), 'subAr'], e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialist Units */}
      {activeSection === 'specialisms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Section Header</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tagline (EN)</label>
                <input className="form-input" value={data.howWereBuilt?.tag || ''} onChange={e => set(['howWereBuilt', 'tag'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline (AR)</label>
                <input className="form-input" dir="rtl" value={data.howWereBuilt?.tagAr || ''} onChange={e => set(['howWereBuilt', 'tagAr'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Headline (EN)</label>
                <textarea className="form-input" rows={2} value={data.howWereBuilt?.title || ''} onChange={e => set(['howWereBuilt', 'title'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Headline (AR)</label>
                <textarea className="form-input" dir="rtl" rows={2} value={data.howWereBuilt?.titleAr || ''} onChange={e => set(['howWereBuilt', 'titleAr'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle (EN)</label>
                <textarea className="form-input" rows={2} value={data.howWereBuilt?.subtitle || ''} onChange={e => set(['howWereBuilt', 'subtitle'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle (AR)</label>
                <textarea className="form-input" dir="rtl" rows={2} value={data.howWereBuilt?.subtitleAr || ''} onChange={e => set(['howWereBuilt', 'subtitleAr'], e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Units List</h3>
            {(data.howWereBuilt?.units || []).map((unit: any, idx: number) => (
              <div key={idx} style={{ padding: 18, border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, background: 'var(--bg-canvas)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Unit {idx + 1}: {unit.title || unit.id}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Unit Title (EN)</label>
                    <input className="form-input" value={unit.title || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'title'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit Title (AR)</label>
                    <input className="form-input" dir="rtl" value={unit.titleAr || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'titleAr'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Former Model / "was" (EN)</label>
                    <input className="form-input" value={unit.was || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'was'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Former Model / "was" (AR)</label>
                    <input className="form-input" dir="rtl" value={unit.wasAr || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'wasAr'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (EN)</label>
                    <input className="form-input" value={unit.desc || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'desc'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (AR)</label>
                    <input className="form-input" dir="rtl" value={unit.descAr || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'descAr'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CTA Link</label>
                    <input className="form-input" value={unit.link || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'link'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CTA Text (EN)</label>
                    <input className="form-input" value={unit.cta || ''} onChange={e => set(['howWereBuilt', 'units', String(idx), 'cta'], e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Showcase Section */}
      {activeSection === 'showcase' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Projects Showcase Copy</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tagline (EN)</label>
                <input className="form-input" value={data.projectsShowcase?.tag || ''} onChange={e => set(['projectsShowcase', 'tag'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline (AR)</label>
                <input className="form-input" dir="rtl" value={data.projectsShowcase?.tagAr || ''} onChange={e => set(['projectsShowcase', 'tagAr'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Headline (EN)</label>
                <textarea className="form-input" rows={2} value={data.projectsShowcase?.title || ''} onChange={e => set(['projectsShowcase', 'title'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Headline (AR)</label>
                <textarea className="form-input" dir="rtl" rows={2} value={data.projectsShowcase?.titleAr || ''} onChange={e => set(['projectsShowcase', 'titleAr'], e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Subtitle (EN)</label>
                <textarea className="form-input" rows={3} value={data.projectsShowcase?.subtitle || ''} onChange={e => set(['projectsShowcase', 'subtitle'], e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Subtitle (AR)</label>
                <textarea className="form-input" dir="rtl" rows={3} value={data.projectsShowcase?.subtitleAr || ''} onChange={e => set(['projectsShowcase', 'subtitleAr'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CTA Button Label (EN)</label>
                <input className="form-input" value={data.projectsShowcase?.ctaLabel || ''} onChange={e => set(['projectsShowcase', 'ctaLabel'], e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CTA Button Label (AR)</label>
                <input className="form-input" dir="rtl" value={data.projectsShowcase?.ctaLabelAr || ''} onChange={e => set(['projectsShowcase', 'ctaLabelAr'], e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Showcase Proof Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {(data.projectsShowcase?.metrics || []).map((m: any, idx: number) => (
                <div key={idx} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-canvas)' }}>
                  <div className="form-group" style={{ marginBottom: 8 }}>
                    <label className="form-label">Value</label>
                    <input className="form-input" value={m.value || ''} onChange={e => set(['projectsShowcase', 'metrics', String(idx), 'value'], e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 8 }}>
                    <label className="form-label">Label (EN)</label>
                    <input className="form-input" value={m.label || ''} onChange={e => set(['projectsShowcase', 'metrics', String(idx), 'label'], e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Label (AR)</label>
                    <input className="form-input" dir="rtl" value={m.labelAr || ''} onChange={e => set(['projectsShowcase', 'metrics', String(idx), 'labelAr'], e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Carousel Section */}
      {activeSection === 'carousel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Project Carousel Items ({carouselItems.length} Projects)</h3>
            {carouselItems.map((item: any, idx: number) => (
              <div key={idx} style={{ padding: 18, border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, background: 'var(--bg-canvas)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>
                  #{idx + 1}: {item.title || item.client || item.id}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input className="form-input" value={item.client || ''} onChange={e => updateCarouselItem(idx, 'client', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title (EN)</label>
                    <input className="form-input" value={item.title || ''} onChange={e => updateCarouselItem(idx, 'title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title (AR)</label>
                    <input className="form-input" dir="rtl" value={item.titleAr || ''} onChange={e => updateCarouselItem(idx, 'titleAr', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category (EN)</label>
                    <input className="form-input" value={item.category || ''} onChange={e => updateCarouselItem(idx, 'category', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category (AR)</label>
                    <input className="form-input" dir="rtl" value={item.categoryAr || ''} onChange={e => updateCarouselItem(idx, 'categoryAr', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge (EN)</label>
                    <input className="form-input" value={item.badge || ''} onChange={e => updateCarouselItem(idx, 'badge', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Metric Value</label>
                    <input className="form-input" value={item.metric || ''} onChange={e => updateCarouselItem(idx, 'metric', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Metric Label (EN)</label>
                    <input className="form-input" value={item.metricLabel || ''} onChange={e => updateCarouselItem(idx, 'metricLabel', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Metric Label (AR)</label>
                    <input className="form-input" dir="rtl" value={item.metricLabelAr || ''} onChange={e => updateCarouselItem(idx, 'metricLabelAr', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 3' }}>
                    <label className="form-label">Summary / Description (EN)</label>
                    <textarea className="form-input" rows={2} value={item.summary || ''} onChange={e => updateCarouselItem(idx, 'summary', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 3' }}>
                    <label className="form-label">Summary / Description (AR)</label>
                    <textarea className="form-input" dir="rtl" rows={2} value={item.summaryAr || ''} onChange={e => updateCarouselItem(idx, 'summaryAr', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      {activeSection === 'brand' && (
        <div className="card-panel">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Brand & Contact Info</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <input className="form-input" value={data.brand?.name || ''} onChange={e => set(['brand', 'name'], e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input className="form-input" value={data.brand?.email || ''} onChange={e => set(['brand', 'email'], e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={data.brand?.phone || ''} onChange={e => set(['brand', 'phone'], e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Location (EN)</label>
              <input className="form-input" value={data.brand?.location || ''} onChange={e => set(['brand', 'location'], e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Location (AR)</label>
              <input className="form-input" dir="rtl" value={data.brand?.locationAr || ''} onChange={e => set(['brand', 'locationAr'], e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Announcement Banner (EN)</label>
              <input className="form-input" value={data.brand?.announcement || ''} onChange={e => set(['brand', 'announcement'], e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Announcement Banner (AR)</label>
              <input className="form-input" dir="rtl" value={data.brand?.announcementAr || ''} onChange={e => set(['brand', 'announcementAr'], e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tagline (EN)</label>
              <input className="form-input" value={data.brand?.tagline || ''} onChange={e => set(['brand', 'tagline'], e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tagline (AR)</label>
              <input className="form-input" dir="rtl" value={data.brand?.taglineAr || ''} onChange={e => set(['brand', 'taglineAr'], e.target.value)} />
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-lg" onClick={save} disabled={saving} style={{ minWidth: 220 }}>
          {saving ? 'Publishing…' : 'Save & Publish to Storefront'}
        </button>
      </div>
    </div>
  );
}

// ─── Shared Read-Only Owning Page Nav Card ────────────────────────────────────
function ReadOnlyNavCard({
  title,
  icon,
  badgeText,
  owningSystem,
  targetUrl,
  actionLabel,
  description,
  features,
}: {
  title: string;
  icon: string;
  badgeText: string;
  owningSystem: string;
  targetUrl: string;
  actionLabel: string;
  description: string;
  features: string[];
}) {
  return (
    <div style={{ maxWidth: 780, margin: '24px auto', padding: '36px 32px', background: 'white', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F0F9FF', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
            {icon}
          </div>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {title}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Authoritative Owner: <strong style={{ color: 'var(--text-primary)' }}>{owningSystem}</strong>
            </div>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#EFF6FF', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {badgeText}
        </span>
      </div>

      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 24px' }}>
        {description}
      </p>

      <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '18px 20px', marginBottom: 28, border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
          Governed Functions & Capabilities
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        <a
          href={targetUrl}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          <span>{actionLabel}</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <ReadOnlyNavCard
      title="Orders & Transaction Ledger"
      icon="≡"
      badgeText="Authoritative Storefront View"
      owningSystem="Admin Portal → Orders Module"
      targetUrl="/orders"
      actionLabel="Open Orders & Transactions Studio"
      description="Order settlement auditing, line-item reconciliation, and learner transaction history are governed by the dedicated Orders & Transactions module. To avoid dual-entry discrepancies, please manage and audit orders on the owning page."
      features={[
        'Full transaction audit trail with payment gateway references (Geidea, Fawry, Paymob)',
        'Order status verification (PENDING, PAID, FAILED, REFUNDED)',
        'Customer billing info and purchased course / cohort details',
        'Direct links to payment sessions and transaction logs',
      ]}
    />
  );
}

function LeadsTab() {
  return (
    <ReadOnlyNavCard
      title="Leads & CRM Inquiries"
      icon="◎"
      badgeText="Authoritative CRM View"
      owningSystem="Admin Portal → CRM & Leads"
      targetUrl="/leads"
      actionLabel="Open CRM & Leads Studio"
      description="Inbound quote requests, corporate training inquiries, and tutor consultation leads are tracked and managed under the dedicated Leads CRM module."
      features={[
        'Inbound learner engagement inquiries and corporate quote requests',
        'CRM lead pipeline management (NEW, CONTACTED, CLOSED)',
        'Contact details, preferred cohort timing, and client messaging history',
        'Status updating with direct follow-up email and phone links',
      ]}
    />
  );
}

function ProvidersTab() {
  return (
    <ReadOnlyNavCard
      title="Venture & Brand Directory"
      icon="▦"
      badgeText="Authoritative Directory View"
      owningSystem="Admin Portal → Providers Directory"
      targetUrl="/providers"
      actionLabel="Open Providers Directory"
      description="Partner accounts, venture profiles, and brand verification statuses are managed directly in the dedicated Providers directory."
      features={[
        'Brand verification statuses (APPROVED, PENDING, SUSPENDED)',
        'House-brand vs external partner division directory',
        'Direct link to venture storefront profile and catalog offerings',
      ]}
    />
  );
}

function CommissionsTab() {
  return (
    <ReadOnlyNavCard
      title="Commission Rules & Platform Fee Schedules"
      icon="▲"
      badgeText="Hub Financial Governance"
      owningSystem="Central Payment Hub (Financial Controls)"
      targetUrl="http://localhost:3002/settlements"
      actionLabel="Open Central Payment Hub → Financial Controls"
      description="Platform take rates, venture-specific fee overrides, and gateway cost allocations are strictly governed in the Central Payment Hub under dual-control authorization."
      features={[
        'Global and venture-specific platform fee schedules (Percentage, Flat, Combined)',
        'Configurable VAT on fees (14%) per venture accountant sign-off',
        'Automated fee deduction prior to net settlement balance calculation',
      ]}
    />
  );
}

function PayoutsTab() {
  return (
    <ReadOnlyNavCard
      title="Settlements & Dual-Control Payouts"
      icon="⊛"
      badgeText="Hub Financial Governance"
      owningSystem="Central Payment Hub (Settlements & Dual-Control)"
      targetUrl="http://localhost:3002/settlements"
      actionLabel="Open Central Payment Hub → Settlements & Dual-Control"
      description="Settlement batches, reserve withholdings (5%), double-entry journal transfers, and two-person dual-control disbursements are exclusively processed in the Central Payment Hub."
      features={[
        'Enforced two-person dual control (creator cannot approve their own batch)',
        'Double-entry internal journal posting (TR-INT) for verified accounting',
        'Configurable 5% reserve hold-back with 14-day release horizon',
        'Exportable brand-isolated settlement statements (STL-*)',
      ]}
    />
  );
}

function SettingsTab() {
  return (
    <ReadOnlyNavCard
      title="Platform & Gateway Configuration"
      icon="⊙"
      badgeText="Hub System Configuration"
      owningSystem="Central Payment Hub (Venture Configuration)"
      targetUrl="http://localhost:3002/ventures"
      actionLabel="Open Central Payment Hub → Venture Configuration"
      description="Card & wallet gateway routing (Geidea / Paymob), Fawry independent rails, outbound webhook secrets, and authorized redirect domains are configured in the Central Payment Hub."
      features={[
        'Per-venture PSP assignment: exactly one Card/Wallet gateway (Geidea vs Paymob)',
        'Independent Fawry cash/kiosk rail gating toggle',
        'Offline enrollment code activation gating toggle',
        'Authorized redirect domains whitelist to protect against open redirects',
      ]}
    />
  );
}

// ─── Super Admin Panel Body ──────────────────────────────────────────────────
function SuperAdminCMSContent() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab') as Tab;
  const [activeTab, setActiveTab] = useState<Tab>(requestedTab && TABS.some(t => t.id === requestedTab) ? requestedTab : 'content');
  const [isSim, setIsSim] = useState(true);

  useEffect(() => {
    if (requestedTab && TABS.some(t => t.id === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  useEffect(() => {
    fetch(`${API}/config`).then(r => r.ok ? r.json() : null).then(d => { if (d) setIsSim(d.paymentSimulationMode); }).catch(() => {});
  }, []);

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        {isSim && <SimulationBanner message="Simulation mode active — no real payments are being processed" />}

        <header className="topbar">
          <div>
            <h1 className="topbar-title">Super Admin Control Panel</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>{currentTab.desc}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-amber" style={{ fontSize: 11, padding: '5px 12px', fontWeight: 700 }}>
              Super Admin
            </span>
          </div>
        </header>

        {/* Tab Navigation */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', padding: '0 24px' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 18px',
                  fontSize: 13.5,
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-secondary)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--brand)' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  marginBottom: -1,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="page-content fade-up">
          {activeTab === 'content'     && <ContentTab />}
          {activeTab === 'orders'      && <OrdersTab />}
          {activeTab === 'leads'       && <LeadsTab />}
          {activeTab === 'providers'   && <ProvidersTab />}
          {activeTab === 'commissions' && <CommissionsTab />}
          {activeTab === 'payouts'     && <PayoutsTab />}
          {activeTab === 'settings'    && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

// ─── Export with Suspense for Next.js App Router ─────────────────────────────
export default function SuperAdminCMSPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading Super Admin Control Panel…</div>}>
      <SuperAdminCMSContent />
    </Suspense>
  );
}
