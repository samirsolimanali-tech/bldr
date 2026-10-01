'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar, { matchVenture } from '../../components/HubTopBar';
import {
  CheckoutTemplateBlueprint,
  BrandCheckoutConfig,
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
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewBrand, setPreviewBrand] = useState<BrandCheckoutConfig | null>(null);

  // Master Template Architect / Editor State
  const [editingBlueprint, setEditingBlueprint] = useState<CheckoutTemplateBlueprint | null>(null);
  const [isNewBlueprint, setIsNewBlueprint] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Interactive Live Preview State
  const [activeRail, setActiveRail] = useState<'FAWRY' | 'WALLET' | 'CARD' | 'CODE'>('FAWRY');
  const [fawryRefCode, setFawryRefCode] = useState('788-9921-4820');
  const [activationCodeInput, setActivationCodeInput] = useState('');
  const [codeRedeemed, setCodeRedeemed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load state on mount and listen to storage sync events
  useEffect(() => {
    setBlueprints(getMasterBlueprints());
    setBrandConfigs(getBrandCheckoutConfigs());

    const handleBlueprintsUpdated = () => setBlueprints(getMasterBlueprints());
    const handleConfigsUpdated = () => setBrandConfigs(getBrandCheckoutConfigs());

    window.addEventListener('bldr:blueprints-updated', handleBlueprintsUpdated);
    window.addEventListener('bldr:checkout-config-updated', handleConfigsUpdated);
    window.addEventListener('storage', handleConfigsUpdated);

    // Sync active venture from HubTopBar
    try {
      const sv = localStorage.getItem('bldr_active_venture');
      if (sv) setSelectedVenture(sv);
    } catch {}
    const onVentureChanged = (e: any) => { if (e?.detail) setSelectedVenture(e.detail); };
    window.addEventListener('bldr:venture-changed', onVentureChanged);

    return () => {
      window.removeEventListener('bldr:blueprints-updated', handleBlueprintsUpdated);
      window.removeEventListener('bldr:checkout-config-updated', handleConfigsUpdated);
      window.removeEventListener('storage', handleConfigsUpdated);
      window.removeEventListener('bldr:venture-changed', onVentureChanged);
    };
  }, []);

  // Filtered active brand checkouts
  const filteredBrands = brandConfigs.filter((brand) => {
    const matchesVenture = matchVenture(brand.ventureName, selectedVenture);
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
      defaultAccentColor: '#2E6F5E',
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

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#FAF9F5', overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <HubSidebar active="Checkout Studio & Monitor" />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Checkout Studio & Active Pages Monitor"
          crumb="Governance"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header & Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ fontFamily: 'var(--font-display,serif)', fontSize: 22, fontWeight: 700, color: '#14171C', margin: 0 }}>
                  Checkout Governance &amp; Live Pages
                </h1>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: '#E6EFEB', color: '#2E6F5E', border: '1px solid #BFD8CD' }}>
                  PCI-DSS Level 1
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: '#E8EEF7', color: '#2C5F9E', border: '1px solid #C4D5EB' }}>
                  Multi-Gateway Routing
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#5B6169', marginTop: 4, marginBottom: 0 }}>
                Master blueprints are governed centrally on the Hub. Brand portals inherit certified layouts and configure local styling.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', background: '#FFFFFF', padding: 4, borderRadius: 10, border: '1px solid #E4E1DA', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', gap: 4 }}>
              <button
                id="btn-tab-monitor"
                onClick={() => setActiveTab('MONITOR')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 7,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'MONITOR' ? '#2E6F5E' : 'transparent',
                  color: activeTab === 'MONITOR' ? '#FFFFFF' : '#5B6169',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🖥️ Active Pages Monitor</span>
                <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 4, background: activeTab === 'MONITOR' ? 'rgba(0,0,0,0.2)' : '#F1F5F9', color: activeTab === 'MONITOR' ? '#FFF' : '#64748B' }}>
                  {brandConfigs.length}
                </span>
              </button>

              <button
                id="btn-tab-architect"
                onClick={() => setActiveTab('ARCHITECT')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 7,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'ARCHITECT' ? '#263C8B' : 'transparent',
                  color: activeTab === 'ARCHITECT' ? '#FFFFFF' : '#5B6169',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🎨 Master Blueprint Architect</span>
                <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 4, background: activeTab === 'ARCHITECT' ? 'rgba(0,0,0,0.2)' : '#F1F5F9', color: activeTab === 'ARCHITECT' ? '#FFF' : '#64748B' }}>
                  {blueprints.length}
                </span>
              </button>
            </div>
          </div>

          {/* Success Notification Banner */}
          {saveSuccessMsg && (
            <div style={{ padding: '10px 16px', borderRadius: 8, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✓</span> {saveSuccessMsg}
            </div>
          )}

          {/* KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E4E1DA', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Monitored Live Checkouts
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#14171C', marginTop: 4 }}>
                {activeCount} <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>Active</span>
                <span style={{ fontSize: 12, color: '#8A9099', marginLeft: 6 }}>/ {brandConfigs.length} total</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#8A9099', marginTop: 3 }}>
                Across registered brand portals
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E4E1DA', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Processed Volume
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#263C8B', marginTop: 4 }}>
                EGP {(totalVolume / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: 11.5, color: '#8A9099', marginTop: 3 }}>
                Settled through Geidea, Paymob &amp; Fawry
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E4E1DA', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                24h Enrolled Students
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#7A4CA0', marginTop: 4 }}>
                {totalStudents} <span style={{ fontSize: 12, color: '#8A9099', fontWeight: 500 }}>paid enrollments</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#8A9099', marginTop: 3 }}>
                Online rails + serial code activations
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E4E1DA', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hub Master Blueprints
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#B8860B', marginTop: 4 }}>
                {blueprints.length} <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Standardized</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#8A9099', marginTop: 3 }}>
                Governed centrally • 0-Code for brands
              </div>
            </div>
          </div>

          {/* ─── TAB 1: ACTIVE PAGES & VENTURES MONITOR ─── */}
          {activeTab === 'MONITOR' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Filter Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: 360, background: '#FFFFFF', border: '1px solid #E4E1DA', borderRadius: 8, height: 36, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                    <span style={{ color: '#8A9099', marginRight: 8, fontSize: 13 }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search brand, venture, or gateway..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        color: '#14171C',
                        fontSize: 13,
                        background: 'transparent',
                      }}
                    />
                  </div>

                  {selectedVenture !== 'all' && (
                    <span style={{ fontSize: 12, color: '#263C8B', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                      Venture: {selectedVenture}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: '#5B6169' }}>
                  <span>Showing <strong>{filteredBrands.length}</strong> monitored checkouts</span>
                  <button
                    onClick={() => setActiveTab('ARCHITECT')}
                    style={{
                      background: '#263C8B',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: 7,
                      padding: '7px 14px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(38,60,139,0.25)',
                    }}
                  >
                    Architect New Blueprint →
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
                {filteredBrands.map((brand) => {
                  const assignedBp = blueprints.find((b) => b.id === brand.templateId) || blueprints[0];
                  return (
                    <div
                      key={brand.ventureId}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E4E1DA',
                        borderRadius: 14,
                        padding: 22,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                        gap: 16,
                      }}
                    >
                      <div>
                        {/* Brand Card Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
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
                                fontSize: 13,
                              }}
                            >
                              {brand.brandLogoText || brand.ventureId.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: '#14171C' }}>
                                {brand.brandName}
                              </div>
                              <div style={{ fontSize: 12, color: '#8A9099' }}>
                                Venture: {brand.ventureName}
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <button
                            type="button"
                            onClick={() => handleToggleBrandStatus(brand.ventureId)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              background: brand.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2',
                              color: brand.status === 'ACTIVE' ? '#065F46' : '#991B1B',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: brand.status === 'ACTIVE' ? '#059669' : '#DC2626' }} />
                            {brand.status}
                          </button>
                        </div>

                        {/* Assigned Blueprint */}
                        <div style={{ background: '#FAF9F5', padding: '10px 12px', borderRadius: 8, marginBottom: 14, border: '1px solid #E4E1DA' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 11.5, color: '#5B6169' }}>Active Hub Template:</span>
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#263C8B' }}>{assignedBp?.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: 11.5, color: '#5B6169' }}>Layout Model:</span>
                            <span style={{ fontSize: 11.5, color: '#14171C', textTransform: 'capitalize' }}>{assignedBp?.layout.replace('-', ' ')}</span>
                          </div>
                        </div>

                        {/* Gateway & Rails */}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: '#5B6169' }}>Connected Gateway:</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{brand.connectedGateway}</span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {brand.activeRails.fawry && (
                              <span style={{ fontSize: 10.5, background: '#FEF3C7', color: '#92400E', padding: '2px 7px', borderRadius: 5, fontWeight: 600 }}>
                                ⚡ Fawry Kiosk
                              </span>
                            )}
                            {brand.activeRails.wallet && (
                              <span style={{ fontSize: 10.5, background: '#FEE2E2', color: '#991B1B', padding: '2px 7px', borderRadius: 5, fontWeight: 600 }}>
                                📱 Mobile Wallets
                              </span>
                            )}
                            {brand.activeRails.card && (
                              <span style={{ fontSize: 10.5, background: '#EFF6FF', color: '#1E40AF', padding: '2px 7px', borderRadius: 5, fontWeight: 600 }}>
                                💳 Visa / Mastercard
                              </span>
                            )}
                            {brand.activeRails.activationCode && (
                              <span style={{ fontSize: 10.5, background: '#ECFDF5', color: '#065F46', padding: '2px 7px', borderRadius: 5, fontWeight: 600 }}>
                                🎟️ Serial Code Activation
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Conversions & Volume */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px', background: '#FAF9F5', borderRadius: 8, border: '1px solid #E4E1DA' }}>
                          <div>
                            <div style={{ fontSize: 10, color: '#8A9099', textTransform: 'uppercase', fontWeight: 700 }}>24h Paid Enrollments</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#14171C', marginTop: 2 }}>{brand.conversions24h} students</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: '#8A9099', textTransform: 'uppercase', fontWeight: 700 }}>Gross Volume</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#263C8B', marginTop: 2 }}>EGP {brand.totalVolumeEgp.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #F0EFEA' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(brand)}
                          style={{
                            flex: 1,
                            height: 36,
                            borderRadius: 8,
                            background: '#263C8B',
                            border: 'none',
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
                          <span>👁️ Inspect Live Checkout</span>
                        </button>

                        <Link
                          href={`/ventures/${brand.ventureId}`}
                          style={{
                            height: 36,
                            padding: '0 12px',
                            borderRadius: 8,
                            background: '#FFFFFF',
                            border: '1px solid #E4E1DA',
                            color: '#5B6169',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                          }}
                        >
                          Venture Config →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── TAB 2: MASTER BLUEPRINT ARCHITECT ─── */}
          {activeTab === 'ARCHITECT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Architect Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display,serif)', fontSize: 18, fontWeight: 700, color: '#14171C', margin: 0 }}>
                    Central Master Blueprints Catalog
                  </h2>
                  <p style={{ fontSize: 12.5, color: '#5B6169', marginTop: 3, marginBottom: 0 }}>
                    Standardized templates dictating layout, payment routing, and compliance seals across all venture storefronts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartNewBlueprint}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    background: '#263C8B',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 1px 3px rgba(38,60,139,0.25)',
                  }}
                >
                  <span>+ Architect New Master Blueprint</span>
                </button>
              </div>

              {/* Blueprints Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 18 }}>
                {blueprints.map((bp) => {
                  const brandsUsingThis = brandConfigs.filter((b) => b.templateId === bp.id);
                  return (
                    <div
                      key={bp.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E4E1DA',
                        borderRadius: 14,
                        padding: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div>
                        {/* Top Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#EFF6FF', color: '#1E40AF', border: '1px solid #DBEAFE' }}>
                            {bp.badge}
                          </span>
                          <span style={{ fontSize: 11, color: '#8A9099' }}>
                            Version {bp.version}
                          </span>
                        </div>

                        <div style={{ fontSize: 17, fontWeight: 700, color: '#14171C', marginBottom: 2 }}>
                          {bp.name}
                        </div>
                        <div style={{ fontSize: 12.5, color: '#5B6169', direction: 'rtl', marginBottom: 8, textAlign: 'right' }}>
                          {bp.nameAr}
                        </div>

                        <p style={{ fontSize: 12.5, color: '#5B6169', lineHeight: 1.5, marginBottom: 16 }}>
                          {bp.description}
                        </p>

                        {/* Specs */}
                        <div style={{ background: '#FAF9F5', padding: '12px 14px', borderRadius: 8, marginBottom: 16, border: '1px solid #E4E1DA' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 12 }}>
                            <div>
                              <span style={{ color: '#8A9099' }}>Layout Model:</span>{' '}
                              <strong style={{ color: '#14171C', textTransform: 'capitalize' }}>{bp.layout.replace('-', ' ')}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#8A9099' }}>Header Banner:</span>{' '}
                              <strong style={{ color: '#14171C', textTransform: 'capitalize' }}>{bp.headerStyle}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#8A9099' }}>Default Accent:</span>{' '}
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: bp.defaultAccentColor }} />
                                <strong style={{ color: '#14171C' }}>{bp.defaultAccentColor}</strong>
                              </span>
                            </div>
                            <div>
                              <span style={{ color: '#8A9099' }}>Status:</span>{' '}
                              <strong style={{ color: bp.isPublished ? '#059669' : '#DC2626' }}>
                                {bp.isPublished ? 'Live in Brand Portals' : 'Draft / Private'}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Allowed Rails */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#8A9099', textTransform: 'uppercase', marginBottom: 6 }}>
                            Permitted Payment Rails (Enforced by Hub)
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {bp.allowedPaymentRails.fawry && (
                              <span style={{ fontSize: 10.5, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4 }}>
                                ⚡ Fawry Kiosk
                              </span>
                            )}
                            {bp.allowedPaymentRails.wallet && (
                              <span style={{ fontSize: 10.5, background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: 4 }}>
                                📱 Mobile Wallets
                              </span>
                            )}
                            {bp.allowedPaymentRails.card && (
                              <span style={{ fontSize: 10.5, background: '#EFF6FF', color: '#1E40AF', padding: '2px 6px', borderRadius: 4 }}>
                                💳 Visa / Mastercard
                              </span>
                            )}
                            {bp.allowedPaymentRails.activationCode && (
                              <span style={{ fontSize: 10.5, background: '#ECFDF5', color: '#065F46', padding: '2px 6px', borderRadius: 4 }}>
                                🎟️ Serial Voucher
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ fontSize: 12, color: '#8A9099' }}>
                          Used by <strong>{brandsUsingThis.length}</strong> venture{brandsUsingThis.length === 1 ? '' : 's'}:{' '}
                          {brandsUsingThis.map((b) => b.brandName).join(', ') || 'None yet'}
                        </div>
                      </div>

                      {/* Edit Blueprint */}
                      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #F0EFEA' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBlueprint(bp);
                            setIsNewBlueprint(false);
                          }}
                          style={{
                            width: '100%',
                            height: 36,
                            borderRadius: 8,
                            background: '#FFFFFF',
                            border: '1px solid #E4E1DA',
                            color: '#14171C',
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
        </div>
      </div>

      {/* ─── MODAL 1: LIVE BRAND CHECKOUT INSPECTOR ─── */}
      {previewBrand && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(18, 32, 60, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewBrand(null);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 820,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2E6F5E', background: '#E6EFEB', padding: '3px 8px', borderRadius: 6 }}>
                  Live Inspection
                </span>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1B2A4A' }}>
                  {previewBrand.brandName} • Checkout Simulator
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewBrand(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8A94A6',
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
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: '1px solid #E3E8EF',
                  overflow: 'hidden',
                }}
              >
                {/* Brand Header Banner */}
                <div
                  style={{
                    background: previewBrand.bannerStyle === 'gradient'
                      ? `linear-gradient(135deg, ${previewBrand.accentColor} 0%, #12203C 100%)`
                      : previewBrand.accentColor,
                    color: '#FFFFFF',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: '#FFFFFF',
                        color: previewBrand.accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      {previewBrand.brandLogoText || 'SH'}
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800 }}>{previewBrand.brandName}</div>
                      <div style={{ fontSize: 12, opacity: 0.9 }}>{previewBrand.tagline || 'Official Course Enrollment'}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>Total Amount</div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>EGP 1,200.00</div>
                  </div>
                </div>

                {/* Simulated Payment Rails */}
                <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1B2A4A' }}>
                    Select Payment Method
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {[
                      { key: 'FAWRY', label: 'Fawry Kiosk', icon: '⚡' },
                      { key: 'WALLET', label: 'Mobile Wallet', icon: '📱' },
                      { key: 'CARD', label: 'Bank Card', icon: '💳' },
                      { key: 'CODE', label: 'Serial Code', icon: '🎟️' },
                    ].map((rail) => (
                      <button
                        key={rail.key}
                        type="button"
                        onClick={() => setActiveRail(rail.key as any)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: 8,
                          border: activeRail === rail.key ? `2px solid ${previewBrand.accentColor}` : '1px solid #E3E8EF',
                          background: activeRail === rail.key ? '#F0F9FF' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#1B2A4A',
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{rail.icon}</span>
                        <span>{rail.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Rail Box */}
                  <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 18, border: '1px solid #E3E8EF' }}>
                    {activeRail === 'FAWRY' && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#5A6A80' }}>Fawry Pay Reference Number:</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#1B2A4A', fontFamily: 'monospace', margin: '8px 0' }}>
                          {fawryRefCode}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#5A6A80' }}>
                          Pay cash at any Fawry retail point before expiry in 48 hours.
                        </div>
                      </div>
                    )}

                    {activeRail === 'WALLET' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>Enter Egyptian Mobile Number</label>
                        <input
                          type="tel"
                          defaultValue="01012345678"
                          style={{ height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                        />
                        <button type="button" style={{ height: 38, borderRadius: 8, background: previewBrand.accentColor, color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                          Send Wallet Request OTP
                        </button>
                      </div>
                    )}

                    {activeRail === 'CARD' && (
                      <div style={{ textAlign: 'center', padding: '12px' }}>
                        <div style={{ fontSize: 13, color: '#5A6A80' }}>
                          Hosted checkout provided via <strong>{previewBrand.connectedGateway}</strong> PCI-DSS tokenized iframe.
                        </div>
                      </div>
                    )}

                    {activeRail === 'CODE' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          placeholder="Enter 12-digit activation voucher"
                          value={activationCodeInput}
                          onChange={(e) => setActivationCodeInput(e.target.value)}
                          style={{ flex: 1, height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                        />
                        <button
                          type="button"
                          onClick={() => setCodeRedeemed(true)}
                          style={{ padding: '0 16px', borderRadius: 8, background: '#2E6F5E', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {codeRedeemed ? '✓ Activated' : 'Redeem Code'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: BLUEPRINT ARCHITECT / EDITOR ─── */}
      {editingBlueprint && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(18, 32, 60, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingBlueprint(null);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              padding: 28,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display,serif)', fontSize: 18, fontWeight: 700, color: '#14171C', margin: 0 }}>
                {isNewBlueprint ? 'Architect New Master Blueprint' : `Edit Blueprint: ${editingBlueprint.name}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditingBlueprint(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: '#8A9099', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlueprint} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>
                  Blueprint Name (EN)
                </label>
                <input
                  required
                  value={editingBlueprint.name}
                  onChange={(e) => setEditingBlueprint({ ...editingBlueprint, name: e.target.value })}
                  style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>
                  Blueprint Name (AR)
                </label>
                <input
                  dir="rtl"
                  required
                  value={editingBlueprint.nameAr}
                  onChange={(e) => setEditingBlueprint({ ...editingBlueprint, nameAr: e.target.value })}
                  style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingBlueprint.description}
                  onChange={(e) => setEditingBlueprint({ ...editingBlueprint, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Layout Model</label>
                  <select
                    value={editingBlueprint.layout}
                    onChange={(e) => setEditingBlueprint({ ...editingBlueprint, layout: e.target.value as any })}
                    style={{ width: '100%', height: 38, padding: '0 10px', borderRadius: 8, border: '1px solid #C8C4BC', fontSize: 13, background: '#FFF' }}
                  >
                    <option value="split-hero">Split-Hero (Standard)</option>
                    <option value="single-column">Single Column (Compact)</option>
                    <option value="multi-step">Multi-Step Modal</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#5B6169', marginBottom: 5 }}>Default Accent</label>
                  <input
                    type="color"
                    value={editingBlueprint.defaultAccentColor}
                    onChange={(e) => setEditingBlueprint({ ...editingBlueprint, defaultAccentColor: e.target.value })}
                    style={{ width: '100%', height: 38, padding: '2px 4px', borderRadius: 8, border: '1px solid #C8C4BC', background: '#FFF' }}
                  />
                </div>
              </div>

              {/* Rails Checkboxes */}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#14171C', marginBottom: 8 }}>
                  Enforced Payment Rails
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[
                    { key: 'fawry', label: 'Fawry Kiosk' },
                    { key: 'wallet', label: 'Mobile Wallets' },
                    { key: 'card', label: 'Visa / Mastercard' },
                    { key: 'activationCode', label: 'Serial Voucher' },
                  ].map((rail) => (
                    <label key={rail.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#14171C', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingBlueprint.allowedPaymentRails[rail.key as keyof typeof editingBlueprint.allowedPaymentRails]}
                        onChange={(e) =>
                          setEditingBlueprint({
                            ...editingBlueprint,
                            allowedPaymentRails: {
                              ...editingBlueprint.allowedPaymentRails,
                              [rail.key]: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>{rail.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingBlueprint(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #E4E1DA', background: '#FFF', fontSize: 13, cursor: 'pointer', color: '#5B6169' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#263C8B', color: '#FFF', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Save &amp; Publish Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
