'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutFailedContent() {
  const params = useSearchParams();
  const orderId = params?.get('orderId') || params?.get('order_id') || 'ORD-REQ-FAILED';
  const reason = params?.get('reason') || 'Transaction declined by issuing bank or authentication timed out.';
  const retryUrl = params?.get('retryUrl') || params?.get('retry_url') || '/products';
  const brand = params?.get('brand') || 'bldr Academy';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, maxWidth: 520, width: '100%', padding: '36px 32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
        
        {/* Failure Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', border: '4px solid #FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#DC2626', fontSize: 26, fontWeight: 900 }}>
          ✕
        </div>

        <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '3px 10px', borderRadius: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Payment Unsuccessful
        </span>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '12px 0 8px' }}>
          We Couldn&apos;t Process Your Payment
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px', lineHeight: 1.5 }}>
          Your bank card or wallet was not charged. Please review the reason below and try again or choose an alternate payment rail.
        </p>

        {/* Failure Reason Card */}
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', textAlign: 'left', marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', marginBottom: 4 }}>
            Decline Reason / Gateway Code
          </div>
          <div style={{ fontSize: 13, color: '#7F1D1D', fontWeight: 600 }}>
            {reason}
          </div>
          <div style={{ fontSize: 11, color: '#991B1B', marginTop: 6, fontFamily: 'monospace' }}>
            Reference: {orderId}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href={retryUrl}
            style={{ display: 'block', background: '#2E6F5E', color: '#FFFFFF', padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
          >
            Retry Payment &rarr;
          </a>
          <Link
            href="/contact"
            style={{ display: 'block', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', padding: '10px 20px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}
          >
            Contact Admissions / Support Desk
          </Link>
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid #F1F5F9', paddingTop: 16, fontSize: 11, color: '#94A3B8' }}>
          Payments processed by authorized gateways (Geidea / Paymob / Fawry), PCI-DSS certified.
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutFailedContent />
    </Suspense>
  );
}
