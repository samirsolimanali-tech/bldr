import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getCmsFilePath(): string {
  const candidatePaths = [
    path.resolve(process.cwd(), 'packages/shared-types/src/cms-data.json'),
    path.resolve(process.cwd(), '../../packages/shared-types/src/cms-data.json'),
    path.resolve(process.cwd(), '../packages/shared-types/src/cms-data.json'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return candidatePaths[0];
}

export async function GET() {
  try {
    const filePath = getCmsFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      return NextResponse.json({ success: true, data }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    // Fallback default CMS structure
    return NextResponse.json({
      success: true,
      data: {
        hero: {
          tag: '',
          tagAr: '',
          title: 'We build the product, the brand, and the team that runs it.',
          titleAr: 'نبني المنتج الرقمي، العلامة التجارية، والفريق الذي يديرها.',
          subtitle: 'bldr operates specialist units and builds its own ventures. You work with the units you need and keep one point of contact for all of it — nobody hands the outcome to somebody else.',
          subtitleAr: 'تدير bldr وحدات متخصصة وتبني مشاريعها الخاصة. تعمل مع الوحدات التي تحتاجها في التسويق والبرمجيات وبناء المنتجات تحت نقطة اتصال واحدة ومسؤولية كاملة.',
          ctaLabel: 'Start a project →',
          ctaLabelAr: 'ابدأ مشروعك معنا ←',
          secondaryLabel: 'Explore Services',
          secondaryLabelAr: 'استكشف الخدمات',
          secondaryLink: '/services',
        },
        whatsBroken: { tag: "What's Broken", tagAr: 'ما هو الخلل؟', title: 'Everyone did their part. Nobody owned the outcome.', titleAr: 'الجميع قام بدوره.. ولكن لا أحد امتلك النتيجة.', cards: [] },
        specialisms: { units: [] },
        carousel: [],
        brand: {
          name: 'bldr studio',
          email: 'partners@bldr.studio',
          phone: '+20 100 234 5678',
          location: 'New Cairo, Egypt',
          locationAr: 'القاهرة الجديدة، مصر',
          announcement: 'Accepting Q4 2026 venture partnerships across Cairo and the Gulf.',
          announcementAr: 'نستقبل الآن شراكات الربع الرابع لعام ٢٠٢٦ في مصر والخليج العربي.',
          tagline: 'Software engineering, performance ads, and venture operations under one roof.',
          taglineAr: 'هندسة برمجيات، إعلانات أداء، وإدارة عمليات متكاملة تحت سقف واحد.',
        },
        footer: {
          description: 'Empowering EdTech businesses and educational academies with tailored digital solutions, automated operations, and payment infrastructure.',
          descriptionAr: 'تمكين شركات تكنولوجيا التعليم والأكاديميات بالحلول الرقمية المتخصصة، البنية التحتية الذكية، وأنظمة المدفوعات المتكاملة.',
          instagram: 'https://www.instagram.com/bldr.management',
          facebook: 'https://www.facebook.com/share/14uAjf399GL/',
          linkedin: 'https://www.linkedin.com/company/bldrmanagement/',
          location: 'Giza, Egypt',
          locationAr: 'الجيزة، جمهورية مصر العربية',
          phone: '+20 10 30165000',
          email: 'bldr.management@gmail.com',
          copyright: '© 2026 bldr. Operated by Evolve bldr for Business Management, Giza, Egypt.',
          copyrightAr: '© ٢٠٢٦ bldr. تشغيل شركة إيفولف بيلدر لإدارة الأعمال، الجيزة، مصر.',
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const filePath = getCmsFilePath();
    try {
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
    } catch (e) {
      console.warn('CMS file write error (read-only filesystem):', e);
    }
    return NextResponse.json({ success: true, timestamp: Date.now(), message: 'CMS updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
