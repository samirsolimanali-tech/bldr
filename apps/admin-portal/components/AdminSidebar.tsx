'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  group: string;
  isExternal?: boolean;
}

const NAV: NavItem[] = [
  // Main
  { href: '/dashboard',        icon: '▦',  label: 'Overview',              group: 'Main' },
  // Catalog
  { href: '/products',         icon: '◈',  label: 'Products & Courses',    group: 'Catalog' },
  { href: '/services',         icon: '◉',  label: 'Services & Bundles',    group: 'Catalog' },
  { href: '/projects',         icon: '◫',  label: 'Projects & Work',       group: 'Catalog' },
  { href: '/discounts',        icon: '◇',  label: 'Discounts & Coupons',   group: 'Catalog' },
  // CRM & Ops
  { href: '/providers',        icon: '⊞',  label: 'Providers & Academies', group: 'CRM & Ops' },
  { href: '/students',         icon: '▣',  label: 'Students CRM',          group: 'CRM & Ops' },
  { href: '/orders',           icon: '≡',  label: 'Orders & Audit',        group: 'CRM & Ops' },
  // Storefront & Insights
  { href: '/cms',              icon: '▤',  label: 'CMS & Storefront',      group: 'Storefront' },
  { href: '/analytics',        icon: '◎',  label: 'Analytics & P&L',       group: 'Storefront' },
  // Brand Financial Portal
  { href: 'http://localhost:3001/login', icon: '⊛', label: 'Financials', group: 'Finance', isExternal: true },
];

const GROUPS = ['Main', 'Catalog', 'CRM & Ops', 'Storefront', 'Finance'];

export default function AdminSidebar() {
  const path = usePathname();

  const logout = () => {
    window.location.href = '/login';
  };

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 12px 20px',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      overflowY: 'auto',
      zIndex: 50,
    }}>
      {/* Brand */}
      <div style={{ padding: '18px 8px 16px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: 14,
            fontFamily: 'var(--font-display)',
            flexShrink: 0,
          }}>
            b/
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              bldr
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Super Admin
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation by group */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {GROUPS.map((group) => {
          const items = NAV.filter(n => n.group === group);
          return (
            <div key={group} style={{ marginTop: group === 'Main' ? 4 : 12 }}>
              {group !== 'Main' && (
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  padding: '4px 12px 6px',
                }}>
                  {group}
                </div>
              )}
              {items.map((n) => {
                const isActive = !n.isExternal && (path === n.href || (n.href !== '/dashboard' && path.startsWith(n.href)));
                
                if (n.isExternal) {
                  return (
                    <a
                      key={n.href}
                      href={n.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(38,60,139,0.06)';
                        e.currentTarget.style.color = 'var(--brand)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <span style={{ fontSize: 15, color: 'var(--text-muted)', width: 20, textAlign: 'center', flexShrink: 0 }}>
                        {n.icon}
                      </span>
                      <span style={{ flex: 1 }}>{n.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>&rarr;</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(38,60,139,0.07)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: 15, color: isActive ? 'var(--brand)' : 'var(--text-muted)', width: 20, textAlign: 'center', flexShrink: 0 }}>
                      {n.icon}
                    </span>
                    <span style={{ flex: 1 }}>{n.label}</span>
                    {isActive && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', marginBottom: 6, borderRadius: 8, background: 'var(--bg-canvas)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            SA
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>admin@bldr.io</div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: 8,
            transition: 'background 0.15s',
          }}
        >
          <span>↩</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
