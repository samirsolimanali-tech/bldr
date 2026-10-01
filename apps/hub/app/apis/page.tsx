'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

const GATEWAYS = [
  { id: 'gw-fawry', name: 'Fawry Pay', region: 'Egypt (Fawry Ref Code / Kiosk Payments)', logo: 'FP', connected: true, ventures: 5, lastSync: '1 min ago', keyPreview: 'fawry_sec_****9920', webhook: 'https://hub.bldr.io/webhooks/fawry-ipn', color: '#F59E0B' },
  { id: 'gw-paymob', name: 'Paymob (Accept)', region: 'Egypt (Cards / Mobile Wallets)', logo: 'PM', connected: true, ventures: 4, lastSync: '3 min ago', keyPreview: 'paymob_live_****7821', webhook: 'https://hub.bldr.io/webhooks/paymob-callback', color: '#2563EB' },
  { id: 'gw-geidea', name: 'Geidea Payment Gateway', region: 'Egypt (Cards / Mobile Wallets)', logo: 'GD', connected: true, ventures: 3, lastSync: '8 min ago', keyPreview: 'geidea_pub_****3310', webhook: 'https://hub.bldr.io/webhooks/geidea', color: '#DC2626' },
  { id: 'gw-tap', name: 'Tap Payments', region: 'MENA', logo: 'TAP', connected: true, ventures: 2, lastSync: '15 min ago', keyPreview: 'sk_live_****3f2a', webhook: 'https://hub.bldr.io/webhooks/tap', color: '#0EA5E9' },
  { id: 'gw-stripe', name: 'Stripe', region: 'Global', logo: 'STR', connected: true, ventures: 2, lastSync: '20 min ago', keyPreview: 'sk_live_****8c1b', webhook: 'https://hub.bldr.io/webhooks/stripe', color: '#6366F1' },
  { id: 'gw-paypal', name: 'PayPal', region: 'Global', logo: 'PP', connected: false, ventures: 0, lastSync: 'Never', keyPreview: null, webhook: null, color: '#3B82F6' },
];

export default function ApisPage() {
  const [gateways, setGateways] = useState(GATEWAYS);
  const [showConnect, setShowConnect] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);

  const toggleConnect = (id: string) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, connected: !g.connected } : g));
  };

  const connectingGw = gateways.find(g => g.id === showConnect);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="API & Gateways"
          crumb="Settings / Gateways"
        />

        <div className="hub-content" style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Connected Gateways', val: gateways.filter(g => g.connected).length },
              { label: 'Total Ventures Covered', val: gateways.reduce((s, g) => s + g.ventures, 0) },
              { label: 'Webhooks Active', val: gateways.filter(g => g.connected && g.webhook).length },
            ].map(s => (
              <div key={s.label} className="hub-kpi">
                <div className="hub-kpi-value">{s.val}</div>
                <div className="hub-kpi-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {gateways.map(gw => (
              <div key={gw.id} className="hub-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Icon */}
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: gw.color + '18', border: `1px solid ${gw.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: gw.color, flexShrink: 0, letterSpacing: '0.04em' }}>
                    {gw.logo}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--hub-text)' }}>{gw.name}</span>
                      <span className={`hub-badge ${gw.connected ? 'success' : 'neutral'}`}>{gw.connected ? 'Connected' : 'Not Connected'}</span>
                      <span style={{ fontSize: 11, color: 'var(--hub-text-3)', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4 }}>{gw.region}</span>
                    </div>
                    {gw.connected && (
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 12, color: 'var(--hub-text-3)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--hub-text-2)' }}>{gw.ventures}</span> ventures
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--hub-text-3)' }}>
                          Last sync: <span style={{ fontWeight: 600, color: 'var(--hub-text-2)' }}>{gw.lastSync}</span>
                        </div>
                        {gw.keyPreview && (
                          <div style={{ fontSize: 12, color: 'var(--hub-text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            API Key:
                            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--hub-text-2)' }}>
                              {showKey === gw.id ? 'sk_live_examplekey_shown_here' : gw.keyPreview}
                            </span>
                            <button
                              onClick={() => setShowKey(prev => prev === gw.id ? null : gw.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--hub-accent)' }}
                            >
                              {showKey === gw.id ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {gw.connected && gw.webhook && (
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>Webhook:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--hub-text-2)', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4 }}>{gw.webhook}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {gw.connected ? (
                      <>
                        <button className="hub-btn hub-btn-secondary hub-btn-sm">Edit Keys</button>
                        <button
                          className="hub-btn hub-btn-sm"
                          style={{ background: '#FEF2F2', color: '#991B1B', border: 'none' }}
                          onClick={() => toggleConnect(gw.id)}
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        className="hub-btn hub-btn-primary hub-btn-sm"
                        onClick={() => setShowConnect(gw.id)}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnect && connectingGw && (
        <div className="hub-modal-backdrop">
          <div className="hub-modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 className="hub-modal-title" style={{ marginBottom: 0 }}>Connect {connectingGw.name}</h2>
              <button onClick={() => setShowConnect(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--hub-text-3)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['API Key (Live)', 'API Secret (Live)', 'Webhook Secret'].map(f => (
                <div key={f}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--hub-text-2)' }}>{f}</label>
                  <input className="hub-input" type="password" placeholder="sk_live_..." />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="hub-btn hub-btn-secondary" onClick={() => setShowConnect(null)} style={{ flex: 1 }}>Cancel</button>
              <button
                className="hub-btn hub-btn-primary"
                onClick={() => { toggleConnect(showConnect!); setShowConnect(null); }}
                style={{ flex: 1 }}
              >
                Connect Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
