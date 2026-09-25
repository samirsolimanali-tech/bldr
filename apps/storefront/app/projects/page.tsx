'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BldrNav, BldrFooter, ProjectContactModal, tokens } from '@bldr/ui';

interface CaseStudy {
  id: string;
  slug: string;
  category: 'platforms' | 'edtech' | 'growth' | 'saas';
  categoryLabel: string;
  categoryLabelAr: string;
  title: string;
  titleAr: string;
  client: string;
  year: string;
  tagline: string;
  taglineAr: string;
  metrics: { value: string; label: string; labelAr: string }[];
  summary: string;
  summaryAr: string;
  challenge: string;
  challengeAr: string;
  solution: string;
  solutionAr: string;
  deliverables: string[];
  deliverablesAr: string[];
  techStack: string[];
  testimonial?: {
    quote: string;
    quoteAr: string;
    author: string;
    role: string;
    roleAr: string;
  };
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'medconnect-portal',
    slug: 'medconnect-portal',
    category: 'platforms',
    categoryLabel: 'Digital Platforms & Web Apps',
    categoryLabelAr: 'المنصات الرقمية وتطبيقات الويب',
    title: 'MedConnect Cloud Clinic & Telehealth Platform',
    titleAr: 'منصة ميدكونيكت السحابية للرعاية الصحية والاستشارات الطبية',
    client: 'MedConnect Regional Health',
    year: '2026',
    tagline: 'Delivering encrypted real-time patient booking, secure video telemetry, and multi-clinic doctor scheduling.',
    taglineAr: 'منصة سحابية متكاملة لحجز المواعيد والاستشارات الطبية المرئية المشفرة وإدارة العيادات المتعددة.',
    metrics: [
      { value: '38,000+', label: 'Patients Managed', labelAr: 'مريض مسجل ومنتظم' },
      { value: '99.95%', label: 'Platform Availability', labelAr: 'استقرار وجاهزية النظام' },
      { value: '< 600ms', label: 'Dashboard Load Time', labelAr: 'سرعة استجابة المنصة' },
      { value: '120+', label: 'Doctors Onboarded', labelAr: 'طبيب استشاري معتمد' },
    ],
    summary: 'A secure, HIPAA-aligned healthcare portal connecting patients with specialized clinicians for virtual consultations, electronic medical records (EMR), and unified multi-tenant scheduling.',
    summaryAr: 'بوابة رعاية صحية آمنة متوافقة مع معايير حماية البيانات الطبية، تربط المرضى بالأطباء الاستشاريين للاستشارات المرئية وحجز العيادات وإدارة السجلات الطبية.',
    challenge: 'Scattered booking processes over WhatsApp and slow legacy hospital software resulted in frequent double-bookings, long patient wait times, and high administrative burnout.',
    challengeAr: 'الحجز اليدوي عبر واتساب والبرمجيات القديمة تسببت في تداخل المواعيد وطول فترات انتظار المرضى وضياع السجلات الطبية.',
    solution: 'Engineered a modern web portal on Next.js 14 and NestJS featuring automated real-time calendar synchronization, encrypted WebRTC clinical consultations, and instant patient SMS reminders.',
    solutionAr: 'تطوير منصة ويب متطورة فائقة السرعة مع مزامنة لحظية لتقويم المواعيد وغرف استشارات مرئية مشفرة وتنبيهات آلية بالرسائل النصية للمرضى.',
    deliverables: [
      'Multi-clinic calendar scheduling with instant conflict detection',
      'Encrypted WebRTC telehealth consultation room',
      'Electronic medical record (EMR) vault with role-based clinical access',
      'Patient SMS & WhatsApp automated reminder pipeline',
    ],
    deliverablesAr: [
      'نظام ذكي لجدولة المواعيد يمنع تكرار أو تداخل الحجوزات',
      'غرف استشارات فيديو مشفرة تعمل بسلاسة دون الحاجة لتحميل تطبيقات',
      'سجل طبي إلكتروني موحد مع مستويات وصول محكمة للأطباء والتمريض',
      'نظام إشعارات وتذكيرات تلقائي للمرضى عبر الرسائل النصية وواتساب',
    ],
    techStack: ['Next.js 14', 'NestJS API', 'PostgreSQL', 'WebRTC', 'TypeScript', 'Tailwind CSS', 'Docker'],
    testimonial: {
      quote: 'bldr delivered an intuitive platform that our doctors actually enjoy using. Patient no-shows dropped by 45% within our first month.',
      quoteAr: 'طورت bldr منصة سهلة ومريحة يستخدمها أطباؤنا يومياً بكل سلاسة. انخفضت نسبة تغيب المرضى عن المواعيد بنسبة ٤٥٪ خلال أول شهر.',
      author: 'Dr. M. El-Sayed',
      role: 'Chief Medical Officer',
      roleAr: 'المدير الطبي العام',
    },
  },
  {
    id: 'edtech-academy',
    slug: 'edtech-academy',
    category: 'edtech',
    categoryLabel: 'EdTech & Learning',
    categoryLabelAr: 'التعليم والمنصات التعليمية',
    title: 'Al-Akademia High-Impact Learning Management Engine',
    titleAr: 'منصة الأكاديمية التعليمية لإدارة المعسكرات التفاعلية',
    client: 'Al-Akademia Cohorts',
    year: '2026',
    tagline: 'Empowering 45,000+ students with DRM video streaming, interactive homework, and instant certificate issuance.',
    taglineAr: 'منصة متكاملة تدعم أكثر من ٤٥ ألف طالب مع حماية متطورة للفيديوهات واختبارات تفاعلية وشهادات فورية.',
    metrics: [
      { value: '45k+', label: 'Enrolled Students', labelAr: 'طالب مسجل ومنتظم' },
      { value: '94.2%', label: 'Course Completion', labelAr: 'نسبة إكمال الدورات' },
      { value: '0 leaks', label: 'DRM Video Protection', labelAr: 'حماية كاملة من التسريب' },
      { value: '1-Click', label: 'Fawry/Card Enrollment', labelAr: 'التحاق فوري بعد الدفع' },
    ],
    summary: 'An end-to-end LMS infrastructure supporting live webinars, protected high-definition recorded lessons, progress tracking, and instant automated student onboarding post-checkout.',
    summaryAr: 'بنية رقمية متكاملة للتعليم عن بُعد تدعم البث المباشر، الفيديوهات المشفرة، تتبع تقدم الطلاب، وتفعيل الحسابات فور إتمام الدفع بنجاح.',
    challenge: 'Existing video platforms suffered from widespread unauthorized screen recording, sluggish buffering during peak evening study hours, and delayed student enrollment approvals.',
    challengeAr: 'كانت المنصات السابقة تعاني من تسريب الفيديوهات وبطء التشغيل وقت الذروة، بالإضافة للتأخير الطويل في تفعيل اشتراكات الطلاب بعد الدفع.',
    solution: 'Designed a lightweight Next.js student portal integrated with encrypted HLS video streaming, automated cohort drip schedules, and instant webhook LMS provisioning upon payment.',
    solutionAr: 'بناء بوابة طلاب فائقة السرعة بتقنية Next.js مع تشفير HLS للبث، وجدولة آلية للمحاضرات، وربط مباشر مع بوابة الدفع لتفعيل الوصول فورياً.',
    deliverables: [
      'Encrypted HLS video player with dynamic watermarking',
      'Automated cohort progression & assignment submission',
      'Automated PDF certificate engine with QR code verification',
      'Tutor revenue analytics & live attendance monitor',
    ],
    deliverablesAr: [
      'مشغل فيديو مشفر مع علامة مائية ديناميكية تمنع تصوير الشاشة',
      'نظام تسليم المهام والواجبات والتصحيح الآلي للاختبارات',
      'إصدار شهادات إتمام رقمية معتمدة مع رمز تحقق QR Code',
      'لوحة تحكم للمعلمين لمتابعة الإيرادات ونسب الحضور المباشر',
    ],
    techStack: ['Next.js App Router', 'AWS CloudFront HLS', 'PostgreSQL', 'Tailwind CSS', 'TypeScript', 'Node.js'],
    testimonial: {
      quote: 'Our students never wait to access their course anymore. They pay through mobile wallet and are inside the classroom in 5 seconds flat.',
      quoteAr: 'لم يعد طلابنا ينتظرون دقيقة واحدة. يدفع الطالب بالمحفظة الإلكترونية ويبدأ مشاهدة المحاضرة خلال ٥ ثوانٍ فقط.',
      author: 'Dr. Tarek S.',
      role: 'Academic Director',
      roleAr: 'المشرف الأكاديمي العام',
    },
  },
  {
    id: 'sidekick-growth',
    slug: 'sidekick-growth',
    category: 'growth',
    categoryLabel: 'Brand & Growth',
    categoryLabelAr: 'الهوية والنمو التجاري',
    title: 'D2C Consumer Brand Launch & Performance Engine',
    titleAr: 'إطلاق علامة تجارية مباشرة للمستهلك ومحرك نمو المبيعات',
    client: 'Velvet Direct Commerce',
    year: '2026',
    tagline: 'Scaling customer acquisition from scratch with unified creative strategy and server-side tracking.',
    taglineAr: 'بناء الهوية البصرية ومضاعفة المبيعات عبر إعلانات عالية التحويل وتتبع خوادم دقيق.',
    metrics: [
      { value: '3.8x', label: 'Blended ROAS', labelAr: 'عائد الإنفاق الإعلاني' },
      { value: '+210%', label: 'Landing Page CR', labelAr: 'معدل تحويل الزوار لعملاء' },
      { value: '120k+', label: 'Paying Customers', labelAr: 'عميل حقيقي مشتري' },
      { value: '48 hrs', label: 'Creative Turnaround', labelAr: 'دورة إنتاج الإعلانات' },
    ],
    summary: 'A full-funnel brand launch encompassing visual brand design, viral vertical video ad production, high-speed headless landing pages, and server-side Meta Conversions API integration.',
    summaryAr: 'إطلاق متكامل لعلامة تجارية يشمل تصميم الهوية البصرية، إنتاج إعلانات الفيديو القصيرة، صفحات هبوط فائقة السرعة، وتتبع سيرفرات ميتا بدقة متناهية.',
    challenge: 'The brand was burning budget on generic agency ads with inconsistent ROAS, inaccurate Meta tracking data, and slow checkout pages that leaked prospective buyers.',
    challengeAr: 'كانت الشركة تهدر ميزانيتها في إعلانات تقليدية غير مربحة، مع فقدان بيانات التتبع بسبب تحديثات الخصوصية وبطء صفحات الشراء.',
    solution: 'Deployed dedicated creative directors to produce UGC hooks, built custom high-speed landing pages with instant buy links, and connected Meta CAPI for 98% event match quality.',
    solutionAr: 'تولينا صياغة وإنتاج المحتوى الإعلاني المباشر، وتطوير صفحات هبوط فورية الشراء مع ربط خوادم الإعلانات لتحقيق دقة تتبع تتجاوز ٩٨٪.',
    deliverables: [
      'Comprehensive brand identity system & motion guidelines',
      '30+ high-converting vertical video creative hooks per month',
      'Custom checkout lander loading in under 800ms',
      'Meta & Google Server-Side Conversions API setup',
    ],
    deliverablesAr: [
      'دليل هوية متكامل وقواعد تصميم الحركة والشعارات',
      'أكثر من ٣٠ إعلاناً مرئياً شهرياً مصمماً لزيادة المبيعات',
      'صفحة هبوط مخصصة للشراء السريع بزمن تحميل أقل من ثانية',
      'إعداد تتبع الخوادم CAPI لفيسبوك وإنستغرام وجوجل',
    ],
    techStack: ['Meta Conversions API', 'Google Ads Engine', 'Next.js Fast Checkout', 'DaVinci Resolve', 'Figma'],
    testimonial: {
      quote: 'bldr is the first team that didn’t blame the algorithm when ads ran. They handled the creative, the landing page, and the checkout under one roof.',
      quoteAr: 'bldr هو الفريق الأول الذي لا يلقي اللوم على الخوارزميات. تولوا صناعة الإعلان وصفحة الهبوط وبوابة الدفع في مكان واحد وبمسؤولية تامة.',
      author: 'Sherif H.',
      role: 'Founder & CEO',
      roleAr: 'المؤسس والمدير التنفيذي',
    },
  },
  {
    id: 'opsflow-enterprise',
    slug: 'opsflow-enterprise',
    category: 'saas',
    categoryLabel: 'Software & SaaS',
    categoryLabelAr: 'الأنظمة والبرمجيات',
    title: 'Enterprise Dispatch & Multi-Vendor Fleet Workflow',
    titleAr: 'نظام إدارة الأسطول الميداني والعمليات اللوجستية للمؤسسات',
    client: 'FleetSync Logistics Hub',
    year: '2026',
    tagline: 'Automating 1,200 daily deliveries across Greater Cairo with live telemetry and driver companion apps.',
    taglineAr: 'أتمتة أكثر من ١٢٠٠ شحنة يومية في القاهرة الكبرى مع تتبع مباشر وتطبيقات هواتف للمناديب.',
    metrics: [
      { value: '60%', label: 'Dispatch Latency Cut', labelAr: 'تقليص زمن تعيين الشحنات' },
      { value: '1,200', label: 'Daily Trips Automated', labelAr: 'رحلة توصيل يومية مؤتمتة' },
      { value: '99.4%', label: 'On-Time SLA Delivery', labelAr: 'التزام بالمواعيد المحددة' },
      { value: '0', label: 'Lost Consignments', labelAr: 'نسبة فقدان الطرود' },
    ],
    summary: 'A cloud platform providing real-time fleet geofencing, dynamic parcel routing, digital proof of delivery with customer OTPs, and an admin command console for operations dispatchers.',
    summaryAr: 'منصة سحابية متقدمة توفر التوجيه الذكي للمناديب وتتبع الخرائط الحي وتأكيد استلام الشحنات برمز OTP مع لوحة قيادة مركزية لمديري العمليات.',
    challenge: 'Manual phone coordination with 80+ drivers resulted in missed delivery windows, billing discrepancies with e-commerce clients, and lack of real-time visibility.',
    challengeAr: 'التواصل الهاتفي اليدوي مع المناديب تسبب في تأخر التسليم وأخطاء في حساب مستحقات المتاجر وغياب الرؤية اللحظية لموقع الشحنات.',
    solution: 'Architected a real-time event-driven system with WebSockets, PostGIS spatial queries for nearest-driver assignment, and a lightweight PWA companion app for couriers.',
    solutionAr: 'تطوير نظام معتمد على تتبع الإحداثيات الجغرافية لتعيين أقرب مندوب آلياً، وتطبيق ويب فوري يعمل بسلاسة على كافة هواتف المناديب.',
    deliverables: [
      'Real-time Mapbox driver dispatch cockpit',
      'Mobile-first courier progressive web app (PWA) with offline sync',
      'Customer SMS tracking link with live driver arrival pin',
      'Automated client invoice generation and delivery fee ledger',
    ],
    deliverablesAr: [
      'شاشة تحكم خرائطية حية لمتابعة حركة السائقين وتوزيع المهام',
      'تطبيق للمناديب يدعم العمل دون إنترنت وتسجيل التوقيعات',
      'رابط تتبع مباشر يرسل للعميل عبر الرسائل القصيرة لمتابعة السائق',
      'إصدار فواتير آلية للمتاجر وربط حسابات التحصيل المالي',
    ],
    techStack: ['Node.js', 'PostgreSQL / PostGIS', 'WebSockets', 'Mapbox GL', 'React PWA', 'Docker'],
    testimonial: {
      quote: 'Our dispatch team went from frantic phone calls all day to watching a calm, automated dashboard handle routing with zero drama.',
      quoteAr: 'تحول فريقنا من إجراء مئات المكالمات الهاتفية المتوترة إلى متابعة شاشة ذكية تدير المسارات تلقائياً ودون أي أخطاء.',
      author: 'Omar F.',
      role: 'VP of Supply Chain',
      roleAr: 'نائب رئيس العمليات وسلاسل الإمداد',
    },
  },
  {
    id: 'kayan-investor-portal',
    slug: 'kayan-investor-portal',
    category: 'growth',
    categoryLabel: 'Brand & Growth',
    categoryLabelAr: 'الهوية والنمو التجاري',
    title: 'Kayan Ventures Brand Identity & Institutional Data Room',
    titleAr: 'الهوية المؤسسية وبوابة المستثمرين الرقمية لشركة كيان',
    client: 'Kayan Capital & Syndicates',
    year: '2026',
    tagline: 'Securing $2.4M in seed capital with institutional presentation design and an interactive financial simulation portal.',
    taglineAr: 'إغلاق جولة تمويلية بقيمة ٢.٤ مليون دولار عبر هوية استثمارية رفيعة وغرفة بيانات مالية تفاعلية.',
    metrics: [
      { value: '$2.4M', label: 'Seed Round Closed', labelAr: 'تمويل أولي تم إغلاقه' },
      { value: '14', label: 'Institutional Angels', labelAr: 'مستثمر ومؤسسة مشاركة' },
      { value: '100%', label: 'Due Diligence Cleared', labelAr: 'اجتياز الفحص المالي التام' },
      { value: '3 wks', label: 'Delivery Timeframe', labelAr: 'مدة التنفيذ والتسليم' },
    ],
    summary: 'A sophisticated brand and investor communication suite: interactive cap-table modeling, encrypted due diligence data rooms, and editorial typography tailored for top venture capital partners.',
    summaryAr: 'باقة استثمارية رفيعة المستوى تشمل نماذج مالية تفاعلية، غرف بيانات مشفرة للمستندات القانونية، وهوية بصرية موجهة لصناديق الاستثمار الجريء.',
    challenge: 'A cutting-edge tech startup was struggling to present its complex financial architecture to regional VCs using clumsy slide decks that failed to convey their engineering depth.',
    challengeAr: 'كانت الشركة تواجه صعوبة في عرض نموذجها المالي المعقد للمستثمرين عبر العروض التقديمية التقليدية التي لا تعكس عمقها التقني.',
    solution: 'Constructed an interactive web portal where investors can adjust forecast parameters in real time, view live verified metrics, and download encrypted audit materials.',
    solutionAr: 'تصميم وبناء بوابة ويب تفاعلية تتيح للمستثمرين تعديل توقعات النمو ومراجعة الأرقام الموثقة وتحميل ملفات الفحص المالي بأمان.',
    deliverables: [
      'Interactive financial simulator with scenario toggles',
      'Encrypted investor data room with audit logging',
      'Editorial corporate brand design and presentation deck',
      'Investor relations onboarding email automations',
    ],
    deliverablesAr: [
      'محاكي مالي تفاعلي لاختبار سيناريوهات الإيرادات ونمو السوق',
      'غرفة بيانات رقمية مشفرة تسجل كل عمليات الاطلاع والتحميل',
      'تصميم مؤسسي فاخر وعرض تقديمي تنفيذي للاجتماعات المغلقة',
      'أتمتة المراسلات الاستثمارية وتحديثات المستثمرين الدورية',
    ],
    techStack: ['Next.js', 'Figma Systems', 'IBM Plex Mono Data Viz', 'Supabase Auth', 'Vercel Edge'],
    testimonial: {
      quote: 'Investors commented that our digital data room was the most transparent and impressive presentation they had seen in the region.',
      quoteAr: 'أكد المستثمرون أن غرفة البيانات الرقمية كانت التجربة الأكثر شفافية واحترافية التي شهدوها في المنطقة.',
      author: 'L. Nader',
      role: 'Managing Partner',
      roleAr: 'الشريك الإداري العام',
    },
  },
];

