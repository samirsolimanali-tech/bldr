'use client';

import React from 'react';

// ─── Design Tokens (PRD v1.0 & brandguide.txt) ──────────────────────────────

export const tokens = {
  colors: {
    // Core Brand Palette
    brandDark: '#141416',
    brandLight: '#F4F5F7',
    gradientStart: '#D10721', // bldr primary red
    gradientEnd: '#FD9426',   // bldr orange
    textMuted: '#47454A',
    textLight: '#6B6970',

    // Central Payment Hub Administrative Palette
    hubNavy: '#12203C',
    hubNavySidebar: '#16223C',
    hubNavyText: '#1B2A4A',
    hubGreen: '#2E6F5E',
    hubGreenBg: '#E6EFEB',
    hubBlue: '#2C5F9E',
    hubBlueBg: '#E8EEF7',
    hubAmber: '#B8860B',
    hubAmberBg: '#FBF3E0',
    hubPurple: '#7A4CA0',
    hubPurpleBg: '#F0EAF7',
    hubRed: '#C0392B',
    hubRedBg: '#FBEBE9',
    hubBorder: '#E3E8EF',
    hubCanvas: '#E9EDF3',
    hubCardBg: '#FFFFFF',
  },
  fonts: {
    display: "'Readex Pro', system-ui, -apple-system, sans-serif",
    ui: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
};

// ─── Format Currency Helper ─────────────────────────────────────────────────
export function formatCurrency(amount: number | string | null | undefined, currency = 'EGP'): string {
  if (amount === null || amount === undefined) return `${currency} 0.00`;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${currency} 0.00`;
  return `${currency.toUpperCase()} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatEGP(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === 'Open') return 'Open';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'EGP 0.00';
  return `EGP ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Backward-compatible Marketplace Helpers ─────────────────────────────────
export function SimulationBanner({ message }: { message?: string }) {
  return (
    <div style={{ background: '#FEF6E7', borderBottom: '1px solid #F0D9A8', padding: '8px 16px', fontSize: 12, color: '#B8790A', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <span>{message || 'Sandbox Simulation Mode Active — No real funds will be charged.'}</span>
    </div>
  );
}

export function TrustLine({ gatewayName, note }: { gatewayName?: string; note?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A6A80' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span>{note || 'Powered by bldr Central Payment Hub & PCI DSS certified gateways'} {gatewayName ? `(${gatewayName})` : ''}</span>
    </div>
  );
}

export interface SimulatedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  amount?: number;
  currency?: string;
  gatewayName?: string;
  onSimulateSuccess?: () => Promise<void> | void;
  onSimulateFailure?: () => Promise<void> | void;
  isLoading?: boolean;
}

export function SimulatedPaymentModal({
  isOpen,
  onClose,
  onSimulateSuccess,
  onSimulateFailure,
}: SimulatedPaymentModalProps) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 12, maxWidth: 400, width: '90%' }}>
        <h3>Simulated Payment</h3>
        <p style={{ margin: '12px 0', fontSize: 14, color: '#666' }}>Sandbox simulation.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { onSimulateSuccess?.(); onClose(); }} style={{ padding: '8px 16px', borderRadius: 6, background: '#2E6F5E', color: '#fff', border: 'none', cursor: 'pointer' }}>Success</button>
          <button onClick={() => { onSimulateFailure?.(); onClose(); }} style={{ padding: '8px 16px', borderRadius: 6, background: '#C0392B', color: '#fff', border: 'none', cursor: 'pointer' }}>Fail</button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, background: '#eee', color: '#333', border: 'none', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}


// ─── Main Website Navigation ─────────────────────────────────────────
export interface BldrNavProps {
  lang?: 'EN' | 'AR';
  onLanguageChange?: (lang: 'EN' | 'AR') => void;
  onStartProject?: () => void;
}

export function BldrNav({ lang = 'EN', onLanguageChange, onStartProject }: BldrNavProps) {
  const isRtl = lang === 'AR';
  const [activeDropdown, setActiveDropdown] = React.useState<'services' | 'products' | 'projects' | null>(null);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: 'services' | 'products' | 'projects') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 160);
  };

  const servicesList = [
    {
      slug: 'performance-ads',
      title: isRtl ? 'الإعلانات الممولة والنمو' : 'Performance Ads',
    },
    {
      slug: 'brand-identity',
      title: isRtl ? 'الهوية البصرية والتصميم' : 'Brand Identity',
    },
    {
      slug: 'tutor-marketing',
      title: isRtl ? 'تسويق المعلمين والأكاديميات' : 'Tutor & Academy Funnel',
    },
    {
      slug: 'media-production',
      title: isRtl ? 'الإنتاج المرئي والفيديو' : 'Media & Video Production',
    },
    {
      slug: 'web-platform-engineering',
      title: isRtl ? 'تطبيقات ومنصات الويب' : 'Web & Platform Engineering',
    },
    {
      slug: 'consulting-session',
      title: isRtl ? 'استشارات وتدقيق الأعمال' : 'Strategic Consulting',
    },
  ];

  const productsList = [
    {
      href: '/products?type=Course',
      title: isRtl ? 'الدورات والمعسكرات' : 'Courses & Bootcamps',
    },
    {
      href: '/products?type=Workshop',
      title: isRtl ? 'ورش العمل التطبيقية' : 'Workshops & Sprints',
    },
    {
      href: '/products?type=Assessment',
      title: isRtl ? 'الاشتراكات والتقييمات' : 'Assessments & Passes',
    },
    {
      href: '/products?type=Book',
      title: isRtl ? 'الكتب والأدلة' : 'Books & Toolkits',
    },
    {
      href: '/products?type=Event',
      title: isRtl ? 'الفعاليات والتجمعات' : 'Events & Summits',
    },
  ];

  const projectsList = [
    {
      href: '/projects?category=platforms',
      title: isRtl ? 'المنصات الرقمية وتطبيقات الويب' : 'Digital Platforms & Web Apps',
    },
    {
      href: '/projects?category=edtech',
      title: isRtl ? 'منصات التعليم وإدارة الطلاب' : 'EdTech LMS & Academies',
    },
    {
      href: '/projects?category=growth',
      title: isRtl ? 'نمو العلامات التجارية والتسويق' : 'D2C Commerce & Growth Engine',
    },
    {
      href: '/projects?category=saas',
      title: isRtl ? 'تطبيقات وأنظمة الأعمال السحابية' : 'Enterprise Workflow & SaaS',
    },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = React.useState<'services' | 'products' | 'projects' | null>(null);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [mobileMenuOpen]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(244, 245, 247, 0.96)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(20, 20, 22, 0.08)',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display,
      }}
    >
      <style>{`
        @media (max-width: 960px) {
          .bldr-nav-container { padding: 0 16px !important; height: 64px !important; }
          .bldr-desktop-nav { display: none !important; }
          .bldr-desktop-actions { display: none !important; }
          .bldr-mobile-actions { display: flex !important; align-items: center; gap: 8px; }
        }
        @media (min-width: 961px) {
          .bldr-desktop-nav { display: flex !important; }
          .bldr-desktop-actions { display: flex !important; }
          .bldr-mobile-actions { display: none !important; }
          .bldr-mobile-drawer { display: none !important; }
        }
      `}</style>

      <div
        className="bldr-nav-container"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <a
          href="/"
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.045em',
            color: tokens.colors.brandDark,
            textDecoration: 'none',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          bldr
          <span
            style={{
              background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            .
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="bldr-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>

          {/* Services */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 14.5, fontWeight: 600, color: '#1E293B',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8,
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(20,20,22,0.05)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {isRtl ? 'الخدمات' : 'Services'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5l4 3.5 4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {activeDropdown === 'services' && (
              <div
                style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 200,
                  background: '#FFFFFF', borderRadius: 12, minWidth: 220,
                  boxShadow: '0 8px 32px rgba(20,20,22,0.12)', border: '1px solid rgba(20,20,22,0.08)',
                  padding: '8px 0', marginTop: 6,
                }}
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                {servicesList.map((s) => (
                  <a
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    style={{
                      display: 'block', padding: '9px 18px',
                      fontSize: 13.5, color: '#1E293B', textDecoration: 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(20,20,22,0.04)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 14.5, fontWeight: 600, color: '#1E293B',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8,
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(20,20,22,0.05)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {isRtl ? 'البرامج والمنتجات' : 'Products'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5l4 3.5 4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {activeDropdown === 'products' && (
              <div
                style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 200,
                  background: '#FFFFFF', borderRadius: 12, minWidth: 200,
                  boxShadow: '0 8px 32px rgba(20,20,22,0.12)', border: '1px solid rgba(20,20,22,0.08)',
                  padding: '8px 0', marginTop: 6,
                }}
                onMouseEnter={() => handleMouseEnter('products')}
                onMouseLeave={handleMouseLeave}
              >
                {productsList.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    style={{
                      display: 'block', padding: '9px 18px',
                      fontSize: 13.5, color: '#1E293B', textDecoration: 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(20,20,22,0.04)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {p.title}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter('projects')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 14.5, fontWeight: 600, color: '#1E293B',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8,
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(20,20,22,0.05)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {isRtl ? 'المشاريع' : 'Projects'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5l4 3.5 4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {activeDropdown === 'projects' && (
              <div
                style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 200,
                  background: '#FFFFFF', borderRadius: 12, minWidth: 240,
                  boxShadow: '0 8px 32px rgba(20,20,22,0.12)', border: '1px solid rgba(20,20,22,0.08)',
                  padding: '8px 0', marginTop: 6,
                }}
                onMouseEnter={() => handleMouseEnter('projects')}
                onMouseLeave={handleMouseLeave}
              >
                {projectsList.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    style={{
                      display: 'block', padding: '9px 18px',
                      fontSize: 13.5, color: '#1E293B', textDecoration: 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(20,20,22,0.04)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {p.title}
                  </a>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* Desktop Right Actions */}
        <div className="bldr-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: tokens.colors.textMuted,
              cursor: 'pointer',
              userSelect: 'none',
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(20,20,22,0.04)',
            }}
            onClick={() => onLanguageChange?.(lang === 'EN' ? 'AR' : 'EN')}
          >
            <span style={{ color: lang === 'AR' ? tokens.colors.brandDark : tokens.colors.textLight, fontWeight: lang === 'AR' ? 700 : 400 }}>عربي</span>
            <span style={{ color: 'rgba(20,20,22,0.2)' }}>·</span>
            <span style={{ color: lang === 'EN' ? tokens.colors.brandDark : tokens.colors.textLight, fontWeight: lang === 'EN' ? 700 : 400 }}>EN</span>
          </div>

          <a
            href="/apply-provider"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 38,
              padding: '0 16px',
              borderRadius: 999,
              background: '#FFFFFF',
              border: '1px solid rgba(20,20,22,0.14)',
              color: tokens.colors.brandDark,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {isRtl ? 'كن شريكاً معنا' : 'Partner with bldr'}
          </a>

          <button
            type="button"
            onClick={onStartProject}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 40,
              padding: '0 20px',
              borderRadius: 999,
              background: tokens.colors.brandDark,
              color: '#FFFFFF',
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(20,20,22,0.14)',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {isRtl ? 'ابدأ مشروعك' : 'Start a project'}
          </button>
        </div>

        {/* Mobile Right Actions */}
        <div className="bldr-mobile-actions" style={{ display: 'none' }}>
          <button
            type="button"
            onClick={() => onLanguageChange?.(lang === 'EN' ? 'AR' : 'EN')}
            style={{
              background: 'rgba(20, 20, 22, 0.05)',
              border: '1px solid rgba(20, 20, 22, 0.08)',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 700,
              color: tokens.colors.brandDark,
              cursor: 'pointer',
            }}
          >
            {lang === 'EN' ? 'عربي' : 'EN'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: mobileMenuOpen ? '#141416' : '#FFFFFF',
              color: mobileMenuOpen ? '#FFFFFF' : '#141416',
              border: '1px solid rgba(20, 20, 22, 0.12)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s ease',
            }}
          >
            {mobileMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Brand gradient progress bar */}
      <div style={{ height: 2, background: 'rgba(20, 20, 22, 0.05)' }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`, width: '100%' }} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="bldr-mobile-drawer"
          style={{
            position: 'fixed',
            top: 66,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderBottom: '1px solid rgba(20, 20, 22, 0.1)',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
              maxHeight: 'calc(100vh - 66px)',
              overflowY: 'auto',
              padding: '20px 20px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {/* Services Accordion */}
            <div style={{ borderBottom: '1px solid rgba(20, 20, 22, 0.06)', paddingBottom: 10 }}>
              <div
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'services' ? null : 'services')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#141416',
                }}
              >
                <span>{isRtl ? 'الخدمات المتخصصة' : 'Services'}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: mobileExpandedSection === 'services' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {mobileExpandedSection === 'services' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0 10px', marginInlineStart: 12 }}>
                  <a
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontSize: 14, fontWeight: 700, color: '#D10721', textDecoration: 'none', padding: '6px 0' }}
                  >
                    {isRtl ? 'استعراض كافة الخدمات ←' : 'View All Services →'}
                  </a>
                  {servicesList.map((s) => (
                    <a
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ fontSize: 13.5, color: '#475569', textDecoration: 'none', padding: '6px 0' }}
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Products Accordion */}
            <div style={{ borderBottom: '1px solid rgba(20, 20, 22, 0.06)', paddingBottom: 10 }}>
              <div
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'products' ? null : 'products')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#141416',
                }}
              >
                <span>{isRtl ? 'البرامج والمنتجات' : 'Products & Courses'}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: mobileExpandedSection === 'products' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {mobileExpandedSection === 'products' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0 10px', marginInlineStart: 12 }}>
                  <a
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontSize: 14, fontWeight: 700, color: '#D10721', textDecoration: 'none', padding: '6px 0' }}
                  >
                    {isRtl ? 'تصفح كافة الدورات والمنتجات ←' : 'Explore All Products →'}
                  </a>
                  {productsList.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ fontSize: 13.5, color: '#475569', textDecoration: 'none', padding: '6px 0' }}
                    >
                      {p.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Projects Accordion */}
            <div style={{ borderBottom: '1px solid rgba(20, 20, 22, 0.06)', paddingBottom: 10 }}>
              <div
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'projects' ? null : 'projects')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#141416',
                }}
              >
                <span>{isRtl ? 'المشاريع وسوابق الأعمال' : 'Projects & Work'}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: mobileExpandedSection === 'projects' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {mobileExpandedSection === 'projects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '4px 0 10px', marginInlineStart: 12 }}>
                  <a
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontSize: 14, fontWeight: 700, color: '#D10721', textDecoration: 'none', padding: '6px 0' }}
                  >
                    {isRtl ? 'استعراض كافة دراسات الحالة ←' : 'All Case Studies →'}
                  </a>
                  {projectsList.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ fontSize: 13.5, color: '#475569', textDecoration: 'none', padding: '6px 0' }}
                    >
                      {p.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Single Links */}
            <a
              href="/apply-provider"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                padding: '10px 4px',
                fontSize: 15,
                fontWeight: 600,
                color: '#141416',
                textDecoration: 'none',
              }}
            >
              {isRtl ? 'كن شريكاً معنا (Partner with bldr)' : 'Partner with bldr'}
            </a>

            <a
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                padding: '10px 4px',
                fontSize: 15,
                fontWeight: 600,
                color: '#141416',
                textDecoration: 'none',
              }}
            >
              {isRtl ? 'تواصل معنا' : 'Contact Us'}
            </a>

            {/* CTA Button in Drawer */}
            <div style={{ paddingTop: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartProject?.();
                }}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 999,
                  background: tokens.colors.brandDark,
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(20,20,22,0.18)',
                }}
              >
                <span>{isRtl ? 'ابدأ مشروعك معنا ←' : 'Start a Project →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand gradient progress bar */}
      <div style={{ height: 2, background: 'rgba(20, 20, 22, 0.05)' }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`, width: '100%' }} />
      </div>
    </div>
  );
}

// ─── Contact & Project Inquiry Modal ────────────────────────────────────────
export interface ProjectContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'EN' | 'AR';
}

export function ProjectContactModal({ isOpen, onClose, lang = 'EN' }: ProjectContactModalProps) {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    service: 'Marketing & Growth (Sidekick)',
    budget: '$5,000 – $15,000',
    details: '',
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const isRtl = lang === 'AR';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(18, 32, 60, 0.65)',
        backdropFilter: 'blur(8px)',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.ui,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 540,
          maxHeight: '92vh',
          background: '#FFFFFF',
          borderRadius: 18,
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ height: 4, background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})` }} />

        <div style={{ padding: '24px 20px 28px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#12203C' }}>
                {isRtl ? 'ابدأ مشروعك مع bldr' : 'Start a Project with bldr'}
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#5A6A80' }}>
                {isRtl ? 'أخبرنا عن مشروعك أو الخدمة المطلوبة وسنتواصل معك خلال 24 ساعة.' : 'Tell us about your venture, product, or campaign. We will get back within 24 hours.'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: '#8A94A6',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(46,111,94,0.1)', color: '#2E6F5E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#12203C', margin: '0 0 8px' }}>
                {isRtl ? 'تم استلام طلبك بنجاح!' : 'Inquiry Received Successfully!'}
              </h3>
              <p style={{ color: '#5A6A80', fontSize: 14, margin: '0 0 24px' }}>
                {isRtl ? 'فريق bldr سيراجع التفاصيل ويتواصل معك عبر البريد الإلكتروني أو الواتساب.' : 'Our partner and specialist unit leads will review your brief and follow up.'}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                style={{
                  height: 42,
                  padding: '0 24px',
                  borderRadius: 8,
                  background: '#12203C',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isRtl ? 'إغلاق' : 'Close Window'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 5 }}>
                    {isRtl ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    required
                    placeholder={isRtl ? 'مثال: أحمد كريم' : 'e.g. Alex Rivera'}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 5 }}>
                    {isRtl ? 'البريد الإلكتروني' : 'Work Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: (e.target as HTMLInputElement).value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 5 }}>
                    {isRtl ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    placeholder="+20 10 0000 0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: (e.target as HTMLInputElement).value })}
                    style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 5 }}>
                    {isRtl ? 'الخدمة المطلوبة' : 'Primary Service'}
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: (e.target as HTMLSelectElement).value })}
                    style={{ width: '100%', height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13, background: '#FFFFFF', boxSizing: 'border-box' }}
                  >
                    <option value="Marketing & Growth (Sidekick)">Marketing & Ads (Sidekick)</option>
                    <option value="Full Brand Identity">Brand Identity & Design</option>
                    <option value="Software & Tech House">Software & Platforms (Tech House)</option>
                    <option value="Custom Web & Platform Engineering">Custom Web & Platform Engineering</option>
                    <option value="Consulting Session">Strategic Consulting Session</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 5 }}>
                  {isRtl ? 'تفاصيل المشروع / نطاق العمل' : 'Project Brief / What are you looking to build?'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={isRtl ? 'أخبرنا عن أهدافك، الميزانية المتوقعة، أو التحديات الحالية...' : 'Briefly describe your objectives, target timeline, or what you need help solving...'}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: (e.target as HTMLTextAreaElement).value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  height: 44,
                  marginTop: 6,
                  borderRadius: 8,
                  background: '#12203C',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? (isRtl ? 'جاري الإرسال...' : 'Sending Brief...') : (isRtl ? 'إرسال طلب المشروع ←' : 'Submit Project Brief →')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Website Footer (BldrFooter.dc.html) ───────────────────────────────
export function BldrFooter({
  lang = 'EN',
  customData,
}: {
  lang?: 'EN' | 'AR';
  customData?: any;
} = {}) {
  const isRtl = lang === 'AR';
  const [data, setData] = React.useState<any>(customData || null);

  React.useEffect(() => {
    let isCancelled = false;
    const fetchCmsData = () => {
      fetch('/api/cms')
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (isCancelled || !json?.data) return;
          const merged = {
            ...(json.data.brand || {}),
            ...(json.data.footer || {}),
            ...(customData || {}),
          };
          setData(merged);
        })
        .catch(() => {});
    };

    fetchCmsData();

    // Re-sync when window gains focus (e.g. after updating CMS in Admin Portal)
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', fetchCmsData);
    }

    return () => {
      isCancelled = true;
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', fetchCmsData);
      }
    };
  }, [customData]);

  const active = data || customData;

  const footerDesc = isRtl
    ? (active?.descriptionAr || active?.footerDescriptionAr || 'تمكين شركات تكنولوجيا التعليم والأكاديميات بالحلول الرقمية المتخصصة، البنية التحتية الذكية، وأنظمة المدفوعات المتكاملة.')
    : (active?.description || active?.footerDescription || 'Empowering EdTech businesses and educational academies with tailored digital solutions, automated operations, and payment infrastructure.');

  const instagramHref = active?.instagram || active?.instagramUrl || 'https://www.instagram.com/bldr.management';
  const facebookHref = active?.facebook || active?.facebookUrl || 'https://www.facebook.com/share/14uAjf399GL/';
  const linkedinHref = active?.linkedin || active?.linkedinUrl || 'https://www.linkedin.com/company/bldrmanagement/';

  const locationText = isRtl
    ? (active?.locationAr || 'الجيزة، جمهورية مصر العربية')
    : (active?.location || 'Giza, Egypt');

  const phoneText = active?.phone || '+20 10 30165000';
  const emailText = active?.email || 'bldr.management@gmail.com';

  const copyrightText = isRtl
    ? (active?.copyrightAr || `© ${new Date().getFullYear()} bldr. تشغيل شركة إيفولف بيلدر لإدارة الأعمال، الجيزة، مصر.`)
    : (active?.copyright || `© ${new Date().getFullYear()} bldr. Operated by Evolve bldr for Business Management, Giza, Egypt.`);

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} style={{ background: tokens.colors.brandDark, color: '#FFFFFF', fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display }}>
      <style>{`
        @media (max-width: 768px) {
          .bldr-footer-wrapper { padding: 48px 20px 28px !important; }
          .bldr-footer-columns { gap: 32px 20px !important; }
        }
      `}</style>
      <div className="bldr-footer-wrapper" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 34px' }}>
        <div className="bldr-footer-columns" style={{ display: 'flex', flexWrap: 'wrap', gap: '44px 36px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          
          {/* Studio Brand */}
          <div style={{ flex: '1 1 260px', minWidth: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <a href="/" style={{ textDecoration: 'none', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1 }}>
                bldr
                <span style={{
                  background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>.</span>
              </span>
            </a>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 300, lineHeight: 1.68, color: 'rgba(255, 255, 255, 0.65)', maxWidth: 320 }}>
              {footerDesc}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {[
                { label: 'Instagram', href: instagramHref },
                { label: 'Facebook',  href: facebookHref },
                { label: 'LinkedIn',  href: linkedinHref },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.75)',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Company — left column */}
          <div style={{ flex: '0 1 180px', minWidth: 150, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              {isRtl ? 'الشركة' : 'Company'}
            </div>
            <a href="/" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'الرئيسية' : 'Home'}
            </a>
            <a href="/services" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'الخدمات' : 'Services'}
            </a>
            <a href="/products" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'المنتجات والدورات' : 'Courses & Programs'}
            </a>
            <a href="/projects" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'المشاريع' : 'Projects'}
            </a>
            <a href="/apply-provider" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'كن شريكاً معنا' : 'Partner with bldr'}
            </a>
          </div>

          {/* Legal & Policies — middle column */}
          <div style={{ flex: '0 1 180px', minWidth: 160, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              {isRtl ? 'السياسات والشروط' : 'Legal & Policies'}
            </div>
            <a href="/privacy-policy" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <a href="/terms" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'شروط الخدمة' : 'Terms of Service'}
            </a>
            <a href="/refund-policy" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'سياسة الاسترجاع والإلغاء' : 'Refund Policy'}
            </a>
            <a href="/contact" style={{ fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>
              {isRtl ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>

          {/* Contact Us — right column */}
          <div style={{ flex: '1 1 240px', minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: tokens.colors.gradientEnd }}>
              {isRtl ? 'تواصل معنا' : 'Contact Us'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, fontWeight: 300, color: 'rgba(255,255,255,0.85)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: tokens.colors.gradientEnd, fontSize: 11, marginTop: 2 }}>LOC</span>
                <span>{locationText}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: tokens.colors.gradientEnd, fontSize: 11 }}>TEL</span>
                <a href={`tel:${phoneText.replace(/\s+/g, '')}`} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 500, direction: 'ltr', unicodeBidi: 'embed' }}>
                  {phoneText}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: tokens.colors.gradientEnd, fontSize: 11 }}>EMAIL</span>
                <a href={`mailto:${emailText}`} style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 400 }}>
                  {emailText}
                </a>
              </div>
              <div style={{ marginTop: 4 }}>
                <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: tokens.colors.gradientEnd, textDecoration: 'none' }}>
                  <span>{isRtl ? 'صفحة التواصل ونموذج الاستفسار ←' : 'Contact Page & Inquiry Form →'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`, margin: '40px 0 24px' }} />

        {/* Copyright */}
        <div style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}

// ─── Central Payment Hub Sidebar (HubSidebar.dc.html) ────────────────────────
export interface HubSidebarProps {
  activeTab: 'Overview' | 'Ventures' | 'Payment Links' | 'Transactions';
  onSelectTab: (tab: 'Overview' | 'Ventures' | 'Payment Links' | 'Transactions') => void;
  badges?: Record<string, string | number>;
}

export function HubSidebar({ activeTab, onSelectTab, badges = {} }: HubSidebarProps) {
  const items = [
    { label: 'Overview' as const, icon: 'M2.5 2.5h4.2v4.2H2.5zM9.3 2.5h4.2v4.2H9.3zM2.5 9.3h4.2v4.2H2.5zM9.3 9.3h4.2v4.2H9.3z' },
    { label: 'Ventures' as const, icon: 'M2.5 13.5V4.2l4.6-1.7v11M7.1 13.5V6.6l6.4-1.6v8.5M9.8 8.4h1M9.8 10.6h1' },
    { label: 'Payment Links' as const, icon: 'M6.4 9.6l3.2-3.2M5.2 7.8L3.6 9.4a2.2 2.2 0 003.1 3.1l1.6-1.6M10.8 8.2l1.6-1.6a2.2 2.2 0 00-3.1-3.1L7.7 5.1' },
    { label: 'Transactions' as const, icon: 'M2.5 5.2h9.2L9.4 2.9M13.5 10.8H4.3l2.3 2.3' },
  ];

  return (
    <aside style={{
      width: 240,
      flex: 'none',
      minHeight: '100vh',
      background: tokens.colors.hubNavySidebar,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: tokens.fonts.ui,
      color: '#FFFFFF',
    }}>
      {/* Brand Header */}
      <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: tokens.colors.hubGreen,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 800,
          color: '#FFFFFF',
        }}>
          b
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            bldr<span style={{ color: tokens.colors.hubGreen }}>.</span>
          </span>
          <span style={{ fontSize: 9.5, fontWeight: 600, color: '#7E8DA8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Payment Hub
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.08)', margin: '0 20px 14px' }} />

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 10px' }}>
        {items.map((it) => {
          const isActive = it.label === activeTab;
          return (
            <button
              key={it.label}
              onClick={() => onSelectTab(it.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '9px 11px',
                borderRadius: 8,
                background: isActive ? 'rgba(46, 111, 94, 0.18)' : 'transparent',
                color: isActive ? '#FFFFFF' : '#8A94A6',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={isActive ? '#FFFFFF' : '#8A94A6'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={it.icon} />
              </svg>
              <span style={{ flex: 1 }}>{it.label}</span>
              {badges[it.label] && (
                <span style={{
                  fontFamily: tokens.fonts.mono,
                  fontSize: 10,
                  fontWeight: 600,
                  background: '#C0392B',
                  color: '#FFFFFF',
                  borderRadius: 20,
                  padding: '1px 6px',
                }}>
                  {badges[it.label]}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Active User Card */}
      <div style={{
        margin: '0 10px 16px',
        padding: 11,
        borderRadius: 9,
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: tokens.colors.hubGreen,
          color: '#FFFFFF',
          fontSize: 10.5,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}>
          MG
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, minWidth: 0 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Mohammad Gamal
          </span>
          <span style={{ fontSize: 10, color: '#7E8DA8', fontWeight: 600 }}>Super Admin</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Central Payment Hub TopBar (HubTopBar.dc.html) ──────────────────────────
export interface HubTopBarProps {
  title: string;
  crumb?: string;
  env?: 'Sandbox' | 'Production';
  onActionClick?: () => void;
  actionLabel?: string;
}

export function HubTopBar({
  title,
  crumb,
  env = 'Sandbox',
  onActionClick,
  actionLabel,
}: HubTopBarProps) {
  return (
    <header style={{
      height: 64,
      flex: 'none',
      background: '#FFFFFF',
      borderBottom: `1px solid ${tokens.colors.hubBorder}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 14,
      fontFamily: tokens.fonts.ui,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {crumb && (
          <span style={{ fontSize: 10.5, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.02em' }}>
            {crumb}
          </span>
        )}
        <span style={{ fontSize: 16.5, fontWeight: 800, color: tokens.colors.hubNavyText, letterSpacing: '-0.025em' }}>
          {title}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Environment Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 20,
        background: env === 'Sandbox' ? 'rgba(253, 148, 38, 0.12)' : 'rgba(46, 111, 94, 0.12)',
        border: `1px solid ${env === 'Sandbox' ? 'rgba(253, 148, 38, 0.3)' : 'rgba(46, 111, 94, 0.3)'}`,
      }}>
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: env === 'Sandbox' ? tokens.colors.gradientEnd : tokens.colors.hubGreen,
        }} />
        <span style={{
          fontSize: 10.5,
          fontWeight: 700,
          color: env === 'Sandbox' ? tokens.colors.hubAmber : tokens.colors.hubGreen,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontFamily: tokens.fonts.mono,
        }}>
          {env} Mode
        </span>
      </div>

      {actionLabel && (
        <button
          onClick={onActionClick}
          style={{
            height: 34,
            padding: '0 14px',
            borderRadius: 7,
            background: tokens.colors.hubGreen,
            color: '#FFFFFF',
            border: 'none',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {actionLabel}
        </button>
      )}
    </header>
  );
}

