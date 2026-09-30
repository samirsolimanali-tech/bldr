'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { matchVenture } from '../../components/HubTopBar';

interface RefundItem {
  id: string;
  txnId: string;
  orderRef: string;
  venture: string;
  customer: string;
  amount: number;
  reason: string;
  requestedBy: string;
  requestedAt: string;
  status: 'PENDING_APPROVAL' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
}

const INITIAL_REFUNDS: RefundItem[] = [
  {
    id: 'rfnd_01J8F90A11',
    txnId: 'txn_01J8F4KQ2M',
    orderRef: 'SH-COURSE-4581',
    venture: 'StudyHub',
    customer: 'Ahmed Ali (ahmed@example.com)',
    amount: 750,
    reason: 'Customer enrolled in wrong term group, requests immediate refund.',
    requestedBy: 'usr_sarah (Venture Admin)',
    requestedAt: '15 Sep 2026 · 11:20:04',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'rfnd_01J8F90B22',
    txnId: 'txn_01J8E09A1B',
    orderRef: 'EH-ARAB-0091',
    venture: 'EL HESA',
    customer: 'Nader Tarek (nader@elhesa.eg)',
    amount: 450,
    reason: 'Duplicate payment on Fawry Kiosk.',
    requestedBy: 'usr_fatima (EL HESA Admin)',
    requestedAt: '15 Sep 2026 · 09:44:12',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'rfnd_01J8F90C33',
    txnId: 'txn_01J8F4KP9X',
    orderRef: 'AC-CFA-8812',
    venture: 'Apex Classes',
    customer: 'Khaled Omar (khaled.omar@gmail.com)',
    amount: 6500,
    reason: 'Medical withdrawal prior to course start date.',
    requestedBy: 'usr_omar (Apex Admin)',
    requestedAt: '14 Sep 2026 · 16:15:30',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'rfnd_01J8F90D44',
    txnId: 'txn_01J8D58M7Q',
    orderRef: 'CH-RESUME-1049',
    venture: 'Career Hub',
    customer: 'Laila Mostafa (laila.m@yahoo.com)',
    amount: 1200,
    reason: 'Satisfaction guarantee claim.',
    requestedBy: 'usr_gamal (Super Admin)',
    requestedAt: '14 Sep 2026 · 14:02:18',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'rfnd_01J8F90E55',
    txnId: 'txn_01J8C9901A',
    orderRef: 'SH-BUNDLE-0199',
    venture: 'StudyHub',
    customer: 'Mona Zaki (mona.z@gmail.com)',
    amount: 1200,
    reason: 'Course canceled due to instructor relocation.',
    requestedBy: 'usr_sarah (Venture Admin)',
    requestedAt: '13 Sep 2026 · 18:30:00',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'rfnd_01J8E77P10',
    txnId: 'txn_01J8B1123X',
    orderRef: 'SH-COURSE-4100',
    venture: 'StudyHub',
    customer: 'Youssef Adel (youssef@eg.net)',
    amount: 900,
    reason: 'Accidental double charge.',
    requestedBy: 'usr_sarah (Venture Admin)',
    requestedAt: '10 Sep 2026 · 10:15:00',
    status: 'COMPLETED',
  },
];

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundItem[]>(INITIAL_REFUNDS);
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [tab, setTab] = useState<'pending' | 'completed' | 'all'>('pending');
  const [notification, setNotification] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_active_venture');
      if (stored) setSelectedVenture(stored);
    } catch (e) {}

    const handleVentureChanged = (e: any) => {
      if (e?.detail) setSelectedVenture(e.detail);
    };
    window.addEventListener('bldr:venture-changed', handleVentureChanged);
    return () => window.removeEventListener('bldr:venture-changed', handleVentureChanged);
  }, []);

  const pendingCount = refunds.filter(r => r.status === 'PENDING_APPROVAL').length;

  const handleApprove = (id: string) => {
    setRefunds(refunds.map(r => r.id === id ? { ...r, status: 'COMPLETED' } : r));
    setNotification(`Refund ${id} approved. Reversal ledger rows posted and PSP refund API invoked.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      setRefunds(refunds.map(r => r.id === id ? { ...r, status: 'REJECTED', reason: `${r.reason} [REJECTED: ${reason}]` } : r));
      setNotification(`Refund ${id} rejected.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const filtered = refunds.filter(r => {
    const matchesVenture = matchVenture(r.venture, selectedVenture);
    const matchesTab =
      tab === 'all' ? true :
      tab === 'pending' ? r.status === 'PENDING_APPROVAL' :
      r.status === 'COMPLETED' || r.status === 'REJECTED';
    return matchesVenture && matchesTab;
  });

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Refunds"
          crumb="Finance / Refunds"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header Strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setTab('pending')}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: tab === 'pending' ? '#2E6F5E' : '#5A6A80',
                  background: tab === 'pending' ? '#E6EFEB' : '#fff',
                  border: `1px solid ${tab === 'pending' ? '#2E6F5E' : '#E3E8EF'}`,
                  borderRadius: 7,
                  padding: '7px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Pending Approval
                <span style={{ background: '#2E6F5E', color: '#fff', fontSize: 10, borderRadius: 10, padding: '1px 6px' }}>
                  {pendingCount}
                </span>
              </button>
              <button
                onClick={() => setTab('completed')}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: tab === 'completed' ? '#2E6F5E' : '#5A6A80',
                  background: tab === 'completed' ? '#E6EFEB' : '#fff',
                  border: `1px solid ${tab === 'completed' ? '#2E6F5E' : '#E3E8EF'}`,
                  borderRadius: 7,
                  padding: '7px 14px',
                  cursor: 'pointer',
                }}
              >
                Settled / Completed
              </button>
              <button
                onClick={() => setTab('all')}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: tab === 'all' ? '#2E6F5E' : '#5A6A80',
                  background: tab === 'all' ? '#E6EFEB' : '#fff',
                  border: `1px solid ${tab === 'all' ? '#2E6F5E' : '#E3E8EF'}`,
                  borderRadius: 7,
                  padding: '7px 14px',
                  cursor: 'pointer',
                }}
              >
                All Requests ({refunds.length})
              </button>
            </div>

            <span style={{ fontSize: 11, color: '#8A94A6', fontWeight: 600 }}>
              Finance Admin Authorization Required · PRD §8.8
            </span>
          </div>

          {notification && (
            <div style={{ padding: '10px 16px', background: '#E6EFEB', border: '1px solid #2E6F5E', borderRadius: 8, color: '#2E6F5E', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="2"><path d="M3.5 8.5l3 3 6-6" /></svg>
              {notification}
            </div>
          )}

          {/* Refunds Table */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 120px 140px minmax(0,1fr) 110px 140px 180px',
                padding: '0 18px',
                height: 38,
                alignItems: 'center',
                background: '#FAFBFD',
                borderBottom: '1px solid #E3E8EF',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Refund ID</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Venture</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Txn Ref</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Reason / Customer</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Amount</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'center' }}>Status</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Action</span>
            </div>

            {filtered.map(r => (
              <div
                key={r.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 120px 140px minmax(0,1fr) 110px 140px 180px',
                  padding: '12px 18px',
                  alignItems: 'center',
                  borderBottom: '1px solid #F0F3F7',
                  gap: 10,
                }}
              >
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#12203C', fontWeight: 600 }}>
                  {r.id}
                </span>

                <span style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>
                  {r.venture}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link href={`/transactions/${r.txnId}`} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#2E6F5E', textDecoration: 'none' }}>
                    {r.txnId} →
                  </Link>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#8A94A6' }}>{r.orderRef}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>{r.reason}</span>
                  <span style={{ fontSize: 10.5, color: '#8A94A6' }}>{r.customer} · {r.requestedBy}</span>
                </div>

                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600, color: '#C0392B', textAlign: 'right' }}>
                  EGP {r.amount.toFixed(2)}
                </span>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: r.status === 'COMPLETED' ? '#2E6F5E' : r.status === 'PENDING_APPROVAL' ? '#B8860B' : '#C0392B',
                      background: r.status === 'COMPLETED' ? '#E6EFEB' : r.status === 'PENDING_APPROVAL' ? '#FBF3E0' : '#FDF0ED',
                      borderRadius: 20,
                      padding: '3px 8px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  {r.status === 'PENDING_APPROVAL' ? (
                    <>
                      <button
                        onClick={() => handleApprove(r.id)}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#fff',
                          background: '#2E6F5E',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(r.id)}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#C0392B',
                          background: '#fff',
                          border: '1px solid #E3E8EF',
                          borderRadius: 6,
                          padding: '6px 8px',
                          cursor: 'pointer',
                        }}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: '#8A94A6', fontWeight: 600 }}>Settled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
