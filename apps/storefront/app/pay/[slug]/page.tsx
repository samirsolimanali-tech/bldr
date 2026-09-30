'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  tokens,
  formatEGP,
  FawryLogo,
  VodafoneCashLogo,
  InstaPayLogo,
  MeezaLogo,
  VisaLogo,
  MastercardLogo,
  GeideaLogo,
  PaymobLogo,
  CbeComplianceBadge,
  PciDssBadge,
  SslBadge,
} from '@bldr/ui';

interface PaymentDetails {
  slug: string;
  orderNumber: string;
  ventureName: string;
  ventureCode: string;
  chipBg: string;
  chipFg: string;
  description: string;
  amount: number;
  currency: string;
  expiresInMinutes: number;
  supportEmail: string;
  supportPhone: string;
  providerRedirectUrl?: string;
}

const SAMPLE_PAYMENTS: Record<string, PaymentDetails> = {
  'sh-8k2m9q': {
    slug: 'sh-8k2m9q',
    orderNumber: 'SH-COURSE-4581',
    ventureName: 'StudyHub',
    ventureCode: 'SH',
    chipBg: '#E6EFEB',
    chipFg: '#2E6F5E',
    description: 'Math Course — Term 1',
    amount: 750.0,
    currency: 'EGP',
    expiresInMinutes: 24,
    supportEmail: 'support@studyhub.example',
    supportPhone: '+20 10 0000 0000',
  },
  'sh-4r7t1a': {
    slug: 'sh-4r7t1a',
    orderNumber: 'SH-BUNDLE-0212',
    ventureName: 'StudyHub',
    ventureCode: 'SH',
    chipBg: '#E6EFEB',
    chipFg: '#2E6F5E',
    description: 'Physics Complete Bundle',
    amount: 1200.0,
    currency: 'EGP',
    expiresInMinutes: 48,
    supportEmail: 'support@studyhub.example',
    supportPhone: '+20 10 0000 0000',
  },
  'ac-9w3e5z': {
    slug: 'ac-9w3e5z',
    orderNumber: 'AC-REV-1188',
    ventureName: 'Apex Classes',
    ventureCode: 'AC',
    chipBg: '#E8EEF7',
    chipFg: '#2C5F9E',
    description: 'Grade 12 Revision Series',
    amount: 2400.0,
    currency: 'EGP',
    expiresInMinutes: 60,
    supportEmail: 'support@apexclasses.example',
    supportPhone: '+20 12 0000 0000',
  },
  'eh-2n6b8v': {
    slug: 'eh-2n6b8v',
    orderNumber: 'EH-CONS-0455',
    ventureName: 'EL HESA',
    ventureCode: 'EH',
    chipBg: '#FBF3E0',
    chipFg: '#B8860B',
    description: 'Gamified Learning Consultation Fee',
    amount: 600.0,
    currency: 'EGP',
    expiresInMinutes: 30,
    supportEmail: 'support@elhesa.example',
    supportPhone: '+20 11 0000 0000',
  },
  'ch-5t8o2p': {
    slug: 'ch-5t8o2p',
    orderNumber: 'CH-WS-0031',
    ventureName: 'Career Hub',
    ventureCode: 'CH',
    chipBg: '#F0EAF7',
    chipFg: '#7A4CA0',
    description: 'CV Workshop — Oct Cohort',
    amount: 350.0,
    currency: 'EGP',
    expiresInMinutes: 120,
    supportEmail: 'support@careerhub.example',
    supportPhone: '+20 15 0000 0000',
  },
  'sk-ads-camp': {
    slug: 'sk-ads-camp',
    orderNumber: 'SK-ADS-7721',
    ventureName: 'Sidekick Studio',
    ventureCode: 'SK',
    chipBg: '#FBEBE9',
    chipFg: '#D10721',
    description: 'Performance Ads & Paid Growth Engine',
    amount: 12000.0,
    currency: 'EGP',
    expiresInMinutes: 120,
    supportEmail: 'sidekick@bldr.example',
    supportPhone: '+20 10 9999 1111',
  },
  'sk-brand-kit': {
    slug: 'sk-brand-kit',
    orderNumber: 'SK-BRD-5091',
    ventureName: 'Sidekick Studio',
    ventureCode: 'SK',
    chipBg: '#FBEBE9',
    chipFg: '#D10721',
    description: 'Full Brand Identity & Design System',
    amount: 25000.0,
    currency: 'EGP',
    expiresInMinutes: 120,
    supportEmail: 'sidekick@bldr.example',
    supportPhone: '+20 10 9999 1111',
  },
  'sk-tutor-funnel': {
    slug: 'sk-tutor-funnel',
    orderNumber: 'SK-ED-3320',
    ventureName: 'Sidekick Studio',
    ventureCode: 'SK',
    chipBg: '#FBEBE9',
    chipFg: '#D10721',
    description: 'Tutor & Academy Growth Funnel',
    amount: 8500.0,
    currency: 'EGP',
    expiresInMinutes: 120,
    supportEmail: 'sidekick@bldr.example',
    supportPhone: '+20 10 9999 1111',
  },
  'sk-media-prod': {
    slug: 'sk-media-prod',
    orderNumber: 'SK-PROD-8812',
    ventureName: 'Sidekick Studio',
    ventureCode: 'SK',
    chipBg: '#FBEBE9',
    chipFg: '#D10721',
    description: 'Commercial Media & Video Production / Creator Masterclass',
    amount: 3200.0,
    currency: 'EGP',
    expiresInMinutes: 120,
    supportEmail: 'sidekick@bldr.example',
    supportPhone: '+20 10 9999 1111',
  },
  'th-platform-eng': {
    slug: 'th-platform-eng',
    orderNumber: 'TH-ENG-4019',
    ventureName: 'Software & Technology',
    ventureCode: 'TH',
    chipBg: '#E8F5FE',
    chipFg: '#0066CC',
    description: 'Custom Web & Platform Engineering',
    amount: 22000.0,
    currency: 'EGP',
    expiresInMinutes: 120,
    supportEmail: 'tech@bldr.example',
    supportPhone: '+20 10 0000 0000',
  },
  'bm-consult-sess': {
    slug: 'bm-consult-sess',
    orderNumber: 'BM-CONS-1002',
    ventureName: 'bldr Management',
    ventureCode: 'BM',
    chipBg: '#F1F3F5',
    chipFg: '#212529',
    description: 'Strategic Consulting & Business Audit',
    amount: 6000.0,
    currency: 'EGP',
    expiresInMinutes: 120,
    supportEmail: 'partners@bldr.example',
    supportPhone: '+20 10 0000 0000',
  },
};

