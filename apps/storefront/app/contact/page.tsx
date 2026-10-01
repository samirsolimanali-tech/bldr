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
    subject: 'General Inquiry',
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
    }, 500);
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

      <main style={{ flex: 1, padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A6A80', marginBottom: 24 }}>
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
              padding: '40px 36px',
              marginBottom: 32,
              boxShadow: '0 4px 20px rgba(20,20,22,0.03)',
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
                marginBottom: 12,
              }}
            >
              ✦ {isRtl ? 'فريق الدعم والشراكات' : 'Direct Support & Partnerships'}
            </div>
            <h1
              style={{
                fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.display,
                fontSize: 'clamp(28px, 3.8vw, 40px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#141416',
                margin: '0 0 12px',
              }}
            >
              {isRtl ? 'تواصل مع فريق bldr' : 'Contact bldr'}
            </h1>
            <p
              style={{
                fontSize: 15.5,
                color: '#5A6A80',
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 1.68,
              }}
            >
              {isRtl
                ? 'نحن هنا للإجابة على استفساراتك حول الدورات التدريبية، بوابات الدفع، أو شراكات إطلاق وتطوير المشاريع الرقمية.'
                : 'Have questions about course enrollments, payments, or partner integrations? Reach out to our team directly.'}
            </p>
          </div>

          {/* Grid Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.35fr)', gap: 28, alignItems: 'start' }}>
            {/* Direct Contact Info Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 18,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: '32px 28px',
                boxShadow: '0 2px 12px rgba(20,20,22,0.03)',
              }}
            >
              <h2
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: '#141416',
                  margin: '0 0 8px',
                }}
              >
                {isRtl ? 'بيانات التواصل الرسمية' : 'Official Contact Info'}
              </h2>
              <p style={{ fontSize: 13.5, color: '#5A6A80', lineHeight: 1.6, margin: '0 0 24px' }}>
                {isRtl
                  ? 'يمكنك التواصل معنا عبر الهاتف أو الواتساب أو البريد الإلكتروني وسنرد عليك خلال ساعات العمل الرسمية.'
                  : 'Get in touch via phone, WhatsApp, or email. We respond to all inquiries promptly.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                    📍
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isRtl ? 'المقر الرئيسي' : 'Headquarters'}
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: '#141416' }}>
                      {isRtl ? 'الجيزة، جمهورية مصر العربية' : 'Giza, Egypt'}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                    📞
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isRtl ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}
                    </div>
                    <a href="tel:+201030165000" style={{ fontSize: 14.5, fontWeight: 700, color: '#141416', textDecoration: 'none', direction: 'ltr', display: 'inline-block' }}>
                      +20 10 30165000
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                    ✉️
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                    </div>
                    <a href="mailto:bldr.management@gmail.com" style={{ fontSize: 14.5, fontWeight: 700, color: '#141416', textDecoration: 'none' }}>
                      bldr.management@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Operating Entity Note */}
              <div style={{ borderTop: '1px solid rgba(20,20,22,0.08)', paddingTop: 18, fontSize: 12.5, color: '#64748B', lineHeight: 1.6 }}>
                <div><strong>{isRtl ? 'الكيان القانوني المشغل:' : 'Operating Entity:'}</strong></div>
                <div>Evolve bldr for Business Management</div>
                <div>Giza, Egypt</div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 18,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: '32px 32px',
                boxShadow: '0 4px 16px rgba(20,20,22,0.04)',
              }}
            >
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: '#ECFDF5',
                      color: '#059669',
                      fontSize: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#141416', marginBottom: 8 }}>
                    {isRtl ? 'تم استلام رسالتك بنجاح!' : 'Message Received!'}
                  </h3>
                  <p style={{ color: '#5A6A80', fontSize: 14.5, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 20px' }}>
                    {isRtl
                      ? `شكراً لك ${formState.name}، سيقوم فريق خدمة العملاء بمراجعة استفسارك والتواصل معك في أقرب وقت.`
                      : `Thank you ${formState.name}. Our team will review your inquiry and follow up shortly.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    style={{
                      background: '#141416',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h2 style={{ fontSize: 19, fontWeight: 700, color: '#141416', margin: '0 0 2px' }}>
                    {isRtl ? 'أرسل لنا رسالة مباشرة' : 'Send us a Message'}
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#141416', marginBottom: 5 }}>
                        {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isRtl ? 'مثال: أحمد سامي' : 'e.g. John Smith'}
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 12px',
                          color: '#141416',
                          fontSize: 13.5,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#141416', marginBottom: 5 }}>
                        {isRtl ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@email.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 12px',
                          color: '#141416',
                          fontSize: 13.5,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#141416', marginBottom: 5 }}>
                        {isRtl ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        placeholder="+20 10 0000 0000"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 12px',
                          color: '#141416',
                          fontSize: 13.5,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#141416', marginBottom: 5 }}>
                        {isRtl ? 'موضوع الاستفسار' : 'Inquiry Subject'}
                      </label>
                      <select
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: 8,
                          padding: '10px 12px',
                          color: '#141416',
                          fontSize: 13.5,
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="Course Enrollment">{isRtl ? 'التسجيل في الدورات والبرامج' : 'Course & Program Enrollment'}</option>
                        <option value="Payment Inquiry">{isRtl ? 'استفسارات الدفع والفواتير' : 'Payment & Billing Inquiry'}</option>
                        <option value="Provider Partnership">{isRtl ? 'شراكات المعلمين والأكاديميات' : 'Provider / Instructor Partnership'}</option>
                        <option value="General Inquiry">{isRtl ? 'استفسار عام' : 'General Inquiry'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#141416', marginBottom: 5 }}>
                      {isRtl ? 'تفاصيل الرسالة *' : 'Message *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={isRtl ? 'اكتب تفاصيل استفسارك هنا...' : 'Write your question or request here...'}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: 8,
                        padding: '10px 12px',
                        color: '#141416',
                        fontSize: 13.5,
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: '#141416',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 8,
                      padding: '12px 24px',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      marginTop: 4,
                    }}
                  >
                    {loading ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الرسالة ←' : 'Send Message →')}
                  </button>
                </form>
              )}
            </div>
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
