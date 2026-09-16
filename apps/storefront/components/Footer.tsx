import Link from 'next/link';
import { ShieldCheckIcon, BanknotesIcon, AcademicCapIcon } from '@bldr/ui';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* Col 1: Brand & Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div className="navbar-logo-mark" style={{ width: '28px', height: '28px', fontSize: '14px' }}>b</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--text-primary)' }}>
                bldr
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              The premium marketplace for verified services. Bringing institutional rigor and fintech precision to high-impact education, media, and consulting.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'var(--success-bg)',
              border: '1px solid #C2E4D2',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--success)',
            }}>
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span>
              Platform Status: Operational
            </div>
          </div>

          {/* Col 2: House Service Lines */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '16px' }}>
              House Service Lines
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><Link href="/browse?category=Education&provider=bldr" style={{ color: 'var(--text-secondary)' }}>Education Solutions</Link></li>
              <li><Link href="/browse?category=Media&provider=bldr" style={{ color: 'var(--text-secondary)' }}>Media Production</Link></li>
              <li><Link href="/browse?category=Marketing&provider=bldr" style={{ color: 'var(--text-secondary)' }}>Tutor Marketing</Link></li>
              <li><Link href="/browse?category=Consulting&provider=bldr" style={{ color: 'var(--text-secondary)' }}>Business Consulting</Link></li>
              <li><Link href="/browse?category=Training&provider=bldr" style={{ color: 'var(--text-secondary)' }}>Corporate Training</Link></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Marketplace
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li><Link href="/browse" style={{ color: 'var(--text-secondary)' }}>Browse All Services</Link></li>
              <li><Link href="/providers/bldr" style={{ color: 'var(--text-secondary)' }}>bldr House Profile</Link></li>
              <li><a href={`${process.env.NEXT_PUBLIC_PROVIDER_PORTAL_URL || 'http://localhost:3001'}/login`} style={{ color: 'var(--text-secondary)' }}>Provider Onboarding</a></li>
              <li><a href={`${process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3002'}/login`} style={{ color: 'var(--text-secondary)' }}>Admin Portal</a></li>
              <li><a href={`${process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3002'}/simulation`} style={{ color: 'var(--text-secondary)' }}>Simulation Control Panel</a></li>
            </ul>
          </div>

          {/* Col 4: Trust & Settlement */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Trust & Settlement
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <ShieldCheckIcon size={18} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Vetted Verification:</strong> Every provider passes our editorial standards.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <BanknotesIcon size={18} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Zero-Drift Settlement:</strong> Cryptographic webhooks & integer-cents accounting.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '24px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} bldr marketplace platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Security & Escrow</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
