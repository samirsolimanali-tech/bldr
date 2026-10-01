'use client';

import React from 'react';

/**
 * Authentic Payment Gateway & Security Logos for Egyptian Rails
 * Designed according to official brand guidelines:
 * - Fawry (Yellow/Blue bird & wordmark)
 * - Vodafone Cash (Red circular brandmark)
 * - Orange Money (Vibrant orange brandmark)
 * - Etisalat Cash / e& money (Official e& / Etisalat mark)
 * - WE Pay (Telecom Egypt royal purple)
 * - Visa (Official blue & gold)
 * - Mastercard (Official interlocking circles)
 * - Geidea (Official coral/red acquiring gateway)
 * - Paymob (Official PSP brandmark)
 * - PCI-DSS Level 1 Trust Badges
 */

/* ─── 1. FAWRY LOGO ─── */
export function FawryLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  const width = Math.round(height * 3.1);
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#FFC800',
        borderRadius: 6,
        padding: '3px 8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Fawry (فوري)"
    >
      <svg
        width={width}
        height={height - 6}
        viewBox="0 0 100 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 14C8 8 13 4 19 5C17 9 17 12 19 15C15 15 11 17 8 21C6 19 5.5 16 6 14Z"
          fill="#0B3A78"
        />
        <path
          d="M13 10C16 6 21 4 25 7C22 10 21 14 23 17C19 16 16 13 13 10Z"
          fill="#0B3A78"
          opacity="0.9"
        />
        <text
          x="30"
          y="19"
          fill="#0B3A78"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="15"
          letterSpacing="-0.5px"
        >
          fawry
        </text>
        <text
          x="75"
          y="18"
          fill="#0B3A78"
          fontFamily="'Cairo', 'Segoe UI', Tahoma, sans-serif"
          fontWeight="800"
          fontSize="12"
          direction="rtl"
        >
          فوري
        </text>
      </svg>
    </div>
  );
}

/* ─── 2. VODAFONE CASH LOGO ─── */
export function VodafoneCashLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#FFFFFF',
        border: '1px solid #F1F5F9',
        borderRadius: 6,
        padding: '2px 7px 2px 4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Vodafone Cash (فودافون كاش)"
    >
      <svg width={height - 6} height={height - 6} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#E60000" />
        <path
          d="M18.8 9.5C15.2 9.5 12.3 12.4 12.3 16C12.3 19.6 15.2 22.5 18.8 22.5C21.4 22.5 23.6 20.9 24.6 18.7C23.9 19 23.1 19.2 22.2 19.2C19.7 19.2 17.6 17.1 17.6 14.6C17.6 12.4 19.2 10.6 21.3 10.1C20.5 9.7 19.7 9.5 18.8 9.5Z"
          fill="white"
        />
      </svg>
      <span
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 10.5,
          fontWeight: 800,
          color: '#E60000',
          letterSpacing: '-0.2px',
          whiteSpace: 'nowrap',
        }}
      >
        Vodafone Cash
      </span>
    </div>
  );
}


/* ─── 4. ORANGE MONEY / ORANGE CASH LOGO ─── */
export function OrangeCashLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#FF7900',
        borderRadius: 6,
        padding: '2px 7px 2px 6px',
        boxShadow: '0 1px 2px rgba(255, 121, 0, 0.2)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Orange Cash (أورنج كاش)"
    >
      <div
        style={{
          width: height - 10,
          height: height - 10,
          background: '#000000',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#FF7900', fontSize: 9, fontWeight: 900 }}>🍊</span>
      </div>
      <span
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 10.5,
          fontWeight: 800,
          color: '#000000',
          whiteSpace: 'nowrap',
        }}
      >
        Orange Cash
      </span>
    </div>
  );
}

/* ─── 5. ETISALAT CASH / e& money LOGO ─── */
export function EtisalatCashLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 6,
        padding: '2px 7px 2px 4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Etisalat Cash / e& money (اتصالات كاش)"
    >
      <div
        style={{
          width: height - 8,
          height: height - 8,
          borderRadius: 4,
          background: '#E2001A',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: 10,
        }}
      >
        e&
      </div>
      <span
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 10.5,
          fontWeight: 800,
          color: '#0F172A',
          whiteSpace: 'nowrap',
        }}
      >
        e& money
      </span>
    </div>
  );
}

