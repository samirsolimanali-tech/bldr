'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const orderId = params?.get('orderId') || params?.get('order_id') || 'ORD-982104';
  const amount = params?.get('amount') || '1,250.00';
  const returnUrl = params?.get('returnUrl') || params?.get('return_url') || '/products';
  const brand = params?.get('brand') || 'bldr Academy';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, maxWidth: 520, width: '100%', padding: '36px 32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
        
        {/* Success Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', border: '4px solid #F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#16A34A', fontSize: 28 }}>
          ✓
        </div>

        <span style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '3px 10px', borderRadius: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Payment Confirmed
        </span>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '12px 0 8px' }}>
          Thank You! Your Payment Succeeded
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px', lineHeight: 1.5 }}>
          Your payment was processed securely. An authenticated webhook has been dispatched to <strong>{brand}</strong> to activate your course enrollment immediately.
        </p>

        {/* Order Details Card */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', textAlign: 'left', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ color: '#64748B', fontWeight: 500 }}>Transaction Reference</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ color: '#64748B', fontWeight: 500 }}>Amount Paid</span>
            <span style={{ fontWeight: 800, color: '#0F172A' }}>EGP {amount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ color: '#64748B', fontWeight: 500 }}>Merchant of Record</span>
            <span style={{ fontWeight: 600, color: '#0F172A' }}>bldr Technologies LLC</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ color: '#64748B', fontWeight: 500 }}>Status</span>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>Settled</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href={returnUrl}
            style={{ display: 'block', background: '#2E6F5E', color: '#FFFFFF', padding: '12px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'background 0.15s ease' }}
          >
            Return to {brand} &rarr;
          </a>
          <button
            onClick={() => window.print()}
            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', padding: '10px 20px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Download Official Receipt (PDF)
          </button>
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid #F1F5F9', paddingTop: 16, fontSize: 11, color: '#94A3B8' }}>
          Payments processed by authorized gateways (Geidea / Paymob / Fawry), PCI-DSS certified.
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
