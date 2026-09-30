'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ─── Case Studies Data ─────────────────────────────────────── */
interface Metric { value: string; label: string; }
interface CaseStudy {
  slug: string;
  category: string;
  title: string;
  client: string;
  year: string;
  tagline: string;
  gradient: string;
  icon: string;
  metrics: Metric[];
  overview: string;
  challenge: string;
  solution: string;
  results: string;
  deliverables: string[];
  techStack: string[];
  testimonial?: { quote: string; author: string; role: string; avatar: string; avatarColor: string; };
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'medconnect-portal',
    category: 'Digital Platform',
    title: 'MedConnect Telehealth Platform',
    client: 'MedConnect Regional Health',
    year: '2025',
    tagline: 'Encrypted real-time patient booking, secure video telemetry, and multi-clinic doctor scheduling at scale.',
    gradient: 'linear-gradient(135deg, #0C4A6E 0%, #0EA5E9 100%)',
    icon: 'health',
    metrics: [
      { value: '38,000+', label: 'Patients Managed' },
      { value: '99.95%', label: 'Platform Uptime' },
      { value: '<600ms', label: 'Dashboard Load' },
      { value: '120+', label: 'Doctors Onboarded' },
    ],
    overview: 'A secure, HIPAA-aligned healthcare portal connecting patients with specialized clinicians for virtual consultations, electronic medical records, and unified multi-tenant scheduling across 12 clinics.',
    challenge: 'Scattered booking processes over WhatsApp and slow legacy hospital software resulted in frequent double-bookings, long patient wait times, and high administrative burnout. The client needed a unified system that could scale across multiple clinic locations.',
    solution: 'We designed and built a cloud-native telehealth platform with encrypted video consultations, real-time appointment scheduling, an EMR module, and a multi-tenant admin dashboard. The system supports 12 independent clinic tenants under one unified infrastructure.',
    results: 'Within 6 months of launch, the platform reduced administrative overhead by 65%, eliminated double-bookings entirely, and achieved 99.95% uptime. Patient satisfaction scores improved from 6.2/10 to 9.1/10.',
    deliverables: [
      'Multi-tenant Next.js web application',
      'Real-time video consultation module (WebRTC)',
      'Electronic Medical Records (EMR) system',
      'Automated appointment scheduling & reminders',
      'Admin analytics dashboard',
      'HIPAA-compliant data architecture',
      'Mobile-responsive patient portal',
    ],
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'WebRTC', 'Redis', 'AWS', 'Docker'],
    testimonial: {
      quote: 'Bldr built our entire platform in record time. The quality is exceptional and they understood our vision from day one. The platform has transformed how we deliver care.',
      author: 'Ahmed Khalil',
      role: 'CEO, MedConnect Regional Health',
      avatar: 'AK',
      avatarColor: '#0EA5E9',
    },
  },
  {
    slug: 'ecommerce-growth',
    category: 'Marketing & Growth',
    title: 'E-Commerce Growth Engine',
    client: 'GrowthCo MENA',
    year: '2025',
    tagline: 'A full-stack performance marketing engine that tripled revenue in 4 months.',
    gradient: 'linear-gradient(135deg, #D10721 0%, #FD9426 100%)',
    icon: 'growth',
    metrics: [
      { value: '3.2x', label: 'Average ROAS' },
      { value: '+180%', label: 'Revenue Growth' },
      { value: '65%', label: 'Lower CAC' },
      { value: '4 Months', label: 'To Break Records' },
    ],
    overview: 'A comprehensive performance marketing overhaul for a MENA-based e-commerce brand, combining paid acquisition, conversion rate optimization, and data infrastructure rebuilding.',
    challenge: 'The client was burning budget on poorly structured campaigns with a 0.9x ROAS and no clear attribution model. Their product pages had a 3.2% conversion rate and their email flows were generating near-zero revenue.',
    solution: 'We rebuilt their entire paid acquisition stack — restructuring Meta and Google campaigns with audience segmentation, creative testing frameworks, and server-side conversion tracking. In parallel, we redesigned product pages and built automated email sequences.',
    results: 'ROAS improved from 0.9x to 3.2x within 60 days. Monthly revenue grew by 180% over 4 months. Customer acquisition cost dropped 65%. Email revenue now accounts for 28% of total revenue.',
    deliverables: [
      'Full Meta & Google Ads account restructure',
      'Creative testing framework & ad production',
      'Conversions API server-side tracking setup',
      'Product page CRO redesign (6 pages)',
      'Klaviyo email automation flows',
      'Weekly ROAS reporting dashboard',
      'Attribution modeling & analytics setup',
    ],
    techStack: ['Meta Ads', 'Google Ads', 'Klaviyo', 'Shopify', 'Google Analytics 4', 'Looker Studio'],
    testimonial: {
      quote: 'The marketing campaigns Bldr ran for us tripled our revenue in 4 months. They are not just an agency — they are a genuine growth partner who understands the numbers.',
      author: 'Sara Al-Rashid',
      role: 'Founder, GrowthCo MENA',
      avatar: 'SR',
      avatarColor: '#10B981',
    },
  },
  {
    slug: 'fintech-saas',
    category: 'Software',
    title: 'FinTech SaaS Dashboard',
    client: 'FinTech Innovations',
    year: '2026',
    tagline: 'A real-time financial management platform processing $2.4M in monthly transactions.',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #7C3AED 100%)',
    icon: 'fintech',
    metrics: [
      { value: '$2.4M', label: 'Monthly Processed' },
      { value: '60,000+', label: 'Active Users' },
      { value: '<200ms', label: 'API Response' },
      { value: '99.9%', label: 'SLA Uptime' },
    ],
    overview: 'A multi-tenant SaaS platform for financial operations management, featuring real-time transaction processing, multi-gateway payment routing, and executive analytics dashboards.',
    challenge: 'The client was running financial operations across spreadsheets and disconnected tools. They had no real-time visibility into cash flow, no automated reconciliation, and their payment gateway integrations were manual and error-prone.',
    solution: 'We built a centralized financial operations platform with real-time transaction streaming, automated reconciliation, multi-gateway routing (Stripe, PayPal, Tap), and a custom analytics engine with drill-down reporting.',
    results: 'The platform processes $2.4M monthly with 99.9% uptime. Manual reconciliation time dropped from 16 hours/week to under 30 minutes. The client onboarded 60,000 users in the first quarter post-launch.',
    deliverables: [
      'Multi-tenant SaaS architecture',
      'Real-time transaction processing engine',
      'Multi-gateway payment routing (Stripe, PayPal, Tap)',
      'Automated reconciliation module',
      'Executive analytics & drill-down reporting',
      'Webhook infrastructure & event streaming',
      'Role-based access control system',
    ],
    techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'Stripe', 'WebSockets', 'Kubernetes'],
    testimonial: {
      quote: 'World-class design, on-time delivery, and a team that actually cares about results. Bldr is our go-to for everything digital.',
      author: 'Omar Hassan',
      role: 'CTO, FinTech Innovations',
      avatar: 'OH',
      avatarColor: '#7C3AED',
    },
  },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || 'medconnect-portal';
  const project = CASE_STUDIES.find(p => p.slug === rawSlug) || CASE_STUDIES[0];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 68 }}>

        {/* ─── Hero ──────────────────────────────────────────── */}
        <div style={{ background: project.gradient, padding: '72px 32px 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <Link
              href="/projects"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24, transition: 'color 0.2s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Projects
            </Link>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 20, border: '1px solid rgba(255,255,255,0.2)' }}>
              {project.category}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
              {project.title}
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 600, lineHeight: 1.7, marginBottom: 32 }}>
              {project.tagline}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {project.year}
              </span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {project.client}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Metrics ───────────────────────────────────────── */}
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '32px' }}>
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {project.metrics.map((m) => (
              <div key={m.label} style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Body ──────────────────────────────────────────── */}
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 64, alignItems: 'start' }}>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {[
              { label: 'Overview', text: project.overview },
              { label: 'The Challenge', text: project.challenge },
              { label: 'Our Solution', text: project.solution },
              { label: 'Results', text: project.results },
            ].map(({ label, text }) => (
              <div key={label}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '-0.02em' }}>
                  {label}
                </h2>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{text}</p>
              </div>
            ))}

            {/* Testimonial */}
            {project.testimonial && (
              <div style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left, rgba(209,7,33,0.1) 0%, transparent 60%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 40, color: 'rgba(253,148,38,0.4)', marginBottom: 16, fontFamily: 'Georgia', lineHeight: 1 }}>"</div>
                  <p style={{ fontSize: 16, color: 'rgba(248,250,252,0.8)', lineHeight: 1.7, marginBottom: 24 }}>
                    {project.testimonial.quote}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: project.testimonial.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {project.testimonial.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(248,250,252,0.95)' }}>{project.testimonial.author}</div>
                      <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.45)' }}>{project.testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 88 }}>
            {/* Deliverables */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>
                Deliverables
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {project.deliverables.map((d) => (
                  <li key={d} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--gradient-from)', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>
                Tech Stack
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {project.techStack.map((tech) => (
                  <span key={tech} className="badge badge-muted" style={{ fontSize: 12 }}>{tech}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: 'var(--gradient)', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                Need something similar?
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
                Let's talk about your project.
              </p>
              <Link href="/contact" className="btn" style={{ background: 'white', color: 'var(--gradient-from)', fontWeight: 700, width: '100%', justifyContent: 'center' }}>
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* ─── More Projects ──────────────────────────────────── */}
        <div style={{ background: 'var(--bg-elevated)', padding: '64px 32px' }}>
          <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32, letterSpacing: '-0.02em' }}>
              More Projects
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {CASE_STUDIES.filter(p => p.slug !== project.slug).map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="card" style={{ textDecoration: 'none' }}>
                  <div style={{ height: 100, background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    {p.icon === 'health' ? (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    ) : p.icon === 'growth' ? (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    ) : (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    )}
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>{p.category}</div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>{p.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
