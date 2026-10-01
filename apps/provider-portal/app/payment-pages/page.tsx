'use client';

import React, { useState, useRef, useEffect } from 'react';
import ProviderSidebar from '../../components/Sidebar';
import {
  getMasterBlueprints,
  getBrandCheckoutConfig,
  saveBrandCheckoutConfig,
} from '../../lib/checkout-studio';
import { CheckoutTemplateBlueprint } from '@bldr/shared-types';
import {
  FawryLogo,
  VodafoneCashLogo,
  OrangeCashLogo,
  EtisalatCashLogo,
  WePayLogo,
  VisaLogo,
  MastercardLogo,
  GeideaLogo,
  PaymobLogo,
  CbeComplianceBadge,
  PciDssBadge,
  SslBadge,
  BRAND_LOGO_PRESETS,
  BrandLogoPreset,
} from '../../components/PaymentLogos';

/* ─── Interfaces ─── */
interface MasterCheckoutTemplate {
  providerName: string;
  providerLogoText: string;
  providerLogoUrl?: string;
  showLogoInHero?: boolean;
  providerSlug: string;
  accentColor: string;
  bannerStyle: 'solid' | 'gradient' | 'dark';
  supportPhone: string;
  supportEmail: string;
  gateway: 'Fawry Pay' | 'Paymob (Accept)' | 'Geidea';
  methods: {
    fawry: boolean;
    wallet: boolean;
    card: boolean;
  };
}

interface CourseItem {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  badge: string;
  badgeAr: string;
  category: string;
  duration: string;
  slug: string;
}

/* ─── Mock Data: Simulated Courses from Provider CMS ─── */
const CMS_COURSES: CourseItem[] = [
  {
    id: 'course-101',
    title: 'Full-Stack Web Development Bootcamp',
    titleAr: 'معسكر هندسة البرمجيات وتطوير الويب الشامل',
    price: 4800,
    badge: 'Early-Bird: 20% Off Active',
    badgeAr: 'خصم التسجيل المبكر 20% متاح الآن',
    category: 'Software Engineering',
    duration: '12 Weeks',
    slug: 'bootcamp-cairo-checkout',
  },
  {
    id: 'course-102',
    title: 'React & Next.js Pro Workshop',
    titleAr: 'ورشة عمل React & Next.js للمحترفين',
    price: 1850,
    badge: 'Weekend Intensive Cohort',
    badgeAr: 'ورشة مكثفة نهاية الأسبوع',
    category: 'Frontend Development',
    duration: '3 Days',
    slug: 'react-nextjs-workshop',
  },
  {
    id: 'course-103',
    title: 'Executive Tech MBA Program',
    titleAr: 'ماجستير إدارة التكنولوجيا والتحول الرقمي',
    price: 8500,
    badge: 'Accredited Cohort 2026',
    badgeAr: 'الدفعة المعتمدة لعام 2026',
    category: 'Leadership & Strategy',
    duration: '6 Months',
    slug: 'tech-mba-cairo',
  },
  {
    id: 'course-104',
    title: 'Data Science & AI Intensive',
    titleAr: 'معسكر علم البيانات والذكاء الاصطناعي',
    price: 6200,
    badge: 'Includes GPU Cloud Lab Access',
    badgeAr: 'يشمل معمل سحابي للمعالجة الرسومية',
    category: 'Data & Artificial Intelligence',
    duration: '10 Weeks',
    slug: 'data-science-ai',
  },
];

const INITIAL_MASTER_TEMPLATE: MasterCheckoutTemplate = {
  providerName: 'StudyHub Egypt',
  providerLogoText: 'SH',
  providerLogoUrl: BRAND_LOGO_PRESETS[0].svgDataUri,
  showLogoInHero: true,
  providerSlug: 'studyhub-egypt',
  accentColor: '#0EA5E9',
  bannerStyle: 'gradient',
  supportPhone: '+20 10 1234 5678',
  supportEmail: 'admissions@studyhub.eg',
  gateway: 'Geidea',
  methods: {
    fawry: true,
    wallet: true,
    card: true,
  },
};

