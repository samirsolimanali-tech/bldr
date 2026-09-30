'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export interface CarouselProjectItem {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  client: string;
  category: string;
  categoryAr: string;
  badge: string;
  badgeAr: string;
  metric: string;
  metricLabel: string;
  metricLabelAr: string;
  summary: string;
  summaryAr: string;
  techStack: string[];
  accentColor: string;
  icon: string;
  // Custom image URL if provided; otherwise fallback to rich aesthetic mockup placeholder
  image?: string;
}

const CAROUSEL_PROJECTS: CarouselProjectItem[] = [
  {
    id: 'medconnect-portal',
    slug: 'medconnect-portal',
    title: 'MedConnect Cloud Clinic & Telehealth',
    titleAr: 'منصة ميدكونيكت السحابية للرعاية الصحية والاستشارات',
    client: 'MedConnect Health',
    category: 'Digital Platform',
    categoryAr: 'المنصات الرقمية',
    badge: 'Live Telehealth Platform',
    badgeAr: 'منصة طبية قيد التشغيل',
    metric: '38,000+',
    metricLabel: 'Patients Managed',
    metricLabelAr: 'مريض مسجل ومنتظم',
    summary: 'HIPAA-aligned web portal with encrypted WebRTC video telemetry, multi-clinic calendar scheduling, and automated patient reminders.',
    summaryAr: 'بوابة رعاية صحية متطورة مع غرف استشارات مرئية مشفرة، جدولة مواعيد فورية للعيادات، وتنبيهات آلية للمرضى.',
    techStack: ['Next.js 14', 'WebRTC', 'PostgreSQL', 'Docker'],
    accentColor: '#2C5F9E',
    icon: 'health',
  },
  {
    id: 'edtech-academy',
    slug: 'edtech-academy',
    title: 'Al-Akademia High-Impact LMS Engine',
    titleAr: 'منصة الأكاديمية التعليمية لإدارة المعسكرات التفاعلية',
    client: 'Al-Akademia Cohorts',
    category: 'EdTech & Learning',
    categoryAr: 'تكنولوجيا التعليم',
    badge: 'DRM Video Protected',
    badgeAr: 'حماية كاملة من التسريب',
    metric: '45,000+',
    metricLabel: 'Enrolled Students',
    metricLabelAr: 'طالب مسجل ومنتظم',
    summary: 'Scalable educational infrastructure with dynamic watermarking, live cohort progression, and instant Fawry & card checkout enrollment.',
    summaryAr: 'بنية رقمية متكاملة للتعليم عن بُعد تدعم البث المباشر، الفيديوهات المشفرة، والتفعيل التلقائي للاشتراكات بعد الدفع فورياً.',
    techStack: ['HLS Video DRM', 'Next.js', 'PostgreSQL', 'Tailwind'],
    accentColor: '#FD9426',
    icon: 'edu',
  },
  {
    id: 'sidekick-growth',
    slug: 'sidekick-growth',
    title: 'Velvet D2C Direct Commerce Launch',
    titleAr: 'إطلاق علامة تجارية ومحرك نمو المبيعات',
    client: 'Velvet Commerce',
    category: 'Brand & Growth',
    categoryAr: 'الهوية والنمو التجاري',
    badge: 'High Conversion Funnel',
    badgeAr: 'مسار مبيعات عالي التحويل',
    metric: '3.8x',
    metricLabel: 'Blended ROAS',
    metricLabelAr: 'عائد الإنفاق الإعلاني',
    summary: 'Full-funnel brand launch combining high-converting motion ad creatives, headless fast landing pages, and Meta Conversions API tracking.',
    summaryAr: 'إطلاق متكامل لعلامة تجارية يشمل صناعة إعلانات الفيديو القصيرة، صفحات هبوط فورية الشراء، وتتبع خوادم الإعلانات بدقة متناهية.',
    techStack: ['Meta CAPI', 'Next.js', 'Figma', 'DaVinci'],
    accentColor: '#D10721',
    icon: 'growth',
  },
  {
    id: 'opsflow-enterprise',
    slug: 'opsflow-enterprise',
    title: 'FleetSync Real-Time Dispatch System',
    titleAr: 'نظام إدارة الأسطول الميداني والعمليات اللوجستية',
    client: 'FleetSync Logistics',
    category: 'Logistics SaaS',
    categoryAr: 'الأنظمة والبرمجيات',
    badge: 'Live Fleet Telemetry',
    badgeAr: 'تتبع حركة السائقين لحظياً',
    metric: '1,200',
    metricLabel: 'Daily Trips Automated',
    metricLabelAr: 'رحلة توصيل يومية مؤتمتة',
    summary: 'Real-time driver assignment using spatial PostGIS queries, progressive offline PWA companion apps, and automated client SMS tracking.',
    summaryAr: 'منصة سحابية متقدمة توفر التوجيه الذكي للمناديب وتتبع الخرائط الحي وتأكيد استلام الشحنات برمز OTP مع لوحة تحكم مركزية.',
    techStack: ['WebSockets', 'PostGIS', 'React PWA', 'Node.js'],
    accentColor: '#10B981',
    icon: 'fleet',
  },
  {
    id: 'kayan-investor-portal',
    slug: 'kayan-investor-portal',
    title: 'Kayan Ventures Institutional Data Room',
    titleAr: 'الهوية المؤسسية وبوابة المستثمرين الرقمية',
    client: 'Kayan Capital',
    category: 'Capital & Brand',
    categoryAr: 'الاستثمار المؤسسي',
    badge: '$2.4M Seed Raised',
    badgeAr: '٢.٤ مليون دولار تمويل',
    metric: '100%',
    metricLabel: 'Institutional Compliance',
    metricLabelAr: 'جاهزية مؤسسية كاملة',
    summary: 'Executive pitch collateral, bilingual investor data room with document watermarking, and dynamic financial simulation modeling.',
    summaryAr: 'بوابة مستثمرين رقمية مشفرة، ونماذج محاكاة مالية تفاعلية، مع تصميم هوية مؤسسية كاملة ساهمت في إغلاق الجولة الاستثمارية.',
    techStack: ['Next.js', 'Financial Modeling', 'Data Room', 'TypeScript'],
    accentColor: '#8B5CF6',
    icon: 'capital',
  },
];

