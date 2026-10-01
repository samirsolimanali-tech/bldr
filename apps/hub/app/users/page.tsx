'use client';

import React, { useState, useEffect } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  password?: string;
  portal: 'Brand Financial Portal' | 'Central Payment Hub';
  role: 'Brand Financial Admin' | 'Brand Operations Admin' | 'Finance Viewer' | 'Super Admin' | 'Finance Admin';
  ventureId: string;
  ventureName: string;
  ventureColor: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  lastActive: string;
  createdAt: string;
}

const BASE_VENTURES = [
  { id: 'bldr', name: 'bldr (Storefront Pilot)', code: 'BLDR', color: '#D10721' },
  { id: 'studyhub', name: 'StudyHub Academy', code: 'SH', color: '#2E6F5E' },
  { id: 'apex', name: 'Apex Classes', code: 'AC', color: '#1B2A4A' },
  { id: 'el-hesa', name: 'EL HESA Institute', code: 'EH', color: '#B8860B' },
  { id: 'career-hub', name: 'Career Hub', code: 'CH', color: '#7A4CA0' },
];

const INITIAL_USERS: UserItem[] = [
  {
    id: 'usr-hub-1',
    name: 'Mohammad Gamal',
    email: 'm.gamal@bldr.com',
    portal: 'Central Payment Hub',
    role: 'Super Admin',
    ventureId: 'global',
    ventureName: 'All Ventures (Treasury)',
    ventureColor: '#12203C',
    status: 'ACTIVE',
    lastActive: 'Just now',
    createdAt: '2026-08-01',
  },
  {
    id: 'usr-hub-2',
    name: 'Karim Mostafa',
    email: 'k.mostafa@bldr.com',
    portal: 'Central Payment Hub',
    role: 'Finance Admin',
    ventureId: 'global',
    ventureName: 'All Ventures (Ledger & Payouts)',
    ventureColor: '#12203C',
    status: 'ACTIVE',
    lastActive: '15 Sep 04:12',
    createdAt: '2026-08-15',
  },
  {
    id: 'usr-bldr-1',
    name: 'bldr Store Team',
    email: 'team@bldr.io',
    password: 'Provider@bldr2024!',
    portal: 'Brand Financial Portal',
    role: 'Brand Financial Admin',
    ventureId: 'bldr',
    ventureName: 'bldr (Storefront Pilot)',
    ventureColor: '#D10721',
    status: 'ACTIVE',
    lastActive: 'Today 11:20',
    createdAt: '2026-09-01',
  },
  {
    id: 'usr-sh-1',
    name: 'Sarah Ibrahim',
    email: 'sarah@studyhub.eg',
    password: 'StudyHub2026!',
    portal: 'Brand Financial Portal',
    role: 'Brand Financial Admin',
    ventureId: 'studyhub',
    ventureName: 'StudyHub Academy',
    ventureColor: '#2E6F5E',
    status: 'ACTIVE',
    lastActive: '15 Sep 11:24',
    createdAt: '2026-09-05',
  },
  {
    id: 'usr-ac-1',
    name: 'Omar Hassan',
    email: 'omar@apexclasses.eg',
    password: 'Apex2026!',
    portal: 'Brand Financial Portal',
    role: 'Brand Financial Admin',
    ventureId: 'apex',
    ventureName: 'Apex Classes',
    ventureColor: '#1B2A4A',
    status: 'ACTIVE',
    lastActive: '14 Sep 16:30',
    createdAt: '2026-09-10',
  },
  {
    id: 'usr-eh-1',
    name: 'Fatima Al-Nasser',
    email: 'fatima@elhesa.eg',
    password: 'ElHesa2026!',
    portal: 'Brand Financial Portal',
    role: 'Brand Financial Admin',
    ventureId: 'el-hesa',
    ventureName: 'EL HESA Institute',
    ventureColor: '#B8860B',
    status: 'ACTIVE',
    lastActive: '14 Sep 12:10',
    createdAt: '2026-09-12',
  },
];

