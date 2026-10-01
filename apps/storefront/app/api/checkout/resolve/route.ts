import { NextResponse } from 'next/server';
import { PRODUCTS_CATALOG } from '../../../products/data';
import { getVentureConfig } from '../../../../lib/ventures';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || '';
    const productId = searchParams.get('productId') || '';

    let matchedProduct = null;
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
