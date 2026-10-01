'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS_CATALOG } from '../../products/data';
import { getVentureConfig } from '../../../lib/ventures';
import {
  tokens,
  formatEGP,
  FawryLogo,
  VodafoneCashLogo,
  VisaLogo,
  MastercardLogo,
  GeideaLogo,
  PaymobLogo,
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
  const params = useParams();
  const searchParams = useSearchParams();
  const rawSlug = (params?.slug as string) || 'ac-9w3e5z';
  const productId = searchParams?.get('productId') || undefined;

  const [payment, setPayment] = useState<PaymentDetails>(() =>
    resolvePaymentFallback(rawSlug, productId)
  );
  const [activeTab, setActiveTab] = useState<'PAY_ONLINE' | 'ACTIVATE_CODE'>('PAY_ONLINE');
  const [method, setMethod] = useState<'CARD' | 'WALLET' | 'KIOSK'>('CARD');
  const [lang, setLang] = useState<'EN' | 'AR'>('AR'); // Default to Arabic / RTL for Egyptian market
  const [fawryCopied, setFawryCopied] = useState(false);
  const [fawryRefCode] = useState('982 411 0293');

  // Student Intake State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Activation Code State (Flow a)
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [codeRedeemStatus, setCodeRedeemStatus] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
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

  const copyFawry = () => {
    navigator.clipboard.writeText(fawryRefCode.replace(/\s+/g, ''));
    setFawryCopied(true);
    setTimeout(() => setFawryCopied(false), 2000);
  };

  const sendFawryToWhatsApp = () => {
    const rawDigits = fawryRefCode.replace(/\s+/g, '');
    const text = isRtl
      ? `كود سداد فوري لدورة "${payment.descriptionAr || payment.description}" لدى ${payment.ventureName}:\n\nكود فوري: ${rawDigits}\nالمبلغ: ${payment.amount} ج.م\nكود الخدمة: 788`
      : `Fawry Payment Code for "${payment.description}" at ${payment.ventureName}:\n\nFawry Code: ${rawDigits}\nAmount: ${payment.amount} EGP\nService Code: 788`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePay = () => {
    if (!studentName.trim() || !studentPhone.trim()) {
      alert(isRtl ? 'يرجى إدخال اسم الطالب ورقم الهاتف المحمول أولاً' : 'Please enter student name and mobile number first');
      return;
    }
    if (!consentAccepted) {
      alert(isRtl ? 'يرجى الموافقة على شروط الخدمة وسياسة الخصوصية للمتابعة' : 'Please accept terms and privacy policy to continue');
      return;
    }

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

  // Flow (a): Redeem pre-loaded activation code with zero gateway fee
  const handleRedeemCode = () => {
    if (!activationCodeInput.trim()) {
      setCodeRedeemStatus(isRtl ? 'يرجى إدخال كود التفعيل أولاً' : 'Please enter an activation code');
      return;
    }
    if (!studentName.trim() || !studentPhone.trim()) {
      setCodeRedeemStatus(isRtl ? 'يرجى إدخال اسم الطالب ورقم الهاتف لاستكمال القيد' : 'Please enter student name and phone for registration');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      setRedeemedViaCode(true);
      const txn = `act_code_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      setPaidTxnId(txn);
      try {
        localStorage.setItem(`bldr_paid_${rawSlug}`, 'true');
        if (productId) {
          localStorage.setItem(`bldr_paid_${productId}`, 'true');
        }
        // Log zero-value ledger entry
        const existingLedger = JSON.parse(localStorage.getItem('bldr_activation_redemptions') || '[]');
        existingLedger.push({
          code: activationCodeInput.trim().toUpperCase(),
          studentName,
          studentPhone,
          studentEmail,
          course: payment.description,
          ventureCode: payment.ventureCode,
          amountPiasters: 0,
          redeemedAt: new Date().toISOString(),
          txnId: txn,
        });
        localStorage.setItem('bldr_activation_redemptions', JSON.stringify(existingLedger));
      } catch (e) {}
    }, 900);
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
        background: '#E9EDF3',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.ui,
        padding: '28px 16px 64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* ─── Institutional Trust & Language Top Bar ────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4px',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: '#12203C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: '-0.02em',
            }}
          >
            b
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#12203C', letterSpacing: '-0.01em' }}>
            bldr <span style={{ fontWeight: 400, color: '#64748B' }}>/ Hosted Checkout</span>
          </span>
        </div>

        {/* Verifiable Trust Cue & Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 20,
              border: '1px solid #CBD5E1',
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#047857',
                boxShadow: '0 0 0 2px rgba(4, 120, 87, 0.2)',
              }}
            />
            <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>
              {isRtl
                ? `معالجة مدفوعات معتمدة PCI-DSS عبر ${activeGatewayName}`
                : `PCI-DSS Compliant Payment Processing via ${activeGatewayName}`}
            </span>
          </div>

          {/* Priority 1 Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === 'AR' ? 'EN' : 'AR')}
            style={{
              padding: '4px 12px',
              borderRadius: 16,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#12203C',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span>{isRtl ? '🇬🇧 English' : '🇪🇬 العربية'}</span>
          </button>
        </div>
      </div>

      {/* ─── Main Checkout Container ───────────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: 720,
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(18, 32, 60, 0.08), 0 1px 3px rgba(18, 32, 60, 0.04)',
          border: '1px solid rgba(18, 32, 60, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Header Card */}
        <div
          style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid #E8EEF5',
            background: 'linear-gradient(180deg, #FAFCFF 0%, #FFFFFF 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: payment.chipBg,
                    color: payment.chipFg,
                    textTransform: 'uppercase',
                  }}
                >
                  {payment.ventureName}
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: tokens.fonts.mono }}>
                  #{payment.orderNumber}
                </span>
              </div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#12203C',
                  margin: '0 0 6px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                }}
              >
                {isRtl ? payment.descriptionAr || payment.description : payment.description}
              </h1>
              <div style={{ fontSize: 12, color: '#64748B', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span>
                  {isRtl ? 'دعم القبول والتحصيل:' : 'Admissions Support:'}{' '}
                  <strong style={{ color: '#1E293B' }}>{payment.supportPhone}</strong>
                </span>
                <span>•</span>
                <span>{payment.supportEmail}</span>
              </div>
            </div>

            {/* Price Badge */}
            <div style={{ textAlign: isRtl ? 'left' : 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                {isRtl ? 'المبلغ المطلوب' : 'Amount Due'}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#12203C',
                  fontFamily: tokens.fonts.mono,
                  letterSpacing: '-0.02em',
                }}
              >
                {isRtl
                  ? `${payment.amount.toLocaleString('en-US')} ج.م`
                  : `EGP ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
            </div>
          </div>

          {/* Top-Level Mode Selector: Pay Online vs Activate a Code (Flow a) */}
          {payment.codeActivationEnabled && !isPaid && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginTop: 18,
                background: '#F1F5F9',
                padding: 4,
                borderRadius: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('PAY_ONLINE')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 7,
                  border: 'none',
                  background: activeTab === 'PAY_ONLINE' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'PAY_ONLINE' ? '#12203C' : '#64748B',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'PAY_ONLINE' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>💳</span>
                <span>{isRtl ? 'الدفع الإلكتروني وفوري' : 'Pay Online / Fawry'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ACTIVATE_CODE')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 7,
                  border: 'none',
                  background: activeTab === 'ACTIVATE_CODE' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'ACTIVATE_CODE' ? '#12203C' : '#64748B',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: activeTab === 'ACTIVATE_CODE' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>🎟️</span>
                <span>{isRtl ? 'تفعيل كود مسبق الدفع (سريال)' : 'Activate a Code'}</span>
              </button>
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
            <p style={{ fontSize: 13, color: '#4ADE80', maxWidth: 460, margin: '0 auto 20px', lineHeight: 1.6 }}>
              {isRtl
                ? `تم إرسال إيصال الحجز وتفاصيل الالتحاق عبر رسالة WhatsApp/SMS إلى ${studentPhone || 'رقم هاتفك'}.`
                : `A confirmation receipt and student LMS credentials have been dispatched to ${studentPhone || 'your registered mobile number'}.`}
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
              Transaction Ref: <strong>{paidTxnId}</strong>
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
                <span>{isRtl ? 'العودة لصفحة الدورة الدراسية ←' : 'Return to Course Overview →'}</span>
              </Link>
            </div>
          </div>
        ) : activeTab === 'ACTIVATE_CODE' ? (
          /* ─── FLOW (a): Activate a Pre-loaded Code ─────────────────── */
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px' }}>
              <strong style={{ fontSize: 13, color: '#0F172A', display: 'block', marginBottom: 4 }}>
                {isRtl ? 'تفعيل كود السنتر أو الكارت المطبوع' : 'Redeem Center Serial / Prepaid Voucher'}
              </strong>
              <span style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.5 }}>
                {isRtl
                  ? 'إذا كنت تمتلك كود تفعيل من السنتر التعليمي أو كارت مسبق الدفع، أدخل الكود أدناه وسيتم قيدك بالدورة فوراً وبدون أي رسوم دفع إلكتروني.'
                  : 'Enter your pre-loaded voucher serial or scratch-card code to enroll directly with no gateway transaction fees.'}
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {isRtl ? 'كود التفعيل (سريال الكارت):' : 'Prepaid Activation Serial / Code:'}
              </label>
              <input
                type="text"
                value={activationCodeInput}
                onChange={(e) => setActivationCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. AC-9812-7710"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 8,
                  border: '1.5px solid #CBD5E1',
                  fontSize: 15,
                  fontWeight: 800,
                  fontFamily: tokens.fonts.mono,
                  letterSpacing: '0.05em',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {codeRedeemStatus && (
                <div style={{ fontSize: 11.5, color: '#DC2626', marginTop: 4, fontWeight: 600 }}>
                  {codeRedeemStatus}
                </div>
              )}
            </div>

            {/* Student Details for Enrollment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                {isRtl ? 'بيانات الطالب المسجل بالكود:' : 'Student Registration Details:'}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={isRtl ? 'اسم الطالب ثلاثي' : 'Student Full Name'}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 7,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(formatPhoneEG(e.target.value))}
                  placeholder={isRtl ? 'رقم المحمول (01X XXXX XXXX)' : 'Mobile Phone (01X XXXX XXXX)'}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 7,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
              </div>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder={isRtl ? 'البريد الإلكتروني للطالب' : 'Student Email Address'}
                style={{
                  padding: '10px 12px',
                  borderRadius: 7,
                  border: '1px solid #CBD5E1',
                  fontSize: 13,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            {/* Privacy & Consent Line */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
              <input
                type="checkbox"
                id="consent-checkbox-code"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                style={{ marginTop: 3, accentColor: '#2E6F5E', width: 14, height: 14 }}
              />
              <label htmlFor="consent-checkbox-code" style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                {isRtl ? (
                  <>
                    أوافق على معالجة بيانات قيد الطالب وفقاً لـ{' '}
                    <a href="/contact" target="_blank" style={{ color: '#0066CC', textDecoration: 'underline' }}>
                      سياسة الخصوصية
                    </a>{' '}
                    وشروط الخدمة.
                  </>
                ) : (
                  <>
                    I agree to the processing of student enrollment details in accordance with the{' '}
                    <a href="/contact" target="_blank" style={{ color: '#0066CC', textDecoration: 'underline' }}>
                      Privacy Policy
                    </a>{' '}
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
                padding: '13px',
                borderRadius: 8,
                background: '#2E6F5E',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 14.5,
                border: 'none',
                cursor: isProcessing ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(46, 111, 94, 0.25)',
              }}
            >
              {isProcessing
                ? isRtl ? 'جاري التحقق من الكود...' : 'Validating Code...'
                : isRtl ? 'تفعيل الكود والتسجيل الفوري ←' : 'Redeem Code & Enroll Directly →'}
            </button>
          </div>
        ) : (
          /* ─── Online Payment Flow (Geidea / Paymob / Fawry) ────────── */
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Student Intake Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#12203C' }}>
                  {isRtl ? 'بيانات الطالب للتسجيل واستلام الإيصال' : 'Student Enrollment Information'}
                </span>
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
                  {isRtl ? '✓ تأكيد فوري عبر WhatsApp' : '✓ Instant WhatsApp voucher'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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

              {/* Privacy Policy Consent Line */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="consent-checkbox-online"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  style={{ marginTop: 3, accentColor: '#2E6F5E', width: 14, height: 14 }}
                />
                <label htmlFor="consent-checkbox-online" style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                  {isRtl ? (
                    <>
                      أوافق على معالجة بيانات قيد الطالب واستلام إشعارات الحجز وفقاً لـ{' '}
                      <a href="/contact" target="_blank" style={{ color: '#0066CC', textDecoration: 'underline' }}>
                        سياسة الخصوصية
                      </a>{' '}
                      وشروط الخدمة.
                    </>
                  ) : (
                    <>
                      I agree to the processing of student enrollment details and receiving booking updates in accordance with the{' '}
                      <a href="/contact" target="_blank" style={{ color: '#0066CC', textDecoration: 'underline' }}>
                        Privacy Policy
                      </a>{' '}
                      and Terms of Service.
                    </>
                  )}
                </label>
              </div>
            </div>

            <div style={{ height: 1, background: '#EEF1F5' }} />

            {/* Payment Method Selector (Only Card, Wallet, and Fawry) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#12203C' }}>
                {isRtl ? 'اختر طريقة السداد' : 'Choose how to pay'}
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: payment.fawryEnabled ? 'repeat(3, minmax(0, 1fr))' : '1fr 1fr',
                  gap: 10,
                }}
              >
                {/* 1. Card (Visa/Mastercard via Geidea or Paymob) */}
                <div
                  onClick={() => setMethod('CARD')}
                  style={{
                    border: method === 'CARD' ? '1.5px solid #2E6F5E' : '1px solid #E3E8EF',
                    background: method === 'CARD' ? '#F4F9F7' : '#FFFFFF',
                    borderRadius: 9,
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
                        border: method === 'CARD' ? '3px solid #2E6F5E' : '1.5px solid #C9D2DE',
                        background: '#FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#12203C' }}>
                      {isRtl ? 'بطاقة بنكية' : 'Bank Card'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <VisaLogo height={18} />
                    <MastercardLogo height={18} />
                  </div>
                  <span style={{ fontSize: 10, color: '#5A6A80' }}>Visa, Mastercard</span>
                </div>

                {/* 2. Mobile Wallet */}
                <div
                  onClick={() => setMethod('WALLET')}
                  style={{
                    border: method === 'WALLET' ? '1.5px solid #2E6F5E' : '1px solid #E3E8EF',
                    background: method === 'WALLET' ? '#F4F9F7' : '#FFFFFF',
                    borderRadius: 9,
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
                        border: method === 'WALLET' ? '3px solid #2E6F5E' : '1.5px solid #C9D2DE',
                        background: '#FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#12203C' }}>
                      {isRtl ? 'محفظة إلكترونية' : 'Mobile Wallet'}
                    </span>
                  </div>
                  <div>
                    <VodafoneCashLogo height={18} />
                  </div>
                  <span style={{ fontSize: 10, color: '#5A6A80' }}>
                    {isRtl ? 'فودافون كاش، أورنج، وي' : 'Vodafone, Orange, WE'}
                  </span>
                </div>

                {/* 3. Fawry Kiosk (Only if enabled for venture) */}
                {payment.fawryEnabled && (
                  <div
                    onClick={() => setMethod('KIOSK')}
                    style={{
                      border: method === 'KIOSK' ? '1.5px solid #2E6F5E' : '1px solid #E3E8EF',
                      background: method === 'KIOSK' ? '#F4F9F7' : '#FFFFFF',
                      borderRadius: 9,
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
                          border: method === 'KIOSK' ? '3px solid #2E6F5E' : '1.5px solid #C9D2DE',
                          background: '#FFFFFF',
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#12203C' }}>
                        {isRtl ? 'فوري كاش' : 'Fawry Kiosk'}
                      </span>
                    </div>
                    <div>
                      <FawryLogo height={20} />
                    </div>
                    <span style={{ fontSize: 10, color: '#5A6A80' }}>
                      {isRtl ? 'نقداً عبر ٣٠٠ ألف منفذ' : 'Cash at 300K+ kiosks'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Gateway View */}
            <div style={{ border: '1px solid #DDE3EC', borderRadius: 10, overflow: 'hidden' }}>
              {method === 'KIOSK' ? (
                <div>
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#FFFBEB',
                      borderBottom: '1px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#92400E' }}>
                        {isRtl ? 'بوابة فوري الرسمية (Fawry Pay)' : 'Official Fawry Pay Gateway'}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        background: '#FEF3C7',
                        color: '#B45309',
                        borderRadius: 4,
                      }}
                    >
                      {isRtl ? 'كود خدمة 788' : 'Service Code 788'}
                    </span>
                  </div>

                  <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#FFFFFF' }}>
                    <div style={{ background: '#FFFDF5', border: '2px dashed #F59E0B', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309', marginBottom: 4 }}>
                        {isRtl ? 'رقم السداد المرجعي المباشر لدى فوري:' : 'Direct Fawry Reference Code:'}
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                          letterSpacing: '0.08em',
                          color: '#1F2937',
                          fontFamily: tokens.fonts.mono,
                          margin: '6px 0',
                        }}
                      >
                        {fawryRefCode}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={copyFawry}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 12px',
                            background: fawryCopied ? '#D1FAE5' : '#FFFFFF',
                            border: '1px solid #F59E0B',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: fawryCopied ? '#065F46' : '#92400E',
                            cursor: 'pointer',
                          }}
                        >
                          {fawryCopied ? '✓ تم النسخ' : '📋 نسخ الكود'}
                        </button>

                        {/* Send Fawry code to WhatsApp Quick Win */}
                        <button
                          type="button"
                          onClick={sendFawryToWhatsApp}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 12px',
                            background: '#25D366',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                          }}
                        >
                          <span>💬</span>
                          <span>{isRtl ? 'إرسال لواتساب' : 'Send to WhatsApp'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : method === 'WALLET' ? (
                <div>
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#F0FDF4',
                      borderBottom: '1px solid #BBF7D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#166534' }}>
                        {isRtl ? 'محافظ المحمول المصرية' : 'Egyptian Mobile Wallets'}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: '#15803D', fontWeight: 600 }}>
                      via {payment.primaryGateway === 'paymob' ? 'Paymob' : 'Geidea'}
                    </span>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, background: '#FFFFFF' }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#334155' }}>
                      {isRtl ? 'أدخل رقم المحفظة لتلقي إشعار الدفع فوراً:' : 'Enter wallet number to receive instant debit prompt:'}
                    </label>
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(formatPhoneEG(e.target.value))}
                      placeholder="010 1234 5678"
                      style={{
                        padding: '10px 12px',
                        borderRadius: 7,
                        border: '1px solid #CBD5E1',
                        fontSize: 13.5,
                        color: '#0F172A',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              ) : (
                /* Card Checkout via Geidea or Paymob */
                <div>
                  <div
                    style={{
                      padding: '10px 14px',
                      background: '#F8FAFC',
                      borderBottom: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#1E293B' }}>
                        {isRtl ? 'نموذج البطاقات المعتمد (Visa / Mastercard)' : 'PCI-DSS Certified Card Gateway'}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>
                      via {payment.primaryGateway === 'paymob' ? 'Paymob Accept' : 'Geidea Payment Gateway'}
                    </span>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, background: '#FFFFFF' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                        {isRtl ? 'رقم البطاقة البنكية' : 'Card Number'}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="4000 •••• •••• 1284 (Visa / MC)"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 7,
                          border: '1px solid #CBD5E1',
                          background: '#F8FAFC',
                          fontSize: 13,
                          color: '#334155',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                          {isRtl ? 'تاريخ الانتهاء' : 'Expiry Date'}
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="08 / 28"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 7,
                            border: '1px solid #CBD5E1',
                            background: '#F8FAFC',
                            fontSize: 13,
                            color: '#334155',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                          {isRtl ? 'رمز الأمان (CVV)' : 'CVV'}
                        </label>
                        <input
                          type="password"
                          readOnly
                          value="•••"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 7,
                            border: '1px solid #CBD5E1',
                            background: '#F8FAFC',
                            fontSize: 13,
                            color: '#334155',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 9,
                background: '#2E6F5E',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 15,
                border: 'none',
                cursor: isProcessing ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(46, 111, 94, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              {isProcessing
                ? isRtl ? 'جاري معالجة السداد وتأكيد الحجز...' : 'Securing Enrollment...'
                : isRtl
                ? `تأكيد الدفع (${payment.amount.toLocaleString('en-US')} ج.م) ←`
                : `Confirm Payment (EGP ${payment.amount.toLocaleString('en-US')}) →`}
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E9EDF3' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#12203C' }}>Loading secure checkout...</div>
        </div>
      }
    >
      <HostedPaymentContent />
    </Suspense>
  );
}
