'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { tokens } from '@bldr/ui';

function ProviderEnrollContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider') || 'StudyHub';
  const providerCode = searchParams.get('providerCode') || 'SH';
  const order = searchParams.get('order') || 'SH-COURSE-4581';
  const product = searchParams.get('product') || 'Web Engineering Bootcamp';
  const status = searchParams.get('status') || 'PAID';

  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const isRtl = lang === 'AR';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        background: '#0F172A',
        color: '#F8FAFC',
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : tokens.fonts.ui,
        padding: '32px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Top Bar / Provider Header */}
      <header
        style={{
          width: '100%',
          maxWidth: 880,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 36,
          padding: '12px 20px',
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#2E6F5E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              boxShadow: '0 2px 10px rgba(46,111,94,0.4)',
            }}
          >
            {providerCode}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{provider}</span>
              <span style={{ fontSize: 11, background: 'rgba(46,111,94,0.3)', color: '#4ADE80', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                {isRtl ? 'بوابة المزود المعتمدة' : 'Official Provider Portal'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>
              {isRtl ? 'نظام إدارة التعلم وشؤون الطلاب (LMS)' : 'Learning Management System & Student Enrollment'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => setLang(lang === 'EN' ? 'AR' : 'EN')}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#E2E8F0',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {lang === 'EN' ? 'العربية' : 'English'}
          </button>
          <Link
            href="/products"
            style={{
              fontSize: 12,
              color: '#94A3B8',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {isRtl ? '← العودة للمتجر' : '← Back to bldr'}
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          width: '100%',
          maxWidth: 880,
          background: '#1E293B',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 24px 60px -15px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Banner with Paid User Confirmation */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
            padding: '36px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.18)', padding: '6px 14px', borderRadius: 20, marginBottom: 16 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DCFCE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#DCFCE7' }}>
              {isRtl ? 'تم تأكيد الالتحاق كطالب مسجل ومدفوع' : 'Verified Paid Student Enrollment'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, margin: '0 0 12px', color: '#FFFFFF' }}>
            {isRtl ? `مرحباً بك في ${product}!` : `Welcome to ${product}!`}
          </h1>

          <p style={{ fontSize: 14.5, color: '#E2E8F0', maxWidth: 640, lineHeight: 1.6, margin: 0 }}>
            {isRtl
              ? `تم سداد الرسوم بنجاح عبر بوابة الدفع المركزية لـ bldr. تم تفعيل حسابك كطالب معتمد لدى ${provider}، وأصبح بإمكانك الانضمام للمحاضرات وتحميل الملفات فورياً.`
              : `Your payment was successfully settled via bldr Central Payment Hub. Your student seat at ${provider} is activated with full access to sessions, resources, and live community.`}
          </p>

          <div
            style={{
              marginTop: 20,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              fontSize: 12,
              fontFamily: tokens.fonts.mono,
              background: 'rgba(0,0,0,0.25)',
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <span style={{ color: '#94A3B8' }}>{isRtl ? 'رقم الطلب:' : 'Order Ref:'} </span>
              <span style={{ color: '#F8FAFC', fontWeight: 700 }}>{order}</span>
            </div>
            <div>
              <span style={{ color: '#94A3B8' }}>{isRtl ? 'حالة السداد:' : 'Payment Status:'} </span>
              <span style={{ color: '#4ADE80', fontWeight: 700 }}>{status} ✓</span>
            </div>
            <div>
              <span style={{ color: '#94A3B8' }}>{isRtl ? 'الجهة التعليمية:' : 'Provider:'} </span>
              <span style={{ color: '#F8FAFC', fontWeight: 700 }}>{provider}</span>
            </div>
          </div>
        </div>

        {/* Content Body / Next Steps */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Action Grid */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', margin: '0 0 18px' }}>
              {isRtl ? 'خطواتك التالية لبدء الدراسة:' : 'Your Next Steps to Start Learning:'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
              {/* Step 1: Virtual Classroom */}
              <div
                style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: 14,
                  padding: '22px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                  {isRtl ? 'القاعة الافتراضية المباشرة' : 'Live Virtual Classroom'}
                </div>
                <div style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5, flex: 1 }}>
                  {isRtl
                    ? 'رابط Zoom وقاعة المحاضرات الأسبوعية للمسجلين في الدفعة.'
                    : 'Access your live lecture stream, cohort calendar, and recorded replays.'}
                </div>
                <a
                  href="#classroom"
                  onClick={(e) => { e.preventDefault(); alert(isRtl ? 'جاري فتح القاعة الافتراضية...' : 'Launching virtual classroom session...'); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'دخول القاعة الآن ←' : 'Enter Classroom →'}
                </a>
              </div>

              {/* Step 2: Student Community */}
              <div
                style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: 14,
                  padding: '22px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(34,197,94,0.15)', color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                  {isRtl ? 'مجتمع الطلاب والموجهين' : 'Student & Mentor Group'}
                </div>
                <div style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5, flex: 1 }}>
                  {isRtl
                    ? 'قناة التفاعل الخاصة والمناقشات المباشرة مع المدرسين على Discord أو واتساب.'
                    : 'Join the private WhatsApp & Discord channel for 1-on-1 mentor guidance.'}
                </div>
                <a
                  href="#community"
                  onClick={(e) => { e.preventDefault(); alert(isRtl ? 'تم إرسال دعوة الانضمام لمجموعتك الخاصة!' : 'Invitation sent to your verified student account!'); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#16A34A',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'انضم للمجموعة ←' : 'Join Community →'}
                </a>
              </div>

              {/* Step 3: Resources & Syllabus */}
              <div
                style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  borderRadius: 14,
                  padding: '22px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(234,179,8,0.15)', color: '#FACC15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                  {isRtl ? 'المقررات والمواد التعليمية' : 'Syllabus & Materials'}
                </div>
                <div style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5, flex: 1 }}>
                  {isRtl
                    ? 'تحميل شرائح العرض، بنوك الأسئلة، وملفات التمارين البرمجية والعملية.'
                    : 'Download PDF guides, assignments, exercise repositories, and datasets.'}
                </div>
                <a
                  href="#download"
                  onClick={(e) => { e.preventDefault(); alert(isRtl ? 'جاري تجهيز حزمة الملفات للتنزيل...' : 'Preparing digital assets download bundle...'); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#334155',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'تنزيل الحزمة (ZIP) ↓' : 'Download Assets ↓'}
                </a>
              </div>
            </div>
          </div>

          {/* Ledger Proof / Trust Notice */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: '#0F172A',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <div style={{ fontSize: 12.5, color: '#CBD5E1' }}>
                {isRtl
                  ? 'تمت تسوية هذه المعاملة عبر المحرك المالي لـ bldr. تم إصدار إشعار الويب هوك وتثبيت القيد في السجل المالي المزدوج.'
                  : 'Settled via bldr Central Financial Engine. Webhook dispatch confirmed and double-entry ledger updated.'}
              </div>
            </div>
            <Link
              href="/products"
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: '#38BDF8',
                textDecoration: 'none',
              }}
            >
              {isRtl ? 'استعراض المزيد من البرامج ←' : 'Browse More Programs →'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProviderEnrollPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading provider LMS...</div>}>
      <ProviderEnrollContent />
    </Suspense>
  );
}
