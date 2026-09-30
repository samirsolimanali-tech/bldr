'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { validateAndRedeemEnrollmentCode, getVentureCodes } from '../../../lib/enrollment-codes';

/* ─── Baseline Venture Registry ───────────────────────────────── */
const VENTURE_REGISTRY: Record<string, any> = {
  bldr: {
    code: 'bldr',
    name: 'bldr',
    displayName: 'bldr (Storefront Pilot)',
    legalName: 'bldr Technologies LLC — Venture #1 Pilot',
    primaryColor: '#D10721',
    secondaryColor: '#12203C',
    checkoutLayout: 'top-left',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    logoUrl: '',
  },
  studyhub: {
    code: 'studyhub',
    name: 'StudyHub',
    displayName: 'StudyHub Academy',
    legalName: 'Operated by Evolve bldr for Business Management',
    primaryColor: '#2E6F5E',
    secondaryColor: '#12203C',
    checkoutLayout: 'top-left',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    logoUrl: '',
  },
  apex: {
    code: 'apex',
    name: 'Apex Classes',
    displayName: 'Apex Classes',
    legalName: 'Apex Educational Services LLC',
    primaryColor: '#2C5F9E',
    secondaryColor: '#12203C',
    checkoutLayout: 'top-center',
    cardWalletGateway: 'paymob',
    fawryEnabled: false,
    codeActivationEnabled: true,
    logoUrl: '',
  },
  'el-hesa': {
    code: 'el-hesa',
    name: 'EL HESA',
    displayName: 'EL HESA Institute',
    legalName: 'Al-Hesa for Digital Media and Learning Ltd',
    primaryColor: '#B8860B',
    secondaryColor: '#1B2A4A',
    checkoutLayout: 'split-hero',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: false,
    logoUrl: '',
  },
  'career-hub': {
    code: 'career-hub',
    name: 'Career Hub',
    displayName: 'Career Hub',
    legalName: 'Career Hub Talent Accelerators Egypt',
    primaryColor: '#7A4CA0',
    secondaryColor: '#1B2A4A',
    checkoutLayout: 'top-left',
    cardWalletGateway: 'geidea',
    fawryEnabled: false,
    codeActivationEnabled: false,
    logoUrl: '',
  },
};

type PaymentMethodType = 'card' | 'wallet' | 'kiosk';
type CheckoutStep = 'choose' | 'card' | 'wallet' | 'kiosk' | 'success';

