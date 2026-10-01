'use client';

import React from 'react';

export default function EnvironmentBanner() {
  const env = (process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development').toUpperCase();

  const isProd = env === 'PRODUCTION' || env === 'PROD';
  const isStaging = env === 'STAGING';

  const config = isProd
    ? {
        bg: '#0F172A',
        color: '#38BDF8',
        border: '#1E293B',
        text: '🔒 HUB PRODUCTION ENVIRONMENT — Authoritative Financial Operations & Live Acquiring Rails Active',
      }
    : isStaging
    ? {
        bg: '#FEF3C7',
        color: '#92400E',
        border: '#FDE68A',
        text: '⚠️ HUB STAGING ENVIRONMENT — Test Disbursals & Simulated Gateway Terminals',
      }
    : {
        bg: '#F1F5F9',
        color: '#475569',
        border: '#E2E8F0',
        text: '⚙️ HUB LOCAL DEV / TEST ENVIRONMENT — Dual-Control Dual-Actor Required',
      };

  return (
    <div
      style={{
        background: config.bg,
        color: config.color,
        borderBottom: `1px solid ${config.border}`,
        padding: '5px 16px',
        fontSize: '11.5px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 9999,
        position: 'relative',
      }}
    >
      <span>{config.text}</span>
    </div>
  );
}
