'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SimulationBanner, formatCurrency } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function FakeFawryCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    fetch(`${API}/orders/${orderId}/status`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        setOrder(d);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load order details');
        setLoading(false);
      });
  }, [orderId]);

  const handlePay = async () => {
    setProcessing(true);
    setError('');
    try {
      const res = await fetch(`${API}/simulation/fawry/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'PAID' }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/checkout/confirm?order_id=${orderId}`);
      } else {
        throw new Error(data.error || 'Simulated payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment simulation error');
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    setProcessing(true);
    try {
      await fetch(`${API}/simulation/fawry/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'FAILED' }),
      });
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA', display: 'flex', flexDirection: 'column' }}>
      <SimulationBanner message="Fawry Payment Gateway Emulator — Simulation Mode Active" />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Fawry styled Header */}
          <div
            style={{
              background: '#023E8A',
              color: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFB703' }}>
                FAWRY PAY <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 500 }}>(Simulated)</span>
              </div>
              <div style={{ fontSize: '12px', color: '#E0E7FF', marginTop: '2px' }}>
                Secure Hosted Payment Gateway
              </div>
            </div>
            <span
              style={{
                background: 'rgba(255, 183, 3, 0.2)',
                color: '#FFB703',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 183, 3, 0.4)',
              }}
            >
              Sandbox
            </span>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: '#FEF6E7',
                border: '1px solid #F6DFB5',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#B8790A',
              }}
            >
              <strong>Notice:</strong> This emulator represents Fawry’s hosted checkout redirect.
              Clicking <em>Pay with Fawry</em> computes a genuine SHA256-signed Fawry IPN callback and posts it directly to bldr’s webhook receiver.
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>Loading transaction…</p>
            ) : order ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B' }}>
                  <span>Order Reference</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1E293B' }}>
                    #{orderId.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B' }}>
                  <span>Merchant</span>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{order.provider?.name || 'bldr Marketplace'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B' }}>
                  <span>Service</span>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{order.listing?.title || 'Service Listing'}</span>
                </div>

                <div
                  style={{
                    borderTop: '1px dashed #CBD5E1',
                    paddingTop: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>Amount Due</span>
                  <span
                    className="tabular-nums"
                    style={{ fontSize: '24px', fontWeight: 800, color: '#023E8A' }}
                  >
                    {formatCurrency(order.amount, order.currency || 'USD')}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ color: '#EF4444', fontSize: '14px' }}>{error || 'Order not found'}</p>
            )}

            {error && (
              <p style={{ color: '#EF4444', fontSize: '13px', background: '#FEE2E2', padding: '8px 12px', borderRadius: '6px' }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <button
                id="btn-fawry-pay-simulate"
                onClick={handlePay}
                disabled={processing || loading}
                style={{
                  background: '#023E8A',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'background 0.15s ease',
                  opacity: processing ? 0.7 : 1,
                }}
              >
                {processing ? 'Processing SHA256 Signature…' : '✓ Pay with Fawry (Simulate)'}
              </button>

              <button
                id="btn-fawry-cancel"
                onClick={handleCancel}
                disabled={processing}
                style={{
                  background: 'transparent',
                  color: '#64748B',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid #CBD5E1',
                }}
              >
                Cancel and return to store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
