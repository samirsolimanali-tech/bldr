'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BldrNav, BldrFooter, ProjectContactModal } from '@bldr/ui';
import ProjectsCarousel from './components/ProjectsCarousel';

export default function HomePage() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Light is the main/default
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    let isCancelled = false;
    const loadCms = () => {
      fetch(`/api/cms?t=${Date.now()}`, { cache: 'no-store' })
        .then((r) => r.json())
        .then((res) => {
          if (!isCancelled && res?.success && res?.data) {
            setCms(res.data);
          }
        })
        .catch(() => {});
    };

    loadCms();

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', loadCms);
    }

    return () => {
      isCancelled = true;
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', loadCms);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, []);

  const isRtl = lang === 'AR';
  const isDark = isDarkMode;

  const heroTitle = isRtl
    ? (cms?.hero?.titleAr || 'نبني المنتج الرقمي، العلامة التجارية، والفريق الذي يديرها.')
    : (cms?.hero?.title || 'We build the product, the brand, and the team that runs it.');

  const heroSubtitle = isRtl
    ? (cms?.hero?.subtitleAr || 'تدير bldr وحدات متخصصة وتبني مشاريعها الخاصة. تعمل مع الوحدات التي تحتاجها في التسويق والبرمجيات وبناء المنتجات تحت نقطة اتصال واحدة ومسؤولية كاملة.')
    : (cms?.hero?.subtitle || 'bldr operates specialist units and builds its own ventures. You work with the units you need and keep one point of contact for all of it — nobody hands the outcome to somebody else.');

  const heroPrimaryCta = isRtl
    ? (cms?.hero?.ctaLabelAr || 'ابدأ مشروعك معنا ←')
    : (cms?.hero?.ctaLabel || 'Start a project →');

  const heroSecondaryCta = isRtl
    ? (cms?.hero?.secondaryLabelAr || 'استكشف الخدمات')
    : (cms?.hero?.secondaryLabel || 'Explore Services');

  const heroSecondaryLink = cms?.hero?.secondaryLink || '/services';

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
        {/* ─── Hero Section with Blueprint Gradient Reveal ──────────────────────── */}
        <section
          className="hero-section-responsive"
          style={{
            position: 'relative',
            padding: '92px 36px 104px',
            minHeight: 580,
            display: 'flex',
            alignItems: 'center',
            background: isDark
              ? isRtl
                ? "linear-gradient(270deg, #1C2B3F 0%, #1C2B3F 36%, rgba(28, 43, 63, 0.88) 52%, rgba(28, 43, 63, 0.38) 72%, rgba(28, 43, 63, 0.05) 100%), url('/images/hero-blueprint-blue-rtl.jpg') left center / cover no-repeat"
                : "linear-gradient(90deg, #1C2B3F 0%, #1C2B3F 36%, rgba(28, 43, 63, 0.88) 52%, rgba(28, 43, 63, 0.38) 72%, rgba(28, 43, 63, 0.05) 100%), url('/images/hero-blueprint-blue.jpg') right center / cover no-repeat"
              : isRtl
                ? "linear-gradient(270deg, #F4F5F7 0%, #F4F5F7 36%, rgba(244, 245, 247, 0.88) 52%, rgba(244, 245, 247, 0.35) 72%, rgba(244, 245, 247, 0.05) 100%), url('/images/hero-blueprint-light-rtl.jpg') left center / cover no-repeat"
                : "linear-gradient(90deg, #F4F5F7 0%, #F4F5F7 36%, rgba(244, 245, 247, 0.88) 52%, rgba(244, 245, 247, 0.35) 72%, rgba(244, 245, 247, 0.05) 100%), url('/images/hero-blueprint-light.jpg') right center / cover no-repeat",
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(20, 20, 22, 0.08)',
            transition: 'background 0.3s ease',
            overflow: 'hidden',
          }}
        >
          <div
            className="hero-grid-responsive"
            style={{
              maxWidth: 1280,
              width: '100%',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)',
              gap: 48,
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 660 }}>
              <h1 style={{
                margin: 0,
                fontSize: isRtl ? 'clamp(32px, 3.8vw, 50px)' : 'clamp(36px, 4.4vw, 56px)',
                lineHeight: isRtl ? 1.28 : 1.14,
                fontWeight: 600,
                letterSpacing: isRtl ? '-0.02em' : '-0.035em',
                color: isDark ? '#FFFFFF' : '#141416',
                textWrap: 'pretty',
                textShadow: isDark ? '0 2px 14px rgba(0, 0, 0, 0.3)' : 'none',
              }}>
                {heroTitle}
              </h1>

              <p style={{
                margin: 0,
                maxWidth: 580,
                fontSize: isRtl ? 17 : 17.5,
                lineHeight: isRtl ? 1.76 : 1.66,
                fontWeight: 400,
                color: isDark ? 'rgba(240, 246, 255, 0.92)' : '#444852',
                textShadow: isDark ? '0 1px 8px rgba(0, 0, 0, 0.25)' : 'none',
              }}>
                {heroSubtitle}
              </p>

              <div className="hero-cta-group" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 52,
                    padding: '0 30px',
                    borderRadius: 999,
                    background: isDark ? '#FFFFFF' : '#141416',
                    color: isDark ? '#0F172A' : '#FFFFFF',
                    fontSize: 15.5,
                    fontWeight: 600,
                    letterSpacing: isRtl ? 0 : '-0.01em',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isDark ? '0 4px 18px rgba(0, 0, 0, 0.25)' : '0 4px 14px rgba(20,20,22,0.14)',
                    fontFamily: 'inherit',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  {heroPrimaryCta}
                </button>
                <Link
                  href={heroSecondaryLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 52,
                    padding: '0 26px',
                    borderRadius: 999,
                    background: isDark ? 'rgba(255, 255, 255, 0.12)' : '#FFFFFF',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(20,20,22,0.12)',
                    color: isDark ? '#FFFFFF' : '#141416',
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  {heroSecondaryCta}
                </Link>
              </div>
            </div>

            {/* Right Half: Open Canvas revealing the Blueprint sketches */}
            <div
              className="hero-canvas-column"
              style={{
                minHeight: 380,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: isRtl ? 'flex-start' : 'flex-end',
                position: 'relative',
              }}
            />
          </div>
        </section>

        {/* ─── What's Broken Section ─────────────────────────────── */}
        <section className="whats-broken-section-responsive" style={{ padding: '0 32px 84px', background: '#F4F5F7' }}>
          <div className="whats-broken-inner-responsive" style={{
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
                {isRtl ? (cms?.whatsBroken?.tagAr || 'ما هو الخلل في النماذج التقليدية؟') : (cms?.whatsBroken?.tag || "What's Broken in Traditional Models")}
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 600, letterSpacing: '-0.04em', color: '#141416', margin: 0 }}>
                {isRtl ? (cms?.whatsBroken?.titleAr || 'الجميع قام بدوره.. ولكن لا أحد امتلك النتيجة النهائية.') : (cms?.whatsBroken?.title || 'Everyone did their part. Nobody owned the outcome.')}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {(cms?.whatsBroken?.cards || [
                { title: 'Software House', titleAr: 'شركة البرمجيات', sub: 'waiting on final specs', subAr: 'في انتظار المواصفات النهائية', angle: '-2deg' },
                { title: 'Marketing Agency', titleAr: 'وكالة التسويق', sub: "hasn't seen the product", subAr: 'لم تشهد المنتج على أرض الواقع', angle: '1.5deg' },
                { title: 'Consultant', titleAr: 'المستشار', sub: 'left after the slide deck', subAr: 'غادر بعد تقديم العرض', angle: '-1deg' },
                { title: 'Your Team', titleAr: 'فريق عملك', sub: 'never trained to run it', subAr: 'لم يتم تدريبه على التشغيل', angle: '2deg' },
                { title: 'Systems Vendor', titleAr: 'مزود الأنظمة', sub: 'scope ended at handover', subAr: 'انتهى دوره عند التسليم', angle: '-1.5deg' },
              ]).map((card: any, i: number) => (
                <div
                  key={i}
                  className="whats-broken-card-responsive"
                  style={{
                    background: '#F4F5F7',
                    border: '1px solid rgba(20,20,22,0.08)',
                    borderRadius: 14,
                    padding: '20px 22px',
                    boxShadow: '0 4px 12px rgba(20,20,22,0.04)',
                    transform: `rotate(${card.angle || (i % 2 === 0 ? '-1.5deg' : '1.5deg')})`,
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#141416', letterSpacing: '-0.02em' }}>{isRtl ? (card.titleAr || card.title) : card.title}</div>
                  <div style={{ marginTop: 6, fontSize: 13.5, fontWeight: 300, color: '#47454A' }}>{isRtl ? (card.subAr || card.sub) : card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How We're Built ───────────────────────────────────── */}
        <section id="built" className="how-were-built-section-responsive" style={{ padding: '56px 32px 84px', background: '#F4F5F7' }}>
          <div className="how-were-built-grid-responsive" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: 64, alignItems: 'start' }}>
            <div className="how-were-built-sidebar-responsive" style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 110 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D10721' }}>
                {isRtl ? (cms?.howWereBuilt?.tagAr || 'هيكلية عملنا') : (cms?.howWereBuilt?.tag || "How We're Built")}
              </span>
              <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.04em', color: '#141416', whiteSpace: 'pre-line' }}>
                {isRtl ? (cms?.howWereBuilt?.titleAr || 'تخصصات متكاملة.\nخط مسؤولية واحد.') : (cms?.howWereBuilt?.title || 'Different specialisms.\nOne accountability line.')}
              </h2>
              <p style={{ margin: 0, maxWidth: 420, fontSize: 16, lineHeight: 1.68, fontWeight: 300, color: '#47454A' }}>
                {isRtl
                  ? (cms?.howWereBuilt?.subtitleAr || 'نفس المتخصصين الذين توظفهم عادة بشكل منفصل، يعملون وفق خطة واحدة وجدول زمني موحد وبقيادة شريك واحد.')
                  : (cms?.howWereBuilt?.subtitle || 'The same specialists you would otherwise hire separately, working off one plan, one schedule and one owner.')}
              </p>
            </div>

            <div className="how-were-built-timeline-responsive" style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', [isRtl ? 'paddingRight' : 'paddingLeft']: 24, [isRtl ? 'borderRight' : 'borderLeft']: '2px solid rgba(20,20,22,0.08)' }}>
              {(cms?.howWereBuilt?.units || [
                {
                  title: 'Marketing & Branding',
                  titleAr: 'التسويق وبناء العلامة التجارية',
                  was: 'was: the marketing agency',
                  wasAr: 'بديل: وكالة التسويق المنفصلة',
                  desc: 'Branding, advertising, content, performance campaigns',
                  descAr: 'بناء الهوية البصرية، إدارة الإعلانات الممولة، صناعة المحتوى، وإطلاق مسارات البيع.',
                  link: '/services?category=Marketing+%26+Ads&service=performance-ads#performance-ads',
                  cta: 'View Marketing Packages →',
                  ctaAr: 'تصفح باقات وخدمات التسويق ←',
                },
                {
                  title: 'Software & Technology',
                  titleAr: 'تطوير البرمجيات والتكنولوجيا',
                  was: 'was: the software house',
                  wasAr: 'بديل: شركة البرمجيات الخارجية',
                  desc: 'Custom software platforms, modern API architectures, automated cloud infrastructure',
                  descAr: 'تطوير المنصات الرقمية، هندسة الأنظمة السحابية، وبناء البنية التحتية البرمجية المؤتمتة.',
                  link: '/services?category=Software+%26+Tech&service=web-platform-engineering#web-platform-engineering',
                  cta: 'Software & Tech Services →',
                  ctaAr: 'خدمات البرمجيات والتكنولوجيا ←',
                },
                {
                  title: 'Business Strategy & Consulting',
                  titleAr: 'الاستراتيجية وإدارة الأعمال',
                  was: 'was: the consultant who left',
                  wasAr: 'بديل: المستشار الذي يرحل',
                  desc: 'Strategy, business development, partnerships & financial architecture',
                  descAr: 'الاستراتيجية، تطوير الأعمال، التسعير، والهيكلة المالية للمشاريع.',
                  link: '/services?category=Strategy+%26+Advisory&service=consulting-session#consulting-session',
                  cta: 'Consulting Sessions →',
                  ctaAr: 'الجلسات الاستشارية وتطوير الأعمال ←',
                },
                {
                  title: 'Team Training & Enablement',
                  titleAr: 'التدريب وتأهيل الفرق',
                  was: 'was: your untrained team',
                  wasAr: 'بديل: الفريق غير المدرب',
                  desc: 'Professional training, workshops, operations and team handover',
                  descAr: 'التدريب العملي للشركات، ورش العمل التنفيذية، وتسليم الفرق للعمل المستقل.',
                  link: '/services?category=Corporate+Training&service=team-training-enablement#team-training-enablement',
                  cta: 'Workshops & Training →',
                  ctaAr: 'ورش العمل والتدريب المؤسسي ←',
                },
              ]).map((unit: any, i: number) => (
                <Link
                  key={i}
                  href={unit.link || '/services'}
                  style={{
                    display: 'block',
                    background: '#FFFFFF',
                    border: '1px solid rgba(20,20,22,0.08)',
                    borderRadius: 14,
                    padding: '20px 24px',
                    boxShadow: '0 2px 8px rgba(20,20,22,0.04)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(20,20,22,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(44,95,158,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(20,20,22,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(20,20,22,0.08)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#141416', letterSpacing: '-0.02em' }}>{isRtl ? (unit.titleAr || unit.title) : unit.title}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 400, color: '#6B6970' }}>{isRtl ? (unit.wasAr || unit.was) : unit.was}</div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14.5, fontWeight: 300, lineHeight: 1.6, color: '#47454A' }}>{isRtl ? (unit.descAr || unit.desc) : unit.desc}</div>
                  <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: '#2C5F9E' }}>
                    <span>{isRtl ? (unit.ctaAr || unit.cta) : unit.cta}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Featured Projects & Portfolio Showcase ────────────── */}
        <section id="projects" className="projects-showcase-section-responsive" style={{ background: '#141416', padding: '84px 32px', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background ambient glow */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              [isRtl ? 'left' : 'right']: '5%',
              width: 480,
              height: 480,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(44, 95, 158, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
              filter: 'blur(60px)',
            }}
          />

          <div className="projects-showcase-grid-responsive" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)', gap: 56, alignItems: 'center' }}>
            {/* Left Side: Strategic Copy & CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, zIndex: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FD9426' }}>
                {isRtl ? (cms?.projectsShowcase?.tagAr || 'سوابق الأعمال والمشاريع المنفذة') : (cms?.projectsShowcase?.tag || 'Selected Work & Case Studies')}
              </span>

              <h2 style={{ margin: 0, fontSize: 'clamp(32px, 3.8vw, 42px)', lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.04em', color: '#FFFFFF', whiteSpace: 'pre-line' }}>
                {isRtl ? (cms?.projectsShowcase?.titleAr || 'منصات برمجية حقيقية.\nونتائج تجارية مثبتة بالأرقام.') : (cms?.projectsShowcase?.title || 'Production platforms.\nReal commercial impact.')}
              </h2>

              <p style={{ margin: 0, maxWidth: 500, fontSize: 16, lineHeight: 1.68, fontWeight: 300, color: 'rgba(255,255,255,0.74)' }}>
                {isRtl
                  ? (cms?.projectsShowcase?.subtitleAr || 'نحن لا نبني نماذج نظرية. من العيادات السحابية الذكية ومنصات التعليم المشفرة، إلى أنظمة أتمتة سلاسل الإمداد ومحركات نمو التجارة الرقمية، استكشف كيف نهندس ونطلق منصات تقود قطاعاتها في مصر والشرق الأوسط.')
                  : (cms?.projectsShowcase?.subtitle || 'We do not build theoretical prototypes. From cloud telehealth systems and DRM-protected EdTech portals to enterprise dispatch engines, explore the software platforms and growth systems we have engineered and scaled.')}
              </p>

              {/* Fast Proof Metrics */}
              <div className="projects-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 480, paddingTop: 6 }}>
                {(cms?.projectsShowcase?.metrics || [
                  { value: '38k+', label: 'Patients Managed', labelAr: 'مريض مسجل ومنتظم' },
                  { value: '45k+', label: 'Enrolled Students', labelAr: 'طالب في المنصات' },
                  { value: '99.95%', label: 'Platform Uptime', labelAr: 'استقرار وجاهزية' },
                ]).map((m: any, idx: number) => (
                  <div key={idx} style={{ borderLeft: isRtl ? 'none' : '2px solid rgba(255,255,255,0.15)', borderRight: isRtl ? '2px solid rgba(255,255,255,0.15)' : 'none', paddingLeft: isRtl ? 0 : 14, paddingRight: isRtl ? 14 : 0 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>{m.value}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 400, marginTop: 2 }}>
                      {isRtl ? (m.labelAr || m.label) : m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="projects-cta-group" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', paddingTop: 6 }}>
                <Link
                  href="/projects"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 50,
                    padding: '0 28px',
                    borderRadius: 999,
                    background: '#FFFFFF',
                    color: '#141416',
                    fontSize: 14.5,
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(255,255,255,0.15)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <span>{isRtl ? (cms?.projectsShowcase?.ctaLabelAr || 'استكشف كافة المشاريع وسوابق الأعمال') : (cms?.projectsShowcase?.ctaLabel || 'Explore All Projects & Case Studies')}</span>
                  <span>{isRtl ? '←' : '→'}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    height: 50,
                    padding: '0 22px',
                    borderRadius: 999,
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.22)',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>{isRtl ? 'ابدأ مشروعك معنا' : 'Start a Project'}</span>
                </button>
              </div>
            </div>

            {/* Right Side: Automated Rotating Projects Carousel */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <ProjectsCarousel lang={lang} />
            </div>
          </div>
        </section>

        {/* ─── How We Work Section ───────────────────────────────── */}
        <section id="work" className="how-we-work-section-responsive" style={{ padding: '84px 32px', background: '#F4F5F7' }}>
          <div className="how-we-work-card-responsive" style={{ maxWidth: 1280, margin: '0 auto', background: '#FFFFFF', border: '1px solid rgba(20,20,22,0.08)', borderRadius: 22, padding: '48px 42px' }}>
            <div className="how-we-work-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gap: 54, alignItems: 'start' }}>
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
      <BldrFooter lang={lang} customData={cms?.footer} />

      {/* ─── Contact Modal ─────────────────────────────────────── */}
      <ProjectContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />
    </div>
  );
}
