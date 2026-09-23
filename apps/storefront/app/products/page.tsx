'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens, formatEGP } from '@bldr/ui';
import { PRODUCTS_CATALOG, ProductItem } from './data';

export default function ProductsPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isRtl = lang === 'AR';

  const types = isRtl
    ? ['الكل', 'الدورات والمعسكرات', 'ورش العمل', 'الكتب والأدلة', 'الفعاليات والمؤتمرات', 'التقييمات']
    : ['All', 'Course', 'Workshop', 'Book', 'Event', 'Assessment'];

  const filteredProducts = selectedType === 'All' || selectedType === 'الكل'
    ? PRODUCTS_CATALOG
    : PRODUCTS_CATALOG.filter((p) => {
        if (selectedType === 'الدورات والمعسكرات' && p.type === 'Course') return true;
        if (selectedType === 'ورش العمل' && p.type === 'Workshop') return true;
        if (selectedType === 'الكتب والأدلة' && p.type === 'Book') return true;
        if (selectedType === 'الفعاليات والمؤتمرات' && p.type === 'Event') return true;
        if (selectedType === 'التقييمات' && p.type === 'Assessment') return true;
        return p.type === selectedType;
      });

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

      <main style={{ flex: 1, padding: '48px 32px 84px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 36, textAlign: isRtl ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 999,
              background: 'rgba(46, 111, 94, 0.10)',
              color: '#2E6F5E',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              {isRtl ? 'دليل البرامج والمنتجات' : 'Provider Products & Catalog'}
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: '#12203C',
              margin: '0 0 14px',
              letterSpacing: '-0.03em',
            }}>
              {isRtl ? 'منتجات ودورات شركاء bldr' : 'Products, Courses & Programs'}
            </h1>
            <p style={{
              fontSize: 16,
              color: '#5A6A80',
              margin: 0,
              maxWidth: 720,
              lineHeight: 1.6,
              fontWeight: 300,
            }}>
              {isRtl
                ? 'استعرض جميع الدورات التدريبية المعتمدة، ورش العمل المكثفة، والتقييمات من أفضل المزودين والمدرسين، مع إمكانية الدفع الفوري أونلاين أو الاطلاع على التفاصيل الكاملة.'
                : 'Browse verified cohort bootcamps, workshops, books, assessments, and summits from accredited providers. Pay instantly via our central gateway or open the full product details.'}
            </p>
          </div>

          {/* Type Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {types.map((t) => {
              const isSelected = selectedType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
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
                  {t}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 28 }}>
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  border: '1px solid rgba(20,20,22,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(20,20,22,0.04)',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                }}
              >
                <div>
                  {/* Card Visual Thumbnail */}
                  <Link href={`/products/${prod.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div
                      style={{
                        height: 180,
                        background: prod.thumbnailGradient,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Top Type Badge & Duration */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: 'rgba(255, 255, 255, 0.22)',
                            backdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isRtl ? prod.typeAr : prod.type}
                        </span>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: 'rgba(0, 0, 0, 0.35)',
                            color: '#FFFFFF',
                            fontSize: 11.5,
                            fontWeight: 600,
                          }}
                        >
                          {isRtl ? prod.durationAr : prod.duration}
                        </span>
                      </div>

                      {/* Big Icon / Visual Artwork */}
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ fontSize: 56, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))' }}>
                          {prod.thumbnailIcon}
                        </span>
                      </div>

                      {/* Rating & Social Proof */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>
                        <span>★ {prod.rating}</span>
                        <span>{prod.enrolled}+ {isRtl ? 'مشترك' : 'Enrolled'}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div style={{ padding: '22px 24px 16px' }}>
                    {/* Provider Logo & Identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: prod.providerLogoBg,
                          color: prod.providerLogoFg,
                          fontWeight: 800,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                          border: '1px solid rgba(20,20,22,0.06)',
                        }}
                      >
                        {prod.providerLogoText}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2A4A', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {prod.provider}
                          <span style={{ color: '#0066CC', fontSize: 12 }}>✓</span>
                        </span>
                        <span style={{ fontSize: 11, color: '#8A94A6' }}>
                          {isRtl ? 'مزود معتمد' : 'Verified Provider'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/products/${prod.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h2
                        style={{
                          margin: '0 0 10px',
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#141416',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.35,
                          cursor: 'pointer',
                        }}
                      >
                        {isRtl ? prod.titleAr : prod.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#5A6A80', lineHeight: 1.55, fontWeight: 300 }}>
                      {isRtl ? prod.shortDescAr : prod.shortDesc}
                    </p>

                    {/* Feature Tags */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {(isRtl ? prod.tagsAr : prod.tags).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: '#F1F4F9',
                            color: '#4B5565',
                            fontWeight: 500,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Price & Pay Now CTA */}
                <div style={{ padding: '0 24px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid #EEF1F5', marginBottom: 16 }}>
                    <span style={{ fontSize: 12, color: '#8A94A6', fontWeight: 600 }}>
                      {isRtl ? 'السعر / رسوم الحجز:' : 'Fee / Investment:'}
                    </span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#12203C', fontFamily: tokens.fonts.mono }}>
                      {formatEGP(prod.priceEGP)}
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                    {/* Primary Button: Direct Pay Now */}
                    <Link
                      href={`/pay/${prod.paySlug}`}
                      style={{
                        height: 42,
                        borderRadius: 8,
                        background: '#2E6F5E',
                        color: '#FFFFFF',
                        fontSize: 13.5,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(46, 111, 94, 0.28)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <span>💳</span>
                      <span>{isRtl ? 'ادفع الآن' : 'Pay Now'}</span>
                    </Link>

                    {/* Secondary Button: Single Product Page */}
                    <Link
                      href={`/products/${prod.id}`}
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
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {isRtl ? 'التفاصيل الكاملة ←' : 'Full Details →'}
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
