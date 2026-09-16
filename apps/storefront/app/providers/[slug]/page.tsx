import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getProvider(slug: string) {
  try {
    const res = await fetch(`${API}/providers/public/${slug}`, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return { title: 'Provider Not Found' };
  return {
    title: `${provider.name} — Service Provider`,
    description: provider.bio || provider.tagline || `Browse services from ${provider.name}`,
  };
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', minimumFractionDigits: 0 }).format(price);
}

function engagementLabel(type: string) {
  if (type === 'REQUEST_QUOTE') return 'Get a Quote';
  if (type === 'BOOK_CALL') return 'Book a Call';
  return 'Buy Now';
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProvider(slug);

  if (!provider) notFound();

  const listings: any[] = provider.listings || [];

  return (
    <>
      <Navbar />
      <main>
        {/* Banner */}
        <div style={{
          height: '240px',
          background: provider.bannerUrl
            ? `url(${provider.bannerUrl}) center/cover`
            : 'linear-gradient(135deg, rgba(124,58,237,0.4) 0%, rgba(232,121,249,0.2) 100%)',
          position: 'relative',
        }}>
          {provider.isHouseBrand && (
            <div style={{ position: 'absolute', top: '20px', left: '24px' }}>
              <span className="badge badge-accent" style={{ fontSize: '12px', padding: '6px 14px' }}>
                ✦ bldr Official
              </span>
            </div>
          )}
        </div>

        {/* Profile header */}
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '20px',
            marginTop: '-40px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-lg)',
              background: provider.logoUrl ? `url(${provider.logoUrl}) center/cover` : 'linear-gradient(135deg, var(--accent-600), #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 900,
              color: 'white',
              border: '4px solid var(--bg-base)',
              flexShrink: 0,
            }}>
              {!provider.logoUrl && provider.name[0]}
            </div>
            <div style={{ flex: 1, paddingBottom: '4px' }}>
              <h1 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900, marginBottom: '4px' }}>
                {provider.name}
              </h1>
              {provider.tagline && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{provider.tagline}</p>
              )}
            </div>
            {provider.website && (
              <a href={provider.website} target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary btn-sm">
                Visit Website ↗
              </a>
            )}
          </div>

          {provider.bio && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              marginBottom: '40px',
            }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{provider.bio}</p>
            </div>
          )}

          {/* Listings */}
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: '24px' }}>
              Services ({listings.length})
            </h2>
          </div>

          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <p>No published listings yet.</p>
            </div>
          ) : (
            <div className="listing-grid" style={{ marginBottom: '80px' }}>
              {listings.map((listing: any) => (
                <Link key={listing.id} href={`/listings/${listing.id}`} style={{ textDecoration: 'none' }}>
                  <article className="listing-card">
                    <div className="listing-card-media" style={{ height: '180px' }}>
                      {listing.mediaUrls?.[0] ? (
                        <img src={`${API}${listing.mediaUrls[0]}`} alt={listing.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="listing-card-media-placeholder">📦</span>
                      )}
                      {listing.purchaseType === 'REDIRECT' && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                          <span className="badge badge-muted">External →</span>
                        </div>
                      )}
                    </div>
                    <div className="listing-card-body">
                      <h3 className="listing-card-title">{listing.title}</h3>
                      <p className="listing-card-description">{listing.description}</p>
                      <div className="listing-card-footer">
                        <div className="listing-price">{formatPrice(listing.price, listing.currency)}</div>
                        <span className="btn btn-primary btn-sm">
                          {engagementLabel(listing.engagementType)}
                        </span>
                      </div>
                    </div>
                  </article>
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
