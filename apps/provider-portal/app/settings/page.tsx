'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('bldr_token') : null;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Store form state
  const [businessName, setBusinessName] = useState('bldr House Brand');
  const [supportEmail, setSupportEmail] = useState('team@bldr.io');
  const [supportPhone, setSupportPhone] = useState('+20 10 1234 5678');
  const [description, setDescription] = useState('Provider services and digital education solutions powered by bldr.');
  
  // Brand Ledger Settings (Internal)
  const [internalLedgerCode, setInternalLedgerCode] = useState('BLDR-LEDGER-AC');
  const [settlementCycle, setSettlementCycle] = useState('Weekly Batch');

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.site/bldr-provider-demo');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Store & Payout Settings</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Configure your venture profile, payout bank accounts, and webhook integrations.
            </p>
          </div>
        </header>

        <div className="page-content fade-up" style={{ maxWidth: 840 }}>
          {saved && (
            <div
              style={{
                marginBottom: 20,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'rgba(46, 111, 94, 0.12)',
                border: '1px solid var(--green)',
                color: 'var(--green)',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>✓</span> Settings successfully updated and saved.
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* General Profile */}
            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
                Business Profile
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Store / Brand Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Support Phone
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Store Tagline / Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                  />
                </div>
              </div>
            </div>

            {/* Internal Brand Ledger Routing */}
            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Internal Brand Ledger Routing
                </h2>
                <span style={{ fontSize: 11, background: '#F1F5F9', padding: '3px 8px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>
                  🔒 Governed by Hub Admin
                </span>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--text-muted)' }}>
                bldr is the sole merchant of record. Net settlement balances are recorded to your internal brand operating ledger.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Internal Ledger Account
                  </label>
                  <input
                    type="text"
                    value={internalLedgerCode}
                    readOnly
                    disabled
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg-canvas)', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Settlement Cadence
                  </label>
                  <input
                    type="text"
                    value={settlementCycle}
                    readOnly
                    disabled
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg-canvas)' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Dispute Reserve Requirement
                  </label>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-canvas)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
                    5% rolling dispute and chargeback reserve retained internally per settlement statement.
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook Endpoint */}
            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                Integration & Webhooks
              </h2>
              <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--text-muted)' }}>
                Receive instant HTTP POST callbacks whenever a transaction or client inquiry is processed.
              </p>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Webhook URL (Order / Payment Notifications)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: 14 }}
              >
                {loading ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
