import React from 'react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const tokens = {
  colors: {
    background: '#FAF9F5',
    surface: '#FFFFFF',
    ink: '#14171C',
    inkMuted: '#5B6169',
    border: '#E4E1DA',
    borderFocus: '#263C8B',
    brand: '#263C8B',
    brandHover: '#1D2E6B',
    accent: '#E08A3E',
    success: '#1F7A4D',
    successBg: '#E8F5EE',
    warning: '#B8790A',
    warningBg: '#FEF6E7',
    danger: '#B3402F',
    dangerBg: '#FDF0EE',
  },
  fonts: {
    display: "'Fraunces', Georgia, serif",
    sans: "'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
};

// ─── Format Currency Helper ───────────────────────────────────────────────────
export function formatCurrency(amount: number | string, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0.00';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency.toUpperCase()} ${num.toFixed(2)}`;
  }
}

// ─── KPI Stat Component ───────────────────────────────────────────────────────
export interface KpiStatProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  helper?: string;
  currency?: string;
  isCurrency?: boolean;
}

export const KpiStat: React.FC<KpiStatProps> = ({
  label,
  value,
  delta,
  deltaType = 'neutral',
  helper,
  currency,
  isCurrency = false,
}) => {
  const displayVal = isCurrency && typeof value === 'number'
    ? formatCurrency(value, currency || 'USD')
    : value;

  const deltaColors = {
    positive: { bg: tokens.colors.successBg, text: tokens.colors.success },
    negative: { bg: tokens.colors.dangerBg, text: tokens.colors.danger },
    neutral: { bg: '#F2F0EB', text: tokens.colors.inkMuted },
  }[deltaType];

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxShadow: '0 1px 3px rgba(20,23,28,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: tokens.colors.inkMuted,
          }}
        >
          {label}
        </span>
        {delta && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '999px',
              background: deltaColors.bg,
              color: deltaColors.text,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {delta}
          </span>
        )}
      </div>

      <div
        className="tabular-nums"
        style={{
          fontSize: '26px',
          fontWeight: 700,
          color: tokens.colors.ink,
          fontFamily: tokens.fonts.display,
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayVal}
      </div>

      {helper && (
        <span
          style={{
            fontSize: '12px',
            color: tokens.colors.inkMuted,
            marginTop: '2px',
          }}
        >
          {helper}
        </span>
      )}
    </div>
  );
};

// ─── Trust Line Component ─────────────────────────────────────────────────────
export interface TrustLineProps {
  gatewayName?: string;
  note?: string;
}

export const TrustLine: React.FC<TrustLineProps> = ({
  gatewayName = 'Geidea & Fawry',
  note = '256-bit encrypted checkout · Direct settlement',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '12px',
        color: tokens.colors.inkMuted,
        padding: '10px 12px',
        borderRadius: '6px',
        background: 'rgba(38, 60, 139, 0.04)',
        border: '1px solid rgba(38, 60, 139, 0.1)',
        marginTop: '12px',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={tokens.colors.brand}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span>
        Secured by <strong>{gatewayName}</strong> · {note}
      </span>
    </div>
  );
};

// ─── Button ──────────────────────────────────────────────────────────────────
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: 'all 0.15s ease',
    border: '1px solid transparent',
    fontFamily: tokens.fonts.sans,
    textDecoration: 'none',
    boxSizing: 'border-box',
    ...style,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px', height: '32px' },
    md: { padding: '9px 18px', fontSize: '14px', height: '40px' },
    lg: { padding: '13px 26px', fontSize: '16px', height: '48px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: tokens.colors.brand,
      color: '#ffffff',
      borderColor: tokens.colors.brand,
    },
    secondary: {
      background: tokens.colors.surface,
      color: tokens.colors.ink,
      borderColor: tokens.colors.border,
    },
    accent: {
      background: tokens.colors.accent,
      color: '#ffffff',
      borderColor: tokens.colors.accent,
    },
    danger: {
      background: tokens.colors.danger,
      color: '#ffffff',
      borderColor: tokens.colors.danger,
    },
    ghost: {
      background: 'transparent',
      color: tokens.colors.ink,
      borderColor: 'transparent',
    },
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] }}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  style,
  ...props
}) => {
  return (
    <div
      style={{
        background: tokens.colors.surface,
        borderRadius: '8px',
        border: `1px solid ${tokens.colors.border}`,
        padding: '24px',
        boxShadow: '0 1px 3px rgba(20,23,28,0.03)',
        ...style,
      }}
      {...props}
    >
      {title && (
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            fontFamily: tokens.fonts.display,
            color: tokens.colors.ink,
          }}
        >
          {title}
        </h3>
      )}
      {subtitle && (
        <p
          style={{
            margin: '4px 0 16px',
            color: tokens.colors.inkMuted,
            fontSize: '13px',
          }}
        >
          {subtitle}
        </p>
      )}
      <div>{children}</div>
      {footer && (
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: `1px solid ${tokens.colors.border}`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'brand' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  style,
  ...props
}) => {
  const colorMap = {
    success: { bg: tokens.colors.successBg, text: tokens.colors.success, border: '#C2E4D2' },
    warning: { bg: tokens.colors.warningBg, text: tokens.colors.warning, border: '#F6DFB5' },
    danger: { bg: tokens.colors.dangerBg, text: tokens.colors.danger, border: '#F8CCC5' },
    brand: { bg: '#EDF1FA', text: tokens.colors.brand, border: '#CCD8F5' },
    neutral: { bg: '#F2F0EB', text: tokens.colors.inkMuted, border: tokens.colors.border },
  };

  const scheme = colorMap[variant] || colorMap.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: scheme.bg,
        color: scheme.text,
        border: `1px solid ${scheme.border}`,
        lineHeight: 1.2,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

// ─── Input ───────────────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, hint, style, id, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: tokens.colors.ink,
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '6px',
          border: error ? `1px solid ${tokens.colors.danger}` : `1px solid ${tokens.colors.border}`,
          background: tokens.colors.surface,
          color: tokens.colors.ink,
          fontFamily: tokens.fonts.sans,
          fontSize: '14px',
          boxSizing: 'border-box',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
      {hint && !error && (
        <span style={{ color: tokens.colors.inkMuted, fontSize: '12px' }}>{hint}</span>
      )}
      {error && (
        <span style={{ color: tokens.colors.danger, fontSize: '12px' }}>{error}</span>
      )}
    </div>
  );
};

