'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import HubSidebar from '../../../components/HubSidebar';
import HubTopBar from '../../../components/HubTopBar';
import {
  getVentureCodes,
  generateBatchCodes,
  bulkImportCodes,
  updateCodeStatus,
  EnrollmentCode,
} from '../../../lib/enrollment-codes';

type TabType = 'profile' | 'domains' | 'urls' | 'methods' | 'codes' | 'limits' | 'keys';

const VENTURE_REGISTRY: Record<string, any> = {
  bldr: {
    id: 'bldr',
    code: 'bldr',
    topBarId: 'BLDR',
    displayName: 'bldr (Storefront Pilot)',
    legalName: 'bldr Technologies LLC — Venture #1 Pilot',
    activityType: 'Online education — digital courses',
    language: 'en',
    description: 'bldr house-brand storefront and educational platform. Flagship pilot venture for the Central Payment Hub.',
    primaryColor: '#D10721',
    secondaryColor: '#12203C',
    checkoutLayout: 'top-left',
    integrationMode: 'NATIVE',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    platformFeeModel: 'PERCENTAGE',
    platformFeePct: '3.00',
    platformFeeFlat: '0',
    vatOnFeesEnabled: true,
    vatRate: '14.00',
    reservePct: '5.00',
    reserveReleaseDays: '14',
    payoutCadence: 'weekly',
    payoutMinThreshold: '100000',
    apiKeyTest: 'sk_test_bldr_2026',
    webhookSecret: 'whsec_test_bldr_pilot_2026',
    apiKeyLive: 'sk_live_bldr_2026',
    returnUrl: 'http://localhost:3000/orders/{ORDER_ID}/success',
    cancelUrl: 'http://localhost:3000/products',
    webhookUrl: 'http://localhost:3000/api/webhooks/bldr-payments',
    supportEmail: 'ops@bldr.dev',
    domains: [
      { host: 'localhost:3000', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
      { host: 'bldr.store', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
      { host: 'app.bldr.dev', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
    ],
  },
  studyhub: {
    id: 'studyhub',
    code: 'studyhub',
    topBarId: 'SH',
    displayName: 'StudyHub Academy',
    legalName: 'Operated by Evolve bldr for Business Management',
    activityType: 'Online education — digital courses',
    language: 'en',
    description: 'Secondary-school course platform. Sells individual courses and term subscriptions to students in Egypt.',
    primaryColor: '#2E6F5E',
    secondaryColor: '#12203C',
    checkoutLayout: 'top-left',
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: true,
    platformFeeModel: 'PERCENTAGE',
    platformFeePct: '3.00',
    platformFeeFlat: '500',
    vatOnFeesEnabled: true,
    vatRate: '14.00',
    reservePct: '5.00',
    reserveReleaseDays: '14',
    payoutCadence: 'weekly',
    payoutMinThreshold: '100000',
    apiKeyTest: 'sk_test_sh_994101823abce',
    webhookSecret: 'whsec_test_sh_sec_884912',
    apiKeyLive: 'sk_live_sh_88a912e4f01',
    returnUrl: 'https://studyhub.eg/checkout/success',
    cancelUrl: 'https://studyhub.eg/checkout/cancel',
    webhookUrl: 'https://api.studyhub.eg/v1/payments/events',
    supportEmail: 'support@studyhub.eg',
    domains: [
      { host: 'studyhub.eg', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
      { host: 'app.studyhub.eg', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
      { host: 'stage.studyhub.eg', state: 'Pending DNS', fg: '#B8860B', bg: '#FBF3E0' },
    ],
  },
  apex: {
    id: 'apex',
    code: 'apex',
    topBarId: 'AC',
    displayName: 'Apex Classes',
    legalName: 'Apex Educational Institute S.A.E.',
    activityType: 'Professional training — blended cohorts',
    language: 'en',
    description: 'Professional accreditation and corporate cohort training in Cairo and Alexandria.',
    primaryColor: '#2C5F9E',
    secondaryColor: '#1B2A4A',
    checkoutLayout: 'top-center',
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'paymob',
    fawryEnabled: false,
    codeActivationEnabled: true,
    platformFeeModel: 'COMBINED',
    platformFeePct: '2.50',
    platformFeeFlat: '300',
    vatOnFeesEnabled: true,
    vatRate: '14.00',
    reservePct: '5.00',
    reserveReleaseDays: '14',
    payoutCadence: 'weekly',
    payoutMinThreshold: '200000',
    apiKeyTest: 'sk_test_ac_449210182',
    webhookSecret: 'whsec_test_ac_sec_44921',
    apiKeyLive: 'sk_live_ac_91823ab',
    returnUrl: 'https://apexclasses.eg/checkout/success',
    cancelUrl: 'https://apexclasses.eg/checkout/cancel',
    webhookUrl: 'https://api.apexclasses.eg/webhooks/bldr',
    supportEmail: 'support@apexclasses.eg',
    domains: [
      { host: 'apexclasses.eg', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
      { host: 'portal.apexclasses.eg', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
    ],
  },
  'el-hesa': {
    id: 'el-hesa',
    code: 'el-hesa',
    topBarId: 'EH',
    displayName: 'EL HESA Institute',
    legalName: 'EL HESA Secondary Education Hub S.A.E.',
    activityType: 'High School & Thanawya Amma Prep',
    language: 'ar',
    description: 'Egyptian National Curriculum prep center offering video lectures and live revision sessions.',
    primaryColor: '#B8860B',
    secondaryColor: '#12203C',
    checkoutLayout: 'split-hero',
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
    codeActivationEnabled: false,
    platformFeeModel: 'PERCENTAGE',
    platformFeePct: '3.50',
    platformFeeFlat: '0',
    vatOnFeesEnabled: true,
    vatRate: '14.00',
    reservePct: '5.00',
    reserveReleaseDays: '14',
    payoutCadence: 'weekly',
    payoutMinThreshold: '50000',
    apiKeyTest: 'sk_test_eh_7718290',
    webhookSecret: 'whsec_test_eh_sec_7718',
    apiKeyLive: 'sk_live_eh_3391024',
    returnUrl: 'https://elhesa.eg/checkout/success',
    cancelUrl: 'https://elhesa.eg/checkout/cancel',
    webhookUrl: 'https://api.elhesa.eg/v1/payments/webhook',
    supportEmail: 'admin@elhesa.eg',
    domains: [
      { host: 'elhesa.eg', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
      { host: 'learn.elhesa.eg', state: 'Pending DNS', fg: '#B8860B', bg: '#FBF3E0' },
    ],
  },
  'career-hub': {
    id: 'career-hub',
    code: 'career-hub',
    topBarId: 'CH',
    displayName: 'Career Hub',
    legalName: 'Career Hub Talent Accelerators Egypt',
    activityType: 'Career Development & Executive Coaching',
    language: 'en',
    description: 'Short workshops and career coaching subscriptions for Egyptian professionals.',
    primaryColor: '#7A4CA0',
    secondaryColor: '#1B2A4A',
    checkoutLayout: 'top-left',
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'geidea',
    fawryEnabled: false,
    codeActivationEnabled: false,
    platformFeeModel: 'FLAT_PER_TXN',
    platformFeePct: '0.00',
    platformFeeFlat: '1500',
    vatOnFeesEnabled: true,
    vatRate: '14.00',
    reservePct: '3.00',
    reserveReleaseDays: '7',
    payoutCadence: 'daily',
    payoutMinThreshold: '50000',
    apiKeyTest: 'sk_test_ch_1189204',
    webhookSecret: 'whsec_test_ch_sec_1189',
    apiKeyLive: 'sk_live_ch_5502914',
    returnUrl: 'https://careerhub.eg/checkout/success',
    cancelUrl: 'https://careerhub.eg/courses',
    webhookUrl: 'https://api.careerhub.eg/payments/notify',
    supportEmail: 'work@careerhub.eg',
    domains: [
      { host: 'careerhub.eg', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
    ],
  },
};

function resolveVentureConfig(slug?: string) {
  if (!slug) return VENTURE_REGISTRY.bldr;
  const s = slug.toLowerCase();
  if (s === 'bldr') return VENTURE_REGISTRY.bldr;
  if (s === 'studyhub' || s === 'sh') return VENTURE_REGISTRY.studyhub;
  if (s === 'apex' || s === 'ac') return VENTURE_REGISTRY.apex;
  if (s === 'el-hesa' || s === 'elhesa' || s === 'eh') return VENTURE_REGISTRY['el-hesa'];
  if (s === 'career-hub' || s === 'careerhub' || s === 'ch') return VENTURE_REGISTRY['career-hub'];

  if (typeof window !== 'undefined') {
    try {
      const customRegistry = JSON.parse(localStorage.getItem('bldr_custom_registry') || '{}');
      if (customRegistry[s]) {
        return {
          ...VENTURE_REGISTRY.studyhub,
          ...customRegistry[s],
        };
      }
    } catch (e) {}
  }

  return {
    ...VENTURE_REGISTRY.studyhub,
    id: s,
    code: s,
    topBarId: s.toUpperCase(),
    displayName: `${s.charAt(0).toUpperCase() + s.slice(1)} Venture`,
    legalName: `${s.toUpperCase()} Operations Egypt S.A.E.`,
    returnUrl: `https://${s}.eg/checkout/success`,
    cancelUrl: `https://${s}.eg/checkout/cancel`,
    webhookUrl: `https://api.${s}.eg/webhooks/bldr`,
    supportEmail: `support@${s}.eg`,
    apiKeyTest: `sk_test_${s}_2026`,
    webhookSecret: `whsec_test_${s}_2026`,
    apiKeyLive: `sk_live_${s}_2026`,
    domains: [{ host: `${s}.eg`, state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' }],
  };
}

export default function VentureConfigPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || 'bldr';

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [isActive, setIsActive] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active venture configuration state
  const [ventureCode, setVentureCode] = useState('bldr');
  const [topBarId, setTopBarId] = useState('BLDR');
  const [displayName, setDisplayName] = useState('bldr (Storefront Pilot)');
  const [legalName, setLegalName] = useState('bldr Technologies LLC — Venture #1 Pilot');
  const [activityType, setActivityType] = useState('Online education — digital courses');
  const [language, setLanguage] = useState<'en' | 'ar' | 'auto'>('en');
  const [description, setDescription] = useState('bldr house-brand storefront and educational platform.');
  const [primaryColor, setPrimaryColor] = useState('#D10721');
  const [secondaryColor, setSecondaryColor] = useState('#12203C');
  const [checkoutLayout, setCheckoutLayout] = useState<'top-left' | 'top-center' | 'split-hero'>('top-left');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) setLogoUrl(res);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
    e.target.value = '';
  };

  const [integrationMode, setIntegrationMode] = useState<'NATIVE' | 'BOLT_ON'>('NATIVE');
  const [platformFeeModel, setPlatformFeeModel] = useState<'PERCENTAGE' | 'FLAT_PER_TXN' | 'COMBINED'>('PERCENTAGE');
  const [platformFeePct, setPlatformFeePct] = useState('3.00');
  const [platformFeeFlat, setPlatformFeeFlat] = useState('0');
  const [vatOnFeesEnabled, setVatOnFeesEnabled] = useState(true);
  const [vatRate, setVatRate] = useState('14.00');
  const [reservePct, setReservePct] = useState('5.00');
  const [reserveReleaseDays, setReserveReleaseDays] = useState('14');
  const [payoutCadence, setPayoutCadence] = useState<'daily' | 'weekly' | 'manual'>('weekly');
  const [payoutMinThreshold, setPayoutMinThreshold] = useState('100000');

  const [cardWalletGateway, setCardWalletGateway] = useState<'geidea' | 'paymob'>('geidea');
  const [fawryEnabled, setFawryEnabled] = useState(true);
  const [codeActivationEnabled, setCodeActivationEnabled] = useState(true);

  // Activation Codes Management State
  const [ventureCodes, setVentureCodes] = useState<EnrollmentCode[]>([]);
  const [codeSearch, setCodeSearch] = useState('');
  const [codeStatusFilter, setCodeStatusFilter] = useState('ALL');
  const [codeSourceFilter, setCodeSourceFilter] = useState('ALL');
  const [showGenModal, setShowGenModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [genCount, setGenCount] = useState(10);
  const [genPrefix, setGenPrefix] = useState('');
  const [genProduct, setGenProduct] = useState('');
  const [genSource, setGenSource] = useState<'CENTER' | 'TUTOR' | 'PHYSICAL_STORE' | 'BATCH_DISTRIBUTION'>('CENTER');
  const [isGenerating, setIsGenerating] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvProduct, setCsvProduct] = useState('');
  const [csvSource, setCsvSource] = useState<'CENTER' | 'TUTOR' | 'PHYSICAL_STORE' | 'BATCH_DISTRIBUTION'>('CENTER');
  const [csvResult, setCsvResult] = useState<{ imported: number; duplicates: number } | null>(null);
  const [copiedCodeFeedback, setCopiedCodeFeedback] = useState<string | null>(null);

  const refreshCodes = (vCode?: string) => {
    const target = (vCode || ventureCode).toLowerCase();
    const list = getVentureCodes(target);
    setVentureCodes(list);
  };

  const [returnUrl, setReturnUrl] = useState('http://localhost:3000/orders/{ORDER_ID}/success');
  const [cancelUrl, setCancelUrl] = useState('http://localhost:3000/products');
  const [webhookUrl, setWebhookUrl] = useState('http://localhost:3000/api/webhooks/bldr-payments');
  const [supportEmail, setSupportEmail] = useState('ops@bldr.dev');

  const [apiKeyTest, setApiKeyTest] = useState('sk_test_bldr_2026');
  const [webhookSecret, setWebhookSecret] = useState('whsec_test_bldr_pilot_2026');
  const [apiKeyLive, setApiKeyLive] = useState('sk_live_bldr_2026');

  const [domains, setDomains] = useState<any[]>([
    { host: 'localhost:3000', state: 'Verified', fg: '#2E6F5E', bg: '#E6EFEB' },
  ]);

  const [methods, setMethods] = useState([
    { id: 'cards', label: 'Cards (Visa, Mastercard)', fg: '#2E6F5E', bg: '#E6EFEB', bd: '#A8D5C8', enabled: true },
    { id: 'wallets', label: 'Mobile Wallets (Vodafone, Orange, WE)', fg: '#2E6F5E', bg: '#E6EFEB', bd: '#A8D5C8', enabled: true },
    { id: 'fawry', label: 'Fawry Pay Kiosk', fg: '#2E6F5E', bg: '#E6EFEB', bd: '#A8D5C8', enabled: true },
  ]);

  // Load active venture configuration whenever rawId changes
  useEffect(() => {
    const config = resolveVentureConfig(rawId);

    // Check for user-saved overrides in localStorage
    try {
      const saved = localStorage.getItem(`bldr_venture_config_${config.code}`);
      if (saved) {
        const p = JSON.parse(saved);
        setVentureCode(config.code);
        setTopBarId(config.topBarId);
        setDisplayName(p.displayName || config.displayName);
        setLegalName(p.legalName || config.legalName);
        setActivityType(p.activityType || config.activityType);
        setLanguage(p.language || config.language);
        setDescription(p.description || config.description);
        setPrimaryColor(p.primaryColor || config.primaryColor);
        setSecondaryColor(p.secondaryColor || config.secondaryColor);
        setCheckoutLayout(p.checkoutLayout || config.checkoutLayout || 'top-left');
        setLogoUrl(p.logoUrl !== undefined ? p.logoUrl : (config.logoUrl || ''));
        setIntegrationMode(p.integrationMode || config.integrationMode);
        setCardWalletGateway(p.cardWalletGateway || config.cardWalletGateway);
        setFawryEnabled(p.fawryEnabled ?? config.fawryEnabled);
        setCodeActivationEnabled(p.codeActivationEnabled ?? config.codeActivationEnabled ?? true);
        refreshCodes(config.code);
        setGenPrefix(config.code.toUpperCase());
        setGenProduct(p.displayName || config.displayName);
        setCsvProduct(p.displayName || config.displayName);
        setPlatformFeeModel(p.platformFeeModel || config.platformFeeModel);
        setPlatformFeePct(p.platformFeePct || config.platformFeePct);
        setPlatformFeeFlat(p.platformFeeFlat || config.platformFeeFlat);
        setVatOnFeesEnabled(p.vatOnFeesEnabled ?? config.vatOnFeesEnabled);
        setVatRate(p.vatRate || config.vatRate);
        setReservePct(p.reservePct || config.reservePct);
        setReserveReleaseDays(p.reserveReleaseDays || config.reserveReleaseDays);
        setPayoutCadence(p.payoutCadence || config.payoutCadence);
        setPayoutMinThreshold(p.payoutMinThreshold || config.payoutMinThreshold);
        setReturnUrl(p.returnUrl || config.returnUrl);
        setCancelUrl(p.cancelUrl || config.cancelUrl);
        setWebhookUrl(p.webhookUrl || config.webhookUrl);
        setSupportEmail(p.supportEmail || config.supportEmail);
        setDomains(p.domains || config.domains);
        setApiKeyTest(p.apiKeyTest || config.apiKeyTest);
        setWebhookSecret(p.webhookSecret || config.webhookSecret);
        setApiKeyLive(config.apiKeyLive);
        return;
      }
    } catch (e) {}

    // Apply baseline default config
    setVentureCode(config.code);
    setTopBarId(config.topBarId);
    setDisplayName(config.displayName);
    setLegalName(config.legalName);
    setActivityType(config.activityType);
    setLanguage(config.language);
    setDescription(config.description);
    setPrimaryColor(config.primaryColor);
    setSecondaryColor(config.secondaryColor);
    setCheckoutLayout(config.checkoutLayout || 'top-left');
    setLogoUrl(config.logoUrl || '');
    setIntegrationMode(config.integrationMode);
    setCardWalletGateway(config.cardWalletGateway);
    setFawryEnabled(config.fawryEnabled);
    setCodeActivationEnabled(config.codeActivationEnabled ?? true);
    refreshCodes(config.code);
    setGenPrefix(config.code.toUpperCase());
    setGenProduct(config.displayName);
    setCsvProduct(config.displayName);
    setPlatformFeeModel(config.platformFeeModel);
    setPlatformFeePct(config.platformFeePct);
    setPlatformFeeFlat(config.platformFeeFlat);
    setVatOnFeesEnabled(config.vatOnFeesEnabled);
    setVatRate(config.vatRate);
    setReservePct(config.reservePct);
    setReserveReleaseDays(config.reserveReleaseDays);
    setPayoutCadence(config.payoutCadence);
    setPayoutMinThreshold(config.payoutMinThreshold);
    setReturnUrl(config.returnUrl);
    setCancelUrl(config.cancelUrl);
    setWebhookUrl(config.webhookUrl);
    setSupportEmail(config.supportEmail);
    setDomains(config.domains);
    setApiKeyTest(config.apiKeyTest);
    setWebhookSecret(config.webhookSecret);
    setApiKeyLive(config.apiKeyLive);
  }, [rawId]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, keyName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCodeFeedback(code);
      setTimeout(() => setCopiedCodeFeedback(null), 2000);
    }
  };

  // Actions for codes
  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      generateBatchCodes({
        ventureId: ventureCode,
        count: Number(genCount) || 5,
        productId: `${ventureCode}-course`,
        productName: genProduct || displayName,
        source: genSource,
        prefix: genPrefix.trim().toUpperCase() || undefined,
      });
      setIsGenerating(false);
      setShowGenModal(false);
      refreshCodes();
    }, 400);
  };

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    const res = bulkImportCodes(
      ventureCode,
      csvText,
      csvProduct || displayName,
      csvSource,
      `${ventureCode}-course`
    );
    setCsvResult(res);
    refreshCodes();
    setTimeout(() => {
      setShowUploadModal(false);
      setCsvResult(null);
      setCsvText('');
    }, 1500);
  };

  const handleToggleCodeStatus = (code: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'VOID' ? 'UNUSED' : 'VOID';
    updateCodeStatus(code, nextStatus as any);
    refreshCodes();
  };

  const handleExportCodesCSV = () => {
    const headers = ['Code', 'Serial', 'Course/Product', 'Status', 'Source', 'Created At', 'Redeemed By', 'Redeemed Email', 'Redeemed At'];
    const rows = ventureCodes.map(c => [
      c.code,
      c.serial || '',
      c.productName || c.productId,
      c.status,
      c.source || '',
      c.createdAt,
      c.redeemedByName || '',
      c.redeemedByEmail || '',
      c.redeemedAt || '',
    ]);

    const csvStr = [headers.join(','), ...rows.map(r => r.map(x => `"${x}"`).join(','))].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${ventureCode}_activation_codes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    try {
      const dataToSave = {
        displayName,
        legalName,
        activityType,
        language,
        description,
        primaryColor,
        secondaryColor,
        checkoutLayout,
        logoUrl,
        integrationMode,
        cardWalletGateway,
        fawryEnabled,
        codeActivationEnabled,
        platformFeeModel,
        platformFeePct,
        platformFeeFlat,
        vatOnFeesEnabled,
        vatRate,
        reservePct,
        reserveReleaseDays,
        payoutCadence,
        payoutMinThreshold,
        returnUrl,
        cancelUrl,
        webhookUrl,
        supportEmail,
        domains,
        apiKeyTest,
        webhookSecret,
      };
      localStorage.setItem(`bldr_venture_config_${ventureCode}`, JSON.stringify(dataToSave));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('Failed to save venture configuration.');
    }
  };

  const handleDiscard = () => {
    localStorage.removeItem(`bldr_venture_config_${ventureCode}`);
    const config = resolveVentureConfig(rawId);
    setDisplayName(config.displayName);
    setLegalName(config.legalName);
    setActivityType(config.activityType);
    setLanguage(config.language);
    setDescription(config.description);
    setPrimaryColor(config.primaryColor);
    setSecondaryColor(config.secondaryColor);
    setLogoUrl(config.logoUrl || '');
    setCardWalletGateway(config.cardWalletGateway);
    setFawryEnabled(config.fawryEnabled);
    setCodeActivationEnabled(config.codeActivationEnabled ?? true);
    refreshCodes(config.code);
    setPlatformFeeModel(config.platformFeeModel);
    setPlatformFeePct(config.platformFeePct);
    setPlatformFeeFlat(config.platformFeeFlat);
    setVatOnFeesEnabled(config.vatOnFeesEnabled);
    setVatRate(config.vatRate);
    setReservePct(config.reservePct);
    setReserveReleaseDays(config.reserveReleaseDays);
    setPayoutCadence(config.payoutCadence);
    setPayoutMinThreshold(config.payoutMinThreshold);
    setReturnUrl(config.returnUrl);
    setCancelUrl(config.cancelUrl);
    setWebhookUrl(config.webhookUrl);
    setSupportEmail(config.supportEmail);
    setDomains(config.domains);
    setApiKeyTest(config.apiKeyTest);
    setWebhookSecret(config.webhookSecret);
    setSaveSuccess(false);
  };

  const handleVentureSwitch = (vid: string) => {
    const s = vid.toLowerCase();
    if (s === 'all') {
      router.push('/ventures');
      return;
    }
    if (s.includes('bldr')) router.push('/ventures/bldr');
    else if (s.includes('sh') || s.includes('studyhub')) router.push('/ventures/studyhub');
    else if (s.includes('ac') || s.includes('apex')) router.push('/ventures/apex');
    else if (s.includes('eh') || s.includes('hesa')) router.push('/ventures/el-hesa');
    else if (s.includes('ch') || s.includes('career')) router.push('/ventures/career-hub');
    else router.push(`/ventures/${vid}`);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar active="Ventures" />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title={displayName}
          crumb={`Ventures / ${displayName}`}
          env={env}
          onEnvChange={setEnv}
          selectedVenture={topBarId}
          onSelectVenture={handleVentureSwitch}
        />

        <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top Bar Tabs & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid #E3E8EF', padding: '0 2px' }}>
            {[
              { id: 'profile', label: 'Profile & branding' },
              { id: 'domains', label: 'Domains & apps' },
              { id: 'urls', label: 'URLs & webhooks' },
              { id: 'methods', label: 'Payment methods' },
              { id: 'codes', label: 'Activation codes' },
              { id: 'limits', label: 'Limits' },
              { id: 'keys', label: 'API keys' },
            ].map(t => {
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as TabType)}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? '#1B2A4A' : '#718096',
                    padding: '8px 4px 11px',
                    borderBottom: isSelected ? '3px solid #2E6F5E' : '3px solid transparent',
                    marginBottom: -1,
                    background: 'none',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
            <div style={{ flex: 1 }}></div>
            {saveSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2E6F5E', fontSize: '11.5px', fontWeight: 700 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="2"><path d="M3.5 8.5l3 3 6-6" /></svg>
                Changes saved
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
              <button
                type="button"
                onClick={handleDiscard}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#5A6A80',
                  border: '1px solid #E3E8EF',
                  background: '#fff',
                  borderRadius: 7,
                  padding: '7px 13px',
                  cursor: 'pointer',
                }}
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#fff',
                  background: '#2E6F5E',
                  border: 'none',
                  borderRadius: 7,
                  padding: '7px 15px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(46,111,94,0.3)',
                }}
              >
                Save changes
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              TAB 1: Profile & branding
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 16, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Profile Card */}
                <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 15 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>Venture profile</span>
                    <div style={{ flex: 1 }}></div>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <span
                        style={{
                          width: 32,
                          height: 18,
                          borderRadius: 10,
                          background: isActive ? '#2E6F5E' : '#D3DAE4',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'background 0.2s ease',
                        }}
                      >
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            right: isActive ? 2 : 'auto',
                            left: isActive ? 'auto' : 2,
                            transition: 'all 0.2s ease',
                          }}
                        />
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: isActive ? '#2E6F5E' : '#8A94A6' }}>
                        {isActive ? 'Active' : 'Disabled'}
                      </span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Display name
                      </span>
                      <input
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#fff', padding: '0 11px', fontSize: '12.5px', fontWeight: 600, color: '#1B2A4A', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Venture code · immutable
                      </span>
                      <div style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12.5px', fontWeight: 700, color: '#5A6A80' }}>
                          {ventureCode}
                        </span>
                        <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#8A94A6', background: '#E3E8EF', borderRadius: 4, padding: '2px 6px' }}>
                          ID
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Legal entity name
                      </span>
                      <input
                        type="text"
                        value={legalName}
                        onChange={e => setLegalName(e.target.value)}
                        style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#fff', padding: '0 11px', fontSize: '12.5px', fontWeight: 600, color: '#1B2A4A', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Business activity type
                      </span>
                      <input
                        type="text"
                        value={activityType}
                        onChange={e => setActivityType(e.target.value)}
                        style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#fff', padding: '0 11px', fontSize: '12.5px', fontWeight: 600, color: '#1B2A4A', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                      Primary language
                    </span>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value as any)}
                      style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#fff', padding: '0 11px', fontSize: '12.5px', fontWeight: 600, color: '#1B2A4A', outline: 'none' }}
                    >
                      <option value="en">English (default)</option>
                      <option value="ar">Arabic (العربية)</option>
                      <option value="auto">Auto-detect from browser locale</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                      Brand description
                    </span>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      style={{ border: '1px solid #E3E8EF', borderRadius: 7, background: '#fff', padding: '9px 11px', fontSize: '12.5px', fontWeight: 500, color: '#1B2A4A', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Hosted Checkout Branding Card (Templated Customization Model) */}
                <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                          Hosted Checkout Branding
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.04em' }}>
                          TEMPLATED MODEL
                        </span>
                      </div>
                      <span style={{ fontSize: 11.5, color: '#64748B' }}>
                        Brand assets and layout for <code style={{ fontFamily: 'monospace', background: '#F1F5F9', padding: '1px 5px', borderRadius: 4, color: '#0F172A' }}>pay.bldrmanagement.com/pay/[sessionId]</code>
                      </span>
                    </div>

                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1E3A8A', background: '#DBEAFE', borderRadius: 4, padding: '3px 8px' }}>
                      PCI SAQ A / A-EP SCOPE SAFE
                    </span>
                  </div>

                  {/* Architecture & PCI Guardrail Banner */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, background: '#12203C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 900 }}>
                      b.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1E293B' }}>
                        Templated Customization Boundary (Standard Industry Practice)
                      </span>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748B', lineHeight: 1.45 }}>
                        To satisfy PCI-DSS SAQ A / A-EP regulatory compliance (same as Stripe Checkout & Shopify), checkout pages provide <strong>fixed structure with swappable branding values</strong>. Raw HTML/CSS/JS editing and payment flow scripting are disallowed to ensure merchant iframe isolation and prevent cardholder data interference.
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Logo Asset */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B' }}>
                        1. Venture Brand Logo
                      </span>
                      <span style={{ fontSize: 10.5, color: '#94A3B8' }}>
                        Recommended: SVG or PNG with transparent background
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files?.[0]) handleLogoUpload(e.dataTransfer.files[0]);
                        }}
                        style={{
                          width: 84,
                          height: 84,
                          border: isDragging ? '2px dashed #2E6F5E' : (logoUrl ? '1px solid #D0D7E2' : '1px dashed #CBD5E1'),
                          borderRadius: 8,
                          background: isDragging ? '#F0F6F4' : '#F8FAFC',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          padding: logoUrl ? 6 : 0,
                          flexShrink: 0,
                        }}
                        title="Click or drag image to upload logo"
                      >
                        {logoUrl ? (
                          <>
                            <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                              Change
                            </div>
                          </>
                        ) : (
                          <>
                            <span style={{ width: 34, height: 34, borderRadius: 7, background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 12, fontWeight: 800 }}>
                              {topBarId}
                            </span>
                            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#2E6F5E', marginTop: 4 }}>Upload</span>
                          </>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, borderRadius: 6, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1E293B', cursor: 'pointer' }}
                          >
                            Browse file...
                          </button>
                          {logoUrl && (
                            <button
                              type="button"
                              onClick={() => setLogoUrl('')}
                              style={{ padding: '6px 10px', fontSize: 11, fontWeight: 600, borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: '#64748B' }}>
                          Accepts PNG, SVG, JPG, WebP. Displayed prominently across hosted checkout pages and receipt emails.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Brand Colors (Primary & Secondary / Accent) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B' }}>
                      2. Brand Palette (Primary & Secondary Accent)
                    </span>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div style={{ background: '#FAFBFD', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#1E293B' }}>Primary Brand Color</label>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 3, padding: '1px 5px' }}>REQUIRED</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={e => setPrimaryColor(e.target.value)}
                            style={{ width: 38, height: 34, border: '1px solid #CBD5E1', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                          />
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={e => setPrimaryColor(e.target.value)}
                            style={{ height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 8px', fontSize: 12, fontFamily: 'monospace', width: '100%', background: '#fff', color: '#0F172A', fontWeight: 600 }}
                          />
                        </div>
                        <span style={{ display: 'block', fontSize: 10, color: '#64748B', marginTop: 6 }}>
                          Applied to checkout header banner, active payment method ring, and CTA button.
                        </span>
                      </div>

                      <div style={{ background: '#FAFBFD', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#1E293B' }}>Secondary / Accent Color</label>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748B', background: '#F1F5F9', borderRadius: 3, padding: '1px 5px' }}>OPTIONAL</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            type="color"
                            value={secondaryColor}
                            onChange={e => setSecondaryColor(e.target.value)}
                            style={{ width: 38, height: 34, border: '1px solid #CBD5E1', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                          />
                          <input
                            type="text"
                            value={secondaryColor}
                            onChange={e => setSecondaryColor(e.target.value)}
                            style={{ height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 8px', fontSize: 12, fontFamily: 'monospace', width: '100%', background: '#fff', color: '#0F172A', fontWeight: 600 }}
                          />
                        </div>
                        <span style={{ display: 'block', fontSize: 10, color: '#64748B', marginTop: 6 }}>
                          Applied to badges, secondary trim stripes, and contrast hero gradients.
                        </span>
                      </div>
                    </div>

                    {/* Quick Palettes */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase' }}>Presets:</span>
                      {[
                        { label: 'bldr Red', p: '#D10721', s: '#12203C' },
                        { label: 'StudyHub Green', p: '#2E6F5E', s: '#12203C' },
                        { label: 'Apex Blue', p: '#2C5F9E', s: '#1B2A4A' },
                        { label: 'El Hesa Gold', p: '#B8860B', s: '#12203C' },
                        { label: 'Career Violet', p: '#7A4CA0', s: '#1B2A4A' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(preset.p);
                            setSecondaryColor(preset.s);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '3px 8px',
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: 5,
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: preset.p }}></span>
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Pre-built Layout Variants */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B' }}>
                        3. Pre-Built Layout Variants (Curated Templated Selection)
                      </span>
                      <span style={{ fontSize: 10.5, color: '#2E6F5E', fontWeight: 700 }}>
                        3 Curated Variants Available
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {/* Variant A: Top-Left Modern */}
                      <div
                        onClick={() => setCheckoutLayout('top-left')}
                        style={{
                          border: checkoutLayout === 'top-left' ? '2px solid #2E6F5E' : '1px solid #E2E8F0',
                          background: checkoutLayout === 'top-left' ? '#F6FAF8' : '#FAFBFD',
                          borderRadius: 8,
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          position: 'relative',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: checkoutLayout === 'top-left' ? '#2E6F5E' : '#1E293B' }}>
                            Top-Left Modern
                          </span>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', border: checkoutLayout === 'top-left' ? '4px solid #2E6F5E' : '2px solid #CBD5E1', background: '#fff' }}></span>
                        </div>

                        {/* Miniature layout diagram */}
                        <div style={{ height: 42, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 5, padding: '5px 7px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, background: primaryColor }}></div>
                          <div style={{ width: 36, height: 6, background: '#CBD5E1', borderRadius: 2 }}></div>
                          <div style={{ flex: 1 }}></div>
                          <div style={{ width: 18, height: 6, background: '#E2E8F0', borderRadius: 2 }}></div>
                        </div>

                        <span style={{ fontSize: 10.5, color: '#64748B', lineHeight: 1.35 }}>
                          Clean minimal header with brand logo on the left and verified trust mark on the right.
                        </span>
                      </div>

                      {/* Variant B: Top-Center Classic */}
                      <div
                        onClick={() => setCheckoutLayout('top-center')}
                        style={{
                          border: checkoutLayout === 'top-center' ? '2px solid #2E6F5E' : '1px solid #E2E8F0',
                          background: checkoutLayout === 'top-center' ? '#F6FAF8' : '#FAFBFD',
                          borderRadius: 8,
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          position: 'relative',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: checkoutLayout === 'top-center' ? '#2E6F5E' : '#1E293B' }}>
                            Top-Center Classic
                          </span>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', border: checkoutLayout === 'top-center' ? '4px solid #2E6F5E' : '2px solid #CBD5E1', background: '#fff' }}></span>
                        </div>

                        {/* Miniature layout diagram */}
                        <div style={{ height: 42, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 5, padding: '5px 7px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                          <div style={{ width: 14, height: 14, borderRadius: 3, background: primaryColor }}></div>
                          <div style={{ width: 44, height: 5, background: '#CBD5E1', borderRadius: 2 }}></div>
                        </div>

                        <span style={{ fontSize: 10.5, color: '#64748B', lineHeight: 1.35 }}>
                          Centered prominent academy crest and centered title. Preferred for official universities & accredited institutes.
                        </span>
                      </div>

                      {/* Variant C: Split-Hero Banner */}
                      <div
                        onClick={() => setCheckoutLayout('split-hero')}
                        style={{
                          border: checkoutLayout === 'split-hero' ? '2px solid #2E6F5E' : '1px solid #E2E8F0',
                          background: checkoutLayout === 'split-hero' ? '#F6FAF8' : '#FAFBFD',
                          borderRadius: 8,
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          position: 'relative',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: checkoutLayout === 'split-hero' ? '#2E6F5E' : '#1E293B' }}>
                            Split Hero Banner
                          </span>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', border: checkoutLayout === 'split-hero' ? '4px solid #2E6F5E' : '2px solid #CBD5E1', background: '#fff' }}></span>
                        </div>

                        {/* Miniature layout diagram */}
                        <div style={{ height: 42, background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5, padding: '5px 7px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#fff' }}></div>
                          <div style={{ width: 38, height: 6, background: 'rgba(255,255,255,0.85)', borderRadius: 2 }}></div>
                          <div style={{ flex: 1 }}></div>
                          <div style={{ width: 12, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }}></div>
                        </div>

                        <span style={{ fontSize: 10.5, color: '#64748B', lineHeight: 1.35 }}>
                          Full-width hero header drenched in brand primary color with secondary color accent trim. Maximum visual presence.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scope Governance Checkbox Summary */}
                  <div style={{ background: '#FAFBFD', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#2E6F5E', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Allowed in Brand Admin Scope
                      </span>
                      <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
                        <li>Brand logo upload & positioning</li>
                        <li>Primary & secondary color tokens</li>
                        <li>3 vetted responsive layout variants</li>
                      </ul>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#DC2626', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Excluded by Security Boundary
                      </span>
                      <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
                        <li>No raw HTML / JS / stylesheet injection</li>
                        <li>No custom page structure beyond variants</li>
                        <li>Zero tampering with gateway checkout flow</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Order Numbering Card */}
                <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>Order numbering</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#B8860B', background: '#FBF3E0', borderRadius: 5, padding: '3px 7px', letterSpacing: '0.02em' }}>
                      AUTOMATIC SEQUENCING
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 13 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Prefix</span>
                      <div style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#F5F7FA', display: 'flex', alignItems: 'center', padding: '0 11px' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12.5px', fontWeight: 700, color: '#5A6A80' }}>{topBarId}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Format</span>
                      <div style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 11px' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#1B2A4A' }}>{topBarId}-{'{PRODUCT}'}-{'{SEQ}'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Sample Order ID</span>
                      <div style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#F5F7FA', display: 'flex', alignItems: 'center', padding: '0 11px' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#5A6A80' }}>{topBarId}-COURSE-4582</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Live Checkout Preview Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Live Checkout Card Preview</span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 4, padding: '2px 6px' }}>REAL-TIME</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1B2A4A', background: '#F1F5F9', borderRadius: 4, padding: '2px 6px', textTransform: 'capitalize' }}>
                      {checkoutLayout.replace('-', ' ')}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: '#64748B' }}>
                    Real-time simulation of the student-facing hosted checkout page with your chosen brand tokens and layout variant.
                  </p>

                  {/* Browser Mock Preview Container */}
                  <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
                    {/* Simulated URL bar */}
                    <div style={{ height: 26, background: '#EDF2F7', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }}></span>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }}></span>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></span>
                      <div style={{ flex: 1, background: '#FFFFFF', height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4 }}>
                        <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="#2E6F5E" strokeWidth="2"><path d="M4 7V5a4 4 0 018 0v2M3 7h10v7H3z"/></svg>
                        <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#64748B' }}>
                          pay.bldrmanagement.com/pay/{ventureCode}
                        </span>
                      </div>
                    </div>

                    {/* Variant A: Top-Center Preview */}
                    {checkoutLayout === 'top-center' && (
                      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8A94A6' }}>bldr Secure Gateway</span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#2E6F5E' }}>EN · العربية</span>
                        </div>
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: primaryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13 }}>
                            {topBarId}
                          </div>
                        )}
                        <span style={{ fontWeight: 800, color: '#1E293B', fontSize: 13, textAlign: 'center' }}>{displayName}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 999, padding: '1px 7px' }}>
                          Verified Academy Checkout
                        </span>
                      </div>
                    )}

                    {/* Variant B: Split-Hero Preview */}
                    {checkoutLayout === 'split-hero' && (
                      <div style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, borderBottom: '2px solid rgba(255,255,255,0.2)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo" style={{ height: 26, width: 'auto', borderRadius: 4, background: '#fff', padding: 2 }} />
                          ) : (
                            <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, border: '1px solid rgba(255,255,255,0.3)' }}>
                              {topBarId}
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 800, color: '#fff', fontSize: 13, lineHeight: 1.1 }}>{displayName}</span>
                            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)' }}>Verified Checkout · bldr</span>
                          </div>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#FFFFFF', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4 }}>
                          {cardWalletGateway === 'paymob' ? 'Paymob' : 'Geidea'}
                        </span>
                      </div>
                    )}

                    {/* Variant C: Top-Left Preview (Default) */}
                    {checkoutLayout === 'top-left' && (
                      <div style={{ background: primaryColor, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo" style={{ height: 24, width: 'auto', borderRadius: 4, background: '#fff', padding: 2 }} />
                          ) : (
                            <div style={{ width: 24, height: 24, borderRadius: 5, background: '#fff', color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11 }}>
                              {topBarId}
                            </div>
                          )}
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>{displayName}</span>
                        </div>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 4 }}>
                          Powered by {cardWalletGateway === 'paymob' ? 'Paymob' : 'Geidea'}
                        </span>
                      </div>
                    )}

                    {/* Common Checkout Order Summary & Methods Body */}
                    <div style={{ padding: '16px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#64748B' }}>Cohort Access — Term 1</span>
                        <strong style={{ fontSize: 13, color: '#0F172A' }}>750.00 EGP</strong>
                      </div>

                      {/* Top-Level Choice (Pay Online vs Activate Code) */}
                      {codeActivationEnabled && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: '#F1F5F9', padding: 3, borderRadius: 6, marginTop: 4 }}>
                          <div style={{ background: '#FFFFFF', padding: '4px', borderRadius: 4, textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#0F172A', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            💳 Pay Online
                          </div>
                          <div style={{ padding: '4px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: primaryColor }}>
                            🎟️ Activate Code
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <div style={{ flex: 1, padding: '8px 6px', borderRadius: 6, border: `2px solid ${primaryColor}`, background: '#F8FAFC', textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: primaryColor }}>
                          1. Card
                        </div>
                        <div style={{ flex: 1, padding: '8px 6px', borderRadius: 6, border: '1px solid #E2E8F0', textAlign: 'center', fontSize: 10.5, fontWeight: 600, color: '#64748B' }}>
                          2. Mobile Wallet
                        </div>
                        {fawryEnabled && (
                          <div style={{ flex: 1, padding: '8px 6px', borderRadius: 6, border: '1px solid #E2E8F0', textAlign: 'center', fontSize: 10.5, fontWeight: 600, color: '#64748B' }}>
                            3. Fawry Code
                          </div>
                        )}
                      </div>

                      {/* Pay CTA Button Simulation */}
                      <div style={{ marginTop: 6, background: primaryColor, borderRadius: 6, padding: '8px', textAlign: 'center', color: '#FFFFFF', fontSize: 11, fontWeight: 800 }}>
                        Pay 750.00 EGP Securely
                      </div>
                    </div>
                  </div>

                  {/* Open Live Hosted Checkout Link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>Want to test this live in browser?</span>
                    <a
                      href={`/pay/cs_preview_${ventureCode}?venture=${ventureCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      Open Live Checkout Page &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 2: Domains & apps
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'domains' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 16, alignItems: 'start' }}>
              {/* Authorized Domains & Apps Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em', flex: 1 }}>
                    Authorized domains &amp; calling apps
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const host = prompt('Enter authorized domain or origin (e.g. pay.domain.eg):');
                      if (host) {
                        setDomains([...domains, { host, state: 'Pending DNS', fg: '#B8860B', bg: '#FBF3E0' }]);
                      }
                    }}
                    style={{ fontSize: 11, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', border: 'none', borderRadius: 5, padding: '4px 9px', cursor: 'pointer' }}
                  >
                    + Add Domain
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#64748B' }}>
                  Payment-intent requests are only accepted when dispatched from origins matching these authorized domains.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {domains.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', border: '1px solid #E3E8EF', borderRadius: 8, background: '#FAFBFD' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#1B2A4A', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.host}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: d.fg, background: d.bg, borderRadius: 20, padding: '3px 8px', letterSpacing: '0.02em', flex: 'none' }}>
                        {d.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DNS Verification Guide Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>DNS Verification Instructions</span>
                <p style={{ margin: 0, fontSize: 11.5, color: '#64748B', lineHeight: 1.55 }}>
                  To mark a domain as <strong>Verified</strong>, create a TXT record at your DNS provider (e.g. Cloudflare, GoDaddy):
                </p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', fontFamily: 'monospace', fontSize: 11 }}>
                  <div><strong>Type:</strong> TXT</div>
                  <div><strong>Name:</strong> _bldr-challenge</div>
                  <div><strong>Value:</strong> bldr-verify={ventureCode}-9481a</div>
                </div>
                <span style={{ fontSize: 10.5, color: '#8A94A6' }}>
                  bldr scans DNS records hourly. Once detected, the domain status automatically switches to Verified.
                </span>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 3: URLs & webhooks
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'urls' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 16, alignItems: 'start' }}>
              {/* Endpoints & Support Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>
                  Endpoints &amp; Redirect URLs
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Return URL (Success redirect after payment)', value: returnUrl, onChange: setReturnUrl, tip: 'Where students return after successful bank acquiring.' },
                    { label: 'Cancel URL (Student aborts checkout)', value: cancelUrl, onChange: setCancelUrl, tip: 'Where students return if they decline or cancel payment.' },
                    { label: 'Webhook Destination URL (bldr -> venture)', value: webhookUrl, onChange: setWebhookUrl, tip: 'Your backend endpoint that handles order.paid and fawry.ref events.' },
                    { label: 'Customer Support Email', value: supportEmail, onChange: setSupportEmail, tip: 'Displayed to customers on payment errors and receipts.' },
                  ].map((e, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        {e.label}
                      </span>
                      <input
                        type="text"
                        value={e.value}
                        onChange={ev => e.onChange(ev.target.value)}
                        style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#fff', padding: '0 10px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11.5, color: '#1B2A4A', width: '100%', boxSizing: 'border-box' }}
                      />
                      <span style={{ fontSize: 10.5, color: '#8A94A6' }}>{e.tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook HMAC Signing Security Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Webhook HMAC Verification</span>
                <p style={{ margin: 0, fontSize: 11.5, color: '#64748B', lineHeight: 1.55 }}>
                  All webhook requests dispatched by bldr contain an <code>X-BLDR-Signature</code> header signed with SHA-256 HMAC:
                </p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B' }}>WEBHOOK SECRET:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <code style={{ fontSize: 11, color: '#1B2A4A', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{webhookSecret}</code>
                    <button
                      type="button"
                      onClick={() => handleCopy(webhookSecret, 'whsec')}
                      style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, border: '1px solid #CBD5E1', background: '#fff', cursor: 'pointer' }}
                    >
                      {copiedKey === 'whsec' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Test webhook ping sent to ${webhookUrl} with test payload.`)}
                  style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #2E6F5E', background: '#E6EFEB', color: '#2E6F5E', fontWeight: 700, fontSize: 11.5, cursor: 'pointer', marginTop: 4 }}
                >
                  Send Test Webhook Ping
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 4: Payment methods
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'methods' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960 }}>
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1B2A4A' }}>Gateway &amp; Payment Methods</span>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748B' }}>
                      Configure which Egyptian acquiring rails and gateways process payments for this venture.
                    </p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#2C5F9E', background: '#E8EEF7', borderRadius: 5, padding: '3px 7px' }}>
                    {cardWalletGateway.toUpperCase()}{fawryEnabled ? ' + FAWRY' : ''}
                  </span>
                </div>

                {/* Gateway Rail Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                    Card &amp; Mobile Wallet Gateway — One per brand
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { id: 'geidea', label: 'Geidea Egypt', desc: 'Acquiring via Geidea Payment Gateway with 3D-Secure 2.0 and Vodafone/Orange/Etisalat wallets.' },
                      { id: 'paymob', label: 'Paymob Egypt (Accept)', desc: 'Acquiring via Paymob gateway integration with direct mobile wallet carrier settlement.' },
                    ].map(g => (
                      <div
                        key={g.id}
                        onClick={() => setCardWalletGateway(g.id as any)}
                        style={{
                          border: cardWalletGateway === g.id ? '2px solid #2E6F5E' : '1px solid #E2E8F0',
                          background: cardWalletGateway === g.id ? '#F2F7F5' : '#FAFBFD',
                          borderRadius: 8,
                          padding: '12px 14px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <strong style={{ fontSize: 13, color: '#0F172A' }}>{g.label}</strong>
                          {cardWalletGateway === g.id && <span style={{ color: '#2E6F5E', fontWeight: 800 }}>✓ Active</span>}
                        </div>
                        <span style={{ fontSize: 11, color: '#64748B' }}>{g.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fawry Independent Rail Toggle */}
                <div style={{ borderTop: '1px solid #EEF1F5', paddingTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: 13, color: '#1B2A4A' }}>Fawry Pay Cash Reference Codes</strong>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748B' }}>
                        Enables cash payments at over 250,000 retail kiosks across Egypt with a 48-hour payment window.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFawryEnabled(!fawryEnabled)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: 'none',
                        background: fawryEnabled ? '#059669' : '#CBD5E1',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 11.5,
                        cursor: 'pointer',
                      }}
                    >
                      {fawryEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {/* Physical / Offline Activation Code Rail Toggle */}
                <div style={{ borderTop: '1px solid #EEF1F5', paddingTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 13, color: '#1B2A4A' }}>Physical / Offline Activation Codes</strong>
                        <span style={{ fontSize: 10, fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '1px 6px', borderRadius: 4 }}>
                          Offline Rail
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#64748B' }}>
                        Shows top-level choice on hosted checkout between &ldquo;Pay Online&rdquo; and &ldquo;Activate a Code&rdquo;. Enables students with scratch cards or center serials to enroll instantly with zero gateway fees.
                      </p>
                    </div>
                    <button
                      type="button"
                      id="toggle-code-activation"
                      onClick={() => setCodeActivationEnabled(!codeActivationEnabled)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: 'none',
                        background: codeActivationEnabled ? '#059669' : '#CBD5E1',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 11.5,
                        cursor: 'pointer',
                      }}
                    >
                      {codeActivationEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 4B: Activation Codes Management
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'codes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1080 }}>
              {/* Header card with actions */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#1B2A4A' }}>
                        Activation Codes &amp; Physical Serials
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, background: '#E6EFEB', color: '#2E6F5E', padding: '2px 6px', borderRadius: 4 }}>
                        {topBarId} CODES
                      </span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748B' }}>
                      Pre-loaded serials and vouchers for physical stores, centers, and private tutors. Redeemed at checkout with zero gateway fees.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={handleExportCodesCSV}
                      style={{
                        height: 34,
                        padding: '0 12px',
                        borderRadius: 6,
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>📥</span> Export CSV
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      style={{
                        height: 34,
                        padding: '0 12px',
                        borderRadius: 6,
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>📄</span> Bulk Import
                    </button>

                    <button
                      type="button"
                      id="btn-gen-batch-hub"
                      onClick={() => setShowGenModal(true)}
                      style={{
                        height: 34,
                        padding: '0 14px',
                        borderRadius: 6,
                        background: '#2E6F5E',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>➕</span> Generate Batch
                    </button>
                  </div>
                </div>

                {/* 4 Summary KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div style={{ background: '#FAFBFD', border: '1px solid #E3E8EF', borderRadius: 8, padding: '12px 14px' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase' }}>Total Issued</span>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#1B2A4A', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>
                      {ventureCodes.length}
                    </div>
                  </div>
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '12px 14px' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Unused / Available</span>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#15803D', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>
                      {ventureCodes.filter(c => c.status === 'UNUSED').length}
                    </div>
                  </div>
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '12px 14px' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>Redeemed &amp; Enrolled</span>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#2563EB', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>
                      {ventureCodes.filter(c => c.status === 'USED').length}
                    </div>
                  </div>
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 14px' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>Voided / Expired</span>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#DC2626', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>
                      {ventureCodes.filter(c => c.status === 'VOID' || c.status === 'EXPIRED').length}
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FAFBFD', padding: '10px 12px', borderRadius: 8, border: '1px solid #E3E8EF' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Search code, serial, student, product..."
                      value={codeSearch}
                      onChange={e => setCodeSearch(e.target.value)}
                      style={{
                        width: '100%',
                        height: 32,
                        padding: '0 10px',
                        borderRadius: 6,
                        border: '1px solid #CBD5E1',
                        fontSize: 12,
                        outline: 'none',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>

                  <select
                    value={codeStatusFilter}
                    onChange={e => setCodeStatusFilter(e.target.value)}
                    style={{ height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 11.5, background: '#FFFFFF' }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="UNUSED">Unused</option>
                    <option value="USED">Redeemed</option>
                    <option value="VOID">Voided</option>
                    <option value="EXPIRED">Expired</option>
                  </select>

                  <select
                    value={codeSourceFilter}
                    onChange={e => setCodeSourceFilter(e.target.value)}
                    style={{ height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 11.5, background: '#FFFFFF' }}
                  >
                    <option value="ALL">All Sources</option>
                    <option value="CENTER">Center</option>
                    <option value="TUTOR">Tutor</option>
                    <option value="PHYSICAL_STORE">Physical Store</option>
                    <option value="BATCH_DISTRIBUTION">Batch Event</option>
                  </select>
                </div>

                {/* Table */}
                <div style={{ border: '1px solid #E3E8EF', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: '#FAFBFD', borderBottom: '1px solid #E3E8EF', color: '#64748B' }}>
                        <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: 11 }}>CODE / SERIAL</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: 11 }}>COURSE</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: 11 }}>CHANNEL</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: 11 }}>STATUS</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: 11 }}>REDEMPTION</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700, fontSize: 11, textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventureCodes
                        .filter(c => {
                          const matchesS =
                            !codeSearch ||
                            c.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
                            (c.serial && c.serial.toLowerCase().includes(codeSearch.toLowerCase())) ||
                            (c.redeemedByName && c.redeemedByName.toLowerCase().includes(codeSearch.toLowerCase())) ||
                            (c.productName && c.productName.toLowerCase().includes(codeSearch.toLowerCase()));
                          const matchesStat = codeStatusFilter === 'ALL' || c.status === codeStatusFilter;
                          const matchesSrc = codeSourceFilter === 'ALL' || c.source === codeSourceFilter;
                          return matchesS && matchesStat && matchesSrc;
                        })
                        .map(item => {
                          const isUnused = item.status === 'UNUSED';
                          const isUsed = item.status === 'USED';
                          const isVoid = item.status === 'VOID';

                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid #EEF1F5' }}>
                              <td style={{ padding: '10px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span
                                    style={{
                                      fontFamily: 'IBM Plex Mono, monospace',
                                      fontWeight: 700,
                                      fontSize: 12.5,
                                      color: isVoid ? '#94A3B8' : '#0F172A',
                                      textDecoration: isVoid ? 'line-through' : 'none',
                                    }}
                                  >
                                    {item.code}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCode(item.code)}
                                    title="Copy Code"
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, color: copiedCodeFeedback === item.code ? '#16A34A' : '#94A3B8' }}
                                  >
                                    {copiedCodeFeedback === item.code ? '✓' : '📋'}
                                  </button>
                                </div>
                                {item.serial && (
                                  <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'IBM Plex Mono, monospace' }}>
                                    {item.serial}
                                  </div>
                                )}
                              </td>

                              <td style={{ padding: '10px 14px', color: '#1B2A4A', fontWeight: 600 }}>
                                {item.productName || item.productId}
                              </td>

                              <td style={{ padding: '10px 14px' }}>
                                <span style={{ fontSize: 10.5, fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: 4 }}>
                                  {item.source || 'CENTER'}
                                </span>
                              </td>

                              <td style={{ padding: '10px 14px' }}>
                                {isUnused && (
                                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#DCFCE7', color: '#15803D' }}>
                                    UNUSED
                                  </span>
                                )}
                                {isUsed && (
                                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#DBEAFE', color: '#1D4ED8' }}>
                                    REDEEMED
                                  </span>
                                )}
                                {isVoid && (
                                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#FEE2E2', color: '#B91C1C' }}>
                                    VOID
                                  </span>
                                )}
                              </td>

                              <td style={{ padding: '10px 14px' }}>
                                {isUsed ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 11.5 }}>
                                      {item.redeemedByName || 'Student'}
                                    </span>
                                    <span style={{ fontSize: 10.5, color: '#64748B' }}>
                                      {item.redeemedByEmail} • {item.redeemedAt?.slice(0, 10)}
                                    </span>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 11, color: '#94A3B8' }}>—</span>
                                )}
                              </td>

                              <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                {isUnused && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCodeStatus(item.code, item.status)}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid #FECACA',
                                      color: '#DC2626',
                                      borderRadius: 4,
                                      padding: '2px 8px',
                                      fontSize: 11,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Void
                                  </button>
                                )}
                                {isVoid && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCodeStatus(item.code, item.status)}
                                    style={{
                                      background: 'transparent',
                                      border: '1px solid #CBD5E1',
                                      color: '#475569',
                                      borderRadius: 4,
                                      padding: '2px 8px',
                                      fontSize: 11,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Restore
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Generate Modal */}
              {showGenModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                  <div style={{ background: '#fff', borderRadius: 12, width: 440, padding: 22, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <strong style={{ fontSize: 15, color: '#0F172A' }}>Generate Activation Codes</strong>
                      <button type="button" onClick={() => setShowGenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
                    </div>

                    <form onSubmit={handleGenerateBatch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Quantity</label>
                        <input type="number" min="1" max="200" value={genCount} onChange={e => setGenCount(Number(e.target.value))} style={{ width: '100%', height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 10px', fontSize: 12.5 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Prefix</label>
                        <input type="text" value={genPrefix} onChange={e => setGenPrefix(e.target.value.toUpperCase())} style={{ width: '100%', height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 10px', fontSize: 12.5, fontFamily: 'IBM Plex Mono, monospace' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Course Name</label>
                        <input type="text" value={genProduct} onChange={e => setGenProduct(e.target.value)} style={{ width: '100%', height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 10px', fontSize: 12.5 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Offline Channel Source</label>
                        <select value={genSource} onChange={e => setGenSource(e.target.value as any)} style={{ width: '100%', height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 10px', fontSize: 12.5 }}>
                          <option value="CENTER">Center / Learning Academy</option>
                          <option value="TUTOR">Private Tutor</option>
                          <option value="PHYSICAL_STORE">Physical Store / Bookstore</option>
                          <option value="BATCH_DISTRIBUTION">General Event / Conference</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="button" onClick={() => setShowGenModal(false)} style={{ flex: 1, height: 36, border: '1px solid #CBD5E1', borderRadius: 6, background: '#fff', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" disabled={isGenerating} style={{ flex: 1, height: 36, border: 'none', borderRadius: 6, background: '#2E6F5E', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                          {isGenerating ? 'Generating...' : `Generate ${genCount} Codes`}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Bulk Upload Modal */}
              {showUploadModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                  <div style={{ background: '#fff', borderRadius: 12, width: 480, padding: 22, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <strong style={{ fontSize: 15, color: '#0F172A' }}>Bulk Import Activation Codes (CSV)</strong>
                      <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
                    </div>

                    <form onSubmit={handleBulkUpload} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Paste Codes (One per line)</label>
                        <textarea rows={5} value={csvText} onChange={e => setCsvText(e.target.value)} placeholder={`SH-2026-F101\nSH-2026-F102\nSH-2026-F103`} style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: 6, padding: 8, fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Course Name</label>
                          <input type="text" value={csvProduct} onChange={e => setCsvProduct(e.target.value)} style={{ width: '100%', height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 10px', fontSize: 12 }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Channel Source</label>
                          <select value={csvSource} onChange={e => setCsvSource(e.target.value as any)} style={{ width: '100%', height: 34, border: '1px solid #CBD5E1', borderRadius: 6, padding: '0 10px', fontSize: 12 }}>
                            <option value="CENTER">Center</option>
                            <option value="TUTOR">Tutor</option>
                            <option value="PHYSICAL_STORE">Physical Store</option>
                            <option value="BATCH_DISTRIBUTION">Batch Event</option>
                          </select>
                        </div>
                      </div>

                      {csvResult && (
                        <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 6, padding: 8, fontSize: 12, color: '#166534', fontWeight: 600 }}>
                          Imported {csvResult.imported} codes ({csvResult.duplicates} duplicates skipped).
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="button" onClick={() => setShowUploadModal(false)} style={{ flex: 1, height: 36, border: '1px solid #CBD5E1', borderRadius: 6, background: '#fff', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ flex: 1, height: 36, border: 'none', borderRadius: 6, background: '#2E6F5E', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                          Import Codes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 5: Limits
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'limits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960 }}>
              {/* Platform Fee & Settlement Policy Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Platform Fee &amp; Settlement Policy</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 5, padding: '3px 7px' }}>
                    APPLIED AT SETTLEMENT
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 11.5, color: '#64748B' }}>
                  bldr charges each brand an internal platform fee at settlement. Applied before net provider transfer is calculated.
                </p>

                {/* Integration Mode */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                    Integration Mode
                  </span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { v: 'NATIVE', label: 'Model A — Native storefront & CRM', hint: 'Brand uses bldr\'s own apps' },
                      { v: 'BOLT_ON', label: 'Model B — External LMS bolt-on', hint: 'Brand uses checkout-session API' },
                    ].map(opt => (
                      <div
                        key={opt.v}
                        onClick={() => setIntegrationMode(opt.v as any)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          border: integrationMode === opt.v ? '2px solid #2E6F5E' : '1px solid #E3E8EF',
                          background: integrationMode === opt.v ? '#F2F7F5' : '#fff',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0F172A' }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{opt.hint}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee Pricing Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', marginBottom: 4 }}>
                      Platform Fee Model
                    </label>
                    <select
                      value={platformFeeModel}
                      onChange={e => setPlatformFeeModel(e.target.value as any)}
                      style={{ height: 36, width: '100%', border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 8px', fontSize: 12, fontWeight: 600 }}
                    >
                      <option value="PERCENTAGE">PERCENTAGE (e.g. 3.0%)</option>
                      <option value="FLAT_PER_TXN">FLAT_PER_TXN (Fixed EGP)</option>
                      <option value="COMBINED">COMBINED (% + Flat)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', marginBottom: 4 }}>
                      Fee Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={platformFeePct}
                      onChange={e => setPlatformFeePct(e.target.value)}
                      style={{ height: 36, width: '100%', boxSizing: 'border-box', border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 8px', fontSize: 13, fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', marginBottom: 4 }}>
                      Settlement Cycle
                    </label>
                    <select
                      value={payoutCadence}
                      onChange={e => setPayoutCadence(e.target.value as any)}
                      style={{ height: 36, width: '100%', border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 8px', fontSize: 12, fontWeight: 600 }}
                    >
                      <option value="weekly">Weekly Batch (Fridays)</option>
                      <option value="biweekly">Bi-weekly Batch</option>
                      <option value="monthly">Monthly Batch</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', marginBottom: 4 }}>
                      Rolling Reserve (%)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      defaultValue={5.0}
                      style={{ height: 36, width: '100%', boxSizing: 'border-box', border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 8px', fontSize: 13, fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Transaction Limits & Velocity Card */}
                <div style={{ borderTop: '1px solid #EEF1F5', paddingTop: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#1B2A4A', display: 'block', marginBottom: 10 }}>Transaction Limits (EGP)</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', marginBottom: 4 }}>Min per transaction</label>
                      <div style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#F8FAFC', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, fontWeight: 700, color: '#1B2A4A' }}>
                        EGP 50.00
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', marginBottom: 4 }}>Max per transaction</label>
                      <div style={{ height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#F8FAFC', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, fontWeight: 700, color: '#1B2A4A' }}>
                        EGP 50,000.00
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 6: API keys
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'keys' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960 }}>
              {/* API Keys & Gateway Credentials Card */}
              <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1B2A4A' }}>
                      API Keys &amp; Gateway Credentials
                    </span>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B' }}>
                      Authenticate backend session creations (`POST /v1/checkout/sessions`) and webhook events.
                    </p>
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 5, padding: '3px 8px' }}>
                    BRAND: {ventureCode.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                  {/* Sandbox Secret Key */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Sandbox Secret Key (Test Mode)
                      </span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#B8860B', background: '#FDF7E7', borderRadius: 4, padding: '1px 6px' }}>
                        Server-to-Server Only
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#FAFBFD', display: 'flex', alignItems: 'center', padding: '0 11px', overflow: 'hidden' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#1B2A4A' }}>
                          {apiKeyTest}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(apiKeyTest, 'sk_test')}
                        style={{ height: 36, padding: '0 14px', borderRadius: 7, border: '1px solid #C8DDD7', background: copiedKey === 'sk_test' ? '#E6EFEB' : '#fff', color: '#2E6F5E', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {copiedKey === 'sk_test' ? '✓ Copied' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  {/* Live Production Secret Key */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Live Secret Key (Production Mode)
                      </span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#059669', background: '#ECFDF5', borderRadius: 4, padding: '1px 6px' }}>
                        Live Production
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#FAFBFD', display: 'flex', alignItems: 'center', padding: '0 11px', overflow: 'hidden' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#1B2A4A' }}>
                          {apiKeyLive}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(apiKeyLive, 'sk_live')}
                        style={{ height: 36, padding: '0 14px', borderRadius: 7, border: '1px solid #C8DDD7', background: copiedKey === 'sk_live' ? '#E6EFEB' : '#fff', color: '#2E6F5E', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {copiedKey === 'sk_live' ? '✓ Copied' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  {/* Webhook Secret */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Outbound Webhook Secret (HMAC Signature)
                      </span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#5A6A80' }}>
                        X-BLDR-Signature
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 36, border: '1px solid #E3E8EF', borderRadius: 7, background: '#FAFBFD', display: 'flex', alignItems: 'center', padding: '0 11px', overflow: 'hidden' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#5A6A80' }}>
                          {webhookSecret}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(webhookSecret, 'whsec')}
                        style={{ height: 36, padding: '0 14px', borderRadius: 7, border: '1px solid #C8DDD7', background: copiedKey === 'whsec' ? '#E6EFEB' : '#fff', color: '#2E6F5E', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {copiedKey === 'whsec' ? '✓ Copied' : 'Copy Secret'}
                      </button>
                    </div>
                  </div>

                  {/* Quickstart Snippet */}
                  <div style={{ marginTop: 8, padding: '12px 14px', background: '#0F172A', borderRadius: 8, color: '#E2E8F0', fontFamily: 'monospace', fontSize: 11 }}>
                    <div style={{ color: '#94A3B8', marginBottom: 6 }}># Create a checkout session via cURL:</div>
                    <div style={{ color: '#38BDF8' }}>curl -X POST http://localhost:4000/v1/checkout/sessions \</div>
                    <div style={{ paddingLeft: 12, color: '#F1F5F9' }}>-H &quot;Authorization: Bearer {apiKeyTest}&quot; \</div>
                    <div style={{ paddingLeft: 12, color: '#F1F5F9' }}>-H &quot;Content-Type: application/json&quot; \</div>
                    <div style={{ paddingLeft: 12, color: '#F1F5F9' }}>-d &apos;&#123;&quot;amount&quot;: 75000, &quot;currency&quot;: &quot;EGP&quot;, &quot;productName&quot;: &quot;Course Tuition&quot;&#125;&apos;</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
