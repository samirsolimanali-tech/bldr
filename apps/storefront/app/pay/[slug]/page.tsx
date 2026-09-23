'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tokens, formatEGP } from '@bldr/ui';

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
  'th-gateway-int': {
    slug: 'th-gateway-int',
    orderNumber: 'TH-INT-4019',
    ventureName: 'Tech House',
    ventureCode: 'TH',
    chipBg: '#E8F5FE',
    chipFg: '#0066CC',
    description: 'Central Payment Gateway Integration',
    amount: 15000.0,
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

function resolvePayment(slug: string): PaymentDetails {
  if (SAMPLE_PAYMENTS[slug]) {
    return SAMPLE_PAYMENTS[slug];
  }

  // Dynamic venture extraction from prefix
  const prefix = slug.slice(0, 2).toLowerCase();
  if (prefix === 'sk') {
    return {
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
    };
  }
  if (prefix === 'th') {
    return {
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
    };
  }
  if (prefix === 'bm') {
    return {
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
    };
  }
  if (prefix === 'eh') {
    return {
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
    };
  }
  if (prefix === 'ch') {
    return {
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
    };
  }
  if (prefix === 'ac') {
    return {
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
    };
  }

  return {
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
  };
}

export default function CentralPaymentPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || 'sh-8k2m9q';
  const payment = resolvePayment(rawSlug);

  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [method, setMethod] = useState<'CARD' | 'WALLET' | 'KIOSK'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paidTxnId, setPaidTxnId] = useState('');
  const isRtl = lang === 'AR';

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      setPaidTxnId(`txn_${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
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

        {/* ─── Top Bar with Venture Brand ────────────────────────── */}
        <div
          style={{
            height: 62,
            background: '#FFFFFF',
            borderBottom: '1px solid #E3E8EF',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: payment.chipFg,
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
              fontFamily: tokens.fonts.mono,
            }}
          >
            {payment.ventureCode}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#12203C', letterSpacing: '-0.02em' }}>
              {payment.ventureName}
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: '#8A94A6' }}>
              {isRtl ? 'دفع آمن ومحمي' : 'Secure payment'}
            </span>
          </div>

          <div style={{ flex: 1 }} />

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
                borderRadius: 12,
                padding: '32px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#2E6F5E',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                ✓
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#12203C' }}>
                {isRtl ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
              </h2>
              <p style={{ margin: 0, fontSize: 13.5, color: '#5A6A80', maxWidth: 440 }}>
                {isRtl
                  ? `تم تأكيد العملية من خلال الويب هوك الخاص بـ ${payment.ventureName} وتم تحديث السجل المركزي.`
                  : `Your transaction has been verified via signed PSP webhook. Order reference: ${payment.orderNumber}`}
              </p>
              <div style={{ fontFamily: tokens.fonts.mono, fontSize: 12, background: '#FFFFFF', padding: '6px 14px', borderRadius: 6, border: '1px solid #DDE3EC' }}>
                Transaction ID: {paidTxnId}
              </div>
              <Link
                href="http://localhost:3002"
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#2E6F5E',
                  textDecoration: 'none',
                }}
              >
                {isRtl ? 'عرض المعاملة في لوحة التحكم المركزية ←' : 'Inspect transaction in Central Payment Hub →'}
              </Link>
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
                    { id: 'CARD' as const, labelEn: 'Card', labelAr: 'بطاقة بنكية', subEn: 'Visa, Mastercard, Meeza', subAr: 'فيزا، ماستركارد، ميزة' },
                    { id: 'WALLET' as const, labelEn: 'Mobile Wallet', labelAr: 'محفظة إلكترونية', subEn: 'Vodafone, Orange, WE', subAr: 'فودافون، أورنج، وي' },
                    { id: 'KIOSK' as const, labelEn: 'Kiosk', labelAr: 'فوري كاش', subEn: 'Cash at any branch', subAr: 'ادفع نقداً عبر فوري' },
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
                          gap: 6,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
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
                        <span style={{ fontSize: 10, color: '#5A6A80' }}>
                          {isRtl ? m.subAr : m.subEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PSP Certified Checkout Simulator Box */}
              <div style={{ border: '1px solid #DDE3EC', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '9px 14px', background: '#FAFBFD', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4.8 7.2V5.4a3.2 3.2 0 016.4 0v1.8M4 7.2h8v5.6H4z" />
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#12203C' }}>
                    {isRtl ? 'نموذج دفع معتمد (Geidea / Fawry)' : 'PCI DSS Certified Hosted Form (Geidea / Fawry)'}
                  </span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontFamily: tokens.fonts.mono, fontSize: 9.5, color: '#8A94A6' }}>
                    Hosted by Provider
                  </span>
                </div>
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8A94A6' }}>
                      {isRtl ? 'رقم البطاقة' : 'Card Number'}
                    </span>
                    <input
                      type="text"
                      readOnly
                      value="5200 •••• •••• 4242"
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
                      ? 'بيانات البطاقة لا تعبر خوادم bldr مطلقاً ويتم معالجتها لدى مزود الدفع مباشرة.'
                      : 'Card details are processed exclusively through certified provider components and never touch bldr servers.'}
                  </span>
                </div>
              </div>

              {/* Pay Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  style={{
                    height: 48,
                    borderRadius: 9,
                    background: '#2E6F5E',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 14.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 2px 8px rgba(46,111,94,0.25)',
                  }}
                >
                  {isProcessing ? (
                    <span>{isRtl ? 'جاري المعالجة...' : 'Processing checkout...'}</span>
                  ) : (
                    <span>{isRtl ? `ادفع ${formatEGP(payment.amount)}` : `Pay ${formatEGP(payment.amount)}`}</span>
                  )}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#B8860B', fontWeight: 600 }}>
                  <span>⏳</span>
                  <span>{isRtl ? `ينتهي هذا الرابط خلال ${payment.expiresInMinutes} دقيقة` : `This payment link expires in ${payment.expiresInMinutes}:00`}</span>
                </div>
              </div>
            </>
          )}

          {/* Legal / Operating Notice */}
          <div style={{ borderTop: '1px solid #EEF1F5', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#5A6A80' }}>
              Operated by Evolve bldr for Business Management
            </span>
            <span style={{ fontSize: 10.5, color: '#8A94A6', maxWidth: 460 }}>
              {payment.ventureName} is a brand operated by bldr. bldr is the seller of record for this transaction and is responsible for the invoice and fulfillment.
            </span>
            <div style={{ display: 'flex', gap: 12, fontSize: 10.5, color: '#2E6F5E', fontWeight: 600, marginTop: 4 }}>
              <span>support@bldr.io</span>
              <span>·</span>
              <span>Cairo, Egypt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