// ─── Modal ───────────────────────────────────────────────────────────────────
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 23, 28, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: tokens.colors.surface,
          borderRadius: '10px',
          maxWidth: '520px',
          width: '90%',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 20px 40px -10px rgba(20, 23, 28, 0.15)',
          border: `1px solid ${tokens.colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: `1px solid ${tokens.colors.border}`,
            paddingBottom: '12px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontFamily: tokens.fonts.display,
              color: tokens.colors.ink,
              fontWeight: 700,
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: tokens.colors.inkMuted,
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dims = { sm: 16, md: 24, lg: 32 }[size];
  return (
    <svg
      width={dims}
      height={dims}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'bldr-spin 1s linear infinite' }}
    >
      <style>{`@keyframes bldr-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

// ─── Simulation Banner ────────────────────────────────────────────────────────
export interface SimulationBannerProps {
  message?: string;
  style?: React.CSSProperties;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({
  message = 'Simulation mode — no real payments are being processed',
  style,
}) => {
  return (
    <div
      style={{
        background: '#FEF6E7',
        borderBottom: '1px solid #F6DFB5',
        color: '#B8790A',
        padding: '9px 16px',
        fontSize: '13px',
        fontWeight: 600,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        letterSpacing: '0.01em',
        ...style,
      }}
    >
      <span style={{ fontSize: '15px' }}>⚠️</span>
      <span>{message}</span>
    </div>
  );
};

// ─── Simulated Payment Modal ─────────────────────────────────────────────────
export interface SimulatedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number | string;
  currency?: string;
  gatewayName?: string;
  onSimulateSuccess: () => Promise<void>;
  onSimulateFailure: () => Promise<void>;
  isLoading?: boolean;
}

export const SimulatedPaymentModal: React.FC<SimulatedPaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
  currency = 'USD',
  gatewayName = 'Geidea Payment Gateway',
  onSimulateSuccess,
  onSimulateFailure,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Simulated Payment Checkout">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            background: '#FEF6E7',
            border: '1px solid #F6DFB5',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '13px',
            color: '#B8790A',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
          <div>
            <strong>Payment Simulation Active:</strong> No real cards or bank credentials will be charged.
            Clicking simulated actions will construct an authentic signed HMAC-SHA256 webhook that exercises the full verification pipeline.
          </div>
        </div>

        <div
          style={{
            background: tokens.colors.background,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: tokens.colors.inkMuted }}>
            <span>Order Reference</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{orderId.slice(-8).toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: tokens.colors.inkMuted }}>
            <span>Simulated Gateway</span>
            <span style={{ fontWeight: 600, color: tokens.colors.brand }}>{gatewayName}</span>
          </div>
          <div
            style={{
              borderTop: `1px dashed ${tokens.colors.border}`,
              paddingTop: '8px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.ink }}>Total Amount</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '22px',
                fontWeight: 700,
                fontFamily: tokens.fonts.display,
                color: tokens.colors.ink,
              }}
            >
              {formatCurrency(amount, currency)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onSimulateSuccess}
            isLoading={isLoading}
            style={{ background: tokens.colors.success, borderColor: tokens.colors.success }}
          >
            ✓ Simulate Success (Mark Paid & Settle)
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={onSimulateFailure}
            disabled={isLoading}
          >
            ✕ Simulate Payment Failure
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel Transaction
          </Button>
        </div>
      </div>
    </Modal>
  );
};

