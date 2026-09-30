'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens } from '@bldr/ui';

export default function ContactPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const isRtl = lang === 'AR';

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'Software & Web Platforms',
    budget: 'EGP 50,000 - EGP 100,000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F4F5F7',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.ui,
        color: '#141416',
      }}
    >
      <BldrNav
        lang={lang}
        onLanguageChange={setLang}
        onStartProject={() => setIsContactOpen(true)}
      />

      <main style={{ flex: 1, padding: '48px 32px 84px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A6A80', marginBottom: 28 }}>
            <Link href="/" style={{ color: '#8A94A6', textDecoration: 'none' }}>
              {isRtl ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#141416' }}>
              {isRtl ? 'تواصل معنا' : 'Contact Us'}
            </span>
          </div>

          {/* Header Banner */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid rgba(20,20,22,0.08)',
              padding: '48px 40px',
              marginBottom: 36,
              boxShadow: '0 4px 20px rgba(20,20,22,0.04)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 999,
                background: 'rgba(209, 7, 33, 0.08)',
                color: '#D10721',
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              ✦ {isRtl ? 'ابدأ مشروعك الرقمي' : "Let's Build Something Extraordinary"}
            </div>
            <h1
              style={{
                fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display,
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#141416',
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              {isRtl ? 'تواصل مع فريق bldr للحلول الرقمية' : 'Start Your Next Breakthrough with Bldr'}
            </h1>
            <p
              style={{
                fontSize: 16,
                color: '#5A6A80',
                maxWidth: 620,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              {isRtl
                ? 'سواء كنت بحاجة إلى تطوير منصة تقنية، إطلاق حملات نمو مدفوعة، أو بناء هوية بصرية متميزة — فريقنا مستعد لتحويل رؤيتك إلى واقع ملموس.'
                : 'Whether you need full-stack software development, performance growth campaigns, or brand transformation — our partners and technical leads are ready to deliver.'}
            </p>
          </div>

          {/* Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 32, alignItems: 'start' }}>
            {/* Direct Channels Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: '36px 32px',
                boxShadow: '0 2px 12px rgba(20,20,22,0.03)',
              }}
            >
              <h2
                style={{
                  fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display,
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#141416',
                  margin: '0 0 10px',
                }}
              >
                {isRtl ? 'قنوات التواصل المباشرة' : 'Direct Channels'}
              </h2>
              <p style={{ fontSize: 14, color: '#5A6A80', lineHeight: 1.6, margin: '0 0 28px' }}>
                {isRtl
                  ? 'تحدث مباشرة مع مهندسينا ومستشاري الأعمال. نرد على كافة الاستفسارات المؤهلة خلال ٤ ساعات عمل.'
                  : 'Speak directly with our technical partners and strategy leads. We respond to all inquiries within 4 business hours.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isRtl ? 'البريد الإلكتروني للشركاء' : 'Inquiries & Partnerships'}
                    </div>
                    <a href="mailto:partnerships@bldr.dev" style={{ fontSize: 14, fontWeight: 700, color: '#141416', textDecoration: 'none' }}>
                      partnerships@bldr.dev
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isRtl ? 'واتساب مباشر' : 'WhatsApp Direct Line'}
                    </div>
                    <a href="https://wa.me/966500000000" target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 700, color: '#141416', textDecoration: 'none' }}>
                      +966 50 000 0000
                    </a>
                  </div>
                </div>

                {/* Locations */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isRtl ? 'المقرات الإقليمية' : 'Regional Hubs'}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#141416' }}>
                      {isRtl ? 'الرياض، المملكة العربية السعودية & القاهرة' : 'Riyadh, KSA & Cairo, Egypt'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider link */}
              <div style={{ borderTop: '1px solid rgba(20,20,22,0.08)', paddingTop: 20 }}>
                <div style={{ fontSize: 13, color: '#5A6A80', marginBottom: 8 }}>
                  {isRtl ? 'هل أنت مزود خدمة وترغب بالانضمام؟' : 'Looking for Provider Onboarding?'}
                </div>
                <Link
                  href="/apply-provider"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: '#D10721',
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'انضم كمزود خدمة معتمد في bldr ←' : 'Apply as a certified service provider →'}
                </Link>
              </div>
            </div>

            {/* Inquiry Form Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: '36px 36px',
                boxShadow: '0 4px 16px rgba(20,20,22,0.05)',
              }}
            >
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: '#ECFDF5',
                      color: '#059669',
                      fontSize: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px',
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display,
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#141416',
                      marginBottom: 10,
                    }}
                  >
                    {isRtl ? 'تم استلام طلبك بنجاح!' : 'Inquiry Dispatched!'}
                  </h3>
                  <p style={{ color: '#5A6A80', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: '0 auto 24px' }}>
                    {isRtl
                      ? `شكراً لك ${formState.name}، سيقوم مستشار المشروع بمراجعة التفاصيل والتواصل معك خلال ٤ ساعات عمل.`
                      : `Thank you ${formState.name}. A technical partner will review your requirements and reach out within 4 business hours.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    style={{
                      background: '#F1F5F9',
                      color: '#141416',
                      border: '1px solid #CBD5E1',
                      borderRadius: 10,
                      padding: '10px 22px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? 'إرسال استفسار جديد' : 'Submit Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h2
                    style={{
                      fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display,
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#141416',
                      margin: '0 0 4px',
                    }}
                  >
                    {isRtl ? 'تفاصيل المشروع واحتياجاتك' : 'Project Specifications'}
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                        {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isRtl ? 'مثال: عمر المنصور' : 'e.g. Omar Al-Mansour'}
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 14px',
                          color: '#141416',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                        {isRtl ? 'البريد الإلكتروني للعمل *' : 'Work Email *'}
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="omar@company.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 14px',
                          color: '#141416',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                        {isRtl ? 'اسم الشركة أو العلامة التجارية' : 'Company / Brand'}
                      </label>
                      <input
                        type="text"
                        placeholder={isRtl ? 'اسم الشركة' : 'Company Name'}
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 14px',
                          color: '#141416',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                        {isRtl ? 'رقم الهاتف أو واتساب' : 'Phone / WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        placeholder="+966 5x xxx xxxx"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 14px',
                          color: '#141416',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                        {isRtl ? 'الخدمة المطلوبة' : 'Service Focus'}
                      </label>
                      <select
                        value={formState.serviceInterest}
                        onChange={(e) => setFormState({ ...formState, serviceInterest: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 14px',
                          color: '#141416',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      >
                        <option value="Software & Web Platforms">Web & Platform Engineering</option>
                        <option value="Performance Ads & Growth">Performance Ads & Growth</option>
                        <option value="Brand Identity & Creative">Brand Identity & Strategy</option>
                        <option value="Media & Video Production">Media & Video Production</option>
                        <option value="EdTech & Cohort Platform">EdTech / Cohort Platform</option>
                        <option value="Strategic Consulting">Strategic Consulting / Audit</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                        {isRtl ? 'الميزانية التقديرية' : 'Budget Scope'}
                      </label>
                      <select
                        value={formState.budget}
                        onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 14px',
                          color: '#141416',
                          fontSize: 14,
                          outline: 'none',
                        }}
                      >
                        <option value="EGP 20k - EGP 50k">EGP 20,000 - EGP 50,000</option>
                        <option value="EGP 50k - EGP 100k">EGP 50,000 - EGP 100,000</option>
                        <option value="EGP 100k - EGP 250k">EGP 100,000 - EGP 250,000</option>
                        <option value="EGP 250k+">EGP 250,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                      {isRtl ? 'تفاصيل فكرة المشروع وأهدافه *' : 'Project Brief & Objectives *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={
                        isRtl
                          ? 'أخبرنا عن فكرة مشروعك، التحديات الحالية، والموعد المستهدف للإطلاق...'
                          : 'Tell us about your project vision, current bottlenecks, and desired launch timeline...'
                      }
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: 8,
                        padding: '10px 14px',
                        color: '#141416',
                        fontSize: 14,
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #141416 0%, #2A2A30 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 10,
                      padding: '14px 28px',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(20, 20, 22, 0.2)',
                      transition: 'all 0.15s ease',
                      marginTop: 4,
                    }}
                  >
                    {loading ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال طلب المشروع ←' : 'Submit Project Brief →')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <BldrFooter />

      <ProjectContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />
    </div>
  );
}
