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
    <div style={{ background: '#FEF6E7', borderBottom: '1px solid #F0D9A8', padding: '8px 16px', fontSize: 12, color: '#B8790A', textAlign: 'center', fontWeight: 600 }}>
      ⚡ {message || 'Sandbox Simulation Mode Active — No real funds will be charged.'}
    </div>
  );
}

export function TrustLine({ gatewayName, note }: { gatewayName?: string; note?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A6A80' }}>
      <span>🔒 {note || 'Powered by bldr Central Payment Hub & PCI DSS certified gateways'} {gatewayName ? `(${gatewayName})` : ''}</span>
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


// ─── Main Website Navigation (BldrNav.dc.html) ───────────────────────────────
export interface BldrNavProps {
  activeTab?: string;
  lang?: 'EN' | 'AR';
  onLanguageChange?: (lang: 'EN' | 'AR') => void;
}

export function BldrNav({ activeTab = 'home', lang = 'EN', onLanguageChange }: BldrNavProps) {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(244, 245, 247, 0.88)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(20, 20, 22, 0.08)',
      fontFamily: tokens.fonts.display,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 32px',
        height: 74,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        {/* Logo */}
        <a href="/" style={{
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: '-0.045em',
          color: tokens.colors.brandDark,
          textDecoration: 'none',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
        }}>
          bldr
          <span style={{
            background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}>.</span>
        </a>

        {/* Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[
            { label: "How we're built", href: '/#built' },
            { label: 'Education & EdTech', href: '/#education' },
            { label: 'Our Work', href: '/#work' },
            { label: 'Payment Hub', href: 'http://localhost:3002' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontSize: 14.5,
                fontWeight: 300,
                color: tokens.colors.brandDark,
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 400,
            color: tokens.colors.textMuted,
            cursor: 'pointer',
          }}
          onClick={() => onLanguageChange?.(lang === 'EN' ? 'AR' : 'EN')}
          >
            <span style={{ color: lang === 'AR' ? tokens.colors.brandDark : tokens.colors.textLight, fontWeight: lang === 'AR' ? 600 : 400 }}>AR</span>
            <span style={{ color: 'rgba(20,20,22,0.2)' }}>·</span>
            <span style={{ color: lang === 'EN' ? tokens.colors.brandDark : tokens.colors.textLight, fontWeight: lang === 'EN' ? 600 : 400 }}>EN</span>
          </div>

          <a
            href="mailto:contact@bldr.io"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 40,
              padding: '0 22px',
              borderRadius: 999,
              background: tokens.colors.brandDark,
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 400,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(20,20,22,0.12)',
              transition: 'transform 0.1s ease',
            }}
          >
            Start a project
          </a>
        </div>
      </div>

      {/* Subtle brand gradient progress bar */}
      <div style={{ height: 2, background: 'rgba(20, 20, 22, 0.05)' }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`, width: '100%' }} />
      </div>
    </div>
  );
}

// ─── Main Website Footer (BldrFooter.dc.html) ───────────────────────────────
export function BldrFooter() {
  return (
    <footer style={{ background: tokens.colors.brandDark, color: '#FFFFFF', fontFamily: tokens.fonts.display }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 34px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '44px 40px', alignItems: 'flex-start' }}>
          
          {/* Studio Brand */}
          <div style={{ flex: '1 1 260px', minWidth: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 1 }}>
              bldr
              <span style={{
                background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>.</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 300, lineHeight: 1.68, color: 'rgba(255, 255, 255, 0.6)', maxWidth: 260 }}>
              A venture studio in Cairo. Specialist units, one accountability line.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {['LinkedIn', 'Instagram', 'X'].map((net) => (
                <span key={net} style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  fontSize: 11,
                  color: 'rgba(255, 255, 255, 0.75)',
                }}>
                  {net}
                </span>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div style={{ flex: '0 1 180px', minWidth: 150, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>
              Company
            </div>
            <a href="/#built" style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>How we&apos;re built</a>
            <a href="/#education" style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>Education &amp; EdTech</a>
            <a href="/#work" style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>Our Work</a>
            <a href="http://localhost:3002" style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)', textDecoration: 'none' }}>Payment Hub</a>
          </div>

          {/* Ecosystem Ventures */}
          <div style={{ flex: '0 1 180px', minWidth: 150, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>
              Ecosystem
            </div>
            <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)' }}>bldr Management</span>
            <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)' }}>Tech House</span>
            <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)' }}>Sidekick</span>
            <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)' }}>Career Hub</span>
            <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)' }}>StudyHub</span>
            <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)' }}>منصة الحصة</span>
          </div>

          {/* Legal / Contact */}
          <div style={{ flex: '1 1 280px', minWidth: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>
              Legal &amp; Registration
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 300, lineHeight: 1.72, color: 'rgba(255,255,255,0.82)' }}>
              <div style={{ color: '#FFFFFF', fontWeight: 400 }}>Evolve bldr for Business Management</div>
              <div>Commercial Registration: Cairo, Egypt</div>
              <div>Tax Registration: Licensed Venture Studio</div>
              <div style={{ marginTop: 8 }}>Support: support@bldr.io</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${tokens.colors.gradientStart}, ${tokens.colors.gradientEnd})`, margin: '40px 0 24px' }} />

        {/* Payment and Compliance Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            {['VISA', 'Mastercard', 'Meeza', 'Fawry', 'Geidea'].map((badge) => (
              <span key={badge} style={{
                height: 26,
                padding: '0 10px',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 10.5,
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.7)',
              }}>
                {badge}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} bldr. Operated by Evolve bldr for Business Management.
          </div>
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
