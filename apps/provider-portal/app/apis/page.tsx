'use client';

import React, { useState } from 'react';
import ProviderSidebar from '../../components/Sidebar';

export default function ProviderAPIsPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('https://studyhub.io/api/bldr-webhooks');
  const [isSaved, setIsSaved] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const keys = {
    publishable: 'pk_live_bldr_studyhub_9921498124',
    secret: 'sk_live_bldr_sec_8841920849102482049182',
    webhookSecret: 'whsec_99182048109284019284',
  };

  const copyToClipboard = (type: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const testPing = () => {
    setPingStatus('Testing connection to Bldr API Gateway...');
    setTimeout(() => {
      setPingStatus('✓ Connection 200 OK — Latency 42ms — Gateway Active');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Bldr Team Developer APIs</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>API credentials, endpoints, and webhooks provided by Bldr for your integrations</p>
          </div>
          <button
            onClick={testPing}
            style={{ background: 'white', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: 'var(--brand)', cursor: 'pointer' }}
          >
            Test API Ping
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {pingStatus && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              {pingStatus}
            </div>
          )}

          {/* API Keys Box */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '28px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Production API Credentials</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Authenticate server-side and client-side requests with Bldr API Gateway.</p>
              </div>
              <span style={{ fontSize: 12, background: '#EFF6FF', color: '#1E40AF', padding: '4px 10px', borderRadius: 999, fontWeight: 600 }}>
                ● Production Mode Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Publishable Key */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Publishable Client Key
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    readOnly
                    value={keys.publishable}
                    style={{ flex: 1, background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-primary)' }}
                  />
                  <button
                    onClick={() => copyToClipboard('pub', keys.publishable)}
                    style={{ background: copiedKey === 'pub' ? '#059669' : 'white', color: copiedKey === 'pub' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {copiedKey === 'pub' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Secret Key */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Secret Server Key (Restricted)
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    readOnly
                    type={showSecret ? 'text' : 'password'}
                    value={keys.secret}
                    style={{ flex: 1, background: 'var(--bg-canvas)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-primary)' }}
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    style={{ background: 'white', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '0 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {showSecret ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    onClick={() => copyToClipboard('sec', keys.secret)}
                    style={{ background: copiedKey === 'sec' ? '#059669' : 'white', color: copiedKey === 'sec' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '0 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {copiedKey === 'sec' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Configuration */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '28px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>Webhook Notification Endpoint</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 18px' }}>Receive instant HTTP POST callbacks when student payments succeed, fail, or refund.</p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/api/webhooks"
                style={{ flex: 1, border: '1px solid var(--border-strong)', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
              />
              <button
                onClick={() => { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); }}
                style={{ background: isSaved ? '#059669' : 'var(--brand)', color: 'white', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              >
                {isSaved ? '✓ Saved' : 'Save URL'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Webhook Secret: <code style={{ background: 'var(--bg-canvas)', padding: '2px 6px', borderRadius: 4 }}>{keys.webhookSecret}</code>
            </div>
          </div>

          {/* Endpoints Documentation & Examples */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Bldr API Endpoints Reference</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { method: 'POST', path: 'https://api.bldr.dev/v1/checkout/sessions', desc: 'Create a checkout session and get a payment redirect URL.' },
                { method: 'GET', path: 'https://api.bldr.dev/v1/students?ventureId=studyhub', desc: 'Retrieve list of all enrolled students and payment details.' },
                { method: 'GET', path: 'https://api.bldr.dev/v1/transactions/:id', desc: 'Query status, gateway reference, and settlement info for a transaction.' },
                { method: 'POST', path: 'https://api.bldr.dev/v1/refunds', desc: 'Trigger a refund via Bldr Central Payment Hub.' },
              ].map(ep => (
                <div key={ep.path} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', background: 'var(--bg-canvas)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      background: ep.method === 'POST' ? '#EFF6FF' : '#ECFDF5',
                      color: ep.method === 'POST' ? '#1E40AF' : '#065F46',
                    }}>
                      {ep.method}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{ep.path}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{ep.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