function buildDetails(base: Omit<PaymentDetails, 'providerRedirectUrl'>): PaymentDetails {
  return {
    ...base,
    providerRedirectUrl: `/providers/enroll?provider=${encodeURIComponent(base.ventureName)}&providerCode=${encodeURIComponent(base.ventureCode)}&order=${encodeURIComponent(base.orderNumber)}&product=${encodeURIComponent(base.description)}&status=PAID`,
  };
}

function resolvePayment(slug: string): PaymentDetails {
  if (SAMPLE_PAYMENTS[slug]) {
    return buildDetails(SAMPLE_PAYMENTS[slug]);
  }

  // Dynamic venture extraction from prefix
  const prefix = slug.slice(0, 2).toLowerCase();
  if (prefix === 'sk') {
    return buildDetails({
      slug,
      orderNumber: `SK-${slug.slice(3, 7).toUpperCase() || 'SVC-9901'}`,
      ventureName: 'Sidekick Studio',
      ventureCode: 'SK',
      chipBg: '#FBEBE9',
      chipFg: '#D10721',
      description: 'Marketing, Ads & Growth Package',
      amount: 8500.0,
      currency: 'EGP',
      expiresInMinutes: 60,
      supportEmail: 'sidekick@bldr.example',
      supportPhone: '+20 10 9999 1111',
    });
  }
  if (prefix === 'th') {
    return buildDetails({
      slug,
      orderNumber: `TH-${slug.slice(3, 7).toUpperCase() || 'ENG-7701'}`,
      ventureName: 'Tech House',
      ventureCode: 'TH',
      chipBg: '#E8F5FE',
      chipFg: '#0066CC',
      description: 'Engineering & Gateway Integration',
      amount: 15000.0,
      currency: 'EGP',
      expiresInMinutes: 60,
      supportEmail: 'tech@bldr.example',
      supportPhone: '+20 10 0000 0000',
    });
  }
  if (prefix === 'bm') {
    return buildDetails({
      slug,
      orderNumber: `BM-${slug.slice(3, 7).toUpperCase() || 'ADV-1102'}`,
      ventureName: 'bldr Management',
      ventureCode: 'BM',
      chipBg: '#F1F3F5',
      chipFg: '#212529',
      description: 'Strategic Business Consulting',
      amount: 6000.0,
      currency: 'EGP',
      expiresInMinutes: 60,
      supportEmail: 'partners@bldr.example',
      supportPhone: '+20 10 0000 0000',
    });
  }
  if (prefix === 'eh') {
    return buildDetails({
      slug,
      orderNumber: `EH-${slug.slice(3, 7).toUpperCase() || 'PAY-8921'}`,
      ventureName: 'EL HESA',
      ventureCode: 'EH',
      chipBg: '#FBF3E0',
      chipFg: '#B8860B',
      description: 'Gamified Learning & Course Access',
      amount: 450.0,
      currency: 'EGP',
      expiresInMinutes: 45,
      supportEmail: 'support@elhesa.example',
      supportPhone: '+20 11 0000 0000',
    });
  }
  if (prefix === 'ch') {
    return buildDetails({
      slug,
      orderNumber: `CH-${slug.slice(3, 7).toUpperCase() || 'WS-4012'}`,
      ventureName: 'Career Hub',
      ventureCode: 'CH',
      chipBg: '#F0EAF7',
      chipFg: '#7A4CA0',
      description: 'Career Training & Workshop Pass',
      amount: 350.0,
      currency: 'EGP',
      expiresInMinutes: 60,
      supportEmail: 'support@careerhub.example',
      supportPhone: '+20 15 0000 0000',
    });
  }
  if (prefix === 'ac') {
    return buildDetails({
      slug,
      orderNumber: `AC-${slug.slice(3, 7).toUpperCase() || 'ENR-9102'}`,
      ventureName: 'Apex Classes',
      ventureCode: 'AC',
      chipBg: '#E8EEF7',
      chipFg: '#2C5F9E',
      description: 'Academic Cohort Enrollment',
      amount: 1800.0,
      currency: 'EGP',
      expiresInMinutes: 60,
      supportEmail: 'support@apexclasses.example',
      supportPhone: '+20 12 0000 0000',
    });
  }

  return buildDetails({
    slug,
    orderNumber: `SH-${slug.slice(3, 7).toUpperCase() || 'COURSE-4581'}`,
    ventureName: 'StudyHub',
    ventureCode: 'SH',
    chipBg: '#E6EFEB',
    chipFg: '#2E6F5E',
    description: 'Educational Course & Tutor Services',
    amount: 750.0,
    currency: 'EGP',
    expiresInMinutes: 30,
    supportEmail: 'support@studyhub.example',
    supportPhone: '+20 10 0000 0000',
  });
}

function CentralPaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawSlug = (params?.slug as string) || 'sh-8k2m9q';
  const productId = searchParams?.get('productId') || '';
  const payment = resolvePayment(rawSlug);

  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [method, setMethod] = useState<'CARD' | 'WALLET' | 'KIOSK'>('KIOSK');
  const [walletPhone, setWalletPhone] = useState('01012345678');
  const [fawryRefCode] = useState('788-9921-4820');
  const [fawryCopied, setFawryCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paidTxnId, setPaidTxnId] = useState('');
  const isRtl = lang === 'AR';

  const copyFawry = () => {
    navigator.clipboard.writeText(fawryRefCode.replace(/-/g, ''));
    setFawryCopied(true);
    setTimeout(() => setFawryCopied(false), 2000);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      const txn = `txn_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setPaidTxnId(txn);
      try {
        localStorage.setItem(`bldr_paid_${rawSlug}`, 'true');
        localStorage.setItem(`bldr_paid_order_${payment.orderNumber}`, 'true');
        if (productId) {
          localStorage.setItem(`bldr_paid_${productId}`, 'true');
        }
      } catch (e) {}
    }, 1200);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        background: '#E9EDF3',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.ui,
        padding: '36px 16px 64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {/* ─── Browser / URL Mock Header ──────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          background: '#F5F7FA',
          border: '1px solid #D3DAE4',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 12px 32px -12px rgba(18,32,60,0.18)',
        }}
      >
        {/* Fake URL Bar */}
        <div
          dir="ltr"
          style={{
            height: 36,
            background: '#E7EBF1',
            borderBottom: '1px solid #D3DAE4',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 9,
          }}
        >
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9D2DE' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9D2DE' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9D2DE' }} />
          </div>
          <div
            style={{
              flex: 1,
              height: 22,
              background: '#FFFFFF',
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '0 10px',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4.8 7.2V5.4a3.2 3.2 0 016.4 0v1.8M4 7.2h8v5.6H4z" />
            </svg>
            <span style={{ fontFamily: tokens.fonts.mono, fontSize: 10.5, color: '#5A6A80' }}>
              https://pay.bldr.com/l/{payment.slug}
            </span>
          </div>
        </div>

        {/* ─── Top Bar with Provider Brand & Verification ────────────────── */}
        <div
          style={{
            height: 68,
            background: '#FFFFFF',
            borderBottom: '1px solid #E3E8EF',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 14,
          }}
        >
          {/* Provider Logo Avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: payment.chipFg,
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
              fontFamily: tokens.fonts.mono,
              boxShadow: `0 4px 12px ${payment.chipFg}30`,
              letterSpacing: '0.04em',
            }}
          >
            {payment.ventureCode}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#12203C', letterSpacing: '-0.02em' }}>
                {payment.ventureName}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: '2px 7px',
                  background: '#ECFDF5',
                  color: '#065F46',
                  borderRadius: 999,
                  border: '1px solid #A7F3D0',
                }}
              >
                <span>✓</span>
                <span>{isRtl ? 'مقدم معتمد' : 'Verified Provider'}</span>
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>
              {isRtl ? 'المنصة الرسمية المعتمدة لسداد المصروفات' : 'Official Tuition & Enrollment Checkout'}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Hotline Contact Chip */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10.5, color: '#8A94A6' }}>{isRtl ? 'المساعدة والدعم' : 'Support Hotline'}</span>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#12203C' }}>{payment.supportPhone}</div>
          </div>

          {/* Language Toggle */}
          <div style={{ display: 'flex', padding: 3, background: '#EEF1F5', borderRadius: 8, gap: 2 }}>
            <button
              onClick={() => setLang('EN')}
              style={{
                border: 'none',
                fontSize: 11.5,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                background: lang === 'EN' ? '#FFFFFF' : 'transparent',
                color: lang === 'EN' ? '#12203C' : '#8A94A6',
                cursor: 'pointer',
                boxShadow: lang === 'EN' ? '0 1px 2px rgba(27,42,74,0.1)' : 'none',
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLang('AR')}
              style={{
                border: 'none',
                fontSize: 11.5,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                background: lang === 'AR' ? '#FFFFFF' : 'transparent',
                color: lang === 'AR' ? '#12203C' : '#8A94A6',
                cursor: 'pointer',
                boxShadow: lang === 'AR' ? '0 1px 2px rgba(27,42,74,0.1)' : 'none',
              }}
            >
              العربية
            </button>
          </div>
        </div>

        {/* ─── Main Checkout Body ────────────────────────────────── */}
        <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {isPaid ? (
            /* ─── Success Confirmation ─── */
            <div
              style={{
                background: '#F4F9F7',
                border: '1.5px solid #2E6F5E',
                borderRadius: 14,
                padding: '36px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: '#2E6F5E',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  boxShadow: '0 4px 16px rgba(46,111,94,0.3)',
                }}
              >
                ✓
              </div>
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#12203C' }}>
                  {isRtl ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
                </h2>
                <div style={{ fontSize: 13.5, color: '#2E6F5E', fontWeight: 700 }}>
                  {isRtl ? 'تم حجز مقعدك وتأكيد اشتراكك كطالب معتمد' : 'Your seat is reserved as a verified paid user'}
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 13.5, color: '#5A6A80', maxWidth: 460, lineHeight: 1.55 }}>
                {isRtl
                  ? `تمت تسوية المعاملة عبر بوابة الدفع وتأكيد القيد مع ${payment.ventureName}. اضغط على زر "سجل الآن" أدناه للانتقال لموقع المزود وإكمال التسجيل.`
                  : `Your payment was settled via signed webhook. Reference: ${payment.orderNumber}. Click "Enroll Now" below to redirect to the provider's platform and access your cohort.`}
              </p>

              <div style={{ fontFamily: tokens.fonts.mono, fontSize: 12, background: '#FFFFFF', padding: '6px 14px', borderRadius: 6, border: '1px solid #DDE3EC' }}>
                Transaction ID: {paidTxnId}
              </div>

              {/* The "Enroll Now" Primary Button */}
              <a
                id="btn-enroll-now-gateway"
                href={payment.providerRedirectUrl}
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 10,
                  background: '#15803D',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontSize: 16,
                  fontWeight: 800,
                  boxShadow: '0 4px 18px rgba(21, 128, 61, 0.35)',
                  transition: 'background 0.15s ease',
                  marginTop: 6,
                }}
              >
                <span>{isRtl ? 'سجل الآن / الانتقال لمنصة المزود لمتابعة الالتحاق كطالب معتمد ←' : 'Enroll Now / Continue to Provider Website as Paid User →'}</span>
              </a>

              {/* Secondary Navigation Links */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
                {productId && (
                  <Link
                    href={`/products/${productId}?paid=true`}
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#2E6F5E',
                      textDecoration: 'none',
                    }}
                  >
                    {isRtl ? '← العودة لصفحة المنتج (كطالب معتمد)' : '← Return to Product (Paid User)'}
                  </Link>
                )}
                <Link
                  href="http://localhost:3002"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#8A94A6',
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'السجل المالي المركزي' : 'Central Payment Ledger →'}
                </Link>
              </div>
            </div>
          ) : (
            /* ─── Payment Form ─── */
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontFamily: tokens.fonts.mono, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A94A6' }}>
                  {isRtl ? 'طلب دفع' : 'Payment request'}
                </span>
                <div style={{ fontSize: 21, fontWeight: 800, color: '#12203C', letterSpacing: '-0.025em' }}>
                  {payment.description}
                </div>
                <span style={{ fontFamily: tokens.fonts.mono, fontSize: 11, color: '#5A6A80' }}>
                  {payment.orderNumber} · {payment.ventureName}
                </span>
              </div>

              <div style={{ height: 1, background: '#EEF1F5' }} />

              {/* Amount Display */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8A94A6' }}>
                    {isRtl ? 'المبلغ المطلوب' : 'Amount due'}
                  </span>
                  <span style={{ fontFamily: tokens.fonts.mono, fontSize: 30, fontWeight: 600, color: '#12203C', letterSpacing: '-0.03em' }}>
                    {formatEGP(payment.amount)}
                  </span>
                </div>
                <div style={{ padding: '6px 10px', background: '#F5F7FA', borderRadius: 7, maxWidth: 220, fontSize: 10, color: '#5A6A80', lineHeight: 1.35 }}>
                  {isRtl
                    ? `المبلغ والطلب محدد من قِبل ${payment.ventureName} وغير قابل للتعديل.`
                    : `Amount and order are fixed by ${payment.ventureName} and cannot be altered here.`}
                </div>
              </div>

              <div style={{ height: 1, background: '#EEF1F5' }} />

              {/* Method Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#12203C' }}>
                  {isRtl ? 'اختر طريقة الدفع' : 'Choose how to pay'}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 9 }}>
                  {[
                    {
                      id: 'CARD' as const,
                      labelEn: 'Card',
                      labelAr: 'بطاقة بنكية',
                      subEn: 'Visa, Mastercard, Meeza',
                      subAr: 'فيزا، ماستركارد، ميزة',
                      logos: (
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <MeezaLogo height={18} />
                          <VisaLogo height={18} />
                          <MastercardLogo height={18} />
                        </div>
                      ),
                    },
                    {
                      id: 'WALLET' as const,
                      labelEn: 'Mobile Wallet',
                      labelAr: 'محفظة إلكترونية',
                      subEn: 'Vodafone, InstaPay, Orange, WE',
                      subAr: 'فودافون، إنستاباي، أورنج، وي',
                      logos: (
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <VodafoneCashLogo height={18} />
                          <InstaPayLogo height={18} />
                        </div>
                      ),
                    },
                    {
                      id: 'KIOSK' as const,
                      labelEn: 'Kiosk',
                      labelAr: 'فوري كاش',
                      subEn: 'Cash at 300K+ branches',
                      subAr: 'ادفع نقداً عبر فوري',
                      logos: <FawryLogo height={20} />,
                    },
                  ].map((m) => {
                    const active = method === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        style={{
                          border: active ? '1.5px solid #2E6F5E' : '1px solid #E3E8EF',
                          background: active ? '#F4F9F7' : '#FFFFFF',
                          borderRadius: 9,
                          padding: '12px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              style={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                border: active ? '3px solid #2E6F5E' : '1.5px solid #C9D2DE',
                                background: '#FFFFFF',
                              }}
                            />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#12203C' }}>
                              {isRtl ? m.labelAr : m.labelEn}
                            </span>
                          </div>
                        </div>
                        <div>
                          {m.logos}
                        </div>
                        <span style={{ fontSize: 10, color: '#5A6A80' }}>
                          {isRtl ? m.subAr : m.subEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Egyptian Checkout Box based on Selected Method */}
              <div style={{ border: '1px solid #DDE3EC', borderRadius: 10, overflow: 'hidden' }}>
                {method === 'KIOSK' && (
                  <div>
                    <div style={{ padding: '10px 14px', background: '#FFFBEB', borderBottom: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#92400E' }}>
                          {isRtl ? 'بوابة فوري الرسمية (Fawry Pay)' : 'Official Fawry Pay Gateway'}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', background: '#FEF3C7', color: '#B45309', borderRadius: 4 }}>
                        كود خدمة 788
                      </span>
                    </div>

                    <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#FFFFFF' }}>
                      <div style={{ background: '#FFFDF5', border: '2px dashed #F59E0B', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309', marginBottom: 4 }}>
                          {isRtl ? 'رقم السداد المرجعي المباشر لدى فوري:' : 'Direct Fawry Reference Code:'}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.08em', color: '#1F2937', fontFamily: tokens.fonts.mono, margin: '6px 0' }}>
                          {fawryRefCode}
                        </div>
                        <button
                          type="button"
                          onClick={copyFawry}
                          style={{
                            background: fawryCopied ? '#059669' : '#F59E0B',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {fawryCopied ? (isRtl ? '✓ تم النسخ!' : '✓ Copied!') : (isRtl ? 'نسخ كود فوري' : 'Copy Fawry Code')}
                        </button>
                      </div>

                      <div style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.6, background: '#F9FAFB', padding: '10px 12px', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                        <strong>{isRtl ? 'طريقة السداد عبر منافذ فوري:' : 'How to pay at Fawry retail points:'}</strong><br />
                        {isRtl
                          ? '1. توجه لأي منفذ أو ماكينة فوري أو افتح تطبيق myFawry.\n2. اطلب خدمة فوري باي (كود 788 - Bldr EdTech).\n3. ادخل كود السداد أعلاه وسدد المبلغ نقداً لتفعيل حسابك فوراً.'
                          : '1. Visit any Fawry kiosk or open the myFawry mobile app.\n2. Request service code 788 (Bldr EdTech).\n3. Present your reference code and pay cash to instantly activate your seat.'}
                      </div>
                    </div>
                  </div>
                )}

                {method === 'WALLET' && (
                  <div>
                    <div style={{ padding: '10px 14px', background: '#ECFDF5', borderBottom: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#065F46' }}>
                          {isRtl ? 'المحافظ الإلكترونية وإنستاباي' : 'Egyptian Mobile Wallets & InstaPay'}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', background: '#D1FAE5', color: '#047857', borderRadius: 4 }}>
                        خصم لحظي فوري
                      </span>
                    </div>

                    <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#FFFFFF' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {['فودافون كاش', 'أورنج كاش', 'اتصالات كاش', 'WE Pay', 'InstaPay'].map(w => (
                          <span key={w} style={{ fontSize: 10.5, fontWeight: 700, background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: 4 }}>
                            {w}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#1F2937' }}>
                          {isRtl ? 'ادخل رقم هاتف المحفظة (010 / 011 / 012 / 015):' : 'Enter Egyptian Wallet Mobile Number:'}
                        </label>
                        <input
                          type="text"
                          value={walletPhone}
                          onChange={e => setWalletPhone(e.target.value)}
                          placeholder="010XXXXXXXX"
                          style={{
                            height: 38,
                            border: '1.5px solid #10B981',
                            borderRadius: 6,
                            padding: '0 12px',
                            fontFamily: tokens.fonts.mono,
                            fontSize: 13,
                            color: '#12203C',
                            background: '#F0FDF4',
                            fontWeight: 700,
                          }}
                        />
                      </div>

                      <span style={{ fontSize: 10.5, color: '#047857', lineHeight: 1.5 }}>
                        {isRtl
                          ? 'بمجرد الضغط على زر الدفع، سيصلك إشعار أو رسالة USSD على هاتفك لإدخال الرقم السري وتأكيد السداد.'
                          : 'Upon clicking proceed, a push authorization prompt will be dispatched to your phone to confirm with your wallet PIN.'}
                      </span>
                    </div>
                  </div>
                )}

                {method === 'CARD' && (
                  <div>
                    <div style={{ padding: '9px 14px', background: '#FAFBFD', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M4.8 7.2V5.4a3.2 3.2 0 016.4 0v1.8M4 7.2h8v5.6H4z" />
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#12203C' }}>
                          {isRtl ? 'نموذج البطاقات المعتمد وميزة (Geidea / Paymob)' : 'PCI DSS Certified Card Checkout (Meeza / Visa / MC)'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <span style={{ fontSize: 9.5, padding: '2px 5px', background: '#DBEAFE', color: '#1E40AF', borderRadius: 3, fontWeight: 800 }}>ميزة Meeza</span>
                        <span style={{ fontSize: 9.5, padding: '2px 5px', background: '#F1F5F9', color: '#334155', borderRadius: 3, fontWeight: 800 }}>Visa</span>
                        <span style={{ fontSize: 9.5, padding: '2px 5px', background: '#FEE2E2', color: '#991B1B', borderRadius: 3, fontWeight: 800 }}>Mastercard</span>
                      </div>
                    </div>

                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8A94A6' }}>
                          {isRtl ? 'رقم البطاقة (ميزة أو بنكية)' : 'Card Number (Meeza / Debit / Credit)'}
                        </span>
                        <input
                          type="text"
                          readOnly
                          value="5078 •••• •••• 9128 (Meeza)"
                          style={{
                            height: 36,
                            border: '1px solid #E3E8EF',
                            borderRadius: 6,
                            padding: '0 10px',
                            fontFamily: tokens.fonts.mono,
                            fontSize: 13,
                            color: '#12203C',
                            background: '#FAFBFD',
                          }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#8A94A6' }}>{isRtl ? 'تاريخ الانتهاء' : 'Expiry'}</span>
                          <input
                            type="text"
                            readOnly
                            value="12 / 28"
                            style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 6, padding: '0 10px', fontFamily: tokens.fonts.mono, fontSize: 13, color: '#12203C', background: '#FAFBFD' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#8A94A6' }}>CVC</span>
                          <input
                            type="text"
                            readOnly
                            value="•••"
                            style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 6, padding: '0 10px', fontFamily: tokens.fonts.mono, fontSize: 13, color: '#12203C', background: '#FAFBFD' }}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: 10.5, color: '#5A6A80' }}>
                        {isRtl
                          ? 'محمي بخاصية 3D Secure ومعالج لدى بوابات الدفع المرخصة من البنك المركزي المصري.'
                          : 'Protected with 3D Secure and processed via Central Bank of Egypt certified gateways.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pay Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  style={{
                    height: 48,
                    borderRadius: 9,
                    background: method === 'KIOSK' ? '#D97706' : method === 'WALLET' ? '#059669' : '#2E6F5E',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 14.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {isProcessing ? (
                    <span>{isRtl ? 'جاري المعالجة والتحقق...' : 'Processing checkout...'}</span>
                  ) : method === 'KIOSK' ? (
                    <span>{isRtl ? `تأكيد كود فوري (${formatEGP(payment.amount)}) ←` : `Confirm Fawry Code (${formatEGP(payment.amount)}) ←`}</span>
                  ) : method === 'WALLET' ? (
                    <span>{isRtl ? `طلب خصم من المحفظة (${formatEGP(payment.amount)}) ←` : `Authorize Wallet Payment (${formatEGP(payment.amount)}) ←`}</span>
                  ) : (
                    <span>{isRtl ? `سداد بالبطاقة (${formatEGP(payment.amount)}) ←` : `Pay with Card (${formatEGP(payment.amount)}) ←`}</span>
                  )}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#B8860B', fontWeight: 600 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{isRtl ? `ينتهي هذا الرابط خلال ${payment.expiresInMinutes} دقيقة` : `This payment link expires in ${payment.expiresInMinutes}:00`}</span>
                </div>
              </div>
            </>
          )}

          {/* High-Trust Fintech Footer */}
          <div
            style={{
              borderTop: '1px solid #E2E8F0',
              paddingTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Row 1: Payment Managed by bldr & Secured by Gateway */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              {/* bldr Management badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: '#D10721',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  b
                </div>
                <div style={{ fontSize: 11.5, color: '#334155' }}>
                  Payment Managed by <strong style={{ color: '#0F172A', fontWeight: 800 }}>bldr</strong>
                </div>
              </div>

              {/* Gateway Security Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>Secured payment by:</span>
                {method === 'KIOSK' ? (
                  <FawryLogo height={26} />
                ) : method === 'WALLET' ? (
                  <PaymobLogo height={26} />
                ) : (
                  <GeideaLogo height={26} />
                )}
              </div>
            </div>

            {/* Row 2: Regulatory & Bank Security Trust Seals */}
            <div
              style={{
                borderTop: '1px dashed #CBD5E1',
                paddingTop: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <SslBadge />
                <CbeComplianceBadge />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <PciDssBadge />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: 6 }}>
                  3D Secure 2.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CentralPaymentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#E9EDF3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading checkout...</div>}>
      <CentralPaymentContent />
    </Suspense>
  );
}