const PRESET_COLORS = [
  { name: 'Sky Blue', hex: '#0EA5E9' },
  { name: 'Royal Purple', hex: '#7C3AED' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Bldr Crimson', hex: '#D10721' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Slate Dark', hex: '#0F172A' },
  { name: 'Deep Indigo', hex: '#4F46E5' },
];

export default function MasterCheckoutStudioPage() {
  const [template, setTemplate] = useState<MasterCheckoutTemplate>(INITIAL_MASTER_TEMPLATE);
  const [courses, setCourses] = useState<CourseItem[]>(CMS_COURSES);
  const [activeCourseId, setActiveCourseId] = useState<string>(CMS_COURSES[0].id);
  const [activeTab, setActiveTab] = useState<'BRANDING' | 'CMS_SIMULATOR' | 'CMS_GUIDE'>('BRANDING');

  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Central Hub Governed Blueprints & Venture State
  const [blueprints, setBlueprints] = useState<CheckoutTemplateBlueprint[]>([]);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>('tpl-split-academy');
  const [currentVentureId, setCurrentVentureId] = useState<string>('studyhub');

  // Load blueprints and venture config on mount
  useEffect(() => {
    const bps = getMasterBlueprints();
    setBlueprints(bps);

    const vId = (typeof window !== 'undefined' ? localStorage.getItem('bldr_venture_id') : null) || 'studyhub';
    setCurrentVentureId(vId);

    const savedConfig = getBrandCheckoutConfig(vId);
    if (savedConfig) {
      setSelectedBlueprintId(savedConfig.templateId || 'tpl-split-academy');
      setTemplate(prev => ({
        ...prev,
        providerName: savedConfig.brandName || prev.providerName,
        providerLogoText: savedConfig.brandLogoText || prev.providerLogoText,
        providerLogoUrl: savedConfig.brandLogoUrl || prev.providerLogoUrl,
        accentColor: savedConfig.accentColor || prev.accentColor,
        bannerStyle: savedConfig.bannerStyle || prev.bannerStyle,
        supportPhone: savedConfig.supportPhone || prev.supportPhone,
        supportEmail: savedConfig.supportEmail || prev.supportEmail,
        showLogoInHero: savedConfig.showLogoInHero ?? prev.showLogoInHero,
        gateway: savedConfig.connectedGateway || prev.gateway,
        methods: {
          fawry: savedConfig.activeRails.fawry,
          wallet: savedConfig.activeRails.wallet,
          card: savedConfig.activeRails.card,
        },
      }));
    }

    const handleBlueprintsUpdated = () => {
      setBlueprints(getMasterBlueprints());
    };
    window.addEventListener('bldr:blueprints-updated', handleBlueprintsUpdated);
    return () => window.removeEventListener('bldr:blueprints-updated', handleBlueprintsUpdated);
  }, []);

  const handleSelectBlueprint = (bp: CheckoutTemplateBlueprint) => {
    setSelectedBlueprintId(bp.id);
    setTemplate(prev => ({
      ...prev,
      bannerStyle: bp.headerStyle,
      accentColor: prev.accentColor || bp.defaultAccentColor,
      methods: {
        fawry: bp.allowedPaymentRails.fawry,
        wallet: bp.allowedPaymentRails.wallet,
        card: bp.allowedPaymentRails.card,
      },
    }));
  };

  // Brand Logo Customization State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  // Live Interactive Student Preview State
  const [selectedMethod, setSelectedMethod] = useState<'FAWRY' | 'WALLET' | 'CARD'>('FAWRY');
  const [studentName, setStudentName] = useState('أحمد كمال (Ahmed Kamal)');
  const [studentPhone, setStudentPhone] = useState('01023456789');
  const [studentEmail, setStudentEmail] = useState('ahmed.kamal@gmail.com');
  const [walletProvider, setWalletProvider] = useState<'Vodafone Cash' | 'InstaPay' | 'Orange Money' | 'Etisalat Cash' | 'WE Pay'>('Vodafone Cash');
  const [walletNumber, setWalletNumber] = useState('01023456789');
  const [fawryRefCode, setFawryRefCode] = useState('788-4421-9980');
  const [checkoutStep, setCheckoutStep] = useState<'SELECT' | 'REDIRECT' | 'CONFIRMED'>('SELECT');
  const [copiedRef, setCopiedRef] = useState(false);

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  // Updaters
  const updateTemplate = <K extends keyof MasterCheckoutTemplate>(key: K, value: MasterCheckoutTemplate[K]) => {
    setTemplate(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateTemplate('providerLogoUrl', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: BrandLogoPreset) => {
    updateTemplate('providerLogoUrl', preset.svgDataUri);
    updateTemplate('providerName', preset.name);
    updateTemplate('providerLogoText', preset.name.slice(0, 2).toUpperCase());
  };

  const updateMethod = (method: 'fawry' | 'wallet' | 'card', enabled: boolean) => {
    setTemplate(prev => ({
      ...prev,
      methods: { ...prev.methods, [method]: enabled },
    }));
  };

  const updateActiveCourse = <K extends keyof CourseItem>(key: K, value: CourseItem[K]) => {
    setCourses(prev => prev.map(c => c.id === activeCourse.id ? { ...c, [key]: value } : c));
  };

  const handleSave = () => {
    const bp = blueprints.find(b => b.id === selectedBlueprintId) || blueprints[0];
    saveBrandCheckoutConfig({
      ventureId: currentVentureId,
      ventureName: template.providerName,
      templateId: selectedBlueprintId,
      brandName: template.providerName,
      brandLogoText: template.providerLogoText,
      brandLogoUrl: template.providerLogoUrl || '',
      accentColor: template.accentColor,
      bannerStyle: template.bannerStyle,
      supportPhone: template.supportPhone,
      supportEmail: template.supportEmail,
      showLogoInHero: template.showLogoInHero ?? true,
      connectedGateway: template.gateway,
      activeRails: {
        fawry: template.methods.fawry,
        wallet: template.methods.wallet,
        card: template.methods.card,
        activationCode: bp?.allowedPaymentRails.activationCode ?? true,
      },
      liveSlug: template.providerSlug,
      status: 'ACTIVE',
      conversions24h: 142,
      totalVolumeEgp: 681600,
      lastCustomizedAt: new Date().toISOString(),
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const dynamicCheckoutUrl = `https://pay.bldr.io/checkout/${template.providerSlug}?course_id=${activeCourse.id}&title=${encodeURIComponent(activeCourse.title)}&amount=${activeCourse.price}`;
  const embedCode = `<iframe src="${dynamicCheckoutUrl}" width="100%" height="780px" frameborder="0" style="border:none;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12)"></iframe>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const copyFawryRef = () => {
    navigator.clipboard.writeText(fawryRefCode.replace(/-/g, ''));
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleStartCheckout = () => {
    if (selectedMethod === 'FAWRY') {
      const generated = `788-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setFawryRefCode(generated);
    }
    setCheckoutStep('REDIRECT');
  };

  const getBannerBackground = () => {
    if (template.bannerStyle === 'gradient') {
      return `linear-gradient(135deg, ${template.accentColor} 0%, #0F172A 100%)`;
    }
    if (template.bannerStyle === 'dark') {
      return '#0B0F19';
    }
    return template.accentColor;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Master Checkout Studio
              </h1>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                Governed by Central Hub
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}>
                PCI-DSS Compliant Gateway
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              Choose an approved Central Hub Master Template and personalize your brand — zero manual page building
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {saveToast && (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '6px 12px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                ✓ Changes Saved &amp; Live in Hub Monitor
              </span>
            )}
            <button
              onClick={handleSave}
              style={{ background: 'var(--brand)', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer' }}
            >
              Save Master Template
            </button>
            <button
              onClick={() => setShowEmbedModal(true)}
              style={{ background: 'white', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              Get CMS Embed / Link
            </button>
          </div>
        </header>

        {/* Global Architecture Notice Banner */}
        <div style={{ background: '#F0FDF4', borderBottom: '1px solid #BBF7D0', padding: '10px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12.5, color: '#166534' }}>
            <strong style={{ color: '#14532D' }}>Hub-Governed Workflow:</strong> Checkout layouts, Egyptian payment rails, and Central Bank compliance are engineered centrally on the Central Hub. Select an approved template from the catalog below and apply your brand identity.
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', border: '1px solid #86EFAC' }}>
            Hub-Approved Catalog
          </span>
        </div>

        <main style={{ flex: 1, padding: '24px 32px' }}>
          {/* Main Grid: Left Controls & Simulator, Right Live Dynamic Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.35fr', gap: 24, alignItems: 'start' }}>
            
            {/* ─── LEFT COLUMN: Master Theme & CMS Step Simulator ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tab Navigation */}
              <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 4 }}>
                <button
                  onClick={() => setActiveTab('BRANDING')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 7,
                    fontSize: 12.5,
                    fontWeight: 700,
                    border: 'none',
                    background: activeTab === 'BRANDING' ? 'white' : 'transparent',
                    color: activeTab === 'BRANDING' ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === 'BRANDING' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  Master Brand & Theme
                </button>
                <button
                  onClick={() => setActiveTab('CMS_SIMULATOR')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 7,
                    fontSize: 12.5,
                    fontWeight: 700,
                    border: 'none',
                    background: activeTab === 'CMS_SIMULATOR' ? 'white' : 'transparent',
                    color: activeTab === 'CMS_SIMULATOR' ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === 'CMS_SIMULATOR' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  CMS Course Simulator
                </button>
                <button
                  onClick={() => setActiveTab('CMS_GUIDE')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 7,
                    fontSize: 12.5,
                    fontWeight: 700,
                    border: 'none',
                    background: activeTab === 'CMS_GUIDE' ? 'white' : 'transparent',
                    color: activeTab === 'CMS_GUIDE' ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === 'CMS_GUIDE' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  CMS Integration Step
                </button>
              </div>

              {/* TAB 1: MASTER BRAND & THEME */}
              {activeTab === 'BRANDING' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Section 1: Choose Master Blueprint from Central Hub */}
                  <div style={{ background: 'white', borderRadius: 12, border: '2px solid #3B82F6', padding: '20px 22px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: '#0F172A' }}>
                          1. Select Master Template from Central Hub
                        </h3>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                          Hub Governed
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, marginBottom: 14 }}>
                      Template layouts and payment gateway compliance are managed by Central Financial Hub. Pick your academy blueprint:
                    </p>

                    {/* Blueprint Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {blueprints.filter(b => b.isPublished).map((bp) => {
                        const isSelected = selectedBlueprintId === bp.id;
                        return (
                          <div
                            key={bp.id}
                            onClick={() => handleSelectBlueprint(bp)}
                            style={{
                              border: isSelected ? '2px solid #10B981' : '1px solid #E2E8F0',
                              borderRadius: 10,
                              padding: '14px 16px',
                              background: isSelected ? '#F0FDF4' : '#F8FAFC',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              position: 'relative',
                            }}
                          >
                            {isSelected && (
                              <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 800, background: '#10B981', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                                ✓ Selected
                              </span>
                            )}
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#2563EB', background: '#DBEAFE', padding: '2px 6px', borderRadius: 4 }}>
                              {bp.badge}
                            </span>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', marginTop: 6 }}>
                              {bp.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, lineHeight: 1.4 }}>
                              {bp.description.slice(0, 95)}...
                            </div>
                            <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {bp.allowedPaymentRails.fawry && <span style={{ fontSize: 9, background: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: 3 }}>⚡ Fawry</span>}
                              {bp.allowedPaymentRails.wallet && <span style={{ fontSize: 9, background: '#FEE2E2', color: '#991B1B', padding: '1px 5px', borderRadius: 3 }}>📱 Wallets</span>}
                              {bp.allowedPaymentRails.card && <span style={{ fontSize: 9, background: '#DBEAFE', color: '#1E40AF', padding: '1px 5px', borderRadius: 3 }}>💳 Cards</span>}
                              {bp.allowedPaymentRails.activationCode && <span style={{ fontSize: 9, background: '#D1FAE5', color: '#065F46', padding: '1px 5px', borderRadius: 3 }}>🎟️ Serial Code</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Provider Identity & Header */}
                  <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        2. Provider Logo &amp; Brand Identity (Simple Customization)
                      </h3>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                        Custom Branding
                      </span>
                    </div>

                    {/* Logo Selector / Uploader Box */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                        {/* Current Active Logo Preview */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 12,
                            background: 'white',
                            border: '2px solid #CBD5E1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            flexShrink: 0,
                            padding: 4,
                            boxSizing: 'border-box',
                          }}
                        >
                          {template.providerLogoUrl ? (
                            <img
                              src={template.providerLogoUrl}
                              alt={template.providerName}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <span style={{ fontSize: 18, fontWeight: 900, color: template.accentColor }}>
                              {template.providerLogoText}
                            </span>
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                            Active Brand Logo
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>
                            Displays in checkout header and student payment portal
                          </div>
                          
                          {/* Upload Button + File Input */}
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleLogoUpload}
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              style={{
                                padding: '6px 12px',
                                borderRadius: 6,
                                background: 'var(--brand)',
                                color: 'white',
                                fontSize: 11.5,
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              Upload Brand Logo
                            </button>
                            {template.providerLogoUrl && (
                              <button
                                type="button"
                                onClick={() => updateTemplate('providerLogoUrl', undefined)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 6,
                                  background: 'white',
                                  color: '#64748B',
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  border: '1px solid #CBD5E1',
                                  cursor: 'pointer',
                                }}
                              >
                                Reset to Monogram
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Custom URL Input */}
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Or Paste Logo Image URL (PNG, SVG, WebP):
                        </label>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input
                            type="url"
                            value={customLogoUrl}
                            onChange={e => setCustomLogoUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                            style={{ flex: 1, padding: '7px 10px', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 12 }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customLogoUrl.trim()) {
                                updateTemplate('providerLogoUrl', customLogoUrl.trim());
                                setCustomLogoUrl('');
                              }
                            }}
                            style={{ padding: '7px 12px', background: '#0F172A', color: 'white', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Apply URL
                          </button>
                        </div>
                      </div>

                      {/* Curated Presets */}
                      <div>
                        <span style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
                          Quick Brand Presets:
                        </span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {BRAND_LOGO_PRESETS.map(preset => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleApplyPreset(preset)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: 6,
                                background: 'white',
                                border: template.providerLogoUrl === preset.svgDataUri ? '2px solid var(--brand)' : '1px solid #CBD5E1',
                                color: '#1E293B',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <img src={preset.svgDataUri} alt={preset.name} style={{ width: 16, height: 16, borderRadius: 4 }} />
                              <span>{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Toggle: Show Logo in Hero */}
                      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: '#334155' }}>
                          Show Brand Logo in Course Banner Header
                        </span>
                        <input
                          type="checkbox"
                          checked={template.showLogoInHero !== false}
                          onChange={e => updateTemplate('showLogoInHero', e.target.checked)}
                          style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Logo Avatar / Initials
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={template.providerLogoText}
                          onChange={e => updateTemplate('providerLogoText', e.target.value.toUpperCase())}
                          placeholder="SH"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontWeight: 800, textAlign: 'center', letterSpacing: '0.05em' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Official Provider / Academy Name
                        </label>
                        <input
                          type="text"
                          value={template.providerName}
                          onChange={e => updateTemplate('providerName', e.target.value)}
                          placeholder="StudyHub Egypt"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Support Phone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={template.supportPhone}
                          onChange={e => updateTemplate('supportPhone', e.target.value)}
                          placeholder="+20 10 1234 5678"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12 }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={template.supportEmail}
                          onChange={e => updateTemplate('supportEmail', e.target.value)}
                          placeholder="admissions@studyhub.eg"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Colors & Visual Styling */}
                  <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 22px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 14px', color: 'var(--text-primary)' }}>
                      Theme Colors & Header Treatment
                    </h3>

                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                        Primary Brand Accent Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                        {PRESET_COLORS.map(c => (
                          <button
                            key={c.hex}
                            onClick={() => updateTemplate('accentColor', c.hex)}
                            title={c.name}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: c.hex,
                              border: template.accentColor === c.hex ? '3px solid #0F172A' : '2px solid white',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                              cursor: 'pointer',
                              transform: template.accentColor === c.hex ? 'scale(1.15)' : 'scale(1)',
                              transition: 'all 0.15s',
                            }}
                          />
                        ))}
                        <input
                          type="color"
                          value={template.accentColor}
                          onChange={e => updateTemplate('accentColor', e.target.value)}
                          style={{ width: 36, height: 32, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {template.accentColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Header Banner Treatment
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {[
                          { id: 'gradient' as const, label: 'Vibrant Gradient' },
                          { id: 'solid' as const, label: 'Solid Accent' },
                          { id: 'dark' as const, label: 'Fintech Dark' },
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => updateTemplate('bannerStyle', st.id)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              border: template.bannerStyle === st.id ? '2px solid var(--brand)' : '1px solid var(--border)',
                              background: template.bannerStyle === st.id ? 'rgba(37,99,235,0.06)' : 'white',
                              color: template.bannerStyle === st.id ? 'var(--brand)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Read-Only Gateway & Rails (Governed by Central Hub) */}
                  <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        Payment Gateway &amp; Rails
                      </h3>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' }}>
                        🔒 Read-Only · Governed by Hub Admin
                      </span>
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Acquiring gateway assignments (Geidea / Paymob) and Egyptian payment rails (Card, Wallet, Fawry) are governed by Central Financial Hub. Providers customize approved blueprints, logos, and brand colors.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                          Assigned Card &amp; Wallet Gateway:
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {template.gateway === 'Geidea' ? <GeideaLogo height={20} /> : <PaymobLogo height={20} />}
                          <strong style={{ fontSize: 13, color: '#0F172A' }}>{template.gateway} (PCI-DSS)</strong>
                        </div>
                      </div>

                      <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                          Fawry Cash Rail:
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <FawryLogo height={20} />
                          <strong style={{ fontSize: 13, color: template.methods.fawry ? '#15803D' : '#94A3B8' }}>
                            {template.methods.fawry ? 'Active (Kiosks & myFawry)' : 'Disabled'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CMS COURSE SIMULATOR */}
              {activeTab === 'CMS_SIMULATOR' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Selector Bar */}
                  <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        Simulate Course From Your CMS
                      </h3>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Select a course to test live:
                      </span>
                    </div>

                    <select
                      value={activeCourseId}
                      onChange={e => {
                        setActiveCourseId(e.target.value);
                        setCheckoutStep('SELECT');
                      }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, fontWeight: 600, background: '#F8FAFC', outline: 'none' }}
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} — EGP {c.price.toLocaleString()} ({c.category})
                        </option>
                      ))}
                    </select>

                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8, marginBottom: 0 }}>
                      Notice how the preview on the right instantly reflects the selected course while keeping your Master Academy Branding intact.
                    </p>
                  </div>

                  {/* Course Details Injection Form */}
                  <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px 22px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 14px', color: 'var(--text-primary)' }}>
                      Dynamic Course Inputs (Passed from CMS)
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Course / Program Title (English)
                        </label>
                        <input
                          type="text"
                          value={activeCourse.title}
                          onChange={e => updateActiveCourse('title', e.target.value)}
                          placeholder="e.g. Advanced AI & Prompt Engineering"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                          Course / Program Title (Arabic)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={activeCourse.titleAr}
                          onChange={e => updateActiveCourse('titleAr', e.target.value)}
                          placeholder="مثال: دورة الذكاء الاصطناعي وهندسة الأوامر"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 13 }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                            Tuition Amount (EGP)
                          </label>
                          <input
                            type="number"
                            value={activeCourse.price}
                            onChange={e => updateActiveCourse('price', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 14, fontWeight: 800, color: '#0F172A' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                            Promo / Announcement Badge
                          </label>
                          <input
                            type="text"
                            value={activeCourse.badge}
                            onChange={e => updateActiveCourse('badge', e.target.value)}
                            placeholder="20% Early Bird"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generated Dynamic URL Preview */}
                  <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', padding: '16px 18px' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Generated Dynamic Checkout URL for this Course:
                    </div>
                    <div style={{ background: '#0F172A', color: '#38BDF8', padding: '10px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {dynamicCheckoutUrl}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CMS INTEGRATION GUIDE */}
              {activeTab === 'CMS_GUIDE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Step-by-Step Architecture Explainer */}
                  <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '22px 24px' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 14px', color: 'var(--text-primary)' }}>
                      How This Checkout Step Works in Your CMS
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {[
                        {
                          step: '1',
                          title: 'Admin creates or edits a course in CMS',
                          desc: 'In WordPress, Strapi, Custom React CMS, or Bldr, you enter standard fields: Course Name, Price in EGP, and Cohort Date.',
                        },
                        {
                          step: '2',
                          title: 'CMS passes parameters to the Master Checkout',
                          desc: 'No new page is created. Your CMS simply directs students to pay.bldr.io/checkout/your-academy?course_id=... or embeds the widget.',
                        },
                        {
                          step: '3',
                          title: 'Student completes checkout via Egyptian rails',
                          desc: 'Student picks Fawry Ref Code, Mobile Wallet (Vodafone Cash/InstaPay), or Meeza Card in your branded environment.',
                        },
                        {
                          step: '4',
                          title: 'Webhook automatically enrolls the student',
                          desc: 'Bldr instantly pings your CMS endpoint with payment confirmation, student email, and transaction reference.',
                        },
                      ].map(s => (
                        <div key={s.step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                            {s.step}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Webhook Payload Sample */}
                  <div style={{ background: '#0F172A', borderRadius: 12, padding: '20px', color: '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>WEBHOOK PAYLOAD: payment.succeeded</span>
                      <span style={{ fontSize: 10.5, background: '#10B98125', color: '#34D399', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>200 OK</span>
                    </div>
                    <pre style={{ margin: 0, fontSize: 11.5, fontFamily: 'monospace', color: '#38BDF8', overflowX: 'auto' }}>
{`{
  "event": "payment.succeeded",
  "provider": "${template.providerSlug}",
  "course_id": "${activeCourse.id}",
  "course_title": "${activeCourse.title}",
  "amount_egp": ${activeCourse.price},
  "payment_method": "FAWRY",
  "fawry_reference_code": "78844219980",
  "student": {
    "name": "Ahmed Kamal",
    "email": "ahmed.kamal@gmail.com",
    "phone": "01023456789"
  },
  "timestamp": "2026-09-27T08:12:00Z"
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* ─── RIGHT COLUMN: Live Master Branded Checkout Preview ─── */}
            <div style={{ position: 'sticky', top: 84 }}>
              
              {/* Preview Status & Course Switcher Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                    Live Master Checkout Preview
                  </span>
                </div>
                {/* Course Switcher Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rendering Course:</span>
                  <select
                    value={activeCourseId}
                    onChange={e => {
                      setActiveCourseId(e.target.value);
                      setCheckoutStep('SELECT');
                    }}
                    style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, color: '#1E293B', cursor: 'pointer', outline: 'none' }}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title.slice(0, 26)}... (EGP {c.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* The Trusted Checkout Mockup Container */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 16,
                  border: '1px solid #D1D5DB',
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                }}
              >
                {/* ─── 1. TOP OFFICIAL PROVIDER BAR ─── */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderBottom: '1px solid #E2E8F0',
                    padding: '14px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Provider Logo Avatar or Custom Image */}
                    {template.providerLogoUrl ? (
                      <img
                        src={template.providerLogoUrl}
                        alt={template.providerName}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          objectFit: 'contain',
                          background: 'white',
                          border: '1px solid #E2E8F0',
                          padding: 3,
                          boxShadow: `0 2px 8px rgba(0,0,0,0.08)`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: template.accentColor,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: 16,
                          boxShadow: `0 4px 12px ${template.accentColor}40`,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {template.providerLogoText}
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                          {template.providerName}
                        </span>
                        {/* Verified Provider Badge */}
                        <span
                          title="Verified by bldr infrastructure"
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '2px 7px',
                            background: '#ECFDF5',
                            color: '#065F46',
                            borderRadius: 6,
                            border: '1px solid #A7F3D0',
                          }}
                        >
                          مقدم معتمد
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        المنصة الرسمية المعتمدة لتحصيل المصروفات الدراسية
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10.5, color: '#64748B' }}>الدعم والمساعدة</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A' }}>
                      {template.supportPhone}
                    </div>
                  </div>
                </div>

                {/* ─── 2. BRANDED HERO BANNER (Hydrated Dynamically with Active Course) ─── */}
                <div
                  style={{
                    background: getBannerBackground(),
                    padding: '22px 24px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {/* Brand Logo & Provider Header in Hero Banner */}
                    {template.showLogoInHero !== false && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        {template.providerLogoUrl ? (
                          <img
                            src={template.providerLogoUrl}
                            alt={template.providerName}
                            style={{
                              width: 38,
                              height: 38,
                              objectFit: 'contain',
                              borderRadius: 8,
                              background: 'white',
                              padding: 3,
                              boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
                              border: '1px solid rgba(255,255,255,0.4)',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 8,
                              background: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(6px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: 14,
                              color: 'white',
                              border: '1px solid rgba(255,255,255,0.3)',
                              flexShrink: 0,
                            }}
                          >
                            {template.providerLogoText}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>
                              {template.providerName}
                            </span>
                            <span
                              style={{
                                fontSize: 9.5,
                                fontWeight: 800,
                                padding: '1px 6px',
                                background: 'rgba(255,255,255,0.22)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: 4,
                                color: 'white',
                              }}
                            >
                              Verified
                            </span>
                          </div>
                          <span style={{ fontSize: 10, opacity: 0.85, color: '#F1F5F9' }}>
                            بوابة السداد الرسمية
                          </span>
                        </div>
                        {activeCourse.badge && (
                          <span
                            style={{
                              marginRight: 'auto',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '3px 8px',
                              background: 'rgba(255,255,255,0.18)',
                              backdropFilter: 'blur(4px)',
                              borderRadius: 6,
                            }}
                          >
                            {activeCourse.badge}
                          </span>
                        )}
                      </div>
                    )}

                    <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: 'white' }}>
                      {activeCourse.title}
                    </h2>
                    <div style={{ fontSize: 12, opacity: 0.88, direction: 'rtl', textAlign: 'left' }}>
                      {activeCourse.titleAr}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{ fontSize: 10.5, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      إجمالي الرسوم المطلوبة
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>
                      EGP {activeCourse.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.75 }}>
                      شامل الضريبة والاعتماد
                    </div>
                  </div>
                </div>

                {/* ─── 3. INTERACTIVE EGYPTIAN STUDENT CHECKOUT ─── */}
                <div style={{ padding: '24px' }}>
                  {checkoutStep === 'SELECT' && (
                    <div>
                      {/* Student Details Form */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                            بيانات الطالب للتسجيل الرسمي (Student Details)
                          </span>
                          <span style={{ fontSize: 10.5, color: '#64748B' }}>إشعار تأكيد فوري عبر Email و SMS</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: 10 }}>
                          <input
                            type="text"
                            placeholder="الاسم ثلاثي (Full Name)"
                            value={studentName}
                            onChange={e => setStudentName(e.target.value)}
                            style={{ padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12.5 }}
                          />
                          <input
                            type="tel"
                            placeholder="رقم المحمول (01xxxxxxxxx)"
                            value={studentPhone}
                            onChange={e => setStudentPhone(e.target.value)}
                            style={{ padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12.5 }}
                          />
                        </div>
                        <input
                          type="email"
                          placeholder="البريد الإلكتروني لتسلم بيانات الدخول (Email Address)"
                          value={studentEmail}
                          onChange={e => setStudentEmail(e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12.5 }}
                        />
                      </div>

                      {/* Payment Method Selector */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                            اختر وسيلة الدفع المناسبة لك في مصر:
                          </span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#0369A1' }}>
                            تفعيل فوري للمقعد
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {/* Option 1: Fawry */}
                          {template.methods.fawry && (
                            <div
                              onClick={() => setSelectedMethod('FAWRY')}
                              style={{
                                padding: '14px 16px',
                                borderRadius: 12,
                                border: selectedMethod === 'FAWRY' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                                background: selectedMethod === 'FAWRY' ? '#FFFBEB' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 14,
                                transition: 'all 0.15s ease-in-out',
                                boxShadow: selectedMethod === 'FAWRY' ? '0 4px 12px rgba(245, 158, 11, 0.12)' : 'none',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                                    كود دفع فوري (Fawry Reference Code)
                                  </div>
                                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#FEF3C7', color: '#92400E' }}>
                                    فوري Kiosk
                                  </span>
                                </div>
                                <div style={{ fontSize: 11, color: '#64748B' }}>
                                  احصل على رقم دفع لسداده نقداً عبر أي منفذ فوري أو تطبيق myFawry
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FawryLogo height={28} />
                                <input
                                  type="radio"
                                  name="method"
                                  checked={selectedMethod === 'FAWRY'}
                                  onChange={() => setSelectedMethod('FAWRY')}
                                  style={{ width: 18, height: 18, accentColor: '#F59E0B', cursor: 'pointer' }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Option 2: Mobile Wallets */}
                          {template.methods.wallet && (
                            <div
                              onClick={() => setSelectedMethod('WALLET')}
                              style={{
                                padding: '14px 16px',
                                borderRadius: 12,
                                border: selectedMethod === 'WALLET' ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                                background: selectedMethod === 'WALLET' ? '#F0F9FF' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 14,
                                transition: 'all 0.15s ease-in-out',
                                boxShadow: selectedMethod === 'WALLET' ? '0 4px 12px rgba(14, 165, 233, 0.12)' : 'none',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                                    المحافظ الإلكترونية (Mobile Wallets)
                                  </div>
                                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#E0F2FE', color: '#0369A1' }}>
                                    خصم فوري
                                  </span>
                                </div>
                                <div style={{ fontSize: 11, color: '#64748B' }}>
                                  فودافون كاش، أورنج، اتصالات، وي باي
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 280 }}>
                                  <VodafoneCashLogo height={22} />
                                  <OrangeCashLogo height={22} />
                                  <EtisalatCashLogo height={22} />
                                  <WePayLogo height={22} />
                                </div>
                                <input
                                  type="radio"
                                  name="method"
                                  checked={selectedMethod === 'WALLET'}
                                  onChange={() => setSelectedMethod('WALLET')}
                                  style={{ width: 18, height: 18, accentColor: '#0EA5E9', cursor: 'pointer' }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Option 3: Bank Cards */}
                          {template.methods.card && (
                            <div
                              onClick={() => setSelectedMethod('CARD')}
                              style={{
                                padding: '14px 16px',
                                borderRadius: 12,
                                border: selectedMethod === 'CARD' ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                                background: selectedMethod === 'CARD' ? '#FAF5FF' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 14,
                                transition: 'all 0.15s ease-in-out',
                                boxShadow: selectedMethod === 'CARD' ? '0 4px 12px rgba(124, 58, 237, 0.12)' : 'none',
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                                    البطاقات البنكية (Visa &amp; Mastercard)
                                  </div>
                                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#F3E8FF', color: '#6B21A8' }}>
                                    دفع مشفر
                                  </span>
                                </div>
                                <div style={{ fontSize: 11, color: '#64748B' }}>
                                  بطاقات فيزا وماستركارد بخصم آمن مشفر 3D Secure
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                  <VisaLogo height={22} />
                                  <MastercardLogo height={22} />
                                </div>
                                <input
                                  type="radio"
                                  name="method"
                                  checked={selectedMethod === 'CARD'}
                                  onChange={() => setSelectedMethod('CARD')}
                                  style={{ width: 18, height: 18, accentColor: '#7C3AED', cursor: 'pointer' }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={handleStartCheckout}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: 10,
                          border: 'none',
                          background: template.accentColor,
                          color: 'white',
                          fontWeight: 800,
                          fontSize: 14,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: `0 4px 14px ${template.accentColor}40`,
                        }}
                      >
                        متابعة تأكيد الدفع لـ {activeCourse.title.slice(0, 24)}... (EGP {activeCourse.price.toLocaleString()})
                      </button>
                    </div>
                  )}

                  {/* Step 2: Fawry Ref Code or Wallet Simulator */}
                  {checkoutStep === 'REDIRECT' && (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      {selectedMethod === 'FAWRY' && (
                        <div style={{ background: '#FFFBEB', border: '2px solid #F59E0B', borderRadius: 12, padding: '24px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                            <FawryLogo height={32} />
                          </div>
                          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#92400E' }}>
                            كود دفع فوري الخاص بك
                          </h3>
                          <p style={{ fontSize: 12, color: '#78350F', marginBottom: 16 }}>
                            توجه لأي منفذ فوري أو استخدم تطبيق myFawry وادفع برقم الخدمة <strong>(788)</strong>
                          </p>

                          <div style={{ background: 'white', border: '1px dashed #F59E0B', borderRadius: 8, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 900, letterSpacing: '0.1em', color: '#B45309' }}>
                              {fawryRefCode}
                            </span>
                            <button
                              onClick={copyFawryRef}
                              style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#92400E', cursor: 'pointer' }}
                            >
                              {copiedRef ? 'تم النسخ' : 'نسخ الكود'}
                            </button>
                          </div>

                          <div style={{ fontSize: 11.5, color: '#92400E', marginBottom: 18, lineHeight: 1.5 }}>
                            صالح لمدة <strong>48 ساعة</strong> حتى اكتمال السداد وتأكيد المقعد تلقائياً
                          </div>

                          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                              onClick={() => setCheckoutStep('SELECT')}
                              style={{ padding: '8px 16px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              تغيير الوسيلة
                            </button>
                            <button
                              onClick={() => setCheckoutStep('CONFIRMED')}
                              style={{ padding: '8px 18px', background: '#059669', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              محاكاة تأكيد السداد من فوري
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedMethod === 'WALLET' && (
                        <div style={{ background: '#F0F9FF', border: '2px solid #0EA5E9', borderRadius: 12, padding: '24px 20px' }}>
                          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#0369A1' }}>
                            الدفع عبر المحفظة الإلكترونية
                          </h3>
                          <p style={{ fontSize: 12, color: '#0284C7', marginBottom: 16 }}>
                            اختر شبكة المحفظة وسيصلك إشعار فوري على هاتفك لتأكيد الخصم
                          </p>

                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                            {[
                              { id: 'Vodafone Cash' as const, logo: <VodafoneCashLogo height={24} /> },
                              { id: 'Orange Money' as const, logo: <OrangeCashLogo height={24} /> },
                              { id: 'Etisalat Cash' as const, logo: <EtisalatCashLogo height={24} /> },
                              { id: 'WE Pay' as const, logo: <WePayLogo height={24} /> },
                            ].map(w => (
                              <button
                                key={w.id}
                                onClick={() => setWalletProvider(w.id as any)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: 8,
                                  border: walletProvider === w.id ? '2px solid #0284C7' : '1px solid #CBD5E1',
                                  background: walletProvider === w.id ? '#EFF6FF' : 'white',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  boxShadow: walletProvider === w.id ? '0 2px 6px rgba(2, 132, 199, 0.15)' : 'none',
                                }}
                              >
                                {w.logo}
                              </button>
                            ))}
                          </div>

                          <div style={{ maxWidth: 300, margin: '0 auto 16px' }}>
                            <input
                              type="tel"
                              value={walletNumber}
                              onChange={e => setWalletNumber(e.target.value)}
                              placeholder="رقم المحفظة (01xxxxxxxxx)"
                              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, textAlign: 'center', fontWeight: 700 }}
                            />
                          </div>

                          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                              onClick={() => setCheckoutStep('SELECT')}
                              style={{ padding: '8px 16px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              رجوع
                            </button>
                            <button
                              onClick={() => setCheckoutStep('CONFIRMED')}
                              style={{ padding: '8px 18px', background: '#0284C7', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              إرسال طلب الخصم (OTP / Push)
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedMethod === 'CARD' && (
                        <div style={{ background: '#FAF5FF', border: '2px solid #7C3AED', borderRadius: 12, padding: '24px 20px' }}>
                          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#6D28D9' }}>
                            الدفع عبر البطاقة البنكية
                          </h3>
                          <p style={{ fontSize: 12, color: '#7C3AED', marginBottom: 14 }}>
                            معاملة آمنة مشفرة عبر بوابة <strong>{template.gateway}</strong>
                          </p>

                          <div style={{ maxWidth: 360, margin: '0 auto 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                              <VisaLogo height={24} />
                              <MastercardLogo height={24} />
                            </div>
                            <input
                              type="text"
                              placeholder="رقم البطاقة (Card Number)"
                              defaultValue="4000 0300 •••• 9214"
                              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, textAlign: 'center', fontWeight: 600 }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                              <input type="text" placeholder="MM/YY" defaultValue="11/28" style={{ padding: '8px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, textAlign: 'center' }} />
                              <input type="password" placeholder="CVV" defaultValue="•••" style={{ padding: '8px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, textAlign: 'center' }} />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                              onClick={() => setCheckoutStep('SELECT')}
                              style={{ padding: '8px 16px', background: 'white', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              رجوع
                            </button>
                            <button
                              onClick={() => setCheckoutStep('CONFIRMED')}
                              style={{ padding: '8px 18px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              تأكيد سداد EGP {activeCourse.price.toLocaleString()}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Confirmation Screen */}
                  {checkoutStep === 'CONFIRMED' && (
                    <div style={{ textAlign: 'center', padding: '24px 16px', background: '#ECFDF5', border: '2px solid #10B981', borderRadius: 12 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: '#065F46' }}>
                        تم تأكيد السداد وتسجيل الطالب بنجاح
                      </h3>
                      <p style={{ fontSize: 12.5, color: '#047857', maxWidth: 380, margin: '0 auto 16px', lineHeight: 1.5 }}>
                        تم قيد الطالب <strong>{studentName}</strong> بدورة <strong>{activeCourse.title}</strong> لدى <strong>{template.providerName}</strong>، وإرسال إشعار فوري عبر بوابة <strong>{template.gateway}</strong>
                      </p>
                      <button
                        onClick={() => setCheckoutStep('SELECT')}
                        style={{ padding: '8px 18px', background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        إعادة تجربة الدفع لـ دورة أخرى
                      </button>
                    </div>
                  )}
                </div>

                {/* ─── 4. HIGH-TRUST FOOTER ─── */}
                <div
                  style={{
                    background: '#F8FAFC',
                    borderTop: '1px solid #E2E8F0',
                    padding: '16px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {/* Row 1: Payment Managed by bldr & Secured by Gateway */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    {/* bldr Management badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: '#D10721',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 900,
                        }}
                      >
                        b
                      </div>
                      <div style={{ fontSize: 11.5, color: '#334155' }}>
                        Payment Managed by <strong style={{ color: '#0F172A', fontWeight: 800 }}>bldr</strong>
                      </div>
                    </div>

                    {/* Gateway Security Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11.5, color: '#64748B' }}>Secured payment by:</span>
                      {template.gateway === 'Geidea' ? (
                        <GeideaLogo height={28} />
                      ) : template.gateway === 'Fawry Pay' ? (
                        <FawryLogo height={28} />
                      ) : (
                        <PaymobLogo height={28} />
                      )}
                    </div>
                  </div>

                  {/* Row 2: Regulatory & Bank Security Trust Seals */}
                  <div
                    style={{
                      borderTop: '1px dashed #CBD5E1',
                      paddingTop: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <SslBadge />
                      <CbeComplianceBadge />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <PciDssBadge />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: 6 }}>
                        3D Secure 2.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Embed Modal */}
      {showEmbedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 580, width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>CMS Embed & Dynamic Link Code</h2>
              <button onClick={() => setShowEmbedModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Add this dynamic checkout step into your CMS when adding a course:
            </p>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Option A: Dynamic Redirect URL (Direct Link)</div>
              <div style={{ background: '#0F172A', color: '#38BDF8', padding: '12px', borderRadius: 8, fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>
                {dynamicCheckoutUrl}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Option B: In-CMS Iframe Widget</div>
              <div style={{ background: '#0F172A', color: '#38BDF8', padding: '12px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11.5, wordBreak: 'break-all' }}>
                {embedCode}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowEmbedModal(false)}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-strong)', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Close
              </button>
              <button
                onClick={copyEmbed}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: embedCopied ? '#059669' : 'var(--brand)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                {embedCopied ? 'Copied Embed Code' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
