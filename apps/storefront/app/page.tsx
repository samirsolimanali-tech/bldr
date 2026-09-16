'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter } from '@bldr/ui';

export default function HomePage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F5F7' }}>
      {/* ─── Navigation ────────────────────────────────────────── */}
      <BldrNav lang={lang} onLanguageChange={setLang} />

      <main style={{ flex: 1 }}>
        {/* ─── Hero Section ──────────────────────────────────────── */}
        <section style={{ padding: '80px 32px 90px', background: '#F4F5F7' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: 54, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                alignSelf: 'flex-start',
                height: 32,
                padding: '0 14px',
                borderRadius: 999,
                background: '#FFFFFF',
                border: '1px solid rgba(20,20,22,0.08)',
                boxShadow: '0 2px 6px rgba(20,20,22,0.04)',
              }}>
                <span style={{ display: 'block', width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(90deg, #D10721, #FD9426)' }} />
                <span style={{ fontSize: 12.5, fontWeight: 400, color: '#47454A' }}>
                  Cairo · venture studio, founded July 2026
                </span>
              </div>

              <h1 style={{
                margin: 0,
                fontSize: 'clamp(36px, 5vw, 60px)',
                lineHeight: 1.06,
                fontWeight: 500,
                letterSpacing: '-0.045em',
                color: '#141416',
                textWrap: 'pretty',
              }}>
                We build the product, the brand, and the team that runs it.
              </h1>

              <p style={{
                margin: 0,
                maxWidth: 520,
                fontSize: 17,
                lineHeight: 1.68,
                fontWeight: 300,
                color: '#47454A',
              }}>
                bldr operates specialist units and builds its own ventures. You work with the units you need and keep one point of contact for all of it — nobody hands the outcome to somebody else.
              </p>

              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <a
                  href="mailto:contact@bldr.io"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 50,
                    padding: '0 28px',
                    borderRadius: 999,
                    background: '#141416',
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 400,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(20,20,22,0.14)',
                  }}
                >
                  Start a project
                </a>
                <Link
                  href="/pay/sh-8k2m9q"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 50,
                    padding: '0 26px',
                    borderRadius: 999,
                    background: '#FFFFFF',
                    border: '1px solid rgba(20,20,22,0.12)',
                    color: '#141416',
                    fontSize: 15,
                    fontWeight: 400,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(20,20,22,0.04)',
                  }}
                >
                  Try Central Payment Page →
                </Link>
              </div>
            </div>

            {/* Studio Visual Mosaic */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '140px 140px 110px',
              gap: 12,
            }}>
              <div style={{
                gridColumn: 'span 2',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(20,20,22,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FD9426' }}>Ventures &amp; Products</span>
                  <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#8A94A6' }}>Cairo Studio</span>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 500, color: '#141416', letterSpacing: '-0.02em' }}>StudyHub · منصة الحصة · Apex</div>
                  <div style={{ fontSize: 13, color: '#47454A', fontWeight: 300, marginTop: 4 }}>Integrated seamlessly via bldr Central Payment Hub</div>
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#D10721' }}>ORCHESTRATION</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#141416' }}>1 Unified API, 0 PSP Lock-in</span>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#2E6F5E' }}>PAYMENT HUBS</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#141416' }}>Geidea · Fawry · Meeza</span>
              </div>

              <div style={{
                gridColumn: 'span 2',
                background: '#141416',
                color: '#FFFFFF',
                borderRadius: 16,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Central Payment Hub Admin</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>Super Admin &amp; Finance Management</div>
                </div>
                <a
                  href="http://localhost:3002"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: '#2E6F5E',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Open Hub →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── What's Broken Section ─────────────────────────────── */}
        <section style={{ padding: '0 32px 84px', background: '#F4F5F7' }}>
          <div style={{
            maxWidth: 1280,
            margin: '0 auto',
            background: '#FFFFFF',
            border: '1px solid rgba(20,20,22,0.08)',
            borderRadius: 22,
            padding: '48px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center', marginBottom: 36 }}>
              <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D10721' }}>
                What&apos;s Broken in Traditional Models
              </span>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 500, letterSpacing: '-0.04em', color: '#141416', margin: 0 }}>
                Everyone did their part. Nobody owned the outcome.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { title: 'Software House', sub: 'waiting on final specs', angle: '-2deg' },
                { title: 'Marketing Agency', sub: "hasn't seen the product", angle: '1.5deg' },
                { title: 'Consultant', sub: 'left after the slide deck', angle: '-1deg' },
                { title: 'Your Team', sub: 'never trained to run it', angle: '2deg' },
                { title: 'Systems Vendor', sub: 'scope ended at handover', angle: '-1.5deg' },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F4F5F7',
                    border: '1px solid rgba(20,20,22,0.08)',
                    borderRadius: 14,
                    padding: '20px 22px',
                    boxShadow: '0 4px 12px rgba(20,20,22,0.04)',
                    transform: `rotate(${card.angle})`,
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#141416', letterSpacing: '-0.02em' }}>{card.title}</div>
                  <div style={{ marginTop: 6, fontSize: 13.5, fontWeight: 300, color: '#47454A' }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How We're Built ───────────────────────────────────── */}
        <section id="built" style={{ padding: '56px 32px 84px', background: '#F4F5F7' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: 64, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 110 }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D10721' }}>
                How We&apos;re Built
              </span>
              <h2 style={{ margin: 0, fontSize: 44, lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.045em', color: '#141416' }}>
                Different specialisms.<br />One accountability line.
              </h2>
              <p style={{ margin: 0, maxWidth: 420, fontSize: 16.5, lineHeight: 1.68, fontWeight: 300, color: '#47454A' }}>
                The same specialists you would otherwise hire separately, working off one plan, one schedule and one owner. Units are added when the work calls for them.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', paddingLeft: 24, borderLeft: '2px solid rgba(20,20,22,0.08)' }}>
              {[
                { title: 'bldr Management', was: 'was: the consultant who left', desc: 'Strategy, business development, partnerships & financial architecture' },
                { title: 'Tech House', was: 'was: the software house', desc: 'Software platforms, central payment orchestration, automated infrastructure' },
                { title: 'Sidekick', was: 'was: the marketing agency', desc: 'Branding, advertising, content, performance campaigns' },
                { title: 'Career Hub', was: 'was: your untrained team', desc: 'Professional training, workshops, operations and team handover' },
              ].map((unit, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(20,20,22,0.08)',
                    borderRadius: 14,
                    padding: '20px 24px',
                    boxShadow: '0 2px 8px rgba(20,20,22,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ fontSize: 17, fontWeight: 500, color: '#141416', letterSpacing: '-0.02em' }}>{unit.title}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 300, color: '#6B6970' }}>{unit.was}</div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: '#47454A' }}>{unit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Education & EdTech Showcase ───────────────────────── */}
        <section id="education" style={{ background: '#141416', padding: '84px 32px', color: '#FFFFFF' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 60, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FD9426' }}>
                Education &amp; EdTech
              </span>
              <h2 style={{ margin: 0, fontSize: 44, lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.045em', color: '#FFFFFF' }}>
                We have run the thing we are asked to build.
              </h2>
              <p style={{ margin: 0, maxWidth: 480, fontSize: 16.5, lineHeight: 1.68, fontWeight: 300, color: 'rgba(255,255,255,0.72)' }}>
                Plenty of software houses will build you a learning platform. Very few have run a cohort, priced a course, or managed live payment gateway reconciliation in Cairo. When they haven&apos;t, you end up teaching the vendor your business.
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                <Link
                  href="/pay/sh-8k2m9q"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 48,
                    padding: '0 24px',
                    borderRadius: 999,
                    background: '#FFFFFF',
                    color: '#141416',
                    fontSize: 14.5,
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  View Sample Hosted Checkout →
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ fontSize: 19, fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.03em' }}>StudyHub</div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: 'rgba(255,255,255,0.66)' }}>
                  An Arabic-first operating system for tutors and tutoring centres. Integrates directly into the bldr Central Payment Hub for instant checkout.
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ fontSize: 19, fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.03em' }}>منصة الحصة</div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: 'rgba(255,255,255,0.66)' }}>
                  A gamified Egyptian K-12 learning platform with micro-transactions, automated coupon validation, and Fawry/Geidea integrations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How We Work Section ───────────────────────────────── */}
        <section id="work" style={{ padding: '84px 32px', background: '#F4F5F7' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', background: '#FFFFFF', border: '1px solid rgba(20,20,22,0.08)', borderRadius: 22, padding: '48px 42px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: 54, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D10721' }}>
                  How We Work
                </span>
                <h2 style={{ margin: 0, fontSize: 38, lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.045em', color: '#141416' }}>
                  A sequence, not a proposal cycle.
                </h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.68, fontWeight: 300, color: '#47454A' }}>
                  Every engagement starts with a paid consulting session. It is the cleanest way to evaluate our alignment, and the fee is credited against the project if one follows.
                </p>
                <div style={{ fontSize: 13.5, fontWeight: 300, color: '#6B6970' }}>
                  Fixed price, fixed duration, a written deliverable you keep.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { step: '01', title: 'Consulting Session', desc: 'Architecture, scope, and strategic roadmap.' },
                  { step: '02', title: 'Proposition & Brand', desc: 'Design tokens, copy, and positioning.' },
                  { step: '03', title: 'Build & Integration', desc: 'Full-stack engineering & payment orchestration.' },
                  { step: '04', title: 'Handover & Run', desc: 'Team training and production live release.' },
                ].map((s) => (
                  <div key={s.step} style={{ display: 'flex', gap: 16, padding: '14px 18px', background: '#F4F5F7', borderRadius: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#D10721', fontFamily: 'monospace' }}>{s.step}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: '#141416' }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: '#47454A', fontWeight: 300 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <BldrFooter />
    </div>
  );
}