export default function CentralPaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const linkId = (params?.linkId as string) || '';

  const [uiLang, setUiLang] = useState<'en' | 'ar'>('en');
  const [step, setStep] = useState<CheckoutStep>('choose');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');

  // Session Data from Hub API
  const [sessionData, setSessionData] = useState<{
    id?: string;
    brandName?: string;
    productTitle?: string;
    orderRef?: string;
    amountDisplay?: string;
    amountPiasters?: number;
    customerEmail?: string;
    customerPhone?: string;
    customerName?: string;
    successUrl?: string;
    cancelUrl?: string;
    cardWalletGateway?: 'geidea' | 'paymob';
    fawryEnabled?: boolean;
  } | null>(null);

  // Customer & Payment Form State
  const [customerName, setCustomerName] = useState('Samir Rashed');
  const [customerEmail, setCustomerEmail] = useState('samir@bldr.dev');
  const [customerPhone, setCustomerPhone] = useState('+201001234567');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Samir Rashed');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('123');

  // Wallet fields
  const [walletCarrier, setWalletCarrier] = useState<'vodafone' | 'orange' | 'etisalat' | 'we'>('vodafone');
  const [walletPhone, setWalletPhone] = useState('01001234567');
  const [walletPushSent, setWalletPushSent] = useState(false);

  // Kiosk fields
  const [fawryCode] = useState('948 201 448');
  const [copiedCode, setCopiedCode] = useState(false);

  // Completion State
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxnId, setCompletedTxnId] = useState('');

  // Activation Code State
  const [checkoutMode, setCheckoutMode] = useState<'pay_online' | 'activate_code'>('pay_online');
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [activationError, setActivationError] = useState<string | null>(null);
  const [activationSuccess, setActivationSuccess] = useState<any | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [availableSampleCodes, setAvailableSampleCodes] = useState<any[]>([]);

  // Fetch Public Session if available
  useEffect(() => {
    if (linkId && linkId.startsWith('cs_')) {
      fetch(`http://localhost:4000/v1/checkout/sessions/${linkId}/public`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data) {
            setSessionData(data);
            if (data.customerEmail) setCustomerEmail(data.customerEmail);
            if (data.customerPhone) setCustomerPhone(data.customerPhone);
            if (data.customerName) setCustomerName(data.customerName);
          }
        })
        .catch(() => {});
    }
  }, [linkId]);

  // Brand Resolution: deduce brand slug
  const paramBrand = searchParams?.get('brand') || searchParams?.get('venture');
  const paramGateway = searchParams?.get('gateway') as 'geidea' | 'paymob' | null;
  const paramFawry = searchParams?.get('fawry');

  let resolvedBrandCode = 'bldr';
  if (paramBrand) {
    resolvedBrandCode = paramBrand.toLowerCase();
  } else if (sessionData?.brandName) {
    const bn = sessionData.brandName.toLowerCase();
    if (bn.includes('apex')) resolvedBrandCode = 'apex';
    else if (bn.includes('study') || bn.includes('sh')) resolvedBrandCode = 'studyhub';
    else if (bn.includes('hesa')) resolvedBrandCode = 'el-hesa';
    else if (bn.includes('career')) resolvedBrandCode = 'career-hub';
    else if (bn.includes('bldr')) resolvedBrandCode = 'bldr';
  } else if (linkId) {
    const l = linkId.toLowerCase();
    if (l.includes('apex') || l.includes('ac')) resolvedBrandCode = 'apex';
    else if (l.includes('study') || l.includes('sh')) resolvedBrandCode = 'studyhub';
    else if (l.includes('hesa') || l.includes('eh')) resolvedBrandCode = 'el-hesa';
    else if (l.includes('career') || l.includes('ch')) resolvedBrandCode = 'career-hub';
  }

  // Load baseline config & check localStorage for customizations
  let brandConfig = VENTURE_REGISTRY[resolvedBrandCode] || VENTURE_REGISTRY.bldr;
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`bldr_venture_config_${brandConfig.code}`);
      if (stored) {
        brandConfig = { ...brandConfig, ...JSON.parse(stored) };
      }
    }
  } catch (e) {}

  // Effective Gateway & Settings
  const effectiveGateway: 'geidea' | 'paymob' =
    paramGateway ||
    sessionData?.cardWalletGateway ||
    brandConfig.cardWalletGateway ||
    'geidea';
  const gatewayLabel = effectiveGateway === 'paymob' ? 'Paymob' : 'Geidea';

  const fawryEnabled: boolean =
    paramFawry !== null && paramFawry !== undefined
      ? paramFawry === '1'
      : sessionData?.fawryEnabled !== undefined
      ? sessionData.fawryEnabled
      : brandConfig.fawryEnabled !== false;

  const codeActivationEnabled: boolean =
    searchParams?.get('code_activation') !== null
      ? searchParams.get('code_activation') === '1'
      : brandConfig.codeActivationEnabled !== false;

  // Load sample codes for convenience in dev/testing
  useEffect(() => {
    try {
      const list = getVentureCodes(resolvedBrandCode);
      setAvailableSampleCodes(list.filter(c => c.status === 'UNUSED').slice(0, 3));
    } catch (e) {}
  }, [resolvedBrandCode]);

  const activeBrandName = brandConfig.displayName || brandConfig.name;
  const activeLegalName = brandConfig.legalName;
  const brandPrimaryColor = brandConfig.primaryColor || '#D10721';
  const brandSecondaryColor = brandConfig.secondaryColor || '#12203C';
  const brandLogoUrl = brandConfig.logoUrl || '';
  const checkoutLayout: 'top-left' | 'top-center' | 'split-hero' = brandConfig.checkoutLayout || 'top-left';

  const activeProduct = sessionData?.productTitle || 'bldr Founder Edition — Lifetime Access';
  const activeOrderRef = sessionData?.orderRef || (linkId.startsWith('cs_') ? `Order ${linkId.slice(-8).toUpperCase()}` : 'Order bldr_pilot_2026');
  const activeAmount = sessionData?.amountDisplay || 'EGP 1,500.00';
  const activeAmountNum = sessionData?.amountPiasters ? sessionData.amountPiasters / 100 : 1500;

  const isRtl = uiLang === 'ar';

  // Copy code helper
  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fawryCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Handle Code Redemption Submission
  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCodeInput.trim()) {
      setActivationError(isRtl ? 'يرجى إدخال كود التفعيل أو الرقم التسلسلي.' : 'Please enter your activation code or serial.');
      return;
    }
    setActivationError('');
    setIsRedeeming(true);

    setTimeout(() => {
      const res = validateAndRedeemEnrollmentCode(
        resolvedBrandCode,
        activationCodeInput,
        {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          orderRef: activeOrderRef,
          productTitle: activeProduct,
          ventureName: activeBrandName,
        }
      );

      setIsRedeeming(false);

      if (!res.success) {
        setActivationError(res.message);
      } else {
        setActivationSuccess(res);
        setCompletedTxnId(res.transaction?.id || `TXN_CODE_${Date.now()}`);
        setStep('success');
      }
    }, 500);
  };

  // Process and finalize payment
  const completePayment = async (methodUsed: PaymentMethodType) => {
    setIsProcessing(true);
    const txnId = `txn_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`.toUpperCase();

    // 1. Notify Backend API if real session
    try {
      if (linkId.startsWith('cs_')) {
        await fetch(`http://localhost:4000/v1/checkout/sessions/${linkId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethod: methodUsed }),
        });
      }
    } catch (err) {
      console.warn('[Session Complete Notice]', err);
    }

    // 2. Record Transaction in Central Hub ledger (localStorage)
    try {
      const methodLabel =
        methodUsed === 'card'
          ? `Card (Visa •••• ${cardNumber.slice(-4)})`
          : methodUsed === 'wallet'
          ? `Mobile Wallet (${walletCarrier.toUpperCase()})`
          : 'Fawry Pay (Kiosk Cash)';

      const gatewayUsedLabel = methodUsed === 'kiosk' ? 'Fawry Pay' : `${gatewayLabel} (Hosted)`;

      const newTxn = {
        id: txnId,
        venture: activeBrandName,
        student: customerName || customerEmail.split('@')[0],
        email: customerEmail,
        product: activeProduct,
        amount: activeAmountNum,
        method: methodLabel,
        gateway: gatewayUsedLabel,
        status: 'Completed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        ref: activeOrderRef,
      };

      const existing = JSON.parse(localStorage.getItem('bldr_hub_transactions') || '[]');
      localStorage.setItem('bldr_hub_transactions', JSON.stringify([newTxn, ...existing]));

      // Also mark product as paid in storefront
      localStorage.setItem('bldr_paid_bldr-founder-edition', 'true');
      localStorage.setItem('bldr_paid_bldr-os-platform-starter', 'true');
    } catch (e) {}

    setTimeout(() => {
      setIsProcessing(false);
      setCompletedTxnId(txnId);
      setStep('success');
    }, 1200);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        background: '#F4F6F9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px 48px',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Mock Browser Outer Shell */}
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          background: '#FFFFFF',
          border: '1px solid #D8E0EB',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 20px 50px -12px rgba(18, 32, 60, 0.18)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Browser Address Bar */}
        <div
          style={{
            height: 40,
            background: '#EAEFF5',
            borderBottom: '1px solid #D8E0EB',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#EF4444' }}></span>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#F59E0B' }}></span>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10B981' }}></span>
          </div>
          <div
            style={{
              flex: 1,
              height: 26,
              background: '#FFFFFF',
              borderRadius: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 12px',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4.8 7.2V5.4a3.2 3.2 0 016.4 0v1.8M4 7.2h8v5.6H4z" />
            </svg>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#5A6A80' }}>
              https://pay.bldr.com/checkout/{linkId || 'bldr-pilot'}
            </span>
          </div>
        </div>

        {/* ─── Templated Layout Variant 1: Top-Center (Classic Academic) ─── */}
        {checkoutLayout === 'top-center' && (
          <div
            style={{
              padding: '20px 24px 18px',
              background: '#FFFFFF',
              borderBottom: '1px solid #E8EEF5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              gap: 12,
            }}
          >
            {/* Top Bar row: Hub trust on left, language on right */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: '#12203C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    fontSize: 11,
                  }}
                >
                  b.
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                  bldr Secure Hosted Gateway
                </span>
              </div>

              {/* Language Switcher */}
              <div style={{ display: 'flex', padding: 2.5, background: '#EEF1F5', borderRadius: 6, gap: 2 }}>
                <button
                  type="button"
                  onClick={() => setUiLang('en')}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: uiLang === 'en' ? '#fff' : 'transparent',
                    color: uiLang === 'en' ? '#12203C' : '#8A94A6',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setUiLang('ar')}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: uiLang === 'ar' ? '#fff' : 'transparent',
                    color: uiLang === 'ar' ? '#12203C' : '#8A94A6',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Centered Brand Emblem & Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 4 }}>
              {brandLogoUrl ? (
                <img
                  src={brandLogoUrl}
                  alt={activeBrandName}
                  style={{ height: 46, maxWidth: 140, objectFit: 'contain' }}
                />
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: brandPrimaryColor,
                    color: '#FFFFFF',
                    fontSize: 19,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  {activeBrandName.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#12203C', letterSpacing: '-0.02em', textAlign: 'center' }}>
                  {activeBrandName}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '10.5px', fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', padding: '2px 9px', borderRadius: 999 }}>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 8.5 6.5 12 13 4" />
                  </svg>
                  Verified Venture Academy
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Templated Layout Variant 2: Split-Hero (High-Impact Hero Banner) ─── */}
        {checkoutLayout === 'split-hero' && (
          <div
            style={{
              background: `linear-gradient(135deg, ${brandPrimaryColor} 0%, ${brandSecondaryColor || '#12203C'} 100%)`,
              color: '#FFFFFF',
              borderBottom: '3px solid rgba(255,255,255,0.18)',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {brandLogoUrl ? (
                <img
                  src={brandLogoUrl}
                  alt={activeBrandName}
                  style={{ height: 38, maxWidth: 110, objectFit: 'contain', background: 'rgba(255,255,255,0.96)', padding: 4, borderRadius: 8 }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.22)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeBrandName.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  {activeBrandName}
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
                  Verified Checkout · Protected by bldr
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', padding: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 7, gap: 2 }}>
                <button
                  type="button"
                  onClick={() => setUiLang('en')}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 9px',
                    borderRadius: 5,
                    background: uiLang === 'en' ? '#FFFFFF' : 'transparent',
                    color: uiLang === 'en' ? '#12203C' : '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setUiLang('ar')}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 9px',
                    borderRadius: 5,
                    background: uiLang === 'ar' ? '#FFFFFF' : 'transparent',
                    color: uiLang === 'ar' ? '#12203C' : '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Templated Layout Variant 3: Top-Left (Standard Modern Minimal - Default) ─── */}
        {checkoutLayout === 'top-left' && (
          <div
            style={{
              padding: '16px 24px',
              background: '#FFFFFF',
              borderBottom: '1px solid #E8EEF5',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {/* bldr Payment Hub Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#12203C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  fontSize: 14,
                  letterSpacing: '-0.03em',
                }}
              >
                b.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#12203C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  bldr
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#8A94A6', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Payment Hub
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 26, background: '#E3E8EF' }}></div>

            {/* Brand Logo & Brand Display Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {brandLogoUrl ? (
                <img
                  src={brandLogoUrl}
                  alt={activeBrandName}
                  style={{ height: 28, maxWidth: 36, objectFit: 'contain' }}
                />
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: brandPrimaryColor,
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeBrandName.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: '#12203C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {activeBrandName}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#2E6F5E' }}>
                  Verified Venture Store
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }}></div>

            {/* Language Switcher */}
            <div style={{ display: 'flex', padding: 3, background: '#EEF1F5', borderRadius: 7, gap: 2 }}>
              <button
                type="button"
                onClick={() => setUiLang('en')}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 5,
                  background: uiLang === 'en' ? '#fff' : 'transparent',
                  color: uiLang === 'en' ? '#12203C' : '#8A94A6',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setUiLang('ar')}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 5,
                  background: uiLang === 'ar' ? '#fff' : 'transparent',
                  color: uiLang === 'ar' ? '#12203C' : '#8A94A6',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                العربية
              </button>
            </div>
          </div>
        )}

        {/* ─── Gateway Trust Banner ─── */}
        <div
          style={{
            background: '#F0F6F4',
            borderBottom: '1px solid #DCE9E4',
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 700, color: '#2E6F5E' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="2" strokeLinecap="round">
              <path d="M4.8 7.2V5.4a3.2 3.2 0 016.4 0v1.8M4 7.2h8v5.6H4z" />
            </svg>
            <span>PCI-DSS Level 1 Encrypted · Hub Gateway Routing</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#2C5F9E',
                background: '#E6EFFB',
                borderRadius: 4,
                padding: '2px 8px',
                letterSpacing: '0.02em',
              }}
            >
              Powered by {gatewayLabel}
            </span>
            {fawryEnabled && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#C05621',
                  background: '#FEEBC8',
                  borderRadius: 4,
                  padding: '2px 8px',
                }}
              >
                Fawry Kiosk Rail Active
              </span>
            )}
          </div>
        </div>

        {/* ─── Body: 1st Checkout Page OR Directed Method Page OR Success ─── */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ═══════════════════════════════════════════════════════════
              STEP 1: 1st CHECKOUT PAGE (Choose Method & Review Order)
             ═══════════════════════════════════════════════════════════ */}
          {step === 'choose' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Product Info & Amount Due Strip */}
              <div
                style={{
                  background: '#FAFBFD',
                  border: '1px solid #E8EEF5',
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A94A6' }}>
                    {isRtl ? 'طلب الشراء المعتمد' : 'OFFICIAL PAYMENT REQUEST'}
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#12203C', letterSpacing: '-0.02em' }}>
                    {activeProduct}
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#5A6A80' }}>
                    {activeOrderRef} · {activeLegalName}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                    {isRtl ? 'المبلغ المستحق' : 'Amount Due'}
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 26, fontWeight: 800, color: '#12203C', lineHeight: 1 }}>
                    {activeAmount}
                  </span>
                </div>
              </div>

              {/* Top-Level Checkout Mode Selector (Gated by codeActivationEnabled) */}
              {codeActivationEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: '#12203C' }}>
                    {isRtl ? 'اختر كيفية الانضمام:' : 'Choose how you want to enroll:'}
                  </span>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                      background: '#F1F5F9',
                      padding: 4,
                      borderRadius: 10,
                    }}
                  >
                    <button
                      type="button"
                      id="tab-pay-online"
                      onClick={() => {
                        setCheckoutMode('pay_online');
                        setActivationError(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '11px 12px',
                        borderRadius: 8,
                        background: checkoutMode === 'pay_online' ? '#FFFFFF' : 'transparent',
                        border: checkoutMode === 'pay_online' ? '1px solid #CBD5E1' : '1px solid transparent',
                        boxShadow: checkoutMode === 'pay_online' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
                        fontWeight: checkoutMode === 'pay_online' ? 800 : 600,
                        fontSize: 13,
                        color: checkoutMode === 'pay_online' ? '#0F172A' : '#64748B',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: 15 }}>💳</span>
                      <span>{isRtl ? 'دفع إلكتروني' : 'Pay Online'}</span>
                    </button>

                    <button
                      type="button"
                      id="tab-activate-code"
                      onClick={() => {
                        setCheckoutMode('activate_code');
                        setActivationError(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '11px 12px',
                        borderRadius: 8,
                        background: checkoutMode === 'activate_code' ? '#FFFFFF' : 'transparent',
                        border: checkoutMode === 'activate_code' ? `1px solid ${brandPrimaryColor}` : '1px solid transparent',
                        boxShadow: checkoutMode === 'activate_code' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
                        fontWeight: checkoutMode === 'activate_code' ? 800 : 600,
                        fontSize: 13,
                        color: checkoutMode === 'activate_code' ? brandPrimaryColor : '#64748B',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: 15 }}>🎟️</span>
                      <span>{isRtl ? 'تفعيل كود' : 'Activate a Code'}</span>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          background: '#DCFCE7',
                          color: '#166534',
                          padding: '1px 5px',
                          borderRadius: 4,
                        }}
                      >
                        {isRtl ? 'مطبوع' : 'Offline'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                  SUB-FLOW 1: ACTIVATE A CODE (OFFLINE / PHYSICAL SERIAL)
                 ═══════════════════════════════════════════════════════════ */}
              {checkoutMode === 'activate_code' ? (
                <form onSubmit={handleRedeemCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Context notice */}
                  <div
                    style={{
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: 10,
                      padding: '12px 14px',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      🎟️
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
                        {isRtl ? 'هل اشتريت الكود من مركز تعليمي أو مكتبة؟' : 'Bought your seat at a center, tutor, or store?'}
                      </span>
                      <span style={{ fontSize: 11.5, color: '#15803D', lineHeight: 1.45 }}>
                        {isRtl
                          ? 'أدخل الكود أو الرقم التسلسلي المطبوع على بطاقتك لتفعيل وصولك الفوري للمقرر الدراسي دون الحاجة لأي دفع إلكتروني.'
                          : 'Enter your physical redemption code or voucher serial below to unlock immediate course access with zero online fees.'}
                      </span>
                    </div>
                  </div>

                  {/* Code Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label
                      htmlFor="enrollment-code-input"
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#12203C',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{isRtl ? 'كود التفعيل / السريال' : 'Activation Code / Serial Number'}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                        {isRtl ? 'مخصص لـ' : 'Scoped to'}: {activeBrandName}
                      </span>
                    </label>

                    <div style={{ position: 'relative' }}>
                      <input
                        id="enrollment-code-input"
                        type="text"
                        value={activationCodeInput}
                        onChange={e => {
                          setActivationCodeInput(e.target.value.toUpperCase());
                          if (activationError) setActivationError(null);
                        }}
                        placeholder={resolvedBrandCode === 'studyhub' ? 'e.g. SH-2026-F982' : resolvedBrandCode === 'apex' ? 'e.g. APEX-2026-CFA1' : 'e.g. BLDR-8819-K1'}
                        style={{
                          width: '100%',
                          height: 46,
                          border: activationError ? '2px solid #EF4444' : `2px solid ${brandPrimaryColor}`,
                          borderRadius: 9,
                          padding: '0 14px',
                          fontSize: 15,
                          fontFamily: 'IBM Plex Mono, monospace',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#0F172A',
                          background: '#FFFFFF',
                          outline: 'none',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                      />
                      {activationCodeInput && (
                        <button
                          type="button"
                          onClick={() => setActivationCodeInput('')}
                          style={{
                            position: 'absolute',
                            right: isRtl ? undefined : 12,
                            left: isRtl ? 12 : undefined,
                            top: 13,
                            background: '#E2E8F0',
                            border: 'none',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            fontSize: 11,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B',
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Quick test sample pills */}
                    {availableSampleCodes.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                          {isRtl ? 'رموز تجريبية متاحة:' : 'Sample test codes:'}
                        </span>
                        {availableSampleCodes.slice(0, 3).map(sample => (
                          <button
                            key={sample}
                            type="button"
                            onClick={() => {
                              setActivationCodeInput(sample);
                              setActivationError(null);
                            }}
                            style={{
                              background: '#F1F5F9',
                              border: '1px dashed #CBD5E1',
                              borderRadius: 4,
                              padding: '2px 8px',
                              fontSize: 11,
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontWeight: 700,
                              color: '#334155',
                              cursor: 'pointer',
                            }}
                          >
                            {sample}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Student Details for Enrollment Record */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        {isRtl ? 'اسم الطالب' : 'Student Full Name'}
                      </span>
                      <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="e.g. Omar Khaled"
                        style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontSize: 12.5, outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        {isRtl ? 'البريد الإلكتروني للوصول' : 'Student Email (for LMS access)'}
                      </span>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="student@example.com"
                        style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontSize: 12.5, outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Error banner */}
                  {activationError && (
                    <div
                      id="activation-error-alert"
                      style={{
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: 8,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#991B1B',
                        fontSize: 12,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>⚠️</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{activationError}</span>
                    </div>
                  )}

                  {/* Submit Activation Button */}
                  <button
                    type="submit"
                    id="btn-redeem-code"
                    disabled={isRedeeming}
                    style={{
                      height: 48,
                      borderRadius: 9,
                      background: brandPrimaryColor,
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 14.5,
                      fontWeight: 800,
                      cursor: isRedeeming ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: `0 4px 14px ${brandPrimaryColor}40`,
                      transition: 'opacity 0.15s ease',
                      marginTop: 4,
                    }}
                  >
                    {isRedeeming ? (
                      <span>{isRtl ? 'جاري التحقق من الكود...' : 'Verifying and Activating...'}</span>
                    ) : (
                      <>
                        <span>{isRtl ? 'تأكيد وتفعيل المقرر الدراسي الآن' : 'Verify & Activate Enrollment'}</span>
                        <span>→</span>
                      </>
                    )}
                  </button>

                  {/* Switch back link */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setCheckoutMode('pay_online')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        fontSize: 12,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      {isRtl ? 'أو الدفع إلكترونياً بالبطاقة / المحفظة' : 'Or pay online via Card, Wallet, or Fawry instead'}
                    </button>
                  </div>
                </form>
              ) : (
                /* ═══════════════════════════════════════════════════════════
                    SUB-FLOW 2: PAY ONLINE (EXISTING GATEWAY FLOW - UNCHANGED)
                   ═══════════════════════════════════════════════════════════ */
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#12203C' }}>
                      {isRtl ? 'اختر طريقة الدفع للمتابعة إلى صفحة الدفع المخصصة:' : 'Choose how to pay to proceed to the payment page:'}
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* Option 1: Card */}
                      <div
                        onClick={() => setSelectedMethod('card')}
                        style={{
                          border: selectedMethod === 'card' ? `2px solid ${brandPrimaryColor}` : '1px solid #E3E8EF',
                          background: selectedMethod === 'card' ? '#FAFCFB' : '#FFFFFF',
                          borderRadius: 10,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: selectedMethod === 'card' ? `5px solid ${brandPrimaryColor}` : '2px solid #C9D2DE',
                            background: '#FFFFFF',
                            flex: 'none',
                          }}
                        />
                        <div style={{ width: 34, height: 24, borderRadius: 4, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#334155' }}>
                          CARD
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#12203C' }}>
                              {isRtl ? 'بطاقة بنكية (فيزا، ماستركارد، ميزة)' : 'Credit / Debit Card (Visa, Mastercard, Meeza)'}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#2C5F9E', background: '#E8EEF7', borderRadius: 4, padding: '1px 6px' }}>
                              via {gatewayLabel}
                            </span>
                          </div>
                          <span style={{ fontSize: 11.5, color: '#5A6A80' }}>
                            {isRtl
                              ? `دفع فوري آمن ومباشر مدعوم ببروتوكول 3D-Secure عبر بوابة ${gatewayLabel}`
                              : `Directs to 3D-Secure card checkout powered by ${gatewayLabel}`}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: brandPrimaryColor }}>
                          Select →
                        </span>
                      </div>

                      {/* Option 2: Mobile Wallet */}
                      <div
                        onClick={() => setSelectedMethod('wallet')}
                        style={{
                          border: selectedMethod === 'wallet' ? `2px solid ${brandPrimaryColor}` : '1px solid #E3E8EF',
                          background: selectedMethod === 'wallet' ? '#FAFCFB' : '#FFFFFF',
                          borderRadius: 10,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: selectedMethod === 'wallet' ? `5px solid ${brandPrimaryColor}` : '2px solid #C9D2DE',
                            background: '#FFFFFF',
                            flex: 'none',
                          }}
                        />
                        <div style={{ width: 44, height: 24, borderRadius: 4, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#334155' }}>
                          WALLET
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#12203C' }}>
                              {isRtl ? 'محفظة إلكترونية (فودافون كاش، أورنج، اتصالات، وي)' : 'Mobile Wallet (Vodafone, Orange, Etisalat, WE)'}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#2C5F9E', background: '#E8EEF7', borderRadius: 4, padding: '1px 6px' }}>
                              via {gatewayLabel}
                            </span>
                          </div>
                          <span style={{ fontSize: 11.5, color: '#5A6A80' }}>
                            {isRtl
                              ? `الانتقال لصفحة تأكيد دفع المحفظة وإرسال إشعار الخصم على هاتفك`
                              : `Directs to mobile wallet payment page to enter phone and confirm`}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: brandPrimaryColor }}>
                          Select →
                        </span>
                      </div>

                      {/* Option 3: Fawry Cash Reference Code (if enabled for this brand) */}
                      {fawryEnabled && (
                        <div
                          onClick={() => setSelectedMethod('kiosk')}
                          style={{
                            border: selectedMethod === 'kiosk' ? '2px solid #FF6B00' : '1px solid #E3E8EF',
                            background: selectedMethod === 'kiosk' ? '#FFF9F5' : '#FFFFFF',
                            borderRadius: 10,
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: selectedMethod === 'kiosk' ? '5px solid #FF6B00' : '2px solid #C9D2DE',
                              background: '#FFFFFF',
                              flex: 'none',
                            }}
                          />
                          <div style={{ width: 44, height: 24, borderRadius: 4, background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#C2410C' }}>
                            FAWRY
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 800, color: '#12203C' }}>
                                {isRtl ? 'كود دفع فوري كاش (سداد نقدي في المنافذ)' : 'Fawry Reference Code (Pay Cash at Kiosk)'}
                              </span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#FF6B00', background: '#FFF0E6', borderRadius: 4, padding: '1px 6px' }}>
                                via Fawry Pay
                              </span>
                            </div>
                            <span style={{ fontSize: 11.5, color: '#5A6A80' }}>
                              {isRtl
                                ? 'إصدار رقم مرجعي فوري صالح لمدة ٤٨ ساعة للسداد في أي كشك أو تاجر'
                                : 'Generates a Fawry kiosk reference code valid for 48 hours'}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B00' }}>
                            Select →
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Contact Information */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        {isRtl ? 'البريد الإلكتروني للإيصال' : 'Email Address (for receipt)'}
                      </span>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontSize: 12.5, outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        {isRtl ? 'رقم الهاتف المحمول' : 'Mobile Phone Number'}
                      </span>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        style={{ height: 38, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontSize: 12.5, outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Step 1 Submit: Direct to chosen method checkout page */}
                  <button
                    type="button"
                    onClick={() => setStep(selectedMethod)}
                    style={{
                      height: 48,
                      borderRadius: 9,
                      background: brandPrimaryColor,
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 14.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: `0 4px 14px ${brandPrimaryColor}40`,
                      transition: 'opacity 0.15s ease',
                      marginTop: 6,
                    }}
                  >
                    <span>
                      {isRtl
                        ? `المتابعة إلى صفحة ${selectedMethod === 'card' ? 'الدفع بالبطاقة' : selectedMethod === 'wallet' ? 'دفع المحفظة' : 'كود فوري'} ←`
                        : `Continue to ${selectedMethod === 'card' ? 'Card Checkout' : selectedMethod === 'wallet' ? 'Wallet Payment' : 'Fawry Code Page'} →`}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 2A: DIRECTED CARD CHECKOUT PAGE
             ═══════════════════════════════════════════════════════════ */}
          {step === 'card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Back button & Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  style={{ background: 'none', border: 'none', color: '#2E6F5E', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  ← {isRtl ? 'الرجوع لاختيار طريقة الدفع' : 'Change payment method'}
                </button>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2C5F9E', background: '#E8EEF7', borderRadius: 4, padding: '2px 8px' }}>
                  {gatewayLabel} Hosted Card Rail
                </span>
              </div>

              <div style={{ background: '#FAFBFD', border: '1px solid #E3E8EF', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>{activeProduct}</div>
                  <div style={{ fontSize: 11, color: '#8A94A6' }}>{activeOrderRef}</div>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 20, fontWeight: 800, color: '#12203C' }}>
                  {activeAmount}
                </div>
              </div>

              {/* Card Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                    {isRtl ? 'الاسم المدون على البطاقة' : 'Cardholder Full Name'}
                  </span>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    style={{ height: 40, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                      {isRtl ? 'رقم البطاقة (فيزا / ماستركارد / ميزة)' : 'Card Number (Visa, Mastercard, Meeza)'}
                    </span>
                    <span style={{ fontSize: 10, color: '#2E6F5E', fontWeight: 700 }}>Meeza & International</span>
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    style={{ height: 40, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                      {isRtl ? 'تاريخ الانتهاء' : 'Expiry (MM/YY)'}
                    </span>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      style={{ height: 40, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                      {isRtl ? 'رمز الأمان CVV' : 'CVC / CVV'}
                    </span>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      style={{ height: 40, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Authorize Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => completePayment('card')}
                style={{
                  height: 48,
                  borderRadius: 9,
                  background: isProcessing ? '#8A94A6' : brandPrimaryColor,
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 14.5,
                  fontWeight: 800,
                  cursor: isProcessing ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: `0 4px 14px ${brandPrimaryColor}40`,
                }}
              >
                {isProcessing ? (
                  <span>Processing 3-D Secure Verification via {gatewayLabel}...</span>
                ) : (
                  <span>Authorize &amp; Pay {activeAmount} via {gatewayLabel}</span>
                )}
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 2B: DIRECTED MOBILE WALLET PAGE
             ═══════════════════════════════════════════════════════════ */}
          {step === 'wallet' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Back button & Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  style={{ background: 'none', border: 'none', color: '#2E6F5E', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  ← {isRtl ? 'الرجوع لاختيار طريقة الدفع' : 'Change payment method'}
                </button>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2C5F9E', background: '#E8EEF7', borderRadius: 4, padding: '2px 8px' }}>
                  {gatewayLabel} Mobile Wallet Rail
                </span>
              </div>

              <div style={{ background: '#FAFBFD', border: '1px solid #E3E8EF', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>{activeProduct}</div>
                  <div style={{ fontSize: 11, color: '#8A94A6' }}>{activeOrderRef}</div>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 20, fontWeight: 800, color: '#12203C' }}>
                  {activeAmount}
                </div>
              </div>

              {/* Wallet Network Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                  {isRtl ? 'اختر شبكة المحفظة الإلكترونية' : 'Select Egyptian Wallet Carrier'}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { id: 'vodafone', label: 'Vodafone', color: '#E60000' },
                    { id: 'orange', label: 'Orange', color: '#FF6600' },
                    { id: 'etisalat', label: 'Etisalat', color: '#7FB320' },
                    { id: 'we', label: 'WE Pay', color: '#5C2D91' },
                  ].map(w => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWalletCarrier(w.id as any)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: 8,
                        border: walletCarrier === w.id ? `2px solid ${w.color}` : '1px solid #E3E8EF',
                        background: walletCarrier === w.id ? '#FAFBFD' : '#FFFFFF',
                        color: walletCarrier === w.id ? w.color : '#5A6A80',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone number */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                  {isRtl ? 'رقم هاتف المحفظة (٠١٠ / ٠١١ / ٠١٢ / ٠١٥)' : 'Wallet Mobile Number (010 / 011 / 012 / 015)'}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ height: 40, border: '1px solid #E3E8EF', borderRadius: 8, background: '#F5F7FA', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13, fontWeight: 700, color: '#5A6A80' }}>
                    +20
                  </span>
                  <input
                    type="tel"
                    value={walletPhone}
                    onChange={e => setWalletPhone(e.target.value)}
                    style={{ flex: 1, height: 40, border: '1px solid #E3E8EF', borderRadius: 8, padding: '0 12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Push Instructions & Action */}
              {walletPushSent ? (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#15803D', fontWeight: 800, fontSize: 13 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: 4 }}>PUSH</span>
                    <span>Push request sent to +20 {walletPhone}!</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#166534', lineHeight: 1.5 }}>
                    Please check your phone for the notification from {walletCarrier.toUpperCase()} Cash and enter your PIN to approve the transaction of {activeAmount}.
                  </p>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => completePayment('wallet')}
                    style={{
                      height: 44,
                      borderRadius: 8,
                      background: '#15803D',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: isProcessing ? 'wait' : 'pointer',
                      marginTop: 4,
                    }}
                  >
                    {isProcessing ? 'Confirming with Carrier...' : 'Simulate Wallet PIN Authorization (Demo) →'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setWalletPushSent(true)}
                  style={{
                    height: 48,
                    borderRadius: 9,
                    background: brandPrimaryColor,
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 14.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px ${brandPrimaryColor}40`,
                  }}
                >
                  Send Payment Request to Wallet ({activeAmount})
                </button>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 2C: DIRECTED FAWRY REFERENCE CODE PAGE
             ═══════════════════════════════════════════════════════════ */}
          {step === 'kiosk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Back button & Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  style={{ background: 'none', border: 'none', color: '#2E6F5E', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  ← {isRtl ? 'الرجوع لاختيار طريقة الدفع' : 'Change payment method'}
                </button>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#C05621', background: '#FEEBC8', borderRadius: 4, padding: '2px 8px' }}>
                  Fawry Pay Kiosk Rail
                </span>
              </div>

              {/* Reference Code Card */}
              <div
                style={{
                  background: '#FFF9F5',
                  border: '1.5px solid #FFD8BE',
                  borderRadius: 12,
                  padding: '22px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#C05621' }}>
                  {isRtl ? 'رقم الدفع المرجعي لدى فوري' : 'Fawry Cash Payment Reference'}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 32, fontWeight: 800, color: '#FF6B00', letterSpacing: '0.04em' }}>
                  {fawryCode}
                </span>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 6,
                      background: '#FFFFFF',
                      border: '1px solid #FFD8BE',
                      color: '#FF6B00',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedCode ? '✓ Copied' : 'Copy Code'}
                  </button>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#C05621', background: '#FEEBC8', padding: '3px 8px', borderRadius: 4 }}>
                    Valid for 48 Hours
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div style={{ background: '#FAFBFD', border: '1px solid #E3E8EF', borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#12203C' }}>
                  {isRtl ? 'خطوات السداد عبر منافذ فوري:' : 'How to pay with Fawry:'}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#5A6A80' }}>
                  <div>1. {isRtl ? 'توجه لأي منفذ فوري أو نقطة بيع معتمدة.' : 'Visit any Fawry kiosk, store merchant, or POS retail terminal.'}</div>
                  <div>2. {isRtl ? 'اطلب خدمة "مدفوعات فوري باي" كود ٧٨٨.' : 'Ask merchant for "Fawry Pay" service code 788.'}</div>
                  <div>3. {isRtl ? `قدم الرقم المرجعي ${fawryCode} وسدد ${activeAmount}.` : `Provide reference code ${fawryCode} and pay ${activeAmount} in cash.`}</div>
                  <div>4. {isRtl ? 'احتفظ بإيصال السداد؛ سيتم تفعيل حسابك فورياً.' : 'Collect your paper receipt; access unlocks automatically upon payment.'}</div>
                </div>
              </div>

              {/* Simulate Kiosk Paid Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => completePayment('kiosk')}
                style={{
                  height: 48,
                  borderRadius: 9,
                  background: '#FF6B00',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: isProcessing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
                }}
              >
                {isProcessing ? 'Simulating Kiosk Cash Deposit...' : 'Simulate Kiosk Payment (Demo Cash Paid) →'}
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 3: SUCCESS / TRACKING CONFIRMATION
             ═══════════════════════════════════════════════════════════ */}
          {step === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '16px 0' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="#15803D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5l3 3 6-6" />
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#12203C' }}>
                  {activationSuccess
                    ? (isRtl ? 'تم تفعيل كود المقعد الدراسي بنجاح!' : 'Enrollment Activated & Verified!')
                    : (isRtl ? 'تم تأكيد وإتمام عملية الدفع بنجاح!' : 'Payment Completed & Verified!')}
                </span>
                <span style={{ fontSize: 12.5, color: '#5A6A80' }}>
                  {activationSuccess
                    ? (isRtl ? `تم تسجيل كود المقعد وتأكيد قيد ${customerName} في المنصة` : `Physical seat code redeemed. Enrollment confirmed for ${customerName}`)
                    : (isRtl ? `تم تسجيل العملية وإرسال إشعار تأكيد إلى ${customerEmail}` : `Transaction recorded in Central Payment Hub. Receipt sent to ${customerEmail}`)}
                </span>
              </div>

              {/* Receipt metadata box */}
              <div
                style={{
                  width: '100%',
                  background: '#FAFBFD',
                  border: '1px solid #E3E8EF',
                  borderRadius: 10,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  fontSize: 12,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8A94A6' }}>Transaction Ref:</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#12203C' }}>{completedTxnId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8A94A6' }}>Venture / Brand:</span>
                  <span style={{ fontWeight: 700, color: '#12203C' }}>{activeBrandName}</span>
                </div>

                {activationSuccess ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8A94A6' }}>Redeemed Code:</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 800, color: '#0369A1' }}>
                        {activationSuccess.code?.code}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8A94A6' }}>Offline Source:</span>
                      <span style={{ fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: 4 }}>
                        {activationSuccess.code?.source || 'CENTER'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8A94A6' }}>Gateway Fee:</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#059669' }}>
                        EGP 0.00 (Zero Fee / Non-Gateway)
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8A94A6' }}>Gateway Used:</span>
                      <span style={{ fontWeight: 700, color: '#2C5F9E' }}>
                        {selectedMethod === 'kiosk' ? 'Fawry Pay' : gatewayLabel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8A94A6' }}>Amount Paid:</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 800, color: '#15803D' }}>{activeAmount}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation Actions */}
              <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (sessionData?.successUrl) {
                      const finalUrl = sessionData.successUrl.replace('{CHECKOUT_SESSION_ID}', sessionData.id || linkId);
                      window.location.href = finalUrl;
                    } else {
                      window.location.href = `http://localhost:3000/orders/bldr_pilot_2026/success?session_id=${linkId || 'bldr-pilot'}`;
                    }
                  }}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 8,
                    background: brandPrimaryColor,
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px ${brandPrimaryColor}40`,
                  }}
                >
                  {isRtl ? `العودة لمتجر ${activeBrandName} ←` : `Return to ${activeBrandName} Storefront →`}
                </button>

                <a
                  href="/transactions"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 16px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D3DAE4',
                    color: '#12203C',
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  View in Hub
                </a>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div style={{ borderTop: '1px solid #EEF1F5', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#8A94A6' }}>
              bldr Central Payment Hub · Multi-Gateway Routing Architecture
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#2E6F5E' }}>
              100% Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