// ─── Status Badge Component ─────────────────────────────────────────────────
export interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let bg = '#EEF1F5';
  let fg = '#5A6A80';

  if (normalized === 'PAID' || normalized === 'ACTIVE') {
    bg = tokens.colors.hubGreenBg;
    fg = tokens.colors.hubGreen;
  } else if (normalized === 'PENDING' || normalized === 'PENDING_VERIFICATION') {
    bg = tokens.colors.hubBlueBg;
    fg = tokens.colors.hubBlue;
  } else if (normalized === 'EXPIRED') {
    bg = '#EEF1F5';
    fg = '#8A94A6';
  } else if (normalized === 'CANCELLED' || normalized === 'FAILED') {
    bg = tokens.colors.hubRedBg;
    fg = tokens.colors.hubRed;
  } else if (normalized === 'REFUNDED') {
    bg = tokens.colors.hubAmberBg;
    fg = tokens.colors.hubAmber;
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 6,
      background: bg,
      color: fg,
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      fontFamily: tokens.fonts.mono,
    }}>
      {normalized}
    </span>
  );
}

// ─── Venture Chip Component ─────────────────────────────────────────────────
export interface VentureChipProps {
  code: string;
  name: string;
  chipBg?: string;
  chipFg?: string;
}

export function VentureChip({ code, name, chipBg = '#E6EFEB', chipFg = '#2E6F5E' }: VentureChipProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: chipBg,
        color: chipFg,
        fontSize: 9.5,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        letterSpacing: '-0.02em',
        fontFamily: tokens.fonts.mono,
      }}>
        {code}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: tokens.colors.hubNavyText, letterSpacing: '-0.01em' }}>
        {name}
      </span>
    </div>
  );
}

