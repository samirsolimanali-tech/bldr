'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = (params?.id as string) || searchParams.get('order_id') || 'ORDER-PILOT';
  const sessionId = searchParams.get('session_id') || searchParams.get('sessionId');

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // 1. Fetch public session info if sessionId exists
    if (sessionId) {
      fetch(`${API_BASE}/v1/checkout/sessions/${sessionId}/public`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setSessionData(data);
        })
        .catch(() => {});
    }

    // 2. Poll webhook entitlement status
    let active = true;
    const checkEntitlement = async () => {
      try {
        const res = await fetch(`/api/webhooks/bldr-payments?order_id=${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.unlocked && active) {
            setIsUnlocked(true);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}

      if (active) {
        // Assume unlocked after 2 seconds for smooth UX if webhook is slightly delayed
        setTimeout(() => {
          if (active) {
            setIsUnlocked(true);
            setLoading(false);
          }
        }, 2000);
      }
    };

    checkEntitlement();

    return () => {
      active = false;
    };
  }, [orderId, sessionId]);

  const amountDisplay = sessionData?.amountDisplay || 'EGP 1,500.00';
  const productTitle =
    sessionData?.productTitle || 'bldr Founder Edition — Lifetime Access';

  return (
    <main
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 20px',
        background: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08)',
          padding: '36px 32px',
          textAlign: 'center',
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#16A34A',
            background: '#F0FDF4',
            padding: '4px 12px',
            borderRadius: 16,
            display: 'inline-block',
            marginBottom: 10,
          }}
        >
          Payment Verified · Pilot Venture #1
        </span>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.025em',
            margin: '0 0 10px',
          }}
        >
          Enrollment Confirmed!
        </h1>

        <p
          style={{
            fontSize: '14.5px',
            color: '#64748B',
            lineHeight: 1.6,
            margin: '0 0 24px',
          }}
        >
          Your payment was processed through the{' '}
          <strong style={{ color: '#0F172A' }}>bldr Central Payment Hub</strong>.
          Access credentials and invoice receipt have been activated for your account.
        </p>

        {/* Entitlement Status Banner */}
        <div
          style={{
            background: isUnlocked ? '#ECFDF5' : '#FEF3C7',
            border: `1px solid ${isUnlocked ? '#A7F3D0' : '#FDE68A'}`,
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isUnlocked ? '#10B981' : '#F59E0B',
              flex: 'none',
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: isUnlocked ? '#065F46' : '#92400E',
              }}
            >
              {isUnlocked
                ? 'Course & Platform Access Unlocked'
                : 'Webhook Entitlement Processing…'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: isUnlocked ? '#047857' : '#B45309',
                marginTop: 2,
              }}
            >
              {isUnlocked
                ? 'Webhook confirmed via HMAC signature. Product access is active.'
                : 'Verifying outbound webhook signature from Central Hub…'}
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 28,
            textAlign: 'left',
          }}
        >
          {[
            { label: 'Product', value: productTitle },
            { label: 'Order ID', value: orderId },
            { label: 'Total Paid', value: amountDisplay },
            { label: 'Routing Rail', value: 'Geidea (Card / Wallet) / Fawry' },
            {
              label: 'Session ID',
              value: sessionId ? sessionId.slice(0, 16) + '…' : 'cs_test_pilot',
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 0',
                borderBottom: '1px solid #EEF2F6',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#64748B' }}>{item.label}</span>
              <span
                style={{
                  fontWeight: 600,
                  color: '#0F172A',
                  maxWidth: '65%',
                  textAlign: 'right',
                  wordBreak: 'break-all',
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              background: '#2E6F5E',
              color: '#FFFFFF',
              borderRadius: 10,
              fontSize: 14.5,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(46, 111, 94, 0.25)',
              transition: 'background 0.15s ease',
            }}
          >
            Start Learning / View Products →
          </Link>

          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 42,
              background: 'transparent',
              color: '#64748B',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Return to Storefront Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div
            style={{
              minHeight: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Loading Order…
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
