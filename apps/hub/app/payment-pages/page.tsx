'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

const VENTURES = ['StudyHub Egypt', 'TechBridge Cairo', 'EL HESA Academy', 'Sidekick Studio', 'Apex Classes'];
const GATEWAYS = ['Fawry Pay', 'Paymob (Accept)', 'Geidea'];

interface PaymentPage {
  id: string;
  venture: string;
  name: string;
  slug: string;
  heading: string;
  headingAr: string;
  amount: number;
  currency: string;
  gateway: 'Fawry Pay' | 'Paymob (Accept)' | 'Geidea';
  methods: {
    fawry: boolean;
    wallet: boolean;
    card: boolean;
  };
  color: string;
  logo: string;
  successMsg: string;
  enrolledStudents: number;
  totalVolume: number;
}

const INITIAL_PAGES: PaymentPage[] = [
  {
    id: 'pg-001',
    venture: 'StudyHub Egypt',
    name: 'Full-Stack Bootcamp Sept Cohort',
    slug: 'studyhub/fs-bootcamp',
    heading: 'Enroll in Full-Stack Engineering Bootcamp',
    headingAr: 'الانضمام لمعسكر هندسة البرمجيات وتطوير الويب',
    amount: 4800,
    currency: 'EGP',
    gateway: 'Fawry Pay',
    methods: { fawry: true, wallet: true, card: true },
    color: '#0EA5E9',
    logo: 'SH',
    successMsg: 'تم تأكيد حجز مقعدك بنجاح! تفقد بريدك الإلكتروني لبيانات الدخول.',
    enrolledStudents: 142,
    totalVolume: 681600,
  },
  {
    id: 'pg-002',
    venture: 'TechBridge Cairo',
    name: 'React & Next.js Professional Workshop',
    slug: 'techbridge/react-workshop',
    heading: 'Reserve Your Spot — React & Next.js Workshop',
    headingAr: 'حجز مقعدك في ورشة عمل React & Next.js المتقدمة',
    amount: 1850,
    currency: 'EGP',
    gateway: 'Paymob (Accept)',
    methods: { fawry: true, wallet: true, card: true },
    color: '#7C3AED',
    logo: 'TB',
    successMsg: 'تم التسجيل في الورشة! تم إرسال رابط الحضور والمواعيد عبر واتساب.',
    enrolledStudents: 98,
    totalVolume: 181300,
  },
  {
    id: 'pg-003',
    venture: 'EL HESA Academy',
    name: 'Executive MBA Registration',
    slug: 'elhesa/executive-mba',
    heading: 'Join the Executive MBA Cohort 2026',
    headingAr: 'التسجيل في برنامج ماجستير إدارة الأعمال التنفيذي',
    amount: 8500,
    currency: 'EGP',
    gateway: 'Geidea',
    methods: { fawry: true, wallet: true, card: true },
    color: '#D10721',
    logo: 'EH',
    successMsg: 'تم استلام الرسوم وتأكيد قيدك بالدفعة الجديدة.',
    enrolledStudents: 64,
    totalVolume: 544000,
  },
];

