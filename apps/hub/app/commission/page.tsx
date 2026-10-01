'use client';

import React, { useState, useEffect } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

interface BrandFeeRule {
  brandId: string;
  brandName: string;
  brandCode: string;
  feeModel: 'PERCENTAGE' | 'FLAT_PER_TXN' | 'COMBINED';
  feePct: number;
  flatFeeEgp: number;
  vatEnabled: boolean;
  vatRatePct: number; // Configurable per brand (pending accountant sign-off, e.g. 14%)
  reservePct: number; // Rolling reserve (default 5%)
  settlementCycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
}

const DEFAULT_BRAND_RULES: BrandFeeRule[] = [
  {
    brandId: 'bldr',
    brandName: 'bldr (Storefront Pilot)',
    brandCode: 'BLDR',
    feeModel: 'PERCENTAGE',
    feePct: 5.0,
    flatFeeEgp: 0,
    vatEnabled: true,
    vatRatePct: 14.0,
    reservePct: 5.0,
    settlementCycle: 'WEEKLY',
  },
  {
    brandId: 'v1',
    brandName: 'StudyHub Egypt',
    brandCode: 'SH',
    feeModel: 'PERCENTAGE',
    feePct: 5.0,
    flatFeeEgp: 0,
    vatEnabled: true,
    vatRatePct: 14.0,
    reservePct: 5.0,
    settlementCycle: 'WEEKLY',
  },
  {
    brandId: 'v2',
    brandName: 'TechBridge Cairo',
    brandCode: 'TB',
    feeModel: 'COMBINED',
    feePct: 4.5,
    flatFeeEgp: 15,
    vatEnabled: false,
    vatRatePct: 14.0,
    reservePct: 5.0,
    settlementCycle: 'WEEKLY',
  },
  {
    brandId: 'v3',
    brandName: 'EL HESA Academy',
    brandCode: 'EH',
    feeModel: 'PERCENTAGE',
    feePct: 5.0,
    flatFeeEgp: 0,
    vatEnabled: true,
    vatRatePct: 14.0,
    reservePct: 5.0,
    settlementCycle: 'WEEKLY',
  },
  {
    brandId: 'v4',
    brandName: 'Sidekick Studio Egypt',
    brandCode: 'SS',
    feeModel: 'PERCENTAGE',
    feePct: 5.0,
    flatFeeEgp: 0,
    vatEnabled: true,
    vatRatePct: 14.0,
    reservePct: 5.0,
    settlementCycle: 'WEEKLY',
  },
  {
    brandId: 'v5',
    brandName: 'Apex Academy Alexandria',
    brandCode: 'AC',
    feeModel: 'PERCENTAGE',
    feePct: 5.0,
    flatFeeEgp: 0,
    vatEnabled: true,
    vatRatePct: 14.0,
    reservePct: 5.0,
    settlementCycle: 'WEEKLY',
  },
];

export default function HubCommissionPage() {
  const [rules, setRules] = useState<BrandFeeRule[]>(DEFAULT_BRAND_RULES);
  const [savedRules, setSavedRules] = useState<BrandFeeRule[]>(DEFAULT_BRAND_RULES);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_brand_fee_rules');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRules(parsed);
          setSavedRules(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const updateRule = (brandId: string, updates: Partial<BrandFeeRule>) => {
    setRules((prev) =>
      prev.map((r) => (r.brandId === brandId ? { ...r, ...updates } : r))
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('bldr_brand_fee_rules', JSON.stringify(rules));
      setSavedRules(rules);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const hasChanges = JSON.stringify(rules) !== JSON.stringify(savedRules);

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
                Brand Platform Fees &amp; VAT Configuration
              </h1>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                Configure per-brand take rates, dynamic VAT applicability, and rolling dispute reserve requirements.
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
              }}
            >
              {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
            </button>
          </div>

          {/* Toast */}
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
              ✓ Brand fee and VAT configuration saved. Updated calculations apply immediately to ledger settlement runs.
            </div>
          )}

          {/* Info Banner */}
          <div
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 8,
              padding: '14px 18px',
              marginBottom: 24,
              fontSize: 13,
              color: '#92400E',
            }}
          >
            <strong>Tax &amp; Accounting Notice:</strong> Egyptian VAT on electronic platform fees is configurable per brand pending final corporate accountant sign-off. Rates can be adjusted dynamically without code deployment.
          </div>

          {/* Rules Table */}
          <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 18px' }}>Brand</th>
                  <th style={{ padding: '14px 18px' }}>Fee Model</th>
                  <th style={{ padding: '14px 18px' }}>Platform Rate</th>
                  <th style={{ padding: '14px 18px' }}>VAT on Fee</th>
                  <th style={{ padding: '14px 18px' }}>Rolling Reserve</th>
                  <th style={{ padding: '14px 18px' }}>Settlement Cycle</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.brandId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{r.brandName}</div>
                      <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>Code: {r.brandCode}</div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <select
                        value={r.feeModel}
                        onChange={(e) => updateRule(r.brandId, { feeModel: e.target.value as any })}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                      >
                        <option value="PERCENTAGE">Flat % Only</option>
                        <option value="FLAT_PER_TXN">Flat EGP Only</option>
                        <option value="COMBINED">% + Flat EGP</option>
                      </select>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {(r.feeModel === 'PERCENTAGE' || r.feeModel === 'COMBINED') && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <input
                              type="number"
                              step="0.1"
                              value={r.feePct}
                              onChange={(e) => updateRule(r.brandId, { feePct: parseFloat(e.target.value) || 0 })}
                              style={{ width: 60, padding: '5px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                            <span style={{ fontSize: 12, color: '#64748B' }}>%</span>
                          </div>
                        )}
                        {r.feeModel === 'COMBINED' && <span style={{ color: '#94A3B8' }}>+</span>}
                        {(r.feeModel === 'FLAT_PER_TXN' || r.feeModel === 'COMBINED') && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <input
                              type="number"
                              value={r.flatFeeEgp}
                              onChange={(e) => updateRule(r.brandId, { flatFeeEgp: parseFloat(e.target.value) || 0 })}
                              style={{ width: 60, padding: '5px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                            <span style={{ fontSize: 12, color: '#64748B' }}>EGP</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={r.vatEnabled}
                          onChange={(e) => updateRule(r.brandId, { vatEnabled: e.target.checked })}
                          style={{ accentColor: '#0F172A', width: 16, height: 16 }}
                        />
                        {r.vatEnabled ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <input
                              type="number"
                              step="0.5"
                              value={r.vatRatePct}
                              onChange={(e) => updateRule(r.brandId, { vatRatePct: parseFloat(e.target.value) || 0 })}
                              style={{ width: 55, padding: '4px 6px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                            />
                            <span style={{ fontSize: 11, color: '#64748B' }}>% VAT</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94A3B8' }}>Exempt</span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                          type="number"
                          step="0.5"
                          value={r.reservePct}
                          onChange={(e) => updateRule(r.brandId, { reservePct: parseFloat(e.target.value) || 0 })}
                          style={{ width: 55, padding: '5px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                        />
                        <span style={{ fontSize: 12, color: '#64748B' }}>%</span>
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <select
                        value={r.settlementCycle}
                        onChange={(e) => updateRule(r.brandId, { settlementCycle: e.target.value as any })}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                      >
                        <option value="WEEKLY">Weekly (Fridays)</option>
                        <option value="BIWEEKLY">Bi-weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
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
