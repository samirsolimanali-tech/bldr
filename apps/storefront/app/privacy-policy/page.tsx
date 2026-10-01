'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal } from '@bldr/ui';

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const isRtl = lang === 'AR';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F4F5F7',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : "'Plus Jakarta Sans', system-ui, sans-serif",
        color: '#141416',
      }}
    >
      <BldrNav
        lang={lang}
        onLanguageChange={setLang}
        onStartProject={() => setIsContactOpen(true)}
      />

      <main style={{ flex: 1, padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5A6A80', marginBottom: 24 }}>
            <Link href="/" style={{ color: '#8A94A6', textDecoration: 'none' }}>
              {isRtl ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#141416' }}>
              {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </span>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid rgba(20,20,22,0.08)',
              padding: '44px 40px',
              boxShadow: '0 4px 20px rgba(20,20,22,0.03)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #E2E8F0', paddingBottom: 24, marginBottom: 32 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#D10721', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {isRtl ? 'الامتثال وحماية البيانات الشخصية' : 'Compliance & Data Protection'}
                </span>
                <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: '#141416', margin: '8px 0 12px', letterSpacing: '-0.03em' }}>
                  {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </h1>
                <div style={{ fontSize: 13, color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <span>{isRtl ? 'تاريخ التحديث: أكتوبر ٢٠٢٦' : 'Last Updated: October 2026'}</span>
                  <span>•</span>
                  <span>{isRtl ? 'القانون المصري لحماية البيانات رقم ١٥١ لسنة ٢٠٢٠' : 'Egyptian Personal Data Protection Law (Law 151/2020)'}</span>
                </div>
              </div>

              {/* Quick Language Toggle inside Card */}
              <div style={{ display: 'flex', gap: 6, background: '#F1F5F9', padding: 4, borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setLang('EN')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: lang === 'EN' ? '#FFFFFF' : 'transparent',
                    color: lang === 'EN' ? '#141416' : '#64748B',
                    boxShadow: lang === 'EN' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang('AR')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: lang === 'AR' ? '#FFFFFF' : 'transparent',
                    color: lang === 'AR' ? '#141416' : '#64748B',
                    boxShadow: lang === 'AR' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Content Sections */}
            {isRtl ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>١. الكيان المشغل والنطاق القانوني</h2>
                  <p style={{ margin: 0 }}>
                    تلتزم شركة <strong>إيفولف بلدر لإدارة الأعمال (bldr)</strong>، ومقرها الجيزة، جمهورية مصر العربية، بحماية خصوصية وبيانات كافة المستخدمين والطلاب وأولياء الأمور والشركاء عبر منصاتنا وتطبيقاتنا التعليمية والرقمية (بما في ذلك منصة الحصة، StudyHub، Apex Classes، وCareerHub).
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٢. البيانات التي نقوم بجمعها</h2>
                  <p style={{ margin: '0 0 10px' }}>نقوم بجمع البيانات الضرورية فقط لإتمام العمليات التعليمية وسداد الرسوم:</p>
                  <ul style={{ margin: 0, paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li><strong>بيانات الهوية والتواصل:</strong> الاسم الكامل، البريد الإلكتروني، رقم الهاتف المحمول والواتساب (لإشعارات السداد وتأكيد الحجز).</li>
                    <li><strong>بيانات المعاملات المالية:</strong> رقم مرجع الطلب، قيمة الفاتورة بالجنيه المصري، طريقة الدفع المختارة، والتوقيت الزمني للمعاملة.</li>
                    <li><strong>بيانات الحساب الأكاديمي:</strong> الدورات المسجلة، المعسكرات التدريبية، وسجل التقدم الدراسي عبر المنصة.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٣. أمان المدفوعات وعزل بيانات البطاقات البنكية</h2>
                  <p style={{ margin: 0 }}>
                    <strong>نحن لا نقوم بتخزين أو حفظ أرقام البطاقات الائتمانية أو رموز الأمان (CVV)</strong> على خوادمنا نهائياً. يتم معالجة جميع المدفوعات عبر بوابات دفع إلكترونية معتمدة ومطابقة لأعلى معايير الأمان العالمية (PCI-DSS) مثل Geidea وPaymob وشبكة فوري (Fawry Pay).
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٤. حقوق صاحب البيانات</h2>
                  <p style={{ margin: 0 }}>
                    وفقاً لأحكام قانون حماية البيانات الشخصية المصري رقم ١٥١ لسنة ٢٠٢٠، يحق لك في أي وقت:
                  </p>
                  <ul style={{ margin: '8px 0 0', paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li>طلب الاطلاع على نسختك من البيانات الشخصية المخزنة لدينا.</li>
                    <li>تعديل أو تصحيح أي بيانات غير دقيقة.</li>
                    <li>طلب حذف بيانات الحساب غير المرتبطة بالسجلات المحاسبية والإلزامية قانوناً.</li>
                  </ul>
                </section>

                <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٥. معلومات التواصل ومسؤول حماية البيانات</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#475569' }}>
                    <div><strong>العنوان:</strong> الجيزة، جمهورية مصر العربية</div>
                    <div><strong>الهاتف / واتساب:</strong> <a href="tel:+201030165000" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none', direction: 'ltr', display: 'inline-block' }}>+20 10 30165000</a></div>
                    <div><strong>البريد الإلكتروني:</strong> <a href="mailto:bldr.management@gmail.com" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none' }}>bldr.management@gmail.com</a></div>
                  </div>
                </section>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>1. Operating Entity &amp; Legal Framework</h2>
                  <p style={{ margin: 0 }}>
                    <strong>Evolve bldr for Business Management (bldr)</strong>, headquartered in Giza, Egypt, is dedicated to protecting the privacy and personal data of students, parents, tutors, and partners across our educational and technology ventures (including EL HESA, StudyHub, Apex Classes, and CareerHub).
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>2. Information We Collect</h2>
                  <p style={{ margin: '0 0 10px' }}>We collect only data necessary to fulfill enrollment and process payments:</p>
                  <ul style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li><strong>Identity &amp; Contact Data:</strong> Full Name, student email address, Egyptian mobile/WhatsApp phone number (for payment verification and access confirmations).</li>
                    <li><strong>Billing &amp; Transaction Logs:</strong> Order reference ID, amount in Egyptian Pounds (EGP), payment rail used, and execution timestamp.</li>
                    <li><strong>Academic Profile:</strong> Enrolled courses, cohort schedules, and syllabus access state.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>3. Payment Security &amp; Cardholder Isolation</h2>
                  <p style={{ margin: 0 }}>
                    <strong>We do not store or process payment card numbers or CVV security codes</strong> on our servers. All transactions are tokenized and processed directly by licensed, PCI-DSS certified payment processors (Geidea, Paymob, and Fawry Pay).
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>4. Data Subject Rights (Egyptian Law 151/2020)</h2>
                  <p style={{ margin: 0 }}>
                    Under the Egyptian Personal Data Protection Law (Law No. 151 of 2020), you maintain the right to:
                  </p>
                  <ul style={{ margin: '8px 0 0', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li>Request access to your stored personal records.</li>
                    <li>Request correction or rectification of incomplete or inaccurate information.</li>
                    <li>Request deletion of non-mandatory accounting records.</li>
                  </ul>
                </section>

                <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#141416', marginBottom: 8 }}>5. Contact Information &amp; Data Protection Officer</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#475569' }}>
                    <div><strong>Location:</strong> Giza, Egypt</div>
                    <div><strong>Phone / WhatsApp:</strong> <a href="tel:+201030165000" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none' }}>+20 10 30165000</a></div>
                    <div><strong>Email:</strong> <a href="mailto:bldr.management@gmail.com" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none' }}>bldr.management@gmail.com</a></div>
                  </div>
                </section>
              </div>
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
