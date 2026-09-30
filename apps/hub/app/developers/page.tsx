'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

export default function DevelopersPage() {
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('StudyHub');
  const [keyRevealed, setKeyRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);

  const copy = (txt: string, name: string) => {
    navigator.clipboard?.writeText(txt);
    setCopiedKey(name);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateWebhook = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimResult('Webhook delivered to https://api.studyhub.eg/v1/payments/events · HTTP 200 OK in 142ms.');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Developer Portal &amp; API Keys"
          crumb="Developers / API &amp; Webhooks"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* API Keys Card */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>API Credentials — {selectedVenture}</span>
                <span style={{ fontSize: 11, color: '#8A94A6' }}>
                  Use these keys to authenticate server-to-server requests and initialize checkout sessions.
                </span>
              </div>
              <button
                onClick={() => alert('New key generated! Save it immediately.')}
                style={{ fontSize: 11.5, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', border: '1px solid #2E6F5E', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
              >
                + Roll New Key
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Publishable Key */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                  Publishable Key (Client-side)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 38, background: '#F5F7FA', border: '1px solid #E3E8EF', borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#12203C' }}>
                      pk_live_studyhub_88a912e4f01
                    </span>
                  </div>
                  <button
                    onClick={() => copy('pk_live_studyhub_88a912e4f01', 'pk')}
                    style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, color: '#5A6A80', cursor: 'pointer' }}
                  >
                    {copiedKey === 'pk' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Secret Key */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                  Secret Key (Server-side · Keep confidential)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 38, background: '#F5F7FA', border: '1px solid #E3E8EF', borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#12203C' }}>
                      {keyRevealed ? 'sk_live_studyhub_sec_994101823abce' : 'sk_live_studyhub_••••••••••••••••••••••••'}
                    </span>
                  </div>
                  <button
                    onClick={() => setKeyRevealed(!keyRevealed)}
                    style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, color: '#5A6A80', cursor: 'pointer' }}
                  >
                    {keyRevealed ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    onClick={() => copy('sk_live_studyhub_sec_994101823abce', 'sk')}
                    style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, color: '#5A6A80', cursor: 'pointer' }}
                  >
                    {copiedKey === 'sk' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Webhook Secret */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                  Webhook Signing Secret (HMAC-SHA256)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 38, background: '#F5F7FA', border: '1px solid #E3E8EF', borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#12203C' }}>
                      whsec_live_d88f910a34b22c1e87
                    </span>
                  </div>
                  <button
                    onClick={() => copy('whsec_live_d88f910a34b22c1e87', 'wh')}
                    style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, color: '#5A6A80', cursor: 'pointer' }}
                  >
                    {copiedKey === 'wh' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Simulator Card */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>Webhook Event Simulator</span>
              <button
                disabled={simulating}
                onClick={handleSimulateWebhook}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#2E6F5E',
                  border: 'none',
                  borderRadius: 7,
                  padding: '8px 16px',
                  cursor: simulating ? 'not-allowed' : 'pointer',
                }}
              >
                {simulating ? 'Sending Event...' : 'Trigger payment.succeeded'}
              </button>
            </div>

            {simResult && (
              <div style={{ padding: '10px 14px', background: '#E6EFEB', border: '1px solid #2E6F5E', borderRadius: 7, fontSize: 11.5, color: '#2E6F5E', fontWeight: 600 }}>
                {simResult}
              </div>
            )}

            <div style={{ background: '#12203C', borderRadius: 8, padding: 14, overflowX: 'auto' }}>
              <pre style={{ margin: 0, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#81C784' }}>
{`// Sample Webhook Payload
{
  "id": "evt_test_9918231",
  "event": "payment.succeeded",
  "created_at": 1789482728,
  "data": {
    "hub_txn_id": "txn_01J8F4KQ2M",
    "order_reference": "SH-COURSE-4581",
    "venture": "studyhub",
    "amount": 75000,
    "currency": "EGP",
    "status": "PAID"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
