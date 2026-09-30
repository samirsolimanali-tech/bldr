'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

interface AuditItem {
  id: string;
  actor: string;
  ip: string;
  action: string;
  target: string;
  venture: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  diff: { before: any; after: any };
}

const AUDIT_LOGS: AuditItem[] = [
  {
    id: 'aud_998124',
    actor: 'Mohammad Gamal (Super Admin)',
    ip: '197.38.12.84 (Cairo, EG)',
    action: 'SETTLEMENT_ADJUSTMENT_POSTED',
    target: 'Batch STL-2026-09-14 / psp_ch_4Q7J2L',
    venture: 'StudyHub',
    timestamp: '15 Sep 2026 · 04:15:22',
    severity: 'WARN',
    diff: {
      before: { hub_status: 'EXPIRED', posted_amount: 0 },
      after: { hub_status: 'PAID_BY_ADJUSTMENT', posted_amount: 900, resolution_reason: 'Provider captured expired payment' },
    },
  },
  {
    id: 'aud_998123',
    actor: 'Sarah Ibrahim (Venture Admin)',
    ip: '156.204.18.91 (Giza, EG)',
    action: 'REFUND_REQUESTED',
    target: 'txn_01J8F4KQ2M (SH-COURSE-4581)',
    venture: 'StudyHub',
    timestamp: '15 Sep 2026 · 11:20:04',
    severity: 'INFO',
    diff: {
      before: { refundable_balance: 750, refund_status: 'NONE' },
      after: { refundable_balance: 750, refund_status: 'PENDING_APPROVAL', reason: 'Customer requested cancellation' },
    },
  },
  {
    id: 'aud_998122',
    actor: 'system-match-worker',
    ip: '10.0.4.12 (Internal AWS)',
    action: 'RECONCILIATION_MATCH_EXECUTED',
    target: 'Batch STL-2026-09-14',
    venture: 'All',
    timestamp: '15 Sep 2026 · 04:10:00',
    severity: 'INFO',
    diff: {
      before: { matched_count: 0, auto_match_rate: '0%' },
      after: { matched_count: 412, auto_match_rate: '97.4%', exceptions_raised: 1 },
    },
  },
  {
    id: 'aud_998121',
    actor: 'Mohammad Gamal (Super Admin)',
    ip: '197.38.12.84 (Cairo, EG)',
    action: 'VENTURE_CONFIG_UPDATED',
    target: 'Venture studyhub',
    venture: 'StudyHub',
    timestamp: '14 Sep 2026 · 17:02:11',
    severity: 'INFO',
    diff: {
      before: { checkout_language: 'en' },
      after: { checkout_language: 'auto_with_arabic' },
    },
  },
  {
    id: 'aud_998120',
    actor: 'usr_omar (Apex Admin)',
    ip: '41.233.10.14 (Alexandria, EG)',
    action: 'API_KEY_ROLLED',
    target: 'Apex Classes API Secret',
    venture: 'Apex Classes',
    timestamp: '13 Sep 2026 · 09:12:44',
    severity: 'CRITICAL',
    diff: {
      before: { active_key: 'sk_live_apex_old...' },
      after: { active_key: 'sk_live_apex_new...', revoked_key: 'sk_live_apex_old...' },
    },
  },
];

export default function AuditLogsPage() {
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [activeDiff, setActiveDiff] = useState<AuditItem | null>(null);

  const filtered = AUDIT_LOGS.filter(a => selectedVenture === 'All' || a.venture === selectedVenture || a.venture === 'All');

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Audit Trail"
          crumb="Security / Audit Logs"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header Strip */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>Immutable Audit Log</span>
              <span style={{ fontSize: 11, color: '#8A94A6' }}>
                Every financial action, resolution, and configuration edit is recorded with actor IP and before/after state (PRD §8.11, AC-11).
              </span>
            </div>
            <button
              onClick={() => alert('Exporting signed audit archive...')}
              style={{ fontSize: 12, fontWeight: 700, color: '#5A6A80', border: '1px solid #E3E8EF', borderRadius: 7, padding: '7px 14px', background: '#fff', cursor: 'pointer' }}
            >
              Export Signed Log
            </button>
          </div>

          {/* Audit Table */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 180px minmax(0,1fr) 140px 170px 90px',
                padding: '0 20px',
                height: 38,
                alignItems: 'center',
                background: '#FAFBFD',
                borderBottom: '1px solid #E3E8EF',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Timestamp</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Actor &amp; IP</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Action &amp; Target</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Venture</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Severity</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Diff</span>
            </div>

            {filtered.map(l => (
              <div
                key={l.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 180px minmax(0,1fr) 140px 170px 90px',
                  padding: '12px 20px',
                  alignItems: 'center',
                  borderBottom: '1px solid #F0F3F7',
                  gap: 10,
                }}
              >
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8A94A6' }}>
                  {l.timestamp}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1B2A4A' }}>{l.actor}</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#8A94A6' }}>{l.ip}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11.5, fontWeight: 600, color: '#12203C' }}>
                    {l.action}
                  </span>
                  <span style={{ fontSize: 11, color: '#5A6A80' }}>{l.target}</span>
                </div>

                <span style={{ fontSize: 12, color: '#1B2A4A', fontWeight: 600 }}>{l.venture}</span>

                <div>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: l.severity === 'CRITICAL' ? '#C0392B' : l.severity === 'WARN' ? '#B8860B' : '#2E6F5E',
                      background: l.severity === 'CRITICAL' ? '#FDF0ED' : l.severity === 'WARN' ? '#FBF3E0' : '#E6EFEB',
                      borderRadius: 4,
                      padding: '3px 8px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {l.severity}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setActiveDiff(l)}
                    style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', border: '1px solid #2E6F5E', borderRadius: 5, padding: '4px 10px', cursor: 'pointer' }}
                  >
                    View Diff
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diff Viewer Modal */}
      {activeDiff && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(18,32,60,0.4)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 620, background: '#fff', borderRadius: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>Audit State Diff · {activeDiff.action}</span>
              <button onClick={() => setActiveDiff(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#8A94A6' }}>✕</button>
            </div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', display: 'block', marginBottom: 6 }}>BEFORE</span>
                <pre style={{ margin: 0, padding: 12, background: '#FAFBFD', border: '1px solid #E3E8EF', borderRadius: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#12203C', overflowX: 'auto' }}>
                  {JSON.stringify(activeDiff.diff.before, null, 2)}
                </pre>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', display: 'block', marginBottom: 6 }}>AFTER</span>
                <pre style={{ margin: 0, padding: 12, background: '#F4F9F7', border: '1px solid #A8D5C8', borderRadius: 7, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#12203C', overflowX: 'auto' }}>
                  {JSON.stringify(activeDiff.diff.after, null, 2)}
                </pre>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #E3E8EF', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveDiff(null)} style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
