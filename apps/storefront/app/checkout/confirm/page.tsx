'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { SimulationBanner } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const POLL_INTERVAL = 3000;
const MAX_POLLS = 20; // 60s max

function CheckoutConfirmContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState<'polling' | 'paid' | 'failed' | 'not_found'>('polling');
  const [order, setOrder] = useState<any>(null);
  const [isSim, setIsSim] = useState(true);
  const pollCount = useRef(0);

  useEffect(() => {
    fetch(`${API}/config`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setIsSim(d.paymentSimulationMode); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!orderId) { setStatus('not_found'); return; }

    const poll = async () => {
      try {
        const res = await fetch(`${API}/orders/${orderId}/status`);
        if (!res.ok) { setStatus('not_found'); return; }
        const data = await res.json();
        setOrder(data);

        if (data.status === 'PAID') {
          setStatus('paid');
          return;
        }
        if (data.status === 'FAILED') {
          setStatus('failed');
          return;
        }

        pollCount.current += 1;
        if (pollCount.current >= MAX_POLLS) {
          setStatus('failed');
          return;
        }

        setTimeout(poll, POLL_INTERVAL);
      } catch {
        setStatus('not_found');
      }
    };

    poll();
  }, [orderId]);

  return (
    <>
      {isSim && <SimulationBanner message="Simulation mode active — order settled via simulated webhook" />}
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>

      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        {status === 'polling' && (
          <div className="fade-up">
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(124,58,237,0.2)', border: '3px solid var(--accent-500)',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px',
            }} />
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
              Confirming your payment…
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Please wait while we confirm your order. This can take up to 60 seconds.
            </p>
          </div>
        )}

        {status === 'paid' && order && (
          <div className="fade-up">
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(34,197,94,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '40px', margin: '0 auto 24px',
            }}>
              ✅
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>
              Payment Confirmed!
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your order <strong style={{ color: 'var(--text-primary)' }}>{order.id.slice(-8).toUpperCase()}</strong> has been confirmed.
              A confirmation will be visible in your order history.
            </p>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left',
            }}>
              {[
                { label: 'Order ID', value: order.id.slice(-8).toUpperCase() },
                { label: 'Amount', value: `${order.currency} ${Number(order.amount).toFixed(2)}` },
                { label: 'Email', value: order.customerEmail },
                { label: 'Status', value: '✅ Paid' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                  fontSize: '14px',
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <Link href="/browse" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              Continue Browsing
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="fade-up">
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '40px', margin: '0 auto 24px',
            }}>
              ❌
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
              Payment not confirmed
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We couldn't confirm your payment. If you were charged, please contact support with order ID: <strong>{orderId?.slice(-8).toUpperCase()}</strong>
            </p>
            <Link href="/browse" className="btn btn-secondary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              Back to Browse
            </Link>
          </div>
        )}

        {status === 'not_found' && (
          <div className="fade-up">
            <p style={{ color: 'var(--text-muted)' }}>Order not found.</p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>Home</Link>
          </div>
        )}
      </div>
    </main>
    </>
  );
}

export default function CheckoutConfirmPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(124,58,237,0.2)', border: '3px solid var(--accent-500)',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px',
          }} />
        </main>
      }>
        <CheckoutConfirmContent />
      </Suspense>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Footer />
    </>
  );
}
