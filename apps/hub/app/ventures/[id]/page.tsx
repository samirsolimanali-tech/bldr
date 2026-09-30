'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import HubSidebar from '../../../components/HubSidebar';
import HubTopBar from '../../../components/HubTopBar';

type TabType = 'profile' | 'domains' | 'urls' | 'methods' | 'limits' | 'keys';

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
    integrationMode: 'NATIVE',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
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
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
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
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'paymob',
    fawryEnabled: false,
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
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'geidea',
    fawryEnabled: true,
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
    integrationMode: 'BOLT_ON',
    cardWalletGateway: 'geidea',
    fawryEnabled: false,
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
    { id: 'cards', label: 'Cards (Visa, MC, Meeza)', fg: '#2E6F5E', bg: '#E6EFEB', bd: '#A8D5C8', enabled: true },
    { id: 'wallets', label: 'Mobile Wallets', fg: '#2E6F5E', bg: '#E6EFEB', bd: '#A8D5C8', enabled: true },
    { id: 'fawry', label: 'Fawry Pay', fg: '#2E6F5E', bg: '#E6EFEB', bd: '#A8D5C8', enabled: true },
    { id: 'installments', label: 'ValU / Installments', fg: '#5A6A80', bg: '#F5F7FA', bd: '#E3E8EF', enabled: false },
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
        setLogoUrl(p.logoUrl !== undefined ? p.logoUrl : (config.logoUrl || ''));
        setIntegrationMode(p.integrationMode || config.integrationMode);
        setCardWalletGateway(p.cardWalletGateway || config.cardWalletGateway);
        setFawryEnabled(p.fawryEnabled ?? config.fawryEnabled);
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
    setLogoUrl(config.logoUrl || '');
    setIntegrationMode(config.integrationMode);
    setCardWalletGateway(config.cardWalletGateway);
    setFawryEnabled(config.fawryEnabled);
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
        logoUrl,
        integrationMode,
        cardWalletGateway,
        fawryEnabled,
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

                {/* Branding Card */}
                <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, padding: '17px 19px 19px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.02em' }}>Branding</span>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Logo
                      </span>
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
                          width: 88,
                          height: 88,
                          border: isDragging ? '2px dashed #2E6F5E' : (logoUrl ? '1px solid #D0D7E2' : '1px dashed #C9D2DE'),
                          borderRadius: 9,
                          background: isDragging ? '#F0F6F4' : '#FAFBFD',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          padding: logoUrl ? 6 : 0,
                        }}
                        title="Click or drag image to upload logo"
                      >
                        {logoUrl ? (
                          <>
                            <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                              Change
                            </div>
                          </>
                        ) : (
                          <>
                            <span style={{ width: 34, height: 34, borderRadius: 7, background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 12, fontWeight: 800 }}>
                              {topBarId}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#2E6F5E' }}>Upload</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>
                        Brand Colors
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>Primary Color</label>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                              type="color"
                              value={primaryColor}
                              onChange={e => setPrimaryColor(e.target.value)}
                              style={{ width: 36, height: 34, border: '1px solid #E3E8EF', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                            />
                            <input
                              type="text"
                              value={primaryColor}
                              onChange={e => setPrimaryColor(e.target.value)}
                              style={{ height: 34, border: '1px solid #E3E8EF', borderRadius: 6, padding: '0 8px', fontSize: 11.5, fontFamily: 'monospace', width: '100%' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>Secondary / Accent</label>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                              type="color"
                              value={secondaryColor}
                              onChange={e => setSecondaryColor(e.target.value)}
                              style={{ width: 36, height: 34, border: '1px solid #E3E8EF', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                            />
                            <input
                              type="text"
                              value={secondaryColor}
                              onChange={e => setSecondaryColor(e.target.value)}
                              style={{ height: 34, border: '1px solid #E3E8EF', borderRadius: 6, padding: '0 8px', fontSize: 11.5, fontFamily: 'monospace', width: '100%' }}
                            />
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '10.5px', color: '#8A94A6', marginTop: 4 }}>
                        Applied to the brand banner, payment buttons, and trust badges on hosted checkout.
                      </span>
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
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1B2A4A' }}>Live Checkout Card Preview</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', borderRadius: 4, padding: '2px 6px' }}>REAL-TIME</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: '#64748B' }}>
                    How your brand logo, name, and primary accent render for students on the 1st checkout page.
                  </p>

                  <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
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

                    <div style={{ padding: '16px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2E8F0', paddingBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#64748B' }}>Math Cohort 2026</span>
                        <strong style={{ fontSize: 13, color: '#0F172A' }}>750.00 EGP</strong>
                      </div>
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
                    </div>
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
              </div>
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
                      Payout Cadence
                    </label>
                    <select
                      value={payoutCadence}
                      onChange={e => setPayoutCadence(e.target.value as any)}
                      style={{ height: 36, width: '100%', border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 8px', fontSize: 12, fontWeight: 600 }}
                    >
                      <option value="weekly">Weekly (Tuesdays)</option>
                      <option value="daily">Daily Batch</option>
                      <option value="manual">Manual On-Demand</option>
                    </select>
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
