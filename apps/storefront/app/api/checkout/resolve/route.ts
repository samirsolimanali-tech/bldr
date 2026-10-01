import { NextResponse } from 'next/server';
import { getVentureConfig } from '../../../../lib/ventures';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || '';
    const productId = searchParams.get('productId') || '';

    const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    // ── Call One Central Authoritative Checkout Service (apps/api) ───────────
    try {
      const apiRes = await fetch(
        `${API_BASE}/v1/checkout/sessions/resolve?slug=${encodeURIComponent(slug)}&productId=${encodeURIComponent(productId)}`,
        { next: { revalidate: 30 } }
      );

      if (apiRes.ok) {
        const item = await apiRes.json();
        const venture = getVentureConfig(item.ventureCode || item.ventureId);
        return NextResponse.json({
          found: true,
          productId: item.productId,
          slug: item.slug,
          title: item.title,
          titleAr: item.titleAr,
          priceEGP: item.priceEGP,
          currency: 'EGP',
          ventureId: venture.id,
          ventureCode: venture.code,
          ventureName: item.ventureName || venture.displayName,
          supportPhone: venture.supportPhone,
          supportEmail: venture.supportEmail,
          cardWalletGateway: venture.cardWalletGateway,
          fawryEnabled: venture.fawryEnabled,
          codeActivationEnabled: venture.codeActivationEnabled,
          ctaLabel: item.ctaLabel || venture.ctaLabel || 'Buy now',
          ctaLabelAr: item.ctaLabelAr || venture.ctaLabelAr || 'شراء الآن',
          saleMode: item.saleMode || 'DIRECT',
          redirectUrl: item.redirectUrl || null,
        });
      } else if (apiRes.status === 404 && process.env.NODE_ENV === 'production') {
        // Fail closed in production if product not found in authoritative catalog
        return NextResponse.json(
          { error: 'Product or listing not found in catalog. Checkout refused.' },
          { status: 404 }
        );
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Authoritative checkout service unavailable. Checkout refused.' },
          { status: 503 }
        );
      }
    }

    // Fallback for direct payment link slugs without a product catalog entry
    const prefix = slug.slice(0, 2).toLowerCase();
    const venture = getVentureConfig(prefix);

    return NextResponse.json({
      found: false,
      slug,
      ventureId: venture.id,
      ventureCode: venture.code,
      ventureName: venture.displayName,
      supportPhone: venture.supportPhone,
      supportEmail: venture.supportEmail,
      cardWalletGateway: venture.cardWalletGateway,
      fawryEnabled: venture.fawryEnabled,
      codeActivationEnabled: venture.codeActivationEnabled,
      ctaLabel: venture.ctaLabel || 'Buy now',
      ctaLabelAr: venture.ctaLabelAr || 'شراء الآن',
      saleMode: 'DIRECT',
      redirectUrl: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to resolve checkout details' },
      { status: 500 }
    );
  }
}
