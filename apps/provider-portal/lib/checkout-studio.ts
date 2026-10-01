import {
  CheckoutTemplateBlueprint,
  BrandCheckoutConfig,
} from '@bldr/shared-types';

export const BLUEPRINTS_STORAGE_KEY = 'bldr_master_checkout_blueprints';
export const BRAND_CONFIGS_STORAGE_KEY = 'bldr_brand_checkout_configs';

export const INITIAL_MASTER_TEMPLATES: CheckoutTemplateBlueprint[] = [
  {
    id: 'tpl-split-academy',
    name: 'Modern Split-Hero (Academy Standard)',
    nameAr: 'تصميم الأكاديميات المقسم (معتمد)',
    description: 'Two-column conversion layout. Left pane renders course syllabus, credentials and real-time EGP tuition; right pane renders student registration and Egyptian payment rails.',
    badge: 'Academy Standard',
    layout: 'split-hero',
    headerStyle: 'gradient',
    defaultAccentColor: '#0EA5E9',
    allowedPaymentRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    securitySeals: ['PCI-DSS SAQ-A', 'TLS 1.3 256-Bit', 'Authorized Gateway'],
    version: 'v2.4-enterprise',
    isPublished: true,
    author: 'Platform Financial Super Admin',
    updatedAt: '2026-09-30T18:00:00Z',
  },
  {
    id: 'tpl-single-express',
    name: 'Focused Single-Column (Mobile Express)',
    nameAr: 'التصميم الرأسي السريع (مخصص للموبايل)',
    description: 'Streamlined single-column card flow engineered specifically for smartphone screens, WhatsApp direct pay links, and high-velocity social media registrations.',
    badge: 'Mobile Express',
    layout: 'single-column',
    headerStyle: 'solid',
    defaultAccentColor: '#10B981',
    allowedPaymentRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    securitySeals: ['PCI-DSS SAQ-A', 'Fawry Direct Kiosk', 'TLS 1.3'],
    version: 'v2.1',
    isPublished: true,
    author: 'Platform Financial Super Admin',
    updatedAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'tpl-executive-prestige',
    name: 'Executive Prestige (PCI & Institutional Audit)',
    nameAr: 'تصميم الدبلومات والماجستير التنفيذي',
    description: 'High-ticket institutional presentation tailored for postgraduate diplomas, corporate cohorts, and executive MBA admissions with institutional payment audit trails.',
    badge: 'Institutional Audit',
    layout: 'split-hero',
    headerStyle: 'dark',
    defaultAccentColor: '#D10721',
    allowedPaymentRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: false,
    },
    securitySeals: ['PCI-DSS SAQ-A', 'TLS 1.3 256-Bit', 'Corporate Invoicing'],
    version: 'v2.5',
    isPublished: true,
    author: 'Platform Financial Super Admin',
    updatedAt: '2026-09-29T11:15:00Z',
  },
  {
    id: 'tpl-compact-card',
    name: 'Compact Floating Card (Embeddable)',
    nameAr: 'بطاقة الدفع المدمجة في المواقع',
    description: 'Glassmorphism lightweight modal checkout designed to be seamlessly embedded via <iframe> inside any third-party CMS, LMS, or custom WordPress/Webflow website.',
    badge: 'Embeddable iFrame',
    layout: 'compact-card',
    headerStyle: 'gradient',
    defaultAccentColor: '#7C3AED',
    allowedPaymentRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    securitySeals: ['CORS Verified', 'Cross-Domain PostMessage', 'PCI-DSS'],
    version: 'v1.9',
    isPublished: true,
    author: 'Platform Financial Super Admin',
    updatedAt: '2026-09-25T09:40:00Z',
  },
];

