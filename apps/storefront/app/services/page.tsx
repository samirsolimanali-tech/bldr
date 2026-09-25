'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BldrNav, BldrFooter, ProjectContactModal, tokens } from '@bldr/ui';
import { SERVICES_CATALOG, ServiceItem } from './data';

const CATEGORY_MAP: Record<string, { en: string; ar: string }> = {
  'marketing & ads': { en: 'Marketing & Ads', ar: 'التسويق والإعلانات الممولة' },
  'marketing': { en: 'Marketing & Ads', ar: 'التسويق والإعلانات الممولة' },
  'ads': { en: 'Marketing & Ads', ar: 'التسويق والإعلانات الممولة' },
  'التسويق والإعلانات الممولة': { en: 'Marketing & Ads', ar: 'التسويق والإعلانات الممولة' },
  'brand & creative': { en: 'Brand & Creative', ar: 'الهوية البصرية والتصميم' },
  'brand': { en: 'Brand & Creative', ar: 'الهوية البصرية والتصميم' },
  'branding': { en: 'Brand & Creative', ar: 'الهوية البصرية والتصميم' },
  'creative': { en: 'Brand & Creative', ar: 'الهوية البصرية والتصميم' },
  'الهوية البصرية والتصميم': { en: 'Brand & Creative', ar: 'الهوية البصرية والتصميم' },
  'media & video': { en: 'Media & Video', ar: 'الإنتاج المرئي والمحتوى' },
  'media': { en: 'Media & Video', ar: 'الإنتاج المرئي والمحتوى' },
  'video': { en: 'Media & Video', ar: 'الإنتاج المرئي والمحتوى' },
  'الإنتاج المرئي والمحتوى': { en: 'Media & Video', ar: 'الإنتاج المرئي والمحتوى' },
  'software & tech': { en: 'Software & Tech', ar: 'البرمجيات والحلول التقنية' },
  'software': { en: 'Software & Tech', ar: 'البرمجيات والحلول التقنية' },
  'tech': { en: 'Software & Tech', ar: 'البرمجيات والحلول التقنية' },
  'technology': { en: 'Software & Tech', ar: 'البرمجيات والحلول التقنية' },
  'البرمجيات والحلول التقنية': { en: 'Software & Tech', ar: 'البرمجيات والحلول التقنية' },
  'strategy & advisory': { en: 'Strategy & Advisory', ar: 'الاستشارات والاستراتيجية' },
  'strategy': { en: 'Strategy & Advisory', ar: 'الاستشارات والاستراتيجية' },
  'consulting': { en: 'Strategy & Advisory', ar: 'الاستشارات والاستراتيجية' },
  'advisory': { en: 'Strategy & Advisory', ar: 'الاستشارات والاستراتيجية' },
  'الاستشارات والاستراتيجية': { en: 'Strategy & Advisory', ar: 'الاستشارات والاستراتيجية' },
  'corporate training': { en: 'Corporate Training', ar: 'التدريب وتأهيل الفرق' },
  'training': { en: 'Corporate Training', ar: 'التدريب وتأهيل الفرق' },
  'workshops': { en: 'Corporate Training', ar: 'التدريب وتأهيل الفرق' },
  'enablement': { en: 'Corporate Training', ar: 'التدريب وتأهيل الفرق' },
  'التدريب وتأهيل الفرق': { en: 'Corporate Training', ar: 'التدريب وتأهيل الفرق' },
};

function ServicesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const serviceParam = searchParams.get('service');

  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const isRtl = lang === 'AR';

  const categories = isRtl
    ? ['الكل', 'التسويق والإعلانات الممولة', 'الهوية البصرية والتصميم', 'الإنتاج المرئي والمحتوى', 'البرمجيات والحلول التقنية', 'الاستشارات والاستراتيجية', 'التدريب وتأهيل الفرق']
    : ['All', 'Marketing & Ads', 'Brand & Creative', 'Media & Video', 'Software & Tech', 'Strategy & Advisory', 'Corporate Training'];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Sync category with URL parameters or target service on mount/change
  useEffect(() => {
    if (categoryParam) {
      const normalized = categoryParam.trim().toLowerCase();
      const mapped = CATEGORY_MAP[normalized];
      if (mapped) {
        setSelectedCategory(isRtl ? mapped.ar : mapped.en);
      } else {
        setSelectedCategory(categoryParam);
      }
    } else if (serviceParam) {
      const match = SERVICES_CATALOG.find((s) => s.slug === serviceParam);
      if (match) {
        setSelectedCategory(isRtl ? match.categoryAr : match.category);
      }
    }
  }, [categoryParam, serviceParam, isRtl]);

  // Handle auto-scroll and highlight for target service or hash anchor
  useEffect(() => {
    const targetSlug = serviceParam || (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '');
    if (targetSlug) {
      setHighlightedSlug(targetSlug);
      const timer = setTimeout(() => {
        const el = document.getElementById(targetSlug);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [serviceParam]);

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
                ? 'اختر باقة الخدمة التي تناسب مشروعك: استعرض نطاق العمل ومخرجات كل تخصص، وتواصل مع شركائنا للبدء مباشرة.'
                : 'Choose the service package that fits your objectives. Review our full scope of deliverables, engineering timelines, and commercial packages.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setHighlightedSlug(null);
                  }}
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
            {filteredServices.map((service) => {
              const isTargeted = highlightedSlug === service.slug;

              return (
                <div
                  key={service.slug}
                  id={service.slug}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    border: isTargeted ? '2px solid #2C5F9E' : '1px solid rgba(20,20,22,0.08)',
                    padding: '28px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isTargeted
                      ? '0 0 0 4px rgba(44, 95, 158, 0.16), 0 8px 24px rgba(20,20,22,0.08)'
                      : '0 4px 14px rgba(20,20,22,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                    scrollMarginTop: 130,
                    transition: 'border 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div>
                    {/* Unit & Category Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                        {isTargeted && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 6,
                            background: 'rgba(44, 95, 158, 0.12)',
                            color: '#2C5F9E',
                            fontSize: 11,
                            fontWeight: 700,
                          }}>
                            {isRtl ? '✦ الخدمة المحددة' : '✦ Target Service'}
                          </span>
                        )}
                      </div>
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

                  {/* Scope & Contact Action Buttons (No Prices) */}
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, paddingTop: 6 }}>
                      {/* View Service Details */}
                      <Link
                        href={`/services/${service.slug}`}
                        style={{
                          height: 42,
                          borderRadius: 8,
                          background: tokens.colors.brandDark,
                          color: '#FFFFFF',
                          fontSize: 13,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          textDecoration: 'none',
                          boxShadow: '0 2px 6px rgba(20, 20, 22, 0.15)',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {isRtl ? 'تفاصيل الخدمة ←' : 'View Scope →'}
                      </Link>

                      {/* Direct Contact Modal Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsContactOpen(true)}
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
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {isRtl ? 'تواصل معنا' : 'Contact Us'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BldrFooter lang={lang} />

      <ProjectContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F4F5F7' }} />}>
      <ServicesContent />
    </Suspense>
  );
}

