'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface CMSData {
  hero: {
    tag: string;
    tagAr: string;
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    ctaLabel: string;
    ctaLabelAr: string;
    secondaryLabel: string;
    secondaryLabelAr: string;
    secondaryLink: string;
  };
  howWereBuilt: {
    tag: string;
    tagAr: string;
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    units: Array<{
      id: string;
      title: string;
      titleAr: string;
      was: string;
      wasAr: string;
      desc: string;
      descAr: string;
      link: string;
      cta: string;
      ctaAr: string;
    }>;
  };
  projectsShowcase: {
    tag: string;
    tagAr: string;
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    ctaLabel: string;
    ctaLabelAr: string;
    metrics: Array<{
      value: string;
      label: string;
      labelAr: string;
    }>;
  };
  carousel: {
    autoRotateIntervalMs: number;
    items: Array<{
      id: string;
      slug: string;
      title: string;
      titleAr: string;
      client: string;
      category: string;
      categoryAr: string;
      badge: string;
      badgeAr: string;
      metric: string;
      metricLabel: string;
      metricLabelAr: string;
      summary: string;
      summaryAr: string;
      techStack: string[];
      accentColor: string;
      icon: string;
      image?: string;
    }>;
  };
  brand: {
    name: string;
    email: string;
    phone: string;
    location: string;
    locationAr: string;
    tagline: string;
    taglineAr: string;
    announcement: string;
    announcementAr: string;
    isAnnouncementActive: boolean;
  };
}

