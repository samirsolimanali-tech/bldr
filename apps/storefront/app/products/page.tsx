'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens, formatEGP } from '@bldr/ui';

export interface ProductItem {
  id: string;
  title: string;
  titleAr: string;
  provider: string;
  providerCode: string;
  providerSlug: string;
  chipBg: string;
  chipFg: string;
  type: 'Course' | 'Workshop' | 'Event' | 'Assessment';
  typeAr: string;
  shortDesc: string;
  shortDescAr: string;
  priceEGP: number;
  duration: string;
  durationAr: string;
  paySlug: string;
  listingUrl: string;
}

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'prod-1',
    title: 'Full-Stack Web Bootcamp (12 Weeks)',
    titleAr: 'معسكر تطوير الويب الشامل (١٢ أسبوع)',
    provider: 'StudyHub / TechBridge',
    providerCode: 'SH',
    providerSlug: 'bldr',
    chipBg: '#E6EFEB',
    chipFg: '#2E6F5E',
    type: 'Course',
    typeAr: 'دورة تدريبية مكثفة',
    shortDesc: 'Hands-on live engineering cohort covering React, Node.js, PostgreSQL, and payment architecture with 1-on-1 mentorship.',
    shortDescAr: 'معسكر تدريبي عملي مباشر يغطي React و Node.js وقواعد البيانات مع مشاريع تخرج واقعية ومتابعة فردية.',
    priceEGP: 4800,
    duration: '12 Weeks (Live)',
    durationAr: '١٢ أسبوع (مباشر)',
    paySlug: 'sh-8k2m9q',
    listingUrl: '/listings/1',
  },
  {
    id: 'prod-2',
    title: 'Grade 12 Revision Series & Exam Prep',
    titleAr: 'سلسلة مراجعات الثانوية العامة والاختبارات',
    provider: 'Apex Classes',
    providerCode: 'AC',
    providerSlug: 'bldr',
    chipBg: '#E8EEF7',
    chipFg: '#2C5F9E',
    type: 'Course',
    typeAr: 'دورة دراسية معتمدة',
    shortDesc: 'Structured cohort review covering physics, mathematics, and exam techniques with weekly assessments and live tutor Q&A.',
    shortDescAr: 'مراجعة شاملة لمناهج الرياضيات والفيزياء مع بنوك أسئلة تفاعلية ومتابعة أسبوعية مباشرة مع كبار المدرسين.',
    priceEGP: 2400,
    duration: '6 Weeks Cohort',
    durationAr: '٦ أسابيع تفاعلية',
    paySlug: 'ac-9w3e5z',
    listingUrl: '/listings/2',
  },
  {
    id: 'prod-3',
    title: 'Gamified Learning & Skill Assessment Pass',
    titleAr: 'باقة التقييم التفاعلي والألعاب التعليمية',
    provider: 'منصة الحصة (EL HESA)',
    providerCode: 'EH',
    providerSlug: 'bldr',
    chipBg: '#FBF3E0',
    chipFg: '#B8860B',
    type: 'Assessment',
    typeAr: 'تقييم وتدريب تفاعلي',
    shortDesc: 'Gamified Egyptian K-12 learning pass with micro-quizzes, automated badges, and performance diagnostics.',
    shortDescAr: 'اشتراك منصة الحصة التعليمية التفاعلية مع بنك الأسئلة المُميع وتشخيص فوري لمستوى الطالب.',
    priceEGP: 600,
    duration: 'Full Term Access',
    durationAr: 'متاح طوال الفصل الدراسي',
    paySlug: 'eh-2n6b8v',
    listingUrl: '/listings/3',
  },
  {
    id: 'prod-4',
    title: 'CV Optimization & Tech Handover Workshop',
    titleAr: 'ورشة عمل صياغة السيرة الذاتية والجاهزية الوظيفية',
    provider: 'Career Hub',
    providerCode: 'CH',
    providerSlug: 'bldr',
    chipBg: '#F0EAF7',
    chipFg: '#7A4CA0',
    type: 'Workshop',
    typeAr: 'ورشة عمل تدريبية',
    shortDesc: 'Interactive workshop on portfolio presentation, technical interviews, and salary negotiation for tech specialists.',
    shortDescAr: 'ورشة تدريبية مكثفة للمتخصصين في التكنولوجيا لتجهيز معرض الأعمال واجتياز المقابلات التقنية باحترافية.',
    priceEGP: 350,
    duration: '1 Day Intensive',
    durationAr: 'يوم تدريبي مكثف (٤ ساعات)',
    paySlug: 'ch-5t8o2p',
    listingUrl: '/listings/4',
  },
  {
    id: 'prod-5',
    title: 'AWS Cloud Practitioner Prep Lab',
    titleAr: 'المعمل التدريبي لاجتياز شهادة AWS Cloud',
    provider: 'StudyHub Tech',
    providerCode: 'SH',
    providerSlug: 'bldr',
    chipBg: '#E6EFEB',
    chipFg: '#2E6F5E',
    type: 'Course',
    typeAr: 'شهادة مهنية دولية',
    shortDesc: 'Official AWS Cloud exam preparation course with practice exams, cloud sandbox labs, and certified tutor coaching.',
    shortDescAr: 'كورس إعداد متقدم لشهادة الحوسبة السحابية من أمازون مع معامل تطبيقية وامتحانات تجريبية مماثلة للاختبار الدولي.',
    priceEGP: 1800,
    duration: '4 Weeks Lab',
    durationAr: '٤ أسابيع معامل واختبارات',
    paySlug: 'sh-4r7t1a',
    listingUrl: '/listings/5',
  },
  {
    id: 'prod-6',
    title: 'Digital Creator Studio Masterclass',
    titleAr: 'ماستركلاس صناعة المحتوى المرئي والإعلانات',
    provider: 'Sidekick Media Lab',
    providerCode: 'SK',
    providerSlug: 'bldr',
    chipBg: '#FBEBE9',
    chipFg: '#D10721',
    type: 'Workshop',
    typeAr: 'ورشة عمل تطبيقية',
    shortDesc: 'Master mobile video shooting, viral hooks scripting, lighting setups, and CapCut/Premiere editing for social creators.',
    shortDescAr: 'ماستركلاس عملي في تصوير فيديوهات السوشيال ميديا، كتابة الإسكربتات الجاذبة، وضبط الإضاءة والمونتاج السريع.',
    priceEGP: 3200,
    duration: '2 Days Weekend',
    durationAr: 'يومان خلال عطلة نهاية الأسبوع',
    paySlug: 'sk-media-prod',
    listingUrl: '/listings/6',
  },
];

