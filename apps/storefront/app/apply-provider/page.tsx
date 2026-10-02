'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens } from '@bldr/ui';

export default function ApplyProviderPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const isRtl = lang === 'AR';

  const [formState, setFormState] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    category: 'EdTech / Academy',
    annualVolume: '$100k - $500k',
    website: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${api}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.contactName || formState.businessName,
          email: formState.email,
          phone: formState.phone,
          message: `Brand: ${formState.businessName} | Category: ${formState.category} | Volume: ${formState.annualVolume} | Website: ${formState.website}`,
          engagementType: 'REQUEST_QUOTE',
        }),
      });
    } catch {}

    setSubmitting(false);
    setSubmitted(true);
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
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A6A80', marginBottom: 28 }}>
            <Link href="/" style={{ color: '#8A94A6', textDecoration: 'none' }}>
              {isRtl ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#141416' }}>
              {isRtl ? 'انضم كمزود خدمة' : 'Apply as Provider'}
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
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              ✦ {isRtl ? 'شبكة مزودي خدمة bldr المعتمدين' : 'Bldr Certified Provider Network'}
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
              {isRtl ? 'وسع أعمالك واستقبل مدفوعاتك مع bldr' : 'Scale & Monetize Your Services with Bldr'}
            </h1>
            <p
              style={{
                fontSize: 16,
                color: '#5A6A80',
                maxWidth: 640,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              {isRtl
                ? 'انضم إلى نخبة الأكاديميات واستوديوهات التطوير والوكالات الإبداعية المستفيدة من نظام الدفع المركزي وإدارة تسجيل الطلاب المؤتمتة.'
                : 'Join leading academies, software studios, and creative agencies leveraging Bldr’s Central Payment Hub, automated student intake, and multi-gateway checkout.'}
            </p>
          </div>

          {/* Value Proposition Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 36 }}>
            {[
              { id: 'card', title: isRtl ? 'بوابات دفع جاهزة' : 'Zero Gateway Friction', desc: isRtl ? 'قبول مدى، أبل باي، وبطاقات الدفع دون تعقيدات بنكية.' : 'Accept Mada, Apple Pay & cards without complex bank paperwork.' },
              { id: 'link', title: isRtl ? 'روابط دفع فورية' : 'Instant Checkout Links', desc: isRtl ? 'توليد روابط دفع وصفحات شحن مخصصة لطلابك وعملائك.' : 'Generate high-converting checkout links and custom payment pages.' },
              { id: 'track', title: isRtl ? 'تتبع فوري للطلاب' : 'Student & Payer Tracking', desc: isRtl ? 'متابعة لحظية لكل طالب، بوابة الدفع، وإدارة الاسترداد.' : 'Real-time visibility into paid students, gateways, and refunds.' },
              { id: 'payout', title: isRtl ? 'تسويات مالية مجدولة' : 'Automated Payouts', desc: isRtl ? 'تحويل أرباحك الصافية دورياً مباشرة لحسابك التجاري.' : 'Automated scheduled settlements directly to your bank account.' },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid rgba(20,20,22,0.08)',
                  padding: '24px 20px',
                  boxShadow: '0 2px 10px rgba(20,20,22,0.02)',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F1F5F9', color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  {card.id === 'card' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  ) : card.id === 'link' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  ) : card.id === 'track' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  )}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#141416' }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: '#5A6A80', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid rgba(20,20,22,0.08)',
              padding: '40px 36px',
              boxShadow: '0 4px 16px rgba(20,20,22,0.04)',
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
                  {isRtl ? 'تم استلام طلب انضمامك!' : 'Application Dispatched!'}
                </h3>
                <p style={{ color: '#5A6A80', fontSize: 15, lineHeight: 1.6, maxWidth: 460, margin: '0 auto 24px' }}>
                  {isRtl
                    ? 'شكراً لك، سيقوم فريق الشراكات بمراجعة بياناتك وإرسال بيانات اعتماد بوابة المزودين الخاصة بك.'
                    : 'Thank you for applying. Our merchant operations team will review your business profile and dispatch your provider portal credentials.'}
                </p>
                <a
                  href="http://localhost:3013/register"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 14,
                    display: 'inline-block',
                  }}
                >
                  {isRtl ? 'الانتقال لبوابة تسجيل المزودين ←' : 'Open Provider Portal Registration →'}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                  <div>
                    <h2
                      style={{
                        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display,
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#141416',
                        margin: 0,
                      }}
                    >
                      {isRtl ? 'طلب انضمام مزود جديد' : 'Provider Application'}
                    </h2>
                    <p style={{ fontSize: 13, color: '#5A6A80', margin: '4px 0 0' }}>
                      {isRtl ? 'أكمل ملفك التعريفي لبدء استقبال المدفوعات' : 'Fill out your business profile to get started with Bldr.'}
                    </p>
                  </div>
                  <a
                    href="http://localhost:3013/login"
                    style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {isRtl ? 'لديك حساب بالفعل؟ تسجيل الدخول ←' : 'Already registered? Sign in →'}
                  </a>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                      {isRtl ? 'اسم الشركة أو الأكاديمية *' : 'Business / Company Name *'}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={isRtl ? 'مثال: أكاديمية ستادي هب' : 'e.g. StudyHub Academy'}
                      value={formState.businessName}
                      onChange={(e) => setFormState({ ...formState, businessName: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 14px', color: '#141416', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                      {isRtl ? 'اسم مسؤول التواصل *' : 'Primary Contact Name *'}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={isRtl ? 'مثال: سارة الحسن' : 'e.g. Sara Al-Hassan'}
                      value={formState.contactName}
                      onChange={(e) => setFormState({ ...formState, contactName: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 14px', color: '#141416', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                      {isRtl ? 'البريد الإلكتروني للعمل *' : 'Business Email *'}
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="sara@company.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 14px', color: '#141416', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                      {isRtl ? 'رقم الهاتف أو واتساب *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+966 5x xxx xxxx"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 14px', color: '#141416', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                      {isRtl ? 'مجال العمل' : 'Industry Sector'}
                    </label>
                    <select
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 14px', color: '#141416', fontSize: 14, outline: 'none' }}
                    >
                      <option value="EdTech / Academy">EdTech / Education Academy</option>
                      <option value="Creative Agency">Creative & Marketing Agency</option>
                      <option value="Software Studio">Software & Product Studio</option>
                      <option value="Consulting Firm">Management Consulting</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                      {isRtl ? 'حجم المعاملات السنوي المتوقع' : 'Estimated Annual Volume'}
                    </label>
                    <select
                      value={formState.annualVolume}
                      onChange={(e) => setFormState({ ...formState, annualVolume: e.target.value })}
                      style={{ width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 14px', color: '#141416', fontSize: 14, outline: 'none' }}
                    >
                      <option value="Under $100k">Under $100,000</option>
                      <option value="$100k - $500k">$100,000 - $500,000</option>
                      <option value="$500k - $2M">$500,000 - $2,000,000</option>
                      <option value="$2M+">$2,000,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#141416', marginBottom: 6 }}>
                    {isRtl ? 'الموقع الإلكتروني أو رابط الأعمال' : 'Website or Social Presence'}
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formState.website}
                    onChange={(e) => setFormState({ ...formState, website: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 14px', color: '#141416', fontSize: 14, outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #141416 0%, #2A2A30 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px 28px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(20, 20, 22, 0.2)',
                    transition: 'all 0.15s ease',
                    marginTop: 4,
                  }}
                >
                  {isRtl ? 'إرسال طلب الانضمام ←' : 'Submit Provider Application →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <BldrFooter lang={lang} />

      <ProjectContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />
    </div>
  );
}
