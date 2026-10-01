'use client';

import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminCommissionPage() {
  return (
    <div className="shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Brand Platform Fees &amp; VAT Governance</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Centralized financial policy governance for all bldr-owned brands.
            </p>
          </div>
        </header>

        <div className="page-content fade-up" style={{ padding: '32px' }}>
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 12,
              padding: '24px 28px',
              maxWidth: 720,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🏛️</span>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#166534' }}>
                Governance Moved to Central Payment Hub
              </h2>
            </div>
            <p style={{ fontSize: 14, color: '#15803D', lineHeight: 1.6, margin: '0 0 20px' }}>
              Per platform architecture requirements, brand take rates, flat fees, dynamic VAT rates, and rolling reserves are configured and audited exclusively in the <strong>Central Payment Hub</strong>.
            </p>

            <a
              href="http://localhost:3003/commission"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#16A34A',
                color: '#FFF',
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Open Hub Fee &amp; VAT Governance (:3003/commission) &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
