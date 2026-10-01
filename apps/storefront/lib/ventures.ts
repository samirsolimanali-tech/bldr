export interface VentureConfig {
  id: string;
  code: string;
  displayName: string;
  supportPhone: string;
  supportEmail: string;
  cardWalletGateway: 'geidea' | 'paymob';
  fawryEnabled: boolean;
  codeActivationEnabled: boolean;
  ctaLabel?: string;
  ctaLabelAr?: string;
}

export const VENTURES_CONFIG: Record<string, VentureConfig> = {
  ac: {
    id: 'apex',
    code: 'AC',
    displayName: 'Apex Classes',
    supportPhone: '+20 12 9876 5432',
    supportEmail: 'admissions@apex.edu.eg',
    cardWalletGateway: 'paymob',
    fawryEnabled: true,
    codeActivationEnabled: true,
    ctaLabel: 'Buy now',
    ctaLabelAr: 'شراء الآن',
  },
  sh: {
    id: 'studyhub',
    code: 'SH',
    displayName: 'StudyHub Academy',
    supportPhone: '+20 10 1234 5678',
    supportEmail: 'admissions@studyhub.eg',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    ctaLabel: 'Enroll Now',
    ctaLabelAr: 'سجل الآن',
  },
  eh: {
    id: 'el-hesa',
    code: 'EH',
    displayName: 'EL HESA Institute',
    supportPhone: '+20 11 4455 6677',
    supportEmail: 'support@elhesa.org',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    ctaLabel: 'Buy now',
    ctaLabelAr: 'شراء الآن',
  },
  ch: {
    id: 'careerhub',
    code: 'CH',
    displayName: 'Career Hub',
    supportPhone: '+20 15 1122 3344',
    supportEmail: 'support@careerhub.eg',
    cardWalletGateway: 'paymob',
    fawryEnabled: true,
    codeActivationEnabled: true,
    ctaLabel: 'Book Seat',
    ctaLabelAr: 'احجز مقعدك',
  },
  sk: {
    id: 'sidekick',
    code: 'SK',
    displayName: 'Sidekick Studio',
    supportPhone: '+20 10 9999 1111',
    supportEmail: 'sidekick@bldr.example',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    ctaLabel: 'Start Growth Engine',
    ctaLabelAr: 'ابدأ حملتك الآن',
  },
  th: {
    id: 'techhouse',
    code: 'TH',
    displayName: 'Software & Technology',
    supportPhone: '+20 10 7777 8888',
    supportEmail: 'tech@bldr.example',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: false,
    ctaLabel: 'Request Engineering Consultation',
    ctaLabelAr: 'طلب استشارة هندسية',
  },
  bm: {
    id: 'bldr',
    code: 'BLDR',
    displayName: 'bldr Management',
    supportPhone: '+20 10 0000 0000',
    supportEmail: 'partners@bldr.dev',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    ctaLabel: 'Buy now',
    ctaLabelAr: 'شراء الآن',
  },
};

export function getVentureConfig(codeOrId?: string): VentureConfig {
  if (!codeOrId) {
    return VENTURES_CONFIG.bm;
  }
  const key = codeOrId.toLowerCase().trim();
  if (key === 'bldr' || key === 'bm') {
    return VENTURES_CONFIG.bm;
  }
  if (VENTURES_CONFIG[key]) {
    return VENTURES_CONFIG[key];
  }
  const found = Object.values(VENTURES_CONFIG).find(
    (v) => v.id.toLowerCase() === key || v.code.toLowerCase() === key
  );
  return found || VENTURES_CONFIG.bm;
}
