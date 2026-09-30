'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { logoutHubUser } from '../lib/auth';

export interface HubTopBarProps {
  title: string;
  crumb?: string;
  activeVenture?: string;
  selectedVenture?: string;
  onVentureChange?: (venture: string) => void;
  onSelectVenture?: (venture: string) => void;
  env?: 'Sandbox' | 'Production';
  onEnvChange?: (env: 'Sandbox' | 'Production') => void;
  hasUnreadNotifications?: boolean;
}

export const VENTURES = [
  { id: 'all', name: 'All ventures', code: 'A', bg: '#1B2A4A', slug: 'all' },
  { id: 'BLDR', name: 'bldr (Storefront Pilot)', code: 'BLDR', bg: '#D10721', slug: 'bldr' },
  { id: 'SH', name: 'StudyHub', code: 'SH', bg: '#2E6F5E', slug: 'studyhub' },
  { id: 'AC', name: 'Apex Classes', code: 'AC', bg: '#2C5F9E', slug: 'apex' },
  { id: 'EH', name: 'EL HESA', code: 'EH', bg: '#B8860B', slug: 'el-hesa' },
  { id: 'CH', name: 'Career Hub', code: 'CH', bg: '#7A4CA0', slug: 'career-hub' },
];

export function resolveVentureObj(val?: string, customList?: Array<any>) {
  const list = customList && customList.length > 0 ? customList : VENTURES;
  if (!val) return list[0];
  const s = val.toLowerCase().trim();
  if (s === 'all' || s === 'all ventures') return list[0];
  if (s.includes('bldr')) return list.find(v => v.slug === 'bldr') || list[1] || list[0];
  if (s.includes('sh') || s.includes('study')) return list.find(v => v.slug === 'studyhub') || list[2] || list[0];
  if (s.includes('ac') || s.includes('apex')) return list.find(v => v.slug === 'apex') || list[3] || list[0];
  if (s.includes('eh') || s.includes('hesa')) return list.find(v => v.slug === 'el-hesa') || list[4] || list[0];
  if (s.includes('ch') || s.includes('career')) return list.find(v => v.slug === 'career-hub') || list[5] || list[0];
  return list.find(v => v.id.toLowerCase() === s || v.name.toLowerCase() === s || v.slug === s || (v.code && v.code.toLowerCase() === s)) || list[0];
}

export function matchVenture(recordVentureName: string, selectedVentureIdOrName?: string): boolean {
  if (!selectedVentureIdOrName) return true;
  const s = selectedVentureIdOrName.toLowerCase().trim();
  if (s === 'all' || s === 'all ventures') return true;
  const r = recordVentureName.toLowerCase().trim();
  if (s === 'bldr' || s.includes('bldr')) return r.includes('bldr');
  if (s === 'sh' || s.includes('study')) return r.includes('study');
  if (s === 'ac' || s.includes('apex')) return r.includes('apex');
  if (s === 'eh' || s.includes('hesa')) return r.includes('hesa');
  if (s === 'ch' || s.includes('career')) return r.includes('career');
  return r.includes(s) || s.includes(r);
}