export default function HubPaymentPages() {
  const [pages, setPages] = useState<PaymentPage[]>(INITIAL_PAGES);
  const [showBuilder, setShowBuilder] = useState(false);
  const [previewPage, setPreviewPage] = useState<PaymentPage | null>(null);

  // Preview interactive checkout states
  const [activeMethod, setActiveMethod] = useState<'FAWRY' | 'WALLET' | 'CARD'>('FAWRY');
  const [studentName, setStudentName] = useState('أحمد حسن (Ahmed Hassan)');
  const [studentEmail, setStudentEmail] = useState('ahmed.hassan@gmail.com');
  const [studentPhone, setStudentPhone] = useState('01012345678');
  const [walletPhone, setWalletPhone] = useState('01012345678');
  const [fawryCode, setFawryCode] = useState('788-9921-4820');
  const [checkoutStep, setCheckoutStep] = useState<'SELECT' | 'REDIRECT' | 'CONFIRMED'>('SELECT');
  const [copiedCode, setCopiedCode] = useState(false);

  // New Page Builder Form
  const [form, setForm] = useState({
    venture: 'StudyHub Egypt',
    name: '',
    slug: '',
    heading: '',
    amount: '2500',
    gateway: 'Fawry Pay' as PaymentPage['gateway'],
    color: '#0EA5E9',
    fawry: true,
    wallet: true,
    card: true,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: PaymentPage = {
      id: `pg-${Date.now().toString().slice(-4)}`,
      venture: form.venture,
      name: form.name || 'New Egyptian Checkout Page',
      slug: form.slug || `${form.venture.toLowerCase().replace(/[^a-z0-9]/g, '')}/checkout`,
      heading: form.heading || 'Complete Your Enrollment',
      headingAr: 'إكمال التسجيل وسداد الرسوم',
      amount: parseFloat(form.amount) || 1500,
      currency: 'EGP',
      gateway: form.gateway,
      methods: { fawry: form.fawry, wallet: form.wallet, card: form.card },
      color: form.color,
      logo: form.venture.slice(0, 2).toUpperCase(),
      successMsg: 'تم سداد الرسوم وتأكيد اشتراكك بنجاح!',
      enrolledStudents: 0,
      totalVolume: 0,
    };
    setPages([newP, ...pages]);
    setShowBuilder(false);
  };

  const openPreview = (page: PaymentPage) => {
    setPreviewPage(page);
    setActiveMethod('FAWRY');
    setCheckoutStep('SELECT');
    setFawryCode(`788-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const copyFawryCode = () => {
    navigator.clipboard.writeText(fawryCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Payment Pages Builder"
          crumb="Pages / Builder"
        />

        <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#12203C' }}>Hosted Payment Pages Builder</span>
            <div style={{ fontSize: 12, color: '#8A94A6' }}>Branded checkout pages with Egyptian payment rails: Fawry Code, Mobile Wallets & Cards</div>
          </div>
          <button
            onClick={() => setShowBuilder(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 7,
              background: '#2E6F5E',
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Create Payment Page
          </button>
        </div>

        <div className="hub-content" style={{ padding: '16px 24px 24px' }}>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Published Pages', val: pages.length, icon: '◈' },
              { label: 'Market Location', val: 'Egypt (مصر)', icon: '◎' },
              { label: 'Active Payment Rails', val: 'Fawry · Wallets · Cards', icon: '✦' },
              { label: 'Processed Volume', val: `EGP ${(pages.reduce((acc, p) => acc + p.totalVolume, 0) / 1000).toLocaleString()}K`, icon: '▲' },
            ].map((kpi) => (
              <div key={kpi.label} className="hub-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 24 }}>{kpi.icon}</span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--hub-text)' }}>{kpi.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--hub-text-3)' }}>{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Pages Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {pages.map((page) => (
              <div
                key={page.id}
                className="hub-card"
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--hub-border)',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                }}
              >
                {/* Venture Branded Header */}
                <div style={{ background: page.color, padding: '22px 20px', textAlign: 'center', color: 'white', position: 'relative' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 800,
                      margin: '0 auto 10px',
                      border: '1.5px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {page.logo}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, marginBottom: 4 }}>
                    {page.heading}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 500 }}>
                    {page.headingAr}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: 10,
                      background: 'rgba(255,255,255,0.2)',
                      padding: '3px 12px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {page.currency} {page.amount.toLocaleString()}
                  </div>
                </div>

                {/* Body: Gateway badge & Student Input Preview */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Gateway routing badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--hub-bg)', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--hub-border)' }}>
                    <span style={{ fontSize: 11, color: 'var(--hub-text-3)', fontWeight: 600 }}>Connected Gateway</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--hub-accent)' }}>
                      {page.gateway}
                    </span>
                  </div>

                  {/* Student Inputs Mockup */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--hub-text-2)', marginBottom: 4 }}>
                        Student Full Name (اسم الطالب رباعي)
                      </div>
                      <div style={{ height: 32, background: 'var(--hub-bg)', borderRadius: 6, border: '1px solid var(--hub-border)', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, color: 'var(--hub-text-3)' }}>
                        أحمد حسن — Ahmed Hassan
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--hub-text-2)', marginBottom: 4 }}>
                        Egyptian Mobile / WhatsApp (رقم الموبايل)
                      </div>
                      <div style={{ height: 32, background: 'var(--hub-bg)', borderRadius: 6, border: '1px solid var(--hub-border)', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, color: 'var(--hub-text-3)' }}>
                        +20 10 1234 5678
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector Cards */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--hub-text-3)', marginBottom: 6 }}>
                      Select Payment Method (طريقة الدفع)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      <div style={{ border: '1.5px solid var(--hub-accent)', borderRadius: 8, padding: '8px 4px', textAlign: 'center', background: 'rgba(99, 102, 241, 0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--hub-accent)' }}>كود فوري</div>
                        <div style={{ fontSize: 9, color: 'var(--hub-text-3)' }}>Fawry Code</div>
                      </div>
                      <div style={{ border: '1px solid var(--hub-border)', borderRadius: 8, padding: '8px 4px', textAlign: 'center', background: 'var(--hub-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--hub-text)' }}>محفظة كاش</div>
                        <div style={{ fontSize: 9, color: 'var(--hub-text-3)' }}>Wallets</div>
                      </div>
                      <div style={{ border: '1px solid var(--hub-border)', borderRadius: 8, padding: '8px 4px', textAlign: 'center', background: 'var(--hub-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--hub-text)' }}>بطاقة بنكية</div>
                        <div style={{ fontSize: 9, color: 'var(--hub-text-3)' }}>Meeza / Card</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Pay CTA */}
                  <button
                    onClick={() => openPreview(page)}
                    style={{
                      height: 38,
                      background: page.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span>سداد {page.currency} {page.amount.toLocaleString()}</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Card Footer */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid var(--hub-border)', background: 'var(--hub-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--hub-text)' }}>{page.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--hub-text-3)' }}>
                      {page.venture} · {page.enrolledStudents} students enrolled
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="hub-btn hub-btn-primary hub-btn-sm"
                      onClick={() => openPreview(page)}
                      style={{ background: 'var(--hub-accent)', color: 'white' }}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── LIVE CHECKOUT PREVIEW MODAL ─── */}
      {previewPage && (
        <div className="hub-modal-backdrop" onClick={() => setPreviewPage(null)}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              overflow: 'hidden',
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 25px 70px rgba(0,0,0,0.3)',
              border: '1px solid var(--hub-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Official Provider Bar */}
            <div
              style={{
                background: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: previewPage.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 14,
                  }}
                >
                  {previewPage.logo}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                      {previewPage.venture}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        background: '#ECFDF5',
                        color: '#065F46',
                        borderRadius: 999,
                        border: '1px solid #A7F3D0',
                      }}
                    >
                      <span>✓</span>
                      <span>مقدم معتمد</span>
                    </span>
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B' }}>
                    المنصة الرسمية المعتمدة لتحصيل المصروفات
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPreviewPage(null)}
                style={{ background: '#F1F5F9', border: 'none', width: 26, height: 26, borderRadius: '50%', color: '#64748B', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Header Banner */}
            <div style={{ background: previewPage.color, padding: '20px 24px', color: 'white', position: 'relative' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>{previewPage.heading}</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{previewPage.headingAr}</div>
              </div>

              {/* Amount bar */}
              <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, opacity: 0.9 }}>المبلغ المطلوب (Tuition Fee)</span>
                <span style={{ fontSize: 20, fontWeight: 900 }}>
                  {previewPage.currency} {previewPage.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Payment Method Selector Tabs */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>اختر طريقة الدفع (Payment Method)</span>
                  <span style={{ color: '#6366F1', fontSize: 11 }}>بوابة: {previewPage.gateway}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {/* Fawry */}
                  <div
                    onClick={() => { setActiveMethod('FAWRY'); setCheckoutStep('SELECT'); }}
                    style={{
                      border: activeMethod === 'FAWRY' ? '2px solid #F59E0B' : '1px solid #E5E7EB',
                      borderRadius: 10,
                      padding: '10px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: activeMethod === 'FAWRY' ? '#FEF3C7' : '#FFFFFF',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#92400E' }}>كود فوري</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>Fawry Code</div>
                  </div>

                  {/* Wallets */}
                  <div
                    onClick={() => { setActiveMethod('WALLET'); setCheckoutStep('SELECT'); }}
                    style={{
                      border: activeMethod === 'WALLET' ? '2px solid #10B981' : '1px solid #E5E7EB',
                      borderRadius: 10,
                      padding: '10px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: activeMethod === 'WALLET' ? '#ECFDF5' : '#FFFFFF',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#065F46' }}>محفظة كاش</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>Vodafone/Wallet</div>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => { setActiveMethod('CARD'); setCheckoutStep('SELECT'); }}
                    style={{
                      border: activeMethod === 'CARD' ? '2px solid #3B82F6' : '1px solid #E5E7EB',
                      borderRadius: 10,
                      padding: '10px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: activeMethod === 'CARD' ? '#EFF6FF' : '#FFFFFF',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#1E40AF' }}>بطاقة بنكية</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>Meeza / Visa</div>
                  </div>
                </div>
              </div>

              {/* ─── CONDITIONAL PAYMENT METHOD INTERFACES ─── */}

              {/* 1. FAWRY INTERFACE */}
              {activeMethod === 'FAWRY' && (
                <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: 14, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#92400E' }}>كود الدفع عبر فوري (Fawry Pay)</div>
                        <div style={{ fontSize: 11, color: '#B45309' }}>ادفع نقداً لدى أي ماكينة أو فرع فوري</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: 999, fontWeight: 700 }}>
                      صالح لمدة ٤٨ ساعة
                    </span>
                  </div>

                  {/* Big Reference Code Box */}
                  <div style={{ background: '#FFFFFF', border: '2px dashed #F59E0B', borderRadius: 10, padding: '14px', textAlign: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      الرقم المرجعي للدفع (Fawry Ref Code)
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: '#B45309', letterSpacing: '0.08em', marginBottom: 8 }}>
                      {fawryCode}
                    </div>
                    <button
                      onClick={copyFawryCode}
                      style={{
                        background: copiedCode ? '#059669' : '#F59E0B',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedCode ? '✓ تم النسخ' : 'نسخ الكود (Copy)'}
                    </button>
                  </div>

                  {/* Fawry Steps */}
                  <div style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div><strong>١.</strong> توجه لأي منفذ فوري أو استخدم تطبيق myFawry.</div>
                    <div><strong>٢.</strong> اطلب خدمة <strong>"فوري باي — Fawry Pay"</strong> كود خدمة: <strong>788</strong>.</div>
                    <div><strong>٣.</strong> أدخل الرقم المرجعي أعلاه وسدد <strong>{previewPage.currency} {previewPage.amount.toLocaleString()}</strong>.</div>
                    <div><strong>٤.</strong> سيتم تأكيد التحاقك كطالب معتمد فورياً وإرسال إيصال الدفع.</div>
                  </div>

                  <button
                    onClick={() => setCheckoutStep('CONFIRMED')}
                    style={{
                      width: '100%',
                      marginTop: 16,
                      background: '#F59E0B',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px',
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    تم السداد لدى فوري — تأكيد التسجيل الفوري ✓
                  </button>
                </div>
              )}

              {/* 2. MOBILE WALLET INTERFACE */}
              {activeMethod === 'WALLET' && (
                <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: 14, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#065F46' }}>الدفع بالمحفظة الإلكترونية (Mobile Wallet)</div>
                      <div style={{ fontSize: 11, color: '#047857' }}>فودافون كاش، أورنج، اتصالات، وي، انستاباي</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 6 }}>
                      رقم محفظة الموبايل المصرية *
                    </label>
                    <input
                      type="tel"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="010xxxxxxxx أو 011 / 012 / 015"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1.5px solid #10B981',
                        fontSize: 14,
                        fontFamily: 'monospace',
                        outline: 'none',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 12, color: '#065F46', lineHeight: 1.6, marginBottom: 14 }}>
                    سيصلك إشعار فوري من المحفظة أو رسالة لتأكيد الخصم برقمك السري.
                  </div>

                  <button
                    onClick={() => setCheckoutStep('CONFIRMED')}
                    style={{
                      width: '100%',
                      background: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px',
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    تأكيد الخصم وسداد {previewPage.currency} {previewPage.amount.toLocaleString()} →
                  </button>
                </div>
              )}

              {/* 3. CARD INTERFACE */}
              {activeMethod === 'CARD' && (
                <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 14, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF' }}>البطاقات البنكية المعتمدة</div>
                        <div style={{ fontSize: 11, color: '#3B82F6' }}>ميزة (Meeza)، فيزا، ماستركارد</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, border: '1px solid #DBEAFE' }}>ميزة</span>
                      <span style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, border: '1px solid #DBEAFE' }}>Visa</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                    <input
                      readOnly
                      value="5078 •••• •••• 4219"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #93C5FD', borderRadius: 8, background: '#FFFFFF', fontSize: 13, fontFamily: 'monospace' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input readOnly value="12/28" style={{ padding: '10px 12px', border: '1px solid #93C5FD', borderRadius: 8, background: '#FFFFFF', fontSize: 13, textAlign: 'center' }} />
                      <input readOnly value="CVV: •••" style={{ padding: '10px 12px', border: '1px solid #93C5FD', borderRadius: 8, background: '#FFFFFF', fontSize: 13, textAlign: 'center' }} />
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutStep('CONFIRMED')}
                    style={{
                      width: '100%',
                      background: '#2563EB',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px',
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    سداد {previewPage.currency} {previewPage.amount.toLocaleString()} عبر {previewPage.gateway} →
                  </button>
                </div>
              )}

              {/* Confirmation State */}
              {checkoutStep === 'CONFIRMED' && (
                <div style={{ marginTop: 16, background: '#ECFDF5', border: '2px solid #059669', borderRadius: 12, padding: '18px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#065F46', marginBottom: 4 }}>
                    تم تأكيد القيد وسداد الرسوم بنجاح!
                  </div>
                  <div style={{ fontSize: 12, color: '#047857', marginBottom: 12 }}>
                    معرف العملية: <code>TXN-EG-{Math.floor(100000 + Math.random() * 900000)}</code>
                  </div>
                  <a
                    href="http://localhost:3013/students"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#059669',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    عرض سجل الطالب في بوابة المزود ↗
                  </a>
                </div>
              )}
            </div>

            {/* High-Trust Footer */}
            <div
              style={{
                background: '#F8FAFC',
                borderTop: '1px solid #E2E8F0',
                padding: '14px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                {/* bldr badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: '#D10721', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>
                    b
                  </div>
                  <span style={{ fontSize: 11, color: '#334155' }}>
                    Payment Managed by <strong style={{ color: '#0F172A' }}>bldr</strong>
                  </span>
                </div>

                {/* Gateway Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10.5, color: '#64748B' }}>Secured payment by:</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: previewPage.gateway === 'Fawry Pay' ? '#FEF3C7' : previewPage.gateway === 'Paymob (Accept)' ? '#EFF6FF' : '#FEE2E2',
                      color: previewPage.gateway === 'Fawry Pay' ? '#92400E' : previewPage.gateway === 'Paymob (Accept)' ? '#1E40AF' : '#991B1B',
                      fontWeight: 800,
                      fontSize: 10.5,
                      border: `1px solid ${previewPage.gateway === 'Fawry Pay' ? '#FDE68A' : previewPage.gateway === 'Paymob (Accept)' ? '#BFDBFE' : '#FECACA'}`,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: previewPage.gateway === 'Fawry Pay' ? '#F59E0B' : previewPage.gateway === 'Paymob (Accept)' ? '#2563EB' : '#DC2626', display: 'inline-block' }} />
                    <span>{previewPage.gateway}</span>
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748B' }}>
                <span>256-Bit SSL · CBE Compliant</span>
                <span>PCI DSS Level 1 · 3D Secure</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── BUILDER MODAL ─── */}
      {showBuilder && (
        <div className="hub-modal-backdrop">
          <div className="hub-modal" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className="hub-modal-title" style={{ marginBottom: 0 }}>Create Egyptian Payment Page</h2>
              <button onClick={() => setShowBuilder(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--hub-text-3)' }}>✕</button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--hub-text-2)' }}>Venture / Provider</label>
                <select
                  className="hub-select"
                  style={{ width: '100%' }}
                  value={form.venture}
                  onChange={(e) => setForm({ ...form, venture: e.target.value })}
                >
                  {VENTURES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--hub-text-2)' }}>Page Offering Title</label>
                <input
                  required
                  className="hub-input"
                  placeholder="e.g. Graphic Design Diploma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--hub-text-2)' }}>Amount (EGP)</label>
                  <input
                    required
                    type="number"
                    className="hub-input"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--hub-text-2)' }}>Payment Gateway</label>
                  <select
                    className="hub-select"
                    style={{ width: '100%' }}
                    value={form.gateway}
                    onChange={(e) => setForm({ ...form, gateway: e.target.value as PaymentPage['gateway'] })}
                  >
                    {GATEWAYS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--hub-text-2)' }}>Active Payment Methods</label>
                <div style={{ display: 'flex', gap: 14, background: 'var(--hub-bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--hub-border)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.fawry} onChange={(e) => setForm({ ...form, fawry: e.target.checked })} />
                    Fawry Code
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.wallet} onChange={(e) => setForm({ ...form, wallet: e.target.checked })} />
                    Mobile Wallets
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.card} onChange={(e) => setForm({ ...form, card: e.target.checked })} />
                    Meeza / Cards
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="hub-btn hub-btn-secondary" onClick={() => setShowBuilder(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="hub-btn hub-btn-primary" style={{ flex: 1 }}>Publish Page</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
