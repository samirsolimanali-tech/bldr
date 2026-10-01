'use client';

import React, { useState } from 'react';
import ProviderSidebar from '../../components/Sidebar';

export default function IntegrationsPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lmsWebhookUrl, setLmsWebhookUrl] = useState('https://lms.apex.edu.eg/api/bldr/enroll-webhook');
  const [isSaved, setIsSaved] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const keys = {
    apiKey: 'sk_live_bldr_ac_9921498124b6',
    hmacSecret: 'whsec_hmac_sha256_8841920849102482049182',
    checkoutEndpoint: 'https://pay.bldrmanagement.com/api/v1/checkout/sessions',
  };

  const copyToClipboard = (type: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const testLmsWebhook = () => {
    setPingStatus('Sending test HMAC ping to your LMS webhook endpoint...');
    setTimeout(() => {
      setPingStatus('✓ Test webhook delivered: 200 OK received from LMS endpoint.');
    }, 700);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Brand Integrations &amp; API Keys
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              Server-to-server credentials and LMS webhook URLs for external systems
            </p>
          </div>
          <button
            onClick={testLmsWebhook}
            style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--brand)', cursor: 'pointer' }}
          >
            Test LMS Webhook Ping
          </button>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {pingStatus && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              {pingStatus}
            </div>
          )}

          {/* S2S API Credentials */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px', marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                Server-to-Server API Keys
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: 0 }}>
                Used by your LMS backend to create authenticated checkout sessions. Never expose secret keys in client-side code.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Brand API Key (Authorization Header)
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    readOnly
                    value={keys.apiKey}
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 12.5, background: 'var(--bg-canvas)' }}
                  />
                  <button
                    onClick={() => copyToClipboard('key', keys.apiKey)}
                    style={{ background: '#F1F5F9', border: '1px solid var(--border)', borderRadius: 6, padding: '0 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {copiedKey === 'key' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
                  HMAC Webhook Signature Secret
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type={showSecret ? 'text' : 'password'}
                    readOnly
                    value={keys.hmacSecret}
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 12.5, background: 'var(--bg-canvas)' }}
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    style={{ background: '#F1F5F9', border: '1px solid var(--border)', borderRadius: 6, padding: '0 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {showSecret ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    onClick={() => copyToClipboard('hmac', keys.hmacSecret)}
                    style={{ background: '#F1F5F9', border: '1px solid var(--border)', borderRadius: 6, padding: '0 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {copiedKey === 'hmac' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LMS Webhook URL Configuration */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px' }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                LMS Fulfillment Webhook URL
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: 0 }}>
                When a payment succeeds or a code is redeemed, bldr dispatches a signed event (`payment.succeeded`) to this URL to enroll the student automatically.
              </p>
            </div>

            <form onSubmit={handleSaveWebhook}>
              <div style={{ marginBottom: 14 }}>
                <input
                  type="url"
                  required
                  value={lmsWebhookUrl}
                  onChange={(e) => setLmsWebhookUrl(e.target.value)}
                  placeholder="https://your-lms.com/webhooks/bldr"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: isSaved ? '#16A34A' : 'var(--text-muted)', fontWeight: isSaved ? 600 : 400 }}>
                  {isSaved ? '✓ Webhook endpoint saved' : 'Payload verified using X-BLDR-Signature header'}
                </span>
                <button
                  type="submit"
                  style={{ background: '#0F172A', color: '#FFF', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Webhook URL
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
