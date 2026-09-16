import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  AcademicCapIcon,
  VideoCameraIcon,
  MegaphoneIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CodeBracketIcon,
  BanknotesIcon,
  HeartPulseIcon,
  SearchIcon,
  SparklesIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ZapIcon,
  CreditCardIcon,
  ExternalLinkIcon,
} from '@bldr/ui';

export const metadata: Metadata = {
  title: 'bldr — The Premier Service Marketplace',
  description: 'Curated and verified service providers across education, media production, consulting, marketing, and training.',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getFeaturedListings() {
  try {
    const res = await fetch(`${API}/listings/featured?limit=6`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API}/listings/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch {
    return [];
  }
}

const HOUSE_SERVICES = [
  {
    title: 'Education Solutions',
    category: 'Education',
    Icon: AcademicCapIcon,
    description: 'Curriculum architecture, accreditation advisory, and institutional learning frameworks.',
    turnaround: '2–4 weeks',
  },
  {
    title: 'Media Production',
    category: 'Media',
    Icon: VideoCameraIcon,
    description: 'Studio-grade video production, broadcast podcasts, sound engineering, and brand documentaries.',
    turnaround: '1–2 weeks',
  },
  {
    title: 'Tutor Marketing',
    category: 'Marketing',
    Icon: MegaphoneIcon,
    description: 'Direct-response student acquisition funnels, paid performance marketing, and booking automation.',
    turnaround: '3–5 days',
  },
  {
    title: 'Business Consulting',
    category: 'Consulting',
    Icon: BriefcaseIcon,
    description: 'Growth architecture, operational scaling, governance frameworks, and executive advisory.',
    turnaround: 'Flexible',
  },
  {
    title: 'Corporate Training',
    category: 'Training',
    Icon: BuildingOfficeIcon,
    description: 'Custom leadership academies, technical workforce upskilling, and enterprise compliance modules.',
    turnaround: 'Modular',
  },
];

function CategoryIcon({ category, size = 18 }: { category: string; size?: number }) {
  switch (category) {
    case 'Education':
      return <AcademicCapIcon size={size} />;
    case 'Media':
      return <VideoCameraIcon size={size} />;
    case 'Marketing':
      return <MegaphoneIcon size={size} />;
    case 'Consulting':
      return <BriefcaseIcon size={size} />;
    case 'Training':
      return <BuildingOfficeIcon size={size} />;
    case 'Technology':
      return <CodeBracketIcon size={size} />;
    case 'Finance':
      return <BanknotesIcon size={size} />;
    case 'Health':
      return <HeartPulseIcon size={size} />;
    default:
      return <SparklesIcon size={size} />;
  }
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedListings(), getCategories()]);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero Section with Ambient Lighting Mesh ───────────────────── */}
        <section className="hero-wrapper">
          <div className="hero-ambient" />
          <div className="container hero-content">
            <div className="live-pill">
              <span className="pulse-dot" />
              <span>Vetted Provider Network · Zero-Drift Financial Settlement</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(36px, 5.5vw, 62px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '20px',
                color: 'var(--text-primary)',
              }}
            >
              The marketplace for{' '}
              <span style={{ color: 'var(--brand)', fontStyle: 'italic', fontWeight: 600 }}>
                exceptional services
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(16px, 1.8vw, 19px)',
                color: 'var(--text-secondary)',
                maxWidth: '640px',
                margin: '0 auto 32px',
                lineHeight: 1.6,
              }}
            >
              Compare and commission top-tier expertise in education, creative media, marketing, and strategic consulting with verified escrow protection.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/browse" className="btn btn-primary btn-lg">
                Explore All Services
                <ArrowRightIcon size={16} />
              </Link>
              <Link href="/providers/bldr" className="btn btn-secondary btn-lg">
                bldr House Services
              </Link>
            </div>

            {/* Glassmorphic Search Container */}
            <div className="search-container-premium">
              <form action="/browse" method="get">
                <div className="search-bar-glass">
                  <SearchIcon size={20} style={{ color: 'var(--text-muted)', marginLeft: '4px' }} />
                  <input
                    name="q"
                    type="text"
                    placeholder="Search by specialty, service line, or provider name..."
                    autoComplete="off"
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 18px' }}>
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Filter Chips */}
              <div className="search-chips">
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Popular:
                </span>
                {['Education', 'Media', 'Marketing', 'Consulting', 'Training'].map((cat) => (
                  <Link key={cat} href={`/browse?category=${cat}`} className="search-chip">
                    <CategoryIcon category={cat} size={13} />
                    <span>{cat}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Key Trust Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '24px',
                maxWidth: '780px',
                margin: '56px auto 0',
                paddingTop: '32px',
                borderTop: '1px solid rgba(228, 225, 218, 0.7)',
              }}
            >
              <div>
                <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-display)' }}>
                  100%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                  Vetted Providers
                </div>
              </div>
              <div>
                <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-display)' }}>
                  $0 Drift
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                  Integer Cents Settlement
                </div>
              </div>
              <div>
                <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-display)' }}>
                  Dual Gateways
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                  Geidea & Fawry Verified
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── House-Brand Service Lines ───────────────────────────────────── */}
        <section className="section" style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '36px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div className="section-eyebrow">Direct Delivery</div>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>bldr House Service Lines</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '15px' }}>
                  Institutional-grade execution delivered directly by bldr's multidisciplinary team.
                </p>
              </div>
              <Link href="/providers/bldr" className="btn btn-secondary btn-sm">
                View Org Profile <ArrowRightIcon size={14} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
              }}
            >
              {HOUSE_SERVICES.map((svc) => {
                const IconComponent = svc.Icon;
                return (
                  <Link
                    key={svc.title}
                    href={`/browse?category=${svc.category}&provider=bldr`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card card-interactive" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                        <div className="icon-badge">
                          <IconComponent size={22} />
                        </div>
                        <span className="badge badge-muted" style={{ fontSize: '10px' }}>
                          {svc.turnaround}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                        {svc.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1 }}>
                        {svc.description}
                      </p>

                      <div
                        style={{
                          marginTop: '20px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--brand)',
                        }}
                      >
                        Explore Line <ArrowRightIcon size={13} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Featured Listings ───────────────────────────────────────────── */}
        <section className="section">
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '36px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div className="section-eyebrow">Curated Showcase</div>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Featured Services</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '15px' }}>
                  Hand-selected offerings from verified independent providers and bldr originals.
                </p>
              </div>
              <Link href="/browse?featured=true" className="btn btn-secondary btn-sm">
                Browse Full Catalog <ArrowRightIcon size={14} />
              </Link>
            </div>

            {featured.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="icon-badge" style={{ margin: '0 auto 16px', width: '56px', height: '56px' }}>
                  <SparklesIcon size={26} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Catalog Loading</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
                  Featured services are being refreshed. Explore the complete directory to find verified offerings.
                </p>
                <Link href="/browse" className="btn btn-primary">
                  Browse All Services
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}
              >
                {featured.map((listing: any) => {
                  const isRedirect = listing.purchaseType === 'REDIRECT';
                  const isBuyNow = listing.engagementType === 'BUY_NOW';

                  return (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <article className="card card-interactive" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                        {/* Header metadata row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'rgba(38, 60, 139, 0.08)',
                                color: 'var(--brand)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700,
                              }}
                            >
                              {(listing.provider?.name || 'P').slice(0, 1)}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                              {listing.provider?.name || 'Verified Provider'}
                            </span>
                          </div>

                          {listing.provider?.isHouseBrand ? (
                            <span className="badge badge-brand">bldr Original</span>
                          ) : isRedirect ? (
                            <span className="badge badge-muted" style={{ gap: '4px' }}>
                              <ExternalLinkIcon size={11} /> Partner Store
                            </span>
                          ) : (
                            <span className="badge badge-green" style={{ gap: '4px' }}>
                              <ShieldCheckIcon size={12} /> Verified Native
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            lineHeight: 1.35,
                            marginBottom: '10px',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {listing.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            marginBottom: '20px',
                            flex: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {listing.description}
                        </p>

                        {/* Card Footer: Price & Action */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          <div>
                            <div
                              className="tabular-nums"
                              style={{
                                fontSize: '20px',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-display)',
                              }}
                            >
                              {formatPrice(listing.price, listing.currency)}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {!isBuyNow ? 'Starting price' : 'Fixed pricing'}
                            </div>
                          </div>

                          <span
                            className={isBuyNow ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                            style={{ gap: '6px' }}
                          >
                            {isBuyNow ? (
                              <>
                                <CreditCardIcon size={14} /> Buy Now
                              </>
                            ) : listing.engagementType === 'REQUEST_QUOTE' ? (
                              'Request Quote'
                            ) : (
                              'Book Call'
                            )}
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Enterprise & Provider Onboarding Banner ──────────────────────── */}
        <section className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(38, 60, 139, 0.04) 0%, rgba(224, 138, 62, 0.04) 100%)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: '56px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '32px',
              }}
            >
              <div style={{ maxWidth: '600px' }}>
                <div className="section-eyebrow">Provider Network</div>
                <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, marginBottom: '12px' }}>
                  Are you an exceptional service provider?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
                  Expand your client reach on bldr. Enjoy direct escrow settlements, automatic commission ledgering, and dedicated enterprise showcase placement.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href={`${process.env.NEXT_PUBLIC_PROVIDER_PORTAL_URL || 'http://localhost:3001'}/register`}
                  className="btn btn-primary btn-lg"
                >
                  Apply as Provider <ArrowRightIcon size={16} />
                </a>
                <a
                  href={`${process.env.NEXT_PUBLIC_PROVIDER_PORTAL_URL || 'http://localhost:3001'}/login`}
                  className="btn btn-secondary btn-lg"
                >
                  Provider Sign In
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
