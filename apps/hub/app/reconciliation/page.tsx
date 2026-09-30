'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

interface ReconRow {
  id: string;
  psp: string;
  order: string;
  txn: string;
  txnColor: string;
  pspAmt: string;
  hubAmt: string;
  hubColor: string;
  delta: string;
  dColor: string;
  date: string;
  state: string;
  stFg: string;
  stBg: string;
  rowBg: string;
  hasException?: boolean;
}

export default function ReconciliationPage() {
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [viewFilter, setViewFilter] = useState<'all' | 'attention'>('attention');
  const [exceptionResolved, setExceptionResolved] = useState(false);
  const [resolutionNotice, setResolutionNotice] = useState<string | null>(null);

  const reconTiles = [
    { label: 'Matched lines', count: '412', value: 'EGP 3,980,120.00', color: '#2E6F5E' },
    { label: 'Unmatched Hub', count: '8', value: 'EGP 41,250.00', color: '#B8860B' },
    { label: 'Unmatched PSP', count: '6', value: 'EGP 14,800.00', color: '#D97706' },
    { label: 'Discrepancies', count: '3', value: 'EGP 2,400.00', color: '#C0392B' },
  ];

  const reconRows: ReconRow[] = [
    {
      id: 'row-1',
      psp: 'psp_ch_4Q7J2L',
      order: 'SH-COURSE-4402',
      txn: exceptionResolved ? 'txn_01J8EX1TD5 (Adjusted)' : 'txn_01J8EX1TD5',
      txnColor: exceptionResolved ? '#2E6F5E' : '#C0392B',
      pspAmt: '900.00',
      hubAmt: exceptionResolved ? '900.00' : '0.00',
      hubColor: exceptionResolved ? '#12203C' : '#C0392B',
      delta: exceptionResolved ? '0.00' : '+ 900.00',
      dColor: exceptionResolved ? '#2E6F5E' : '#C0392B',
      date: '12 Sep 23:58',
      state: exceptionResolved ? 'RESOLVED · ADJUSTED' : 'EXPIRED_CAPTURED',
      stFg: exceptionResolved ? '#2E6F5E' : '#8A5E00',
      stBg: exceptionResolved ? '#E6EFEB' : '#FBF3E0',
      rowBg: exceptionResolved ? '#fff' : '#FEFAF0',
      hasException: true,
    },
    {
      id: 'row-2',
      psp: 'psp_ch_9a2f1c890',
      order: 'SH-COURSE-4581',
      txn: 'txn_01J8F4KQ2M',
      txnColor: '#12203C',
      pspAmt: '750.00',
      hubAmt: '750.00',
      hubColor: '#12203C',
      delta: '0.00',
      dColor: '#2E6F5E',
      date: '14 Sep 14:32',
      state: 'MATCHED',
      stFg: '#2E6F5E',
      stBg: '#E6EFEB',
      rowBg: '#fff',
    },
    {
      id: 'row-3',
      psp: 'psp_ch_7k3m81002',
      order: 'AC-CFA-8812',
      txn: 'txn_01J8F4KP9X',
      txnColor: '#12203C',
      pspAmt: '6,500.00',
      hubAmt: '6,500.00',
      hubColor: '#12203C',
      delta: '0.00',
      dColor: '#2E6F5E',
      date: '14 Sep 11:20',
      state: 'MATCHED',
      stFg: '#2E6F5E',
      stBg: '#E6EFEB',
      rowBg: '#fff',
    },
    {
      id: 'row-4',
      psp: 'psp_ch_2x9918231',
      order: 'EH-ARAB-0091',
      txn: 'txn_01J8E09A1B',
      txnColor: '#12203C',
      pspAmt: '450.00',
      hubAmt: '450.00',
      hubColor: '#12203C',
      delta: '0.00',
      dColor: '#2E6F5E',
      date: '11 Sep 16:05',
      state: 'MATCHED',
      stFg: '#2E6F5E',
      stBg: '#E6EFEB',
      rowBg: '#fff',
    },
    {
      id: 'row-5',
      psp: 'psp_ch_881902123',
      order: 'SH-BUNDLE-0199',
      txn: 'txn_01J8C9901A',
      txnColor: '#8A94A6',
      pspAmt: '1,200.00',
      hubAmt: '1,150.00',
      hubColor: '#C0392B',
      delta: '+ 50.00',
      dColor: '#C0392B',
      date: '10 Sep 13:40',
      state: 'AMOUNT_MISMATCH',
      stFg: '#C0392B',
      stBg: '#FDF0ED',
      rowBg: '#FFFDFD',
    },
    {
      id: 'row-6',
      psp: 'psp_ch_554109281',
      order: 'CH-RESUME-1049',
      txn: 'txn_01J8D58M7Q',
      txnColor: '#12203C',
      pspAmt: '1,200.00',
      hubAmt: '1,200.00',
      hubColor: '#12203C',
      delta: '0.00',
      dColor: '#2E6F5E',
      date: '10 Sep 09:44',
      state: 'MATCHED',
      stFg: '#2E6F5E',
      stBg: '#E6EFEB',
      rowBg: '#fff',
    },
  ];

  const handleResolveException = (action: string) => {
    setExceptionResolved(true);
    setResolutionNotice(`Action completed: ${action}. Audit entry written with actor: usr_gamal.`);
    setTimeout(() => setResolutionNotice(null), 5000);
  };

  const displayedRows = viewFilter === 'attention' ? reconRows.filter(r => r.state !== 'MATCHED') : reconRows;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Batch STL-2026-09-14"
          crumb="Reconciliation / Settlement batches"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Batch Info Header */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 20px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Batch
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 600, color: '#12203C' }}>
                  STL-2026-09-14
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#B8860B', background: '#FBF3E0', borderRadius: 20, padding: '3px 9px', letterSpacing: '0.03em' }}>
                  OPEN
                </span>
              </div>
            </div>

            <div style={{ width: 1, height: 38, background: '#E3E8EF' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Provider &amp; period
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1B2A4A' }}>
                PSP-A · 14 Sep 2026 payout
              </span>
            </div>

            <div style={{ width: 1, height: 38, background: '#E3E8EF' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Source file
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#5A6A80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.8 2.5h5.6l3.1 3.1v7.9H3.8zM9.4 2.5v3.1h3.1" />
                </svg>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#1B2A4A' }}>
                  psp-a-settlement-20260914.csv
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#8A94A6' }}>
                  429 lines · imported 15 Sep 04:08 by M. Gamal
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }}></div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={() => alert('Opening CSV import dialog for settlement statement...')}
                style={{ fontSize: '11.5px', fontWeight: 700, color: '#5A6A80', border: '1px solid #E3E8EF', borderRadius: 7, padding: '8px 13px', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Import file
              </button>
              <button
                onClick={() => alert('Re-running 4-key match algorithm across all unsettled transactions...')}
                style={{ fontSize: '11.5px', fontWeight: 700, color: '#5A6A80', border: '1px solid #E3E8EF', borderRadius: 7, padding: '8px 13px', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Re-run match
              </button>
              <button
                onClick={() => alert('Batch STL-2026-09-14 requires resolving all discrepancies before closing (§7.3).')}
                style={{ fontSize: '11.5px', fontWeight: 700, color: '#A4AEBD', background: '#F0F3F7', border: '1px solid #E3E8EF', borderRadius: 7, padding: '8px 15px', cursor: 'not-allowed', whiteSpace: 'nowrap' }}
              >
                Close batch
              </button>
            </div>
          </div>

          {resolutionNotice && (
            <div style={{ padding: '10px 16px', background: '#E6EFEB', border: '1px solid #2E6F5E', borderRadius: 8, color: '#2E6F5E', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="2"><path d="M3.5 8.5l3 3 6-6" /></svg>
              {resolutionNotice}
            </div>
          )}

          {/* 4 Reconciliation Tiles + Auto-Match Rate Progress Gauge */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) 400px', gap: 13 }}>
            {reconTiles.map((r, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #E3E8EF',
                  borderRadius: 10,
                  padding: '14px 15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  borderTop: `3px solid ${r.color}`,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                  {r.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 19, fontWeight: 600, color: '#12203C', lineHeight: 1 }}>
                    {r.count}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6' }}>lines</span>
                </div>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', fontWeight: 500, color: r.color }}>
                  {r.value}
                </span>
              </div>
            ))}

            {/* Auto-Match Rate Card */}
            <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '14px 17px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                  Auto-match rate
                </span>
                <div style={{ flex: 1 }}></div>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 15, fontWeight: 600, color: '#B8860B' }}>
                  97.4%
                </span>
              </div>
              <div style={{ height: 7, background: '#EEF1F5', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: '97.4%', height: '100%', background: '#B8860B', borderRadius: 4 }}></div>
                <div style={{ position: 'absolute', left: '98%', top: -3, bottom: -3, width: 2, background: '#12203C' }}></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6' }}>Target</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10.5px', fontWeight: 600, color: '#12203C' }}>
                  &gt; 98.0%
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#8A94A6' }}>
                  · §3.2 success metric
                </span>
              </div>
            </div>
          </div>

          {/* Settlement Lines Table & Exception Section */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                Settlement lines
              </span>
              <div style={{ flex: 1 }}></div>
              <button
                onClick={() => setViewFilter('all')}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: viewFilter === 'all' ? '#2E6F5E' : '#5A6A80',
                  border: `1px solid ${viewFilter === 'all' ? '#2E6F5E' : '#E3E8EF'}`,
                  background: viewFilter === 'all' ? '#E6EFEB' : '#fff',
                  borderRadius: 6,
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                All 429
              </button>
              <button
                onClick={() => setViewFilter('attention')}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: viewFilter === 'attention' ? '#2E6F5E' : '#5A6A80',
                  border: `1px solid ${viewFilter === 'attention' ? '#2E6F5E' : '#E3E8EF'}`,
                  background: viewFilter === 'attention' ? '#E6EFEB' : '#fff',
                  borderRadius: 6,
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Needs attention 17
              </button>
              <button
                onClick={() => alert('Exporting reconciliation CSV batch...')}
                style={{ fontSize: 11, fontWeight: 700, color: '#5A6A80', border: '1px solid #E3E8EF', borderRadius: 6, padding: '5px 10px', background: '#fff', cursor: 'pointer' }}
              >
                Export
              </button>
            </div>

            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '152px 150px 168px 104px 104px 92px 80px 140px 26px',
                padding: '0 20px',
                height: 34,
                alignItems: 'center',
                background: '#FAFBFD',
                borderBottom: '1px solid #E3E8EF',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>PSP reference</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Order ref</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Internal txn</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>PSP amount</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Hub amount</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Δ</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Date</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Match state</span>
              <span></span>
            </div>

            {/* Rows */}
            {displayedRows.map(r => (
              <div
                key={r.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '152px 150px 168px 104px 104px 92px 80px 140px 26px',
                  padding: '0 20px',
                  height: 44,
                  alignItems: 'center',
                  borderBottom: '1px solid #F0F3F7',
                  gap: 8,
                  background: r.rowBg,
                }}
              >
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#12203C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.psp}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#5A6A80', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.order}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: r.txnColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.txn}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#12203C', textAlign: 'right' }}>
                  {r.pspAmt}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: r.hubColor, textAlign: 'right' }}>
                  {r.hubAmt}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', fontWeight: 600, color: r.dColor, textAlign: 'right' }}>
                  {r.delta}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10.5px', color: '#8A94A6' }}>
                  {r.date}
                </span>
                <span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: r.stFg, background: r.stBg, borderRadius: 5, padding: '3px 7px', letterSpacing: '0.03em' }}>
                    {r.state}
                  </span>
                </span>
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="#A4AEBD" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M2.2 4l2.8 2.8L7.8 4" />
                </svg>
              </div>
            ))}

            {/* Mockup Exception Details Box */}
            <div style={{ background: '#FEFAF0', borderBottom: '1px solid #F0E4C8', padding: '16px 20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 5.2v4M8 11.2h.01M8 2.2l5.6 11.6H2.4z" />
                </svg>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#8A5E00', letterSpacing: '-0.01em' }}>
                  Exception — provider captured a payment the Hub recorded as expired
                </span>
                <div style={{ flex: 1 }}></div>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10.5px', color: '#A5834A' }}>
                  psp_ch_4Q7J2L · raised 15 Sep 04:10 by the match job
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 296px', gap: 14, alignItems: 'start' }}>
                {/* Box 1: PSP Settlement Line */}
                <div style={{ background: '#fff', border: '1px solid #F0E4C8', borderRadius: 8, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#A5834A' }}>
                    PSP settlement line
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>Amount</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', fontWeight: 600, color: '#12203C' }}>900.00 EGP</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>Captured at</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#12203C' }}>12 Sep 23:58:41</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>PSP status</span>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#2E6F5E' }}>Captured</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>Order ref</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#12203C' }}>SH-COURSE-4402</span>
                    </div>
                  </div>
                </div>

                {/* Box 2: Hub Record */}
                <div style={{ background: '#fff', border: '1px solid #F0E4C8', borderRadius: 8, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#A5834A' }}>
                    Hub record
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>Amount posted</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', fontWeight: 600, color: exceptionResolved ? '#2E6F5E' : '#C0392B' }}>
                        {exceptionResolved ? '900.00 EGP (Adjusted)' : '0.00 EGP'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>Link expired</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#12203C' }}>12 Sep 23:59:00</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>Hub status</span>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: exceptionResolved ? '#2E6F5E' : '#8A94A6' }}>
                        {exceptionResolved ? 'Paid (by Finance Adjustment)' : 'Expired · no webhook received'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', width: 104, flex: 'none' }}>Internal txn</span>
                      <Link href="/transactions/txn_01J8F4KQ2M" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#2E6F5E', textDecoration: 'none' }}>
                        txn_01J8EX1TD5 →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Box 3: Resolution Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#A5834A' }}>
                    Resolution · Finance Admin
                  </span>
                  <button
                    disabled={exceptionResolved}
                    onClick={() => handleResolveException('Post adjustment entry & set Paid')}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#fff',
                      background: exceptionResolved ? '#A4AEBD' : '#12203C',
                      borderRadius: 7,
                      padding: '9px 13px',
                      textAlign: 'center',
                      border: 'none',
                      cursor: exceptionResolved ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {exceptionResolved ? 'Resolved ✓' : 'Post adjustment entry & set Paid'}
                  </button>
                  <button
                    onClick={() => handleResolveException('Flagged for PSP enquiry')}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#5A6A80',
                      background: '#fff',
                      border: '1px solid #DDD0AE',
                      borderRadius: 7,
                      padding: '9px 13px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    Flag for PSP enquiry
                  </button>
                  <button
                    onClick={() => handleResolveException('Marked Needs Review')}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#5A6A80',
                      background: '#fff',
                      border: '1px solid #DDD0AE',
                      borderRadius: 7,
                      padding: '9px 13px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    Mark Needs Review
                  </button>
                  <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#A5834A', lineHeight: 1.5 }}>
                    Every option writes an audit entry with actor, reason and before/after values. None of them edits the original ledger rows.
                  </span>
                </div>
              </div>
            </div>

            {/* Pagination Footer */}
            <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
              <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#8A94A6' }}>
                Showing lines 1–{displayedRows.length} of 429 · sorted by match state
              </span>
              <div style={{ flex: 1 }}></div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#C9D2DE', cursor: 'not-allowed' }}>Previous</span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#2E6F5E', cursor: 'pointer' }}>Next</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
