'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens, formatEGP } from '@bldr/ui';
import { PRODUCTS_CATALOG, ProductItem } from '../data';

export default function SingleProductPage() {
  const params = useParams();
  const rawId = (params?.id as string) || 'prod-1';
  const product: ProductItem =
    PRODUCTS_CATALOG.find((p) => p.id === rawId || p.slug === rawId) || PRODUCTS_CATALOG[0];

  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isRtl = lang === 'AR';

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

      <main style={{ flex: 1, padding: '40px 32px 84px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A6A80', marginBottom: 28 }}>
            <Link href="/" style={{ color: '#8A94A6', textDecoration: 'none' }}>
              {isRtl ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/products" style={{ color: '#8A94A6', textDecoration: 'none' }}>
              {isRtl ? 'المنتجات' : 'Products'}
            </Link>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#141416' }}>
              {isRtl ? product.titleAr : product.title}
            </span>
          </div>

          {/* Product Hero Banner */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid rgba(20,20,22,0.08)',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(20,20,22,0.04)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.95fr)',
              gap: 0,
              marginBottom: 36,
            }}
          >
            {/* Left Content */}
            <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Provider & Type Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: product.providerLogoBg,
                      color: product.providerLogoFg,
                      fontWeight: 800,
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(20,20,22,0.08)',
                    }}
                  >
                    {product.providerLogoText}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1B2A4A', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {product.provider}
                      <span style={{ color: '#0066CC', fontSize: 13 }}>✓</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#8A94A6' }}>
                      {isRtl ? 'مزود معتمد في استوديو bldr' : 'Accredited bldr Provider'}
                    </div>
                  </div>
                  <span
                    style={{
                      marginInlineStart: 'auto',
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: product.chipBg,
                      color: product.chipFg,
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {isRtl ? product.typeAr : product.type}
                  </span>
                </div>

                {/* Title */}
                <h1
                  style={{
                    fontSize: 'clamp(24px, 3.5vw, 36px)',
                    fontWeight: 800,
                    color: '#12203C',
                    lineHeight: 1.25,
                    letterSpacing: '-0.03em',
                    margin: '0 0 16px',
                  }}
                >
                  {isRtl ? product.titleAr : product.title}
                </h1>

                {/* Short & Full Description */}
                <p style={{ fontSize: 15.5, color: '#47454A', lineHeight: 1.65, fontWeight: 300, margin: '0 0 20px' }}>
                  {isRtl ? product.fullDescAr : product.fullDesc}
                </p>

                {/* Key Badges */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E3E8EF', fontSize: 12.5, fontWeight: 600, color: '#323742', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>⏱️</span>
                    <span>{isRtl ? product.durationAr : product.duration}</span>
                  </div>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E3E8EF', fontSize: 12.5, fontWeight: 600, color: '#323742', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>⭐</span>
                    <span>{product.rating} / 5.0</span>
                  </div>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E3E8EF', fontSize: 12.5, fontWeight: 600, color: '#323742', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>👥</span>
                    <span>{product.enrolled}+ {isRtl ? 'مشترك مسجل' : 'Enrolled'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Hero */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Primary CTA: Pay Now */}
                <Link
                  href={`/pay/${product.paySlug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 48,
                    padding: '0 28px',
                    borderRadius: 8,
                    background: '#2E6F5E',
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(46, 111, 94, 0.3)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span>💳</span>
                  <span>{isRtl ? 'ادفع الآن وحجز مقعدك فورياً' : 'Pay Now / Instant Enrollment'}</span>
                </Link>

                {/* Secondary CTA: Contact Modal */}
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    height: 48,
                    padding: '0 22px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D3DAE4',
                    color: '#12203C',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isRtl ? 'استفسار أو حجز للشركات ←' : 'Inquire / Team Booking →'}
                </button>
              </div>
            </div>

            {/* Right Visual Card & Pricing Box */}
            <div
              style={{
                background: '#F9FAFB',
                borderInlineStart: '1px solid rgba(20,20,22,0.08)',
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Thumbnail Display */}
              <div
                style={{
                  height: 200,
                  borderRadius: 14,
                  background: product.thumbnailGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                <span style={{ fontSize: 72, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                  {product.thumbnailIcon}
                </span>
              </div>

              {/* Price & Guarantee Box */}
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', letterSpacing: '0.06em' }}>
                  {isRtl ? 'الرسوم الإجمالية للبرنامج' : 'Total Investment'}
                </span>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#12203C', fontFamily: tokens.fonts.mono, marginTop: 4 }}>
                  {formatEGP(product.priceEGP)}
                </div>
                <div style={{ fontSize: 12.5, color: '#5A6A80', marginTop: 4, marginBottom: 16 }}>
                  {isRtl ? 'شامل كافة الملحقات والشهادات والوصول المستمر' : 'All-inclusive: sessions, materials & certificate'}
                </div>

                <div style={{ height: 1, background: '#E3E8EF', marginBottom: 16 }} />

                <div style={{ fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>
                  {isRtl ? 'وسائل الدفع المقبولة فوراً:' : 'Supported Payment Methods:'}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {['Visa', 'Mastercard', 'Meeza', 'Vodafone Cash', 'Fawry Kiosk'].map((badge) => (
                    <span
                      key={badge}
                      style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: '#FFFFFF',
                        border: '1px solid #D3DAE4',
                        color: '#5A6A80',
                        fontWeight: 600,
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: 12, color: '#8A94A6', lineHeight: 1.5 }}>
                  {isRtl
                    ? '🔒 يتم الدفع عبر بوابة الدفع المركزية لـ bldr مع إصدار فوري للإيصال وتأكيد الحجز.'
                    : '🔒 Securely processed via bldr Central Payment Gateway with instant receipt and ledger verification.'}
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus & Inclusions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.85fr)', gap: 32, marginBottom: 36 }}>
            {/* Syllabus / Modules */}
            <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid rgba(20,20,22,0.08)', padding: 32 }}>
              <h2 style={{ fontSize: 21, fontWeight: 700, color: '#12203C', margin: '0 0 20px' }}>
                {isRtl ? 'المنهج الدراسي ومحاور البرنامج' : 'Detailed Syllabus & Course Modules'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(isRtl ? product.syllabusAr : product.syllabus).map((mod, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '16px 18px',
                      borderRadius: 12,
                      background: '#F8FAFC',
                      border: '1px solid #E9EDF3',
                    }}
                  >
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: '#141416', marginBottom: 4 }}>
                      {mod.title}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#5A6A80', lineHeight: 1.5 }}>
                      {mod.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid rgba(20,20,22,0.08)', padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#12203C', margin: '0 0 16px' }}>
                  {isRtl ? 'ما الذي تتضمنه هذه الباقة؟' : "What's Included in Enrollment"}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(isRtl ? product.whatIncludedAr : product.whatIncluded).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'rgba(46, 111, 94, 0.12)',
                          color: '#2E6F5E',
                          fontSize: 11,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                          marginTop: 2,
                        }}
                      >
                        ✓
                      </div>
                      <span style={{ fontSize: 14, color: '#141416', lineHeight: 1.55 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provider Info Card */}
              <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid rgba(20,20,22,0.08)', padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#12203C', margin: '0 0 12px' }}>
                  {isRtl ? 'عن الجهة المزودة للبرنامج' : 'About the Provider'}
                </h3>
                <p style={{ fontSize: 13.5, color: '#5A6A80', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {isRtl
                    ? `تخضع برامج ${product.provider} لمعايير جودة bldr الأكاديمية مع توفير بوابات دفع سريعة، شهادات معتمدة، ودعم مستمر للطلاب.`
                    : `${product.provider} operates on the bldr platform with verified credentials, high completion rates, and dedicated learner support.`}
                </p>
                <Link
                  href={`/pay/${product.paySlug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 44,
                    borderRadius: 8,
                    background: '#141416',
                    color: '#FFFFFF',
                    fontSize: 13.5,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'حجز فوري عبر البوابة المركزية' : 'Pay Now via Central Gateway'}
                </Link>
              </div>
            </div>
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