// ─── KPI Metric Card ────────────────────────────────────────────────────────
export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: string;
}

export function KpiCard({ label, value, delta, deltaColor = tokens.colors.hubGreen }: KpiCardProps) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: `1px solid ${tokens.colors.hubBorder}`,
      borderRadius: 10,
      padding: '14px 16px 15px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: tokens.fonts.ui,
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8A94A6' }}>
        {label}
      </span>
      <span style={{ fontFamily: tokens.fonts.mono, fontSize: 19, fontWeight: 600, color: tokens.colors.hubNavy, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        {value}
      </span>
      {delta && (
        <span style={{ fontSize: 11, fontWeight: 600, color: deltaColor }}>
          {delta}
        </span>
      )}
    </div>
  );
}

// ─── KpiStat Backward Compatibility ─────────────────────────────────────────
export function KpiStat({
  label,
  value,
  helper,
  delta,
  deltaType,
}: {
  label: string;
  value: string | number;
  helper?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
}) {
  return (
    <KpiCard
      label={label}
      value={String(value)}
      delta={delta || helper}
      deltaColor={deltaType === 'negative' ? tokens.colors.hubRed : tokens.colors.hubGreen}
    />
  );
}


// ─── Modal Dialog Component ─────────────────────────────────────────────────
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(18, 32, 60, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 540,
        background: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 20px 40px -15px rgba(18,32,60,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: tokens.fonts.ui,
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${tokens.colors.hubBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: tokens.colors.hubNavyText, letterSpacing: '-0.02em' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#8A94A6',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
