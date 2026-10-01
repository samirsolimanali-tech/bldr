'use client';

import React, { useState, useEffect } from 'react';
import ProviderSidebar from '../../components/Sidebar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Finance' | 'Viewer';
  status: 'Active' | 'Invited';
  addedDate: string;
}

const INITIAL_TEAM: TeamMember[] = [
  { id: 'usr-1', name: 'Dr. Karim Mansour', email: 'director@apex.edu.eg', role: 'Owner', status: 'Active', addedDate: '2026-08-01' },
  { id: 'usr-2', name: 'Noha El-Kady', email: 'finance@apex.edu.eg', role: 'Finance', status: 'Active', addedDate: '2026-08-15' },
  { id: 'usr-3', name: 'Hassan Sherif', email: 'operations@apex.edu.eg', role: 'Viewer', status: 'Active', addedDate: '2026-09-01' },
];

export default function TeamManagementPage() {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Finance' as TeamMember['role'] });
  const [toast, setToast] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'Invited',
      addedDate: new Date().toISOString().split('T')[0],
    };
    setTeam([...team, newMember]);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', role: 'Finance' });
    setToast(`Invitation sent to ${newMember.email}`);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <ProviderSidebar />
      <div style={{ flex: 1, marginLeft: 232, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'white', borderBottom: '1px solid var(--border)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Team &amp; Access Roles
            </h1>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            style={{
              background: '#0F172A',
              color: '#FFF',
              border: 'none',
              borderRadius: 6,
              padding: '8px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Invite Team Member
          </button>
        </header>

        <main style={{ flex: 1, padding: '28px' }}>
          {/* Security & Isolation Notice */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 18px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
              <strong>Strict Tenant Boundary:</strong> Team members invited here only access data scoped to this brand. Roles: <strong>Owner</strong> (manage team &amp; settings), <strong>Finance</strong> (view &amp; export settlement statements, raise refund requests), and <strong>Viewer</strong> (read-only audit).
            </div>
          </div>

          {toast && (
            <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '12px 16px', borderRadius: 6, fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
              ✓ {toast}
            </div>
          )}

          {/* Team Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border)' }}>
                  {['Team Member', 'Email', 'Role', 'Status', 'Date Added', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team.map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: i < team.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{m.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          background: m.role === 'Owner' ? '#EFF6FF' : m.role === 'Finance' ? '#ECFDF5' : '#F1F5F9',
                          color: m.role === 'Owner' ? '#1D4ED8' : m.role === 'Finance' ? '#047857' : '#475569',
                        }}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 12, color: m.status === 'Active' ? '#16A34A' : '#D97706', fontWeight: 600 }}>
                        ● {m.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{m.addedDate}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {m.role !== 'Owner' && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${m.name} from team?`)) {
                              setTeam(team.filter((t) => t.id !== m.id));
                            }
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#DC2626', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: 10, width: 440, padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94A3B8' }}>✕</button>
            </div>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Full Name</label>
                <input
                  required
                  placeholder="e.g. Noha El-Kady"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="noha@apex.edu.eg"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }}
                >
                  <option value="Finance">Finance (Settlements, statements &amp; refunds)</option>
                  <option value="Viewer">Viewer (Read-only reports)</option>
                  <option value="Owner">Owner (Full administrative rights)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0F172A', color: '#FFF', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
