'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';
import {
  CheckoutTemplateBlueprint,
  BrandCheckoutConfig,
  CheckoutLayoutType,
  CheckoutBannerStyle,
} from '@bldr/shared-types';
import {
  getMasterBlueprints,
  saveMasterBlueprints,
  getBrandCheckoutConfigs,
  saveBrandCheckoutConfig,
} from '../../lib/checkout-studio';

export default function HubPaymentPages() {
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'ARCHITECT'>('MONITOR');
  const [blueprints, setBlueprints] = useState<CheckoutTemplateBlueprint[]>([]);
  const [brandConfigs, setBrandConfigs] = useState<BrandCheckoutConfig[]>([]);
  const [selectedVenture, setSelectedVenture] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewBrand, setPreviewBrand] = useState<BrandCheckoutConfig | null>(null);

  // Master Template Architect / Editor State
  const [editingBlueprint, setEditingBlueprint] = useState<CheckoutTemplateBlueprint | null>(null);
  const [isNewBlueprint, setIsNewBlueprint] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Interactive Live Preview State (for student checkout simulator)
  const [activeRail, setActiveRail] = useState<'FAWRY' | 'WALLET' | 'CARD' | 'CODE'>('FAWRY');
  const [fawryRefCode, setFawryRefCode] = useState('788-9921-4820');
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [codeRedeemed, setCodeRedeemed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load state on mount and listen to storage sync events
  useEffect(() => {
    setBlueprints(getMasterBlueprints());
    setBrandConfigs(getBrandCheckoutConfigs());

    const handleBlueprintsUpdated = () => {
      setBlueprints(getMasterBlueprints());
    };
    const handleConfigsUpdated = () => {
      setBrandConfigs(getBrandCheckoutConfigs());
    };

    window.addEventListener('bldr:blueprints-updated', handleBlueprintsUpdated);
    window.addEventListener('bldr:checkout-config-updated', handleConfigsUpdated);
    window.addEventListener('storage', handleConfigsUpdated);

    return () => {
      window.removeEventListener('bldr:blueprints-updated', handleBlueprintsUpdated);
      window.removeEventListener('bldr:checkout-config-updated', handleConfigsUpdated);
      window.removeEventListener('storage', handleConfigsUpdated);
    };
  }, []);

  // Filtered active brand checkouts
  const filteredBrands = brandConfigs.filter((brand) => {
    const matchesVenture = selectedVenture === 'all' || brand.ventureId === selectedVenture;
    const matchesSearch =
      searchQuery === '' ||
      brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.ventureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.connectedGateway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVenture && matchesSearch;
  });

  // Aggregated platform telemetry
  const totalVolume = brandConfigs.reduce((acc, b) => acc + b.totalVolumeEgp, 0);
  const totalStudents = brandConfigs.reduce((acc, b) => acc + b.conversions24h, 0);
  const activeCount = brandConfigs.filter((b) => b.status === 'ACTIVE').length;

  const handleOpenPreview = (brand: BrandCheckoutConfig) => {
    setPreviewBrand(brand);
    setActiveRail('FAWRY');
    setCodeRedeemed(false);
    setActivationCodeInput('');
    setFawryRefCode(`788-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleToggleBrandStatus = (ventureId: string) => {
    const target = brandConfigs.find((b) => b.ventureId === ventureId);
    if (!target) return;
    const updated: BrandCheckoutConfig = {
      ...target,
      status: target.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE',
    };
    saveBrandCheckoutConfig(updated);
    setBrandConfigs(getBrandCheckoutConfigs());
  };

  const handleStartNewBlueprint = () => {
    const newBp: CheckoutTemplateBlueprint = {
      id: `tpl-${Date.now().toString().slice(-4)}`,
      name: 'Custom Egyptian Academy Layout',
      nameAr: 'تصميم مخصص للأكاديميات المصرية',
      description: 'Platform master layout standard with custom Egyptian payment routing and adaptive container architecture.',
      badge: 'New Standard',
      layout: 'split-hero',
      headerStyle: 'gradient',
      defaultAccentColor: '#10B981',
      allowedPaymentRails: {
        fawry: true,
        wallet: true,
        card: true,
        activationCode: true,
      },
      securitySeals: ['PCI-DSS SAQ-A', 'TLS 1.3 256-Bit', 'Authorized Gateway'],
      version: 'v2.6',
      isPublished: true,
      author: 'Platform Financial Super Admin',
      updatedAt: new Date().toISOString(),
    };
    setEditingBlueprint(newBp);
    setIsNewBlueprint(true);
  };

  const handleSaveBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlueprint) return;

    let updated: CheckoutTemplateBlueprint[];
    if (isNewBlueprint) {
      updated = [editingBlueprint, ...blueprints];
    } else {
      updated = blueprints.map((b) => (b.id === editingBlueprint.id ? editingBlueprint : b));
    }

    saveMasterBlueprints(updated);
    setBlueprints(updated);
    setEditingBlueprint(null);
    setSaveSuccessMsg(isNewBlueprint ? 'New Master Template blueprint published to Brand Portals!' : 'Blueprint saved & updated across all brand portals.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const copyFawry = () => {
    navigator.clipboard.writeText(fawryRefCode.replace(/-/g, ''));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F1D', color: '#F8FAFC' }}>
      <HubSidebar />

      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        <HubTopBar title="Master Checkout Studio & Active Pages Monitor" crumb="Governance" />

        {/* Top Control Bar & Telemetry Strip */}
        <div style={{ padding: '24px 32px 16px 32px', borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
          {/* Header & Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                  Checkout Governance &amp; Live Pages
                </h1>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  PCI-DSS Level 1
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  Multi-Gateway Routing
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, marginBottom: 0 }}>
                Master blueprints are designed here on the Hub. Brand portals select approved templates and add light customization.
              </p>
            </div>

            {/* Main Mode Tabs */}
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.9)', padding: 4, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.1)', gap: 4 }}>
              <button
                id="btn-tab-monitor"
                onClick={() => setActiveTab('MONITOR')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 7,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'MONITOR' ? '#10B981' : 'transparent',
                  color: activeTab === 'MONITOR' ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🖥️ Active Pages Monitor</span>
                <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: activeTab === 'MONITOR' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.08)' }}>
                  {brandConfigs.length}
                </span>
              </button>

              <button
                id="btn-tab-architect"
                onClick={() => setActiveTab('ARCHITECT')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 7,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'ARCHITECT' ? '#3B82F6' : 'transparent',
                  color: activeTab === 'ARCHITECT' ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🎨 Master Blueprint Architect</span>
                <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: activeTab === 'ARCHITECT' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.08)' }}>
                  {blueprints.length}
                </span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✓</span> {saveSuccessMsg}
            </div>
          )}

          {/* Live Platform KPI Telemetry Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Monitored Live Checkouts
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                {activeCount} <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>Active</span>
                <span style={{ fontSize: 12, color: '#64748B', marginLeft: 6 }}>/ {brandConfigs.length} total</span>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                Across all registered brands &amp; ventures
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Processed Volume
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#38BDF8', marginTop: 4 }}>
                EGP {(totalVolume / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                Settled through Geidea, Paymob &amp; Fawry
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                24h Enrolled Students
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#A78BFA', marginTop: 4 }}>
                {totalStudents} <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>paid enrollments</span>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                Online rails + physical serial code activations
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hub Master Blueprints
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>
                {blueprints.length} <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Standardized</span>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                Governed centrally • 0-Code for brands
              </div>
            </div>
          </div>
        </div>

        {/* ─── TAB 1: ACTIVE PAGES & VENTURES MONITOR ─── */}
        {activeTab === 'MONITOR' && (
          <div style={{ padding: '24px 32px', flex: 1 }}>
            {/* Filter Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                  <input
                    type="text"
                    placeholder="Search brand name, venture, or gateway..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '0 12px 0 34px',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <span style={{ position: 'absolute', left: 11, top: 10, color: '#64748B', fontSize: 14 }}>🔍</span>
                </div>

                <select
                  value={selectedVenture}
                  onChange={(e) => setSelectedVenture(e.target.value)}
                  style={{
                    height: 38,
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '0 12px',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">🌐 All Ventures</option>
                  <option value="studyhub">StudyHub Academy</option>
                  <option value="apex">Apex Classes</option>
                  <option value="el-hesa">EL HESA Institute</option>
                  <option value="bldr">bldr Storefront Pilot</option>
                  <option value="career-hub">Career Hub</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94A3B8' }}>
                <span>Showing <strong>{filteredBrands.length}</strong> monitored checkouts</span>
                <button
                  onClick={() => setActiveTab('ARCHITECT')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                    color: '#60A5FA',
                    borderRadius: 7,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginLeft: 8,
                  }}
                >
                  Architect New Blueprint →
                </button>
              </div>
            </div>

            {/* Monitored Brand Checkouts Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
              {filteredBrands.map((brand) => {
                const assignedBp = blueprints.find((b) => b.id === brand.templateId) || blueprints[0];
                return (
                  <div
                    key={brand.ventureId}
                    style={{
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: brand.status === 'ACTIVE' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px dashed rgba(239, 68, 68, 0.35)',
                      borderRadius: 14,
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                      position: 'relative',
                    }}
                  >
                    {/* Brand Card Header */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: brand.accentColor || '#0EA5E9',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: 14,
                              boxShadow: `0 2px 10px ${brand.accentColor}55`,
                            }}
                          >
                            {brand.brandLogoText || brand.ventureId.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                              {brand.brandName}
                            </div>
                            <div style={{ fontSize: 11.5, color: '#64748B' }}>
                              Venture: {brand.ventureName}
                            </div>
                          </div>
                        </div>

                        {/* Status Toggle Badge */}
                        <button
                          onClick={() => handleToggleBrandStatus(brand.ventureId)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            background: brand.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: brand.status === 'ACTIVE' ? '#34D399' : '#F87171',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                          }}
                          title="Click to toggle Active / Paused"
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: brand.status === 'ACTIVE' ? '#10B981' : '#EF4444' }} />
                          {brand.status}
                        </button>
                      </div>

                      {/* Selected Blueprint Pill */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 12px', borderRadius: 8, marginBottom: 14, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>Active Hub Template:</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8' }}>{assignedBp?.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>Layout Architecture:</span>
                          <span style={{ fontSize: 11, color: '#CBD5E1', textTransform: 'capitalize' }}>{assignedBp?.layout.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {/* Gateway & Rails */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11.5, color: '#94A3B8' }}>Connected Gateway:</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>{brand.connectedGateway}</span>
                        </div>

                        {/* Rail badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {brand.activeRails.fawry && (
                            <span style={{ fontSize: 10, background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                              ⚡ Fawry Kiosk
                            </span>
                          )}
                          {brand.activeRails.wallet && (
                            <span style={{ fontSize: 10, background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                              📱 Mobile Wallets (Vodafone/Orange/WE)
                            </span>
                          )}
                          {brand.activeRails.card && (
                            <span style={{ fontSize: 10, background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                              💳 Visa / Mastercard
                            </span>
                          )}
                          {brand.activeRails.activationCode && (
                            <span style={{ fontSize: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                              🎟️ Serial Code Activation
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Conversions & Volume */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '8px 10px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: 8, marginBottom: 14 }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase' }}>24h Paid Enrollments</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>{brand.conversions24h} students</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase' }}>Gross Volume</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#38BDF8', marginTop: 2 }}>EGP {brand.totalVolumeEgp.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <button
                        onClick={() => handleOpenPreview(brand)}
                        style={{
                          flex: 1,
                          height: 34,
                          borderRadius: 7,
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: '#38BDF8',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <span>👁️ Inspect Live Checkout</span>
                      </button>

                      <a
                        href={`http://localhost:3001/payment-pages`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          height: 34,
                          padding: '0 12px',
                          borderRadius: 7,
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#CBD5E1',
                          fontSize: 12,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                        title="Open Brand Portal Master Checkout"
                      >
                        Brand Portal ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 2: MASTER BLUEPRINT ARCHITECT (MAIN EDITOR) ─── */}
        {activeTab === 'ARCHITECT' && (
          <div style={{ padding: '24px 32px', flex: 1 }}>
            {/* Architect Header Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Central Master Blueprints Catalog
                </h2>
                <p style={{ fontSize: 12.5, color: '#94A3B8', marginTop: 4, marginBottom: 0 }}>
                  These standardized templates dictate layout, Egyptian payment rails, and compliance rules. All brand portals choose from this library.
                </p>
              </div>

              <button
                onClick={handleStartNewBlueprint}
                style={{
                  padding: '9px 18px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                }}
              >
                <span>+ Architect New Master Blueprint</span>
              </button>
            </div>

            {/* Blueprints Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 20 }}>
              {blueprints.map((bp) => {
                const brandsUsingThis = brandConfigs.filter((b) => b.templateId === bp.id);
                return (
                  <div
                    key={bp.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 14,
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div>
                      {/* Top Blueprint Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                          {bp.badge}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748B' }}>
                          Version {bp.version}
                        </span>
                      </div>

                      <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>
                        {bp.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: '#94A3B8', direction: 'rtl', marginBottom: 8, textAlign: 'right' }}>
                        {bp.nameAr}
                      </div>

                      <p style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.5, marginBottom: 16 }}>
                        {bp.description}
                      </p>

                      {/* Technical Architecture Specs */}
                      <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '12px 14px', borderRadius: 8, marginBottom: 16, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 12 }}>
                          <div>
                            <span style={{ color: '#64748B' }}>Layout Model:</span>{' '}
                            <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>{bp.layout.replace('-', ' ')}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#64748B' }}>Header Banner:</span>{' '}
                            <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>{bp.headerStyle}</strong>
                          </div>
                          <div>
                            <span style={{ color: '#64748B' }}>Default Accent:</span>{' '}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: bp.defaultAccentColor }} />
                              <strong style={{ color: '#FFFFFF' }}>{bp.defaultAccentColor}</strong>
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#64748B' }}>Status:</span>{' '}
                            <strong style={{ color: bp.isPublished ? '#34D399' : '#F87171' }}>
                              {bp.isPublished ? 'Live in Brand Portals' : 'Draft / Private'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Permitted Payment Rails */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 6 }}>
                          Permitted Payment Rails (Enforced by Hub)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {bp.allowedPaymentRails.fawry && (
                            <span style={{ fontSize: 10.5, background: 'rgba(245, 158, 11, 0.12)', color: '#FBBF24', padding: '3px 7px', borderRadius: 5 }}>
                              ⚡ Fawry Kiosk
                            </span>
                          )}
                          {bp.allowedPaymentRails.wallet && (
                            <span style={{ fontSize: 10.5, background: 'rgba(239, 68, 68, 0.12)', color: '#F87171', padding: '3px 7px', borderRadius: 5 }}>
                              📱 Mobile Wallets (Vodafone/Orange/WE)
                            </span>
                          )}
                          {bp.allowedPaymentRails.card && (
                            <span style={{ fontSize: 10.5, background: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', padding: '3px 7px', borderRadius: 5 }}>
                              💳 Visa / Mastercard
                            </span>
                          )}
                          {bp.allowedPaymentRails.activationCode && (
                            <span style={{ fontSize: 10.5, background: 'rgba(16, 185, 129, 0.12)', color: '#34D399', padding: '3px 7px', borderRadius: 5 }}>
                              🎟️ Scratch-Off / Serial Code
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Brands using this blueprint */}
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>
                        Used by <strong>{brandsUsingThis.length}</strong> brand{brandsUsingThis.length === 1 ? '' : 's'}:{' '}
                        {brandsUsingThis.map((b) => b.brandName).join(', ') || 'None yet'}
                      </div>
                    </div>

                    {/* Edit Blueprint Action */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <button
                        onClick={() => {
                          setEditingBlueprint(bp);
                          setIsNewBlueprint(false);
                        }}
                        style={{
                          flex: 1,
                          height: 38,
                          borderRadius: 8,
                          background: 'rgba(255, 255, 255, 0.07)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <span>⚙️ Edit Template Blueprint &amp; Rails</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── MODAL 1: LIVE BRAND CHECKOUT INSPECTOR ─── */}
        {previewBrand && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 900,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 16,
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal Top Bar */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', padding: '3px 8px', borderRadius: 6 }}>
                    Live Inspection
                  </span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                    {previewBrand.brandName} • Master Checkout Simulator
                  </div>
                </div>

                <button
                  onClick={() => setPreviewBrand(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: 20,
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Inspector Content */}
              <div style={{ padding: 24 }}>
                {/* Simulated Student Checkout Interface */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 12,
                    color: '#0F172A',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Brand Header Banner */}
                  <div
                    style={{
                      background: previewBrand.bannerStyle === 'gradient'
                        ? `linear-gradient(135deg, ${previewBrand.accentColor} 0%, #0F172A 100%)`
                        : previewBrand.bannerStyle === 'dark' ? '#0B0F19' : previewBrand.accentColor,
                      color: '#FFFFFF',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          background: '#FFFFFF',
                          color: previewBrand.accentColor,
                          fontWeight: 900,
                          fontSize: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {previewBrand.brandLogoText || 'BL'}
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{previewBrand.brandName}</div>
                        <div style={{ fontSize: 11, opacity: 0.85 }}>بوابة السداد الإلكتروني المعتمدة • CBE Compliant</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>الدعم والمساعدة</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{previewBrand.supportPhone}</div>
                    </div>
                  </div>

                  {/* Course Details & Payment Rails */}
                  <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>بيانات الطالب للتسجيل الرسمي (Student Details)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                        <input
                          type="text"
                          defaultValue="أحمد كمال (Ahmed Kamal)"
                          readOnly
                          style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                        />
                        <input
                          type="text"
                          defaultValue="01023456789"
                          readOnly
                          style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                        />
                      </div>

                      {/* Payment Rail Selector */}
                      <div style={{ marginTop: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
                          طريقة الدفع (Payment Method):
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                          {previewBrand.activeRails.fawry && (
                            <button
                              onClick={() => setActiveRail('FAWRY')}
                              style={{
                                padding: 10,
                                borderRadius: 8,
                                border: activeRail === 'FAWRY' ? `2px solid ${previewBrand.accentColor}` : '1px solid #CBD5E1',
                                background: activeRail === 'FAWRY' ? '#EFF6FF' : '#FFFFFF',
                                fontWeight: 700,
                                fontSize: 12,
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              ⚡ كود دفع فوري (Fawry)
                            </button>
                          )}
                          {previewBrand.activeRails.wallet && (
                            <button
                              onClick={() => setActiveRail('WALLET')}
                              style={{
                                padding: 10,
                                borderRadius: 8,
                                border: activeRail === 'WALLET' ? `2px solid ${previewBrand.accentColor}` : '1px solid #CBD5E1',
                                background: activeRail === 'WALLET' ? '#EFF6FF' : '#FFFFFF',
                                fontWeight: 700,
                                fontSize: 12,
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              📱 محفظة إلكترونية و إنستاباي
                            </button>
                          )}
                          {previewBrand.activeRails.card && (
                            <button
                              onClick={() => setActiveRail('CARD')}
                              style={{
                                padding: 10,
                                borderRadius: 8,
                                border: activeRail === 'CARD' ? `2px solid ${previewBrand.accentColor}` : '1px solid #CBD5E1',
                                background: activeRail === 'CARD' ? '#EFF6FF' : '#FFFFFF',
                                fontWeight: 700,
                                fontSize: 12,
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              💳 بطاقة بنكية (Visa / Mastercard)
                            </button>
                          )}
                          {previewBrand.activeRails.activationCode && (
                            <button
                              onClick={() => setActiveRail('CODE')}
                              style={{
                                padding: 10,
                                borderRadius: 8,
                                border: activeRail === 'CODE' ? `2px solid #10B981` : '1px solid #CBD5E1',
                                background: activeRail === 'CODE' ? '#ECFDF5' : '#FFFFFF',
                                fontWeight: 700,
                                fontSize: 12,
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: activeRail === 'CODE' ? '#047857' : '#0F172A',
                              }}
                            >
                              🎟️ تفعيل كود مطبوع (Code)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Rail Dynamic Content */}
                      <div style={{ marginTop: 16, padding: 14, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                        {activeRail === 'FAWRY' && (
                          <div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>رقم المرجع للسداد في أي فرع فوري:</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                              <span style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.05em', color: '#0F172A' }}>
                                {fawryRefCode}
                              </span>
                              <button
                                onClick={copyFawry}
                                style={{ padding: '5px 10px', borderRadius: 6, background: '#0F172A', color: '#FFFFFF', fontSize: 11, border: 'none', cursor: 'pointer' }}
                              >
                                {copiedCode ? '✓ تم النسخ' : 'نسخ الكود'}
                              </button>
                            </div>
                          </div>
                        )}

                        {activeRail === 'WALLET' && (
                          <div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>أدخل رقم فودافون كاش أو إنستاباي:</div>
                            <input
                              type="text"
                              defaultValue="01023456789"
                              style={{ width: '100%', marginTop: 6, padding: '7px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}
                            />
                          </div>
                        )}

                        {activeRail === 'CARD' && (
                          <div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>سداد آمن ومباشر عبر بوابة {previewBrand.connectedGateway}:</div>
                            <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 4 }}>
                              🔒 مشفر 256-Bit • متوافق مع بنك مصر والبنك الأهلي
                            </div>
                          </div>
                        )}

                        {activeRail === 'CODE' && (
                          <div>
                            <div style={{ fontSize: 11, color: '#047857', fontWeight: 700 }}>سداد بكود ورقي أو كشط من السنتر:</div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                              <input
                                type="text"
                                placeholder="مثال: SH-2026-F982"
                                value={activationCodeInput}
                                onChange={(e) => setActivationCodeInput(e.target.value)}
                                style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid #A7F3D0', fontSize: 13, textTransform: 'uppercase' }}
                              />
                              <button
                                onClick={() => setCodeRedeemed(true)}
                                style={{ padding: '7px 12px', borderRadius: 6, background: '#059669', color: '#FFFFFF', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                              >
                                تحقق وتفعيل
                              </button>
                            </div>
                            {codeRedeemed && (
                              <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, marginTop: 6 }}>
                                ✓ تم التحقق بنجاح من كود السنتر المعتمد!
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Course Summary Side */}
                    <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: previewBrand.accentColor, background: '#FFFFFF', padding: '2px 8px', borderRadius: 4, border: '1px solid #E2E8F0' }}>
                          معتمد من المنصة
                        </span>
                        <div style={{ fontSize: 16, fontWeight: 800, marginTop: 8 }}>
                          معسكر هندسة البرمجيات والويب الشامل
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                          الدفعة المعتمدة للربع القادم • 12 أسبوع
                        </div>

                        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
                          <div style={{ fontSize: 11, color: '#64748B' }}>إجمالي الرسوم المطلوبة:</div>
                          <div style={{ fontSize: 28, fontWeight: 900, color: '#0F172A' }}>
                            EGP 4,800
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: 10.5, color: '#64748B', textAlign: 'center', marginTop: 20 }}>
                        🔒 الدفع مشفر ومؤمن بالكامل عبر نظام الضمان الثنائي
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Gateway: <strong>{previewBrand.connectedGateway}</strong> • PCI DSS: <strong>Certified</strong>
                </span>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => handleToggleBrandStatus(previewBrand.ventureId)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: previewBrand.status === 'ACTIVE' ? '#F87171' : '#34D399',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {previewBrand.status === 'ACTIVE' ? 'Pause This Checkout' : 'Activate This Checkout'}
                  </button>

                  <button
                    onClick={() => setPreviewBrand(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: '#10B981',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Done Inspecting
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 2: ARCHITECT / EDIT MASTER BLUEPRINT ─── */}
        {editingBlueprint && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 720,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 16,
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {isNewBlueprint ? 'Architect New Master Blueprint' : 'Edit Master Template Blueprint'}
                  </h3>
                  <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, marginBottom: 0 }}>
                    Governed by Central Hub. Controls layout and allowed payment rails for all brand portals.
                  </p>
                </div>

                <button
                  onClick={() => setEditingBlueprint(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: 20, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveBlueprint} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Blueprint Name (English)
                  </label>
                  <input
                    type="text"
                    value={editingBlueprint.name}
                    onChange={(e) => setEditingBlueprint({ ...editingBlueprint, name: e.target.value })}
                    style={{ width: '100%', height: 40, borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '0 12px', fontSize: 13 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Blueprint Arabic Title (اسم القالب بالعربية)
                  </label>
                  <input
                    type="text"
                    value={editingBlueprint.nameAr}
                    onChange={(e) => setEditingBlueprint({ ...editingBlueprint, nameAr: e.target.value })}
                    style={{ width: '100%', height: 40, borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '0 12px', fontSize: 13, direction: 'rtl' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                    Description &amp; Intended Use Case
                  </label>
                  <textarea
                    rows={2}
                    value={editingBlueprint.description}
                    onChange={(e) => setEditingBlueprint({ ...editingBlueprint, description: e.target.value })}
                    style={{ width: '100%', borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: 10, fontSize: 13, resize: 'vertical' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                      Layout Structure
                    </label>
                    <select
                      value={editingBlueprint.layout}
                      onChange={(e) => setEditingBlueprint({ ...editingBlueprint, layout: e.target.value as CheckoutLayoutType })}
                      style={{ width: '100%', height: 40, borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '0 10px', fontSize: 13 }}
                    >
                      <option value="split-hero">Split Hero (2-Column)</option>
                      <option value="single-column">Single Column (Mobile)</option>
                      <option value="compact-card">Compact Card (Embed)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                      Header Style
                    </label>
                    <select
                      value={editingBlueprint.headerStyle}
                      onChange={(e) => setEditingBlueprint({ ...editingBlueprint, headerStyle: e.target.value as CheckoutBannerStyle })}
                      style={{ width: '100%', height: 40, borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '0 10px', fontSize: 13 }}
                    >
                      <option value="gradient">Gradient Accent</option>
                      <option value="dark">Dark Obsidian</option>
                      <option value="solid">Solid Color</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#CBD5E1', marginBottom: 6 }}>
                      Default Accent Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="color"
                        value={editingBlueprint.defaultAccentColor}
                        onChange={(e) => setEditingBlueprint({ ...editingBlueprint, defaultAccentColor: e.target.value })}
                        style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={editingBlueprint.defaultAccentColor}
                        onChange={(e) => setEditingBlueprint({ ...editingBlueprint, defaultAccentColor: e.target.value })}
                        style={{ flex: 1, height: 40, borderRadius: 8, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFFFFF', padding: '0 10px', fontSize: 13 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Permitted Egyptian Rails Toggles */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                    Permitted Egyptian Payment Rails (Hub Governance)
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>
                    Unchecking a rail prevents brand portals using this blueprint from exposing that method to students.
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingBlueprint.allowedPaymentRails.fawry}
                        onChange={(e) => setEditingBlueprint({
                          ...editingBlueprint,
                          allowedPaymentRails: { ...editingBlueprint.allowedPaymentRails, fawry: e.target.checked }
                        })}
                        style={{ accentColor: '#10B981', width: 16, height: 16 }}
                      />
                      <span>⚡ Fawry Direct Kiosk Reference</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingBlueprint.allowedPaymentRails.wallet}
                        onChange={(e) => setEditingBlueprint({
                          ...editingBlueprint,
                          allowedPaymentRails: { ...editingBlueprint.allowedPaymentRails, wallet: e.target.checked }
                        })}
                        style={{ accentColor: '#10B981', width: 16, height: 16 }}
                      />
                      <span>📱 Mobile Wallets &amp; InstaPay</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingBlueprint.allowedPaymentRails.card}
                        onChange={(e) => setEditingBlueprint({
                          ...editingBlueprint,
                          allowedPaymentRails: { ...editingBlueprint.allowedPaymentRails, card: e.target.checked }
                        })}
                        style={{ accentColor: '#10B981', width: 16, height: 16 }}
                      />
                      <span>💳 Visa / Mastercard</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingBlueprint.allowedPaymentRails.activationCode}
                        onChange={(e) => setEditingBlueprint({
                          ...editingBlueprint,
                          allowedPaymentRails: { ...editingBlueprint.allowedPaymentRails, activationCode: e.target.checked }
                        })}
                        style={{ accentColor: '#10B981', width: 16, height: 16 }}
                      />
                      <span>🎟️ Physical Scratch-Off Serial Codes</span>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#CBD5E1', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingBlueprint.isPublished}
                      onChange={(e) => setEditingBlueprint({ ...editingBlueprint, isPublished: e.target.checked })}
                      style={{ accentColor: '#10B981', width: 16, height: 16 }}
                    />
                    <span>Publish live to all Brand Portals template catalog</span>
                  </label>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setEditingBlueprint(null)}
                      style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#CBD5E1', fontSize: 12.5, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 20px', borderRadius: 8, background: '#10B981', border: 'none', color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Save &amp; Publish Blueprint
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
