'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens } from '@bldr/ui';

export default function ApplyProviderPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    providerName: '',
    contactName: '',
    email: '',
    phone: '',
    offeringType: 'Courses & Cohorts',
    audienceSize: 'Growing (50 - 500 students)',
    websiteUrl: '',
    description: '',
  });

  const isRtl = lang === 'AR';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 900);
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
      }}
    >
      <BldrNav
        lang={lang}
        onLanguageChange={setLang}
        onStartProject={() => setIsContactOpen(true)}
      />

      <main style={{ flex: 1, padding: '56px 32px 96px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 64px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderRadius: 999,
                background: 'rgba(46, 111, 94, 0.10)',
                color: '#2E6F5E',
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {isRtl ? 'انضم كشريك ومزود معتمد' : 'Partner with bldr · Provider Network'}
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 4.5vw, 52px)',
                fontWeight: 800,
                color: '#12203C',
                lineHeight: 1.15,
                letterSpacing: '-0.035em',
                margin: '0 0 20px',
              }}
            >
              {isRtl
                ? 'انشر وتوسع في دوراتك وورش عملك مع بنية دفع وتسويق جاهزة.'
                : 'Host your courses, workshops & digital products on the bldr platform.'}
            </h1>

            <p
              style={{
                fontSize: 17,
                color: '#5A6A80',
                lineHeight: 1.68,
                fontWeight: 300,
                margin: '0 0 32px',
              }}
            >
              {isRtl
                ? 'اربط برامجك مباشرة مع بوابة الدفع المركزية في مصر (فيزا، ماستركارد، ميزة، فوري، ومحافظ إلكترونية)، واستفد من دعم استوديو Sidekick في التسويق وجلب الطلاب.'
                : 'Plug directly into Egypt’s central payment hub, accept Cards, Fawry, and Mobile Wallets with automated reconciliation, and leverage Sidekick Studio for marketing, ad funnels, and student enrollment.'}
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="#apply-form"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 50,
                  padding: '0 32px',
                  borderRadius: 999,
                  background: tokens.colors.brandDark,
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(20,20,22,0.18)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>📝</span>
                <span>{isRtl ? 'قدّم طلبك الآن مجاناً' : 'Apply as a Provider'}</span>
              </a>

              <Link
                href="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 50,
                  padding: '0 24px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  border: '1px solid #D3DAE4',
                  color: '#12203C',
                  fontSize: 14.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>{isRtl ? 'استعرض كتالوج المزودين الحاليين ←' : 'Explore Current Products Catalog →'}</span>
              </Link>
            </div>
          </div>

          {/* 4 Pillars of Value for Providers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 64 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(20,20,22,0.08)', padding: '28px 24px', boxShadow: '0 2px 10px rgba(20,20,22,0.03)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>⚡</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#12203C', margin: '0 0 10px' }}>
                {isRtl ? 'بوابة دفع مركزية فورية' : 'Central Payment Gateway'}
              </h3>
              <p style={{ fontSize: 14, color: '#5A6A80', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                {isRtl
                  ? 'استقبل المدفوعات فوراً عبر بطاقات ميزة وفيزا وماستركارد، كود دفع فوري، ومحافظ فودافون وأورنج ووي دون أي تعقيدات تقنية.'
                  : 'Accept Visa, Mastercard, Meeza, Fawry Kiosk, and Mobile Wallets instantly with zero PSP onboarding friction.'}
              </p>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(20,20,22,0.08)', padding: '28px 24px', boxShadow: '0 2px 10px rgba(20,20,22,0.03)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>🎯</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#12203C', margin: '0 0 10px' }}>
                {isRtl ? 'دعم التسويق من Sidekick' : 'Sidekick Studio Marketing'}
              </h3>
              <p style={{ fontSize: 14, color: '#5A6A80', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                {isRtl
                  ? 'صفحات هبوط ذات تحويل عالي، إعلانات ممولة جغرافية تستهدف الطلاب وأولياء الأمور، وتأكيد حجز مقاعد فوري عبر الواتساب.'
                  : 'High-converting course landing pages, localized paid ad campaigns, and automated WhatsApp enrollment confirmation.'}
              </p>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(20,20,22,0.08)', padding: '28px 24px', boxShadow: '0 2px 10px rgba(20,20,22,0.03)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>📊</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#12203C', margin: '0 0 10px' }}>
                {isRtl ? 'لوحة تحكم وإدارة الطلاب' : 'Dedicated Provider Portal'}
              </h3>
              <p style={{ fontSize: 14, color: '#5A6A80', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                {isRtl
                  ? 'متابعة لحظية لحجم المبيعات، أعداد المشتركين، تقارير الحضور، وإدارة الإرجاع بسهولة تامة عبر بوابة المزودين الخاصة.'
                  : 'Real-time sales analytics, roster lists, student contacts, and transparent commission ledger reports.'}
              </p>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(20,20,22,0.08)', padding: '28px 24px', boxShadow: '0 2px 10px rgba(20,20,22,0.03)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>🛡️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#12203C', margin: '0 0 10px' }}>
                {isRtl ? 'تسويات دورية لحسابك البنكي' : 'Guaranteed Bank Payouts'}
              </h3>
              <p style={{ fontSize: 14, color: '#5A6A80', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                {isRtl
                  ? 'تسوية مستحقاتك وتحويلها بانتظام لحسابك البنكي المصري مع تقارير مالية مدققة وإشعارات فورية بكل معاملة.'
                  : 'Regular net payouts deposited directly into your Egyptian bank account with full ledger transparency.'}
              </p>
            </div>
          </div>

          {/* How It Works Steps */}
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid rgba(20,20,22,0.08)', padding: '40px 36px', marginBottom: 64 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#12203C', margin: '0 0 28px', textAlign: 'center' }}>
              {isRtl ? 'كيف تعمل منظومة المزودين في bldr؟' : 'How the Provider Partnership Works'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#141416', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  1
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#141416' }}>
                    {isRtl ? 'تقديم الطلب والتفاصيل' : 'Submit Offering Details'}
                  </h4>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#5A6A80', lineHeight: 1.6 }}>
                    {isRtl
                      ? 'املأ النموذج بالأسفل مع تحديد نوع برامجك التعليمية، جدول المواعيد، وروابط أعمالك السابقة.'
                      : 'Fill in the application below with your curriculum outline, target pricing, and credentials.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#141416', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  2
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#141416' }}>
                    {isRtl ? 'الموافقة وتفعيل بوابة الدفع' : 'Verification & Gateway Setup'}
                  </h4>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#5A6A80', lineHeight: 1.6 }}>
                    {isRtl
                      ? 'يراجع فريق bldr طلبك وتجهيز روابط الدفع المركزية وحسابك في بوابة المزودين خلال ٢٤-٤٨ ساعة.'
                      : 'Our partnership team reviews your syllabus, provisions your portal login, and generates your checkout links.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#141416', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  3
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#141416' }}>
                    {isRtl ? 'النشر والانطلاق واستقبال المبيعات' : 'Go Live & Accept Enrollments'}
                  </h4>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#5A6A80', lineHeight: 1.6 }}>
                    {isRtl
                      ? 'يظهر منتجك في الكتالوج الموحد ويبدأ الطلاب بالدفع والتسجيل الفوري مع استلامك إشعارات فورية.'
                      : 'Your offering is published to the bldr catalog and you receive instant WhatsApp & webhook sales alerts.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Provider Application Form */}
          <div id="apply-form" style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid rgba(20,20,22,0.08)', padding: '40px 36px', boxShadow: '0 4px 20px rgba(20,20,22,0.05)' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#12203C', margin: '0 0 8px' }}>
                  {isRtl ? 'نموذج التقديم للانضمام كمزود معتمد' : 'Provider Partnership Application Form'}
                </h2>
                <p style={{ fontSize: 14.5, color: '#5A6A80', margin: 0 }}>
                  {isRtl
                    ? 'أرسل تفاصيلك وسيقوم فريق علاقات المزودين في bldr بالتواصل معك خلال يوم عمل واحد.'
                    : 'Submit your details and our venture team will reach out within 1 business day.'}
                </p>
              </div>

              {isSubmitted ? (
                <div
                  style={{
                    padding: '36px 24px',
                    borderRadius: 14,
                    background: '#E6EFEB',
                    border: '1px solid rgba(46, 111, 94, 0.25)',
                    textAlign: 'center',
                    animation: 'fadeIn 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2E6F5E', margin: '0 0 10px' }}>
                    {isRtl ? 'تم استلام طلبك بنجاح!' : 'Application Submitted Successfully!'}
                  </h3>
                  <p style={{ fontSize: 15, color: '#1B2A4A', maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.6 }}>
                    {isRtl
                      ? 'شكراً لاهتمامك بالانضمام إلى شبكة مزودي bldr. سنراجع بياناتك ونتواصل معك عبر الواتساب والبريد الإلكتروني لجدولة جلسة الإعداد التقني.'
                      : 'Thank you for your interest in joining bldr. Our team will review your application and reach out via WhatsApp and email to complete onboarding.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setForm({
                        providerName: '',
                        contactName: '',
                        email: '',
                        phone: '',
                        offeringType: 'Courses & Cohorts',
                        audienceSize: 'Growing (50 - 500 students)',
                        websiteUrl: '',
                        description: '',
                      });
                    }}
                    style={{
                      height: 42,
                      padding: '0 24px',
                      borderRadius: 8,
                      background: '#2E6F5E',
                      color: '#FFFFFF',
                      fontSize: 13.5,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? 'تقديم طلب لبرنامج آخر' : 'Submit Another Application'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                        {isRtl ? 'اسم المحاضر / المركز / الأكاديمية *' : 'Provider / Academy / Tutor Name *'}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isRtl ? 'مثال: أكاديمية تيك بريدج' : 'e.g. Apex Coding Academy'}
                        value={form.providerName}
                        onChange={(e) => setForm({ ...form, providerName: e.target.value })}
                        style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                        {isRtl ? 'اسم المسؤول للتواصل *' : 'Primary Contact Person *'}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isRtl ? 'مثال: كريم السيد' : 'e.g. Tarek Mansour'}
                        value={form.contactName}
                        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                        style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                        {isRtl ? 'البريد الإلكتروني للعمل *' : 'Work Email *'}
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="tutor@academy.eg"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                        {isRtl ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp Number *'}
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+20 10 1234 5678"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                        {isRtl ? 'نوع البرامج والمنتجات *' : 'Primary Offering Type *'}
                      </label>
                      <select
                        value={form.offeringType}
                        onChange={(e) => setForm({ ...form, offeringType: e.target.value })}
                        style={{ width: '100%', height: 42, padding: '0 10px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, background: '#FFFFFF', boxSizing: 'border-box' }}
                      >
                        <option value="Courses & Cohorts">Courses & Live Bootcamps (دورات ومعسكرات)</option>
                        <option value="Workshops & Sprints">Workshops & Intensive Sprints (ورش عمل)</option>
                        <option value="Platform Assessments">Platform Passes & Assessments (تقييمات واشتراكات)</option>
                        <option value="Books & Toolkits">Books, Guides & Toolkits (كتب وأدلة)</option>
                        <option value="Events & Summits">Events & Summits (فعاليات ومؤتمرات)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                        {isRtl ? 'حجم الطلاب / المشتركين حالياً' : 'Current Student / Audience Base'}
                      </label>
                      <select
                        value={form.audienceSize}
                        onChange={(e) => setForm({ ...form, audienceSize: e.target.value })}
                        style={{ width: '100%', height: 42, padding: '0 10px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, background: '#FFFFFF', boxSizing: 'border-box' }}
                      >
                        <option value="Just starting (< 50 students)">Just starting (&lt; 50 learners)</option>
                        <option value="Growing (50 - 500 students)">Growing (50 – 500 learners)</option>
                        <option value="Established (500+ students)">Established (500+ active learners)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                      {isRtl ? 'رابط الموقع أو وسائل التواصل (LinkedIn / Facebook / YouTube)' : 'Website or Social Profile Link'}
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/your-academy or https://yourdomain.com"
                      value={form.websiteUrl}
                      onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                      style={{ width: '100%', height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
                      {isRtl ? 'نبذة عن البرامج التي ترغب في استضافتها على bldr *' : 'Brief Overview of Programs You Wish to Host *'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={isRtl ? 'أخبرنا عن موضوعات الدورات، مدتها، ومستوى الطلاب المستهدف...' : 'Describe your course subjects, target duration, pricing expectations, or prerequisites...'}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #D3DAE4', fontSize: 13.5, fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      height: 50,
                      marginTop: 8,
                      borderRadius: 999,
                      background: tokens.colors.brandDark,
                      color: '#FFFFFF',
                      fontSize: 15,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(20,20,22,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{loading ? '...' : (isRtl ? 'إرسال طلب الانضمام كمزود خدمة ←' : 'Submit Provider Application →')}</span>
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