function ProjectsContent() {
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const searchParams = useSearchParams();

  // Listen to URL query params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && ['platforms', 'edtech', 'growth', 'saas'].includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const isRtl = lang === 'AR';

  const filterTabs = [
    { id: 'all', label: isRtl ? 'جميع المشاريع' : 'All Work', count: CASE_STUDIES.length },
    { id: 'platforms', label: isRtl ? 'المنصات الرقمية وتطبيقات الويب' : 'Digital Platforms', count: 1 },
    { id: 'edtech', label: isRtl ? 'التعليم والمنصات' : 'EdTech & Learning', count: 1 },
    { id: 'growth', label: isRtl ? 'الهوية والنمو التجاري' : 'Brand & Growth', count: 2 },
    { id: 'saas', label: isRtl ? 'الأنظمة والبرمجيات' : 'Software & SaaS', count: 1 },
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return CASE_STUDIES;
    return CASE_STUDIES.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

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

      <main style={{ flex: 1, padding: '56px 32px 96px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          
          {/* ─── Hero Section ───────────────────────────────────── */}
          <div style={{ maxWidth: 840, marginBottom: 48 }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#D10721',
                marginBottom: 12,
              }}
            >
              {isRtl ? 'سجل الإنجازات والمشاريع' : 'Portfolio · Proven Outcomes'}
            </span>

            <h1
              style={{
                margin: '0 0 18px',
                fontSize: 'clamp(34px, 4.4vw, 54px)',
                fontWeight: 700,
                letterSpacing: isRtl ? '-0.02em' : '-0.04em',
                color: '#141416',
                lineHeight: isRtl ? 1.25 : 1.12,
              }}
            >
              {isRtl
                ? 'مشاريع حقيقية أطلقناها، بنينا برمجياتها، وأدرنا نموها.'
                : 'Real ventures we built, engineered, and scaled to market.'}
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.68,
                fontWeight: 400,
                color: '#47454A',
                maxWidth: 680,
              }}
            >
              {isRtl
                ? 'نحن لا نقدم مجرد استشارات نظرية، بل ننزل إلى ميدان التنفيذ. استكشف كيف تجمع bldr بين هندسة البرمجيات، بوابات الدفع، والتسويق الرقمي لتسليم نتائج ذات عائد مالي مباشر.'
                : 'We don’t just write slide decks. We engineer the software, plug in the central payment rails, and drive commercial performance. Explore our selected case studies.'}
            </p>
          </div>

          {/* ─── Filter Tabs ────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 40,
              paddingBottom: 20,
              borderBottom: '1px solid rgba(20,20,22,0.08)',
            }}
          >
            {filterTabs.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 18px',
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: active ? '1px solid #141416' : '1px solid rgba(20,20,22,0.12)',
                    background: active ? '#141416' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#3F444E',
                    boxShadow: active ? '0 4px 12px rgba(20,20,22,0.12)' : 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: 11.5,
                      padding: '1px 6px',
                      borderRadius: 10,
                      background: active ? 'rgba(255,255,255,0.22)' : 'rgba(20,20,22,0.06)',
                      color: active ? '#FFFFFF' : '#6B6970',
                      fontWeight: 600,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ─── Case Studies Grid ──────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 32,
            }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid rgba(20,20,22,0.08)',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(20,20,22,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  {/* Category & Client Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                      fontSize: 12.5,
                    }}
                  >
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        background: 'rgba(20,20,22,0.05)',
                        fontWeight: 600,
                        color: '#2C5F9E',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {isRtl ? project.categoryLabelAr : project.categoryLabel}
                    </span>
                    <span style={{ color: '#888A92', fontWeight: 500 }}>
                      {project.client} · {project.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      margin: '0 0 12px',
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: isRtl ? '-0.01em' : '-0.03em',
                      lineHeight: 1.25,
                      color: '#141416',
                    }}
                  >
                    {isRtl ? project.titleAr : project.title}
                  </h2>

                  {/* Tagline */}
                  <p
                    style={{
                      margin: '0 0 24px',
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: '#47454A',
                      fontWeight: 400,
                    }}
                  >
                    {isRtl ? project.taglineAr : project.tagline}
                  </p>

                  {/* Impact Metrics Matrix */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 12,
                      padding: '16px',
                      background: '#F8F9FA',
                      borderRadius: 12,
                      marginBottom: 24,
                      border: '1px solid rgba(20,20,22,0.05)',
                    }}
                  >
                    {project.metrics.slice(0, 2).map((m, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#141416',
                            letterSpacing: '-0.03em',
                            fontFamily: tokens.fonts.mono,
                          }}
                        >
                          {m.value}
                        </span>
                        <span style={{ fontSize: 12, color: '#6B6970', fontWeight: 500, marginTop: 2 }}>
                          {isRtl ? m.labelAr : m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Capabilities / Stack Tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginBottom: 24,
                    }}
                  >
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: 11.5,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(20,20,22,0.04)',
                          color: '#525660',
                          fontWeight: 500,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span
                        style={{
                          fontSize: 11.5,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'transparent',
                          color: '#8A8D95',
                          fontWeight: 500,
                        }}
                      >
                        +{project.techStack.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div
                  style={{
                    paddingTop: 16,
                    borderTop: '1px solid rgba(20,20,22,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCaseStudy(project)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#2C5F9E',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'inherit',
                    }}
                  >
                    <span>{isRtl ? 'عرض دراسة الحالة كاملة' : 'View Full Case Study'}</span>
                    <span>{isRtl ? '←' : '→'}</span>
                  </button>

                  <span
                    style={{
                      fontSize: 12,
                      color: '#2E6F5E',
                      fontWeight: 600,
                      background: 'rgba(46, 111, 94, 0.08)',
                      padding: '3px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {isRtl ? 'تشغيل حي' : 'Live Venture'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Bottom CTA Banner ──────────────────────────────── */}
          <div
            style={{
              marginTop: 64,
              background: '#141416',
              borderRadius: 22,
              padding: '48px 40px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 32,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FD9426',
                  display: 'inline-block',
                  marginBottom: 10,
                }}
              >
                {isRtl ? 'هل تخطط لمشروعك القادم؟' : 'Partner with bldr'}
              </span>
              <h2
                style={{
                  margin: '0 0 10px',
                  fontSize: 'clamp(26px, 3.2vw, 36px)',
                  fontWeight: 700,
                  letterSpacing: isRtl ? '-0.02em' : '-0.03em',
                  lineHeight: 1.2,
                }}
              >
                {isRtl
                  ? 'لنصمم ونبني وندير منصتك القادمة وفق أعلى المعايير.'
                  : 'Let’s architect, engineer, and operate your next venture.'}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 15.5,
                  color: 'rgba(255,255,255,0.72)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                {isRtl
                  ? 'تحدث مباشرة مع شركائنا التقنيين والتجاريين لبدء خطة عمل واضحة ذات خط مسؤولية موحد.'
                  : 'Speak directly with our technical and commercial partners to outline a unified delivery roadmap.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                style={{
                  height: 50,
                  padding: '0 28px',
                  borderRadius: 999,
                  background: '#FFFFFF',
                  color: '#141416',
                  fontSize: 15,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease',
                }}
              >
                {isRtl ? 'ابدأ مشروعك الآن ←' : 'Start a project →'}
              </button>
              <Link
                href="/services"
                style={{
                  height: 50,
                  padding: '0 24px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  fontSize: 14.5,
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                {isRtl ? 'استعراض الخدمات' : 'View Services'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Case Study Deep Dive Modal ───────────────────────── */}
      {selectedCaseStudy && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelectedCaseStudy(null)}
        >
          <div
            style={{
              maxWidth: 780,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '36px 36px 40px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCaseStudy(null)}
              style={{
                position: 'absolute',
                top: 24,
                [isRtl ? 'left' : 'right']: 24,
                background: 'rgba(20,20,22,0.06)',
                border: 'none',
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 18,
                color: '#141416',
              }}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: 24, paddingRight: isRtl ? 0 : 40, paddingLeft: isRtl ? 40 : 0 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 6,
                    background: 'rgba(44, 95, 158, 0.1)',
                    color: '#2C5F9E',
                  }}
                >
                  {isRtl ? selectedCaseStudy.categoryLabelAr : selectedCaseStudy.categoryLabel}
                </span>
                <span style={{ fontSize: 13, color: '#8A8D95', fontWeight: 500 }}>
                  {selectedCaseStudy.client} · {selectedCaseStudy.year}
                </span>
              </div>

              <h2
                style={{
                  margin: '0 0 10px',
                  fontSize: 'clamp(24px, 3.5vw, 32px)',
                  fontWeight: 700,
                  letterSpacing: isRtl ? '-0.01em' : '-0.03em',
                  color: '#141416',
                  lineHeight: 1.25,
                }}
              >
                {isRtl ? selectedCaseStudy.titleAr : selectedCaseStudy.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: '#47454A',
                  lineHeight: 1.6,
                }}
              >
                {isRtl ? selectedCaseStudy.summaryAr : selectedCaseStudy.summary}
              </p>
            </div>

            {/* Four Metric Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                padding: '16px',
                background: '#F8F9FA',
                borderRadius: 14,
                marginBottom: 28,
                border: '1px solid rgba(20,20,22,0.06)',
              }}
            >
              {selectedCaseStudy.metrics.map((m, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#141416',
                      fontFamily: tokens.fonts.mono,
                    }}
                  >
                    {m.value}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#6B6970', marginTop: 4, fontWeight: 500 }}>
                    {isRtl ? m.labelAr : m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Challenge & Solution Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 28 }}>
              <div
                style={{
                  padding: '20px',
                  borderRadius: 12,
                  background: 'rgba(209, 7, 33, 0.04)',
                  border: '1px solid rgba(209, 7, 33, 0.12)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#D10721', textTransform: 'uppercase', marginBottom: 6 }}>
                  {isRtl ? 'التحدي والمشكلة' : 'The Challenge'}
                </div>
                <div style={{ fontSize: 14.5, color: '#323742', lineHeight: 1.6 }}>
                  {isRtl ? selectedCaseStudy.challengeAr : selectedCaseStudy.challenge}
                </div>
              </div>

              <div
                style={{
                  padding: '20px',
                  borderRadius: 12,
                  background: 'rgba(46, 111, 94, 0.04)',
                  border: '1px solid rgba(46, 111, 94, 0.15)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2E6F5E', textTransform: 'uppercase', marginBottom: 6 }}>
                  {isRtl ? 'الحل الهندسي والتنفيذي' : 'The bldr Execution'}
                </div>
                <div style={{ fontSize: 14.5, color: '#323742', lineHeight: 1.6 }}>
                  {isRtl ? selectedCaseStudy.solutionAr : selectedCaseStudy.solution}
                </div>
              </div>
            </div>

            {/* Key Deliverables */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#141416', margin: '0 0 12px' }}>
                {isRtl ? 'مخرجات المشروع الأساسية' : 'Key Deliverables & Milestones'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                {(isRtl ? selectedCaseStudy.deliverablesAr : selectedCaseStudy.deliverables).map((d, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 8,
                      fontSize: 14,
                      color: '#47454A',
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: '#2E6F5E', fontWeight: 700 }}>✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote if available */}
            {selectedCaseStudy.testimonial && (
              <div
                style={{
                  padding: '18px 22px',
                  borderRadius: 12,
                  background: '#F8F9FA',
                  borderLeft: isRtl ? 'none' : '4px solid #141416',
                  borderRight: isRtl ? '4px solid #141416' : 'none',
                  marginBottom: 28,
                  fontStyle: 'italic',
                }}
              >
                <p style={{ margin: '0 0 8px', fontSize: 14.5, color: '#1E293B', lineHeight: 1.6 }}>
                  "{isRtl ? selectedCaseStudy.testimonial.quoteAr : selectedCaseStudy.testimonial.quote}"
                </p>
                <div style={{ fontSize: 13, color: '#64748B', fontStyle: 'normal', fontWeight: 600 }}>
                  {selectedCaseStudy.testimonial.author} · {isRtl ? selectedCaseStudy.testimonial.roleAr : selectedCaseStudy.testimonial.role}
                </div>
              </div>
            )}

            {/* Tech Stack Pills */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#8A8D95', textTransform: 'uppercase', marginBottom: 8 }}>
                {isRtl ? 'التقنيات المستخدمة' : 'Technologies & Architecture'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedCaseStudy.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: 12,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(20,20,22,0.06)',
                      color: '#141416',
                      fontWeight: 600,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: 14, justifyContent: isRtl ? 'flex-start' : 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedCaseStudy(null);
                  setIsContactOpen(true);
                }}
                style={{
                  height: 48,
                  padding: '0 26px',
                  borderRadius: 999,
                  background: '#141416',
                  color: '#FFFFFF',
                  fontSize: 14.5,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {isRtl ? 'بناء مشروع مماثل معنا ←' : 'Build a Similar Project →'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCaseStudy(null)}
                style={{
                  height: 48,
                  padding: '0 20px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: '#47454A',
                  fontSize: 14,
                  fontWeight: 500,
                  border: '1px solid rgba(20,20,22,0.14)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Contact Modal ─────────────────────────────────────── */}
      <ProjectContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />

      <BldrFooter lang={lang} />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F4F5F7' }} />}>
      <ProjectsContent />
    </Suspense>
  );
}
