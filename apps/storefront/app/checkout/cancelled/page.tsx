'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutCancelledContent() {
  const params = useSearchParams();
  const returnUrl = params?.get('cancelUrl') || params?.get('cancel_url') || '/products';
  const brand = params?.get('brand') || 'bldr Academy';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, maxWidth: 500, width: '100%', padding: '36px 32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
        
        {/* Cancelled Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F1F5F9', border: '4px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#64748B', fontSize: 24 }}>
          ↩
        </div>

        <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B', background: '#F1F5F9', padding: '3px 10px', borderRadius: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Checkout Cancelled
        </span>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '12px 0 8px' }}>
          You Cancelled Your Checkout Session
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px', lineHeight: 1.5 }}>
          No funds were deducted from your account. You can return to <strong>{brand}</strong> at any time to resume enrollment.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href={returnUrl}
            style={{ display: 'block', background: '#0F172A', color: '#FFFFFF', padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
          >
            Return to {brand} &rarr;
          </a>
          <Link
            href="/products"
            style={{ display: 'block', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', padding: '10px 20px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}
          >
            Browse Other Courses
          </Link>
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid #F1F5F9', paddingTop: 16, fontSize: 11, color: '#94A3B8' }}>
          bldr Technologies LLC — Merchant of Record.
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelledPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutCancelledContent />
    </Suspense>
  );
}
