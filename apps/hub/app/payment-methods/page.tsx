'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

const PAYMENT_METHODS = [
  'Fawry Ref Code (فوري)',
  'Mobile Wallets (محافظ المحمول)',
  'Meeza & Bank Cards (ميزة وبطاقات)',
  'InstaPay (إنستاباي)',
  'ValU BNPL (تقسيط فاليو)',
  'Direct Egyptian Bank Transfer (تحويل بنكي)',
];

const VENTURES = [
  { id: 'bldr', name: 'bldr (Storefront Pilot)', code: 'BLDR', color: '#D10721', isPilot: true, methods: { 'Fawry Ref Code (فوري)': true, 'Mobile Wallets (محافظ المحمول)': true, 'Meeza & Bank Cards (ميزة وبطاقات)': true, 'InstaPay (إنستاباي)': false, 'ValU BNPL (تقسيط فاليو)': false, 'Direct Egyptian Bank Transfer (تحويل بنكي)': false } },
  { id: 'v1', name: 'StudyHub Egypt', code: 'SH', color: '#0EA5E9', methods: { 'Fawry Ref Code (فوري)': true, 'Mobile Wallets (محافظ المحمول)': true, 'Meeza & Bank Cards (ميزة وبطاقات)': true, 'InstaPay (إنستاباي)': true, 'ValU BNPL (تقسيط فاليو)': true, 'Direct Egyptian Bank Transfer (تحويل بنكي)': false } },
  { id: 'v2', name: 'TechBridge Cairo', code: 'TB', color: '#7C3AED', methods: { 'Fawry Ref Code (فوري)': true, 'Mobile Wallets (محافظ المحمول)': true, 'Meeza & Bank Cards (ميزة وبطاقات)': true, 'InstaPay (إنستاباي)': true, 'ValU BNPL (تقسيط فاليو)': false, 'Direct Egyptian Bank Transfer (تحويل بنكي)': true } },
  { id: 'v3', name: 'EL HESA Academy', code: 'EH', color: '#D10721', methods: { 'Fawry Ref Code (فوري)': true, 'Mobile Wallets (محافظ المحمول)': true, 'Meeza & Bank Cards (ميزة وبطاقات)': true, 'InstaPay (إنستاباي)': false, 'ValU BNPL (تقسيط فاليو)': true, 'Direct Egyptian Bank Transfer (تحويل بنكي)': true } },
  { id: 'v4', name: 'Sidekick Studio Egypt', code: 'SS', color: '#10B981', methods: { 'Fawry Ref Code (فوري)': true, 'Mobile Wallets (محافظ المحمول)': true, 'Meeza & Bank Cards (ميزة وبطاقات)': true, 'InstaPay (إنستاباي)': true, 'ValU BNPL (تقسيط فاليو)': false, 'Direct Egyptian Bank Transfer (تحويل بنكي)': false } },
  { id: 'v5', name: 'Apex Academy Alexandria', code: 'AC', color: '#F59E0B', methods: { 'Fawry Ref Code (فوري)': true, 'Mobile Wallets (محافظ المحمول)': false, 'Meeza & Bank Cards (ميزة وبطاقات)': true, 'InstaPay (إنستاباي)': true, 'ValU BNPL (تقسيط فاليو)': false, 'Direct Egyptian Bank Transfer (تحويل بنكي)': true } },
];

type MethodsMap = Record<string, boolean>;
type VentureState = typeof VENTURES[0] & { methods: MethodsMap };

