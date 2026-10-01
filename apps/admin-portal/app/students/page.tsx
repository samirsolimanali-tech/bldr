'use client';

import React from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminStudentsPage() {
  const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || 'http://localhost:3003';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '40px', maxWidth: 1000 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
            Unified Student Directory
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Central cross-brand student records, lifetime value, and payment history across all bldr ventures.
          </p>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>🎓</span>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Single Source of Truth in Central Financial Hub
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
                To maintain strict data integrity and prevent duplicate synchronization drift, student identities and cross-venture enrollment histories are governed authoritatively in the Central Hub directory.
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#F1F5F9',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
              fontSize: 13,
              color: '#334155',
              lineHeight: 1.6,
            }}
          >
            <strong>Central Hub Directory Capabilities:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              <li>Cross-venture enrollment matching by verified phone number and email</li>
              <li>Aggregated lifetime gross spend across all operating brands</li>
              <li>Direct payment forensic drill-downs (Fawry, Geidea, Paymob)</li>
              <li>LMS webhook delivery and voucher redemption tracking</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href={`${hubUrl}/students`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#2E6F5E',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Open Hub Student Directory ↗
            </a>
            <Link
              href="/orders"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#334155',
                padding: '12px 20px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View Global Orders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