export default function UsersPage() {
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [activeTab, setActiveTab] = useState<'all' | 'brand' | 'hub'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [ventures, setVentures] = useState(BASE_VENTURES);
  
  // Provision Brand Admin Modal State
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [targetVentureId, setTargetVentureId] = useState('studyhub');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRole, setAdminRole] = useState<UserItem['role']>('Brand Financial Admin');
  
  // Success Card Modal State
  const [createdUser, setCreatedUser] = useState<UserItem | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Load persisted brand users and custom ventures
  useEffect(() => {
    try {
      // Load custom ventures
      const storedVentures = localStorage.getItem('bldr_custom_ventures');
      if (storedVentures) {
        const parsed = JSON.parse(storedVentures);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(BASE_VENTURES.map(v => v.id));
          const unique = parsed.filter((v: any) => !existingIds.has(v.id));
          setVentures([...BASE_VENTURES, ...unique]);
        }
      }

      // Load brand users
      const storedUsers = localStorage.getItem('bldr_brand_users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          // Merge with initial users without duplicates
          const userIds = new Set(parsedUsers.map((u: any) => u.id));
          const remainingInitials = INITIAL_USERS.filter(u => !userIds.has(u.id));
          setUsers([...remainingInitials, ...parsedUsers]);
        }
      } else {
        localStorage.setItem('bldr_brand_users', JSON.stringify(INITIAL_USERS));
      }
    } catch (e) {}
  }, []);

  // Save changes to localStorage
  const persistUsers = (newUsers: UserItem[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('bldr_brand_users', JSON.stringify(newUsers));
    } catch (e) {}
  };

  const generateRandomPassword = (brandCode: string) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const cleanBrand = brandCode.replace(/[^a-zA-Z]/g, '').slice(0, 4);
    return `${cleanBrand}@2026${code}!`;
  };

  const openProvisionModal = (preselectedVentureId?: string) => {
    const vId = preselectedVentureId || (ventures[0]?.id || 'studyhub');
    const matchedVenture = ventures.find(v => v.id === vId) || ventures[0];
    setTargetVentureId(vId);
    setAdminName('');
    setAdminEmail('');
    setAdminPassword(generateRandomPassword(matchedVenture?.code || 'BLDR'));
    setAdminRole('Brand Financial Admin');
    setShowProvisionModal(true);
  };

  const handleCreateBrandAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminName || !adminPassword) return;

    const matchedVenture = ventures.find(v => v.id === targetVentureId) || ventures[0];

    const newUser: UserItem = {
      id: `usr-brand-${Date.now()}`,
      name: adminName.trim(),
      email: adminEmail.trim().toLowerCase(),
      password: adminPassword.trim(),
      portal: 'Brand Financial Portal',
      role: adminRole,
      ventureId: matchedVenture.id,
      ventureName: matchedVenture.name,
      ventureColor: matchedVenture.color || '#2E6F5E',
      status: 'ACTIVE',
      lastActive: 'Just invited',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newUser, ...users];
    persistUsers(updated);

    setShowProvisionModal(false);
    setCreatedUser(newUser);
  };

  const handleCopyCredentials = (u: UserItem) => {
    const text = [
      `bldr Brand Financial Portal — Access Credentials`,
      `Brand / Venture: ${u.ventureName}`,
      `Portal Link: https://portal.bldrmanagement.com/login`,
      `Login Email: ${u.email}`,
      `Password: ${u.password || 'Account password as assigned'}`,
      `Role: ${u.role}`,
      `Security Policy: ADR-001 tenant segregation enforced. You have direct access to your brand's financial statements, orders, and brand settlements.`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  const toggleUserStatus = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        return { ...u, status: nextStatus as any };
      }
      return u;
    });
    persistUsers(updated);
  };

  const deleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove administrator access for ${name}?`)) {
      const updated = users.filter(u => u.id !== id);
      persistUsers(updated);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    // Portal tab filter
    if (activeTab === 'brand' && u.portal !== 'Brand Financial Portal') return false;
    if (activeTab === 'hub' && u.portal !== 'Central Payment Hub') return false;

    // Venture filter
    if (selectedVenture !== 'All' && selectedVenture !== 'All ventures') {
      if (u.ventureId !== selectedVenture && !u.ventureName.toLowerCase().includes(selectedVenture.toLowerCase())) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.ventureName.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const brandAdminsCount = users.filter(u => u.portal === 'Brand Financial Portal').length;
  const centralHubAdminsCount = users.filter(u => u.portal === 'Central Payment Hub').length;

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Users & Roles"
          crumb="Settings / Brand Financial Portal Admins"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Banner & Primary CTA */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#12203C', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Brand Financial Portal Administrators
              </h1>
              <p style={{ fontSize: 13, color: '#5A6A80', margin: 0, maxWidth: 760, lineHeight: 1.5 }}>
                Provision and manage access for venture partners and brand finance officers to log in to the Brand Financial Portal (<span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1B2A4A' }}>portal.bldrmanagement.com</span>). Enforces ADR-001 brand financial isolation.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button
                id="btn-provision-brand-admin"
                onClick={() => openProvisionModal()}
                style={{
                  height: 42,
                  padding: '0 20px',
                  borderRadius: 8,
                  background: '#2E6F5E',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(46, 111, 94, 0.28)',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>+ Provision Brand Admin</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 18px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', letterSpacing: '0.05em' }}>
                Brand Financial Admins
              </span>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#12203C', marginTop: 4 }}>
                {brandAdminsCount}
              </div>
              <div style={{ fontSize: 11.5, color: '#2E6F5E', fontWeight: 600, marginTop: 4 }}>
                Isolated partner accounts
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 18px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', letterSpacing: '0.05em' }}>
                Active Brand Ventures
              </span>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#12203C', marginTop: 4 }}>
                {ventures.length}
              </div>
              <div style={{ fontSize: 11.5, color: '#5A6A80', marginTop: 4 }}>
                bldr, StudyHub, Apex, EL HESA...
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 18px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', letterSpacing: '0.05em' }}>
                Central Treasury Admins
              </span>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#12203C', marginTop: 4 }}>
                {centralHubAdminsCount}
              </div>
              <div style={{ fontSize: 11.5, color: '#5A6A80', marginTop: 4 }}>
                Global cross-venture ledger
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, padding: '16px 18px' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', letterSpacing: '0.05em' }}>
                Security Policy
              </span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#12203C', marginTop: 8 }}>
                ADR-001 Enforced
              </div>
              <div style={{ fontSize: 11.5, color: '#2E6F5E', fontWeight: 600, marginTop: 4 }}>
                Zero cross-brand data leakage
              </div>
            </div>
          </div>

          {/* Filtering and Search Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', background: '#EAEFF5', padding: 3, borderRadius: 8, gap: 2 }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'all' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'all' ? '#12203C' : '#5A6A80',
                  boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                All Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('brand')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'brand' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'brand' ? '#2E6F5E' : '#5A6A80',
                  boxShadow: activeTab === 'brand' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                Brand Financial Admins ({brandAdminsCount})
              </button>
              <button
                onClick={() => setActiveTab('hub')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'hub' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'hub' ? '#12203C' : '#5A6A80',
                  boxShadow: activeTab === 'hub' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                Central Hub Admins ({centralHubAdminsCount})
              </button>
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search by name, email, brand..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: 260,
                  height: 36,
                  borderRadius: 7,
                  border: '1px solid #D3DAE4',
                  background: '#FFFFFF',
                  padding: '0 12px',
                  fontSize: 12.5,
                  color: '#12203C',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#8A94A6', fontSize: 12, cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 1.4fr) minmax(180px, 1.2fr) minmax(170px, 1fr) 100px 120px 140px',
                padding: '0 20px',
                height: 40,
                alignItems: 'center',
                background: '#FAFBFD',
                borderBottom: '1px solid #E3E8EF',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Administrator</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Brand / Venture Scope</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Portal & Role</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Status</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Last Active</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Actions</span>
            </div>

            {filteredUsers.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8A94A6', fontSize: 13 }}>
                No administrators found matching your filter criteria.
              </div>
            ) : (
              filteredUsers.map(u => {
                const isBrandPortal = u.portal === 'Brand Financial Portal';
                return (
                  <div
                    key={u.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(220px, 1.4fr) minmax(180px, 1.2fr) minmax(170px, 1fr) 100px 120px 140px',
                      padding: '14px 20px',
                      alignItems: 'center',
                      borderBottom: '1px solid #F0F3F7',
                      gap: 12,
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {/* User Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: isBrandPortal ? 'rgba(46, 111, 94, 0.12)' : 'rgba(18, 32, 60, 0.1)',
                          color: isBrandPortal ? '#2E6F5E' : '#12203C',
                          fontWeight: 800,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2A4A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.name}
                        </span>
                        <span style={{ fontSize: 11, color: '#8A94A6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.email}
                        </span>
                      </div>
                    </div>

                    {/* Venture Scope */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: u.ventureColor || '#2E6F5E',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>
                        {u.ventureName}
                      </span>
                    </div>

                    {/* Portal & Role */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: isBrandPortal ? '#2E6F5E' : '#12203C',
                          background: isBrandPortal ? '#E6EFEB' : '#F1F4F9',
                          borderRadius: 4,
                          padding: '2px 8px',
                          display: 'inline-block',
                          width: 'fit-content',
                        }}
                      >
                        {u.role}
                      </span>
                      <span style={{ fontSize: 10, color: '#8A94A6' }}>
                        {u.portal}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: u.status === 'ACTIVE' ? '#15803D' : u.status === 'SUSPENDED' ? '#DC2626' : '#B8860B',
                          background: u.status === 'ACTIVE' ? '#DCFCE7' : u.status === 'SUSPENDED' ? '#FEE2E2' : '#FEF3C7',
                          borderRadius: 20,
                          padding: '3px 8px',
                        }}
                      >
                        {u.status}
                      </span>
                    </div>

                    {/* Last Active */}
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8A94A6' }}>
                      {u.lastActive}
                    </span>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      {isBrandPortal && (
                        <button
                          onClick={() => handleCopyCredentials(u)}
                          title="Copy Login Details for Partner"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#2E6F5E',
                            background: '#E6EFEB',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 8px',
                            cursor: 'pointer',
                          }}
                        >
                          Copy
                        </button>
                      )}
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        title="Toggle Active / Suspended"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#5A6A80',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteUser(u.id, u.name)}
                        title="Revoke access"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#DC2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 4px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Copy Toast */}
      {copiedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#12203C',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontSize: 13,
            fontWeight: 700,
            zIndex: 10000,
          }}
        >
          Partner login credentials copied to clipboard.
        </div>
      )}

      {/* ─── MODAL: Provision Brand Admin ─────────────────────────────────── */}
      {showProvisionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,32,60,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form
            onSubmit={handleCreateBrandAdmin}
            style={{
              width: 500,
              maxWidth: '92vw',
              background: '#FFFFFF',
              borderRadius: 12,
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#12203C', display: 'block' }}>
                  Provision Brand Financial Admin
                </span>
                <span style={{ fontSize: 11.5, color: '#8A94A6' }}>
                  Creates an isolated login account for the Brand Financial Portal
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowProvisionModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#8A94A6' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Target Brand Dropdown */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', display: 'block', marginBottom: 6 }}>
                  Target Brand / Venture
                </label>
                <select
                  value={targetVentureId}
                  onChange={e => {
                    const newId = e.target.value;
                    setTargetVentureId(newId);
                    const v = ventures.find(item => item.id === newId);
                    if (v) setAdminPassword(generateRandomPassword(v.code || 'BLDR'));
                  }}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 7,
                    border: '1px solid #D3DAE4',
                    background: '#FFFFFF',
                    padding: '0 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#12203C',
                  }}
                >
                  {ventures.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.code})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: 11, color: '#5A6A80', marginTop: 4 }}>
                  This user will strictly see only this brand's financial transactions and payouts.
                </div>
              </div>

              {/* Admin Name */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', display: 'block', marginBottom: 6 }}>
                  Admin Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mona Zaki"
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 7,
                    border: '1px solid #D3DAE4',
                    background: '#FFFFFF',
                    padding: '0 12px',
                    fontSize: 13,
                    color: '#12203C',
                  }}
                />
              </div>

              {/* Work Email */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', display: 'block', marginBottom: 6 }}>
                  Brand Partner Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. finance@studyhub.eg"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 7,
                    border: '1px solid #D3DAE4',
                    background: '#FFFFFF',
                    padding: '0 12px',
                    fontSize: 13,
                    color: '#12203C',
                  }}
                />
              </div>

              {/* Initial Password */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>
                    Initial Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const v = ventures.find(item => item.id === targetVentureId);
                      setAdminPassword(generateRandomPassword(v?.code || 'BLDR'));
                    }}
                    style={{ background: 'none', border: 'none', color: '#2E6F5E', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Regenerate Strong Password
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 7,
                    border: '1px solid #D3DAE4',
                    background: '#FAFBFD',
                    padding: '0 12px',
                    fontSize: 13,
                    fontFamily: 'IBM Plex Mono, monospace',
                    color: '#12203C',
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Role Scope */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6', display: 'block', marginBottom: 6 }}>
                  Role & Financial Authority
                </label>
                <select
                  value={adminRole}
                  onChange={e => setAdminRole(e.target.value as any)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 7,
                    border: '1px solid #D3DAE4',
                    background: '#FFFFFF',
                    padding: '0 12px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#12203C',
                  }}
                >
                  <option value="Brand Financial Admin">Brand Financial Admin (Full Access: Statements, Orders, Brand Settlements)</option>
                  <option value="Brand Operations Admin">Brand Operations Admin (Orders, Students Roster, Payment Links)</option>
                  <option value="Finance Viewer">Finance Viewer (Read-only ledger & statements audit)</option>
                </select>
              </div>

              {/* Information Notice */}
              <div style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1B2A4A', marginBottom: 2 }}>
                  Portal Assignment
                </div>
                <div style={{ fontSize: 11.5, color: '#5A6A80' }}>
                  This administrator will log in at <span style={{ fontWeight: 600, color: '#047857' }}>portal.bldrmanagement.com/login</span>. They cannot access cross-venture administrative settings.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid #E3E8EF', display: 'flex', justifyContent: 'flex-end', gap: 10, background: '#FAFBFD' }}>
              <button
                type="button"
                onClick={() => setShowProvisionModal(false)}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #D3DAE4', background: '#FFFFFF', fontSize: 12.5, fontWeight: 700, color: '#5A6A80', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#2E6F5E', color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
              >
                Create Brand Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── MODAL: Account Created Success Card ─────────────────────────── */}
      {createdUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,32,60,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: 520,
              maxWidth: '92vw',
              background: '#FFFFFF',
              borderRadius: 12,
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E3E8EF', background: '#ECFDF5' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#065F46' }}>
                Brand Administrator Account Provisioned
              </span>
              <span style={{ fontSize: 12, color: '#047857', display: 'block', marginTop: 2 }}>
                Account is active and ready for immediate login.
              </span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Credentials Box */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Venture Assigned</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2A4A', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: createdUser.ventureColor }} />
                    {createdUser.ventureName}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Login Portal URL</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#047857', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>
                    https://portal.bldrmanagement.com/login
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Login Email</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#12203C', marginTop: 2 }}>
                      {createdUser.email}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Initial Password</span>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#D10721', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>
                      {createdUser.password}
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Role Assigned</span>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2E6F5E', marginTop: 2 }}>
                    {createdUser.role}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleCopyCredentials(createdUser)}
                  style={{
                    flex: 1,
                    height: 42,
                    borderRadius: 8,
                    background: '#2E6F5E',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Copy Credentials
                </button>
                <a
                  href={`http://localhost:3001/login?sync_email=${encodeURIComponent(createdUser.email)}&sync_pass=${encodeURIComponent(createdUser.password || '')}&sync_venture=${encodeURIComponent(createdUser.ventureId)}&sync_name=${encodeURIComponent(createdUser.name)}&auto=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    height: 42,
                    padding: '0 16px',
                    borderRadius: 8,
                    background: '#12203C',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>Open Portal & Sign In &rarr;</span>
                </a>
                <button
                  onClick={() => setCreatedUser(null)}
                  style={{
                    height: 42,
                    padding: '0 16px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D3DAE4',
                    color: '#12203C',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
