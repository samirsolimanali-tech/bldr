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
  | 'products'
  | 'providers'
  | 'orders'
  | 'leads'
  | 'commissions'
  | 'payouts'
  | 'settings';

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'content',     label: 'Storefront CMS',    icon: '◈',  desc: 'Hero copy, project carousel, specialisms, brand messaging' },
  { id: 'products',    label: 'Products & Services', icon: '⊞', desc: 'Create, edit, price, and publish catalog offerings' },
  { id: 'providers',   label: 'Providers',         icon: '▦',  desc: 'Approve, suspend, and manage partner accounts' },
  { id: 'orders',      label: 'Orders & Audit',    icon: '≡',  desc: 'Audit, settle, and approve platform and referral sales' },
  { id: 'leads',       label: 'Leads & Inquiries', icon: '◎',  desc: 'Inbound quote requests and client CRM leads' },
  { id: 'commissions', label: 'Commissions',       icon: '▲',  desc: 'Global and per-provider platform revenue rates' },
  { id: 'payouts',     label: 'Payouts',           icon: '⊛',  desc: 'Provider payout settlements and banking records' },
  { id: 'settings',    label: 'Platform Settings', icon: '⊙',  desc: 'Simulation mode, API keys, and environment config' },
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
    fetch('/api/cms').then(r => r.json()).then(r => { if (r.success && r.data) setData(r.data); });
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

  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading CMS data…</div>;

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

