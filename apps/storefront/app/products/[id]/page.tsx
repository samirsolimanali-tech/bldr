'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens, formatEGP } from '@bldr/ui';
import { PRODUCTS_CATALOG, ProductItem, ProductThumbnailIcon } from '../data';

function SingleProductContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = (params?.id as string) || 'prod-1';
  const [product, setProduct] = useState<ProductItem>(
    () => PRODUCTS_CATALOG.find((p) => p.id === rawId || p.slug === rawId) || PRODUCTS_CATALOG[0]
  );

  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          const item = data.data.find((p: any) => p.id === rawId || p.slug === rawId || p.paySlug === rawId);
          if (item) {
            setProduct({
              id: item.id,
              slug: item.slug || item.id,
              title: item.title,
              titleAr: item.titleAr || item.title,
              provider: item.provider || item.brand || 'bldr Partner',
              providerCode: item.providerCode || (item.brand === 'bldr' ? 'BLDR' : 'PARTNER'),
              providerLogoText: (item.provider || item.brand || 'B').slice(0, 2).toUpperCase(),
              providerLogoBg: '#E8EEF7',
              providerLogoFg: '#1C2B3F',
              chipBg: '#F4F5F7',
              chipFg: '#141416',
              type: item.type || 'Course',
              typeAr: item.typeAr || (item.type === 'Course' ? 'دورة تدريبية' : item.type),
              shortDesc: item.shortDesc || item.title,
              shortDescAr: item.shortDescAr || item.titleAr || item.title,
              fullDesc: item.fullDesc || item.shortDesc || item.title,
              fullDescAr: item.fullDescAr || item.shortDescAr || item.titleAr || item.title,
              priceEGP: Number(item.priceEGP || item.price) || 0,
              duration: item.duration || 'Flexible',
              durationAr: item.durationAr || 'مرن',
              rating: item.rating || 4.9,
              enrolled: item.enrolled || 0,
              thumbnailGradient: item.thumbnailGradient || 'linear-gradient(135deg, #12203C 0%, #2C5F9E 100%)',
              thumbnailIcon: item.thumbnailIcon || (item.type === 'Book' ? 'book' : 'code'),
              paySlug: item.paySlug || item.slug || item.id,
              tags: item.tags || [item.type || 'Course', item.brand || 'bldr'],
              tagsAr: item.tagsAr || ['معتمد', 'bldr'],
              syllabus: item.syllabus || [],
              syllabusAr: item.syllabusAr || [],
              whatIncluded: item.whatIncluded || ['Full Lifetime Access', 'Certificate of Completion'],
              whatIncludedAr: item.whatIncludedAr || ['وصول دائم وشامل للمحتوى', 'شهادة إتمام معتمدة'],
              providerWebsiteUrl: item.redirectUrl || `/products/${item.id}`,
              ventureId: item.ventureId || 'bldr',
              saleMode: item.saleMode || 'DIRECT',
              redirectUrl: item.redirectUrl,
              ctaLabel: item.saleMode === 'REDIRECT' ? 'Visit Provider' : 'Enroll Now',
              ctaLabelAr: item.saleMode === 'REDIRECT' ? 'الانتقال للمزود' : 'سجل الآن',
            });
          }
        }
      })
      .catch(() => {});
  }, [rawId]);

  const queryPaid = searchParams?.get('paid') === 'true';
  const [isPaid, setIsPaid] = useState(false);
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    if (queryPaid) {
      setIsPaid(true);
      try {
        localStorage.setItem(`bldr_paid_${product.id}`, 'true');
        localStorage.setItem(`bldr_paid_${product.paySlug}`, 'true');
      } catch (e) {}
    } else {
      try {
        const paidSlug = localStorage.getItem(`bldr_paid_${product.paySlug}`);
        const paidId = localStorage.getItem(`bldr_paid_${product.id}`);
        if (paidSlug === 'true' || paidId === 'true') {
          setIsPaid(true);
        }
      } catch (e) {}
    }
  }, [queryPaid, product.id, product.paySlug]);

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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>{isRtl ? product.durationAr : product.duration}</span>
                  </div>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E3E8EF', fontSize: 12.5, fontWeight: 600, color: '#323742', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#D97706' }}>★</span>
                    <span>{product.rating} / 5.0</span>
                  </div>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E3E8EF', fontSize: 12.5, fontWeight: 600, color: '#323742', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>{product.enrolled}+ {isRtl ? 'مشترك مسجل' : 'Enrolled'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Hero */}
              <div>
                {/* Verified Paid Badge if user has completed payment */}
                {isPaid && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '5px 14px',
                      borderRadius: 20,
                      background: '#DCFCE7',
                      border: '1.5px solid #86EFAC',
                      color: '#15803D',
                      fontSize: 12.5,
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    <span>✓</span>
                    <span>
                      {isRtl
                        ? 'تم تأكيد الدفع بنجاح · مقعدك محجوز كطالب معتمد'
                        : 'Payment Verified · Paid Student Seat Confirmed'}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Primary CTA: Changes to "Enroll Now" after payment, respects saleMode */}
                  {isPaid ? (
                    <a
                      id="btn-enroll-now-product"
                      href={product.providerWebsiteUrl}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        height: 48,
                        padding: '0 28px',
                        borderRadius: 8,
                        background: '#15803D',
                        color: '#FFFFFF',
                        fontSize: 15,
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(21, 128, 61, 0.35)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>
                        {isRtl
                          ? 'سجل الآن / الانتقال لمنصة المزود ←'
                          : 'Enroll Now / Continue to Provider Website →'}
                      </span>
                    </a>
                  ) : product.saleMode === 'REDIRECT' && product.redirectUrl ? (
                    <a
                      id="btn-redirect-product"
                      href={product.redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      <span>
                        {isRtl
                          ? (product.ctaLabelAr || 'الانتقال إلى الموقع الرسمي ←')
                          : (product.ctaLabel || 'Go to Official Website →')}
                      </span>
                    </a>
                  ) : (
                    <Link
                      id="btn-pay-now-product"
                      href={`/pay/${product.paySlug}?productId=${product.id}&ventureId=${product.ventureId || product.providerCode}`}
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
                      <span>
                        {isRtl
                          ? (product.ctaLabelAr || 'شراء الآن ←')
                          : (product.ctaLabel || 'Buy now →')}
                      </span>
                    </Link>
                  )}

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
              {/* Premium Course Cover Banner */}
              <div
                style={{
                  height: 210,
                  borderRadius: 14,
                  background: product.thumbnailGradient,
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginBottom: 24,
                  boxShadow: '0 12px 28px -8px rgba(18, 32, 60, 0.25)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {/* Decorative Subtle Overlay Grid */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Banner Row: Provider & Cohort Tag */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: 6,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {product.provider}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'rgba(0, 0, 0, 0.35)',
                      color: '#FDE047',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>★</span>
                    <span>{product.rating}</span>
                  </span>
                </div>

                {/* Center / Bottom Title and Subject Pill */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    {isRtl ? 'المقرر الدراسي المعتمد' : 'Accredited Curriculum'}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, letterSpacing: '-0.01em', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {isRtl ? product.titleAr : product.title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', fontWeight: 600 }}>
                      {product.duration}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', fontWeight: 600 }}>
                      {product.enrolled}+ Enrolled
                    </span>
                  </div>
                </div>
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
                  {['Visa', 'Mastercard', 'Vodafone Cash', 'Fawry Kiosk'].map((badge) => (
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
                    ? 'يتم الدفع عبر بوابة الدفع المركزية لـ bldr مع إصدار فوري للإيصال وتأكيد الحجز.'
                    : 'Securely processed via bldr Central Payment Gateway with instant receipt and ledger verification.'}
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
                <a
                  href={isPaid ? product.providerWebsiteUrl : `/pay/${product.paySlug}?productId=${product.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    width: '100%',
                    height: 44,
                    borderRadius: 8,
                    background: isPaid ? '#15803D' : '#141416',
                    color: '#FFFFFF',
                    fontSize: 13.5,
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: isPaid ? '0 2px 10px rgba(21, 128, 61, 0.3)' : 'none',
                  }}
                >
                  <span>
                    {isPaid
                      ? isRtl
                        ? 'سجل الآن في منصة المزود'
                        : 'Enroll Now in Provider Portal'
                      : isRtl
                      ? 'حجز فوري عبر البوابة المركزية'
                      : 'Pay Now via Central Gateway'}
                  </span>
                </a>
              </div>
            </div>
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

export default function SingleProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F4F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading product...</div>}>
      <SingleProductContent />
    </Suspense>
  );
}
