'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { SimulationBanner, formatCurrency } from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminSimulationPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimMode, setIsSimMode] = useState<boolean | null>(null);
  const [delayMs, setDelayMs] = useState(0);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'rejection' | 'error';
    title: string;
    details: string;
  } | null>(null);

  const checkConfigAndFetch = async () => {
    try {
      const configRes = await fetch(`${API}/config`);
      const config = await configRes.json();
      setIsSimMode(config.paymentSimulationMode);

      if (config.paymentSimulationMode) {
        const ordersRes = await fetch(`${API}/simulation/orders`);
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch {
      setIsSimMode(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfigAndFetch();
  }, []);

  const handleReplayWebhook = async (order: any) => {
    setActiveActionId(order.id);
    setFeedback(null);

    const isFawry = order.gatewayUsed === 'FAWRY';
    const endpoint = isFawry ? '/simulation/fawry/trigger' : '/simulation/geidea/trigger';

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: isFawry ? 'PAID' : 'paid',
          delayMs,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          title: `Webhook Replayed & Verified (#${order.id.slice(-8).toUpperCase()})`,
          details: `Computed valid HMAC signature against SIMULATION_DEV_SECRET. Verified by handleWebhook(), transaction logged, order set to PAID. (Delay: ${delayMs}ms)`,
        });
        checkConfigAndFetch();
      } else {
        setFeedback({
          type: 'error',
          title: 'Webhook Replay Failed',
          details: data.error || data.message,
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        title: 'Network Error',
        details: err.message,
      });
    } finally {
      setActiveActionId(null);
    }
  };

  const handleTamperTest = async (order: any) => {
    setActiveActionId(order.id);
    setFeedback(null);

    const isFawry = order.gatewayUsed === 'FAWRY';
    const endpoint = isFawry ? '/simulation/fawry/trigger' : '/simulation/geidea/trigger';

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: isFawry ? 'PAID' : 'paid',
          tamper: true,
          delayMs,
        }),
      });

      const data = await res.json();
      // Expecting rejection (success === false)
      if (!data.success) {
        setFeedback({
          type: 'rejection',
          title: `Tamper Security Check Passed! Rejection Confirmed (#${order.id.slice(-8).toUpperCase()})`,
          details: `The gateway adapter calculated a deliberate signature mismatch. Verification strictly rejected it with: "${data.error}". Zero state changes or payout credits were allowed!`,
        });
      } else {
        setFeedback({
          type: 'error',
          title: 'Unexpected Acceptance',
          details: 'A tampered signature should never be accepted!',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        title: 'Error',
        details: err.message,
      });
    } finally {
      setActiveActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="shell">
        <AdminSidebar />
        <div className="main-content" style={{ padding: '40px' }}>Loading simulation engine…</div>
      </div>
    );
  }

  if (isSimMode === false) {
    return (
      <div className="shell">
        <AdminSidebar />
        <div className="main-content" style={{ padding: '40px' }}>
          <h1>Simulation Mode Disabled</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            PAYMENT_SIMULATION_MODE is turned off. Set PAYMENT_SIMULATION_MODE=true in non-production environments to access this control panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <SimulationBanner message="Admin Simulation Control Panel — Live Gateway Verification Testbed" />

        <header className="topbar">
          <h1 className="topbar-title">Payment & Webhook Simulation Cockpit</h1>
          <button onClick={checkConfigAndFetch} className="btn btn-secondary btn-sm">
            ↻ Refresh Orders
          </button>
        </header>

        <div className="page-content fade-up">
          {/* Controls Bar */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E4E1DA',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              boxShadow: '0 1px 3px rgba(20,23,28,0.03)',
            }}
          >
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#14171C' }}>
                Gateway Latency Emulation
              </h2>
              <p style={{ fontSize: '13px', color: '#5B6169', marginTop: '2px' }}>
                Inject artificial webhook delivery delay to test polling and async settling
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#14171C' }}>
                Delay: <strong className="tabular-nums">{delayMs} ms</strong>
              </span>
              <input
                id="sim-delay-slider"
                type="range"
                min="0"
                max="5000"
                step="250"
                value={delayMs}
                onChange={e => setDelayMs(parseInt(e.target.value))}
                style={{ width: '180px', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 500, 1500, 3000].map(ms => (
                  <button
                    key={ms}
                    onClick={() => setDelayMs(ms)}
                    className={`btn btn-sm ${delayMs === ms ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    {ms === 0 ? 'Instant' : `${ms / 1000}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '8px',
                marginBottom: '24px',
                border:
                  feedback.type === 'success'
                    ? '1px solid #C2E4D2'
                    : feedback.type === 'rejection'
                    ? '1px solid #CCD8F5'
                    : '1px solid #F8CCC5',
                background:
                  feedback.type === 'success'
                    ? 'var(--success-bg)'
                    : feedback.type === 'rejection'
                    ? '#EDF1FA'
                    : 'var(--danger-bg)',
                color:
                  feedback.type === 'success'
                    ? 'var(--success)'
                    : feedback.type === 'rejection'
                    ? '#263C8B'
                    : 'var(--danger)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '14px' }}>
                  {feedback.type === 'rejection' ? '🛡️ ' : feedback.type === 'success' ? '✅ ' : '⚠️ '}
                  {feedback.title}
                </strong>
                <button
                  onClick={() => setFeedback(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.5, opacity: 0.9 }}>{feedback.details}</div>
            </div>
          )}

          {/* Recent Orders Table */}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Source</th>
                  <th>Gateway</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Audit Signatures</th>
                  <th>Simulation Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No simulated orders recorded yet. Create an order on the storefront to test!
                    </td>
                  </tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>#{o.id.slice(-8).toUpperCase()}</td>
                      <td>
                        <span className={`badge ${o.source === 'REDIRECT' ? 'badge-accent' : 'badge-blue'}`}>
                          {o.source === 'REDIRECT' ? '↗ Redirect' : '🛒 Native'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-muted" style={{ fontSize: '10px' }}>
                          {o.gatewayUsed}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{o.listing?.title || '—'}</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{o.customerEmail}</td>
                      <td className="tabular-nums" style={{ fontWeight: 600 }}>
                        {formatCurrency(o.amount, o.currency || 'USD')}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            o.status === 'PAID'
                              ? 'badge-green'
                              : o.status === 'PENDING_VERIFICATION'
                              ? 'badge-amber'
                              : o.status === 'FAILED'
                              ? 'badge-red'
                              : 'badge-muted'
                          }`}
                        >
                          {o.status === 'PENDING_VERIFICATION' ? 'Pending Verification' : o.status}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: o.transactions?.length > 0 ? 'var(--success)' : 'var(--text-muted)',
                          }}
                        >
                          {o.transactions?.length || 0} valid tx
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            id={`btn-replay-${o.id}`}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            disabled={activeActionId === o.id}
                            onClick={() => handleReplayWebhook(o)}
                          >
                            {activeActionId === o.id ? 'Replaying…' : '↻ Replay Webhook'}
                          </button>
                          <button
                            id={`btn-tamper-${o.id}`}
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            disabled={activeActionId === o.id}
                            onClick={() => handleTamperTest(o)}
                          >
                            🛡️ Test Tamper
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
