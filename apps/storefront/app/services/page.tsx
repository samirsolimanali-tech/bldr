'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal, tokens, formatEGP } from '@bldr/ui';

export interface ServiceItem {
  slug: string;
  code: string;
  unit: string;
  title: string;
  titleAr: string;
  category: 'Marketing & Ads' | 'Brand & Creative' | 'Media & Video' | 'Software & Tech' | 'Strategy & Advisory';
  categoryAr: string;
  shortDesc: string;
  shortDescAr: string;
  priceEGP: number;
  deliveryTime: string;
  deliveryTimeAr: string;
  deliverables: string[];
  deliverablesAr: string[];
  paySlug: string;
}

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    slug: 'performance-ads',
    code: 'SK',
    unit: 'Sidekick Studio',
    title: 'Performance Ads & Paid Growth Engine',
    titleAr: 'إدارة الحملات الإعلانية الممولة ونمو المبيعات',
    category: 'Marketing & Ads',
    categoryAr: 'التسويق والإعلانات الممولة',
    shortDesc: 'End-to-end paid acquisition campaigns across Meta, Google Search, and TikTok with high-intent lead funnels and conversion optimization.',
    shortDescAr: 'إدارة متكاملة للحملات الإعلانية على فيسبوك، إنستغرام، جوجل، وتيك توك مع استهداف دقيق ومسارات بيع ترفع معدلات التحويل.',
    priceEGP: 12000,
    deliveryTime: 'Monthly Retainer',
    deliveryTimeAr: 'باقة شهرية مستمرة',
    deliverables: [
      'Meta & Google Ads account audit & setup',
      'High-converting ad copy and motion creative assets',
      'Pixel & Conversions API server-side tracking',
      'Weekly ROAS reporting and audience scaling',
    ],
    deliverablesAr: [
      'تهيئة وتدقيق حسابات إعلانات ميتا وجوجل وتيك توك',
      'كتابة نصوص إعلانية وتصميم كرييتف وفيديوهات احترافية',
      'ربط بيكسل التحويلات والمبيعات مع تتبع دقيق',
      'تقارير أسبوعية للعائد على الإنفاق الإعلاني ROAS',
    ],
    paySlug: 'sk-ads-camp',
  },
  {
    slug: 'brand-identity',
    code: 'SK',
    unit: 'Sidekick Studio',
    title: 'Full Brand Identity & Design System',
    titleAr: 'بناء الهوية البصرية المتكاملة ونظام التصميم',
    category: 'Brand & Creative',
    categoryAr: 'الهوية البصرية والتصميم',
    shortDesc: 'A distinctive brand identity crafted for Egyptian and regional MENA markets. From logo architecture to marketing assets and typography guidelines.',
    shortDescAr: 'هوية بصرية استثنائية مصممة للأسواق المصرية والعربية. تشمل تصميم الشعار، الألوان، الخطوط، وتطبيقات السوشيال ميديا ومطبوعات الشركات.',
    priceEGP: 25000,
    deliveryTime: '2 to 3 Weeks',
    deliveryTimeAr: 'خلال ٢ إلى ٣ أسابيع',
    deliverables: [
      'Primary logo suite, monochrome & responsive variants',
      'Bilingual typography system & tailored colour tokens',
      'Social media launch templates & marketing stationery',
      'Complete 40+ page brand guidelines deck',
    ],
    deliverablesAr: [
      'باقة الشعار الأساسي بجميع المقاسات والاستخدامات الرقمية',
      'نظام خطوط عربية وإنجليزية وأكواد الألوان المتناسقة',
      'قوالب سوشيال ميديا جاهزة وتصاميم المطبوعات الرسمية',
      'دليل إرشادي شامل للهوية واستخدامات العلامة التجارية',
    ],
    paySlug: 'sk-brand-kit',
  },
  {
    slug: 'tutor-marketing',
    code: 'SK',
    unit: 'Sidekick Studio',
    title: 'Tutor & Academy Growth Funnel',
    titleAr: 'منظومة التسويق وحجز المقاعد للمدرسين والمراكز',
    category: 'Marketing & Ads',
    categoryAr: 'التسويق والإعلانات الممولة',
    shortDesc: 'Turn-key marketing for independent educators, tutoring centres, and academic cohorts. High-converting landing page, WhatsApp automation, and ads.',
    shortDescAr: 'حل متكامل للمدرسين وأصحاب الأكاديميات: صفحة هبوط سريعة، ربط آلي مع الواتساب، وحملات ممولة لجلب أولياء الأمور والطلاب وحجز المقاعد.',
    priceEGP: 8500,
    deliveryTime: '10 Business Days',
    deliveryTimeAr: 'خلال ١٠ أيام عمل',
    deliverables: [
      'Custom branded student registration landing page',
      'Automated WhatsApp booking & confirmation flow',
      'Hyper-local Meta ads targeting parents and students',
      'Direct integration with Fawry & Vodafone Cash payments',
    ],
    deliverablesAr: [
      'صفحة تسجيل وحجز مقاعد سريعة تحمل اسم المدرس/الأكاديمية',
      'رد تلقائي وتأكيد الحجوزات عبر الواتساب فورياً',
      'حملات إعلانات جغرافية تستهدف أولياء الأمور في منطقتك',
      'ربط مباشر مع دفع فوري والمحافظ الإلكترونية لتأكيد الحجز',
    ],
    paySlug: 'sk-tutor-funnel',
  },
  {
    slug: 'media-production',
    code: 'SK',
    unit: 'Sidekick Studio',
    title: 'Commercial Media & Video Production',
    titleAr: 'الإنتاج المرئي وصناعة الفيديوهات الدعائية',
    category: 'Media & Video',
    categoryAr: 'الإنتاج المرئي والمحتوى',
    shortDesc: 'Premium video content creation from studio scripting and 4K filming to color grading, motion graphics, and audio distribution.',
    shortDescAr: 'إنتاج إعلامي احترافي شامل: كتابة السيناريو، التصوير بجودة 4K، تصحيح الألوان، الموشن جرافيك، وهندسة الصوت للإعلانات والبودكاست.',
    priceEGP: 18000,
    deliveryTime: '14 Days',
    deliveryTimeAr: 'خلال ١٤ يوماً',
    deliverables: [
      '4 professionally filmed & edited promo reels/films',
      'Studio lighting, multi-cam 4K setup & audio recording',
      'Motion graphic overlays & bilingual subtitling',
      'Platform-ready exports for TikTok, Reels & YouTube',
    ],
    deliverablesAr: [
      '٤ فيديوهات ريلز/أفلام دعائية مصورة وممنتجة باحترافية',
      'تصوير بكاميرات 4K متعددة مع إضاءة واستوديو صوت معتمد',
      'إضافة مؤثرات موشن جرافيك وترجمة عربية/إنجليزية',
      'تسليم النسخ النهائية بمقاسات جاهزة للنشر الفوري',
    ],
    paySlug: 'sk-media-prod',
  },
  {
    slug: 'payment-integration',
    code: 'TH',
    unit: 'Tech House',
    title: 'Central Payment Gateway Integration',
    titleAr: 'ربط بوابات الدفع المركزية (Geidea وفوري وميزة)',
    category: 'Software & Tech',
    categoryAr: 'البرمجيات وبوابات الدفع',
    shortDesc: 'Integrate Egyptian and regional payment gateways into your custom website or platform with zero PSP lock-in and verified webhooks.',
    shortDescAr: 'ربط بوابات الدفع الإلكتروني (بطاقات ميزة، فيزا، فوري، المحافظ) في موقعك أو منصتك مع نظام أمان كامل وتسويات تلقائية.',
    priceEGP: 15000,
    deliveryTime: '5 Business Days',
    deliveryTimeAr: 'خلال ٥ أيام عمل',
    deliverables: [
      'Geidea, Fawry & Mobile Wallets adapter orchestration',
      'HMAC-SHA256 signature verification & security guardrails',
      'Hosted checkout simulator & automated webhook listener',
      'Clean TypeScript API client and team handover session',
    ],
    deliverablesAr: [
      'ربط Geidea وفوري ومحافظ فودافون/أورنج/وي بنقرة واحدة',
      'تشفير أمني كامل وتحقق من توقيع الويب هوك HMAC',
      'صفحة دفع مخصصة لعلامتك التجارية مع تجربة مستخدم سريعة',
      'تسليم الكود البرمجي مع توثيق تقني وجلسة تدريب للفريق',
    ],
    paySlug: 'th-gateway-int',
  },
  {
    slug: 'consulting-session',
    code: 'BM',
    unit: 'bldr Management',
    title: 'Strategic Consulting & Business Audit',
    titleAr: 'جلسة استشارة استراتيجية وتدقيق نموذج العمل',
    category: 'Strategy & Advisory',
    categoryAr: 'الاستشارات والاستراتيجية',
    shortDesc: 'A 90-minute structured diagnostic review of your product, go-to-market strategy, and unit economics with a written deliverable.',
    shortDescAr: 'جلسة تشخيصية مكثفة لمدة 90 دقيقة مع شركاء bldr لمراجعة نموذج العمل، تسعير المنتجات، والخطوات التنفيذية للانطلاق مع تقرير مكتوب.',
    priceEGP: 6000,
    deliveryTime: 'Same Week',
    deliveryTimeAr: 'خلال نفس الأسبوع',
    deliverables: [
      '90-minute strategic architecture session',
      'Competitor positioning & Egyptian market landscape audit',
      'Actionable go-to-market and unit economics roadmap',
      '100% of consulting fee credited against future build',
    ],
    deliverablesAr: [
      'جلسة استراتيجية مباشرة لمدة 90 دقيقة مع شريك الاستوديو',
      'تحليل وضع المنافسين وفرص السوق المصري والإقليمي',
      'خريطة طريق واضحة وقابلة للتنفيذ بجدول زمني وميزانيات',
      'خصم قيمة الجلسة بالكامل (100%) من تكلفة أي مشروع لاحق',
    ],
    paySlug: 'bm-consult-sess',
  },
];

