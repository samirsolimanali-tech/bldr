'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function HubPayRedirect() {
  const params = useParams();
  const linkId = params?.linkId as string;

  useEffect(() => {
    const targetBase = process.env.NEXT_PUBLIC_CHECKOUT_DOMAIN || 'https://pay.bldrmanagement.com';
    const targetUrl = linkId ? `${targetBase}/pay/${linkId}` : targetBase;
    window.location.replace(targetUrl);
  }, [linkId]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#F8FAFC',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '24px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 6 }}>
          Redirecting to Unified BLDR Checkout
        </div>
        <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>
          Payment links resolve via the centralized payment service at pay.bldrmanagement.com...
        </p>
      </div>
    </div>
  );
}