interface ProjectsCarouselProps {
  lang: 'EN' | 'AR';
}

export default function ProjectsCarousel({ lang }: ProjectsCarouselProps) {
  const isRtl = lang === 'AR';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = CAROUSEL_PROJECTS.length;
  const currentProject = CAROUSEL_PROJECTS[currentIndex];

  // Automated rotation timer (3.8 seconds per slide, pauses on user hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swipe left
        isRtl ? goToPrev() : goToNext();
      } else {
        // swipe right
        isRtl ? goToNext() : goToPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 580,
        margin: '0 auto',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── Main Carousel Card Container ─────────────────────────── */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 22,
          padding: '22px 24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Top Bar: Live Status & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                color: '#10B981',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              {isRtl ? currentProject.badgeAr : currentProject.badge}
            </span>

            <span
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.72)',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {isRtl ? currentProject.categoryAr : currentProject.category}
            </span>
          </div>

          {/* Slide Index Counter */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.45)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            0{currentIndex + 1} / 0{total}
          </div>
        </div>

        {/* ─── Dedicated Small Image / Mockup Placeholder Box ─────── */}
        <Link
          href={`/projects?project=${currentProject.slug}`}
          style={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 180,
              borderRadius: 14,
              overflow: 'hidden',
              background: `linear-gradient(135deg, rgba(20, 24, 33, 0.95) 0%, rgba(15, 18, 26, 0.98) 100%)`,
              border: `1px solid rgba(255, 255, 255, 0.12)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.25s ease, border-color 0.25s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.borderColor = currentProject.accentColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            {/* If a real custom image exists, render it; otherwise render high-end visual UI mockup placeholder */}
            {currentProject.image ? (
              <img
                src={currentProject.image}
                alt={currentProject.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <>
                {/* Browser / Application Top Bar */}
                <div
                  style={{
                    height: 28,
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '2px 14px',
                      borderRadius: 999,
                      fontSize: 10,
                      color: 'rgba(255, 255, 255, 0.55)',
                      fontFamily: 'monospace',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span>bldr.studio/projects/{currentProject.slug}</span>
                  </div>

                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: currentProject.accentColor,
                      textTransform: 'uppercase',
                    }}
                  >
                    {currentProject.client}
                  </span>
                </div>

                {/* Graphical Project UI Visualization */}
                <div
                  style={{
                    flex: 1,
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 10,
                    background: `radial-gradient(circle at 85% 20%, ${currentProject.accentColor}22 0%, transparent 60%)`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: `${currentProject.accentColor}25`,
                          border: `1px solid ${currentProject.accentColor}55`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                        }}
                      >
                        {currentProject.icon === 'health' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        ) : currentProject.icon === 'edu' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        ) : currentProject.icon === 'growth' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        ) : currentProject.icon === 'fleet' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 6 12 3 19 6"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/></svg>
                        )}
                      </span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                          {isRtl ? currentProject.titleAr : currentProject.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.55)' }}>
                          {currentProject.client} • 2026 Production Release
                        </div>
                      </div>
                    </div>

                    {/* Metric Tag inside Image Placeholder */}
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        textAlign: 'right',
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                        {currentProject.metric}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.65)', fontWeight: 500 }}>
                        {isRtl ? currentProject.metricLabelAr : currentProject.metricLabel}
                      </div>
                    </div>
                  </div>

                  {/* Mockup Wireframe & Tech Tags Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 4 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {currentProject.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontFamily: 'monospace',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span
                      style={{
                        fontSize: 10,
                        color: 'rgba(255, 255, 255, 0.45)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {isRtl ? 'صورة مصغرة للمشروع ✦' : '✦ Project Thumbnail'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Link>

        {/* Project Description & Summary */}
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            fontWeight: 300,
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.72)',
            minHeight: 44,
          }}
        >
          {isRtl ? currentProject.summaryAr : currentProject.summary}
        </p>

        {/* Bottom Interactive Row: Carousel Navigation + Direct Project Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 8,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Dot Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {CAROUSEL_PROJECTS.map((_, dotIdx) => {
              const isActive = dotIdx === currentIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  style={{
                    border: 'none',
                    padding: 0,
                    width: isActive ? 24 : 7,
                    height: 7,
                    borderRadius: 999,
                    background: isActive ? currentProject.accentColor : 'rgba(255, 255, 255, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                />
              );
            })}
          </div>

          {/* Action & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Direct Project Link */}
            <Link
              href={`/projects?project=${currentProject.slug}`}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: currentProject.accentColor,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'opacity 0.15s ease',
              }}
            >
              <span>{isRtl ? 'دراسة الحالة كاملة' : 'View Case Study'}</span>
              <span>{isRtl ? '←' : '→'}</span>
            </Link>

            {/* Prev / Next Arrows */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous project"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                {isRtl ? '→' : '←'}
              </button>

              <button
                type="button"
                onClick={goToNext}
                aria-label="Next project"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                {isRtl ? '←' : '→'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
