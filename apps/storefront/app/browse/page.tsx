import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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
  SearchIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  CreditCardIcon,
} from '@bldr/ui';

export const metadata: Metadata = {
  title: 'Browse Services | bldr',
  description: 'Search and filter services from verified providers on bldr.',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getListings(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API}/listings?${qs}`, { next: { revalidate: 30 } });
    if (!res.ok) return { data: [], meta: { total: 0 } };
    return res.json();
  } catch {
    return { data: [], meta: { total: 0 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API}/listings/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}

function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
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

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const { q, category, featured, page = '1' } = params;

  const apiParams: Record<string, string> = { page };
  if (q) apiParams.q = q;
  if (category) apiParams.category = category;
  if (featured) apiParams.featured = featured;

  const [result, categories] = await Promise.all([
    getListings(apiParams),
    getCategories(),
  ]);

  const listings: any[] = result.data || [];
  const meta = result.meta || { total: 0 };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', padding: '40px 0 80px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div className="section-eyebrow">Service Catalog</div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: '8px' }}>
              {category ? `${category} Services` : q ? `Results for "${q}"` : 'All Verified Services'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              {meta.total} accredited service{meta.total !== 1 ? 's' : ''} available for commission
            </p>
          </div>

          {/* Search + Filter Bar */}
          <form method="get" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div className="search-bar-glass" style={{ flex: 1, minWidth: '280px' }}>
              <SearchIcon size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                name="q"
                type="text"
                defaultValue={q || ''}
                placeholder="Search services, methodologies, or provider names…"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
              Filter
            </button>
            {(q || category || featured) && (
              <Link href="/browse" className="btn btn-secondary">
                Clear Filters
              </Link>
            )}
          </form>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Link
              href="/browse"
              className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '999px' }}
            >
              All Categories
            </Link>
            {categories.map((c: { category: string; count: number }) => (
              <Link
                key={c.category}
                href={`/browse?category=${c.category}`}
                className={`btn btn-sm ${category === c.category ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '999px', gap: '6px' }}
              >
                <CategoryIcon category={c.category} size={14} />
                <span>{c.category}</span>
                <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '2px' }}>
                  ({c.count})
                </span>
              </Link>
            ))}
          </div>

          {/* Listings Grid */}
          {listings.length === 0 ? (
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
                <SearchIcon size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No matching services found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
                Try adjusting your search criteria or explore our featured catalog.
              </p>
              <Link href="/browse" className="btn btn-primary">
                Reset Catalog
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
              {listings.map((listing: any) => {
                const isRedirect = listing.purchaseType === 'REDIRECT';
                const isBuyNow = listing.engagementType === 'BUY_NOW';

                return (
                  <Link key={listing.id} href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
                    <article className="card card-interactive" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              background: 'rgba(38, 60, 139, 0.08)',
                              color: 'var(--brand)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {(listing.provider?.name || 'P').slice(0, 1)}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {listing.provider?.name}
                          </span>
                        </div>

                        {listing.provider?.isHouseBrand ? (
                          <span className="badge badge-brand">bldr Original</span>
                        ) : isRedirect ? (
                          <span className="badge badge-muted" style={{ gap: '4px' }}>
                            <ExternalLinkIcon size={11} /> Partner
                          </span>
                        ) : (
                          <span className="badge badge-green" style={{ gap: '4px' }}>
                            <ShieldCheckIcon size={12} /> Native
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: '17px',
                          fontWeight: 700,
                          lineHeight: 1.35,
                          marginBottom: '8px',
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
                            {!isBuyNow ? 'Starting price' : 'Fixed fee'}
                          </div>
                        </div>

                        <span
                          className={isBuyNow ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                          style={{ gap: '6px' }}
                        >
                          {isBuyNow ? (
                            <>
                              <CreditCardIcon size={13} /> Buy Now
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

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/browse?${new URLSearchParams({ ...apiParams, page: String(p) })}`}
                  className={`btn ${Number(page) === p ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
