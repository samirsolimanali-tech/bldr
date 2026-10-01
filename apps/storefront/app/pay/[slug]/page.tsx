'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS_CATALOG } from '../../products/data';
import { getVentureConfig } from '../../../lib/ventures';
import {
  tokens,
  FawryLogo,
  VisaLogo,
  MastercardLogo,
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
  descriptionAr?: string;
  amount: number;
  currency: string;
  expiresInMinutes: number;
  supportEmail: string;
  supportPhone: string;
  primaryGateway: 'geidea' | 'paymob';
  fawryEnabled: boolean;
  codeActivationEnabled: boolean;
  ctaLabel?: string;
  ctaLabelAr?: string;
  providerRedirectUrl?: string;
}

function resolvePaymentFallback(slug: string, productId?: string): PaymentDetails {
  if (productId) {
    const prod = PRODUCTS_CATALOG.find((p) => p.id === productId || p.slug === productId);
    if (prod) {
      const venture = getVentureConfig(prod.ventureId || prod.providerCode);
      return {
        slug,
        orderNumber: `${prod.providerCode}-${slug.slice(-4).toUpperCase()}`,
        ventureName: prod.provider,
        ventureCode: prod.providerCode,
        chipBg: prod.chipBg || '#E8EEF7',
        chipFg: prod.chipFg || '#2C5F9E',
        description: prod.title,
        descriptionAr: prod.titleAr,
        amount: prod.priceEGP,
        currency: 'EGP',
        expiresInMinutes: 60,
        supportEmail: venture.supportEmail,
        supportPhone: venture.supportPhone,
        primaryGateway: venture.cardWalletGateway,
        fawryEnabled: venture.fawryEnabled,
        codeActivationEnabled: venture.codeActivationEnabled,
        ctaLabel: prod.ctaLabel || venture.ctaLabel || 'Buy now',
        ctaLabelAr: prod.ctaLabelAr || venture.ctaLabelAr || 'شراء الآن',
        providerRedirectUrl: `/providers/enroll?provider=${encodeURIComponent(prod.provider)}&order=${encodeURIComponent(prod.providerCode + '-' + slug)}&product=${encodeURIComponent(prod.title)}&status=PAID`,
      };
    }
  }

  const prefix = slug.slice(0, 2).toLowerCase();
  const venture = getVentureConfig(prefix);

  return {
    slug,
    orderNumber: `${venture.code}-${slug.slice(-4).toUpperCase() || 'ORD-1001'}`,
    ventureName: venture.displayName,
    ventureCode: venture.code,
    chipBg: '#F1F5F9',
    chipFg: '#1E293B',
    description: `${venture.displayName} Tuition Enrollment`,
    descriptionAr: `رسوم الالتحاق والدراسة - ${venture.displayName}`,
    amount: 1500.0,
    currency: 'EGP',
    expiresInMinutes: 60,
    supportEmail: venture.supportEmail,
    supportPhone: venture.supportPhone,
    primaryGateway: venture.cardWalletGateway,
    fawryEnabled: venture.fawryEnabled,
    codeActivationEnabled: venture.codeActivationEnabled,
    ctaLabel: venture.ctaLabel || 'Buy now',
    ctaLabelAr: venture.ctaLabelAr || 'شراء الآن',
    providerRedirectUrl: `/providers/enroll?provider=${encodeURIComponent(venture.displayName)}&status=PAID`,
  };
}

function formatPhoneEG(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
}

function HostedPaymentContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawSlug = (params?.slug as string) || 'ac-9w3e5z';
  const productId = searchParams?.get('productId') || undefined;

  const [payment, setPayment] = useState<PaymentDetails>(() =>
    resolvePaymentFallback(rawSlug, productId)
  );

  // ─── 2-Step Flow State ────────────────────────────────────────────────────────
  // Step 1: "How would you like to continue?" (Choice: Pay Online vs Activate Code)
  // Step 2: Step 2a (Code Activation Form) OR Step 2b (Online Payment Rail & Details)
  const [step, setStep] = useState<1 | 2>(1);
  const [flowType, setFlowType] = useState<'PAY_ONLINE' | 'ACTIVATE_CODE'>('PAY_ONLINE');
  const [method, setMethod] = useState<'CARD' | 'WALLET' | 'KIOSK'>('CARD');
  const [lang, setLang] = useState<'EN' | 'AR'>('AR'); // Default to Arabic / RTL for Egyptian market

  // Student Intake State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Activation Code State (Flow a)
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [codeRedeemStatus, setCodeRedeemStatus] = useState<string | null>(null);

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [paidTxnId, setPaidTxnId] = useState('');
  const [redeemedViaCode, setRedeemedViaCode] = useState(false);

  const isRtl = lang === 'AR';

  // Server-side authoritative price and venture resolution
  useEffect(() => {
    let isMounted = true;
    const url = `/api/checkout/resolve?slug=${encodeURIComponent(rawSlug)}${productId ? `&productId=${encodeURIComponent(productId)}` : ''}`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        setPayment((prev) => ({
          ...prev,
          description: data.title || prev.description,
          descriptionAr: data.titleAr || prev.descriptionAr,
          amount: data.priceEGP !== undefined ? data.priceEGP : prev.amount,
          currency: data.currency || prev.currency,
          ventureName: data.ventureName || prev.ventureName,
          ventureCode: data.ventureCode || prev.ventureCode,
          supportEmail: data.supportEmail || prev.supportEmail,
          supportPhone: data.supportPhone || prev.supportPhone,
          primaryGateway: data.cardWalletGateway || prev.primaryGateway,
          fawryEnabled: data.fawryEnabled !== undefined ? data.fawryEnabled : prev.fawryEnabled,
          codeActivationEnabled: data.codeActivationEnabled !== undefined ? data.codeActivationEnabled : prev.codeActivationEnabled,
          ctaLabel: data.ctaLabel || prev.ctaLabel,
          ctaLabelAr: data.ctaLabelAr || prev.ctaLabelAr,
        }));
      })
      .catch((e) => {
        console.warn('[Checkout Resolve Error]', e);
      });
    return () => {
      isMounted = false;
    };
  }, [rawSlug, productId]);

  // If codeActivation is disabled for this brand, lock to PAY_ONLINE
  useEffect(() => {
    if (!payment.codeActivationEnabled && flowType === 'ACTIVATE_CODE') {
      setFlowType('PAY_ONLINE');
    }
  }, [payment.codeActivationEnabled, flowType]);

  // Step 2b: Continue to secure payment (Server-side checkout session creation)
  const handleContinueToPayment = async () => {
    setErrorMessage(null);

    if (!studentName.trim() || !studentPhone.trim()) {
      setErrorMessage(
        isRtl
          ? 'يرجى إدخال اسم الطالب ورقم الهاتف المحمول للمتابعة'
          : 'Please enter student name and mobile number to continue'
      );
      return;
    }
    if (!consentAccepted) {
      setErrorMessage(
        isRtl
          ? 'يرجى الموافقة على شروط الخدمة وسياسة الخصوصية للمتابعة'
          : 'Please accept terms and privacy policy to continue'
      );
      return;
    }

    setIsProcessing(true);

    try {
      // If customer chooses Fawry: generate reference code and navigate to /checkout/pending
      if (method === 'KIOSK') {
        const orderId = `FW-${payment.ventureCode}-${Date.now().toString().slice(-6)}`;
        const fawryCode = `982 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;
        
        router.push(
          `/checkout/pending?orderId=${encodeURIComponent(orderId)}&fawryCode=${encodeURIComponent(fawryCode)}&amount=${encodeURIComponent(payment.amount.toFixed(2))}&brand=${encodeURIComponent(payment.ventureName)}`
        );
        return;
      }

      // Card / Wallet: Call server-side API to create Order = PENDING and checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId || payment.slug,
          orderId: `ord_${payment.ventureCode.toLowerCase()}_${Date.now()}`,
          customer: {
            name: studentName.trim(),
            email: studentEmail.trim() || `${studentPhone.replace(/\D/g, '')}@student.bldrmanagement.com`,
            phone: studentPhone.trim(),
          },
          returnUrl: `/checkout/confirm?order_id=ord_${payment.ventureCode.toLowerCase()}_${Date.now()}`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment gateway session');
      }

      if (data.checkoutUrl) {
        // Redirect to hosted checkout of brand's assigned gateway (Geidea or Paymob)
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback confirmation redirect
        router.push(`/checkout/confirm?order_id=${encodeURIComponent(data.orderId || '')}`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || (isRtl ? 'تعذر الاتصال ببوابة الدفع. يرجى المحاولة لاحقاً.' : 'Payment gateway connection error. Please try again.'));
      setIsProcessing(false);
    }
  };

  // Step 2a: Redeem pre-loaded activation code with atomic race safety and zero fee
  const handleRedeemCode = async () => {
    setCodeRedeemStatus(null);
    setErrorMessage(null);

    const codeClean = activationCodeInput.trim().toUpperCase();
    if (!codeClean) {
      setCodeRedeemStatus(isRtl ? 'يرجى إدخال كود التفعيل أولاً' : 'Please enter an activation code');
      return;
    }
    if (!studentName.trim() || !studentPhone.trim()) {
      setCodeRedeemStatus(isRtl ? 'يرجى إدخال اسم الطالب ورقم الهاتف لاستكمال القيد' : 'Please enter student name and phone for registration');
      return;
    }
    if (!consentAccepted) {
      setCodeRedeemStatus(isRtl ? 'يرجى الموافقة على شروط الخدمة وسياسة الخصوصية للمتابعة' : 'Please accept terms and privacy policy to continue');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/activation-codes/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ventureId: payment.ventureCode.toLowerCase(),
          code: codeClean,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim() || `${studentPhone.replace(/\D/g, '')}@student.bldrmanagement.com`,
          studentPhone: studentPhone.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.message || (isRtl ? 'كود التفعيل غير صالح أو تم استخدامه مسبقاً' : 'Invalid or already redeemed activation code'));
      }

      setIsProcessing(false);
      setIsPaid(true);
      setRedeemedViaCode(true);
      setPaidTxnId(data.code?.id || `act_${Date.now()}`);
    } catch (err: any) {
      setIsProcessing(false);
      setCodeRedeemStatus(err?.message || (isRtl ? 'تعذر تفعيل الكود. تحقق من صحة الكود والمحاولة مجدداً.' : 'Failed to redeem activation code. Please check code and try again.'));
    }
  };

  // Active gateway name for trust cue
  const activeGatewayName =
    method === 'KIOSK'
      ? 'Fawry Pay'
      : payment.primaryGateway === 'paymob'
      ? 'Paymob Egypt (PCI-DSS)'
      : 'Geidea Egypt (PCI-DSS)';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        background: '#F1F4F9',
        fontFamily: isRtl ? "'Readex Pro', system-ui, -apple-system, sans-serif" : tokens.fonts.ui,
        padding: '24px 16px 64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* ─── Main Checkout Container ───────────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 8,
        }}
      >
        {/* Order Summary Header */}
        <div
          style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid #E2E8F0',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          }}
        >
          {/* Card Top Utility: Back button + bldr brand & Language Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.history.length > 1) {
                    window.history.back();
                  } else {
                    router.push('/products');
                  }
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#475569',
                  padding: '4px 10px',
                  borderRadius: 6,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }}>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>{isRtl ? 'رجوع' : 'Back'}</span>
              </button>

              <a
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                bldr<span style={{ color: '#D10721' }}>.</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8', marginInlineStart: 4 }}>
                  / {isRtl ? 'الدفع والتسجيل' : 'Hosted Checkout'}
                </span>
              </a>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')}
              style={{
                padding: '4px 12px',
                borderRadius: 16,
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <span>{isRtl ? 'English' : 'العربية'}</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h1
                style={{
                  fontSize: 'clamp(18px, 2.4vw, 22px)',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.35,
                }}
              >
                {isRtl ? payment.descriptionAr || payment.description : payment.description}
              </h1>
            </div>

            {/* Price Badge */}
            <div style={{ textAlign: isRtl ? 'left' : 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 2 }}>
                {isRtl ? 'إجمالي الرسوم' : 'Total Amount'}
              </div>
              <div
                style={{
                  fontSize: 'clamp(22px, 2.8vw, 26px)',
                  fontWeight: 900,
                  color: '#0F172A',
                  fontFamily: tokens.fonts.mono,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                {isRtl
                  ? `${payment.amount.toLocaleString('en-US')} ج.م`
                  : `EGP ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
            </div>
          </div>

          {/* Stepper Indicator */}
          {!isPaid && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: step === 1 ? '#0F172A' : '#059669',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {step > 1 ? '✓' : '1'}
                </span>
                <span style={{ fontSize: 12, fontWeight: step === 1 ? 800 : 600, color: step === 1 ? '#0F172A' : '#64748B' }}>
                  {isRtl ? 'طريقة المتابعة' : 'Payment Type'}
                </span>
              </div>

              <div style={{ width: 32, height: 1, background: '#CBD5E1' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: step === 2 ? '#0F172A' : '#E2E8F0',
                    color: step === 2 ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  2
                </span>
                <span style={{ fontSize: 12, fontWeight: step === 2 ? 800 : 600, color: step === 2 ? '#0F172A' : '#94A3B8' }}>
                  {flowType === 'ACTIVATE_CODE'
                    ? (isRtl ? 'إدخال الكود وبيانات الطالب' : 'Code & Student Details')
                    : (isRtl ? 'بيانات الطالب وبوابة الدفع' : 'Student & Gateway Details')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── Paid / Confirmation State ─────────────────────────────── */}
        {isPaid ? (
          <div style={{ padding: '40px 32px', textAlign: 'center', background: '#F8FCF9' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14532D', margin: '0 0 8px' }}>
              {redeemedViaCode
                ? isRtl
                  ? 'تم تفعيل الكود وقيد الطالب بنجاح!'
                  : 'Activation Code Redeemed Successfully!'
                : isRtl
                ? 'تم سداد الرسوم وتأكيد الحجز بنجاح!'
                : 'Payment Confirmed & Enrollment Secured!'}
            </h2>
            <p style={{ fontSize: 13, color: '#166534', maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.6 }}>
              {isRtl
                ? `تم تسجيل الطالب "${studentName}" بالدورة، وأرسلت تفاصيل الدخول وإيصال القيد إلى ${studentPhone}.`
                : `Student "${studentName}" is now enrolled. Confirmation and portal access credentials dispatched to ${studentPhone}.`}
            </p>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #BBF7D0',
                borderRadius: 10,
                padding: '12px 18px',
                display: 'inline-block',
                marginBottom: 24,
                fontFamily: tokens.fonts.mono,
                fontSize: 12.5,
                color: '#166534',
              }}
            >
              Reference ID: <strong>{paidTxnId}</strong>
            </div>
            <div>
              <Link
                href={productId ? `/products/${productId}?paid=true` : `/products`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 24px',
                  borderRadius: 8,
                  background: '#15803D',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                <span>{isRtl ? 'العودة لصفحة الدورات الدراسية ←' : 'Return to Course Overview →'}</span>
              </Link>
            </div>
          </div>
        ) : step === 1 ? (
          /* ─── STEP 1: How would you like to continue? ──────────────── */
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                {isRtl ? 'كيف ترغب في المتابعة؟' : 'How would you like to continue?'}
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
                {isRtl
                  ? 'اختر طريقة السداد الإلكتروني أو استخدم كود تفعيل مسبق الدفع للالتحاق الفوري.'
                  : 'Select online electronic payment or activate a prepaid voucher code.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: payment.codeActivationEnabled ? '1fr 1fr' : '1fr', gap: 14 }}>
              {/* Option A: Pay Online */}
              <div
                onClick={() => setFlowType('PAY_ONLINE')}
                style={{
                  border: flowType === 'PAY_ONLINE' ? '2px solid #0F172A' : '1px solid #E2E8F0',
                  background: flowType === 'PAY_ONLINE' ? '#F8FAFC' : '#FFFFFF',
                  borderRadius: 12,
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'all 0.15s ease',
                  boxShadow: flowType === 'PAY_ONLINE' ? '0 4px 12px rgba(15, 23, 42, 0.06)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2"/>
                      <line x1="2" x2="22" y1="10" y2="10"/>
                    </svg>
                    <strong style={{ fontSize: 15, color: '#0F172A' }}>
                      {isRtl ? 'الدفع الإلكتروني وفوري' : 'Pay Online / Fawry'}
                    </strong>
                  </div>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: flowType === 'PAY_ONLINE' ? '5px solid #0F172A' : '2px solid #CBD5E1',
                      background: '#FFFFFF',
                    }}
                  />
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  {isRtl
                    ? 'سداد فوري وآمن بالفيزا، ماستركارد، محافظ المحمول (فودافون كاش)، أو نقداً عبر فوري.'
                    : 'Instant card checkout, Egyptian mobile wallets, or cash voucher deposit via Fawry POS.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 6 }}>
                  <VisaLogo height={16} />
                  <MastercardLogo height={16} />
                  {payment.fawryEnabled && <FawryLogo height={16} />}
                </div>
              </div>

              {/* Option B: Activate a Code (Prepaid Voucher) */}
              {payment.codeActivationEnabled && (
                <div
                  onClick={() => setFlowType('ACTIVATE_CODE')}
                  style={{
                    border: flowType === 'ACTIVATE_CODE' ? '2px solid #0F172A' : '1px solid #E2E8F0',
                    background: flowType === 'ACTIVATE_CODE' ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: 12,
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    transition: 'all 0.15s ease',
                    boxShadow: flowType === 'ACTIVATE_CODE' ? '0 4px 12px rgba(15, 23, 42, 0.06)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                        <path d="M13 5v2"/>
                        <path d="M13 17v2"/>
                        <path d="M13 11v2"/>
                      </svg>
                      <strong style={{ fontSize: 15, color: '#0F172A' }}>
                        {isRtl ? 'تفعيل كود مسبق الدفع' : 'Activate a Code'}
                      </strong>
                    </div>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: flowType === 'ACTIVATE_CODE' ? '5px solid #0F172A' : '2px solid #CBD5E1',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    {isRtl
                      ? 'لطلبة السنتر أو حاملي كروت التفعيل المطبوعة. تسجيل وقيد فوري بدون أي رسوم دفع إلكتروني.'
                      : 'For center students with prepaid scratch cards. Zero fee, single-use instant enrollment.'}
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#DCFCE7', padding: '2px 8px', borderRadius: 4 }}>
                      {isRtl ? 'رسوم الدفع: 0 ج.م' : '0 EGP Gateway Fees'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 9,
                background: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                marginTop: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>{isRtl ? 'متابعة الخطوة التالية ←' : 'Continue to Next Step →'}</span>
            </button>
          </div>
        ) : flowType === 'ACTIVATE_CODE' ? (
          /* ─── STEP 2a: Code Activation Form ────────────────────────── */
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background 0.15s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }}>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>{isRtl ? 'العودة للاختيار' : 'Back to Options'}</span>
              </button>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: 4 }}>
                {isRtl ? 'تفعيل مباشر بدون رسوم' : 'Direct Zero-Fee Activation'}
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                {isRtl ? 'إدخال كود التفعيل وبيانات الطالب' : 'Enter Activation Code & Student Details'}
              </h2>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                {isRtl
                  ? 'أدخل كود الكارت المطبوع وسجل بيانات الطالب لإتمام القيد الفوري.'
                  : 'Enter the voucher serial code and student information to activate course access.'}
              </p>
            </div>

            {/* Code Input */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isRtl ? 'كود التفعيل (سريال الكارت):' : 'Prepaid Activation Serial / Code:'} *
              </label>
              <input
                type="text"
                value={activationCodeInput}
                onChange={(e) => setActivationCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. SH-2026-AC98-1024"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1.5px solid #CBD5E1',
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: tokens.fonts.mono,
                  letterSpacing: '0.06em',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Student Details Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    {isRtl ? 'اسم الطالب ثلاثي' : 'Student Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={isRtl ? 'أحمد محمد علي' : 'Ahmed Mohamed'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    {isRtl ? 'رقم المحمول (مصر)' : 'Mobile (01X XXXX XXXX)'} *
                  </label>
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(formatPhoneEG(e.target.value))}
                    placeholder="010 1234 5678"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                  {isRtl ? 'البريد الإلكتروني للطالب' : 'Student Email'}
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 7,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {codeRedeemStatus && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#991B1B', fontWeight: 600 }}>
                {codeRedeemStatus}
              </div>
            )}

            {/* Privacy & PDPL Consent */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
              <input
                type="checkbox"
                id="consent-checkbox-code"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                style={{ marginTop: 3, accentColor: '#0F172A', width: 14, height: 14 }}
              />
              <label htmlFor="consent-checkbox-code" style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                {isRtl ? (
                  <>
                    أوافق على معالجة بيانات قيد الطالب وفقاً لـ{' '}
                    <Link href="/privacy" target="_blank" style={{ color: '#0284C7', textDecoration: 'underline' }}>
                      سياسة الخصوصية
                    </Link>{' '}
                    وشروط الخدمة المعمول بها.
                  </>
                ) : (
                  <>
                    I agree to the processing of student enrollment details in accordance with the{' '}
                    <Link href="/privacy" target="_blank" style={{ color: '#0284C7', textDecoration: 'underline' }}>
                      Privacy Policy
                    </Link>{' '}
                    and Terms of Service.
                  </>
                )}
              </label>
            </div>

            <button
              type="button"
              onClick={handleRedeemCode}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 9,
                background: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 15,
                border: 'none',
                cursor: isProcessing ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
              }}
            >
              {isProcessing
                ? isRtl ? 'جاري التحقق من الكود والقيد...' : 'Validating Code & Enrolling...'
                : isRtl ? 'تفعيل الكود وقيد الطالب فوراً ←' : 'Activate Code & Enroll Directly →'}
            </button>
          </div>
        ) : (
          /* ─── STEP 2b: Online Payment Rail & Details ───────────────── */
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background 0.15s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }}>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>{isRtl ? 'العودة للاختيار' : 'Back to Options'}</span>
              </button>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', background: '#F1F5F9', padding: '3px 8px', borderRadius: 4 }}>
                {isRtl ? 'بوابة الدفع الإلكتروني' : 'Electronic Checkout'}
              </span>
            </div>

            {/* Student Details Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    {isRtl ? 'اسم الطالب بالكامل' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={isRtl ? 'أحمد محمد علي' : 'Ahmed Mohamed'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    {isRtl ? 'رقم الموبايل (واتساب)' : 'Mobile Phone (WhatsApp)'} *
                  </label>
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(formatPhoneEG(e.target.value))}
                    placeholder="012 9876 5432"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                  {isRtl ? 'البريد الإلكتروني للطالب' : 'Student Email'}
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 7,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ height: 1, background: '#EEF1F5' }} />

            {/* Payment Method Selector (Only Card, Wallet, and Fawry if enabled) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>
                {isRtl ? 'اختر طريقة السداد المعتمدة' : 'Select Payment Rail'}
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: payment.fawryEnabled ? 'repeat(3, minmax(0, 1fr))' : '1fr 1fr',
                  gap: 10,
                }}
              >
                {/* 1. Card */}
                <div
                  onClick={() => setMethod('CARD')}
                  style={{
                    border: method === 'CARD' ? '2px solid #0F172A' : '1px solid #E2E8F0',
                    background: method === 'CARD' ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: 10,
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
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
                        border: method === 'CARD' ? '4px solid #0F172A' : '1.5px solid #CBD5E1',
                        background: '#FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                      {isRtl ? 'بطاقة بنكية' : 'Bank Card'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <VisaLogo height={16} />
                    <MastercardLogo height={16} />
                  </div>
                  <span style={{ fontSize: 10, color: '#64748B' }}>Visa / Mastercard</span>
                </div>

                {/* 2. Mobile Wallet */}
                <div
                  onClick={() => setMethod('WALLET')}
                  style={{
                    border: method === 'WALLET' ? '2px solid #0F172A' : '1px solid #E2E8F0',
                    background: method === 'WALLET' ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: 10,
                    padding: '12px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
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
                        border: method === 'WALLET' ? '4px solid #0F172A' : '1.5px solid #CBD5E1',
                        background: '#FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                      {isRtl ? 'محفظة إلكترونية' : 'Mobile Wallet'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 16 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                      <path d="M12 18h.01"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 10, color: '#64748B' }}>Vodafone, Orange, WE</span>
                </div>

                {/* 3. Fawry Kiosk */}
                {payment.fawryEnabled && (
                  <div
                    onClick={() => setMethod('KIOSK')}
                    style={{
                      border: method === 'KIOSK' ? '2px solid #0F172A' : '1px solid #E2E8F0',
                      background: method === 'KIOSK' ? '#F8FAFC' : '#FFFFFF',
                      borderRadius: 10,
                      padding: '12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
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
                          border: method === 'KIOSK' ? '4px solid #0F172A' : '1.5px solid #CBD5E1',
                          background: '#FFFFFF',
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                        {isRtl ? 'فوري كاش' : 'Fawry Kiosk'}
                      </span>
                    </div>
                    <div>
                      <FawryLogo height={16} />
                    </div>
                    <span style={{ fontSize: 10, color: '#64748B' }}>
                      {isRtl ? 'نقداً عبر المنافذ' : 'Cash at retail kiosk'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#991B1B', fontWeight: 600 }}>
                {errorMessage}
              </div>
            )}

            {/* PDPL & Privacy Consent */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
              <input
                type="checkbox"
                id="consent-checkbox-online"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                style={{ marginTop: 3, accentColor: '#0F172A', width: 14, height: 14 }}
              />
              <label htmlFor="consent-checkbox-online" style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                {isRtl ? (
                  <>
                    أوافق على معالجة بيانات قيد الطالب واستلام إيصال الحجز وفقاً لـ{' '}
                    <Link href="/privacy" target="_blank" style={{ color: '#0284C7', textDecoration: 'underline' }}>
                      سياسة الخصوصية
                    </Link>{' '}
                    وشروط الخدمة.
                  </>
                ) : (
                  <>
                    I agree to the processing of student enrollment details and receiving booking confirmation in accordance with the{' '}
                    <Link href="/privacy" target="_blank" style={{ color: '#0284C7', textDecoration: 'underline' }}>
                      Privacy Policy
                    </Link>{' '}
                    and Terms of Service.
                  </>
                )}
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              type="button"
              onClick={handleContinueToPayment}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 9,
                background: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 15,
                border: 'none',
                cursor: isProcessing ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              {isProcessing
                ? isRtl ? 'جاري تجهيز جلسة الدفع الآمنة...' : 'Connecting to Gateway...'
                : isRtl
                ? `المتابعة إلى الدفع الآمن (${payment.amount.toLocaleString('en-US')} ج.م) ←`
                : `Continue to Secure Payment (EGP ${payment.amount.toLocaleString('en-US')}) →`}
            </button>

            {/* Footer Trust Seals */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 4 }}>
              <PciDssBadge />
              <SslBadge />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HostedPaymentPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F4F9' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Loading secure checkout...</div>
        </div>
      }
    >
      <HostedPaymentContent />
    </Suspense>
  );
}
