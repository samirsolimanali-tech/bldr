'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal } from '@bldr/ui';

export default function HomePage() {
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
        fontFamily: isRtl ? "'Readex Pro', sans-serif" : undefined,
      }}
    >
      {/* ─── Navigation ────────────────────────────────────────── */}
      <BldrNav
        lang={lang}
        onLanguageChange={setLang}
        onStartProject={() => setIsContactOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {/* ─── Hero Section ──────────────────────────────────────── */}
        <section style={{ padding: '72px 32px 84px', background: '#F4F5F7' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: 54, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                alignSelf: 'flex-start',
                height: 32,
                padding: '0 14px',
                borderRadius: 999,
                background: '#FFFFFF',
                border: '1px solid rgba(20,20,22,0.08)',
                boxShadow: '0 2px 6px rgba(20,20,22,0.04)',
              }}>
                <span style={{ display: 'block', width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(90deg, #D10721, #FD9426)' }} />
                <span style={{ fontSize: 12.5, fontWeight: 500, color: '#47454A' }}>
                  {isRtl ? 'القاهرة · ستوديو تأسيس وبناء الشركات، تأسس يوليو 2026' : 'Cairo · venture studio, founded July 2026'}
                </span>
              </div>

              <h1 style={{
                margin: 0,
                fontSize: 'clamp(34px, 4.8vw, 58px)',
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                color: '#141416',
                textWrap: 'pretty',
              }}>
                {isRtl
                  ? 'نبني المنتج الرقمي، العلامة التجارية، والفريق الذي يديرها.'
                  : 'We build the product, the brand, and the team that runs it.'}
              </h1>

              <p style={{
                margin: 0,
                maxWidth: 520,
                fontSize: 16.5,
                lineHeight: 1.68,
                fontWeight: 300,
                color: '#47454A',
              }}>
                {isRtl
                  ? 'تدير bldr وحدات متخصصة وتبني مشاريعها الخاصة. تعمل مع الوحدات التي تحتاجها في التسويق والبرمجيات وإدارة الدفع تحت نقطة اتصال واحدة ومسؤولية كاملة.'
                  : 'bldr operates specialist units and builds its own ventures. You work with the units you need and keep one point of contact for all of it — nobody hands the outcome to somebody else.'}
              </p>

              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 50,
                    padding: '0 28px',
                    borderRadius: 999,
                    background: '#141416',
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(20,20,22,0.14)',
                    fontFamily: 'inherit',
                  }}
                >
                  {isRtl ? 'ابدأ مشروعك معنا ←' : 'Start a project →'}
                </button>
                <Link
                  href="/services"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 50,
                    padding: '0 24px',
                    borderRadius: 999,
                    background: '#FFFFFF',
                    border: '1px solid rgba(20,20,22,0.12)',
                    color: '#141416',
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(20,20,22,0.04)',
                  }}
                >
                  {isRtl ? 'استكشف الخدمات والتسويق' : 'Explore Services & Marketing'}
                </Link>
                <Link
                  href="/products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 50,
                    padding: '0 20px',
                    borderRadius: 999,
                    background: 'transparent',
                    color: '#5A6A80',
                    fontSize: 14.5,
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'دليل الدورات والمنتجات ←' : 'Browse Courses & Products →'}
                </Link>
              </div>
            </div>

            {/* Studio Visual Mosaic */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '140px 140px 110px',
              gap: 12,
            }}>
              <div style={{
                gridColumn: 'span 2',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid rgba(20,20,22,0.08)',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(20,20,22,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FD9426' }}>
                    {isRtl ? 'المشاريع والخدمات' : 'Ventures & Services'}
                  </span>
                  <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#8A94A6' }}>Cairo Studio</span>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#141416', letterSpacing: '-0.02em' }}>
                    Sidekick · StudyHub · منصة الحصة
                  </div>
                  <div style={{ fontSize: 13, color: '#47454A', fontWeight: 300, marginTop: 4 }}>
                    {isRtl ? 'تسويق، برمجيات، ودفع إلكتروني مركزي موحد' : 'Marketing, custom software & central payment hub'}
                  </div>
                </div>
              </div>

              <Link
                href="/services"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid rgba(20,20,22,0.08)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: '#D10721' }}>
                  {isRtl ? 'خدمات التسويق' : 'SERVICES'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#141416' }}>
                  {isRtl ? 'حملات النمو وهوية العلامة ←' : 'Sidekick Growth & Ads →'}
                </span>
              </Link>

              <Link
                href="/products"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid rgba(20,20,22,0.08)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E' }}>
                  {isRtl ? 'الدورات والمنتجات' : 'PRODUCTS'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#141416' }}>
                  {isRtl ? 'دورات وورش عمل المدربين ←' : 'Provider Courses & Events →'}
                </span>
              </Link>

              <div style={{
                gridColumn: 'span 2',
                background: '#141416',
                color: '#FFFFFF',
                borderRadius: 16,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{isRtl ? 'بوابة الدفع المركزية' : 'Central Payment Hub Admin'}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>{isRtl ? 'إدارة المبيعات والتسويات والروابط' : 'Super Admin & Finance Management'}</div>
                </div>
                <a
                  href="http://localhost:3002"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: '#2E6F5E',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'لوحة التحكم ←' : 'Open Hub →'}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── What's Broken Section ─────────────────────────────── */}
        <section style={{ padding: '0 32px 84px', background: '#F4F5F7' }}>
          <div style={{
            maxWidth: 1280,
            margin: '0 auto',
            background: '#FFFFFF',
            border: '1px solid rgba(20,20,22,0.08)',
            borderRadius: 22,
            padding: '48px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center', marginBottom: 36 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D10721' }}>
                {isRtl ? 'ما هو الخلل في النماذج التقليدية؟' : "What's Broken in Traditional Models"}
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 600, letterSpacing: '-0.04em', color: '#141416', margin: 0 }}>
                {isRtl ? 'الجميع قام بدوره.. ولكن لا أحد امتلك النتيجة النهائية.' : 'Everyone did their part. Nobody owned the outcome.'}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { title: isRtl ? 'شركة البرمجيات' : 'Software House', sub: isRtl ? 'في انتظار المواصفات النهائية' : 'waiting on final specs', angle: '-2deg' },
                { title: isRtl ? 'وكالة التسويق' : 'Marketing Agency', sub: isRtl ? 'لم تشهد المنتج على أرض الواقع' : "hasn't seen the product", angle: '1.5deg' },
                { title: isRtl ? 'المستشار' : 'Consultant', sub: isRtl ? 'غادر بعد تقديم العرض' : 'left after the slide deck', angle: '-1deg' },
                { title: isRtl ? 'فريق عملك' : 'Your Team', sub: isRtl ? 'لم يتم تدريبه على التشغيل' : 'never trained to run it', angle: '2deg' },
                { title: isRtl ? 'مزود الأنظمة' : 'Systems Vendor', sub: isRtl ? 'انتهى دوره عند التسليم' : 'scope ended at handover', angle: '-1.5deg' },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F4F5F7',
                    border: '1px solid rgba(20,20,22,0.08)',
                    borderRadius: 14,
                    padding: '20px 22px',
                    boxShadow: '0 4px 12px rgba(20,20,22,0.04)',
                    transform: `rotate(${card.angle})`,
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#141416', letterSpacing: '-0.02em' }}>{card.title}</div>
                  <div style={{ marginTop: 6, fontSize: 13.5, fontWeight: 300, color: '#47454A' }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How We're Built ───────────────────────────────────── */}
        <section id="built" style={{ padding: '56px 32px 84px', background: '#F4F5F7' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: 64, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 110 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D10721' }}>
                {isRtl ? 'هيكلية عملنا' : "How We're Built"}
              </span>
              <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.04em', color: '#141416' }}>
                {isRtl ? 'تخصصات متكاملة.\nخط مسؤولية واحد.' : 'Different specialisms.\nOne accountability line.'}
              </h2>
              <p style={{ margin: 0, maxWidth: 420, fontSize: 16, lineHeight: 1.68, fontWeight: 300, color: '#47454A' }}>
                {isRtl
                  ? 'نفس المتخصصين الذين توظفهم عادة بشكل منفصل، يعملون وفق خطة واحدة وجدول زمني موحد وبقيادة شريك واحد.'
                  : 'The same specialists you would otherwise hire separately, working off one plan, one schedule and one owner.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', [isRtl ? 'paddingRight' : 'paddingLeft']: 24, [isRtl ? 'borderRight' : 'borderLeft']: '2px solid rgba(20,20,22,0.08)' }}>
              {[
                {
                  title: 'Sidekick',
                  was: isRtl ? 'بديل: وكالة التسويق المنفصلة' : 'was: the marketing agency',
                  desc: isRtl ? 'بناء الهوية البصرية، إدارة الإعلانات الممولة، صناعة المحتوى، وإطلاق مسارات البيع.' : 'Branding, advertising, content, performance campaigns',
                  link: '/services',
                  cta: isRtl ? 'تصفح خدمات التسويق ←' : 'View Marketing Packages →',
                },
                {
                  title: 'Tech House',
                  was: isRtl ? 'بديل: شركة البرمجيات الخارجية' : 'was: the software house',
                  desc: isRtl ? 'تطوير المنصات الرقمية، ربط بوابات الدفع المركزية، وبناء البنية التحتية السحابية.' : 'Software platforms, central payment orchestration, automated infrastructure',
                  link: '/services',
                  cta: isRtl ? 'خدمات البرمجيات والدفع ←' : 'Tech House Services →',
                },
                {
                  title: 'bldr Management',
                  was: isRtl ? 'بديل: المستشار الذي يرحل' : 'was: the consultant who left',
                  desc: isRtl ? 'الاستراتيجية، تطوير الأعمال، التسعير، والهيكلة المالية للمشاريع.' : 'Strategy, business development, partnerships & financial architecture',
                  link: '/services',
                  cta: isRtl ? 'الجلسات الاستشارية ←' : 'Consulting Sessions →',
                },
                {
                  title: 'Career Hub',
                  was: isRtl ? 'بديل: الفريق غير المدرب' : 'was: your untrained team',
                  desc: isRtl ? 'التدريب العملي للشركات، ورش العمل التنفيذية، وتسليم الفرق للعمل المستقل.' : 'Professional training, workshops, operations and team handover',
                  link: '/products',
                  cta: isRtl ? 'ورش العمل والدورات ←' : 'Workshops & Training →',
                },
              ].map((unit, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(20,20,22,0.08)',
                    borderRadius: 14,
                    padding: '20px 24px',
                    boxShadow: '0 2px 8px rgba(20,20,22,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#141416', letterSpacing: '-0.02em' }}>{unit.title}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 400, color: '#6B6970' }}>{unit.was}</div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: '#47454A' }}>{unit.desc}</div>
                  <div style={{ marginTop: 12 }}>
                    <Link href={unit.link} style={{ fontSize: 13, fontWeight: 600, color: '#2C5F9E', textDecoration: 'none' }}>
                      {unit.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Education & EdTech Showcase ───────────────────────── */}
        <section id="education" style={{ background: '#141416', padding: '84px 32px', color: '#FFFFFF' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 60, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FD9426' }}>
                {isRtl ? 'التعليم وتكنولوجيا التعليم' : 'Education & EdTech'}
              </span>
              <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.04em', color: '#FFFFFF' }}>
                {isRtl ? 'نحن ندير بأنفسنا المنصات التي نبنيها.' : 'We have run the thing we are asked to build.'}
              </h2>
              <p style={{ margin: 0, maxWidth: 480, fontSize: 16, lineHeight: 1.68, fontWeight: 300, color: 'rgba(255,255,255,0.72)' }}>
                {isRtl
                  ? 'العديد من الشركات البرمجية تبني منصات تعليمية، لكن قلة منها قامت بإدارة مجموعات طلابية حقيقية وتسعير دورات وإدارة تسويات بوابات الدفع في مصر.'
                  : 'Plenty of software houses will build you a learning platform. Very few have run a cohort, priced a course, or managed live payment gateway reconciliation in Cairo.'}
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                <Link
                  href="/products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 48,
                    padding: '0 24px',
                    borderRadius: 999,
                    background: '#FFFFFF',
                    color: '#141416',
                    fontSize: 14.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {isRtl ? 'استعرض دورات المنصات التعليمية ←' : 'Browse Platform Courses →'}
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.03em' }}>StudyHub</div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: 'rgba(255,255,255,0.66)' }}>
                  {isRtl
                    ? 'نظام تشغيل وإدارة متكامل للمدرسين ومراكز الدروس، مربوط مباشرة ببوابة bldr المركزية لقبول المدفوعات فورياً.'
                    : 'An Arabic-first operating system for tutors and tutoring centres. Integrates directly into the bldr Central Payment Hub for instant checkout.'}
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.03em' }}>منصة الحصة</div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: 'rgba(255,255,255,0.66)' }}>
                  {isRtl
                    ? 'منصة تعليمية مصرية تفاعلية بآليات التلعيب، وتدعم المعاملات المصغرة وأكواد فوري والمحافظ الإلكترونية.'
                    : 'A gamified Egyptian K-12 learning platform with micro-transactions, automated coupon validation, and Fawry/Geidea integrations.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── How We Work Section ───────────────────────────────── */}
        <section id="work" style={{ padding: '84px 32px', background: '#F4F5F7' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', background: '#FFFFFF', border: '1px solid rgba(20,20,22,0.08)', borderRadius: 22, padding: '48px 42px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: 54, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D10721' }}>
                  {isRtl ? 'خطوات التعاقد' : 'How We Work'}
                </span>
                <h2 style={{ margin: 0, fontSize: 36, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.04em', color: '#141416' }}>
                  {isRtl ? 'تسلسل عمل واضح، وليس دورة عروض أسعار لا تنتهي.' : 'A sequence, not a proposal cycle.'}
                </h2>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.68, fontWeight: 300, color: '#47454A' }}>
                  {isRtl
                    ? 'كل مشروع يبدأ بجلسة استشارية مدفوعة ومحددة المخرجات، ويُخصم رسمها من تكلفة المشروع عند البدء في التنفيذ.'
                    : 'Every engagement starts with a paid consulting session. It is the cleanest way to evaluate our alignment, and the fee is credited against the project if one follows.'}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(true)}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 999,
                      background: '#12203C',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? 'احجز استشارة مشروعك الآن ←' : 'Schedule Consulting Session →'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { step: '01', title: isRtl ? 'جلسة الاستشارة والتشخيص' : 'Consulting Session', desc: isRtl ? 'دراسة متطلبات المشروع، النطاق الزمني، وخريطة الطريق الاستراتيجية.' : 'Architecture, scope, and strategic roadmap.' },
                  { step: '02', title: isRtl ? 'العلامة التجارية والمحتوى' : 'Proposition & Brand', desc: isRtl ? 'الهوية البصرية، صياغة الرسائل التسويقية وتحديد الجمهور المستهدف.' : 'Design tokens, copy, and positioning.' },
                  { step: '03', title: isRtl ? 'البناء وربط بوابات الدفع' : 'Build & Integration', desc: isRtl ? 'التطوير البرمجي الشامل وتفعيل الدفع عبر Geidea وفوري والمحافظ.' : 'Full-stack engineering & payment orchestration.' },
                  { step: '04', title: isRtl ? 'التسليم والتشغيل المباشر' : 'Handover & Run', desc: isRtl ? 'تدريب فريقك وتدشين المنصة في بيئة الإنتاج الحية.' : 'Team training and production live release.' },
                ].map((s) => (
                  <div key={s.step} style={{ display: 'flex', gap: 16, padding: '16px 20px', background: '#F4F5F7', borderRadius: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#D10721', fontFamily: 'monospace' }}>{s.step}</span>
                    <div>
                      <div style={{ fontSize: 15.5, fontWeight: 600, color: '#141416' }}>{s.title}</div>
                      <div style={{ fontSize: 13.5, color: '#47454A', fontWeight: 300, marginTop: 3 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <BldrFooter />

      {/* ─── Contact Modal ─────────────────────────────────────── */}
      <ProjectContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />
    </div>
  );
}
