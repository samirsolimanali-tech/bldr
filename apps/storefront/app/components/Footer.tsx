'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bldr-footer" style={{ background: '#141416', color: '#FFFFFF', padding: '64px 32px 34px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="bldr-footer-inner" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="bldr-footer-top" style={{ display: 'flex', flexWrap: 'wrap', gap: '44px 36px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Brand */}
          <div className="bldr-footer-brand" style={{ flex: '1 1 260px', minWidth: 200, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div className="bldr-logo-mark" style={{ width: 34, height: 34, fontSize: 14, borderRadius: 8, background: '#D10721', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>b/</div>
              <span style={{ fontWeight: 700, fontSize: 20, color: 'rgba(248,250,252,0.95)' }}>bldr</span>
            </Link>
            <p style={{ margin: 0, fontSize: 13.5, color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.68, maxWidth: 280 }}>
              We build world-class digital platforms and payment infrastructure. From strategy to execution — we're your full-stack growth partner.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/bldr.management' },
                { label: 'Facebook',  href: 'https://www.facebook.com/share/14uAjf399GL/' },
                { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/bldrmanagement/' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.16)',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Company — left */}
          <div className="bldr-footer-col" style={{ flex: '0 1 180px', minWidth: 150, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link href="/" style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, textDecoration: 'none' }}>Home</Link></li>
              <li><Link href="/products" style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, textDecoration: 'none' }}>Courses &amp; Programs</Link></li>
              <li><Link href="/apply-provider" style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, textDecoration: 'none' }}>Partner with bldr</Link></li>
            </ul>
          </div>

          {/* Legal & Policies — middle */}
          <div className="bldr-footer-col" style={{ flex: '0 1 180px', minWidth: 160, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Legal &amp; Policies</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, textDecoration: 'none' }}>Terms of Service</Link></li>
              <li><Link href="/refund-policy" style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, textDecoration: 'none' }}>Refund Policy</Link></li>
              <li><Link href="/contact" style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, textDecoration: 'none' }}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Us — right */}
          <div className="bldr-footer-col" style={{ flex: '1 1 240px', minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FD9426', margin: 0 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.85)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#FD9426' }}>LOC</span>
                <span>Giza, Egypt</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#FD9426' }}>TEL</span>
                <a href="tel:+201030165000" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 500 }}>
                  +20 10 30165000
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#FD9426' }}>EMAIL</span>
                <a href="mailto:bldr.management@gmail.com" style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                  bldr.management@gmail.com
                </a>
              </div>
              <div style={{ marginTop: 4 }}>
                <Link href="/contact" style={{ fontSize: 12.5, fontWeight: 600, color: '#FD9426', textDecoration: 'none' }}>
                  Contact Page &amp; Inquiry Form &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, #D10721, #FD9426)', margin: '40px 0 24px' }} />

        {/* Bottom */}
        <div className="bldr-footer-bottom" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['VISA', 'Mastercard', 'Meeza', 'Mobile Wallets', 'Fawry Pay', 'Geidea'].map((badge) => (
              <span key={badge} style={{ height: 24, padding: '0 8px', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 4, display: 'inline-flex', alignItems: 'center', fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
                {badge}
              </span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }}>
            &copy; {new Date().getFullYear()} bldr. Operated by Evolve bldr for Business Management, Giza, Egypt.
          </p>
        </div>
      </div>
    </footer>
  );
}
