'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bldr-footer">
      <div className="bldr-footer-inner">
        <div className="bldr-footer-top">
          {/* Brand */}
          <div className="bldr-footer-brand">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div className="bldr-logo-mark" style={{ width: 34, height: 34, fontSize: 14 }}>b/</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'rgba(248,250,252,0.95)' }}>bldr</span>
            </Link>
            <p>
              We help businesses build world-class digital products and scale with confidence. 
              From strategy to execution — we're your full-stack growth partner.
            </p>
          </div>

          {/* Company */}
          <div className="bldr-footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/apply-provider">Partner with bldr</Link></li>
            </ul>
          </div>

          {/* Offerings */}
          <div className="bldr-footer-col">
            <h4>Offerings</h4>
            <ul>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/services?category=software">Software</Link></li>
              <li><Link href="/services?category=marketing">Marketing</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div className="bldr-footer-col">
            <h4>Portals</h4>
            <ul>
              <li><a href="http://localhost:3013/login" target="_blank" rel="noreferrer">Provider Login</a></li>
              <li><a href="http://localhost:3012/dashboard" target="_blank" rel="noreferrer">Admin Dashboard</a></li>
              <li><a href="http://localhost:3011" target="_blank" rel="noreferrer">Payment Hub</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="bldr-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Bldr. All rights reserved.</p>
          <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.3)' }}>
            Built with precision. Delivered with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
