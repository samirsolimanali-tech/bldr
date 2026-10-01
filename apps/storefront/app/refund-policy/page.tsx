'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal } from '@bldr/ui';

export default function RefundPolicyPage() {
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
              {isRtl ? 'سياسة الاسترجاع والإلغاء' : 'Refund Policy'}
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
                  {isRtl ? 'حماية المستهلك وحقوق الطلاب' : 'Consumer Protection & Student Rights'}
                </span>
                <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: '#141416', margin: '8px 0 12px', letterSpacing: '-0.03em' }}>
                  {isRtl ? 'سياسة الاسترجاع والإلغاء' : 'Refund & Cancellation Policy'}
                </h1>
                <div style={{ fontSize: 13, color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <span>{isRtl ? 'تاريخ التحديث: أكتوبر ٢٠٢٦' : 'Last Updated: October 2026'}</span>
                  <span>•</span>
                  <span>{isRtl ? 'قانون حماية المستهلك المصري رقم ١٨١ لسنة ٢٠١٨' : 'Egyptian Consumer Protection Law No. 181/2018'}</span>
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
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>١. فترة الاسترجاع القياسية (١٤ يوماً)</h2>
                  <p style={{ margin: 0 }}>
                    وفقاً لأحكام قانون حماية المستهلك المصري رقم ١٨١ لسنة ٢٠١٨، يحق للطلاب المسجلين في البرامج والدورات التعليمية طلب استرداد المبلغ المدفوع خلال <strong>١٤ يوماً تقويمياً</strong> من تاريخ الشراء، شريطة عدم حضور أو استهلاك أكثر من <strong>٢٥٪</strong> من المحاضرات التفاعلية أو المواد المسجلة للدورة.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٢. المنتجات والخدمات غير القابلة للاسترداد</h2>
                  <p style={{ margin: '0 0 10px' }}>لا تشمل سياسة الاسترجاع البنود التالية بعد استخدامها أو تسليمها:</p>
                  <ul style={{ margin: 0, paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li><strong>أكواد التفعيل الرقمية أو الورقية:</strong> لا يمكن إلغاء أو استرجاع قيمة الكود بعد إدخاله وتفعيله على المنصة.</li>
                    <li><strong>المواد والملفات القابلة للتحميل:</strong> الكتب الإلكترونية، ملخصات الامتحانات، وبنوك الأسئلة بعد تحميلها.</li>
                    <li><strong>الجلسات الفردية الخاصة:</strong> الجلسات الاستشارية أو التعليمية المنفذة، أو التي تم إلغاؤها قبل الموعد بأقل من ٢٤ ساعة.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٣. آليات وقنوات رد الأموال</h2>
                  <p style={{ margin: '0 0 10px' }}>يتم إعادة المبالغ المستردة بنفس وسيلة الدفع الأصلية التي استخدمت أثناء الشراء:</p>
                  <ul style={{ margin: 0, paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li><strong>البطاقات البنكية (فيزا / ماستركارد / ميزة):</strong> يتم الإيداع خلال ٥ إلى ١٤ يوم عمل وفقاً لدورة المقاصة للبنك المصدر.</li>
                    <li><strong>المحافظ الإلكترونية (فودافون كاش، أورنج كاش، إي آند، وي باي):</strong> يتم الإيداع خلال ٢٤ إلى ٤٨ ساعة عمل.</li>
                    <li><strong>فوري كاش (Fawry):</strong> يتم إصدار كود صرف نقدي فوري صالح للاستلام من أي منفذ فوري في مصر عبر رسالة نصية SMS.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٤. خطوات تقديم طلب الاسترجاع</h2>
                  <p style={{ margin: 0 }}>
                    لطلب استرجاع المبلغ، يرجى إرسال بريد إلكتروني إلى <a href="mailto:bldr.management@gmail.com" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none' }}>bldr.management@gmail.com</a> متضمناً رقم مرجع الطلب واسم الدورة ورقم الهاتف المستخدم عند التسجيل، أو التواصل معنا عبر الواتساب المباشر.
                  </p>
                </section>

                <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#141416', marginBottom: 8 }}>٥. خدمة العملاء ودعم المدفوعات</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#475569' }}>
                    <div><strong>المقر الرئيسي:</strong> الجيزة، جمهورية مصر العربية</div>
                    <div><strong>الهاتف / واتساب:</strong> <a href="tel:+201030165000" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none', direction: 'ltr', display: 'inline-block' }}>+20 10 30165000</a></div>
                    <div><strong>البريد الإلكتروني:</strong> <a href="mailto:bldr.management@gmail.com" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none' }}>bldr.management@gmail.com</a></div>
                  </div>
                </section>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>1. Standard Refund Window (14 Days)</h2>
                  <p style={{ margin: 0 }}>
                    In accordance with Egyptian Consumer Protection Law No. 181 of 2018, enrolled students may request a full refund within <strong>14 calendar days</strong> of their initial payment, provided that fewer than <strong>25%</strong> of live lectures or digital syllabus modules have been accessed.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>2. Non-Refundable Items &amp; Services</h2>
                  <p style={{ margin: '0 0 10px' }}>The following digital products and services are non-refundable once issued or accessed:</p>
                  <ul style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li><strong>Activation Codes:</strong> Digital or physical voucher codes once redeemed on the platform.</li>
                    <li><strong>Downloadable Course Materials:</strong> Digital books, revision sheets, and past-exam question banks once downloaded.</li>
                    <li><strong>Completed 1-on-1 Sessions:</strong> Private consulting or tutoring sessions that have been held, or cancelled with less than 24 hours notice.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>3. Refund Execution &amp; Processing Rails</h2>
                  <p style={{ margin: '0 0 10px' }}>Approved refunds are automatically returned via the original payment rail:</p>
                  <ul style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li><strong>Credit / Debit Cards:</strong> Returned to the issuing bank within 5 to 14 business days.</li>
                    <li><strong>Mobile Wallets (Vodafone Cash, Orange, e&amp;, WE Pay):</strong> Processed within 24 to 48 business hours.</li>
                    <li><strong>Fawry Kiosk:</strong> Disbursed via instant Fawry cash-out reference code sent via SMS.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#141416', marginBottom: 8 }}>4. How to Submit a Refund Claim</h2>
                  <p style={{ margin: 0 }}>
                    To request a refund, email our student support team at <a href="mailto:bldr.management@gmail.com" style={{ color: '#D10721', fontWeight: 600, textDecoration: 'none' }}>bldr.management@gmail.com</a> with your Order Reference ID and reason for cancellation, or reach out via our direct WhatsApp line.
                  </p>
                </section>

                <section style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#141416', marginBottom: 8 }}>5. Support &amp; Billing Inquiries</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#475569' }}>
                    <div><strong>Address:</strong> Giza, Egypt</div>
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