// ─── TAB: Products & Services (Full CRUD Studio) ──────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 1500,
    currency: 'USD',
    category: 'Education',
    tags: '',
    purchaseType: 'NATIVE',
    engagementType: 'BUY_NOW',
    redirectUrl: '',
    providerId: '',
    isPublished: true,
    isFeatured: false,
  });

  const fetchProducts = async () => {
    const token = await ensureAdminToken();
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/listings`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    const token = await ensureAdminToken();
    try {
      const res = await fetch(`${API}/admin/providers?limit=50`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        setProviders(data.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProviders();
  }, []);

  const openCreateModal = () => {
    const defaultProvider = providers.find(p => p.isHouseBrand) || providers[0];
    setForm({
      title: '',
      description: '',
      price: 2500,
      currency: 'USD',
      category: 'Education',
      tags: '',
      purchaseType: 'NATIVE',
      engagementType: 'BUY_NOW',
      redirectUrl: '',
      providerId: defaultProvider?.id || '',
      isPublished: true,
      isFeatured: false,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setForm({
      title: p.title || '',
      description: p.description || '',
      price: Number(p.price) || 0,
      currency: p.currency || 'USD',
      category: p.category || 'Education',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      purchaseType: p.purchaseType || 'NATIVE',
      engagementType: p.engagementType || 'BUY_NOW',
      redirectUrl: p.redirectUrl || '',
      providerId: p.providerId || '',
      isPublished: p.isPublished ?? true,
      isFeatured: p.isFeatured ?? false,
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await ensureAdminToken();
    const payload = {
      ...form,
      price: Number(form.price),
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      redirectUrl: form.purchaseType === 'REDIRECT' ? form.redirectUrl : null,
    };

    try {
      const url = editingId ? `${API}/admin/listings/${editingId}` : `${API}/admin/listings`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save product');
      }

      setFeedback({
        type: 'success',
        message: editingId ? 'Product updated successfully.' : 'New product created and live in catalog.',
      });
      setIsModalOpen(false);
      fetchProducts();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving product' });
    }
  };

  const handleTogglePublish = async (id: string) => {
    const token = await ensureAdminToken();
    setActionLoadingId(id);
    try {
      const res = await fetch(`${API}/admin/listings/${id}/toggle-publish`, {
        method: 'PATCH',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        fetchProducts();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const token = await ensureAdminToken();
    setActionLoadingId(id);
    try {
      const res = await fetch(`${API}/admin/listings/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        fetchProducts();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    const token = await ensureAdminToken();
    setActionLoadingId(id);
    try {
      const res = await fetch(`${API}/admin/listings/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: `Product "${title}" removed.` });
        fetchProducts();
        setTimeout(() => setFeedback(null), 3000);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered list
  const filtered = products.filter(p => {
    if (categoryFilter && p.category?.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (typeFilter && p.purchaseType !== typeFilter) return false;
    if (statusFilter === 'PUBLISHED' && !p.isPublished) return false;
    if (statusFilter === 'DRAFT' && p.isPublished) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.provider?.name?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const totalCount = products.length;
  const publishedCount = products.filter(p => p.isPublished).length;
  const nativeCount = products.filter(p => p.purchaseType === 'NATIVE').length;
  const redirectCount = products.filter(p => p.purchaseType === 'REDIRECT').length;

  return (
    <div>
      {/* 4 KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Offerings</div>
          <div className="stat-card-value">{totalCount}</div>
          <div className="stat-card-sub">Active catalog listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Live on Storefront</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>{publishedCount}</div>
          <div className="stat-card-sub">Published to customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Native Checkout</div>
          <div className="stat-card-value" style={{ color: 'var(--brand)' }}>{nativeCount}</div>
          <div className="stat-card-sub">Direct Geidea / Fawry</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">External Referrals</div>
          <div className="stat-card-value" style={{ color: 'var(--accent)' }}>{redirectCount}</div>
          <div className="stat-card-sub">HMAC tracked webhooks</div>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 14,
          fontWeight: 600,
          background: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
          color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
          border: `1px solid ${feedback.type === 'success' ? '#C2E4D2' : '#F8CCC5'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Filter and Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          <input
            className="form-input"
            placeholder="Search by title, provider, tag…"
            style={{ maxWidth: 280 }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className="form-input"
            style={{ maxWidth: 170 }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="form-input"
            style={{ maxWidth: 150 }}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Flow Types</option>
            <option value="NATIVE">Native Checkout</option>
            <option value="REDIRECT">Redirect / Referral</option>
          </select>
          <select
            className="form-input"
            style={{ maxWidth: 140 }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft / Hidden</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontWeight: 700 }}
        >
          <span style={{ fontSize: 16 }}>+</span> Add New Product / Service
        </button>
      </div>

      {/* Products Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product / Service</th>
              <th>Provider</th>
              <th>Category</th>
              <th>Price</th>
              <th>Flow</th>
              <th>Engagement</th>
              <th>Featured</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading products catalog…</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>No products match your criteria</p>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setSearchQuery(''); setCategoryFilter(''); setTypeFilter(''); setStatusFilter(''); }}>
                      Reset Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ maxWidth: 260 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                      {p.description || 'No description provided'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{p.provider?.name || 'bldr'}</span>
                      {p.provider?.isHouseBrand && (
                        <span className="badge badge-blue" style={{ fontSize: 9, padding: '2px 6px' }}>House</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-muted" style={{ fontWeight: 600 }}>{p.category}</span>
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 700 }}>
                    {formatCurrency(p.price, p.currency || 'USD')}
                  </td>
                  <td>
                    <span className={`badge ${p.purchaseType === 'NATIVE' ? 'badge-blue' : 'badge-accent'}`}>
                      {p.purchaseType === 'NATIVE' ? 'Native' : 'Referral'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-muted">
                      {p.engagementType === 'BUY_NOW' ? 'Buy Now' : 'Quote / Call'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleFeatured(p.id)}
                      disabled={actionLoadingId === p.id}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 16,
                        opacity: p.isFeatured ? 1 : 0.35,
                        transition: 'opacity 0.15s ease'
                      }}
                      title={p.isFeatured ? 'Featured on Showcase (Click to unfeature)' : 'Click to feature'}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: p.isFeatured ? '#D97706' : '#94A3B8' }}>{p.isFeatured ? '★' : '☆'}</span>
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublish(p.id)}
                      disabled={actionLoadingId === p.id}
                      className={`badge ${p.isPublished ? 'badge-green' : 'badge-amber'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Click to toggle publish status"
                    >
                      {p.isPublished ? '● Live' : '○ Draft'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(p)}
                        title="Edit product"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={actionLoadingId === p.id}
                        title="Delete product"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? 'Edit Product / Service Offering' : 'Add New Product / Service Offering'}
              </h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Product / Service Title *</label>
                <input
                  className="form-input"
                  required
                  placeholder="e.g. Full-Stack Web Development Retainer"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <input
                    className="form-input"
                    required
                    placeholder="e.g. Education, Media, Consulting"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Provider Assignment *</label>
                  <select
                    className="form-input"
                    value={form.providerId}
                    onChange={e => setForm({ ...form, providerId: e.target.value })}
                  >
                    {providers.map(prov => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name} {prov.isHouseBrand ? '(House Brand)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    className="form-input"
                    value={form.currency}
                    onChange={e => setForm({ ...form, currency: e.target.value })}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EGP">EGP</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Transaction Flow *</label>
                  <select
                    className="form-input"
                    value={form.purchaseType}
                    onChange={e => setForm({ ...form, purchaseType: e.target.value })}
                  >
                    <option value="NATIVE">Native Checkout (Geidea / Fawry)</option>
                    <option value="REDIRECT">External Referral (Webhook Attribution)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Engagement CTA *</label>
                  <select
                    className="form-input"
                    value={form.engagementType}
                    onChange={e => setForm({ ...form, engagementType: e.target.value })}
                  >
                    <option value="BUY_NOW">Instant Buy Now</option>
                    <option value="REQUEST_QUOTE">Request a Quote (Lead Form)</option>
                    <option value="BOOK_CALL">Book a Discovery Call</option>
                  </select>
                </div>
              </div>

              {form.purchaseType === 'REDIRECT' && (
                <div className="form-group">
                  <label className="form-label">Outbound Referral URL *</label>
                  <input
                    className="form-input"
                    required={form.purchaseType === 'REDIRECT'}
                    placeholder="https://partner-store.com/checkout?item=..."
                    value={form.redirectUrl}
                    onChange={e => setForm({ ...form, redirectUrl: e.target.value })}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    A secure tracking `clickId` will be appended automatically upon redirection.
                  </span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Detail the deliverable, scope, and timeline..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  className="form-input"
                  placeholder="e.g. curriculum, full-stack, retainer, cert"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  Publish Immediately (Live on Storefront)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  Highlight as Featured
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                  {editingId ? 'Save Changes' : 'Create Product Offering'}
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: Providers ───────────────────────────────────────────────────────────
function ProvidersTab() {
  const [providers, setProviders] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetch_ = async () => {
    const token = await ensureAdminToken(); if (!token) return;
    setLoading(true);
    const qs = new URLSearchParams(statusFilter ? { status: statusFilter } : {});
    const res = await fetch(`${API}/admin/providers?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProviders(data.data || []); setMeta(data.meta || { total: 0 }); setLoading(false);
  };

  useEffect(() => { fetch_(); }, [statusFilter]);

  const action = async (id: string, endpoint: string, body?: object) => {
    setActionLoading(id + endpoint);
    const token = await ensureAdminToken();
    await fetch(`${API}/admin/providers/${id}/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
    setActionLoading(null); setRejectModal(null); setRejectReason(''); fetch_();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{meta.total} registered</span>
        {['', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatusFilter(s)}>
            {s || 'All'} {s === 'PENDING' && <span className="badge badge-amber" style={{ marginLeft: 4, fontSize: 10 }}>!</span>}
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Provider</th><th>Activity / Bio</th><th>Status</th><th>Conversion Token</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              : providers.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><p>No providers found</p></div></td></tr>
              : providers.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name} {p.isHouseBrand && <span className="badge badge-blue" style={{ fontSize: 10 }}>House Brand</span>}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.slug}</div>
                  </td>
                  <td style={{ maxWidth: 260, fontSize: 13, color: 'var(--text-secondary)' }}>{p.bio || p.tagline || '—'}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    {p.conversionToken ? <code style={{ fontSize: 11, background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4 }}>{p.conversionToken.slice(0, 16)}…</code> : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.status === 'PENDING' && (
                        <>
                          <button className="btn btn-sm btn-primary" style={{ background: 'var(--green)' }} disabled={actionLoading === p.id + 'approve'} onClick={() => action(p.id, 'approve')}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setRejectModal({ id: p.id, name: p.name })}>Reject</button>
                        </>
                      )}
                      {p.status === 'APPROVED' && !p.isHouseBrand && (
                        <button className="btn btn-sm btn-secondary" style={{ color: 'var(--amber)' }} disabled={actionLoading === p.id + 'suspend'} onClick={() => action(p.id, 'suspend')}>Suspend</button>
                      )}
                      {p.status === 'SUSPENDED' && (
                        <button className="btn btn-sm btn-primary" disabled={actionLoading === p.id + 'approve'} onClick={() => action(p.id, 'approve')}>Re-activate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Reject {rejectModal.name}</h2><button className="modal-close" onClick={() => setRejectModal(null)}>✕</button></div>
            <div className="form-group" style={{ marginBottom: 20 }}><label className="form-label">Reason (optional)</label><textarea className="form-input" placeholder="Explain why…" value={rejectReason} onChange={e => setRejectReason(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-danger btn-lg" style={{ flex: 1 }} disabled={actionLoading === rejectModal.id + 'reject'} onClick={() => action(rejectModal.id, 'reject', { reason: rejectReason })}>Confirm Rejection</button>
              <button className="btn btn-secondary btn-lg" onClick={() => setRejectModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: Orders ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetch_ = async () => {
    const token = await ensureAdminToken(); if (!token) return;
    setLoading(true);
    const qs = new URLSearchParams(statusFilter ? { status: statusFilter } : {});
    try {
      const res = await fetch(`${API}/orders?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json(); setOrders(data.data || []); setMeta(data.meta || { total: 0 });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [statusFilter]);

  const approveRedirect = async (orderId: string) => {
    const token = await ensureAdminToken(); if (!token) return;
    setActionLoadingId(orderId); setFeedback(null);
    try {
      const res = await fetch(`${API}/orders/${orderId}/approve-redirect`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      setFeedback({ type: 'success', message: `Order #${orderId.slice(-8).toUpperCase()} approved & credited.` });
      fetch_();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to approve' });
    } finally { setActionLoadingId(null); }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{meta.total} total</span>
        {[{ id: '', label: 'All' }, { id: 'PENDING_VERIFICATION', label: 'Pending Verification' }, { id: 'PAID', label: 'Paid' }, { id: 'PENDING', label: 'Pending' }, { id: 'FAILED', label: 'Failed' }].map(s => (
          <button key={s.id} className={`btn btn-sm ${statusFilter === s.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatusFilter(s.id)}>{s.label}</button>
        ))}
      </div>
      {feedback && (
        <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 500, background: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)', border: `1px solid ${feedback.type === 'success' ? '#C2E4D2' : '#F8CCC5'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>✕</button>
        </div>
      )}
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Ref</th><th>Source</th><th>Provider</th><th>Customer</th><th>Gross</th><th>Commission</th><th>Net</th><th>Gateway</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              : orders.length === 0 ? <tr><td colSpan={10}><div className="empty-state"><p>No orders found</p></div></td></tr>
              : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>#{o.id.slice(-8).toUpperCase()}</td>
                  <td><span className={`badge ${o.source === 'NATIVE' ? 'badge-blue' : 'badge-accent'}`}>{o.source}</span></td>
                  <td>{o.provider?.name || '—'}</td>
                  <td style={{ fontSize: 12 }}>{o.customerEmail}</td>
                  <td className="tabular-nums" style={{ fontWeight: 600 }}>{formatCurrency(o.amount, o.currency)}</td>
                  <td className="tabular-nums" style={{ color: 'var(--amber)', fontWeight: 600 }}>{formatCurrency(o.commissionAmount || 0, o.currency)}</td>
                  <td className="tabular-nums" style={{ color: 'var(--green)', fontWeight: 600 }}>{formatCurrency(o.netAmount || 0, o.currency)}</td>
                  <td style={{ fontSize: 12 }}>{o.gatewayUsed}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {o.status === 'PENDING_VERIFICATION' && (
                      <button className="btn btn-sm btn-primary" style={{ background: 'var(--green)' }} disabled={actionLoadingId === o.id} onClick={() => approveRedirect(o.id)}>
                        {actionLoadingId === o.id ? 'Approving…' : 'Approve'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB: Leads ───────────────────────────────────────────────────────────────
function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetch_ = async () => {
    const token = await ensureAdminToken(); if (!token) return;
    setLoading(true);
    const qs = new URLSearchParams(statusFilter ? { status: statusFilter } : {});
    const res = await fetch(`${API}/leads?${qs}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json(); setLeads(data.data || []); setMeta(data.meta || { total: 0 }); setLoading(false);
  };

  useEffect(() => { fetch_(); }, [statusFilter]);

  const updateStatus = async (id: string, s: string) => {
    setUpdatingId(id);
    const token = await ensureAdminToken();
    await fetch(`${API}/leads/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: s }) });
    setUpdatingId(null); fetch_();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{meta.total} total</span>
        {['', 'NEW', 'CONTACTED', 'CLOSED'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Lead</th><th>Provider</th><th>Service</th><th>Engagement</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              : leads.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><p>No leads found</p></div></td></tr>
              : leads.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.email} {l.phone && `· ${l.phone}`}</div>
                    {l.message && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, maxWidth: 280, fontStyle: 'italic' }}>"{l.message}"</div>}
                  </td>
                  <td>{l.provider?.name || '—'}</td>
                  <td style={{ fontSize: 13 }}>{l.listing?.title || '—'}</td>
                  <td><span className="badge badge-muted">{l.engagementType}</span></td>
                  <td><StatusBadge status={l.status} /></td>
                  <td>
                    <select className="form-input" style={{ padding: '4px 8px', fontSize: 12 }} value={l.status} disabled={updatingId === l.id} onChange={e => updateStatus(l.id, e.target.value)}>
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB: Commissions ─────────────────────────────────────────────────────────
function CommissionsTab() {
  const [globalRate, setGlobalRate] = useState<number | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [newGlobalRate, setNewGlobalRate] = useState('');
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [providerRateInput, setProviderRateInput] = useState('');
  const [savingProvider, setSavingProvider] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetch_ = async () => {
    const token = await ensureAdminToken(); if (!token) return;
    const res = await fetch(`${API}/admin/commission`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setGlobalRate(data.globalRule ? Number(data.globalRule.rate) : 0.1);
    setNewGlobalRate(data.globalRule ? String(Number(data.globalRule.rate) * 100) : '10');
    const pRes = await fetch(`${API}/admin/providers?limit=50`, { headers: { Authorization: `Bearer ${token}` } });
    const pData = await pRes.json();
    setProviders(pData.data || []);
  };

  useEffect(() => { fetch_(); }, []);

  const saveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await ensureAdminToken(); if (!token) return;
    setSavingGlobal(true);
    const r = parseFloat(newGlobalRate) / 100;
    await fetch(`${API}/admin/commission/global`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ rate: r }) });
    setSavingGlobal(false); setFeedback('Global rate updated.'); setTimeout(() => setFeedback(null), 3000); fetch_();
  };

  const saveProviderRate = async (providerId: string) => {
    const token = await ensureAdminToken(); if (!token) return;
    setSavingProvider(true);
    const r = parseFloat(providerRateInput) / 100;
    await fetch(`${API}/admin/commission/provider/${providerId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ rate: r }) });
    setSavingProvider(false); setEditingProviderId(null); setFeedback('Provider rate updated.'); setTimeout(() => setFeedback(null), 3000); fetch_();
  };

  const removeProviderRate = async (providerId: string) => {
    const token = await ensureAdminToken(); if (!token) return;
    await fetch(`${API}/admin/commission/provider/${providerId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setFeedback('Provider override removed.'); setTimeout(() => setFeedback(null), 3000); fetch_();
  };

  return (
    <div style={{ maxWidth: 800 }}>
      {feedback && <div style={{ padding: '10px 16px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>{feedback}</div>}
      <div className="card-panel" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Global Commission Rate</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Applied to all sales unless a provider has a custom override.</p>
        <form onSubmit={saveGlobal} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 140 }}>
            <input type="number" min="0" max="100" step="0.5" className="form-input" value={newGlobalRate} onChange={e => setNewGlobalRate(e.target.value)} required />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>%</span>
          </div>
          <button type="submit" className="btn btn-primary" disabled={savingGlobal}>{savingGlobal ? 'Saving…' : 'Update Global Rate'}</button>
          {globalRate !== null && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Current: <strong>{(globalRate * 100).toFixed(1)}%</strong></span>}
        </form>
      </div>
      <div className="card-panel">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Provider-Specific Overrides</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Set unique commission rates per provider.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {providers.map(p => {
            const hasRule = p.commissionRules && p.commissionRules.length > 0;
            const rate = hasRule ? Number(p.commissionRules[0].rate) : null;
            const isEditing = editingProviderId === p.id;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                  {p.isHouseBrand && <span className="badge badge-blue" style={{ marginLeft: 8, fontSize: 10 }}>House Brand</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isEditing ? (
                    <>
                      <input type="number" min="0" max="100" step="0.5" className="form-input" style={{ width: 80, padding: '4px 8px' }} placeholder="%" value={providerRateInput} onChange={e => setProviderRateInput(e.target.value)} />
                      <button className="btn btn-primary btn-sm" disabled={savingProvider} onClick={() => saveProviderRate(p.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingProviderId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 13, color: hasRule ? 'var(--brand)' : 'var(--text-muted)', fontWeight: hasRule ? 700 : 400 }}>
                        {hasRule ? `${(rate! * 100).toFixed(1)}% (Custom)` : `${globalRate ? (globalRate * 100).toFixed(1) : 10}% (Default)`}
                      </span>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditingProviderId(p.id); setProviderRateInput(hasRule ? String(rate! * 100) : String(globalRate ? globalRate * 100 : 10)); }}>Edit</button>
                      {hasRule && <button className="btn btn-danger btn-sm" onClick={() => removeProviderRate(p.id)}>Reset</button>}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: Payouts ─────────────────────────────────────────────────────────────
function PayoutsTab() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [noteModal, setNoteModal] = useState<any | null>(null);
  const [note, setNote] = useState('');

  const fetch_ = async () => {
    const token = await ensureAdminToken(); if (!token) return;
    setLoading(true);
    const res = await fetch(`${API}/payouts`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json(); setPayouts(data.data || []); setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const markPaid = async (id: string, n: string) => {
    setMarkingId(id);
    const token = await ensureAdminToken();
    await fetch(`${API}/payouts/${id}/mark-paid`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ note: n }) });
    setMarkingId(null); setNoteModal(null); setNote(''); fetch_();
  };

  const totalPending = payouts.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + Number(p.netAmount), 0);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
        <div className="stat-card" style={{ padding: '12px 20px', minWidth: 200 }}>
          <div className="stat-card-label">Pending Payouts Total</div>
          <div className="stat-card-value" style={{ fontSize: 22, color: 'var(--amber)' }}>{formatCurrency(totalPending, 'USD')}</div>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Period</th><th>Provider</th><th>Gross Volume</th><th>Platform Fee</th><th>Net Disbursed</th><th>Status</th><th>Paid At</th><th>Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</td></tr>
              : payouts.length === 0 ? <tr><td colSpan={8}><div className="empty-state"><p>No payout ledgers found</p></div></td></tr>
              : payouts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(p.periodStart).toLocaleDateString()} – {new Date(p.periodEnd).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>{p.provider?.name || '—'}</td>
                  <td className="tabular-nums">{formatCurrency(p.grossAmount, 'USD')}</td>
                  <td className="tabular-nums" style={{ color: 'var(--amber)' }}>{formatCurrency(p.commissionAmount, 'USD')}</td>
                  <td className="tabular-nums" style={{ fontWeight: 700, color: 'var(--green)' }}>{formatCurrency(p.netAmount, 'USD')}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
                  <td>
                    {p.status === 'PENDING' && (
                      <button className="btn btn-primary btn-sm" style={{ background: 'var(--green)' }} onClick={() => setNoteModal(p)}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {noteModal && (
        <div className="modal-overlay" onClick={() => setNoteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2 className="modal-title">Mark Payout as Settled</h2><button className="modal-close" onClick={() => setNoteModal(null)}>✕</button></div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Disbursing net <strong>{formatCurrency(noteModal.netAmount, 'USD')}</strong> to <strong>{noteModal.provider?.name}</strong>.</p>
            <div className="form-group" style={{ marginBottom: 20 }}><label className="form-label">Note (optional — e.g. bank ref)</label><input className="form-input" placeholder="Bank transfer ref #…" value={note} onChange={e => setNote(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1, background: 'var(--green)' }} disabled={markingId === noteModal.id} onClick={() => markPaid(noteModal.id, note)}>
                {markingId === noteModal.id ? 'Saving…' : 'Confirm Payment'}
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setNoteModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: Settings ────────────────────────────────────────────────────────────
function SettingsTab() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/config`).then(r => r.ok ? r.json() : null).then(d => { if (d) setConfig(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const rows = config ? [
    { label: 'Payment Simulation Mode', value: config.paymentSimulationMode ? 'ENABLED — No real charges' : 'DISABLED — Live payments', highlight: config.paymentSimulationMode },
    { label: 'Default Payment Gateway', value: config.defaultGateway || '—' },
    { label: 'Default Commission Rate', value: config.defaultCommissionRate != null ? `${(config.defaultCommissionRate * 100).toFixed(1)}%` : '—' },
    { label: 'API Base URL', value: config.apiBaseUrl || API },
    { label: 'Storefront URL', value: config.storefrontUrl || 'http://localhost:3010' },
    { label: 'Admin Portal URL', value: config.adminPortalUrl || 'http://localhost:3012' },
    { label: 'Provider Portal URL', value: config.providerPortalUrl || 'http://localhost:3013' },
    { label: 'Central Payment Hub URL', value: 'http://localhost:3011' },
  ] : [];

  return (
    <div style={{ maxWidth: 720 }}>
      {loading ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading config…</p> : (
        <>
          <div className="card-panel" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Platform Configuration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {rows.map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: row.highlight ? 'var(--green)' : 'var(--text-primary)', fontFamily: row.label.includes('URL') ? 'monospace' : 'inherit' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-panel">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Quick Access Links</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Direct platform portals</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Storefront', href: 'http://localhost:3010' },
                { label: 'Provider Portal', href: 'http://localhost:3013' },
                { label: 'Central Hub', href: 'http://localhost:3011' },
              ].map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{l.label}</a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Super Admin Panel Body ──────────────────────────────────────────────────
function SuperAdminCMSContent() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab') as Tab;
  const [activeTab, setActiveTab] = useState<Tab>(requestedTab && TABS.some(t => t.id === requestedTab) ? requestedTab : 'products');
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
          {activeTab === 'products'    && <ProductsTab />}
          {activeTab === 'providers'   && <ProvidersTab />}
          {activeTab === 'orders'      && <OrdersTab />}
          {activeTab === 'leads'       && <LeadsTab />}
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
