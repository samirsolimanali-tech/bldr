'use client';

import React from 'react';

export default function EnvironmentBanner() {
  const env = (process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development').toUpperCase();

  const isProd = env === 'PRODUCTION' || env === 'PROD';
  const isStaging = env === 'STAGING';

  const config = isProd
    ? {
        bg: '#1E1B4B',
        color: '#A5B4FC',
        border: '#312E81',
        text: '🔒 ADMIN PORTAL — PRODUCTION ENVIRONMENT — Live Storefront & Studio Changes Apply Instantly',
      }
    : isStaging
    ? {
        bg: '#FEF3C7',
        color: '#92400E',
        border: '#FDE68A',
        text: '⚠️ ADMIN PORTAL — STAGING ENVIRONMENT — Preview & Sandbox Staging Studio',
      }
    : {
        bg: '#FAF5FF',
        color: '#6B21A8',
        border: '#F3E8FF',
        text: '⚙️ ADMIN PORTAL — DEVELOPMENT ENVIRONMENT — Local Workspace Active',
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