export default function ProductsPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isRtl = lang === 'AR';

  const types = isRtl
    ? ['الكل', 'الدورات والمعسكرات', 'ورش العمل', 'التقييمات والاختبارات']
    : ['All', 'Course', 'Workshop', 'Assessment'];

  const filteredProducts = selectedType === 'All' || selectedType === 'الكل'
    ? PRODUCTS_CATALOG
    : PRODUCTS_CATALOG.filter((p) => {
        if (selectedType === 'الدورات والمعسكرات' && p.type === 'Course') return true;
        if (selectedType === 'ورش العمل' && p.type === 'Workshop') return true;
        if (selectedType === 'التقييمات والاختبارات' && p.type === 'Assessment') return true;
        return p.type === selectedType;
      });

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

      <main style={{ flex: 1, padding: '56px 32px 84px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ maxWidth: 760, marginBottom: 44 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 999,
              background: '#FFFFFF',
              border: '1px solid rgba(20,20,22,0.08)',
              fontSize: 12,
              fontWeight: 600,
              color: '#2E6F5E',
              marginBottom: 16,
            }}>
              <span>✦</span>
              <span>{isRtl ? 'دليل منتجات ودورات الشركاء والمراكز' : 'Verified Provider Courses, Workshops & Events'}</span>
            </div>

            <h1 style={{
              margin: '0 0 16px',
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#141416',
              lineHeight: 1.15,
            }}>
              {isRtl
                ? 'دورات وورش عمل معتمدة، مع دفع مباشر عبر البوابة المركزية.'
                : 'Courses, workshops & events from verified ecosystem providers.'}
            </h1>
            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, fontWeight: 300, color: '#47454A' }}>
              {isRtl
                ? 'استعرض جميع الدورات والمجموعات الدراسية المسجلة. يمكنك إتمام الحجز والدفع فوراً عبر كروت ميزة والمحافظ وفوري، أو فتح صفحة المنتج لمراجعة المنهج والمدرس.'
                : 'Browse registered provider courses and cohorts. Pay immediately through our Central Gateway (Meeza, Wallets, Fawry) or view the provider product page for curriculum details.'}
            </p>
          </div>

          {/* Type Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {types.map((t) => {
              const isSelected = selectedType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    border: '1px solid',
                    borderColor: isSelected ? '#12203C' : 'rgba(20,20,22,0.12)',
                    background: isSelected ? '#12203C' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#47454A',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid rgba(20,20,22,0.08)',
                  padding: '26px 24px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(20,20,22,0.04)',
                }}
              >
                <div>
                  {/* Provider Chip & Type */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: prod.chipBg,
                      color: prod.chipFg,
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                    }}>
                      {prod.provider}
                    </span>
                    <span style={{ fontSize: 12, color: '#8A94A6', fontWeight: 600 }}>
                      {isRtl ? prod.durationAr : prod.duration}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 style={{ margin: '0 0 10px', fontSize: 19, fontWeight: 700, color: '#141416', letterSpacing: '-0.02em', lineHeight: 1.35 }}>
                    {isRtl ? prod.titleAr : prod.title}
                  </h2>
                  <p style={{ margin: '0 0 20px', fontSize: 14, color: '#47454A', lineHeight: 1.6, fontWeight: 300 }}>
                    {isRtl ? prod.shortDescAr : prod.shortDesc}
                  </p>
                </div>

                {/* Price & Dual Actions */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #E3E8EF', marginBottom: 16 }}>
                    <span style={{ fontSize: 12, color: '#8A94A6', fontWeight: 600 }}>
                      {isRtl ? 'رسوم الدورة / الحجز:' : 'Enrollment Fee:'}
                    </span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#12203C', fontFamily: tokens.fonts.mono }}>
                      {formatEGP(prod.priceEGP)}
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                    {/* Action 1: Direct Payment Gateway Checkout */}
                    <Link
                      href={`/pay/${prod.paySlug}`}
                      style={{
                        height: 42,
                        borderRadius: 8,
                        background: '#2E6F5E',
                        color: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(46, 111, 94, 0.25)',
                      }}
                    >
                      <span>💳</span>
                      <span>{isRtl ? 'حجز ودفع فوري' : 'Instant Checkout'}</span>
                    </Link>

                    {/* Action 2: Provider Product Page */}
                    <Link
                      href={`/providers/${prod.providerSlug}`}
                      style={{
                        height: 42,
                        borderRadius: 8,
                        background: '#FFFFFF',
                        border: '1px solid #D3DAE4',
                        color: '#12203C',
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                      }}
                    >
                      {isRtl ? 'صفحة المزود ←' : 'Provider Info →'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
