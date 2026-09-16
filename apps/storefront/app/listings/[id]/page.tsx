import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { BuyNowButton, LeadForm, RedirectButton } from './CTASection';
import {
  AcademicCapIcon,
  VideoCameraIcon,
  MegaphoneIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CodeBracketIcon,
  BanknotesIcon,
  HeartPulseIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  TrustLine,
} from '@bldr/ui';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getListing(id: string) {
  try {
    const res = await fetch(`${API}/listings/${id}`, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: 'Listing Not Found' };
  return {
    title: `${listing.title} | bldr`,
    description: listing.description.slice(0, 160),
  };
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}

function CategoryIcon({ category, size = 20 }: { category: string; size?: number }) {
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

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  const isNative = listing.purchaseType === 'NATIVE';
  const isBuyNow = listing.engagementType === 'BUY_NOW';
  const isRedirect = listing.purchaseType === 'REDIRECT';

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        {/* Breadcrumb Navigation */}
        <div className="container" style={{ paddingTop: '28px' }}>
          <nav style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>/</span>
            <Link href="/browse" style={{ color: 'var(--text-muted)' }}>Browse</Link>
            <span>/</span>
            <Link href={`/browse?category=${listing.category}`} style={{ color: 'var(--text-muted)' }}>
              {listing.category}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{listing.title}</span>
          </nav>
        </div>

        {/* Main Content Layout */}
        <div className="container" style={{ paddingBottom: '88px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '56px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Detail & Description */}
            <div>
              {/* Media Container */}
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  marginBottom: '32px',
                  background: 'linear-gradient(135deg, #F4F1EA 0%, #EAE6DC 100%)',
                  border: '1px solid var(--border)',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 12px rgba(20, 23, 28, 0.04)',
                }}
              >
                {listing.mediaUrls?.[0] ? (
                  <img
                    src={`${API}${listing.mediaUrls[0]}`}
                    alt={listing.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--brand)' }}>
                    <div className="icon-badge" style={{ width: '80px', height: '80px', margin: '0 auto 12px' }}>
                      <CategoryIcon category={listing.category} size={40} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {listing.category} Focus
                    </div>
                  </div>
                )}
              </div>

              {/* Badges & Meta */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span className="badge badge-muted" style={{ gap: '6px' }}>
                  <CategoryIcon category={listing.category} size={14} />
                  {listing.category}
                </span>
                {listing.tags?.map((tag: string) => (
                  <span key={tag} className="badge badge-muted">{tag}</span>
                ))}
                {isRedirect ? (
                  <span className="badge badge-muted" style={{ gap: '4px' }}>
                    <ExternalLinkIcon size={12} /> External Partner Store
                  </span>
                ) : (
                  <span className="badge badge-green" style={{ gap: '4px' }}>
                    <ShieldCheckIcon size={13} /> Verified Native Checkout
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  letterSpacing: '-0.02em',
                  fontWeight: 800,
                  marginBottom: '18px',
                  lineHeight: 1.25,
                }}
              >
                {listing.title}
              </h1>

              {/* Provider Capsule */}
              {listing.provider && (
                <Link href={`/providers/${listing.provider.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-full)',
                      padding: '6px 18px 6px 6px',
                      marginBottom: '28px',
                      boxShadow: '0 1px 3px rgba(20, 23, 28, 0.04)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'var(--brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        flexShrink: 0,
                      }}
                    >
                      {listing.provider.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {listing.provider.name}
                      </div>
                      {listing.provider.isHouseBrand && (
                        <div style={{ fontSize: '11px', color: 'var(--brand)', fontWeight: 600 }}>
                          bldr Official Line
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              <div className="divider" style={{ margin: '24px 0' }} />

              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
                Service Overview
              </h2>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  fontSize: '15px',
                }}
              >
                {listing.description}
              </div>
            </div>

            {/* Right Column: Sticky Checkout Widget */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '32px',
                  boxShadow: '0 8px 30px -4px rgba(20, 23, 28, 0.08), 0 2px 6px -1px rgba(20, 23, 28, 0.04)',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <div
                    className="tabular-nums"
                    style={{
                      fontSize: '38px',
                      fontWeight: 900,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {formatPrice(listing.price, listing.currency)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {!isBuyNow ? 'Starting price · Custom quote upon inquiry' : 'All-inclusive fixed fee'}
                  </div>
                </div>

                {/* Routing Action */}
                {isRedirect ? (
                  <RedirectButton listing={listing} />
                ) : isNative && isBuyNow ? (
                  <BuyNowButton listing={listing} />
                ) : (
                  <LeadForm listing={listing} />
                )}

                <TrustLine gatewayName="Geidea & Fawry" />

                <div className="divider" style={{ margin: '20px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <ShieldCheckIcon size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <span><strong>Escrow Protection:</strong> Funds held until milestone delivery</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <CheckCircleIcon size={16} style={{ color: 'var(--brand)', flexShrink: 0 }} />
                    <span><strong>Direct Accountability:</strong> Vetted provider SLA</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <ClockIcon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span><strong>Prompt Onboarding:</strong> Kickoff within 24–48 hours</span>
                  </div>
                </div>
              </div>

              {listing.provider && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Link
                    href={`/providers/${listing.provider.slug}`}
                    style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: 600 }}
                  >
                    View all services from {listing.provider.name} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
