/**
 * payment-links-store.ts
 * Shared localStorage-backed store for payment links and payment pages/ventures.
 * Both the provider portal and the central hub read/write from the same keys,
 * and broadcast CustomEvents so any open tab refreshes instantly.
 */

export const PAYMENT_LINKS_KEY = 'bldr_payment_links';
export const VENTURES_KEY = 'bldr_ventures_registry';

/* ─── Types ─────────────────────────────────────────────────── */

export type PaymentLinkStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'PAID';

export interface PaymentLink {
  id: string;
  ventureId: string;
  ventureName: string;
  ventureCode: string;
  ventureColor: string;
  chipBg: string;
  chipFg: string;
  desc: string;                     // product/course title
  orderRef: string;                 // e.g. SH-FS-SEPT26
  amount: number;                   // raw EGP
  slug: string;                     // full checkout URL
  mode: 'Fixed' | 'Caller-supplied';
  maxUses: number | null;           // null = unlimited
  usedCount: number;
  expiry: string;                   // ISO date string
  status: PaymentLinkStatus;
  clicks: number;
  conversions: number;
  createdAt: string;                // ISO
  createdBy: string;                // 'hub' | 'provider'
}

export interface VentureRecord {
  id: string;
  name: string;
  code: string;
  color: string;
  type: string;
  owner: string;
  email: string;
  revenue: number;
  students: number;
  links: number;
  status: 'Active' | 'Pending' | 'Suspended';
  gateway: string;
  joined: string;
  createdBy: string;
}

/* ─── Seed Data ─────────────────────────────────────────────── */

