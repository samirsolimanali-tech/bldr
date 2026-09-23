'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens, formatEGP } from '@bldr/ui';
import { SERVICES_CATALOG, ServiceItem } from '../data';

export default function ServiceDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || 'performance-ads';
  const service: ServiceItem = SERVICES_CATALOG.find((s) => s.slug === rawSlug) || SERVICES_CATALOG[0];

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

      <main style={{ flex: 1, padding: '48px 32px 84px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A6A80', marginBottom: 28 }}>
            <Link href="/" style={{ color: '#8A94A6', textDecoration: 'none' }}>
              {isRtl ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/services" style={{ color: '#8A94A6', textDecoration: 'none' }}>
              {isRtl ? 'الخدمات' : 'Services'}
            </Link>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#141416' }}>
              {isRtl ? service.titleAr : service.title}
            </span>
          </div>

          {/* Hero Header */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid rgba(20,20,22,0.08)',
            padding: '40px 36px',
            marginBottom: 36,
            boxShadow: '0 4px 16px rgba(20,20,22,0.04)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.9fr)',
            gap: 40,
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 12px',
                borderRadius: 999,
                background: 'rgba(209, 7, 33, 0.08)',
                color: '#D10721',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}>
                {service.unit} · {isRtl ? service.categoryAr : service.category}
              </div>

              <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#12203C', lineHeight: 1.2, letterSpacing: '-0.03em' }}>
                {isRtl ? service.titleAr : service.title}
              </h1>

              <p style={{ margin: '0 0 24px', fontSize: 16, lineHeight: 1.65, fontWeight: 300, color: '#47454A' }}>
                {isRtl ? service.shortDescAr : service.shortDesc}
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 48,
                    padding: '0 28px',
                    borderRadius: 8,
                    background: tokens.colors.brandDark,
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(20,20,22,0.2)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>✉️</span>
                  <span>{isRtl ? 'تواصل معنا لبدء المشروع' : 'Start a Project / Contact Us'}</span>
                </button>

                <Link
                  href={`/pay/${service.paySlug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 48,
                    padding: '0 20px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D3DAE4',
                    color: '#12203C',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>💳</span>
                  <span>{isRtl ? 'حجز فوري أونلاين' : 'Direct Booking / Pay Now'}</span>
                </Link>
              </div>
            </div>

            {/* Pricing Card */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: 16,
              border: '1px solid #E3E8EF',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {isRtl ? 'التسعير المباشر للباقة' : 'Package Investment'}
                </span>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#12203C', fontFamily: tokens.fonts.mono, marginTop: 4 }}>
                  {formatEGP(service.priceEGP)}
                </div>
                <div style={{ fontSize: 12.5, color: '#5A6A80', marginTop: 4 }}>
                  {isRtl ? `مدة التنفيذ: ${service.deliveryTimeAr}` : `Delivery Timeline: ${service.deliveryTime}`}
                </div>
              </div>

              <div style={{ height: 1, background: '#E3E8EF' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1B2A4A' }}>
                  {isRtl ? 'وسائل الدفع المقبولة فوراً:' : 'Supported Payment Methods:'}
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['Visa', 'Mastercard', 'Meeza', 'Vodafone Cash', 'Fawry Kiosk'].map((badge) => (
                    <span key={badge} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#FFFFFF', border: '1px solid #D3DAE4', color: '#5A6A80', fontWeight: 600 }}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#8A94A6', lineHeight: 1.5 }}>
                {isRtl
                  ? '🔒 معاملات مؤمنة بنظام التشفير المركزي من bldr مع إصدار فوري للفواتير والإشعارات.'
                  : '🔒 Processed via bldr Central Payment Hub with verified double-entry ledger settlement.'}
              </div>
            </div>
          </div>

          {/* Detailed Deliverables & Methodology */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 32 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(20,20,22,0.08)', padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#12203C', margin: '0 0 18px' }}>
                {isRtl ? 'المخرجات ونطاق العمل التفصيلي' : 'Comprehensive Scope & Deliverables'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(isRtl ? service.deliverablesAr : service.deliverables).map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(46, 111, 94, 0.12)',
                      color: '#2E6F5E',
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                      marginTop: 2,
                    }}>
                      ✓
                    </div>
                    <div style={{ fontSize: 15, color: '#141416', lineHeight: 1.6, fontWeight: 400 }}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(20,20,22,0.08)', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#12203C', margin: '0 0 12px' }}>
                  {isRtl ? 'منهجية العمل مع bldr' : 'The bldr Methodology'}
                </h3>
                <p style={{ fontSize: 14, color: '#47454A', lineHeight: 1.6, margin: '0 0 20px', fontWeight: 300 }}>
                  {isRtl
                    ? 'نعمل كشريك استراتيجي مدمج، وليس مجرد مورد خارجي. وحدة Sidekick تضمن لك جودة الإعلانات والمحتوى، بينما تتولى بوابة الدفع المركزية استلام الأموال وتسويتها.'
                    : 'We operate as an integrated venture partner. Specialist unit leads manage performance and design while the Central Payment Hub guarantees transparent settlement.'}
                </p>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E3E8EF' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>
                  {isRtl ? 'هل تحتاج متطلبات خاصة؟' : 'Need Custom Deliverables?'}
                </div>
                <div style={{ fontSize: 12.5, color: '#5A6A80', marginBottom: 12 }}>
                  {isRtl ? 'يمكننا تخصيص الباقة لتناسب ميزانيتك وأهدافك الخاصة.' : 'We can tailor milestones, ad budgets, and timelines.'}
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#2C5F9E',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  {isRtl ? 'تحدث مع الشريك الاستشاري ←' : 'Speak with an Engagement Partner →'}
                </button>
              </div>
            </div>
          </div>

          {/* Main CTA Section */}
          <div style={{
            marginTop: 48,
            background: 'linear-gradient(135deg, #141416 0%, #1E2229 100%)',
            borderRadius: 20,
            padding: '44px 36px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 28,
            flexWrap: 'wrap',
          }}>
            <div style={{ maxWidth: 600 }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 10px', color: '#FFFFFF' }}>
                {isRtl ? 'جاهز لبدء هذا المشروع معك ومع فريقنا؟' : 'Ready to launch this service with bldr?'}
              </h3>
              <p style={{ fontSize: 14.5, color: '#A0AAB8', margin: 0, lineHeight: 1.6 }}>
                {isRtl
                  ? 'أرسل لنا تفاصيل مشروعك أو التحديات التي تواجهك وسيتواصل معك شريك الاستوديو خلال ٢٤ ساعة لمناقشة خطة العمل.'
                  : 'Submit your brief and an engagement partner will review your goals and schedule a strategic discovery call within 24 hours.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              style={{
                height: 50,
                padding: '0 32px',
                borderRadius: 999,
                background: '#FFFFFF',
                color: '#141416',
                fontSize: 15,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              {isRtl ? 'ابدأ مشروعك / نموذج التواصل ←' : 'Start a project / Contact form →'}
            </button>
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
