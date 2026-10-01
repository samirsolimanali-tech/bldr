'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal } from '@bldr/ui';

export default function TermsOfServicePage() {
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
              {isRtl ? 'شروط الخدمة' : 'Terms of Service'}
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
                  {isRtl ? 'الشروط والأحكام القانونية' : 'Legal Terms & User Agreement'}
                </span>
                <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: '#141416', margin: '8px 0 12px', letterSpacing: '-0.03em' }}>
                  {isRtl ? 'شروط الخدمة والتعاقد' : 'Terms of Service'}
                </h1>
                <div style={{ fontSize: 13, color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <span>{isRtl ? 'تاريخ التحديث: أكتوبر ٢٠٢٦' : 'Effective: October 2026'}</span>
                  <span>•</span>
                  <span>{isRtl ? 'تخضع لقوانين جمهورية مصر العربية' : 'Governed by the Laws of the Arab Republic of Egypt'}</span>
                </div>
              </div>

              {/* Quick Language Toggle */}
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
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>١. الكيان المشغل والتاجر المسجل (Merchant of Record)</h2>
                  <p style={{ margin: 0 }}>
                    شركة <strong>إيفولف بلدر لإدارة الأعمال (bldr)</strong>، ومقرها الجيزة، مصر، هي التاجر الرسمي المسجل لكافة المعاملات المالية وعمليات السداد التي تتم عبر المنصة والروابط الدفع التابعة لمشاريعنا التعليمية والرقمية (بما في ذلك منصة الحصة، StudyHub، Apex Classes، وCareerHub).
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٢. العملة وتفاصيل السداد</h2>
                  <p style={{ margin: 0 }}>
                    جميع الأسعار والمعاملات على المنصة مقومة بالجنيه المصري (EGP). يتم السداد عبر بوابات الدفع الإلكترونية المعتمدة (فيزا، ماستركارد، ميزة، المحافظ الإلكترونية، وشبكة فوري). ولا يتم فرض أي رسوم غير معلنة على الطالب.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٣. تفعيل الاشتراكات وتسليم الدورات</h2>
                  <p style={{ margin: 0 }}>
                    يتم منح حق الوصول وتفعيل الاشتراك الأكاديمي فورياً وبشكل آلي بمجرد استلام إشعار السداد المعتمد من بوابة الدفع، أو فور سداد المبلغ نقداً في أحد منافذ فوري عبر كود المعاملة المرجعي.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٤. أكواد التفعيل المسبقة الدفع</h2>
                  <p style={{ margin: 0 }}>
                    أكواد التفعيل الورقية والرقمية الصادرة عبر السناتر التعليمية أو المدرسين المعتمدين هي قسائم أحادية الاستخدام (Single-use)، وتمنح حاملها حق الوصول المباشر للدورة المحددة. لا يمكن إعادة استخدام الكود أو استبداله بقيمة نقدية بعد تفعيله.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٥. القانون الحاكم وفض النزاعات</h2>
                  <p style={{ margin: 0 }}>
                    تخضع هذه الشروط وتفسر وفقاً للقوانين واللوائح المعمول بها في جمهورية مصر العربية، وتختص المحاكم المصرية بالفصل في أي نزاع ينشأ عنها.
                  </p>
                </section>

                <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٦. خدمة العملاء والدعم القانوني</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#475569' }}>
                    <div><strong>المقر:</strong> الجيزة، جمهورية مصر العربية</div>
                    <div><strong>الهاتف / واتساب:</strong> <a href="tel:+201030165000" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none', direction: 'ltr', display: 'inline-block' }}>+20 10 30165000</a></div>
                    <div><strong>البريد الإلكتروني:</strong> <a href="mailto:bldr.management@gmail.com" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none' }}>bldr.management@gmail.com</a></div>
                  </div>
                </section>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>1. Merchant of Record (MoR) Relationship</h2>
                  <p style={{ margin: 0 }}>
                    <strong>Evolve bldr for Business Management (bldr)</strong>, based in Giza, Egypt, serves as the sole Merchant of Record (MoR) for all financial transactions and course registrations processed across bldr platform ventures (including EL HESA, StudyHub, Apex Classes, and CareerHub).
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>2. Currency &amp; Payment Processing</h2>
                  <p style={{ margin: 0 }}>
                    All platform transactions are billed in Egyptian Pounds (EGP). Payments are securely acquired via PCI-DSS certified payment processors (Geidea, Paymob, and Fawry Pay). No hidden surcharges are applied.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>3. Course Enrollment &amp; Automated Delivery</h2>
                  <p style={{ margin: 0 }}>
                    Course and cohort access is provisioned automatically upon successful confirmation webhook from the payment rail or upon physical cash deposit at an authorized Fawry retail terminal using your reference number.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>4. Activation Codes &amp; Vouchers</h2>
                  <p style={{ margin: 0 }}>
                    Prepaid activation codes issued through partner learning centers and instructors are single-use tokens. Once redeemed by a student account, the token cannot be reused or transferred.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>5. Governing Law &amp; Jurisdiction</h2>
                  <p style={{ margin: 0 }}>
                    These terms are governed by and construed in accordance with the laws of the Arab Republic of Egypt.
                  </p>
                </section>

                <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#141416', marginBottom: 8 }}>6. Customer Care &amp; Legal Inquiries</h2>
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