export default function HubTopBar({
  title,
  crumb,
  activeVenture,
  selectedVenture: propSelectedVenture,
  onVentureChange,
  onSelectVenture,
  env = 'Production',
  onEnvChange,
  hasUnreadNotifications = true,
}: HubTopBarProps) {
  const effectiveEnv = env || 'Production';
  const effectiveVenture = propSelectedVenture || activeVenture || 'all';
  const [currentEnv, setCurrentEnv] = useState<'Sandbox' | 'Production'>(effectiveEnv);
  const [selectedVenture, setSelectedVenture] = useState(effectiveVenture);
  const [showVentureMenu, setShowVentureMenu] = useState(false);
  const [ventureList, setVentureList] = useState(VENTURES);

  const loadCustomVentures = () => {
    try {
      const stored = localStorage.getItem('bldr_custom_ventures');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customConverted = parsed.map((cv: any) => ({
            id: cv.id,
            name: cv.name,
            code: cv.code || cv.name.slice(0, 2).toUpperCase(),
            bg: cv.color || '#2E6F5E',
            slug: cv.id,
          }));
          const existingSlugs = new Set(VENTURES.map(v => v.slug));
          const unique = customConverted.filter((c: any) => !existingSlugs.has(c.slug));
          setVentureList([...VENTURES, ...unique]);
        }
      }
    } catch (e) {}
  };

  React.useEffect(() => {
    loadCustomVentures();
    const handleUpdate = () => loadCustomVentures();
    window.addEventListener('bldr:custom-ventures-updated', handleUpdate);
    return () => window.removeEventListener('bldr:custom-ventures-updated', handleUpdate);
  }, []);

  // Initialize from localStorage if none provided or set to 'all'
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('bldr_active_venture');
      if (stored && (!propSelectedVenture || propSelectedVenture === 'all' || propSelectedVenture === 'All ventures') && (!activeVenture || activeVenture === 'all')) {
        setSelectedVenture(stored);
        onVentureChange?.(stored);
        onSelectVenture?.(stored);
      }
    } catch (e) {}
  }, []);

  // Listen to custom cross-component venture changes
  React.useEffect(() => {
    const handler = (e: any) => {
      const newVenture = e?.detail;
      if (newVenture && newVenture !== selectedVenture) {
        setSelectedVenture(newVenture);
      }
    };
    window.addEventListener('bldr:venture-changed', handler);
    return () => window.removeEventListener('bldr:venture-changed', handler);
  }, [selectedVenture]);

  // Sync internal state when external prop changes
  React.useEffect(() => {
    if (activeVenture && activeVenture !== selectedVenture) {
      setSelectedVenture(activeVenture);
    }
  }, [activeVenture]);

  React.useEffect(() => {
    if (propSelectedVenture && propSelectedVenture !== selectedVenture) {
      setSelectedVenture(propSelectedVenture);
    }
  }, [propSelectedVenture]);

  React.useEffect(() => {
    if (env && env !== currentEnv) {
      setCurrentEnv(env);
    }
  }, [env]);

  const handleEnvToggle = (mode: 'Sandbox' | 'Production') => {
    setCurrentEnv(mode);
    onEnvChange?.(mode);
  };

  const handleVentureSelect = (id: string) => {
    setSelectedVenture(id);
    setShowVentureMenu(false);
    try {
      localStorage.setItem('bldr_active_venture', id);
      window.dispatchEvent(new CustomEvent('bldr:venture-changed', { detail: id }));
    } catch (e) {}
    onVentureChange?.(id);
    onSelectVenture?.(id);
  };

  const activeVentureObj = resolveVentureObj(selectedVenture, ventureList);
  const isProd = currentEnv === 'Production';

  return (
    <header
      style={{
        height: 64,
        background: '#FFFFFF',
        borderBottom: '1px solid #E3E8EF',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 28px',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Title & Breadcrumb */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        {crumb && (
          <span style={{ fontSize: 10.5, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.04em' }}>
            {crumb}
          </span>
        )}
        <h1 style={{ fontSize: 17, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
          {title}
        </h1>
      </div>

      <div style={{ flex: 1 }} />

      {/* Venture Switcher Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setShowVentureMenu(!showVentureMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 34,
            padding: '0 12px 0 10px',
            border: '1px solid #E3E8EF',
            borderRadius: 8,
            background: '#FBFCFD',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              background: activeVentureObj.bg,
              color: '#FFFFFF',
              fontSize: 8.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeVentureObj.code}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>
            {activeVentureObj.name}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#8A94A6" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2.2 4l2.8 2.8L7.8 4" />
          </svg>
        </button>

        {showVentureMenu && (
          <>
            <div
              onClick={() => setShowVentureMenu(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            />
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#FFFFFF',
                border: '1px solid #E3E8EF',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(27,42,74,0.12)',
                minWidth: 210,
                padding: 6,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <div style={{ padding: '6px 10px 4px', fontSize: 10, fontWeight: 700, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Active Venture
              </div>
              {ventureList.map(v => {
                const isSelected = activeVentureObj.id === v.id || activeVentureObj.slug === v.slug;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleVentureSelect(v.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: isSelected ? '#F0F4F8' : 'transparent',
                      color: isSelected ? '#1B2A4A' : '#5A6A80',
                      fontSize: 12,
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        background: v.bg,
                        color: '#FFFFFF',
                        fontSize: 8,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                      }}
                    >
                      {v.code}
                    </span>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</span>
                    {isSelected && (
                      <span style={{ color: '#2E6F5E', fontSize: 12, fontWeight: 800 }}>✓</span>
                    )}
                  </button>
                );
              })}
              <div style={{ borderTop: '1px solid #EEF1F5', marginTop: 4, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activeVentureObj.slug !== 'all' && (
                  <a
                    href={`/ventures/${activeVentureObj.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#2E6F5E',
                      textDecoration: 'none',
                      borderRadius: 6,
                    }}
                  >
                    <span>View {activeVentureObj.name} Config →</span>
                  </a>
                )}
                <a
                  href="/ventures"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#1B2A4A',
                    textDecoration: 'none',
                    borderRadius: 6,
                    background: '#F8FAFC',
                  }}
                >
                  <span>+ Manage & Add New Brands →</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Environment Switcher: Sandbox / Production */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 3,
          background: '#EEF1F5',
          borderRadius: 9,
          gap: 2,
        }}
      >
        <button
          type="button"
          onClick={() => handleEnvToggle('Sandbox')}
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: 7,
            border: 'none',
            cursor: 'pointer',
            background: !isProd ? '#FFFFFF' : 'transparent',
            color: !isProd ? '#B8860B' : '#8A94A6',
            boxShadow: !isProd ? '0 1px 2px rgba(27,42,74,0.10)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Sandbox
        </button>
        <button
          type="button"
          onClick={() => handleEnvToggle('Production')}
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: 7,
            border: 'none',
            cursor: 'pointer',
            background: isProd ? '#FFFFFF' : 'transparent',
            color: isProd ? '#1E8E5A' : '#8A94A6',
            boxShadow: isProd ? '0 1px 2px rgba(27,42,74,0.10)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Production
        </button>
      </div>

      {/* Vertical separator */}
      <div style={{ width: 1, height: 26, background: '#E3E8EF' }} />

      {/* Notification Bell */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: '1px solid #E3E8EF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5A6A80" strokeWidth="1.4" strokeLinecap="round">
          <path d="M8 2.6a3.4 3.4 0 00-3.4 3.4c0 3.4-1.4 4.4-1.4 4.4h9.6s-1.4-1-1.4-4.4A3.4 3.4 0 008 2.6zM6.8 13a1.4 1.4 0 002.4 0" />
        </svg>
        {hasUnreadNotifications && (
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#C0392B',
              border: '1.5px solid #FFFFFF',
            }}
          />
        )}
      </div>

      {/* Vertical separator */}
      <div style={{ width: 1, height: 26, background: '#E3E8EF' }} />

      {/* User Session & Logout in TopBar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          href="/login"
          title="Switch Account / View Login Screen"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '4px 8px 4px 5px',
            borderRadius: 8,
            border: '1px solid #E3E8EF',
            background: '#F8FAFC',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#2E6F5E',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            MG
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1B2A4A' }}>
            Login / Switch
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            logoutHubUser();
          }}
          title="Sign out of Central Hub"
          style={{
            height: 32,
            padding: '0 10px',
            borderRadius: 7,
            border: '1px solid #FEE2E2',
            background: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FEE2E2';
            e.currentTarget.style.color = '#B91C1C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FEF2F2';
            e.currentTarget.style.color = '#DC2626';
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 14H3.3a1.3 1.3 0 01-1.3-1.3V3.3A1.3 1.3 0 013.3 2H6" />
            <path d="M10.7 11.3L14 8l-3.3-3.3" />
            <path d="M14 8H6" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
