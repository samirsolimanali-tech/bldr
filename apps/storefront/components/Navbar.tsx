'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SparklesIcon, ShieldCheckIcon } from '@bldr/ui';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo-wrap">
          <div className="navbar-logo-mark">b</div>
          <span className="navbar-logo-text">bldr</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link href="/browse">All Services</Link>
          </li>
          <li>
            <Link href="/browse?category=Education">Education</Link>
          </li>
          <li>
            <Link href="/browse?category=Consulting">Consulting</Link>
          </li>
          <li>
            <Link href="/browse?category=Media">Media</Link>
          </li>
          <li>
            <Link href="/browse?category=Training">Training</Link>
          </li>
          <li>
            <Link href="/providers/bldr" style={{ color: 'var(--brand)', fontWeight: 600 }}>
              House Services
            </Link>
          </li>
        </ul>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link
            href={`${process.env.NEXT_PUBLIC_PROVIDER_PORTAL_URL || 'http://localhost:3001'}/login`}
            className="btn btn-secondary btn-sm"
          >
            Provider Portal
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3002'}/login`}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '12px' }}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
