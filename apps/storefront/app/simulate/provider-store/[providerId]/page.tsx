'use client';

import { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { SimulationBanner, formatCurrency } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function ProviderStoreContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const providerId = (params?.providerId as string) || 'techbridge-academy';
  const clickId = searchParams.get('click_id') || '';

  const [amount, setAmount] = useState('299.00');
  const [customerEmail, setCustomerEmail] = useState('student@simulated-store.com');
  const [orderRef, setOrderRef] = useState(`EXT-ORD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Default known seed conversion tokens
  const token = providerId === 'bldr'
    ? 'house_sec_tok_bldr_2024'
    : 'tb_sec_tok_7f9a12c8b4';

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickId) {
      setError('Missing click_id parameter in URL. Please initiate flow from a bldr redirect listing.');
      return;
    }

    setSubmitting(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${API}/tracking/conversions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clickId,
          token,
          amount: parseFloat(amount),
          customerEmail,
          orderRef,
          currency: 'USD',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Conversion postback failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Postback error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F5', display: 'flex', flexDirection: 'column' }}>
      <SimulationBanner message="External Partner Storefront Emulator — Simulation Mode Active" />

      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E4E1DA',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎓</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#14171C' }}>
            {providerId === 'bldr' ? 'bldr Academy Partner Portal' : 'TechBridge Academy Direct Store'}
          </span>
        </div>
        <span className="badge badge-accent">External Partner Site</span>
      </header>

      <main style={{ flex: 1, maxWidth: '680px', margin: '40px auto', padding: '0 24px', width: '100%' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E4E1DA',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 16px rgba(20,23,28,0.04)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#14171C', marginBottom: '8px' }}>
              Simulated Checkout at Partner Store
            </h1>
            <p style={{ fontSize: '14px', color: '#5B6169' }}>
              You were redirected here from bldr. Your referral tracking click ID has been captured below.
            </p>
          </div>

          <div
            style={{
              background: '#F4F1EA',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '13px',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5B6169' }}>Tracking Click ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#14171C' }}>
                {clickId || '⚠️ No click_id provided'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5B6169' }}>Provider Conversion Secret:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#263C8B' }}>
                {token.slice(0, 10)}••••••••
              </span>
            </div>
          </div>

          {result ? (
            <div
              style={{
                background: '#E8F5EE',
                border: '1px solid #C2E4D2',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>✓</div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1F7A4D', marginBottom: '8px' }}>
                Conversion Postback Received!
              </h2>
              <p style={{ fontSize: '14px', color: '#14171C', marginBottom: '16px' }}>
                Order #{result.orderId.slice(-8).toUpperCase()} was created on bldr in state{' '}
                <strong>{result.status}</strong>.
              </p>
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '6px',
                  border: '1px solid #C2E4D2',
                  fontSize: '13px',
                  color: '#5B6169',
                  marginBottom: '20px',
                  textAlign: 'left',
                }}
              >
                🔒 <strong>Anti-Fraud Protection:</strong> The commission has been logged for transparency, but zero payout balance has been credited to the provider yet.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a
                  href={`${process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3002'}/orders`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Go to Admin Portal to Approve & Credit Payout →
                </a>
                <button onClick={() => setResult(null)} className="btn btn-secondary">
                  Test Another Conversion
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCompletePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Purchase Amount ($ USD)</label>
                <input
                  id="sim-amount"
                  className="form-input"
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Email</label>
                <input
                  id="sim-email"
                  className="form-input"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">External Order Ref / Invoice</label>
                <input
                  id="sim-order-ref"
                  className="form-input"
                  type="text"
                  required
                  value={orderRef}
                  onChange={e => setOrderRef(e.target.value)}
                />
              </div>

              {error && (
                <p style={{ color: '#B3402F', background: '#FDF0EE', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>
                  {error}
                </p>
              )}

              <button
                id="btn-complete-sim-purchase"
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {submitting ? 'Triggering Postback…' : `Complete Purchase (${formatCurrency(amount, 'USD')})`}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function FakeProviderStorePage() {
  return (
    <Suspense fallback={<p style={{ padding: '40px', textAlign: 'center' }}>Loading partner store…</p>}>
      <ProviderStoreContent />
    </Suspense>
  );
}
