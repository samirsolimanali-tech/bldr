'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function RegisterRedirectPage() {
  const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000';

  useEffect(() => {
    // Redirect to canonical brand partnership application on the storefront
    window.location.href = `${storefrontUrl}/apply-provider`;
  }, [storefrontUrl]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: 36,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <span style={{ fontSize: 32 }}>🏛️</span>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '16px 0 8px' }}>
          Brand Partnership Intake
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, margin: '0 0 24px' }}>
          Brand onboarding on bldr infrastructure is consolidated under the canonical platform intake form. Redirecting you now...
        </p>
        <a
          href={`${storefrontUrl}/apply-provider`}
          style={{
            display: 'inline-block',
            background: '#2E6F5E',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Go to Application Form →
        </a>
      </div>
    </div>
  );
}
