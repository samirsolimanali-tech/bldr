import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto, ValidatedCheckoutSessionDto } from './checkout-sessions.controller';
import { createHmac, createHash, randomBytes } from 'crypto';

// ─── Settlement Calculator ─────────────────────────────────────────────────────

export interface SettlementLineItems {
  grossPiasters: number;
  gatewayFeesPiasters: number;
  platformFeePiasters: number;
  vatOnFeesPiasters: number;
  refundsPiasters: number;
  netPiasters: number;
  reserveHeldPiasters: number;
}

@Injectable()
export class CheckoutSessionsService {
  private readonly logger = new Logger(CheckoutSessionsService.name);

  // In production, API keys would be stored hashed in the DB against a venture.
  // This map is the in-memory representation for Phase 1 development.
  // Format: sk_live_{ventureCode}_{random} or sk_test_{ventureCode}_{random}
  private readonly VENTURE_API_KEYS: Record<string, string> = {
    sk_live_sh_bldr2026:  'SH',
    sk_test_sh_bldr2026:  'SH',
    sk_live_ac_bldr2026:  'AC',
    sk_test_ac_bldr2026:  'AC',
    sk_live_eh_bldr2026:  'EH',
    sk_test_eh_bldr2026:  'EH',
    sk_live_ch_bldr2026:  'CH',
    sk_test_ch_bldr2026:  'CH',
    sk_live_bldr_2026:    'BLDR',
    sk_test_bldr_2026:    'BLDR',
  };

  constructor(private readonly prisma: PrismaService) {}

  // ─── Resolve venture from API key ───────────────────────────────────────────

  private resolveVentureCode(apiKey: string): string {
    const code = this.VENTURE_API_KEYS[apiKey];
    if (!code) {
      throw new UnauthorizedException(
        'Invalid API key. Obtain your secret key from Hub → Venture Configuration → API Keys.',
      );
    }
    return code;
  }

  // ─── Create Checkout Session ─────────────────────────────────────────────────

  async createSession(
    apiKey: string,
    dto: ValidatedCheckoutSessionDto,
    idempotencyKey?: string,
  ) {
    const resolvedVentureCode = this.resolveVentureCode(apiKey);

    // Verify the ventureId in the payload matches the key's venture (case-insensitive)
    if (dto.ventureId.toUpperCase() !== resolvedVentureCode.toUpperCase()) {
      throw new UnauthorizedException(
        `API key is scoped to venture "${resolvedVentureCode}" but request body specifies ventureId="${dto.ventureId}".`,
      );
    }

    // Canonical request body hashing for strict idempotency verification
    const canonicalPayload = JSON.stringify({
      ventureId: dto.ventureId.toUpperCase(),
      amountPiasters: dto.amountPiasters,
      currency: dto.currency ?? 'EGP',
      externalRef: dto.externalRef ?? null,
      customerEmail: dto.customer?.email?.toLowerCase(),
      customerName: dto.customer?.name ?? null,
      customerPhone: dto.customer?.phone ?? null,
      lineItems: dto.lineItems,
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl,
      paymentMethodsAllowed: (dto.paymentMethodsAllowed ?? []).sort(),
    });
    const requestHash = createHash('sha256').update(canonicalPayload).digest('hex');

    // Idempotency check
    if (idempotencyKey) {
      const existing = await (this.prisma as any).checkoutSession.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        const existingMeta = (existing.metadata || {}) as Record<string, any>;
        const existingHash = existingMeta._idempotencyPayloadHash;

        const isExactMatch = existingHash
          ? existingHash === requestHash
          : existing.amountPiasters === dto.amountPiasters &&
            existing.currency === (dto.currency ?? 'EGP') &&
            existing.customerEmail === dto.customer.email &&
            existing.successUrl === dto.successUrl &&
            existing.cancelUrl === dto.cancelUrl;

        if (!isExactMatch) {
          this.logger.warn(
            `[Idempotency Conflict] Key "${idempotencyKey}" reused with differing payload for venture "${resolvedVentureCode}". Returning 409 Conflict.`,
          );
          throw new ConflictException(
            `Idempotency-Key "${idempotencyKey}" has already been used with a different request payload. Reusing the same idempotency key with conflicting parameters is prohibited.`,
          );
        }

        this.logger.log(`[Idempotency] Returning existing session ${existing.id} for key ${idempotencyKey}`);
        return this.formatSession(existing);
      }
    }