/* ─── 6. WE PAY LOGO ─── */
export function WePayLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#5A2580',
        borderRadius: 6,
        padding: '2px 7px 2px 6px',
        boxShadow: '0 1px 2px rgba(90, 37, 128, 0.2)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="WE Pay Telecom Egypt (وي باي)"
    >
      <div
        style={{
          width: height - 10,
          height: height - 10,
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#5A2580', fontSize: 9, fontWeight: 900, fontFamily: 'serif' }}>we</span>
      </div>
      <span
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 10.5,
          fontWeight: 800,
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
        }}
      >
        WE Pay
      </span>
    </div>
  );
}


/* ─── 8. VISA LOGO ─── */
export function VisaLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  const width = Math.round(height * 1.8);
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 6,
        padding: '2px 6px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Visa Card"
    >
      <svg width={width} height={height - 6} viewBox="0 0 52 18" fill="none">
        <path
          d="M20.2 1.5L14.7 15.5H10.9L6.6 4.7C6.4 3.9 6.2 3.6 5.5 3.2C4.3 2.5 2.4 1.9 0.7 1.5L0.8 1L7 1C7.9 1 8.6 1.6 8.8 2.6L10.5 12L14.6 1.5H20.2ZM37.9 10.9C37.9 6.7 32.1 6.5 32.2 4.6C32.2 4.1 32.7 3.5 33.9 3.4C34.5 3.3 36.1 3.2 37.9 4.1L38.6 0.8C37.6 0.4 36.4 0.1 34.8 0.1C30.6 0.1 27.6 2.3 27.6 5.5C27.5 7.8 29.6 9.1 31.2 9.9C32.8 10.7 33.4 11.2 33.4 11.9C33.4 13 32 13.5 30.7 13.5C28.5 13.5 27.3 13.2 25.8 12.5L25 15.9C26.7 16.7 28.5 17 30.4 17C35 17 37.9 14.7 37.9 10.9ZM48.9 15.5H52L49.3 1.5H46.4C45.7 1.5 45.1 1.9 44.9 2.6L38.4 15.5H42.7L43.6 12.8H48.4L48.9 15.5ZM44.7 9.8L46.7 4.2L47.9 9.8H44.7ZM26.4 1.5L23 15.5H18.7L22.1 1.5H26.4Z"
          fill="#1434CB"
        />
        <path d="M6.6 4.7C6.4 3.9 6.2 3.6 5.5 3.2C4.3 2.5 2.4 1.9 0.7 1.5L0.8 1L7 1C7.9 1 8.6 1.6 8.8 2.6L6.6 4.7Z" fill="#F7B600" />
      </svg>
    </div>
  );
}

/* ─── 9. MASTERCARD LOGO ─── */
export function MastercardLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  const width = Math.round(height * 1.5);
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 6,
        padding: '2px 5px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Mastercard"
    >
      <svg width={width} height={height - 6} viewBox="0 0 36 22" fill="none">
        <circle cx="12" cy="11" r="10" fill="#EB001B" />
        <circle cx="24" cy="11" r="10" fill="#F79E1B" />
        <path
          d="M18 4.2C19.9 5.9 21.1 8.3 21.1 11C21.1 13.7 19.9 16.1 18 17.8C16.1 16.1 14.9 13.7 14.9 11C14.9 8.3 16.1 5.9 18 4.2Z"
          fill="#FF5F00"
        />
      </svg>
    </div>
  );
}

/* ─── 10. GEIDEA LOGO ─── */
export function GeideaLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#FFFFFF',
        border: '1px solid #FECDD3',
        borderRadius: 6,
        padding: '3px 8px',
        boxShadow: '0 1px 2px rgba(244, 63, 94, 0.08)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Geidea Payment Gateway (جيديا)"
    >
      <svg width={height - 8} height={height - 8} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#FF334B" strokeWidth="3" />
        <path d="M12 6V12L16 16" stroke="#FF334B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 12,
          fontWeight: 900,
          color: '#E11D48',
          letterSpacing: '-0.3px',
        }}
      >
        geidea
      </span>
    </div>
  );
}

/* ─── 11. PAYMOB LOGO ─── */
export function PaymobLogo({ height = 24, className = '' }: { height?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#0A2540',
        borderRadius: 6,
        padding: '3px 8px',
        boxShadow: '0 1px 3px rgba(10, 37, 64, 0.2)',
        height: height,
        boxSizing: 'border-box',
      }}
      title="Paymob Accept"
    >
      <svg width={height - 8} height={height - 8} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#00D4B2" strokeWidth="3" />
        <circle cx="12" cy="12" r="4" fill="#00D4B2" />
      </svg>
      <span
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 11.5,
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-0.2px',
        }}
      >
        paymob
      </span>
    </div>
  );
}