const SEED_LINKS: PaymentLink[] = [
  {
    id: 'lnk-seed-01',
    ventureId: 'studyhub',
    ventureName: 'StudyHub Academy',
    ventureCode: 'SH',
    ventureColor: '#2E6F5E',
    chipBg: '#E0F2FE',
    chipFg: '#0369A1',
    desc: 'Full-Stack Engineering Sept Cohort',
    orderRef: 'SH-FS-SEPT26',
    amount: 4800,
    slug: 'https://pay.bldr.dev/studyhub/fs-sept26',
    mode: 'Fixed',
    maxUses: 100,
    usedCount: 65,
    expiry: '2026-10-20',
    status: 'ACTIVE',
    clicks: 1420,
    conversions: 65,
    createdAt: '2026-09-01T00:00:00Z',
    createdBy: 'provider',
  },
  {
    id: 'lnk-seed-02',
    ventureId: 'studyhub',
    ventureName: 'StudyHub Academy',
    ventureCode: 'SH',
    ventureColor: '#2E6F5E',
    chipBg: '#E0F2FE',
    chipFg: '#0369A1',
    desc: 'Digital Marketing Mastery Fast Track',
    orderRef: 'SH-MKT-0910',
    amount: 1200,
    slug: 'https://pay.bldr.dev/studyhub/marketing-fast',
    mode: 'Fixed',
    maxUses: 150,
    usedCount: 48,
    expiry: '2026-10-14',
    status: 'ACTIVE',
    clicks: 890,
    conversions: 48,
    createdAt: '2026-09-10T00:00:00Z',
    createdBy: 'provider',
  },
  {
    id: 'lnk-seed-03',
    ventureId: 'bldr',
    ventureName: 'bldr (Storefront Pilot)',
    ventureCode: 'BLDR',
    ventureColor: '#D10721',
    chipBg: '#EFF6FF',
    chipFg: '#1E3A8A',
    desc: 'Brand Strategy & Positioning Guide',
    orderRef: 'BLDR-BOOK-0815',
    amount: 299,
    slug: 'https://pay.bldr.dev/bldr/brand-book',
    mode: 'Fixed',
    maxUses: null,
    usedCount: 180,
    expiry: '2026-12-31',
    status: 'ACTIVE',
    clicks: 2340,
    conversions: 180,
    createdAt: '2026-08-15T00:00:00Z',
    createdBy: 'provider',
  },
  {
    id: 'lnk-seed-04',
    ventureId: 'bldr',
    ventureName: 'bldr (Storefront Pilot)',
    ventureCode: 'BLDR',
    ventureColor: '#D10721',
    chipBg: '#EFF6FF',
    chipFg: '#1E3A8A',
    desc: '1-on-1 Executive Mentorship Pass',
    orderRef: 'BLDR-MENTOR-0918',
    amount: 3500,
    slug: 'https://pay.bldr.dev/bldr/mentor-pass',
    mode: 'Fixed',
    maxUses: 10,
    usedCount: 8,
    expiry: '2026-10-30',
    status: 'PAUSED',
    clicks: 210,
    conversions: 8,
    createdAt: '2026-09-18T00:00:00Z',
    createdBy: 'provider',
  },
  {
    id: 'lnk-seed-05',
    ventureId: 'el-hesa',
    ventureName: 'EL HESA Institute',
    ventureCode: 'EH',
    ventureColor: '#B8860B',
    chipBg: '#ECFDF5',
    chipFg: '#047857',
    desc: 'Executive MBA Registration',
    orderRef: 'EH-MBA-0905',
    amount: 8500,
    slug: 'https://pay.bldr.dev/el-hesa/mba-2026',
    mode: 'Fixed',
    maxUses: 50,
    usedCount: 42,
    expiry: '2026-11-15',
    status: 'ACTIVE',
    clicks: 640,
    conversions: 42,
    createdAt: '2026-09-05T00:00:00Z',
    createdBy: 'provider',
  },
  {
    id: 'lnk-seed-06',
    ventureId: 'apex',
    ventureName: 'Apex Classes',
    ventureCode: 'AC',
    ventureColor: '#1B2A4A',
    chipBg: '#FEF3C7',
    chipFg: '#B45309',
    desc: 'CFA Level 1 FastTrack Batch',
    orderRef: 'AC-CFA-0914',
    amount: 6500,
    slug: 'https://pay.bldr.dev/apex/cfa-fasttrack',
    mode: 'Fixed',
    maxUses: 40,
    usedCount: 28,
    expiry: '2026-10-30',
    status: 'ACTIVE',
    clicks: 512,
    conversions: 28,
    createdAt: '2026-09-14T00:00:00Z',
    createdBy: 'provider',
  },
];

const SEED_VENTURES: VentureRecord[] = [
  { id: 'bldr', name: 'bldr (Storefront Pilot)', code: 'BLDR', color: '#D10721', type: 'Platform & Storefront (Pilot)', owner: 'bldr Admin', email: 'ops@bldr.dev', revenue: 150000, students: 48, links: 4, status: 'Active', gateway: 'Geidea + Fawry', joined: '2026-09-01', createdBy: 'hub' },
  { id: 'studyhub', name: 'StudyHub Academy', code: 'SH', color: '#2E6F5E', type: 'EdTech', owner: 'Ahmed Khalil', email: 'ahmed@studyhub.eg', revenue: 1420500, students: 1240, links: 8, status: 'Active', gateway: 'PSP-A (Hosted)', joined: '2025-01-12', createdBy: 'hub' },
  { id: 'apex', name: 'Apex Classes', code: 'AC', color: '#1B2A4A', type: 'Professional Training', owner: 'Omar Hassan', email: 'omar@apexclasses.eg', revenue: 980000, students: 680, links: 12, status: 'Active', gateway: 'PSP-A (Hosted)', joined: '2025-01-28', createdBy: 'hub' },
  { id: 'el-hesa', name: 'EL HESA Institute', code: 'EH', color: '#B8860B', type: 'Secondary Education', owner: 'Fatima Al-Nasser', email: 'admin@elhesa.eg', revenue: 840000, students: 890, links: 6, status: 'Active', gateway: 'PSP-B', joined: '2025-04-02', createdBy: 'hub' },
  { id: 'career-hub', name: 'Career Hub', code: 'CH', color: '#7A4CA0', type: 'Career Development', owner: 'Sara Ibrahim', email: 'work@careerhub.eg', revenue: 795798, students: 340, links: 5, status: 'Active', gateway: 'PSP-A (Hosted)', joined: '2025-02-08', createdBy: 'hub' },
];

