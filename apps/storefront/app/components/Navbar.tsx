'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/services',   label: 'Services' },
  { href: '/products',   label: 'Products' },
  { href: '/projects',   label: 'Projects' },
  { href: '/contact',    label: 'Contact' },
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
        <Link href="/" className="bldr-logo">
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
          <a
            href="http://localhost:3013/login"
            className="btn btn-ghost btn-sm"
            target="_blank"
            rel="noreferrer"
          >
            Provider Portal
          </a>
          <a
            href="http://localhost:3011"
            className="btn btn-ghost btn-sm"
            target="_blank"
            rel="noreferrer"
          >
            Central Hub
          </a>
          <a
            href="http://localhost:3012/dashboard"
            className="btn btn-secondary btn-sm"
            target="_blank"
            rel="noreferrer"
          >
            Super Admin
          </a>
          <Link href="/contact" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
