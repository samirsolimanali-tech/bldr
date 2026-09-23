'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens, formatEGP } from '@bldr/ui';
import { SERVICES_CATALOG, ServiceItem } from './data';

export default function ServicesPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isRtl = lang === 'AR';

  const categories = isRtl
    ? ['الكل', 'التسويق والإعلانات الممولة', 'الهوية البصرية والتصميم', 'الإنتاج المرئي والمحتوى', 'البرمجيات وبوابات الدفع', 'الاستشارات والاستراتيجية']
    : ['All', 'Marketing & Ads', 'Brand & Creative', 'Media & Video', 'Software & Tech', 'Strategy & Advisory'];

  const filteredServices = selectedCategory === 'All' || selectedCategory === 'الكل'
    ? SERVICES_CATALOG
    : SERVICES_CATALOG.filter((s) => (isRtl ? s.categoryAr === selectedCategory : s.category === selectedCategory));

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F4F5F7',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.ui,
      }}
    >
      <BldrNav
        lang={lang}
        onLanguageChange={setLang}
        onStartProject={() => setIsContactOpen(true)}
      />

      <main style={{ flex: 1, padding: '56px 32px 84px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ maxWidth: 760, marginBottom: 44 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 999,
              background: '#FFFFFF',
              border: '1px solid rgba(20,20,22,0.08)',
              fontSize: 12,
              fontWeight: 600,
              color: '#D10721',
              marginBottom: 16,
            }}>
              <span>✦</span>
              <span>{isRtl ? 'خدمات الاستوديو المتخصصة — Sidekick & Tech House' : 'Specialist Studio Services — Sidekick & Tech House'}</span>
            </div>

            <h1 style={{
              margin: '0 0 16px',
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#141416',
              lineHeight: 1.15,
            }}>
              {isRtl
                ? 'خدمات تسويق وبرمجيات مصممة لبيع المنتجات وتحقيق العوائد.'
                : 'Services designed to sell products and scale revenue.'}
            </h1>
            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, fontWeight: 300, color: '#47454A' }}>
              {isRtl
                ? 'اختر باقة الخدمة التي تناسب مشروعك: يمكنك الدفع فوراً عبر بوابة الدفع المركزية (كروت، فوري، محافظ) أو فتح صفحة تفاصيل الخدمة لمراجعة نطاق العمل.'
                : 'Choose the service package that fits your objectives. Pay directly online through our Central Payment Gateway (Cards, Fawry, Wallets) or open any service landing page for full scope.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    border: '1px solid',
                    borderColor: isSelected ? '#12203C' : 'rgba(20,20,22,0.12)',
                    background: isSelected ? '#12203C' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#47454A',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {filteredServices.map((service) => (
              <div
                key={service.slug}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid rgba(20,20,22,0.08)',
                  padding: '28px 24px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(20,20,22,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  {/* Unit & Category Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      background: 'rgba(209, 7, 33, 0.08)',
                      color: '#D10721',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
                      {service.unit}
                    </span>
                    <span style={{ fontSize: 12, color: '#8A94A6', fontWeight: 500 }}>
                      {isRtl ? service.deliveryTimeAr : service.deliveryTime}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: '#141416', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                    {isRtl ? service.titleAr : service.title}
                  </h2>
                  <p style={{ margin: '0 0 20px', fontSize: 14, color: '#47454A', lineHeight: 1.6, fontWeight: 300 }}>
                    {isRtl ? service.shortDescAr : service.shortDesc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      {isRtl ? 'أبرز مخرجات الخدمة:' : 'Deliverables Include:'}
                    </div>
                    <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, color: '#47454A', lineHeight: 1.7, fontWeight: 400 }}>
                      {(isRtl ? service.deliverablesAr : service.deliverables).map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & Dual Action Buttons */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #E3E8EF', marginBottom: 16 }}>
                    <span style={{ fontSize: 12, color: '#8A94A6', fontWeight: 600 }}>{isRtl ? 'القيمة الاستثمارية:' : 'Investment:'}</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#12203C', fontFamily: tokens.fonts.mono }}>
                      {formatEGP(service.priceEGP)}
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {/* Mode A: Central Gateway Direct Checkout */}
                    <Link
                      href={`/pay/${service.paySlug}`}
                      style={{
                        height: 42,
                        borderRadius: 8,
                        background: '#2E6F5E',
                        color: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(46, 111, 94, 0.25)',
                      }}
                    >
                      <span>💳</span>
                      <span>{isRtl ? 'دفع فوري بالبوابة' : 'Instant Checkout'}</span>
                    </Link>

                    {/* Mode B: Single Service Landing Page */}
                    <Link
                      href={`/services/${service.slug}`}
                      style={{
                        height: 42,
                        borderRadius: 8,
                        background: '#FFFFFF',
                        border: '1px solid #D3DAE4',
                        color: '#12203C',
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                      }}
                    >
                      {isRtl ? 'تفاصيل الخدمة ←' : 'View Scope →'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BldrFooter />

      <ProjectContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />
    </div>
  );
}
