'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutExpiredContent() {
  const params = useSearchParams();
  const brand = params?.get('brand') || 'bldr Academy';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, maxWidth: 500, width: '100%', padding: '36px 32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
        
        {/* Expired Clock Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEF3C7', border: '4px solid #FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#B45309', fontSize: 26 }}>
          ⏳
        </div>

        <span style={{ fontSize: 11, fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '3px 10px', borderRadius: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Session Expired
        </span>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '12px 0 8px' }}>
          Your Checkout Session Has Expired
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px', lineHeight: 1.5 }}>
          To protect your payment security, checkout sessions automatically expire after 30 minutes of inactivity. No charges have been made.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/products"
            style={{ display: 'block', background: '#2E6F5E', color: '#FFFFFF', padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
          >
            Start New Checkout Session &rarr;
          </Link>
          <Link
            href="/contact"
            style={{ display: 'block', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', padding: '10px 20px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}
          >
            Need Help? Contact Support
          </Link>
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid #F1F5F9', paddingTop: 16, fontSize: 11, color: '#94A3B8' }}>
          bldr Technologies LLC — Merchant of Record.
        </div>
      </div>
    </div>
  );
}

export default function CheckoutExpiredPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutExpiredContent />
    </Suspense>
  );
}