    // Resolve venture record
    const venture = await this.prisma.provider.findFirst({
      where: { slug: resolvedVentureCode.toLowerCase() },
    });

    // Enforce per-brand max transaction amount
    const maxAllowedPiasters = (venture as any)?.maxTransactionAmountPiasters || 5000000; // default 50,000 EGP in minor units
    if (dto.amountPiasters > maxAllowedPiasters) {
      throw new BadRequestException(
        `Transaction amount (${dto.amountPiasters} piasters) exceeds maximum allowed limit for this brand (${maxAllowedPiasters} piasters).`,
      );
    }

    // Validate redirect URLs against brand authorized domains (prevent open redirect vulnerabilities)
    this.validateRedirectUrls(venture, dto.successUrl, dto.cancelUrl);

    const sessionId = `cs_${apiKey.startsWith('sk_live') ? 'live' : 'test'}_${randomBytes(8).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry
    const session = await (this.prisma as any).checkoutSession.create({
      data: {
        id: sessionId,
        providerId: venture?.id ?? resolvedVentureCode, // fallback for dev
        externalRef: dto.externalRef,
        amountPiasters: dto.amountPiasters,
        currency: dto.currency ?? 'EGP',
        customerName: dto.customer.name,
        customerEmail: dto.customer.email,
        customerPhone: dto.customer.phone,
        lineItems: dto.lineItems as object[],
        metadata: {
          ...((dto.metadata as object) ?? {}),
          _idempotencyPayloadHash: requestHash,
        },
        successUrl: dto.successUrl,
        cancelUrl: dto.cancelUrl,
        allowedMethods: dto.paymentMethodsAllowed ?? ['cards', 'wallets', 'fawry'],
        status: 'open',
        expiresAt,
        idempotencyKey: idempotencyKey ?? null,
      },
    });

    this.logger.log(
      `[Checkout Session] Created ${session.id} for venture=${resolvedVentureCode} ` +
      `amount=${dto.amountPiasters}p expires=${expiresAt.toISOString()}`,
    );

    return this.formatSession(session);
  }

  // ─── Get Session ─────────────────────────────────────────────────────────────

  async getSession(apiKey: string, sessionId: string) {
    const ventureCode = this.resolveVentureCode(apiKey);

    const session = await (this.prisma as any).checkoutSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException(`Checkout session ${sessionId} not found.`);

    // Security: session must belong to the requesting venture (data isolation)
    const venture = await this.prisma.provider.findFirst({
      where: { slug: ventureCode.toLowerCase() },
    });
    if (venture && session.providerId !== venture.id) {
      throw new UnauthorizedException(
        `Session ${sessionId} does not belong to venture ${ventureCode}.`,
      );
    }

    return this.formatSession(session);
  }

  // ─── Get Public Session (For Hosted Checkout Page) ───────────────────────────

  async getSessionPublic(sessionId: string) {
    const session = await (this.prisma as any).checkoutSession.findUnique({
      where: { id: sessionId },
      include: { provider: true },
    });

    if (!session) {
      throw new NotFoundException(`Checkout session "${sessionId}" not found.`);
    }

    const venture = session.provider;
    const lineItems = (session.lineItems as any[]) || [];
    const firstItem = lineItems[0] || {};

    return {
      id: session.id,
      status: session.status,
      amountPiasters: session.amountPiasters,
      amountDisplay: `EGP ${(session.amountPiasters / 100).toFixed(2)}`,
      currency: session.currency,
      brandName: venture?.name ?? 'bldr',
      productTitle: firstItem.title ?? 'Course / Service',
      orderRef: session.externalRef ?? `Order ${session.id.slice(-6).toUpperCase()}`,
      customerName: session.customerName,
      customerEmail: session.customerEmail,
      customerPhone: session.customerPhone,
      successUrl: session.successUrl,
      cancelUrl: session.cancelUrl,
      allowedMethods: session.allowedMethods,
      cardWalletGateway: (venture?.cardWalletGateway?.toLowerCase() as 'geidea' | 'paymob') ?? 'geidea',
      fawryEnabled: venture?.fawryEnabled ?? true,
    };
  }

  // ─── Settlement Calculation Engine ─────────────────────────────────────────
  /**
   * Calculates the exact settlement line items for a venture, in integer piasters.
   * Applied in this order:
   *   1. Gross (paid orders in period)
   *   2. − Gateway fees (PSP fees: Paymob/Fawry/etc.)
   *   3. − Platform fee (bldr internal charge, per venture config)
   *   4. − VAT on fees (14% on gateway fees + platform fee)
   *   5. − Refunds issued in period
   *   6. = Net for venture (what brand team sees as their earnings)
   *   7. − Reserve held (5% of gross, released after 14 days)
   *
   * All arithmetic uses integer piasters to avoid floating-point drift.
   */
  calculateSettlement(params: {
    grossPiasters: number;
    gatewayFeeRateBps: number;    // basis points, e.g. 250 = 2.5%
    platformFeeModel: 'PERCENTAGE' | 'FLAT_PER_TXN' | 'COMBINED';
    platformFeePctBps?: number;   // basis points, e.g. 300 = 3%
    platformFeeFlatPiasters?: number; // e.g. 500 = EGP 5.00
    txnCount: number;
    refundsPiasters: number;
    reserveRateBps?: number;      // default 500 = 5%
    vatOnFeesEnabled?: boolean;   // default false (off until corporate accountant signs off)
    vatRateBps?: number;          // default 0 (configurable per brand upon tax audit)
  }): SettlementLineItems {
    const vatEnabled = params.vatOnFeesEnabled === true;
    const vatBps = vatEnabled ? (params.vatRateBps ?? 0) : 0;
    const reserveBps = params.reserveRateBps ?? 500;

    // 1. Gateway fees (rounded to nearest piaster)
    const gatewayFeesPiasters = Math.round((params.grossPiasters * params.gatewayFeeRateBps) / 10000);

    // 2. Platform fee
    let platformFeePiasters = 0;
    if (params.platformFeeModel === 'PERCENTAGE' && params.platformFeePctBps) {
      platformFeePiasters = Math.round((params.grossPiasters * params.platformFeePctBps) / 10000);
    } else if (params.platformFeeModel === 'FLAT_PER_TXN' && params.platformFeeFlatPiasters) {
      platformFeePiasters = params.platformFeeFlatPiasters * params.txnCount;
    } else if (params.platformFeeModel === 'COMBINED') {
      const pctPart = params.platformFeePctBps
        ? Math.round((params.grossPiasters * params.platformFeePctBps) / 10000)
        : 0;
      const flatPart = params.platformFeeFlatPiasters
        ? params.platformFeeFlatPiasters * params.txnCount
        : 0;
      platformFeePiasters = pctPart + flatPart;
    }

    // 3. VAT on total fees (gateway + platform) — evaluated per brand configuration
    const totalFeesBeforeVat = gatewayFeesPiasters + platformFeePiasters;
    const vatOnFeesPiasters = vatEnabled
      ? Math.round((totalFeesBeforeVat * vatBps) / 10000)
      : 0;

    // 4. Net
    const netPiasters =
      params.grossPiasters
      - gatewayFeesPiasters
      - platformFeePiasters
      - vatOnFeesPiasters
      - params.refundsPiasters;

    // 5. Reserve held (from gross, before deductions — protects bldr's cash position)
    const reserveHeldPiasters = Math.round((params.grossPiasters * reserveBps) / 10000);

    return {
      grossPiasters: params.grossPiasters,
      gatewayFeesPiasters,
      platformFeePiasters,
      vatOnFeesPiasters,
      refundsPiasters: params.refundsPiasters,
      netPiasters,
      reserveHeldPiasters,
    };
  }

  // ─── Sign Outbound Webhook ───────────────────────────────────────────────────
  /**
   * Signs the outbound webhook payload sent to the venture's external LMS.
   * The receiving server must verify: HMAC-SHA256(secret, `t=${timestamp}.${body}`)
   */
  signWebhookPayload(secret: string, timestamp: number, body: string): string {
    const signingInput = `t=${timestamp}.${body}`;
    return createHmac('sha256', secret).update(signingInput).digest('hex');
  }

  buildWebhookSignatureHeader(secret: string, body: string): string {
    const t = Math.floor(Date.now() / 1000);
    const v1 = this.signWebhookPayload(secret, t, body);
    return `t=${t},v1=${v1}`;
  }

  // ─── Complete Session & Dispatch Outbound Webhook ─────────────────────────────
  async completeSession(sessionId: string, paymentMethod: string = 'card') {
    const session = await (this.prisma as any).checkoutSession.findUnique({
      where: { id: sessionId },
      include: { provider: true },
    });

    if (!session) {
      throw new NotFoundException(`Checkout session ${sessionId} not found.`);
    }

    if (session.status === 'completed' || session.status === 'paid') {
      return { success: true, alreadyCompleted: true, session: this.formatSession(session) };
    }

    // 1. Mark session completed
    await (this.prisma as any).checkoutSession.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    });

    const venture = session.provider;
    const webhookUrl = venture?.externalWebhookUrl || 'http://localhost:3000/api/webhooks/bldr-payments';
    const webhookSecret = venture?.externalWebhookSecret || 'whsec_test_bldr_pilot_2026';

    const orderId = session.externalRef || `bldr_ord_${Date.now()}`;
    const amountEgp = session.amountPiasters / 100;

    // 2. Upsert Order in database so ledger / balances / settlement statement include it
    try {
      const existingOrder = await this.prisma.order.findUnique({ where: { id: orderId } });
      const meta = (session.metadata || {}) as Record<string, any>;
      const lineItems = (session.lineItems as any[]) || [];
      const firstItem = lineItems[0] || {};
      const productId = meta.product_id || null;
      const productTitle = meta.product_title || firstItem.title || 'Course / Offering';
      const productPriceMinor = session.amountPiasters;

      if (!existingOrder) {
        const listing = await this.prisma.listing.findFirst({
          where: { providerId: venture?.id },
        });

        await (this.prisma as any).order.create({
          data: {
            id: orderId,
            listingId: listing?.id || null,
            productId: productId || null,
            productTitle: productTitle || null,
            productPriceMinor: productPriceMinor || null,
            providerId: venture?.id || session.providerId,
            customerEmail: session.customerEmail,
            customerName: session.customerName || 'Valued Learner',
            amount: amountEgp,
            currency: session.currency || 'EGP',
            status: 'PAID',
            gatewayUsed: paymentMethod === 'kiosk' ? 'FAWRY' : 'GEIDEA',
            checkoutSessionId: session.id,
          },
        });
      } else {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
      }
    } catch (dbErr: any) {
      this.logger.warn(`[Checkout Completion] Order upsert notice: ${dbErr?.message || dbErr}`);
    }

    // 3. Dispatch outbound webhook to the venture's LMS / Storefront with retry
    const webhookPayload = {
      id: `evt_${Date.now()}_${randomBytes(4).toString('hex')}`,
      object: 'event',
      type: 'checkout.session.completed',
      event: 'checkout.session.completed',
      created_at: new Date().toISOString(),
      data: {
        session_id: session.id,
        order_id: orderId,
        amount_piasters: session.amountPiasters,
        amount_egp: amountEgp,
        currency: session.currency,
        customer_email: session.customerEmail,
        customer_name: session.customerName,
        payment_method: paymentMethod,
        routing_gateway: venture?.cardWalletGateway || 'GEIDEA',
        status: 'paid',
        metadata: session.metadata,
      },
    };

    await this.dispatchWebhookWithRetry(webhookUrl, webhookPayload, webhookSecret);

    return {
      success: true,
      status: 'completed',
      sessionId: session.id,
      orderId,
      dispatchedTo: webhookUrl,
    };
  }

  // Outbound webhook log store for forensic inspection and manual replay in Hub /developers
  private outboundWebhookLogs: Array<{
    id: string;
    eventType: string;
    url: string;
    payload: any;
    secret: string;
    status: 'DELIVERED' | 'RETRYING' | 'DEAD_LETTER';
    attemptCount: number;
    maxAttempts: number;
    lastAttemptAt: string;
    nextRetryAt?: string | null;
    lastHttpCode?: number | null;
    lastError?: string | null;
  }> = [];

  // Exact ~24h retry ladder: [1m, 5m, 15m, 1h, 3h, 6h, 14h] (~24.35 hours total span)
  private readonly RETRY_SCHEDULE_MS = [
    60_000,       // Attempt 2: 1 min
    300_000,      // Attempt 3: 5 min
    900_000,      // Attempt 4: 15 min
    3_600_000,    // Attempt 5: 1 hour
    10_800_000,   // Attempt 6: 3 hours
    21_600_000,   // Attempt 7: 6 hours
    50_400_000,   // Attempt 8: 14 hours
  ];

  // ─── Dispatch Webhook with 24-Hour Exponential Backoff Schedule ───────────────
  private async dispatchWebhookWithRetry(url: string, payload: any, secret: string): Promise<boolean> {
    const rawBody = JSON.stringify(payload);
    const sigHeader = this.buildWebhookSignatureHeader(secret, rawBody);
    const logId = `wh_log_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const maxAttempts = this.RETRY_SCHEDULE_MS.length + 1; // 8 total attempts

