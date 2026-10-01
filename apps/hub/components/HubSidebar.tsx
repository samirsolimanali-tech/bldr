'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutHubUser } from '../lib/auth';

export interface NavItemDef {
  label: string;
  href: string;
  badge?: string;
  d: string;
}

const NAV_ITEMS: NavItemDef[] = [
  {
    label: 'Overview',
    href: '/',
    d: 'M2.5 2.5h4.2v4.2H2.5zM9.3 2.5h4.2v4.2H9.3zM2.5 9.3h4.2v4.2H2.5zM9.3 9.3h4.2v4.2H9.3z',
  },
  {
    label: 'Ventures',
    href: '/ventures',
    d: 'M2.5 13.5V4.2l4.6-1.7v11M7.1 13.5V6.6l6.4-1.6v8.5M9.8 8.4h1M9.8 10.6h1',
  },
  {
    label: 'Payment Links',
    href: '/payment-links',
    d: 'M6.4 9.6l3.2-3.2M5.2 7.8L3.6 9.4a2.2 2.2 0 003.1 3.1l1.6-1.6M10.8 8.2l1.6-1.6a2.2 2.2 0 00-3.1-3.1L7.7 5.1',
  },
  {
    label: 'Checkout Studio & Monitor',
    href: '/payment-pages',
    d: 'M3 3h10v10H3zM3 6h10M6 6v7',
  },
  {
    label: 'Transactions',
    href: '/transactions',
    d: 'M2.5 5.2h9.2L9.4 2.9M13.5 10.8H4.3l2.3 2.3',
  },
  {
    label: 'Students',
    href: '/students',
    d: 'M8 2.5a3 3 0 100 6 3 3 0 000-6zM3.5 13.5a4.5 4.5 0 019 0H3.5z',
  },
  {
    label: 'Refunds',
    href: '/refunds',
    badge: '5',
    d: 'M13 8a5 5 0 10-4.6 5M13 8V4.4M13 8H9.4',
  },
  {
    label: 'Brand Settlements',
    href: '/payouts',
    d: 'M2.5 4.5h11v7h-11zM6 7.5a2 2 0 104 0 2 2 0 00-4 0z',
  },
  {
    label: 'Reconciliation',
    href: '/reconciliation',
    d: 'M8 2.3v11.4M4.4 5.2l-2 5h4zM11.6 5.2l-2 5h4z',
  },
  {
    label: 'Gateway Health',
    href: '/providers',
    d: 'M6 2.4v3.4M10 2.4v3.4M4.2 5.8h7.6v3a3.8 3.8 0 01-7.6 0zM8 12.8v1.6',
  },
  {
    label: 'Payment Methods',
    href: '/payment-methods',
    d: 'M2.5 4.5h11v7h-11zM2.5 6.5h11',
  },
  {
    label: 'Developers',
    href: '/developers',
    d: 'M6 5L3.2 8 6 11M10 5l2.8 3L10 11',
  },
  {
    label: 'Users & Roles',
    href: '/users',
    d: 'M6.2 7.2a2 2 0 100-4 2 2 0 000 4zM2.4 13.2a3.8 3.8 0 017.6 0M11 4.6a2 2 0 010 4M13.6 13.2a3.4 3.4 0 00-1.8-2.9',
  },
  {
    label: 'Audit Logs',
    href: '/audit',
    d: 'M3.8 2.5h5.6l3.1 3.1v7.9H3.8zM9.4 2.5v3.1h3.1M6.2 8.4h4.2M6.2 10.8h4.2',
  },
];

export default function HubSidebar({ active }: { active?: string }) {
  const pathname = usePathname();

  const [userName, setUserName] = React.useState('Mohammad Gamal');
  const [userRole, setUserRole] = React.useState('Super Admin');
  const [userEmail, setUserEmail] = React.useState('admin@bldr.io');

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('bldr_hub_session');
      if (raw) {
        const sess = JSON.parse(raw);
        if (sess.email) {
          setUserEmail(sess.email);
          const namePart = sess.email.split('@')[0];
          setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1).replace('.', ' '));
        }
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    logoutHubUser();
  };

  return (
    <aside
      style={{
        width: 240,
        flex: 'none',
        height: '100vh',
        minHeight: '100%',
        background: '#16223C',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        position: 'sticky',
        top: 0,
        zIndex: 60,
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: '#2E6F5E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.04em',
          }}
        >
          b
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            bldr<span style={{ color: '#2E6F5E' }}>.</span>
          </span>
          <span style={{ fontSize: 9.5, fontWeight: 600, color: '#7E8DA8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Payment Hub
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 20px 14px' }} />

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px', flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const isCurrent = active ? item.label === active : item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '9px 11px',
                borderRadius: 8,
                background: isCurrent ? '#2E6F5E' : 'transparent',
                color: isCurrent ? '#FFFFFF' : '#A9B5C9',
                fontSize: 12.5,
                fontWeight: isCurrent ? 700 : 500,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                position: 'relative',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke={isCurrent ? '#FFFFFF' : '#A9B5C9'}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flex: 'none', opacity: isCurrent ? 1 : 0.75 }}
              >
                <path d={item.d} />
              </svg>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    fontWeight: 600,
                    background: '#C0392B',
                    color: '#FFFFFF',
                    borderRadius: 20,
                    padding: '1px 6px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Authentication Card */}
      <div
        style={{
          margin: '0 10px 14px',
          padding: '10px 12px',
          borderRadius: 9,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: '#2E6F5E',
              color: '#FFFFFF',
              fontSize: 11,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}
          >
            {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MG'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName}
            </span>
            <span style={{ fontSize: 10, color: '#7E8DA8', fontWeight: 600 }}>
              {userRole}
            </span>
          </div>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out / Logout"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#A9B5C9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A9B5C9';
              e.currentTarget.style.background = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 14H3.3a1.3 1.3 0 01-1.3-1.3V3.3A1.3 1.3 0 013.3 2H6" />
              <path d="M10.7 11.3L14 8l-3.3-3.3" />
              <path d="M14 8H6" />
            </svg>
          </button>
        </div>

        {/* Quick Action Links: Switch User / Login Page & Explicit Logout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 7 }}>
          <Link
            href="/login"
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: '#7E8DA8',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7E8DA8')}
          >
            <span>Login Page &rarr;</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 10.5,
              fontWeight: 700,
              color: '#EF4444',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
