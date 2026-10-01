'use client';

import React, { useState, useEffect } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

interface BrandGatewayConfig {
  id: string;
  name: string;
  code: string;
  color: string;
  assignedGateway: 'GEIDEA' | 'PAYMOB';
  fawryEnabled: boolean;
}

const DEFAULT_CONFIGS: BrandGatewayConfig[] = [
  { id: 'bldr', name: 'bldr (Storefront Pilot)', code: 'BLDR', color: '#D10721', assignedGateway: 'GEIDEA', fawryEnabled: true },
  { id: 'v1', name: 'StudyHub Egypt', code: 'SH', color: '#0EA5E9', assignedGateway: 'PAYMOB', fawryEnabled: true },
  { id: 'v2', name: 'TechBridge Cairo', code: 'TB', color: '#7C3AED', assignedGateway: 'GEIDEA', fawryEnabled: false },
  { id: 'v3', name: 'EL HESA Academy', code: 'EH', color: '#D10721', assignedGateway: 'GEIDEA', fawryEnabled: true },
  { id: 'v4', name: 'Sidekick Studio Egypt', code: 'SS', color: '#10B981', assignedGateway: 'PAYMOB', fawryEnabled: false },
  { id: 'v5', name: 'Apex Academy Alexandria', code: 'AC', color: '#F59E0B', assignedGateway: 'PAYMOB', fawryEnabled: true },
];

export default function PaymentMethodsPage() {
  const [brands, setBrands] = useState<BrandGatewayConfig[]>(DEFAULT_CONFIGS);
  const [savedBrands, setSavedBrands] = useState<BrandGatewayConfig[]>(DEFAULT_CONFIGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_brand_gateway_assignments');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBrands(parsed);
          setSavedBrands(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const hasChanges = JSON.stringify(brands) !== JSON.stringify(savedBrands);

  const setGateway = (brandId: string, gateway: 'GEIDEA' | 'PAYMOB') => {
    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, assignedGateway: gateway } : b))
    );
  };

  const toggleFawry = (brandId: string) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, fawryEnabled: !b.fawryEnabled } : b))
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('bldr_brand_gateway_assignments', JSON.stringify(brands));
      setSavedBrands(brands);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <HubSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HubTopBar />

        <div style={{ padding: '28px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Payment Gateway & Rails Configuration
              </h1>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                Governed strictly by Hub Admin. Each brand is assigned exactly one primary gateway (Geidea or Paymob) for Card + Mobile Wallets, plus a Fawry on/off toggle.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              style={{
                background: hasChanges ? '#0F172A' : '#94A3B8',
                color: '#FFF',
                border: 'none',
                borderRadius: 6,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: hasChanges ? 'pointer' : 'not-allowed',
                boxShadow: hasChanges ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
            </button>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div
              style={{
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '12px 16px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              ✓ Gateway assignments saved successfully. Live checkout sessions will route per new configuration.
            </div>
          )}

          {/* Governance Notice */}
          <div
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 8,
              padding: '14px 18px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.5 }}>
              <strong>🔒 Strict Gateway Policy:</strong> Brands can never change their own payment methods. Active rails are strictly Geidea, Paymob, and Fawry. Secondary failover is disabled to guarantee predictable ledger attribution.
            </div>
          </div>

          {/* Matrix Table */}
          <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 18px' }}>Brand (Venture)</th>
                  <th style={{ padding: '14px 18px' }}>Assigned Primary Gateway (Card & Wallet)</th>
                  <th style={{ padding: '14px 18px' }}>Supported Rails</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Fawry Pay Kiosk</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: b.color,
                            display: 'inline-block',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{b.name}</div>
                          <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                            Code: {b.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: b.assignedGateway === 'GEIDEA' ? 600 : 400,
                            color: b.assignedGateway === 'GEIDEA' ? '#DC2626' : '#64748B',
                          }}
                        >
                          <input
                            type="radio"
                            name={`gw-${b.id}`}
                            checked={b.assignedGateway === 'GEIDEA'}
                            onChange={() => setGateway(b.id, 'GEIDEA')}
                          />
                          Geidea
                        </label>

                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: b.assignedGateway === 'PAYMOB' ? 600 : 400,
                            color: b.assignedGateway === 'PAYMOB' ? '#2563EB' : '#64748B',
                          }}
                        >
                          <input
                            type="radio"
                            name={`gw-${b.id}`}
                            checked={b.assignedGateway === 'PAYMOB'}
                            onChange={() => setGateway(b.id, 'PAYMOB')}
                          />
                          Paymob
                        </label>
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: 12, color: '#334155' }}>
                        Cards (Visa/Mastercard) + Mobile Wallets
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                        Routed via {b.assignedGateway === 'GEIDEA' ? 'Geidea Payment Gateway' : 'Paymob Egypt'}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleFawry(b.id)}
                        style={{
                          background: b.fawryEnabled ? '#FEF3C7' : '#F1F5F9',
                          color: b.fawryEnabled ? '#92400E' : '#94A3B8',
                          border: `1px solid ${b.fawryEnabled ? '#FCD34D' : '#CBD5E1'}`,
                          borderRadius: 20,
                          padding: '4px 12px',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {b.fawryEnabled ? '✓ Fawry Enabled' : 'Off'}
                      </button>
                    </td>

                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#16A34A',
                          background: '#DCFCE7',
                          padding: '3px 8px',
                          borderRadius: 4,
                        }}
                      >
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
