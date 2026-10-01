import { NextResponse } from 'next/server';
import { PRODUCTS_CATALOG } from '../../../products/data';
import { getVentureConfig } from '../../../../lib/ventures';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || '';
    const productId = searchParams.get('productId') || '';

    const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    let matchedProduct: any = null;

    // 1. Check local catalog first
    if (productId) {
      matchedProduct = PRODUCTS_CATALOG.find(
        (p) => p.id === productId || p.slug === productId || p.paySlug === productId
      );
    }
    if (!matchedProduct && slug) {
      matchedProduct = PRODUCTS_CATALOG.find(
        (p) => p.paySlug === slug || p.slug === slug || p.id === slug
      );
    }

    // 2. Fall back to PostgreSQL database API if not found in static catalog
    if (!matchedProduct && productId) {
      try {
        const dbRes = await fetch(`${API_BASE}/listings/${productId}`, {
          next: { revalidate: 60 },
        });
        if (dbRes.ok) {
          const item = await dbRes.json();
          if (item) {
            matchedProduct = {
              id: item.id,
              slug: item.id,
              paySlug: item.id,
              title: item.title,
              titleAr: item.title,
              priceEGP: Number(item.price),
              provider: item.provider?.name || 'bldr Partner',
              providerCode: item.provider?.slug?.toUpperCase() || 'BLDR',
              ventureId: item.provider?.slug?.toUpperCase() || 'BLDR',
              saleMode: item.purchaseType === 'REDIRECT' ? 'REDIRECT' : 'DIRECT',
              redirectUrl: item.redirectUrl || null,
              ctaLabel: item.engagementType === 'BUY_NOW' ? 'Buy now' : 'Request Info',
              ctaLabelAr: item.engagementType === 'BUY_NOW' ? 'شراء الآن' : 'طلب معلومات',
            };
          }
        }
      } catch {
        // Fallback to static resolution if API is offline
      }
    }

    if (matchedProduct) {
      const venture = getVentureConfig(matchedProduct.ventureId || matchedProduct.providerCode);
      return NextResponse.json({
        found: true,
        productId: matchedProduct.id,
        slug: matchedProduct.paySlug,
        title: matchedProduct.title,
        titleAr: matchedProduct.titleAr,
        priceEGP: matchedProduct.priceEGP,
        currency: 'EGP',
        ventureId: venture.id,
        ventureCode: venture.code,
        ventureName: matchedProduct.provider,
        supportPhone: venture.supportPhone,
        supportEmail: venture.supportEmail,
        cardWalletGateway: venture.cardWalletGateway,
        fawryEnabled: venture.fawryEnabled,
        codeActivationEnabled: venture.codeActivationEnabled,
        ctaLabel: matchedProduct.ctaLabel || venture.ctaLabel || 'Buy now',
        ctaLabelAr: matchedProduct.ctaLabelAr || venture.ctaLabelAr || 'شراء الآن',
        saleMode: matchedProduct.saleMode || 'DIRECT',
        redirectUrl: matchedProduct.redirectUrl || null,
      });
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
