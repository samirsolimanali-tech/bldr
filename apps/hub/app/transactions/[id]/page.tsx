'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HubSidebar from '../../../components/HubSidebar';
import HubTopBar from '../../../components/HubTopBar';

export default function TransactionDetailPage() {
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('StudyHub');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('750.00');
  const [refundReason, setRefundReason] = useState('Customer requested cancellation within 14 days');
  const [isRefunded, setIsRefunded] = useState(false);
  const [webhookSent, setWebhookSent] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);

  const timelineEvents = [
    {
      time: '14:32:09.412',
      title: 'Venture webhook delivered',
      titleColor: '#1B2A4A',
      tag: 'OUTBOUND',
      tagFg: '#2E6F5E',
      tagBg: '#E6EFEB',
      body: 'HTTP 200 OK returned by https://api.studyhub.eg/v1/payments/events within 148ms.',
      actor: 'webhook-worker',
      dot: '#2E6F5E',
    },
    {
      time: '14:32:08.502',
      title: 'Duplicate webhook ignored (AC-05)',
      titleColor: '#5A6A80',
      tag: 'IDEMPOTENT',
      tagFg: '#5A6A80',
      tagBg: '#EEF1F5',
      body: 'Second delivery of evt_psp_9a2f1c received from PSP-A. Identified via idempotency cache and discarded without reprocessing.',
      actor: 'PSP-A IP 196.221.4.12',
      dot: '#8A94A6',
    },
    {
      time: '14:32:08.310',
      title: 'Ledger entries posted',
      titleColor: '#1B2A4A',
      tag: 'FINANCE',
      tagFg: '#2C5F9E',
      tagBg: '#E8EEF7',
      body: 'Double-entry accounting recorded: Credit EGP 750.00 to StudyHub escrow, Debit EGP 18.75 PSP fee, Debit EGP 2.63 VAT.',
      actor: 'ledger-engine',
      dot: '#2E6F5E',
    },
    {
      time: '14:32:08.188',
      title: 'Webhook signature verified',
      titleColor: '#2E6F5E',
      tag: 'HMAC-SHA256',
      tagFg: '#2E6F5E',
      tagBg: '#E6EFEB',
      body: 'Payload signature matched secret key whsec_live_... Payment state transitioned from PENDING to PAID.',
      actor: 'gateway-receiver',
      dot: '#2E6F5E',
    },
    {
      time: '14:32:08.012',
      title: 'Inbound PSP notification received',
      titleColor: '#1B2A4A',
      body: 'PSP-A callback received with event type charge.completed. Amount 75,000 piasters.',
      actor: 'PSP-A IP 196.221.4.12',
      dot: '#2C5F9E',
    },
    {
      time: '14:31:42.890',
      title: '3-D Secure authentication passed',
      titleColor: '#1B2A4A',
      body: 'Customer completed OTP verification via issuing bank (Banque Misr Visa card ending 4242).',
      actor: 'acs-redirect',
      dot: '#2C5F9E',
    },
    {
      time: '14:30:15.220',
      title: 'Payment checkout opened',
      titleColor: '#5A6A80',
      body: 'Hosted checkout page rendered at pay.bldr.com/l/sh-8k2m9q. Client IP: 156.204.18.91 (Cairo, Egypt).',
      actor: 'customer-browser',
      dot: '#8A94A6',
    },
    {
      time: '14:29:50.110',
      title: 'Payment link created',
      titleColor: '#5A6A80',
      body: 'Link generated for order SH-COURSE-4581 with amount EGP 750.00 and 24h expiration.',
      actor: 'usr_gamal',
      dot: '#8A94A6',
    },
  ];

  const ledgerRows = [
    { type: 'Customer payment', amount: '750.00', dir: 'CREDIT', dirFg: '#2E6F5E', dirBg: '#E6EFEB', ref: 'cr_01J8F4KQ2M_gross', posted: '14 Sep 14:32:08' },
    { type: 'PSP processing fee', amount: '18.75', dir: 'DEBIT', dirFg: '#C0392B', dirBg: '#FDF0ED', ref: 'dr_01J8F4KQ2M_fee', posted: '14 Sep 14:32:08' },
    { type: 'VAT on processing fee (14%)', amount: '2.63', dir: 'DEBIT', dirFg: '#C0392B', dirBg: '#FDF0ED', ref: 'dr_01J8F4KQ2M_vat', posted: '14 Sep 14:32:08' },
  ];

  if (isRefunded) {
    ledgerRows.push(
      { type: 'Customer refund', amount: '750.00', dir: 'DEBIT', dirFg: '#C0392B', dirBg: '#FDF0ED', ref: 'dr_01J8F4KQ2M_rfnd', posted: 'Just now' },
      { type: 'PSP fee reversal', amount: '18.75', dir: 'CREDIT', dirFg: '#2E6F5E', dirBg: '#E6EFEB', ref: 'cr_01J8F4KQ2M_rev', posted: 'Just now' },
    );
  }

  const handleResendWebhook = () => {
    setWebhookSent(true);
    setTimeout(() => setWebhookSent(false), 3000);
  };

  const handleProcessRefund = () => {
    setIsRefunded(true);
    setShowRefundModal(false);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="SH-COURSE-4581"
          crumb="Transactions / txn_01J8F4KQ2M"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top Status and Financial Summary Strip */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Status
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#fff',
                    background: isRefunded ? '#C0392B' : '#2E6F5E',
                    borderRadius: 20,
                    padding: '5px 13px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {isRefunded ? 'REFUNDED' : 'PAID'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6' }}>
                  {isRefunded ? 'refund posted to ledger' : 'confirmed by verified webhook'}
                </span>
              </div>
            </div>

            <div style={{ width: 1, height: 42, background: '#E3E8EF' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Amount paid
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 22, fontWeight: 600, color: '#12203C', letterSpacing: '-0.02em', lineHeight: 1 }}>
                EGP 750.00
              </span>
            </div>

            <div style={{ width: 1, height: 42, background: '#E3E8EF' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Refundable balance
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 15, fontWeight: 600, color: isRefunded ? '#8A94A6' : '#12203C', lineHeight: 1.2 }}>
                {isRefunded ? 'EGP 0.00' : 'EGP 750.00'}
              </span>
            </div>

            <div style={{ width: 1, height: 42, background: '#E3E8EF' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                Paid at
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12.5px', color: '#1B2A4A', lineHeight: 1.2 }}>
                14 Sep 2026 · 14:32:08 (UTC+3)
              </span>
            </div>

            <div style={{ flex: 1 }}></div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {webhookSent && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2E6F5E' }}>Webhook sent ✓</span>
              )}
              <button
                onClick={handleResendWebhook}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#5A6A80',
                  border: '1px solid #E3E8EF',
                  borderRadius: 7,
                  padding: '8px 13px',
                  background: '#fff',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Resend venture webhook
              </button>
              <button
                onClick={() => alert('Exporting transaction receipt PDF/CSV...')}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#5A6A80',
                  border: '1px solid #E3E8EF',
                  borderRadius: 7,
                  padding: '8px 13px',
                  background: '#fff',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Export
              </button>
              <button
                disabled={isRefunded}
                onClick={() => setShowRefundModal(true)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#fff',
                  background: isRefunded ? '#A4AEBD' : '#12203C',
                  border: 'none',
                  borderRadius: 7,
                  padding: '8px 15px',
                  cursor: isRefunded ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Request refund
              </button>
            </div>
          </div>

          {/* 2-Column Content Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: 16, alignItems: 'start' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Event Trail Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 20px 19px', display: 'flex', flexDirection: 'column', gap: 15 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>Event trail</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#8A94A6' }}>
                    {timelineEvents.length} events · append-only
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {timelineEvents.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 13, alignItems: 'stretch' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flex: 'none' }}>
                        <span
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            background: t.dot,
                            border: '2px solid #fff',
                            boxShadow: `0 0 0 1.5px ${t.dot}`,
                            marginTop: 4,
                            flex: 'none',
                          }}
                        />
                        {idx < timelineEvents.length - 1 && (
                          <span style={{ flex: 1, width: 1.5, background: '#E7EBF1' }}></span>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0, paddingBottom: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8A94A6', width: 104, flex: 'none', lineHeight: 1.5 }}>
                          {t.time}
                        </span>

                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 700, color: t.titleColor, letterSpacing: '-0.01em' }}>
                              {t.title}
                            </span>
                            {t.tag && (
                              <span style={{ fontSize: '9.5px', fontWeight: 700, color: t.tagFg, background: t.tagBg, borderRadius: 5, padding: '2px 7px', letterSpacing: '0.03em' }}>
                                {t.tag}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '11.5px', fontWeight: 450, color: '#5A6A80', lineHeight: 1.5 }}>
                            {t.body}
                          </span>
                        </div>

                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10.5px', color: '#A4AEBD', width: 128, flex: 'none', textAlign: 'right', lineHeight: 1.5 }}>
                          {t.actor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ledger Entries Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                    Ledger entries
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#5A6A80', background: '#EEF1F5', borderRadius: 5, padding: '3px 7px', letterSpacing: '0.02em' }}>
                    IMMUTABLE · REVERSAL ONLY
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) 108px 96px 180px 148px',
                    padding: '0 20px',
                    height: 34,
                    alignItems: 'center',
                    background: '#FAFBFD',
                    borderBottom: '1px solid #E3E8EF',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Entry type</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Amount</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'center' }}>Direction</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Reference</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Posted at</span>
                </div>

                {ledgerRows.map((g, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0,1fr) 108px 96px 180px 148px',
                      padding: '0 20px',
                      height: 42,
                      alignItems: 'center',
                      borderBottom: '1px solid #F0F3F7',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1B2A4A' }}>{g.type}</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600, color: '#12203C', textAlign: 'right' }}>
                      {g.amount}
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 700, color: g.dirFg, background: g.dirBg, borderRadius: 5, padding: '3px 7px' }}>
                        {g.dir}
                      </span>
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#5A6A80', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {g.ref}
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8A94A6' }}>
                      {g.posted}
                    </span>
                  </div>
                ))}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) 108px 96px 180px 148px',
                    padding: '0 20px',
                    height: 42,
                    alignItems: 'center',
                    background: '#FAFBFD',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#1B2A4A' }}>Net to bldr</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12.5px', fontWeight: 600, color: '#12203C', textAlign: 'right' }}>
                    {isRefunded ? '0.00' : '728.62'}
                  </span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              {/* Webhook Deliveries Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                    Webhook deliveries
                  </span>
                  <div style={{ flex: 1 }}></div>
                  <button
                    onClick={() => setShowPayloadModal(true)}
                    style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    View raw payloads
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '172px minmax(0,1fr) 172px 78px 132px',
                    padding: '0 20px',
                    height: 34,
                    alignItems: 'center',
                    background: '#FAFBFD',
                    borderBottom: '1px solid #E3E8EF',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Direction</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Event</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Processing</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'center' }}>Attempts</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Last response</span>
                </div>

                {[
                  { dir: 'Outbound · to StudyHub', event: 'payment.succeeded', state: 'DELIVERED (200)', stFg: '#2E6F5E', stBg: '#E6EFEB', attempts: 1, resp: '200 OK · 148ms' },
                  { dir: 'Inbound · from PSP-A', event: 'charge.completed', state: 'VERIFIED & PROCESSED', stFg: '#2E6F5E', stBg: '#E6EFEB', attempts: 1, resp: '200 OK · 38ms' },
                  { dir: 'Inbound · from PSP-A', event: 'charge.completed', state: 'DUPLICATE IGNORED', stFg: '#5A6A80', stBg: '#EEF1F5', attempts: 1, resp: '200 OK · 12ms' },
                ].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '172px minmax(0,1fr) 172px 78px 132px',
                      padding: '0 20px',
                      height: 42,
                      alignItems: 'center',
                      borderBottom: '1px solid #F0F3F7',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#5A6A80' }}>{h.dir}</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#12203C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {h.event}
                    </span>
                    <span>
                      <span style={{ fontSize: '9.5px', fontWeight: 700, color: h.stFg, background: h.stBg, borderRadius: 5, padding: '3px 8px' }}>
                        {h.state}
                      </span>
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11.5px', color: '#5A6A80', textAlign: 'center' }}>
                      {h.attempts}
                    </span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#5A6A80', textAlign: 'right' }}>
                      {h.resp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Identifiers Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                  Identifiers
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {[
                    { label: 'Hub Transaction ID', value: 'txn_01J8F4KQ2M' },
                    { label: 'Order reference', value: 'SH-COURSE-4581' },
                    { label: 'PSP charge ID', value: 'psp_ch_9a2f1c890' },
                    { label: 'Idempotency key', value: 'idemp_7718293041' },
                    { label: 'Session ID', value: 'ses_01J8F4K81M' },
                    { label: 'Payment link', value: 'pay.bldr.com/l/sh-8k2m9q' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>
                        {item.label}
                      </span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#12203C', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Money Breakdown Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                  Money breakdown
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#5A6A80', flex: 1 }}>Gross paid</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 600, color: '#12203C' }}>EGP 750.00</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#5A6A80', flex: 1 }}>PSP fee · 2.5%</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#C0392B' }}>− 18.75</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#5A6A80', flex: 1 }}>VAT on fee · 14%</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#C0392B' }}>− 2.63</span>
                  </div>
                  <div style={{ height: 1, background: '#E3E8EF', margin: '2px 0' }}></div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#1B2A4A', flex: 1 }}>Net revenue</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600, color: '#12203C' }}>
                      {isRefunded ? 'EGP 0.00' : 'EGP 728.62'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#5A6A80', flex: 1 }}>Refunded to date</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: isRefunded ? '#C0392B' : '#8A94A6' }}>
                      {isRefunded ? 'EGP 750.00' : 'EGP 0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer & Product Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                  Customer &amp; product
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#EEF1F5', color: '#5A6A80', fontSize: '11.5px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    AA
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1B2A4A' }}>Ahmed Ali</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10.5px', color: '#8A94A6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      ahmed@example.com · +20 10 •• •• 4471
                    </span>
                  </div>
                </div>
                <div style={{ height: 1, background: '#F0F3F7' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>Venture</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#12203C' }}>StudyHub</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>Product</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#12203C' }}>Math Course — Term 1</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>Method</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#12203C' }}>Card · Visa •••• 4242</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>3-D Secure</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#2E6F5E' }}>Passed</span>
                  </div>
                </div>
              </div>

              {/* Provider & Settlement Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                  Provider &amp; settlement
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>Provider</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#12203C' }}>PSP-A · Production</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>PSP latency</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#12203C' }}>284 ms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>Settlement batch</span>
                    <Link href="/reconciliation" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#2E6F5E', textDecoration: 'none', fontWeight: 600 }}>
                      STL-2026-09-14 →
                    </Link>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A94A6', width: 118, flex: 'none' }}>Match state</span>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 5, padding: '3px 8px' }}>
                      MATCHED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
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
          <div
            style={{
              width: 480,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#12203C' }}>Request Refund (PRD §8.8)</span>
              <button onClick={() => setShowRefundModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#8A94A6' }}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Refund Amount (EGP)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                  style={{
                    width: '100%',
                    height: 38,
                    border: '1px solid #E3E8EF',
                    borderRadius: 7,
                    padding: '0 12px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 14,
                    marginTop: 4,
                  }}
                />
                <span style={{ fontSize: 11, color: '#8A94A6', marginTop: 4, display: 'block' }}>Max refundable: EGP 750.00</span>
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Reason for refund (Audit logged)</label>
                <textarea
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    border: '1px solid #E3E8EF',
                    borderRadius: 7,
                    padding: '8px 12px',
                    fontSize: 12,
                    marginTop: 4,
                  }}
                />
              </div>
              <div style={{ padding: 12, background: '#FEFAF0', border: '1px solid #F0E4C8', borderRadius: 6, fontSize: 11.5, color: '#8A5E00' }}>
                <strong>Important:</strong> Refunds write balancing debit reversal ledger rows and cannot be undone.
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #E3E8EF', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowRefundModal(false)}
                style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#5A6A80' }}
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: '#C0392B', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raw Payload Modal */}
      {showPayloadModal && (
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
          <div
            style={{
              width: 580,
              background: '#fff',
              borderRadius: 10,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>Raw Webhook Payload (event evt_psp_9a2f1c)</span>
              <button onClick={() => setShowPayloadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#8A94A6' }}>✕</button>
            </div>
            <pre style={{ margin: 0, padding: 18, background: '#12203C', color: '#A5D6A7', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', maxHeight: 380, overflowY: 'auto' }}>
{JSON.stringify({
  id: "evt_psp_9a2f1c890",
  type: "charge.completed",
  created_at: 1789482728,
  data: {
    object: {
      id: "psp_ch_9a2f1c890",
      amount: 75000,
      currency: "EGP",
      status: "captured",
      customer: {
        name: "Ahmed Ali",
        email: "ahmed@example.com",
        phone: "+201011223344"
      },
      metadata: {
        hub_txn_id: "txn_01J8F4KQ2M",
        order_ref: "SH-COURSE-4581",
        venture: "studyhub"
      }
    }
  },
  signature_header: "t=1789482728,v1=9a2fc819d9e037b4e8574..."
}, null, 2)}
            </pre>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #E3E8EF', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowPayloadModal(false)} style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
