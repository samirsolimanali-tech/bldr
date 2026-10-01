'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminSidebar from '../../../components/AdminSidebar';

interface ProviderData {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Suspended';
  revenue: number;
  commissionRate: number;
  productsCount: number;
  servicesCount: number;
  enrolled: number;
  joined: string;
  avatar: string;
  color: string;
  paymentMethods: string[];
  gateway: string;
  payoutSchedule: string;
  description: string;
}

const PROVIDERS_MAP: Record<string, ProviderData> = {
  p1: { id: 'p1', name: 'StudyHub Academy', type: 'EdTech', email: 'hello@studyhub.io', phone: '+966 50 111 2233', status: 'Active', revenue: 312000, commissionRate: 10, productsCount: 8, servicesCount: 2, enrolled: 1240, joined: '2025-01-12', avatar: 'SH', color: '#0EA5E9', paymentMethods: ['Credit/Debit Card', 'Mada', 'Apple Pay', 'STC Pay'], gateway: 'Tap Payments', payoutSchedule: 'Weekly (Every Monday)', description: 'Leading EdTech platform offering structured bootcamps, cohort programs, and digital study passes.' },
  p2: { id: 'p2', name: 'Sidekick Studio', type: 'Creative & Marketing', email: 'work@sidekick.studio', phone: '+966 55 222 3344', status: 'Active', revenue: 198500, commissionRate: 15, productsCount: 2, servicesCount: 12, enrolled: 340, joined: '2025-02-08', avatar: 'SS', color: '#10B981', paymentMethods: ['Credit/Debit Card', 'Mobile Wallets', 'Apple Pay'], gateway: 'Geidea', payoutSchedule: 'Weekly Settlement', description: 'Full-service creative agency specializing in brand identity, video production, and performance marketing.' },
  p3: { id: 'p3', name: 'TechBridge Labs', type: 'Software', email: 'team@techbridge.dev', phone: '+966 54 333 4455', status: 'Active', revenue: 445000, commissionRate: 8, productsCount: 5, servicesCount: 8, enrolled: 680, joined: '2025-01-28', avatar: 'TB', color: '#7C3AED', paymentMethods: ['Credit/Debit Card', 'Mobile Wallets', 'Apple Pay'], gateway: 'Paymob', payoutSchedule: 'Weekly Settlement', description: 'Software engineering and cloud architecture firm delivering enterprise web applications and APIs.' },
};

const DEFAULT_PROVIDER: ProviderData = {
  id: 'p1',
  name: 'StudyHub Academy',
  type: 'EdTech',
  email: 'hello@studyhub.io',
  phone: '+966 50 111 2233',
  status: 'Active',
  revenue: 312000,
  commissionRate: 10,
  productsCount: 8,
  servicesCount: 2,
  enrolled: 1240,
  joined: '2025-01-12',
  avatar: 'SH',
  color: '#0EA5E9',
  paymentMethods: ['Credit/Debit Card', 'Mada', 'Apple Pay', 'STC Pay'],
  gateway: 'Tap Payments',
  payoutSchedule: 'Weekly (Every Monday)',
  description: 'Leading EdTech platform offering structured bootcamps, cohort programs, and digital study passes.',
};

export default function ProviderDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || 'p1';
  const initialData = PROVIDERS_MAP[rawId] || { ...DEFAULT_PROVIDER, id: rawId, name: `Provider ${rawId}` };

  const [provider, setProvider] = useState<ProviderData>(initialData);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState(provider.commissionRate.toString());

  const toggleStatus = () => {
    setProvider({
      ...provider,
      status: provider.status === 'Active' ? 'Suspended' : 'Active',
    });
  };

  const saveRate = () => {
    const num = parseFloat(rateInput);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setProvider({ ...provider, commissionRate: num });
    }
    setIsEditingRate(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/providers" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              ← Providers CRM
            </Link>
            <span style={{ color: 'var(--border-strong)' }}>/</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{provider.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={toggleStatus}
              style={{
                background: provider.status === 'Active' ? '#FEF2F2' : '#ECFDF5',
                color: provider.status === 'Active' ? '#DC2626' : '#059669',
                border: `1px solid ${provider.status === 'Active' ? '#FECACA' : '#A7F3D0'}`,
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {provider.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
            </button>
            <a
              href="http://localhost:3013/dashboard"
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'var(--brand)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Open Provider View ↗
            </a>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>
          {/* Provider Overview Card */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '28px 32px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: provider.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 800 }}>
                  {provider.avatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {provider.name}
                    </h1>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: provider.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                      color: provider.status === 'Active' ? '#065F46' : '#991B1B',
                    }}>
                      {provider.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 12px', maxWidth: 600 }}>
                    {provider.description}
                  </p>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>Email: {provider.email}</span>
                    <span>Phone: {provider.phone}</span>
                    <span>Joined: {provider.joined}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Gross Processed Volume</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>EGP {provider.revenue.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>↑ All-time transactions</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bldr Commission Rate</span>
                {!isEditingRate && (
                  <button onClick={() => setIsEditingRate(true)} style={{ background: 'none', border: 'none', color: 'var(--brand)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                )}
              </div>
              {isEditingRate ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    style={{ width: 70, padding: '4px 8px', border: '1px solid var(--border-strong)', borderRadius: 6, fontSize: 16, fontWeight: 700 }}
                  />
                  <span>%</span>
                  <button onClick={saveRate} style={{ background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>OK</button>
                </div>
              ) : (
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand)' }}>{provider.commissionRate}%</div>
              )}
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Platform revenue share</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Enrolled Students / Clients</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{provider.enrolled.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Across all cohorts</div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '20px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Published Catalog</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{provider.productsCount + provider.servicesCount} Items</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{provider.productsCount} products · {provider.servicesCount} services</div>
            </div>
          </div>

          {/* Config & Payment Rails */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Financial Configuration (Bldr Controlled)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Assigned Gateway</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{provider.gateway}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Settlement Payout Schedule</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{provider.payoutSchedule}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Currency Settlement</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>EGP (Egyptian Pound)</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '24px' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Enabled Payment Rails</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                Payment rails currently active for this provider's checkout links:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {provider.paymentMethods.map(m => (
                  <span key={m} style={{ padding: '6px 12px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', fontSize: 13, fontWeight: 600 }}>
                    ✓ {m}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <a href="http://localhost:3011/payment-methods" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>
                  Manage rails in Central Hub matrix →
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