export const INITIAL_BRAND_CHECKOUT_CONFIGS: BrandCheckoutConfig[] = [
  {
    ventureId: 'studyhub',
    ventureName: 'StudyHub Academy',
    templateId: 'tpl-split-academy',
    brandName: 'StudyHub Egypt',
    brandLogoText: 'SH',
    brandLogoUrl: '',
    accentColor: '#0EA5E9',
    bannerStyle: 'gradient',
    supportPhone: '+20 10 1234 5678',
    supportEmail: 'admissions@studyhub.eg',
    showLogoInHero: true,
    connectedGateway: 'Geidea',
    activeRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    liveSlug: 'studyhub-checkout',
    status: 'ACTIVE',
    conversions24h: 142,
    totalVolumeEgp: 681600,
    lastCustomizedAt: '2026-09-30T17:40:00Z',
  },
  {
    ventureId: 'apex',
    ventureName: 'Apex Classes',
    templateId: 'tpl-executive-prestige',
    brandName: 'Apex Classes Cairo',
    brandLogoText: 'AC',
    brandLogoUrl: '',
    accentColor: '#7C3AED',
    bannerStyle: 'dark',
    supportPhone: '+20 12 9876 5432',
    supportEmail: 'exec@apex.edu.eg',
    showLogoInHero: true,
    connectedGateway: 'Paymob (Accept)',
    activeRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: false,
    },
    liveSlug: 'apex-checkout',
    status: 'ACTIVE',
    conversions24h: 98,
    totalVolumeEgp: 181300,
    lastCustomizedAt: '2026-09-29T16:20:00Z',
  },
  {
    ventureId: 'el-hesa',
    ventureName: 'EL HESA Institute',
    templateId: 'tpl-single-express',
    brandName: 'EL HESA National Learning',
    brandLogoText: 'EH',
    brandLogoUrl: '',
    accentColor: '#D10721',
    bannerStyle: 'solid',
    supportPhone: '+20 11 4455 6677',
    supportEmail: 'support@elhesa.org',
    showLogoInHero: true,
    connectedGateway: 'Fawry Pay',
    activeRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    liveSlug: 'elhesa-checkout',
    status: 'ACTIVE',
    conversions24h: 64,
    totalVolumeEgp: 544000,
    lastCustomizedAt: '2026-09-30T12:10:00Z',
  },
  {
    ventureId: 'bldr',
    ventureName: 'bldr Storefront Pilot',
    templateId: 'tpl-compact-card',
    brandName: 'bldr Store & Services',
    brandLogoText: 'BL',
    brandLogoUrl: '',
    accentColor: '#10B981',
    bannerStyle: 'gradient',
    supportPhone: '+20 10 0000 1111',
    supportEmail: 'team@bldr.io',
    showLogoInHero: true,
    connectedGateway: 'Geidea',
    activeRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    liveSlug: 'bldr-checkout',
    status: 'ACTIVE',
    conversions24h: 210,
    totalVolumeEgp: 420000,
    lastCustomizedAt: '2026-09-30T15:00:00Z',
  },
  {
    ventureId: 'career-hub',
    ventureName: 'Career Hub & Talent',
    templateId: 'tpl-split-academy',
    brandName: 'Career Hub Coaching',
    brandLogoText: 'CH',
    brandLogoUrl: '',
    accentColor: '#F59E0B',
    bannerStyle: 'gradient',
    supportPhone: '+20 15 3322 1100',
    supportEmail: 'talent@careerhub.eg',
    showLogoInHero: true,
    connectedGateway: 'Paymob (Accept)',
    activeRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    liveSlug: 'careerhub-checkout',
    status: 'ACTIVE',
    conversions24h: 45,
    totalVolumeEgp: 95000,
    lastCustomizedAt: '2026-09-28T19:30:00Z',
  },
];

export function getMasterBlueprints(): CheckoutTemplateBlueprint[] {
  if (typeof window === 'undefined') return INITIAL_MASTER_TEMPLATES;
  try {
    const raw = localStorage.getItem(BLUEPRINTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(INITIAL_MASTER_TEMPLATES));
      return INITIAL_MASTER_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MASTER_TEMPLATES;
  } catch {
    return INITIAL_MASTER_TEMPLATES;
  }
}

export function saveMasterBlueprints(blueprints: CheckoutTemplateBlueprint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(blueprints));
    window.dispatchEvent(new CustomEvent('bldr:blueprints-updated', { detail: blueprints }));
  } catch (err) {
    console.error('Failed to save blueprints to localStorage:', err);
  }
}

export function getBrandCheckoutConfigs(): BrandCheckoutConfig[] {
  if (typeof window === 'undefined') return INITIAL_BRAND_CHECKOUT_CONFIGS;
  try {
    const raw = localStorage.getItem(BRAND_CONFIGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BRAND_CONFIGS_STORAGE_KEY, JSON.stringify(INITIAL_BRAND_CHECKOUT_CONFIGS));
      return INITIAL_BRAND_CHECKOUT_CONFIGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BRAND_CHECKOUT_CONFIGS;
  } catch {
    return INITIAL_BRAND_CHECKOUT_CONFIGS;
  }
}

export function getBrandCheckoutConfig(ventureId: string): BrandCheckoutConfig {
  const configs = getBrandCheckoutConfigs();
  const found = configs.find(c => c.ventureId === ventureId);
  if (found) return found;

  // Fallback to default for this venture
  return {
    ventureId,
    ventureName: ventureId.toUpperCase(),
    templateId: 'tpl-split-academy',
    brandName: `${ventureId.toUpperCase()} Learning`,
    brandLogoText: ventureId.slice(0, 2).toUpperCase(),
    brandLogoUrl: '',
    accentColor: '#0EA5E9',
    bannerStyle: 'gradient',
    supportPhone: '+20 10 1234 5678',
    supportEmail: `info@${ventureId}.eg`,
    showLogoInHero: true,
    connectedGateway: 'Geidea',
    activeRails: {
      fawry: true,
      wallet: true,
      card: true,
      activationCode: true,
    },
    liveSlug: `${ventureId}-checkout`,
    status: 'ACTIVE',
    conversions24h: 12,
    totalVolumeEgp: 50000,
    lastCustomizedAt: new Date().toISOString(),
  };
}

export function saveBrandCheckoutConfig(config: BrandCheckoutConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getBrandCheckoutConfigs();
    const idx = current.findIndex(c => c.ventureId === config.ventureId);
    let next: BrandCheckoutConfig[];
    if (idx >= 0) {
      next = [...current];
      next[idx] = { ...config, lastCustomizedAt: new Date().toISOString() };
    } else {
      next = [...current, { ...config, lastCustomizedAt: new Date().toISOString() }];
    }
    localStorage.setItem(BRAND_CONFIGS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('bldr:checkout-config-updated', { detail: config }));
  } catch (err) {
    console.error('Failed to save brand checkout config:', err);
  }
}
