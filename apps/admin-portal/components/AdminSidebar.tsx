'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  ShoppingBagIcon,
  MegaphoneIcon,
  SlidersIcon,
  BanknotesIcon,
  ZapIcon,
  ArrowRightIcon,
} from '@bldr/ui';

const NAV = [
  { href: '/dashboard', Icon: ChartBarIcon, label: 'Platform Overview' },
  { href: '/providers', Icon: BuildingOfficeIcon, label: 'Provider Registry' },
  { href: '/orders', Icon: ShoppingBagIcon, label: 'Orders & Audit' },
  { href: '/leads', Icon: MegaphoneIcon, label: 'Leads & Quotes' },
  { href: '/commission', Icon: SlidersIcon, label: 'Commission Engine' },
  { href: '/payouts', Icon: BanknotesIcon, label: 'Payout Ledgers' },
  { href: '/simulation', Icon: ZapIcon, label: 'Simulation Control' },
];

export default function AdminSidebar() {
  const path = usePathname();
  const logout = () => {
    localStorage.removeItem('bldr_admin_token');
    window.location.href = '/login';
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
            Admin Console
          </div>
        </div>
      </div>

      <div className="sidebar-label" style={{ marginTop: '20px' }}>
        Operations
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
          onClick={logout}
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