export default function PaymentMethodsPage() {
  const [ventures, setVentures] = useState<VentureState[]>(VENTURES);
  const [savedVentures, setSavedVentures] = useState<VentureState[]>(VENTURES);
  const [selectedVenture, setSelectedVenture] = useState('All ventures');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load saved state from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_payment_methods_matrix');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with any new ventures like bldr if stored was older
          const merged = VENTURES.map(defaultV => {
            const found = parsed.find((p: any) => p.id === defaultV.id);
            return found ? { ...defaultV, methods: { ...defaultV.methods, ...found.methods } } : defaultV;
          });
          setVentures(merged);
          setSavedVentures(merged);
          setLastSaved('Restored from local storage');
        }
      }
    } catch (e) {
      console.warn('[Payment Methods] Failed to restore from localStorage', e);
    }
  }, []);

  const hasChanges = JSON.stringify(ventures) !== JSON.stringify(savedVentures);

  const toggle = (ventureId: string, method: string) => {
    setVentures(prev => prev.map(v =>
      v.id === ventureId
        ? { ...v, methods: { ...v.methods, [method]: !v.methods[method] } }
        : v
    ));
    setSaveSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem('bldr_payment_methods_matrix', JSON.stringify(ventures));
        const bldrVenture = ventures.find(v => v.id === 'bldr');
        if (bldrVenture) {
          localStorage.setItem('bldr_fawry_enabled', String(bldrVenture.methods['Fawry Ref Code (فوري)'] ?? true));
        }
        setSavedVentures(ventures);
        setIsSaving(false);
        setSaveSuccess(true);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSaved(`Saved at ${timeStr}`);
        setTimeout(() => setSaveSuccess(false), 4000);
      } catch (e) {
        setIsSaving(false);
        alert('Failed to save settings to storage.');
      }
    }, 400);
  };

  const handleDiscard = () => {
    setVentures(savedVentures);
    setSaveSuccess(false);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all payment method rails to platform defaults?')) {
      setVentures(VENTURES);
      setSavedVentures(VENTURES);
      localStorage.removeItem('bldr_payment_methods_matrix');
      setLastSaved('Reset to defaults');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const displayedVentures = ventures.filter(v => {
    if (!selectedVenture || selectedVenture === 'all' || selectedVenture === 'All ventures') return true;
    if (selectedVenture === 'BLDR' || selectedVenture.toLowerCase().includes('bldr')) return v.id === 'bldr' || v.code === 'BLDR';
    if (selectedVenture === 'SH' || selectedVenture.toLowerCase().includes('studyhub')) return v.code === 'SH';
    if (selectedVenture === 'AC' || selectedVenture.toLowerCase().includes('apex')) return v.code === 'AC';
    if (selectedVenture === 'EH' || selectedVenture.toLowerCase().includes('hesa')) return v.code === 'EH';
    if (selectedVenture === 'TB' || selectedVenture.toLowerCase().includes('techbridge')) return v.code === 'TB';
    if (selectedVenture === 'SS' || selectedVenture.toLowerCase().includes('sidekick')) return v.code === 'SS';
    return true;
  });

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Payment Methods Matrix"
          crumb="Gateways / Payment Methods"
          selectedVenture={selectedVenture}
          onVentureChange={setSelectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        {/* Action Header Banner */}
        <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#12203C' }}>Payment Rails per Venture</span>
              {hasChanges && (
                <span style={{ fontSize: 11, fontWeight: 700, background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: 12, border: '1px solid #FDE68A' }}>
                  ● Unsaved changes
                </span>
              )}
              {saveSuccess && (
                <span style={{ fontSize: 11, fontWeight: 700, background: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: 12, border: '1px solid #86EFAC', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="3 8 6 11 13 4"/></svg>
                  Changes saved successfully!
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#8A94A6', marginTop: 2 }}>
              Toggle active rails per venture (Cards, Mobile Wallets, Fawry, InstaPay, ValU, Direct Bank Transfer)
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {lastSaved && !hasChanges && !saveSuccess && (
              <span style={{ fontSize: 11.5, color: '#8A94A6', fontWeight: 500 }}>
                {lastSaved}
              </span>
            )}

            {hasChanges && (
              <button
                type="button"
                onClick={handleDiscard}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 7,
                  background: '#FFFFFF',
                  border: '1px solid #D3DAE4',
                  color: '#5A6A80',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Discard
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                height: 36,
                padding: '0 18px',
                borderRadius: 7,
                background: hasChanges ? '#2E6F5E' : '#1B2A4A',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: isSaving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: hasChanges ? '0 2px 8px rgba(46, 111, 94, 0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {isSaving ? (
                <span>Saving…</span>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1z" />
                    <path d="M5 2v4h6V2" />
                    <path d="M4 14v-4h8v4" />
                  </svg>
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="hub-content" style={{ padding: '16px 24px 24px' }}>
          <div className="hub-card">
            <div className="hub-table-wrap">
              <table className="hub-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: 180 }}>Venture</th>
                    {PAYMENT_METHODS.filter((m, i, a) => a.indexOf(m) === i).map(m => (
                      <th key={m} style={{ textAlign: 'center', minWidth: 110 }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedVentures.map(v => (
                    <tr key={v.id} style={v.id === 'bldr' ? { background: '#FFF5F5' } : undefined}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0 }}>{v.code}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{v.name}</span>
                            {v.id === 'bldr' && (
                              <span style={{ fontSize: 10, fontWeight: 700, background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.04em' }}>
                                PILOT #1
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {PAYMENT_METHODS.filter((m, i, a) => a.indexOf(m) === i).map(method => (
                        <td key={method} style={{ textAlign: 'center' }}>
                          <button
                            className={`hub-toggle ${v.methods[method] ? 'on' : 'off'}`}
                            onClick={() => toggle(v.id, method)}
                            style={{ margin: '0 auto' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, padding: '12px 16px', background: 'white', borderRadius: 10, border: '1px solid var(--hub-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 20, borderRadius: 999, background: 'var(--hub-accent)', position: 'relative' }}>
                <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: 'white', top: 3, left: 19 }} />
              </div>
              <span style={{ fontSize: 13, color: 'var(--hub-text-2)' }}>Enabled for venture</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 20, borderRadius: 999, background: '#CBD5E1', position: 'relative' }}>
                <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: 'white', top: 3, left: 3 }} />
              </div>
              <span style={{ fontSize: 13, color: 'var(--hub-text-2)' }}>Disabled</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="button"
                onClick={handleResetDefaults}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8A94A6',
                  fontSize: 12,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Reset to defaults
              </button>
              <span style={{ fontSize: 12, color: hasChanges ? '#D97706' : 'var(--hub-text-3)', fontWeight: hasChanges ? 700 : 500 }}>
                {hasChanges ? '● Click "Save changes" above to persist' : (lastSaved || 'Changes persist across sessions')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