export default function ServicesPage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isRtl = lang === 'AR';

  const categories = isRtl
    ? ['الكل', 'التسويق والإعلانات الممولة', 'الهوية البصرية والتصميم', 'الإنتاج المرئي والمحتوى', 'البرمجيات وبوابات الدفع', 'الاستشارات والاستراتيجية']
    : ['All', 'Marketing & Ads', 'Brand & Creative', 'Media & Video', 'Software & Tech', 'Strategy & Advisory'];

  const filteredServices = selectedCategory === 'All' || selectedCategory === 'الكل'
    ? SERVICES_CATALOG
    : SERVICES_CATALOG.filter((s) => (isRtl ? s.categoryAr === selectedCategory : s.category === selectedCategory));

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
              color: '#D10721',
              marginBottom: 16,
            }}>
              <span>✦</span>
              <span>{isRtl ? 'خدمات الاستوديو المتخصصة — Sidekick & Tech House' : 'Specialist Studio Services — Sidekick & Tech House'}</span>
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
                ? 'خدمات تسويق وبرمجيات مصممة لبيع المنتجات وتحقيق العوائد.'
                : 'Services designed to sell products and scale revenue.'}
            </h1>
            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, fontWeight: 300, color: '#47454A' }}>
              {isRtl
                ? 'اختر باقة الخدمة التي تناسب مشروعك: يمكنك الدفع فوراً عبر بوابة الدفع المركزية (كروت، فوري، محافظ) أو فتح صفحة تفاصيل الخدمة لمراجعة نطاق العمل.'
                : 'Choose the service package that fits your objectives. Pay directly online through our Central Payment Gateway (Cards, Fawry, Wallets) or open any service landing page for full scope.'}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
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
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {filteredServices.map((service) => (
              <div
                key={service.slug}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid rgba(20,20,22,0.08)',
                  padding: '28px 24px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(20,20,22,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  {/* Unit & Category Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      background: 'rgba(209, 7, 33, 0.08)',
                      color: '#D10721',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
                      {service.unit}
                    </span>
                    <span style={{ fontSize: 12, color: '#8A94A6', fontWeight: 500 }}>
                      {isRtl ? service.deliveryTimeAr : service.deliveryTime}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: '#141416', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                    {isRtl ? service.titleAr : service.title}
                  </h2>
                  <p style={{ margin: '0 0 20px', fontSize: 14, color: '#47454A', lineHeight: 1.6, fontWeight: 300 }}>
                    {isRtl ? service.shortDescAr : service.shortDesc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      {isRtl ? 'أبرز مخرجات الخدمة:' : 'Deliverables Include:'}
                    </div>
                    <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, color: '#47454A', lineHeight: 1.7, fontWeight: 400 }}>
                      {(isRtl ? service.deliverablesAr : service.deliverables).map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & Dual Action Buttons */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #E3E8EF', marginBottom: 16 }}>
                    <span style={{ fontSize: 12, color: '#8A94A6', fontWeight: 600 }}>{isRtl ? 'القيمة الاستثمارية:' : 'Investment:'}</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#12203C', fontFamily: tokens.fonts.mono }}>
                      {formatEGP(service.priceEGP)}
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {/* Mode A: Central Gateway Direct Checkout */}
                    <Link
                      href={`/pay/${service.paySlug}`}
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
                      <span>{isRtl ? 'دفع فوري بالبوابة' : 'Instant Checkout'}</span>
                    </Link>

                    {/* Mode B: Single Service Landing Page */}
                    <Link
                      href={`/services/${service.slug}`}
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
                      {isRtl ? 'تفاصيل الخدمة ←' : 'View Scope →'}
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
