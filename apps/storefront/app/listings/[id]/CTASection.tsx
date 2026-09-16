'use client';

import { useState, useEffect } from 'react';
import { TrustLine, formatCurrency, SimulationBanner, SimulatedPaymentModal } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GEIDEA_JS = process.env.NEXT_PUBLIC_GEIDEA_JS_URL || 'https://checkout-demo.geidea.net/geideaCheckout.min.js';

declare global {
  interface Window {
    payment?: {
      startPayment: (config: {
        sessionId: string;
        onSuccess: (d: unknown) => void;
        onError: (e: unknown) => void;
        onCancel: () => void;
      }) => void;
    };
  }
}

interface Props {
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    purchaseType: string;
    engagementType: string;
    providerId: string;
    redirectUrl?: string;
  };
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (err) => reject(err);
    document.body.appendChild(s);
  });
}

export function BuyNowButton({ listing }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [isSimMode, setIsSimMode] = useState(true);
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState('');
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/config`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d && typeof d.paymentSimulationMode === 'boolean') {
          setIsSimMode(d.paymentSimulationMode);
        }
      })
      .catch(() => {});
  }, []);

  const handleCheckout = async () => {
    if (!email) { setShowForm(true); return; }

    setState('loading');
    setError('');

    let createdOrderId = '';

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, customerEmail: email, customerName: name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create order');
      }

      const { orderId, checkoutResult, geideaJsSdkUrl } = await res.json();
      createdOrderId = orderId;
      setActiveOrderId(orderId);

      if (checkoutResult.type === 'session_id') {
        if (isSimMode) {
          // Simulation mode active: open simulated modal
          setSimModalOpen(true);
          setState('idle');
          return;
        }

        // ─── Real Modal Default Path ─────────────────────────────────────
        try {
          await loadScript(geideaJsSdkUrl || GEIDEA_JS);
          if (!window.payment) {
            throw new Error('Geidea payment modal SDK could not be initialized');
          }

          window.payment.startPayment({
            sessionId: checkoutResult.value,
            onSuccess: () => {
              window.location.href = `/checkout/confirm?order_id=${orderId}`;
            },
            onError: async (e) => {
              console.warn('[Checkout Fallback] Modal payment error encountered:', e);
              await triggerFallback(orderId);
            },
            onCancel: () => {
              setState('idle');
            },
          });
          setState('idle');
        } catch (sdkError: any) {
          console.warn('[Checkout Fallback] Modal SDK failed to load or initialize. Falling back to hosted redirect.', sdkError);
          await triggerFallback(orderId);
        }
      } else if (checkoutResult.type === 'redirect_url') {
        // Hosted gateway link (real or simulated Fawry page)
        window.location.href = checkoutResult.value;
      }
    } catch (err: any) {
      console.error('[Checkout Error]', err);
      setState('error');
      setError(err.message || 'Something went wrong');
    }
  };

  const handleSimulateSuccess = async () => {
    setSimLoading(true);
    try {
      const res = await fetch(`${API}/simulation/geidea/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrderId, status: 'paid' }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/checkout/confirm?order_id=${activeOrderId}`;
      } else {
        throw new Error(data.error || 'Simulation trigger failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to simulate payment');
      setSimModalOpen(false);
      setSimLoading(false);
    }
  };

  const handleSimulateFailure = async () => {
    setSimLoading(true);
    try {
      await fetch(`${API}/simulation/geidea/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrderId, status: 'failed' }),
      });
      setSimModalOpen(false);
      setSimLoading(false);
      setError('Simulated payment failed as requested. Order marked FAILED.');
    } catch (err: any) {
      setError(err.message || 'Failed to simulate payment failure');
      setSimModalOpen(false);
      setSimLoading(false);
    }
  };

  const triggerFallback = async (orderId: string) => {
    try {
      const fbRes = await fetch(`${API}/orders/${orderId}/fallback-redirect`, {
        method: 'POST',
      });
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        if (fbData.redirectUrl) {
          console.log('[Checkout Fallback] Redirecting to fallback payment page:', fbData.redirectUrl);
          window.location.href = fbData.redirectUrl;
          return;
        }
      }
    } catch (fbErr) {
      console.error('[Checkout Fallback] Fallback redirect request failed:', fbErr);
    }
    setState('error');
    setError('Interactive checkout modal was unavailable. Please try again or use direct checkout.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {isSimMode && (
        <SimulationBanner message="Simulation mode active — no real payments processed" />
      )}

      {/* Restrained Fintech Price Line-Item Summary */}
      <div
        style={{
          background: 'var(--bg-canvas)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span>Service Base</span>
          <span className="tabular-nums">{formatCurrency(listing.price, listing.currency)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span>Platform Processing</span>
          <span className="tabular-nums" style={{ color: 'var(--success)' }}>Free</span>
        </div>
        <div
          style={{
            borderTop: '1px dashed var(--border)',
            paddingTop: '8px',
            marginTop: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Due</span>
          <span
            className="tabular-nums"
            style={{
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
            }}
          >
            {formatCurrency(listing.price, listing.currency)}
          </span>
        </div>
      </div>

      {showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              id="checkout-name"
              className="form-input"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              id="checkout-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {error && <p style={{ color: 'var(--danger)', fontSize: '13px' }}>{error}</p>}

      <button
        id="btn-buy-now"
        className="btn btn-primary btn-lg"
        style={{ width: '100%' }}
        onClick={handleCheckout}
        disabled={state === 'loading'}
      >
        {state === 'loading' ? '⏳ Preparing Secure Checkout…' : showForm ? '🔒 Complete Payment' : 'Enroll Now'}
      </button>

      {!showForm && (
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Instant access · Secure card & digital wallet payments
        </p>
      )}

      <TrustLine gatewayName="Geidea & Fawry" note="256-bit encrypted checkout" />

      <SimulatedPaymentModal
        isOpen={simModalOpen}
        onClose={() => setSimModalOpen(false)}
        orderId={activeOrderId}
        amount={listing.price}
        currency={listing.currency}
        gatewayName="Geidea Modal (Simulated)"
        onSimulateSuccess={handleSimulateSuccess}
        onSimulateFailure={handleSimulateFailure}
        isLoading={simLoading}
      />
    </div>
  );
}

export function LeadForm({ listing }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          ...form,
          engagementType: listing.engagementType,
        }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div style={{
        padding: '24px',
        background: 'var(--success-bg)',
        border: '1px solid var(--success)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
        <p style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>Inquiry Submitted</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Our team and provider will review your requirements and respond within 24 hours.
        </p>
      </div>
    );
  }

  const isBookCall = listing.engagementType === 'BOOK_CALL';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px', color: 'var(--text-primary)' }}>
        {isBookCall ? 'Book a Discovery Call' : 'Request a Tailored Quote'}
      </h3>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input id="lead-name" className="form-input" type="text" required placeholder="e.g. Sarah Jenkins"
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">Work Email *</label>
        <input id="lead-email" className="form-input" type="email" required placeholder="you@company.com"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">Phone Number (optional)</label>
        <input id="lead-phone" className="form-input" type="tel" placeholder="+1 (555) 000-0000"
          value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">{isBookCall ? 'Meeting Agenda & Goals' : 'Scope & Requirements'}</label>
        <textarea id="lead-message" className="form-input" required rows={4}
          placeholder={isBookCall ? 'What specific goals or challenges would you like to discuss?' : 'Outline your timeline, team size, and deliverables…'}
          value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
      </div>
      {state === 'error' && (
        <p style={{ color: 'var(--danger)', fontSize: '13px' }}>Something went wrong. Please try again.</p>
      )}
      <button id="btn-lead-submit" type="submit" className="btn btn-primary btn-lg"
        style={{ width: '100%' }} disabled={state === 'loading'}>
        {state === 'loading' ? '⏳ Submitting…' : isBookCall ? 'Schedule Call' : 'Request Proposal'}
      </button>

      <TrustLine gatewayName="bldr Verified" note="Direct provider connection" />
    </form>
  );
}

export function RedirectButton({ listing }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/tracking/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const { clickId, redirectUrl } = await res.json();
      const sep = redirectUrl.includes('?') ? '&' : '?';
      window.location.href = `${redirectUrl}${sep}click_id=${clickId}`;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <button
        id="btn-visit-store"
        className="btn btn-accent btn-lg"
        style={{ width: '100%' }}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? '⏳ Transferring…' : 'Visit Provider Store ↗'}
      </button>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        You will complete checkout on the provider’s external secure platform.
      </p>
      <TrustLine gatewayName="Verified Provider" note="Attributed partner listing" />
    </div>
  );
}
