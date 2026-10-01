'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function CheckoutPendingContent() {
  const params = useSearchParams();
  const fawryCode = params?.get('fawryCode') || params?.get('code') || '982 109 4481';
  const amount = params?.get('amount') || '1,250.00';
  const orderId = params?.get('orderId') || params?.get('order_id') || 'FW-ORD-77192';
  const expiresAt = params?.get('expiresAt') || '48 hours';
  const brand = params?.get('brand') || 'bldr Academy';

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fawryCode.replace(/\s+/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello! Here is your Fawry payment code for ${brand}:\n\n` +
    `🔢 Fawry Code: ${fawryCode}\n` +
    `💰 Amount: EGP ${amount}\n` +
    `⏳ Valid for: ${expiresAt}\n\n` +
    `Visit any Fawry retail kiosk or yellow POS machine and ask for "Fawry Pay" to complete payment.`
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, maxWidth: 540, width: '100%', padding: '36px 32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
        
        {/* Yellow Fawry Clock Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEF3C7', border: '4px solid #FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#B45309', fontSize: 28 }}>
          ⚡
        </div>

        <span style={{ fontSize: 11, fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '3px 10px', borderRadius: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Payment Pending Kiosk Deposit
        </span>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '12px 0 8px' }}>
          Fawry Pay Reference Code Generated
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px', lineHeight: 1.5 }}>
          Your payment code is ready. Complete cash deposit at any authorized Egyptian retail kiosk or POS terminal before expiration.
        </p>

        {/* Big Fawry Code Card */}
        <div style={{ background: '#FFFBEB', border: '2px dashed #F59E0B', borderRadius: 14, padding: '20px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Fawry Reference Number (رقم دفع فوري)
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 32, fontWeight: 900, color: '#78350F', letterSpacing: '0.08em', margin: '6px 0' }}>
            {fawryCode}
          </div>
          <div style={{ fontSize: 12, color: '#B45309', fontWeight: 600 }}>
            Amount Due: <strong>EGP {amount}</strong> · Valid for {expiresAt}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              onClick={handleCopy}
              style={{ flex: 1, height: 40, background: '#D97706', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy Fawry Code'}
            </button>
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, height: 40, background: '#16A34A', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              💬 Send to WhatsApp
            </a>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', textAlign: 'left', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1E293B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            How to Pay at Any Fawry Merchant:
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#475569', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Visit any grocery store, kiosk, or pharmacy with a <strong>Fawry (فوري)</strong> logo.</li>
            <li>Tell the merchant you want to pay a <strong>&quot;Fawry Pay (فوري باي)&quot;</strong> service code.</li>
            <li>Provide your 10-digit payment code: <strong>{fawryCode}</strong>.</li>
            <li>Pay the exact amount: <strong>EGP {amount}</strong> in cash and request your printed receipt.</li>
            <li>Once paid, your enrollment in <strong>{brand}</strong> activates automatically.</li>
          </ol>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
          <span style={{ fontSize: 11.5, color: '#64748B' }}>Order Ref: <strong style={{ color: '#0F172A' }}>{orderId}</strong></span>
          <Link
            href="/products"
            style={{ fontSize: 12, fontWeight: 700, color: '#2E6F5E', textDecoration: 'none' }}
          >
            Return to Storefront &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutPendingContent />
    </Suspense>
  );
}