/* ─── Helpers ────────────────────────────────────────────────── */

function isBrowser() {
  return typeof window !== 'undefined';
}

function broadcast(eventName: string) {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(eventName));
}

/* ─── Payment Links API ──────────────────────────────────────── */

export function getPaymentLinks(): PaymentLink[] {
  if (!isBrowser()) return SEED_LINKS;
  try {
    const raw = localStorage.getItem(PAYMENT_LINKS_KEY);
    if (raw) return JSON.parse(raw) as PaymentLink[];
  } catch {}
  // First visit — seed and persist
  localStorage.setItem(PAYMENT_LINKS_KEY, JSON.stringify(SEED_LINKS));
  return SEED_LINKS;
}

export function savePaymentLink(link: PaymentLink): void {
  const all = getPaymentLinks();
  const idx = all.findIndex((l) => l.id === link.id);
  if (idx >= 0) {
    all[idx] = link;
  } else {
    all.unshift(link);
  }
  localStorage.setItem(PAYMENT_LINKS_KEY, JSON.stringify(all));
  broadcast('bldr:payment-links-updated');
}

export function togglePaymentLinkStatus(id: string): void {
  const all = getPaymentLinks();
  const link = all.find((l) => l.id === id);
  if (!link) return;
  link.status = link.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
  localStorage.setItem(PAYMENT_LINKS_KEY, JSON.stringify(all));
  broadcast('bldr:payment-links-updated');
}

export function deletePaymentLink(id: string): void {
  const all = getPaymentLinks().filter((l) => l.id !== id);
  localStorage.setItem(PAYMENT_LINKS_KEY, JSON.stringify(all));
  broadcast('bldr:payment-links-updated');
}

/* ─── Ventures API ───────────────────────────────────────────── */

export function getVentures(): VentureRecord[] {
  if (!isBrowser()) return SEED_VENTURES;
  try {
    const raw = localStorage.getItem(VENTURES_KEY);
    if (raw) return JSON.parse(raw) as VentureRecord[];
  } catch {}
  localStorage.setItem(VENTURES_KEY, JSON.stringify(SEED_VENTURES));
  return SEED_VENTURES;
}

export function saveVenture(venture: VentureRecord): void {
  const all = getVentures();
  const idx = all.findIndex((v) => v.id === venture.id);
  if (idx >= 0) {
    all[idx] = venture;
  } else {
    all.unshift(venture);
  }
  localStorage.setItem(VENTURES_KEY, JSON.stringify(all));
  broadcast('bldr:ventures-updated');
}

export function getVentureById(id: string): VentureRecord | undefined {
  return getVentures().find((v) => v.id === id);
}

/* ─── Utility ────────────────────────────────────────────────── */

export function ventureChipColors(ventureId: string): { chipBg: string; chipFg: string } {
  const map: Record<string, { chipBg: string; chipFg: string }> = {
    studyhub: { chipBg: '#E0F2FE', chipFg: '#0369A1' },
    bldr:     { chipBg: '#EFF6FF', chipFg: '#1E3A8A' },
    'el-hesa': { chipBg: '#ECFDF5', chipFg: '#047857' },
    apex:     { chipBg: '#FEF3C7', chipFg: '#B45309' },
    'career-hub': { chipBg: '#F3E8FF', chipFg: '#7E22CE' },
  };
  return map[ventureId] ?? { chipBg: '#F1F5F9', chipFg: '#475569' };
}

export function ventureSlugFromId(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