export default function CMSPage() {
  const [data, setData] = useState<CMSData | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'carousel' | 'showcase' | 'specialisms' | 'brand'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [editingCarouselItemIdx, setEditingCarouselItemIdx] = useState<number | null>(null);

  // Fetch current CMS data on mount
  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => console.error('Failed to load CMS data:', err));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus('✓ All changes saved and published successfully!');
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus(`❌ Error saving: ${result.error}`);
      }
    } catch (err: any) {
      setSaveStatus(`❌ Network error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="hub-shell">
        <AdminSidebar />
        <main className="hub-main">
          <div className="hub-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading Super Admin CMS Studio...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="hub-shell">
      <AdminSidebar />

      <main className="hub-main">
        <div className="hub-content">
          {/* Top Bar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#12203C', color: '#FFFFFF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Super Admin Only
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Isolated from Provider Accounts
                </span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
                Storefront CMS & Content Studio
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
                Manage all public storefront copy, project case studies, automated carousel media, and specialisms in real-time.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 38,
                  padding: '0 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: '#FFFFFF',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>🌐</span>
                <span>View Live Storefront</span>
              </a>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 38,
                  padding: '0 20px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--hub-blue)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: isSaving ? 'wait' : 'pointer',
                  boxShadow: '0 2px 8px rgba(44, 95, 158, 0.25)',
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                <span>{isSaving ? '⏳' : '💾'}</span>
                <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
              </button>
            </div>
          </div>

          {/* Success / Error Banner */}
          {saveStatus && (
            <div
              style={{
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                background: saveStatus.startsWith('✓') ? 'var(--hub-green-bg)' : 'var(--hub-red-bg)',
                border: `1px solid ${saveStatus.startsWith('✓') ? 'rgba(46, 111, 94, 0.25)' : 'rgba(192, 57, 43, 0.25)'}`,
                color: saveStatus.startsWith('✓') ? 'var(--hub-green)' : 'var(--hub-red)',
                fontSize: 13.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {saveStatus}
            </div>
          )}

          {/* Section Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
            {[
              { id: 'hero', label: '🏠 Hero & Headline' },
              { id: 'carousel', label: '🎠 Carousel & Images' },
              { id: 'showcase', label: '💼 Projects Showcase' },
              { id: 'specialisms', label: '🏗️ Specialism Units' },
              { id: 'brand', label: '🌐 Brand & Announcements' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px 8px 0 0',
                    border: 'none',
                    borderBottom: isActive ? '3px solid var(--hub-blue)' : '3px solid transparent',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? 'var(--hub-blue)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 13.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 1: HERO & HOMEPAGE HEADLINE                            */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="hub-card" style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                  Hero Section Typography & Copy (Bilingual)
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {/* English Side */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--hub-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      🇺🇸 English Content
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Category Tag / Badge
                      </label>
                      <input
                        type="text"
                        value={data.hero.tag}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, tag: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Main Headline (use \n for line breaks)
                      </label>
                      <textarea
                        rows={3}
                        value={data.hero.title}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Subtitle Paragraph
                      </label>
                      <textarea
                        rows={4}
                        value={data.hero.subtitle}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Primary CTA Label
                      </label>
                      <input
                        type="text"
                        value={data.hero.ctaLabel}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaLabel: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                      />
                    </div>
                  </div>

                  {/* Arabic Side */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} dir="rtl">
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--hub-green)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      🇪🇬 المحتوى العربي
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        التصنيف العلوي (Tag)
                      </label>
                      <input
                        type="text"
                        value={data.hero.tagAr}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, tagAr: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        العنوان الرئيسي
                      </label>
                      <textarea
                        rows={3}
                        value={data.hero.titleAr}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, titleAr: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        النص الوصفي التعريفي
                      </label>
                      <textarea
                        rows={4}
                        value={data.hero.subtitleAr}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitleAr: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        زر الدعوة لاتخاذ إجراء (CTA)
                      </label>
                      <input
                        type="text"
                        value={data.hero.ctaLabelAr}
                        onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaLabelAr: e.target.value } })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 2: CAROUSEL & SMALL IMAGE PLACEHOLDERS                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'carousel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="hub-card" style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Homepage Automated Carousel & Image Placeholders
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                      Add or replace project images in the carousel. When an image URL is left blank, a high-end vector mockup placeholder renders automatically.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Rotation Speed:
                    </label>
                    <select
                      value={data.carousel.autoRotateIntervalMs}
                      onChange={(e) => setData({ ...data, carousel: { ...data.carousel, autoRotateIntervalMs: Number(e.target.value) } })}
                      style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 12.5 }}
                    >
                      <option value={2500}>2.5 seconds (Fast)</option>
                      <option value={3800}>3.8 seconds (Default)</option>
                      <option value={5000}>5.0 seconds (Relaxed)</option>
                      <option value={7000}>7.0 seconds (Slow)</option>
                    </select>
                  </div>
                </div>

                {/* List of Carousel Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {data.carousel.items.map((item, idx) => {
                    const isExpanded = editingCarouselItemIdx === idx;
                    return (
                      <div
                        key={item.id || idx}
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: 16,
                          background: isExpanded ? 'var(--bg-subtle)' : '#FFFFFF',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 22 }}>{item.icon}</span>
                            <div>
                              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {item.client} • {item.metric} ({item.metricLabel})
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {item.image ? (
                              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--hub-green-bg)', color: 'var(--hub-green)', fontWeight: 600 }}>
                                Custom Image Active
                              </span>
                            ) : (
                              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--hub-blue-bg)', color: 'var(--hub-blue)', fontWeight: 600 }}>
                                Vector Mockup Active
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => setEditingCarouselItemIdx(isExpanded ? null : idx)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-strong)',
                                background: '#FFFFFF',
                                color: 'var(--text-primary)',
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              {isExpanded ? 'Close' : 'Edit Item & Image'}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Editor Form */}
                        {isExpanded && (
                          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                              <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                  Custom Project Image URL (or path e.g. /images/...)
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://example.com/mockup.png or /images/..."
                                  value={item.image || ''}
                                  onChange={(e) => {
                                    const updated = [...data.carousel.items];
                                    updated[idx] = { ...updated[idx], image: e.target.value };
                                    setData({ ...data, carousel: { ...data.carousel, items: updated } });
                                  }}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                                />
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>
                                  Leave empty to use the built-in responsive interactive UI mockup.
                                </span>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                    Title (EN)
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                      const updated = [...data.carousel.items];
                                      updated[idx] = { ...updated[idx], title: e.target.value };
                                      setData({ ...data, carousel: { ...data.carousel, items: updated } });
                                    }}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                    العنوان (عربي)
                                  </label>
                                  <input
                                    type="text"
                                    dir="rtl"
                                    value={item.titleAr}
                                    onChange={(e) => {
                                      const updated = [...data.carousel.items];
                                      updated[idx] = { ...updated[idx], titleAr: e.target.value };
                                      setData({ ...data, carousel: { ...data.carousel, items: updated } });
                                    }}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                    Client Name
                                  </label>
                                  <input
                                    type="text"
                                    value={item.client}
                                    onChange={(e) => {
                                      const updated = [...data.carousel.items];
                                      updated[idx] = { ...updated[idx], client: e.target.value };
                                      setData({ ...data, carousel: { ...data.carousel, items: updated } });
                                    }}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                    Metric Value
                                  </label>
                                  <input
                                    type="text"
                                    value={item.metric}
                                    onChange={(e) => {
                                      const updated = [...data.carousel.items];
                                      updated[idx] = { ...updated[idx], metric: e.target.value };
                                      setData({ ...data, carousel: { ...data.carousel, items: updated } });
                                    }}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                    Metric Label
                                  </label>
                                  <input
                                    type="text"
                                    value={item.metricLabel}
                                    onChange={(e) => {
                                      const updated = [...data.carousel.items];
                                      updated[idx] = { ...updated[idx], metricLabel: e.target.value };
                                      setData({ ...data, carousel: { ...data.carousel, items: updated } });
                                    }}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Image / Mockup Preview Box */}
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Slide Preview:
                              </div>
                              <div
                                style={{
                                  width: '100%',
                                  height: 160,
                                  borderRadius: 10,
                                  background: '#141416',
                                  border: '1px solid var(--border-strong)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  overflow: 'hidden',
                                  position: 'relative',
                                }}
                              >
                                {item.image ? (
                                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ textAlign: 'center', color: '#FFFFFF', padding: 14 }}>
                                    <div style={{ fontSize: 26, marginBottom: 4 }}>{item.icon}</div>
                                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{item.title}</div>
                                    <div style={{ fontSize: 11, color: item.accentColor, marginTop: 2 }}>{item.metric} • {item.metricLabel}</div>
                                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>[Active Vector Mockup]</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 3: PROJECTS SHOWCASE SECTION                            */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'showcase' && (
            <div className="hub-card" style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                Featured Projects Section Copy & Proof Metrics
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* English */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--hub-blue)', textTransform: 'uppercase' }}>
                    🇺🇸 English
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Section Heading
                    </label>
                    <textarea
                      rows={2}
                      value={data.projectsShowcase.title}
                      onChange={(e) => setData({ ...data, projectsShowcase: { ...data.projectsShowcase, title: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Description Paragraph
                    </label>
                    <textarea
                      rows={4}
                      value={data.projectsShowcase.subtitle}
                      onChange={(e) => setData({ ...data, projectsShowcase: { ...data.projectsShowcase, subtitle: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Arabic */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} dir="rtl">
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--hub-green)', textTransform: 'uppercase' }}>
                    🇪🇬 عربي
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      عنوان القسم
                    </label>
                    <textarea
                      rows={2}
                      value={data.projectsShowcase.titleAr}
                      onChange={(e) => setData({ ...data, projectsShowcase: { ...data.projectsShowcase, titleAr: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      النص الوصفي
                    </label>
                    <textarea
                      rows={4}
                      value={data.projectsShowcase.subtitleAr}
                      onChange={(e) => setData({ ...data, projectsShowcase: { ...data.projectsShowcase, subtitleAr: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 4: HOW WE'RE BUILT SPECIALISMS                          */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'specialisms' && (
            <div className="hub-card" style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                "How We're Built" 4 Specialism Cards & Deep Links
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {data.howWereBuilt.units.map((unit, uIdx) => (
                  <div key={unit.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {/* English */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--hub-blue)' }}>
                          Unit #{uIdx + 1}: {unit.title}
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)' }}>Title (EN)</label>
                          <input
                            type="text"
                            value={unit.title}
                            onChange={(e) => {
                              const updated = [...data.howWereBuilt.units];
                              updated[uIdx] = { ...updated[uIdx], title: e.target.value };
                              setData({ ...data, howWereBuilt: { ...data.howWereBuilt, units: updated } });
                            }}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12.5 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)' }}>Subtitle (was:)</label>
                          <input
                            type="text"
                            value={unit.was}
                            onChange={(e) => {
                              const updated = [...data.howWereBuilt.units];
                              updated[uIdx] = { ...updated[uIdx], was: e.target.value };
                              setData({ ...data, howWereBuilt: { ...data.howWereBuilt, units: updated } });
                            }}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12.5 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)' }}>Description</label>
                          <textarea
                            rows={2}
                            value={unit.desc}
                            onChange={(e) => {
                              const updated = [...data.howWereBuilt.units];
                              updated[uIdx] = { ...updated[uIdx], desc: e.target.value };
                              setData({ ...data, howWereBuilt: { ...data.howWereBuilt, units: updated } });
                            }}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12.5, fontFamily: 'inherit' }}
                          />
                        </div>
                      </div>

                      {/* Arabic */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} dir="rtl">
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--hub-green)' }}>
                          الوحدة #{uIdx + 1}: {unit.titleAr}
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)' }}>العنوان (عربي)</label>
                          <input
                            type="text"
                            value={unit.titleAr}
                            onChange={(e) => {
                              const updated = [...data.howWereBuilt.units];
                              updated[uIdx] = { ...updated[uIdx], titleAr: e.target.value };
                              setData({ ...data, howWereBuilt: { ...data.howWereBuilt, units: updated } });
                            }}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12.5 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)' }}>البديل السابق (بديل:)</label>
                          <input
                            type="text"
                            value={unit.wasAr}
                            onChange={(e) => {
                              const updated = [...data.howWereBuilt.units];
                              updated[uIdx] = { ...updated[uIdx], wasAr: e.target.value };
                              setData({ ...data, howWereBuilt: { ...data.howWereBuilt, units: updated } });
                            }}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12.5 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)' }}>الوصف</label>
                          <textarea
                            rows={2}
                            value={unit.descAr}
                            onChange={(e) => {
                              const updated = [...data.howWereBuilt.units];
                              updated[uIdx] = { ...updated[uIdx], descAr: e.target.value };
                              setData({ ...data, howWereBuilt: { ...data.howWereBuilt, units: updated } });
                            }}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12.5, fontFamily: 'inherit' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Target Route */}
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <label style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 4 }}>
                        Destination Target Link (Navigates to services page with category & anchor)
                      </label>
                      <input
                        type="text"
                        value={unit.link}
                        onChange={(e) => {
                          const updated = [...data.howWereBuilt.units];
                          updated[uIdx] = { ...updated[uIdx], link: e.target.value };
                          setData({ ...data, howWereBuilt: { ...data.howWereBuilt, units: updated } });
                        }}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB 5: BRAND & ANNOUNCEMENTS                                */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeTab === 'brand' && (
            <div className="hub-card" style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                Global Brand, Contact Info & Top Announcement Bar
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Studio Name
                    </label>
                    <input
                      type="text"
                      value={data.brand.name}
                      onChange={(e) => setData({ ...data, brand: { ...data.brand, name: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={data.brand.email}
                      onChange={(e) => setData({ ...data, brand: { ...data.brand, email: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={data.brand.phone}
                      onChange={(e) => setData({ ...data, brand: { ...data.brand, phone: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Announcement Banner (English)
                    </label>
                    <input
                      type="text"
                      value={data.brand.announcement}
                      onChange={(e) => setData({ ...data, brand: { ...data.brand, announcement: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                    />
                  </div>

                  <div dir="rtl">
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      شريط الإعلانات الترويجي (عربي)
                    </label>
                    <input
                      type="text"
                      value={data.brand.announcementAr}
                      onChange={(e) => setData({ ...data, brand: { ...data.brand, announcementAr: e.target.value } })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    <input
                      type="checkbox"
                      id="bannerActive"
                      checked={data.brand.isAnnouncementActive}
                      onChange={(e) => setData({ ...data, brand: { ...data.brand, isAnnouncementActive: e.target.checked } })}
                      style={{ width: 18, height: 18, cursor: 'pointer' }}
                    />
                    <label htmlFor="bannerActive" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                      Show Announcement Banner on Storefront
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
