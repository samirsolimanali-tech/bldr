import { PrismaClient, ProviderStatus, PurchaseType, EngagementType, UserRole, CardWalletGateway, IntegrationMode, PlatformFeeModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[bldr] Seeding database...');

  // ─── Global Commission Rule (10%) ──────────────────────────────────────────
  const existingRule = await prisma.commissionRule.findFirst({
    where: { providerId: null },
  });
  if (existingRule) {
    await prisma.commissionRule.update({
      where: { id: existingRule.id },
      data: { rate: 0.1 },
    });
  } else {
    await prisma.commissionRule.create({
      data: { providerId: null, rate: 0.1 },
    });
  }
  console.log('✅ Global commission rule: 10%');

  // ─── Admin User ─────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@bldr.io';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@bldr2024!';
  const adminHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      firstName: 'Platform',
      lastName: 'Admin',
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Admin user: ${adminEmail}`);

  // ─── House-Brand Provider ────────────────────────────────────────────────────
  const houseBrand = await prisma.provider.upsert({
    where: { slug: 'bldr' },
    update: {
      conversionToken: 'house_sec_tok_bldr_2024',
      cardWalletGateway: CardWalletGateway.GEIDEA,
      fawryEnabled: true,
      integrationMode: IntegrationMode.NATIVE,
      platformFeeModel: PlatformFeeModel.PERCENTAGE,
      platformFeePct: 0.03,
      vatOnFeesEnabled: false,
      vatRate: 0.00,
      reservePct: 0.05,
      reserveReleaseDays: 14,
      payoutCadence: 'weekly',
      payoutMinThreshold: 100000,
      externalWebhookUrl: 'http://localhost:3000/api/webhooks/bldr-payments',
      externalWebhookSecret: 'whsec_test_bldr_pilot_2026',
    },
    create: {
      slug: 'bldr',
      name: 'bldr',
      tagline: 'Education, Media, and Growth — Powered by bldr',
      bio: `bldr is the platform's own service division, offering world-class Education Solutions, Media Production, Tutor Marketing Services, Business Consulting, and Corporate Training. We exist to help individuals and organisations grow smarter.`,
      isHouseBrand: true,
      status: ProviderStatus.APPROVED,
      conversionToken: 'house_sec_tok_bldr_2024',
      cardWalletGateway: CardWalletGateway.GEIDEA,
      fawryEnabled: true,
      integrationMode: IntegrationMode.NATIVE,
      platformFeeModel: PlatformFeeModel.PERCENTAGE,
      platformFeePct: 0.03,
      vatOnFeesEnabled: false,
      vatRate: 0.00,
      reservePct: 0.05,
      reserveReleaseDays: 14,
      payoutCadence: 'weekly',
      payoutMinThreshold: 100000,
      externalWebhookUrl: 'http://localhost:3000/api/webhooks/bldr-payments',
      externalWebhookSecret: 'whsec_test_bldr_pilot_2026',
    },
  });
  console.log(`✅ House-brand provider: bldr (id: ${houseBrand.id})`);

  // ─── House-Brand Provider User ───────────────────────────────────────────────
  const providerEmail = 'team@bldr.io';
  const providerHash = await bcrypt.hash('Provider@bldr2024!', 12);
  await prisma.providerUser.upsert({
    where: { email: providerEmail },
    update: {},
    create: {
      email: providerEmail,
      passwordHash: providerHash,
      firstName: 'bldr',
      lastName: 'Team',
      role: UserRole.PROVIDER,
      providerId: houseBrand.id,
    },
  });
  console.log(`✅ House-brand provider user: ${providerEmail}`);

  // ─── House-Brand Listings (Service Lines) ────────────────────────────────────
  // Engagement defaults:
  // Training, Media → BUY_NOW
  // Consulting, Education, Tutor Marketing → REQUEST_QUOTE
  const houseListings = [
    {
      title: 'Education Solutions',
      description:
        'Comprehensive learning programmes designed for students, professionals, and institutions. From curriculum design to blended learning delivery, we partner with you to build futures.',
      price: 2500,
      category: 'Education',
      tags: ['curriculum', 'e-learning', 'professional development'],
      purchaseType: PurchaseType.NATIVE,
      engagementType: EngagementType.REQUEST_QUOTE,
      isFeatured: true,
    },
    {
      title: 'Media Production',
      description:
        'End-to-end content creation — from scripting and filming to post-production and distribution. Podcasts, promotional videos, educational content, and brand films.',
      price: 5000,
      category: 'Media',
      tags: ['video', 'podcast', 'content creation', 'brand film'],
      purchaseType: PurchaseType.NATIVE,
      engagementType: EngagementType.BUY_NOW,
      isFeatured: true,
    },
    {
      title: 'Tutor Marketing Services',
      description:
        'Done-for-you marketing for independent tutors and coaching businesses. We manage your ads, social presence, lead funnels, and appointment booking.',
      price: 1200,
      category: 'Marketing',
      tags: ['tutor marketing', 'lead gen', 'social media', 'ads'],
      purchaseType: PurchaseType.NATIVE,
      engagementType: EngagementType.REQUEST_QUOTE,
      isFeatured: true,
    },
    {
      title: 'Business Consulting',
      description:
        'Strategic advisory across operations, finance, go-to-market, and digital transformation. Whether you\'re a startup or scaling SME, our consultants deliver actionable roadmaps.',
      price: 3500,
      category: 'Consulting',
      tags: ['strategy', 'operations', 'growth', 'SME'],
      purchaseType: PurchaseType.NATIVE,
      engagementType: EngagementType.REQUEST_QUOTE,
      isFeatured: true,
    },
    {
      title: 'Corporate Training',
      description:
        'On-site and virtual training programmes tailored to your team\'s needs — leadership, soft skills, technical upskilling, and compliance. Available as single-day workshops or ongoing retainers.',
      price: 4000,
      category: 'Training',
      tags: ['corporate', 'leadership', 'upskilling', 'workshop'],
      purchaseType: PurchaseType.NATIVE,
      engagementType: EngagementType.BUY_NOW,
      isFeatured: false,
    },
  ];

  for (const listing of houseListings) {
    const existing = await prisma.listing.findFirst({
      where: { title: listing.title, providerId: houseBrand.id },
    });
    if (!existing) {
      await prisma.listing.create({
        data: {
          ...listing,
          currency: 'EGP',
          isPublished: true,
          providerId: houseBrand.id,
        },
      });
    } else {
      await prisma.listing.update({
        where: { id: existing.id },
        data: {
          engagementType: listing.engagementType,
          purchaseType: listing.purchaseType,
          price: listing.price,
        },
      });
    }
    console.log(`  ✅ Listing: ${listing.title} (${listing.engagementType})`);
  }

  // ─── Sample External Provider ────────────────────────────────────────────────
  const sampleProvider = await prisma.provider.upsert({
    where: { slug: 'techbridge-academy' },
    update: {
      conversionToken: 'tb_sec_tok_7f9a12c8b4',
    },
    create: {
      slug: 'techbridge-academy',
      name: 'TechBridge Academy',
      tagline: 'Bridging talent and technology',
      bio: 'TechBridge Academy offers intensive coding bootcamps, data science courses, and cloud certifications for the next generation of tech professionals.',
      status: ProviderStatus.APPROVED,
      isHouseBrand: false,
      conversionToken: 'tb_sec_tok_7f9a12c8b4',
    },
  });


  const sampleProviderUserEmail = 'contact@techbridge.academy';
  const sampleProviderHash = await bcrypt.hash('Provider@test2024!', 12);
  await prisma.providerUser.upsert({
    where: { email: sampleProviderUserEmail },
    update: {},
    create: {
      email: sampleProviderUserEmail,
      passwordHash: sampleProviderHash,
      firstName: 'Alex',
      lastName: 'Rivera',
      role: UserRole.PROVIDER,
      providerId: sampleProvider.id,
    },
  });

  const sampleListings = [
    {
      title: 'Full-Stack Web Bootcamp (12 Weeks)',
      description: 'Intensive hands-on bootcamp covering React, Node.js, PostgreSQL, and deployment. Graduate job-ready with a portfolio of 3 real projects.',
      price: 1800,
      category: 'Education',
      tags: ['bootcamp', 'react', 'nodejs', 'full-stack'],
      purchaseType: PurchaseType.NATIVE,
      engagementType: EngagementType.BUY_NOW,
      isFeatured: true,
    },
    {
      title: 'AWS Cloud Practitioner Prep',
      description: 'Structured 4-week prep course for the AWS Certified Cloud Practitioner exam. Includes mock exams, study guides, and a live Q&A session.',
      price: 299,
      category: 'Technology',
      tags: ['AWS', 'cloud', 'certification', 'exam prep'],
      purchaseType: PurchaseType.REDIRECT,
      engagementType: EngagementType.BUY_NOW,
      redirectUrl: 'http://localhost:3000/simulate/provider-store/techbridge-academy',
      isFeatured: false,
    },
    {
      title: 'Executive AI & Machine Learning Lab',
      description: 'Applied machine learning and GenAI strategy workshop for senior managers and product leaders. Complete projects in OpenAI APIs, LangChain, and evaluation.',
      price: 499,
      category: 'Technology',
      tags: ['AI', 'LLM', 'Python', 'Machine Learning'],
      purchaseType: PurchaseType.REDIRECT,
      engagementType: EngagementType.BUY_NOW,
      redirectUrl: 'http://localhost:3000/simulate/provider-store/techbridge-academy',
      isFeatured: true,
    },
    {
      title: 'Digital Creator Studio Masterclass',
      description: 'Comprehensive studio lighting, camera workflow, DaVinci Resolve color grading, and podcast multi-cam production masterclass.',
      price: 350,
      category: 'Media',
      tags: ['video', 'media', 'studio', 'podcasting'],
      purchaseType: PurchaseType.REDIRECT,
      engagementType: EngagementType.BUY_NOW,
      redirectUrl: 'http://localhost:3000/simulate/provider-store/techbridge-academy',
      isFeatured: false,
    },
  ];

  for (const listing of sampleListings) {
    const existing = await prisma.listing.findFirst({
      where: { title: listing.title, providerId: sampleProvider.id },
    });
    if (!existing) {
      await prisma.listing.create({
        data: {
          ...listing,
          currency: 'EGP',
          isPublished: true,
          providerId: sampleProvider.id,
        },
      });
    } else {
      await prisma.listing.update({
        where: { id: existing.id },
        data: {
          purchaseType: listing.purchaseType,
          engagementType: listing.engagementType,
          redirectUrl: listing.redirectUrl,
          price: listing.price,
        },
      });
    }
    console.log(`  [OK] Sample listing: ${listing.title} (${listing.purchaseType})`);
  }

  // ─── Seed Authoritative PostgreSQL Products (Single Source of Truth) ────────
  console.log('\n[bldr] Seeding authoritative products table...');

  // 1. StudyHub Venture
  const studyhub = await prisma.provider.upsert({
    where: { slug: 'studyhub' },
    update: { cardWalletGateway: CardWalletGateway.GEIDEA, fawryEnabled: true },
    create: {
      slug: 'studyhub',
      name: 'StudyHub',
      tagline: 'Tech Bootcamps & Professional Engineering Cohorts',
      status: ProviderStatus.APPROVED,
      isHouseBrand: true,
      cardWalletGateway: CardWalletGateway.GEIDEA,
      fawryEnabled: true,
    },
  });

  // 2. Apex Classes Venture
  const apexClasses = await prisma.provider.upsert({
    where: { slug: 'apexclasses' },
    update: { cardWalletGateway: CardWalletGateway.GEIDEA, fawryEnabled: true },
    create: {
      slug: 'apexclasses',
      name: 'Apex Classes',
      tagline: 'Premier Secondary Science & Mathematics Academy',
      status: ProviderStatus.APPROVED,
      isHouseBrand: true,
      cardWalletGateway: CardWalletGateway.GEIDEA,
      fawryEnabled: true,
    },
  });

  // 3. EL HESA Venture
  const elHesa = await prisma.provider.upsert({
    where: { slug: 'elhesa' },
    update: { cardWalletGateway: CardWalletGateway.GEIDEA, fawryEnabled: true },
    create: {
      slug: 'elhesa',
      name: 'EL HESA',
      tagline: 'IGCSE & International Qualifications Excellence Hub',
      status: ProviderStatus.APPROVED,
      isHouseBrand: true,
      cardWalletGateway: CardWalletGateway.GEIDEA,
      fawryEnabled: true,
    },
  });

  // 4. CareerHub Venture
  const careerHub = await prisma.provider.upsert({
    where: { slug: 'careerhub' },
    update: { cardWalletGateway: CardWalletGateway.GEIDEA, fawryEnabled: true },
    create: {
      slug: 'careerhub',
      name: 'CareerHub',
      tagline: 'Executive Finance, Strategy & Leadership Accelerators',
      status: ProviderStatus.APPROVED,
      isHouseBrand: true,
      cardWalletGateway: CardWalletGateway.GEIDEA,
      fawryEnabled: true,
    },
  });

  const authoritativeProducts = [
    {
      ventureId: studyhub.id,
      slug: 'sh-8k2m9q',
      title_en: 'Full-Stack Web Engineering Bootcamp (12 Weeks)',
      title_ar: 'معسكر هندسة وتطوير الويب الشامل (١٢ أسبوع)',
      description: 'Intensive engineering bootcamp with live instruction, code reviews, and enterprise React/Node/Postgres curriculum.',
      priceMinor: 480000, // 4,800.00 EGP
      currency: 'EGP',
      saleMode: 'DIRECT',
      status: 'ACTIVE',
    },
    {
      ventureId: studyhub.id,
      slug: 'sh-uiux-01',
      title_en: 'UI/UX Design Systems & Product Strategy',
      title_ar: 'تصميم واجهات وتجربة المستخدم واستراتيجية المنتج',
      description: 'Master Figma design systems, usability benchmarking, and modern product prototyping.',
      priceMinor: 320000, // 3,200.00 EGP
      currency: 'EGP',
      saleMode: 'DIRECT',
      status: 'ACTIVE',
    },
    {
      ventureId: apexClasses.id,
      slug: 'ac-4p9x1y',
      title_en: 'Advanced Thanawiya Amma Physics Prep Cohort',
      title_ar: 'المعسكر المكثف لفيزياء الثانوية العامة مع مستر أحمد',
      description: 'Comprehensive exam preparation covering modern physics, electromagnetism, and problem-solving workshops.',
      priceMinor: 120000, // 1,200.00 EGP
      currency: 'EGP',
      saleMode: 'DIRECT',
      status: 'ACTIVE',
    },
    {
      ventureId: apexClasses.id,
      slug: 'ac-math-02',
      title_en: 'Thanawiya Amma Pure & Applied Mathematics Mastery',
      title_ar: 'شرح وتدريبات الرياضيات البحتة والتطبيقية للثانوية العامة',
      description: 'In-depth calculus, algebra, and mechanics training tailored to Egyptian national curriculum examinations.',
      priceMinor: 150000, // 1,500.00 EGP
      currency: 'EGP',
      saleMode: 'DIRECT',
      status: 'ACTIVE',
    },
    {
      ventureId: elHesa.id,
      slug: 'eh-9w3z8t',
      title_en: 'Executive IGCSE Business Management Intensive',
      title_ar: 'دورة إدارة الأعمال المكثفة لشهادة الـ IGCSE الدولية',
      description: 'Cambridge & Edexcel accredited revision sprint with past-paper breakdown and case-study analysis.',
      priceMinor: 220000, // 2,200.00 EGP
      currency: 'EGP',
      saleMode: 'DIRECT',
      status: 'ACTIVE',
    },
    {
      ventureId: careerHub.id,
      slug: 'ch-fin-04',
      title_en: 'Corporate Financial Modeling & Valuation Associate',
      title_ar: 'برنامج النمذجة والتقييم المالي الاحترافي للشركات',
      description: 'Wall Street-grade DCF, LBO, and 3-statement modeling applied to MENA capital markets.',
      priceMinor: 390000, // 3,900.00 EGP
      currency: 'EGP',
      saleMode: 'DIRECT',
      status: 'ACTIVE',
    },
  ];

  for (const prod of authoritativeProducts) {
    const p = await (prisma as any).product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
    console.log(`  [OK] Authoritative Product: ${p.title_en} (${p.slug}) -> EGP ${(p.priceMinor / 100).toFixed(2)}`);
  }


  console.log('\n[bldr] Seeding complete!');
  console.log('─'.repeat(50));
  console.log(`Admin login:          ${adminEmail} / ${adminPassword}`);
  console.log(`House-brand login:    ${providerEmail} / Provider@bldr2024!`);
  console.log(`Sample provider:      ${sampleProviderUserEmail} / Provider@test2024!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
