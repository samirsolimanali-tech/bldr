'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/projects', label: 'Projects' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`bldr-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="bldr-nav-inner">
        {/* Logo */}
        <Link href="/" className="bldr-logo" style={{ textDecoration: 'none' }}>
          <div className="bldr-logo-mark">b/</div>
          <span>bldr</span>
        </Link>

        {/* Nav Links */}
        <ul className="bldr-nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={pathname === href ? 'active' : ''}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="bldr-nav-actions">
          <Link href="/contact" className="btn btn-primary btn-sm">
            Start a Project
          </Link>
        </div>
      </div>
    </nav>
  );
}
