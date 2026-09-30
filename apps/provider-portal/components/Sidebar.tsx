'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardIcon,
  TransactionsIcon,
  UsersIcon,
  PayoutIcon,
  LinkIcon,
  CheckoutIcon,
  ApiIcon,
  SettingsIcon,
} from './Icons';

interface NavItem {
  href: string;
  Icon: React.FC<{ size?: number; color?: string }>;
  label: string;
  group: string;
}

const NAV: NavItem[] = [
  { href: '/dashboard',     Icon: DashboardIcon,    label: 'Overview',          group: 'Main' },
  { href: '/transactions',  Icon: TransactionsIcon, label: 'Transactions',      group: 'Financials' },
  { href: '/students',      Icon: UsersIcon,        label: 'Paid Users',        group: 'Financials' },
  { href: '/payouts',       Icon: PayoutIcon,       label: 'Payouts',           group: 'Financials' },
  { href: '/payment-links', Icon: LinkIcon,         label: 'Payment Links',     group: 'Tools' },
  { href: '/payment-pages', Icon: CheckoutIcon,     label: 'Master Checkout',   group: 'Tools' },
  { href: '/apis',          Icon: ApiIcon,          label: 'Bldr APIs',         group: 'Tools' },
  { href: '/options',       Icon: SettingsIcon,     label: 'Bldr Options',      group: 'Settings' },
];

const GROUPS = ['Main', 'Financials', 'Tools', 'Settings'];

export default function ProviderSidebar() {
  const path = usePathname();

  const [providerName, setProviderName] = React.useState('StudyHub Academy');
  const [providerEmail, setProviderEmail] = React.useState('team@studyhub.eg');

  React.useEffect(() => {
    try {
      const storedName = localStorage.getItem('bldr_venture_name');
      const storedEmail = localStorage.getItem('bldr_provider_email');
      if (storedName) setProviderName(storedName);
      if (storedEmail) setProviderEmail(storedEmail);
    } catch (e) {}
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('bldr_token');
      localStorage.removeItem('bldr_provider_email');
      localStorage.removeItem('bldr_provider_name');
      localStorage.removeItem('bldr_venture_name');
      localStorage.removeItem('bldr_venture_id');
    } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <aside style={{
      width: 232,
      minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 12px 24px',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      overflowY: 'auto',
      zIndex: 50,
    }}>
      {/* Brand */}
      <div style={{ padding: '18px 8px 18px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
            b/
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2 }}>bldr</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Financial Portal</div>
          </div>
        </div>
      </div>

      {/* Provider info badge */}
      <div style={{ margin: '8px 0', background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          Brand Account
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {providerName}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {providerEmail}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
        {GROUPS.map((group) => {
          const items = NAV.filter(n => n.group === group);
          return (
            <div key={group} style={{ marginTop: group === 'Main' ? 0 : 12 }}>
              {group !== 'Main' && (
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '4px 12px 8px' }}>
                  {group}
                </div>
              )}
              {items.map((n) => {
                const isActive = n.href === '/dashboard' ? path === '/dashboard' || path === '/' : path.startsWith(n.href);
                const IconComponent = n.Icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(38,60,139,0.07)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComponent size={16} color={isActive ? 'var(--brand)' : 'var(--text-muted)'} />
                    </span>
                    <span style={{ flex: 1 }}>{n.label}</span>
                    {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleSignOut}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--danger)', fontWeight: 500, padding: '8px 12px', borderRadius: 8 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
