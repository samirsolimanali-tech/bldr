'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  MegaphoneIcon,
  BanknotesIcon,
  SlidersIcon,
  CodeBracketIcon,
} from '@bldr/ui';

const NAV = [
  { href: '/dashboard', Icon: ChartBarIcon, label: 'Dashboard' },
  { href: '/listings', Icon: CodeBracketIcon, label: 'Service Listings' },
  { href: '/orders', Icon: ShoppingBagIcon, label: 'Orders & Sales' },
  { href: '/leads', Icon: MegaphoneIcon, label: 'Client Inquiries' },
  { href: '/payouts', Icon: BanknotesIcon, label: 'Payout Balances' },
  { href: '/settings', Icon: SlidersIcon, label: 'Store Settings' },
];

export default function Sidebar() {
  const path = usePathname();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bldr_token');
      window.location.href = '/login';
    }
  };

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 24px', borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            background: 'var(--brand)',
            color: '#FFFFFF',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '14px',
            fontFamily: 'var(--font-display)',
          }}
        >
          b
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            bldr
          </div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Provider Hub
          </div>
        </div>
      </div>

      <div className="sidebar-label" style={{ marginTop: '20px' }}>
        Workspace
      </div>

      <nav className="sidebar-nav">
        {NAV.map((n) => {
          const IconComponent = n.Icon;
          const isActive = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(38, 60, 139, 0.08)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <IconComponent size={18} style={{ color: isActive ? 'var(--brand)' : 'var(--text-muted)' }} />
              <span style={{ flex: 1 }}>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            padding: '8px 12px',
          }}
        >
          <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>➜</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
