'use client';

import React, { useState, useEffect } from 'react';
import ProviderSidebar from '../../components/Sidebar';
import {
  getVentureCodes,
  generateBatchCodes,
  bulkImportCodes,
  updateCodeStatus,
  EnrollmentCode,
} from '../../lib/enrollment-codes';

export default function ActivationCodesPage() {
  const [ventureId, setVentureId] = useState('bldr');
  const [ventureName, setVentureName] = useState('bldr (Storefront Pilot)');
  const [codes, setCodes] = useState<EnrollmentCode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Generate Form State
  const [genCount, setGenCount] = useState(10);
  const [genPrefix, setGenPrefix] = useState('');
  const [genProduct, setGenProduct] = useState('bldr-founder-edition');
  const [genProductName, setGenProductName] = useState('Founder Edition Platform Access');
  const [genSource, setGenSource] = useState<'CENTER' | 'TUTOR' | 'PHYSICAL_STORE' | 'BATCH_DISTRIBUTION'>('CENTER');
  const [isGenerating, setIsGenerating] = useState(false);

  // Upload Form State
  const [csvContent, setCsvContent] = useState('');
  const [uploadProduct, setUploadProduct] = useState('bldr-founder-edition');
  const [uploadProductName, setUploadProductName] = useState('Founder Edition Platform Access');
  const [uploadSource, setUploadSource] = useState<'CENTER' | 'TUTOR' | 'PHYSICAL_STORE' | 'BATCH_DISTRIBUTION'>('CENTER');
  const [uploadResult, setUploadResult] = useState<{ imported: number; duplicates: number } | null>(null);

  // Load venture from storage
  useEffect(() => {
    try {
      const storedId = localStorage.getItem('bldr_venture_id') || 'bldr';
      const storedName = localStorage.getItem('bldr_venture_name') || 'bldr (Storefront Pilot)';
      setVentureId(storedId);
      setVentureName(storedName);

      // Default prefix and product
      if (storedId === 'studyhub') {
        setGenPrefix('SH');
        setGenProduct('math-term-1');
        setGenProductName('Full-Stack Engineering Bootcamp');
        setUploadProduct('math-term-1');
        setUploadProductName('Full-Stack Engineering Bootcamp');
      } else if (storedId === 'apex') {
        setGenPrefix('APEX');
        setGenProduct('cfa-level-1');
        setGenProductName('CFA Level 1 FastTrack');
        setUploadProduct('cfa-level-1');
        setUploadProductName('CFA Level 1 FastTrack');
      } else {
        setGenPrefix('BLDR');
        setGenProduct('bldr-founder-edition');
        setGenProductName('bldr Founder Edition');
        setUploadProduct('bldr-founder-edition');
        setUploadProductName('bldr Founder Edition');
      }

      // Load codes
      const list = getVentureCodes(storedId);
      setCodes(list);
    } catch (e) {
      setCodes(getVentureCodes('bldr'));
    }
  }, []);

  const refreshCodes = () => {
    const list = getVentureCodes(ventureId);
    setCodes(list);
  };

  // Copy helper
  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopyFeedback(code);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Handle batch generation
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      generateBatchCodes({
        ventureId,
        count: Number(genCount) || 5,
        productId: genProduct,
        productName: genProductName || genProduct,
        source: genSource,
        prefix: genPrefix.trim().toUpperCase() || undefined,
      });
      setIsGenerating(false);
      setShowGenerateModal(false);
      refreshCodes();
    }, 400);
  };

  // Handle CSV Bulk upload
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    const result = bulkImportCodes(
      ventureId,
      csvContent,
      uploadProductName || uploadProduct,
      uploadSource,
      uploadProduct
    );
    setUploadResult(result);
    refreshCodes();
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadResult(null);
      setCsvContent('');
    }, 1500);
  };

  // Handle Voiding
  const handleToggleVoid = (code: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'VOID' ? 'UNUSED' : 'VOID';
    updateCodeStatus(code, nextStatus as any);
    refreshCodes();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Code', 'Serial', 'Course/Product', 'Status', 'Source', 'Created At', 'Redeemed By', 'Redeemed Email', 'Redeemed At'];
    const rows = codes.map(c => [
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
    link.setAttribute('download', `${ventureId}_activation_codes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredCodes = codes.filter(c => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.redeemedByName && c.redeemedByName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.redeemedByEmail && c.redeemedByEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.productId && c.productId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.productName && c.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || c.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // KPIs
  const totalCount = codes.length;
  const unusedCount = codes.filter(c => c.status === 'UNUSED').length;
  const usedCount = codes.filter(c => c.status === 'USED').length;
  const voidCount = codes.filter(c => c.status === 'VOID' || c.status === 'EXPIRED').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />

      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <main style={{ padding: '32px 36px', maxWidth: 1240, width: '100%', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Activation Codes & Physical Serials
                </h1>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--brand)',
                  }}
                >
                  {ventureName}
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, maxWidth: 680 }}>
                Manage physical scratch cards, tutor serials, and offline vouchers. Students redeem these on the central hosted checkout to gain instant course access with zero gateway fees.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  height: 38,
                  padding: '0 14px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
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
                  height: 38,
                  padding: '0 14px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
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
                id="btn-open-generate"
                onClick={() => setShowGenerateModal(true)}
                style={{
                  height: 38,
                  padding: '0 16px',
                  borderRadius: 8,
                  background: 'var(--brand)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 6px rgba(209, 7, 33, 0.25)',
                }}
              >
                <span>➕</span> Generate Batch
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Codes Created
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4, fontFamily: 'IBM Plex Mono, monospace' }}>
                {totalCount}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                Physical cards & vouchers
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Unused & Redeemable
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a', marginTop: 4, fontFamily: 'IBM Plex Mono, monospace' }}>
                {unusedCount}
              </div>
              <div style={{ fontSize: 11.5, color: '#166534', marginTop: 4 }}>
                Ready for student checkout
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Redeemed & Enrolled
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2563eb', marginTop: 4, fontFamily: 'IBM Plex Mono, monospace' }}>
                {usedCount}
              </div>
              <div style={{ fontSize: 11.5, color: '#1E40AF', marginTop: 4 }}>
                Verified zero-value seats
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Voided / Expired
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626', marginTop: 4, fontFamily: 'IBM Plex Mono, monospace' }}>
                {voidCount}
              </div>
              <div style={{ fontSize: 11.5, color: '#991B1B', marginTop: 4 }}>
                Revoked or expired cards
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{ position: 'relative', width: 320 }}>
                <span style={{ position: 'absolute', left: 12, top: 10, fontSize: 13, color: 'var(--text-muted)' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search code, student, email, course..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    height: 38,
                    paddingLeft: 34,
                    paddingRight: 12,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: 13,
                    outline: 'none',
                    background: 'var(--bg-canvas)',
                  }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: 13,
                  outline: 'none',
                  background: '#FFFFFF',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="UNUSED">Unused (Available)</option>
                <option value="USED">Used (Redeemed)</option>
                <option value="VOID">Voided / Revoked</option>
                <option value="EXPIRED">Expired</option>
              </select>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                style={{
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: 13,
                  outline: 'none',
                  background: '#FFFFFF',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="ALL">All Sources</option>
                <option value="CENTER">Center / Academy</option>
                <option value="TUTOR">Tutor Distribution</option>
                <option value="PHYSICAL_STORE">Physical Store / Bookstore</option>
                <option value="BATCH_DISTRIBUTION">Batch Distribution</option>
              </select>
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              Showing <strong>{filteredCodes.length}</strong> of <strong>{codes.length}</strong> codes
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Code / Serial</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Target Course</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Channel Source</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>Redemption Details</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 18px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>No codes found</div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>Generate a batch or bulk import codes to get started.</div>
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map(item => {
                    const isUnused = item.status === 'UNUSED';
                    const isUsed = item.status === 'USED';
                    const isVoid = item.status === 'VOID';

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          transition: 'background 0.1s ease',
                        }}
                      >
                        {/* Code */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                fontFamily: 'IBM Plex Mono, monospace',
                                fontWeight: 700,
                                fontSize: 13.5,
                                color: isVoid ? '#94A3B8' : '#0F172A',
                                textDecoration: isVoid ? 'line-through' : 'none',
                              }}
                            >
                              {item.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.code)}
                              title="Copy code"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 12,
                                padding: 2,
                                color: copyFeedback === item.code ? '#16A34A' : '#94A3B8',
                              }}
                            >
                              {copyFeedback === item.code ? '✓' : '📋'}
                            </button>
                          </div>
                          {item.serial && (
                            <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'IBM Plex Mono, monospace' }}>
                              {item.serial}
                            </div>
                          )}
                        </td>

                        {/* Course */}
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {item.productName || item.productId}
                          </span>
                        </td>

                        {/* Source */}
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: '#F1F5F9',
                              color: '#475569',
                            }}
                          >
                            {item.source || 'CENTER'}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 18px' }}>
                          {isUnused && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: '#DCFCE7',
                                color: '#15803D',
                              }}
                            >
                              UNUSED
                            </span>
                          )}
                          {isUsed && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: '#DBEAFE',
                                color: '#1D4ED8',
                              }}
                            >
                              REDEEMED
                            </span>
                          )}
                          {isVoid && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: '#FEE2E2',
                                color: '#B91C1C',
                              }}
                            >
                              VOID
                            </span>
                          )}
                        </td>

                        {/* Redemption Details */}
                        <td style={{ padding: '14px 18px' }}>
                          {isUsed ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>
                                {item.redeemedByName || 'Verified Student'}
                              </span>
                              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                                {item.redeemedByEmail} • {item.redeemedAt?.slice(0, 10)}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11.5, color: '#94A3B8' }}>— Not yet redeemed</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          {isUnused && (
                            <button
                              type="button"
                              onClick={() => handleToggleVoid(item.code, item.status)}
                              style={{
                                background: 'transparent',
                                border: '1px solid #FECACA',
                                color: '#DC2626',
                                borderRadius: 6,
                                padding: '4px 10px',
                                fontSize: 11.5,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Void Code
                            </button>
                          )}
                          {isVoid && (
                            <button
                              type="button"
                              onClick={() => handleToggleVoid(item.code, item.status)}
                              style={{
                                background: 'transparent',
                                border: '1px solid #CBD5E1',
                                color: '#475569',
                                borderRadius: 6,
                                padding: '4px 10px',
                                fontSize: 11.5,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Reactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL 1: GENERATE BATCH OF CODES
         ═══════════════════════════════════════════════════════════ */}
      {showGenerateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              width: '100%',
              maxWidth: 480,
              padding: 24,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🎟️</span>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Generate Activation Codes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Number of Codes to Generate
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={genCount}
                  onChange={e => setGenCount(Number(e.target.value))}
                  style={{ width: '100%', height: 38, border: '1px solid #CBD5E1', borderRadius: 8, padding: '0 12px', fontSize: 13.5 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Code Prefix (Uppercase)
                </label>
                <input
                  type="text"
                  value={genPrefix}
                  onChange={e => setGenPrefix(e.target.value.toUpperCase())}
                  placeholder="e.g. SH, BLDR, APEX"
                  style={{ width: '100%', height: 38, border: '1px solid #CBD5E1', borderRadius: 8, padding: '0 12px', fontSize: 13.5, fontFamily: 'IBM Plex Mono, monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Course / Product Title
                </label>
                <input
                  type="text"
                  value={genProductName}
                  onChange={e => setGenProductName(e.target.value)}
                  placeholder="e.g. Full-Stack Engineering Bootcamp"
                  style={{ width: '100%', height: 38, border: '1px solid #CBD5E1', borderRadius: 8, padding: '0 12px', fontSize: 13.5 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Offline Channel Source
                </label>
                <select
                  value={genSource}
                  onChange={e => setGenSource(e.target.value as any)}
                  style={{ width: '100%', height: 38, border: '1px solid #CBD5E1', borderRadius: 8, padding: '0 12px', fontSize: 13.5 }}
                >
                  <option value="CENTER">Center / Educational Academy</option>
                  <option value="TUTOR">Private Tutor Batch</option>
                  <option value="PHYSICAL_STORE">Physical Store / Bookstore</option>
                  <option value="BATCH_DISTRIBUTION">General Event / Conference Distribution</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  style={{ flex: 1, height: 40, border: '1px solid #CBD5E1', borderRadius: 8, background: '#FFFFFF', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  style={{ flex: 1, height: 40, border: 'none', borderRadius: 8, background: 'var(--brand)', color: '#FFFFFF', fontWeight: 700, fontSize: 13, cursor: isGenerating ? 'wait' : 'pointer' }}
                >
                  {isGenerating ? 'Generating...' : `Generate ${genCount} Codes`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 2: BULK IMPORT CSV
         ═══════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              width: '100%',
              maxWidth: 520,
              padding: 24,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Bulk Import Codes (CSV)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Paste Codes or CSV Lines
                </label>
                <textarea
                  rows={6}
                  value={csvContent}
                  onChange={e => setCsvContent(e.target.value)}
                  placeholder={`SH-2026-A101\nSH-2026-A102\nSH-2026-A103`}
                  style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: 8, padding: 10, fontSize: 12.5, fontFamily: 'IBM Plex Mono, monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Default Course Title
                  </label>
                  <input
                    type="text"
                    value={uploadProductName}
                    onChange={e => setUploadProductName(e.target.value)}
                    style={{ width: '100%', height: 38, border: '1px solid #CBD5E1', borderRadius: 8, padding: '0 12px', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Default Channel Source
                  </label>
                  <select
                    value={uploadSource}
                    onChange={e => setUploadSource(e.target.value as any)}
                    style={{ width: '100%', height: 38, border: '1px solid #CBD5E1', borderRadius: 8, padding: '0 12px', fontSize: 13 }}
                  >
                    <option value="CENTER">Center / Academy</option>
                    <option value="TUTOR">Tutor Batch</option>
                    <option value="PHYSICAL_STORE">Physical Store</option>
                    <option value="BATCH_DISTRIBUTION">Batch Distribution</option>
                  </select>
                </div>
              </div>

              {uploadResult && (
                <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 8, padding: 10, fontSize: 12.5, color: '#166534', fontWeight: 600 }}>
                  Successfully imported {uploadResult.imported} codes ({uploadResult.duplicates} duplicates skipped).
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{ flex: 1, height: 40, border: '1px solid #CBD5E1', borderRadius: 8, background: '#FFFFFF', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, height: 40, border: 'none', borderRadius: 8, background: 'var(--brand)', color: '#FFFFFF', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                  Import Codes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
