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
