'use client';

import React, { useState } from 'react';
import HubSidebar from '../../components/HubSidebar';
import HubTopBar from '../../components/HubTopBar';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Finance Admin' | 'Venture Admin' | 'Venture Operator' | 'Read Only';
  ventureScope: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  lastActive: string;
}

const USERS: UserItem[] = [
  {
    id: 'usr-1',
    name: 'Mohammad Gamal',
    email: 'm.gamal@bldr.com',
    role: 'Super Admin',
    ventureScope: 'All ventures (Global)',
    status: 'ACTIVE',
    lastActive: 'Just now',
  },
  {
    id: 'usr-2',
    name: 'Karim Mostafa',
    email: 'k.mostafa@bldr.com',
    role: 'Finance Admin',
    ventureScope: 'All ventures (Ledger & Payouts)',
    status: 'ACTIVE',
    lastActive: '15 Sep 04:12',
  },
  {
    id: 'usr-3',
    name: 'Sarah Ibrahim',
    email: 'sarah@studyhub.eg',
    role: 'Venture Admin',
    ventureScope: 'StudyHub only',
    status: 'ACTIVE',
    lastActive: '15 Sep 11:24',
  },
  {
    id: 'usr-4',
    name: 'Omar Hassan',
    email: 'omar@apexclasses.eg',
    role: 'Venture Admin',
    ventureScope: 'Apex Classes only',
    status: 'ACTIVE',
    lastActive: '14 Sep 16:30',
  },
  {
    id: 'usr-5',
    name: 'Fatima Al-Nasser',
    email: 'fatima@elhesa.eg',
    role: 'Venture Admin',
    ventureScope: 'EL HESA only',
    status: 'ACTIVE',
    lastActive: '14 Sep 12:10',
  },
];

export default function UsersPage() {
  const [env, setEnv] = useState<'Sandbox' | 'Production'>('Production');
  const [selectedVenture, setSelectedVenture] = useState('All');
  const [users, setUsers] = useState<UserItem[]>(USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserItem['role']>('Venture Admin');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      setUsers([
        ...users,
        {
          id: `usr-${Date.now()}`,
          name: inviteEmail.split('@')[0],
          email: inviteEmail,
          role: inviteRole,
          ventureScope: selectedVenture === 'All' ? 'StudyHub only' : `${selectedVenture} only`,
          status: 'INVITED',
          lastActive: 'Pending accept',
        },
      ]);
      setShowInviteModal(false);
      setInviteEmail('');
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>
      <HubSidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <HubTopBar
          title="Users &amp; Roles"
          crumb="Settings / Users &amp; Permissions"
          env={env}
          onEnvChange={setEnv}
          selectedVenture={selectedVenture}
          onSelectVenture={setSelectedVenture}
        />

        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>Role-Based Access Control (RBAC)</span>
              <span style={{ fontSize: 11, color: '#8A94A6' }}>
                Strict multi-tenant segregation. Venture admins can only access transactions and payment links within their scoped venture.
              </span>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                background: '#2E6F5E',
                border: 'none',
                borderRadius: 7,
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              + Invite Team Member
            </button>
          </div>

          {/* Users Table */}
          <div style={{ background: '#fff', border: '1px solid #E3E8EF', borderRadius: 10, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 160px minmax(0,1fr) 110px 140px 90px',
                padding: '0 20px',
                height: 38,
                alignItems: 'center',
                background: '#FAFBFD',
                borderBottom: '1px solid #E3E8EF',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>User</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Role</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Venture Scope</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Status</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6' }}>Last Active</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8A94A6', textAlign: 'right' }}>Actions</span>
            </div>

            {users.map(u => (
              <div
                key={u.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 160px minmax(0,1fr) 110px 140px 90px',
                  padding: '12px 20px',
                  alignItems: 'center',
                  borderBottom: '1px solid #F0F3F7',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1B2A4A' }}>{u.name}</span>
                  <span style={{ fontSize: 11, color: '#8A94A6' }}>{u.email}</span>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: u.role === 'Super Admin' ? '#fff' : u.role === 'Finance Admin' ? '#B8860B' : '#2E6F5E',
                      background: u.role === 'Super Admin' ? '#12203C' : u.role === 'Finance Admin' ? '#FBF3E0' : '#E6EFEB',
                      borderRadius: 4,
                      padding: '3px 8px',
                    }}
                  >
                    {u.role}
                  </span>
                </div>

                <span style={{ fontSize: 11.5, color: '#5A6A80', fontWeight: 500 }}>
                  {u.ventureScope}
                </span>

                <div>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: u.status === 'ACTIVE' ? '#2E6F5E' : '#B8860B',
                      background: u.status === 'ACTIVE' ? '#E6EFEB' : '#FBF3E0',
                      borderRadius: 20,
                      padding: '3px 8px',
                    }}
                  >
                    {u.status}
                  </span>
                </div>

                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8A94A6' }}>
                  {u.lastActive}
                </span>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => alert(`Editing permissions for ${u.name}...`)}
                    style={{ fontSize: 11, fontWeight: 600, color: '#5A6A80', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,32,60,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleInvite} style={{ width: 440, background: '#fff', borderRadius: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#12203C' }}>Invite Team Member</span>
              <button type="button" onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#8A94A6' }}>✕</button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@venture.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  style={{ width: '100%', height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 12px', marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#8A94A6' }}>Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as UserItem['role'])}
                  style={{ width: '100%', height: 38, border: '1px solid #E3E8EF', borderRadius: 7, padding: '0 12px', marginTop: 4, background: '#fff' }}
                >
                  <option value="Venture Admin">Venture Admin</option>
                  <option value="Venture Operator">Venture Operator</option>
                  <option value="Finance Admin">Finance Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Read Only">Read Only</option>
                </select>
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #E3E8EF', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => setShowInviteModal(false)} style={{ padding: '7px 16px', borderRadius: 6, border: '1px solid #E3E8EF', background: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '7px 18px', borderRadius: 6, border: 'none', background: '#2E6F5E', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Send Invite</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