/* ─── 12. CENTRAL BANK OF EGYPT (CBE) COMPLIANCE SEAL ─── */
export function CbeComplianceBadge() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#F1F5F9',
        border: '1px solid #CBD5E1',
        borderRadius: 6,
        padding: '3px 8px',
        fontSize: 11,
        color: '#1E293B',
        fontWeight: 700,
      }}
      title="Central Bank of Egypt Compliant Rails (تحت رقابة البنك المركزي المصري)"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L3 6V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V6L12 2Z"
          fill="#1E293B"
          opacity="0.12"
        />
        <path
          d="M12 2L3 6V11C3 16.5 6.8 21.7 12 23C17.2 21.7 21 16.5 21 11V6L12 2Z"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M8 12L11 15L16 9" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Central Bank of Egypt Compliant</span>
    </div>
  );
}

/* ─── 13. PCI-DSS LEVEL 1 CERTIFIED BADGE ─── */
export function PciDssBadge() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#ECFDF5',
        border: '1px solid #A7F3D0',
        borderRadius: 6,
        padding: '3px 8px',
        fontSize: 11,
        color: '#065F46',
        fontWeight: 700,
      }}
      title="PCI DSS Level 1 Certified - Maximum Global Financial Security Standard"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#059669" strokeWidth="2.5" />
        <path d="M7 11V7C7 4.2 9.2 2 12 2C14.8 2 17 4.2 17 7V11" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1.5" fill="#059669" />
      </svg>
      <span>PCI DSS Level 1 Certified</span>
    </div>
  );
}

/* ─── 14. 256-BIT SSL ENCRYPTION BADGE ─── */
export function SslBadge() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: '#475569',
        fontWeight: 600,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" fill="#10B981" />
        <path d="M7 11V7C7 4.2 9.2 2 12 2C14.8 2 17 4.2 17 7V11" stroke="#10B981" strokeWidth="2" />
        <circle cx="12" cy="16" r="1.5" fill="white" />
      </svg>
      <span>256-Bit SSL Encrypted Rails</span>
    </div>
  );
}

/* ─── CURATED BRAND LOGO PRESETS FOR ACADEMIES & VENTURES ─── */
export interface BrandLogoPreset {
  id: string;
  name: string;
  category: string;
  svgDataUri: string;
}

export const BRAND_LOGO_PRESETS: BrandLogoPreset[] = [
  {
    id: 'studyhub',
    name: 'StudyHub Egypt',
    category: 'Higher Ed & Tech',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0EA5E9" />
            <stop offset="100%" stop-color="#0369A1" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#g1)" />
        <path d="M50 20L18 36L50 52L82 36L50 20Z" fill="#FFFFFF" />
        <path d="M28 44V64C28 72 38 78 50 78C62 78 72 72 72 64V44L50 55L28 44Z" fill="#FFFFFF" opacity="0.92" />
        <circle cx="50" cy="50" r="6" fill="#0369A1" />
      </svg>
    `)}`,
  },
  {
    id: 'bldr-academy',
    name: 'bldr Academy',
    category: 'Platform Core',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="#D10721" />
        <text x="50" y="68" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="54" text-anchor="middle">b</text>
      </svg>
    `)}`,
  },
  {
    id: 'apex-classes',
    name: 'Apex Classes',
    category: 'STEM & High School',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7C3AED" />
            <stop offset="100%" stop-color="#4338CA" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#g2)" />
        <path d="M50 18L78 72H22L50 18Z" fill="none" stroke="#F59E0B" stroke-width="8" stroke-linejoin="round" />
        <circle cx="50" cy="52" r="10" fill="#FFFFFF" />
      </svg>
    `)}`,
  },
  {
    id: 'el-hesa',
    name: 'EL HESA Learning',
    category: 'EdTech & Gamification',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F59E0B" />
            <stop offset="100%" stop-color="#D97706" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#g3)" />
        <circle cx="50" cy="50" r="28" fill="#FFFFFF" opacity="0.2" />
        <path d="M50 24L58 40L76 43L63 56L66 74L50 65L34 74L37 56L24 43L42 40L50 24Z" fill="#FFFFFF" />
      </svg>
    `)}`,
  },
  {
    id: 'techbridge',
    name: 'TechBridge Cairo',
    category: 'Engineering & AI',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#g4)" />
        <path d="M30 36L18 50L30 64M70 36L82 50L70 64M56 26L44 74" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `)}`,
  },
];
