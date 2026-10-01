'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

export default function ProvidersPage() {
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');

  const providers = [
    {
      id: 'geidea',
      name: 'Geidea Payment Gateway (Cards & Wallets)',
      code: 'GD',
      status: 'Operational',
      latency: '240 ms',
      uptime: '99.98%',
      successRate: '96.2%',
      supportedMethods: ['Visa', 'Mastercard', 'Mobile Wallets'],
      isDefault: true,
      mode: 'Production',
      webhookEndpoint: 'https://hub.bldr.com/api/v1/webhooks/geidea',
    },
    {
      id: 'paymob',
      name: 'Paymob Egypt (Cards & Mobile Wallets)',
      code: 'PM',
      status: 'Operational',
      latency: '280 ms',
      uptime: '99.95%',
      successRate: '95.4%',
      supportedMethods: ['Visa', 'Mastercard', 'Vodafone Cash', 'Orange Money', 'WE Pay'],
      isDefault: false,
      mode: 'Production',
      webhookEndpoint: 'https://hub.bldr.com/api/v1/webhooks/paymob',
    },
    {
      id: 'fawry-direct',
      name: 'Fawry Pay (Kiosk Reference Code)',
      code: 'FW',
      status: 'Operational',
      latency: '410 ms',
      uptime: '99.85%',
      successRate: '93.1%',
      supportedMethods: ['Fawry Reference Codes', 'Fawry Yellow Kiosks'],
      isDefault: false,
      mode: 'Production',
      webhookEndpoint: 'https://hub.bldr.com/api/v1/webhooks/fawry',
    },
  ];

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Payment Service Providers"
          crumb="Settings / Providers"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
            {[
              { label: 'Active Gateways', val: '3 Connected', note: 'All systems operational' },
              { label: 'Average Latency', val: '312 ms', note: 'Cairo DC edge response' },
              { label: 'Routing Engine', val: 'Active', note: 'Auto-fallback enabled' },
              { label: 'PCI DSS Scope', val: 'SAQ A-EP', note: 'Cardholder data isolated' },
            ].map(k => (
              <div key={k.label} style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>{k.label}</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 18, fontWeight: 600, color: '#12203C' }}>{k.val}</span>
                <span style={{ fontSize: 11, color: '#2E6F5E', fontWeight: 600 }}>{k.note}</span>
              </div>
            ))}
          </div>

          {/* Providers List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>Configured Payment Providers</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {providers.map(p => (
                <div key={p.id} style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 8, background: '#12203C', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    {p.code}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#1B2A4A' }}>{p.name}</span>
                      {p.isDefault && (
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 4, padding: '2px 6px' }}>DEFAULT</span>
                      )}
                    </div>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8A94A6' }}>{p.webhookEndpoint}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase' }}>Latency</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, fontWeight: 600, color: '#2E6F5E' }}>{p.latency}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase' }}>Uptime</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, fontWeight: 600, color: '#12203C' }}>{p.uptime}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase' }}>Success Rate</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12.5, fontWeight: 600, color: '#12203C' }}>{p.successRate}</span>
                    </div>

                    <span style={{ fontSize: 10, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 20, padding: '4px 10px' }}>
                      ● {p.status}
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`Configuring credentials & webhook signature keys for ${p.name}...`)}
                    style={{ fontSize: 12, fontWeight: 700, color: '#5A6A80', border: '1px solid #E3E8EF', borderRadius: 7, padding: '8px 14px', background: '#fff', cursor: 'pointer' }}
                  >
                    Configure →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