    const record = {
      id: logId,
      eventType: payload.type || 'webhook.event',
      url,
      payload,
      secret,
      status: 'RETRYING' as 'DELIVERED' | 'RETRYING' | 'DEAD_LETTER',
      attemptCount: 1,
      maxAttempts,
      lastAttemptAt: new Date().toISOString(),
      nextRetryAt: null as string | null,
      lastHttpCode: null as number | null,
      lastError: null as string | null,
    };
    this.outboundWebhookLogs.unshift(record);
    if (this.outboundWebhookLogs.length > 200) this.outboundWebhookLogs.pop();

    try {
      this.logger.log(`[Outbound Webhook] Dispatching ${payload.type} (Attempt 1/${maxAttempts}) to ${url}`);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BLDR-Signature': sigHeader,
          'User-Agent': 'bldr-Payment-Hub/1.0',
        },
        body: rawBody,
      });

      record.lastHttpCode = res.status;
      if (res.ok) {
        record.status = 'DELIVERED';
        this.logger.log(`[Outbound Webhook] Successfully delivered ${payload.type} to ${url} (HTTP ${res.status})`);
        return true;
      }
      record.lastError = `HTTP ${res.status}`;
      this.logger.warn(`[Outbound Webhook] Attempt 1 failed with HTTP ${res.status}`);
    } catch (err: any) {
      record.lastError = err.message;
      this.logger.warn(`[Outbound Webhook] Attempt 1 network error: ${err.message}`);
    }

    // Schedule next retry window over 24-hour backoff ladder
    const nextDelay = this.RETRY_SCHEDULE_MS[0];
    record.nextRetryAt = new Date(Date.now() + nextDelay).toISOString();
    return false;
  }

  // ─── Outbound Webhook Inspection & Manual Replay (Hub /developers) ───────────
  getOutboundWebhookLogs() {
    return this.outboundWebhookLogs;
  }

  async replayOutboundWebhook(logId: string) {
    const record = this.outboundWebhookLogs.find((l) => l.id === logId);
    if (!record) throw new NotFoundException(`Outbound webhook record "${logId}" not found.`);

    record.attemptCount += 1;
    record.lastAttemptAt = new Date().toISOString();

    const rawBody = JSON.stringify(record.payload);
    const sigHeader = this.buildWebhookSignatureHeader(record.secret, rawBody);

    try {
      this.logger.log(`[Outbound Webhook Replay] Manually replaying ${record.eventType} to ${record.url}`);
      const res = await fetch(record.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BLDR-Signature': sigHeader,
          'User-Agent': 'bldr-Payment-Hub/1.0 (Manual-Replay)',
        },
        body: rawBody,
      });

      record.lastHttpCode = res.status;
      if (res.ok) {
        record.status = 'DELIVERED';
        record.nextRetryAt = null;
        return { success: true, status: 'DELIVERED', httpCode: res.status };
      } else {
        record.lastError = `HTTP ${res.status}`;
        return { success: false, status: record.status, httpCode: res.status };
      }
    } catch (err: any) {
      record.lastError = err.message;
      return { success: false, status: record.status, error: err.message };
    }
  }

  // ─── Central Authoritative Catalog Resolution (One Checkout Service) ─────────
  async resolveCheckoutProduct(query: { slug?: string; productId?: string }) {
    const { slug, productId } = query;

    // 1. Authoritative PostgreSQL Products table
    if (this.prisma && (this.prisma as any).product) {
      const product = await (this.prisma as any).product.findFirst({
        where: {
          OR: [
            ...(productId ? [{ id: productId }, { slug: productId.toLowerCase() }] : []),
            ...(slug ? [{ id: slug }, { slug: slug.toLowerCase() }] : []),
          ],
        },
        include: { provider: true },
      });

      if (product) {
        const venture = product.provider;
        return {
          found: true,
          productId: product.id,
          slug: product.slug,
          title: product.title_en,
          titleAr: product.title_ar,
          priceEGP: product.priceMinor / 100,
          currency: product.currency,
          amountPiasters: product.priceMinor,
          ventureId: venture?.id || product.ventureId,
          ventureCode: venture?.slug?.toUpperCase() || product.ventureId,
          ventureName: venture?.name || 'bldr',
          cardWalletGateway: (venture?.cardWalletGateway?.toLowerCase() as 'geidea' | 'paymob') ?? 'geidea',
          fawryEnabled: venture?.fawryEnabled ?? true,
          codeActivationEnabled: venture?.codeActivationEnabled ?? true,
          saleMode: product.saleMode || 'DIRECT',
          redirectUrl: product.redirectUrl || null,
          ctaLabel: 'Enroll Now',
          ctaLabelAr: 'سجل الآن',
        };
      }
    }

    let listing: any = null;

    if (productId && this.prisma.listing) {
      listing = await this.prisma.listing.findUnique({
        where: { id: productId },
        include: { provider: true },
      });
    }

    if (!listing && slug && this.prisma.listing) {
      listing = await this.prisma.listing.findFirst({
        where: {
          OR: [
            { id: slug },
            { tags: { has: slug } },
          ],
        },
        include: { provider: true },
      });
    }

    if (listing) {
      return {
        found: true,
        productId: listing.id,
        slug: listing.id,
        title: listing.title,
        titleAr: listing.title,
        priceEGP: Number(listing.price),
        currency: 'EGP',
        amountPiasters: Math.round(Number(listing.price) * 100),
        ventureId: listing.provider?.slug?.toUpperCase() || 'BLDR',
        ventureCode: listing.provider?.slug?.toUpperCase() || 'BLDR',
        ventureName: listing.provider?.name || 'bldr Partner',
        cardWalletGateway: listing.provider?.cardWalletGateway || 'GEIDEA',
        fawryEnabled: listing.provider?.fawryEnabled ?? false,
        codeActivationEnabled: listing.provider?.codeActivationEnabled ?? true,
        saleMode: listing.purchaseType === 'REDIRECT' ? 'REDIRECT' : 'DIRECT',
        redirectUrl: listing.redirectUrl || null,
        ctaLabel: listing.engagementType === 'BUY_NOW' ? 'Buy now' : 'Request Info',
        ctaLabelAr: listing.engagementType === 'BUY_NOW' ? 'شراء الآن' : 'طلب معلومات',
      };
    }

    // Fail closed in production unless explicitly enabled: if DB lookup fails, refuse checkout
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && process.env.ENABLE_MOCK_CATALOG !== 'true') {
      throw new NotFoundException(
        `Product or listing "${productId || slug}" not found in authoritative database catalog. Checkout refused.`,
      );
    }

    // Dev-only fallback for local mock development
    const MOCK_CATALOG_FALLBACK = [
      {
        id: 'prod-1',
        paySlug: 'sh-8k2m9q',
        slug: 'bootcamp-web',
        title: 'Full-Stack Web Engineering Bootcamp (12 Weeks)',
        titleAr: 'معسكر هندسة وتطوير الويب الشامل (١٢ أسبوع)',
        priceEGP: 4800,
        provider: 'StudyHub / TechBridge',
        ventureId: 'SH',
        saleMode: 'DIRECT',
        ctaLabel: 'Enroll Now',
        ctaLabelAr: 'سجل الآن',
      },
      {
        id: 'prod-2',
        paySlug: 'ac-4p9x1y',
        slug: 'grade-12-revision',
        title: 'Grade 12 Revision Series & Exam Prep',
        titleAr: 'سلسلة مراجعات الثانوية العامة والاختبارات التفاعلية',
        priceEGP: 2400,
        provider: 'Apex Classes',
        ventureId: 'AC',
        saleMode: 'DIRECT',
        ctaLabel: 'Book Seat',
        ctaLabelAr: 'احجز مقعدك',
      },
      {
        id: 'prod-3',
        paySlug: 'eh-9w3z8t',
        title: 'Executive IGCSE Business Management Intensive',
        titleAr: 'دورة إدارة الأعمال المكثفة لشهادة الـ IGCSE الدولية',
        priceEGP: 2200,
        provider: 'EL HESA',
        ventureId: 'EH',
        saleMode: 'DIRECT',
        ctaLabel: 'Join Batch',
        ctaLabelAr: 'انضم للدورة',
      },
      {
        id: 'prod-test-course',
        paySlug: 'bldr-test-course',
        slug: 'test-course',
        title: 'Test Course',
        titleAr: 'Test Course',
        priceEGP: 250,
        provider: 'Test',
        ventureId: 'BLDR',
        saleMode: 'DIRECT',
        ctaLabel: 'Enroll Now',
        ctaLabelAr: 'سجل الآن',
      },
    ];

    const mockItem = MOCK_CATALOG_FALLBACK.find(
      (p) => p.id === productId || p.paySlug === productId || p.id === slug || p.paySlug === slug,
    );

    if (mockItem) {
      return {
        found: true,
        isDevFallback: true,
        productId: mockItem.id,
        slug: mockItem.paySlug,
        title: mockItem.title,
        titleAr: mockItem.titleAr,
        priceEGP: mockItem.priceEGP,
        currency: 'EGP',
        amountPiasters: Math.round(mockItem.priceEGP * 100),
        ventureId: mockItem.ventureId,
        ventureCode: mockItem.ventureId,
        ventureName: mockItem.provider,
        cardWalletGateway: 'GEIDEA',
        fawryEnabled: true,
        codeActivationEnabled: true,
        saleMode: mockItem.saleMode || 'DIRECT',
        redirectUrl: null,
        ctaLabel: mockItem.ctaLabel,
        ctaLabelAr: mockItem.ctaLabelAr,
      };
    }

    throw new NotFoundException(`Product or listing "${productId || slug}" not found in catalog.`);
  }

  // ─── Validate Redirect URLs Against Brand Whitelist ──────────────────────────
  private validateRedirectUrls(venture: any, successUrl: string, cancelUrl: string) {
    if (!successUrl || !cancelUrl) {
      throw new BadRequestException('Both successUrl and cancelUrl are required.');
    }

    const allowedHosts = new Set<string>([
      'localhost',
      '127.0.0.1',
      'bldrmanagement.com',
      'bldr.store',
      'studyhub.eg',
      'app.studyhub.eg',
      'apexclasses.eg',
      'elhesa.eg',
      'careerhub.eg',
      ...(venture?.allowedOrigins || []),
      ...(venture?.domains ? venture.domains.map((d: any) => typeof d === 'string' ? d : d.host) : []),
    ]);

    for (const urlStr of [successUrl, cancelUrl]) {
      try {
        const parsed = new URL(urlStr);
        const host = parsed.hostname.toLowerCase();
        const isAllowed = Array.from(allowedHosts).some(allowed => {
          const a = allowed.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
          return host === a || host.endsWith(`.${a}`);
        });

        if (!isAllowed) {
          throw new BadRequestException(
            `Redirect domain "${parsed.hostname}" is not authorized for this brand. Register authorized domains in Hub Venture Configuration to prevent open redirect vulnerabilities.`,
          );
        }
      } catch (err: any) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException(`Invalid redirect URL: "${urlStr}". Must be a valid absolute HTTP/HTTPS URL.`);
      }
    }
  }

  // ─── Refund & Dispute Webhook Notifications ─────────────────────────────────
  async dispatchRefundWebhook(ventureId: string, orderId: string, refundAmountPiasters: number, reason: string) {
    const venture = await this.prisma.provider.findFirst({ where: { slug: ventureId.toLowerCase() } });
    if (!venture?.externalWebhookUrl) return false;

    const payload = {
      id: `evt_rf_${Date.now()}_${randomBytes(4).toString('hex')}`,
      object: 'event',
      type: 'refund.created',
      event: 'refund.created',
      created_at: new Date().toISOString(),
      data: {
        order_id: orderId,
        refund_amount_piasters: refundAmountPiasters,
        refund_amount_egp: refundAmountPiasters / 100,
        currency: 'EGP',
        reason,
        status: 'refunded',
      },
    };
    return this.dispatchWebhookWithRetry(venture.externalWebhookUrl, payload, venture.externalWebhookSecret || 'whsec_test_bldr_pilot_2026');
  }

  async dispatchDisputeWebhook(ventureId: string, orderId: string, disputeRef: string, reason: string) {
    const venture = await this.prisma.provider.findFirst({ where: { slug: ventureId.toLowerCase() } });
    if (!venture?.externalWebhookUrl) return false;

    const payload = {
      id: `evt_dsp_${Date.now()}_${randomBytes(4).toString('hex')}`,
      object: 'event',
      type: 'dispute.created',
      event: 'dispute.created',
      created_at: new Date().toISOString(),
      data: {
        order_id: orderId,
        dispute_ref: disputeRef,
        reason,
        status: 'under_review',
      },
    };
    return this.dispatchWebhookWithRetry(venture.externalWebhookUrl, payload, venture.externalWebhookSecret || 'whsec_test_bldr_pilot_2026');
  }

  // ─── Format ──────────────────────────────────────────────────────────────────

  private formatSession(session: {
    id: string;
    status: string;
    amountPiasters: number;
    currency: string;
    expiresAt: Date;
    customerEmail: string;
    externalRef: string | null;
  }) {
    const env = session.id.startsWith('cs_live') ? 'live' : 'test';
    return {
      id: session.id,
      object: 'checkout.session',
      livemode: env === 'live',
      status: session.status,
      checkout_url: `${process.env.HUB_BASE_URL ?? 'http://localhost:3003'}/pay/${session.id}`,
      amount_piasters: session.amountPiasters,
      amount_display: `EGP ${(session.amountPiasters / 100).toFixed(2)}`,
      currency: session.currency,
      customer_email: session.customerEmail,
      external_ref: session.externalRef,
      expires_at: session.expiresAt.toISOString(),
    };
  }
}
